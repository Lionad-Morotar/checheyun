const apis = require('../../service')

module.exports = ({ id, ID, query }) => ({
  api: apis.getAlbumContent,
  query: { id },
  ondata: ({ data, dataHold }) => {
    const isCache = !!data._id
    let info = {}
    if (isCache) {
      info = data
    } else {
      data.album.songs = data.songs
      delete data.songs
      info = data.album
    }
    delete info.type
    Object.assign(dataHold, info)
  }
}) 