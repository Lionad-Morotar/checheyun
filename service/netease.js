const request = require("../utils/request")

class Music {
  getComment(query) {
    const data = {
      rid: query.id,
      limit: query.limit || 20,
      offset: query.limit * (query.page - 1) || 0,
      beforeTime: query.lastTime || 0
    }
    return request(
      'POST',
      `https://music.163.com/api/v1/resource/comments/R_SO_4_${query.id}`,
      data,
      { crypto: 'weapi' }
    )
  }
}

module.exports = Music
