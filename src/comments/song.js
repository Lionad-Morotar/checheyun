const musicAPI = require("../../service")
const utils = require('../../utils')
const globalConfig = require('./config')

function startSongCrawler({
    _config,
    url,
    onprogress = _ => _,
    callback,
}) {
    let curPage = 1
    const { collection, logger, force } = _config
    const { id } = utils.parseURL(url)
    const ID = {
        _id: id,
        _v: globalConfig.version
    }

    // 如果找到数据的数据版本相同则不再更新
    force 
        ? crawl()
        : collection.find(ID).toArray(function(err, res) {
            if (err) throw err
            if (res.length) {
                callback()
            } else {
                crawl()
            }
        })

    function crawl() {
        const commentsCon = []
        const task = {
            run () {
                musicAPI
                    .getComment({
                        ...globalConfig.searchConfig,
                        id,
                        page: curPage++,
                        lastTime: commentsCon.length === 0 ? 0 : commentsCon[commentsCon.length - 1]._time
                    })
                    .then(({results: comments}) => {
                        commentsCon.push(...comments.map(x => utils.washObj(x)))
                        if (comments.length !== 0) {
                            logger.store(id, {
                                type: 'comment',
                                id,
                                page: curPage - 1,
                                count: commentsCon.length
                            })
                            onprogress()
                            task.continue()
                        } else {
                            logger.update(id, {
                                id,
                                status: 'success',
                                callback: stores => delete stores[id]
                            })
                            onprogress()
                            task.stop()
                        }
                    })
                    .catch(error => {
                        throw error
                    })
            },
            continue() {
                setTimeout(() => task.run(), globalConfig.calcPerPageInterval())
            },
            stop() {
                let oldone = { ...ID }
                delete oldone._v
                collection.deleteMany(oldone, function(err) {
                    if (err) throw err
                    collection.insertOne({...ID, comments: commentsCon }, function(err) {
                        if (err) throw err
                        callback()
                    })
                })
            }
        }
        task.run()
    }
}

module.exports = {
    run: startSongCrawler
}