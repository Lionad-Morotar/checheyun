const apis = require('../../service')
const utils = require('../../utils')

module.exports = ({ id, ID }) => ({
    api: apis.getPlayListDetail,
    query: { id },
    ondata: ({ instance, data, dataHold }) => {
        Object.assign(dataHold, utils.filterNull(data))
        const trackIds = dataHold.playlist && dataHold.playlist.trackIds || []
        instance.addTask(
            trackIds.map(x => ({
                type: 'song',
                url: `https://music.163.com/#/song?id=${x.id}`
            })),
            ({ collection, dataHold }) => {
                let oldone = { ...ID }
                delete oldone._v
                collection.deleteMany(oldone, function(err) {
                    if (err) throw err
                    collection.insertOne({...ID, ...dataHold }, function(err) {
                        if (err) throw err
                    })
                })
            }
        )
    },
    onprogress: ({ progress, query, logger, dataHold }) => {
        const trackIds = dataHold.playlist && dataHold.playlist.trackIds || []
        progress === 'done'
            && logger.store(query.id, {
                    id: query.id,
                    type: 'album',
                    status: 'success',
                    count: trackIds.length,
                })
        logger.printNew()
    },
})