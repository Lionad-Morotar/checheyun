const apis = require('../../service')

module.exports = ({ id, ID, query }) => ({
    api: apis.getSongDetail,
    query,
    dataHold: {},
    ondata: ({ data, dataHold }) => {
        dataHold.songs = data.songs.map(song => ({
            ...song
        }))
    },
    stop: async ({ collection, dataHold }) => {
        for await (let item of dataHold.songs) {
            await new Promise(resolve => {
                let oldone = {
                    _id: item.id,
                    type: ID.type,
                    
                }
                let singleID = {
                    ...oldone,
                    _v: ID._v
                }
                collection.deleteMany(oldone, function(err) {
                    if (err) throw err
                    collection.insertOne({...singleID, ...item }, function(err) {
                        if (err) throw err
                        resolve()
                    })
                })
            })
        }
    },
}) 