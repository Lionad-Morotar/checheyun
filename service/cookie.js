const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const request = require('../utils/request')

const cookieCacheFilePath = path.join(__dirname, './cookie-cache.txt')

let cookie = {}

// 检查登录状态
async function checkLoginStatus (tempCookie) {
  const data = {}
  let result = await request({
    url: `https://music.163.com/weapi/w/nuser/account/get`,
    data,
    options: {
      crypto: 'weapi',
      cookie: tempCookie || cookie,
    },
  })
  // console.log(result)
  return result.body.code === 200 && result.body.account
}

// 登录函数
async function login (query = {}) {
  cookie.os =  'pc'
  const data = {
    phone: query.phone,
    countrycode: query.countrycode || '86',
    password:
      query.md5_password ||
      crypto.createHash('md5').update(query.password).digest('hex'),
    rememberLogin: 'true',
  }
  let result = await request({
    url: `https://music.163.com/weapi/login/cellphone`,
    data,
    options: {
      crypto: 'weapi',
      ua: 'pc',
      cookie
    },
  })
  if (result.body.code === 200) {
    result = result.cookie
  }
  return result
}

async function ensureCookie() {
  if (Object.keys(cookie).length > 1) return cookie

  /* 读取文件地址登录 */

  const tempCookieText = await fs.readFileSync(cookieCacheFilePath, { encoding: 'utf-8' })
  let tempCookie = null
  try {
    tempCookie = JSON.parse(tempCookieText)
  } catch (parseError) {
    console.log('[Try Login]')
  }
  if (tempCookie) {
    if (await checkLoginStatus(tempCookie)) {
      // console.log('cookie file : ', tempCookie)
      return cookie = tempCookie
    } 
  }

  /* 调用接口登录 */

  // 使用命令行的形式，而不是 Github Secret ？
  const phone = '18216493447'
  const password = 'xxx'
  
  cookie = await checkLoginStatus() 
    ? cookie 
    : (await login({ phone, password }))
      .join('; ')
      .split('; ')
      .reduce((h, c) => {
        const [k, v] = c.split('=')
        h[k] = v
        return h
      }, {})

  // console.log('cookie : ', cookie)
  return cookie
}

module.exports = {
  ensureCookie,
  getCookie: () => cookie
}