const request = require("../utils/request")

module.exports = {

  getComment(query) {
    const data = {
      rid: query.id,
      limit: query.limit || 20,
      offset: query.limit * (query.page - 1) || 0,
      beforeTime: query.lastTime || 0
    }
    return request({
      url: `https://music.163.com/api/v1/resource/comments/R_SO_4_${query.id}`,
      data,
      options: { crypto: 'weapi' }
    })
  },

  getSongDetail(query) {
    query.ids = query.ids.split(/\s*,\s*/)
    const data = {
      c: '[' + query.ids.map(id => ('{"id":' + id + '}')).join(',') + ']',
      ids: '[' + query.ids.join(',') + ']'
    }
    return request({
      url: 'https://music.163.com/weapi/v3/song/detail',
      data,
      options: { crypto: 'weapi' }
    })
  },

  getPlayListDetail(query) {
    const data = {
      id: query.id,
      n: 100000,
      s: query.s || 8
    }
    return request({
      url: `https://music.163.com/weapi/v3/playlist/detail`, 
      data,
      options: { crypto: 'linuxapi' }
    })
  }
  
}