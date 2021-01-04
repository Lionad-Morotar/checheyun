const apis = require('../../service')

module.exports = ({ id, ID, query }) => ({
    api: apis.getSongDetail,
    query: { ids: id },
    ondata: ({ data, dataHold }) => {
        const isCache = !!data._id
        const [handleSong] = isCache ? [data] : data.songs
        Object.assign(dataHold, handleSong)
    },
    stop: ({ collection, oldone, dataHold }) => {
        collection.deleteMany(oldone, function(err) {
            if (err) throw err
            collection.insertOne({...ID, ...dataHold }, function(err) {
                if (err) throw err
            })
        })
    },
}) 