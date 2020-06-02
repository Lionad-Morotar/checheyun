const request = require("../utils/request")

class Netease {
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
  }
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

module.exports = new Netease()
