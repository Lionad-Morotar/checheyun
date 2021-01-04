const apis = require('../../service')

let dataHold = {}

module.exports = ({ id, ID, query }) => ({
    api: apis.getSongDetail,
    query: { ids: id },
    ondata: ({ data }) => {
        const [handleSong] = data.songs
        dataHold = { ...handleSong }
    },
    stop: ({ collection, oldone }) => {
        collection.deleteMany(oldone, function(err) {
            if (err) throw err
            collection.insertOne({...ID, ...dataHold }, function(err) {
                if (err) throw err
            })
        })
    },
}) 