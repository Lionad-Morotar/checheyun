const apis = require('../../service')

module.exports = ({ id, ID, query }) => ({
    api: apis.getPlayListDetail,
    query: { id },
    ondata: ({ data, dataHold }) => {
        const playlist = data.playlist
        dataHold.trackIds = playlist.trackIds
    },
}) 