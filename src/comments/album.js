const moment = require("moment")
const musicAPI = require("../../service")
const utils = require('../../utils')
const globalConfig = require('./config')

function startAlbumCrawler({
    _config,
    type,
    url,
    onprogress = _ => _,
    callback,
}) {
    const { collection, logger, force } = _config
    const { id } = utils.parseURL(url)
    const ID = {
        _id: id,
        _v: globalConfig.version[type],
        type,
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
        musicAPI
            .getPlayListDetail({ id })
            .then(data => {
                const details = utils.washObj(data.body)
                const trackIds = details.playlist && details.playlist.trackIds || []

                // 进度提示
                onprogress(logger.store(id, {
                    type: 'album',
                    id,
                    count: trackIds.length,
                    status: 'success'
                }))

                // 歌单解析完毕后，开始抓取歌曲
                function addSongsCrawler() {
                    trackIds.map(x => {
                        _config.unCrawList.push({
                            type: 'song',
                            url: `https://music.163.com/#/song?id=${x.id}`
                        })
                    })
                    callback(saveDocument)
                }
                addSongsCrawler()

                // TODO: 机制 refactor
                // 歌曲解析完毕之后自动保存
                function saveDocument() {
                    let oldone = { ...ID }
                    delete oldone._v
                    collection.deleteMany(oldone, function(err) {
                        if (err) throw err
                        collection.insertOne({...ID, ...details }, function(err) {
                            if (err) throw err
                            
                        })
                    })
                }
            })
            .catch(error => {
                throw error
            })
    }
}

module.exports = {
    run: startAlbumCrawler
}