const apis = require('../../service')

module.exports = ({ id, ID, query }) => ({
    api: apis.getSongDetail,
    query: { ids: id },
    ondata: ({ data, dataHold }) => {
        const isCache = !!data._id
        const [handleSong] = isCache ? [data] : data.songs
        Object.assign(dataHold, handleSong)
    }
}) 