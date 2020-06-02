const request = require("request")
const moment = require("moment")
const querystring = require("querystring")
const { asrsea } = require("../utils/crypto")

class Music {
  constructor() {
    this.e = "010001"
    this.f = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7"
    this.g = "0CoJUm6Qyw8W8jud"
  }
  getComment(querys) {
    const { id, page, limit, lastTime } = querys
    let url = "https://music.163.com/weapi/v1/resource/comments/R_SO_4_" + id
    let form = {
      rid: "R_SO_4_" + id,
      offset: limit * (page - 1),
      total: true,
      limit,
      beforeTime: lastTime || 0,
      csrf_token: ""
    }
    let { encText, encSecKey } = asrsea(
      JSON.stringify(form),
      this.e,
      this.f,
      this.g
    )
    let options = {
      url,
      method: "POST",
      body: querystring.stringify({ params: encText, encSecKey: encSecKey }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
    let promise = new Promise(resolve => {
      request(options, (err, res, body) => {
        if (err) {
          return resolve({ success: false, msg: err.message })
        }
        try {
          let data = JSON.parse(body)
          resolve({
            success: true,
            results: (data.comments || []).map(item => {
              return {
                ...item,
                _time: item.time,
                time: moment(item.time).format("YYYY-MM-DD H:mm:ss"),
              }
            })
          })
        } catch (error) {
          resolve({ success: false, msg: error.message })
        }
      })
    })
    return promise
  }
}

module.exports = Music
