const apis = require('../../service')

module.exports = ({ id, ID, query }) => ({
    api: apis.getPlayListDetail,
    query: { id },
    ondata: ({ data, dataHold }) => {
        const isCache = !!data._id
        const handlePlayList = isCache ? data : data.playlist
        Object.assign(dataHold, handlePlayList)
    },
}) 