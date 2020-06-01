const musicAPI = require("music-api-next")
const utils = require('../../utils')
const globalConfig = require('./config')

function startSongCrawler({
    _config,
    url,
    callback
}) {
    let curPage = 1
    const { collection, force } = _config
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
                        id: "1399646264",
                        page: curPage++,
                    })
                    .then(({results: comments}) => {
                        commentsCon.push(...comments)
                        comments.length !== 0
                            ? task.continue()
                            : task.stop()
                    })
                    .catch(error => {
                        throw error
                    })
            },
            continue() {
                console.log(curPage - 1, commentsCon.length)
                setTimeout(() => task.run(), globalConfig.perPageInterval)
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