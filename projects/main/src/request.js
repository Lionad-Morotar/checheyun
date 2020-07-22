const axios = require('axios')

const { APIURL } = require('../config')
const { getCookie } = require('../netease')

const proxyAxios = axios.create({
  timeout: 5000,
  withCredentials: true // 允许携带 cookie
})

const enableRetryOn500 = false
axios.defaults.retry = 1
axios.defaults.retryDelay = 2000

// * for test
// proxyAxios.interceptors.request.use(config => {
//   console.log(config)
//   return config
// })

proxyAxios.interceptors.response.use(
  // 直接返回 data 字段数据
  function (config) {
    return config.data
  }, 
  // 出错时重设 cookie 并重试
  async function axiosRetryInterceptor (err) {
    console.log('[ERR]', err.response.status)

    if (enableRetryOn500 && err.response.status === 500) {
      console.log('[RETRY] Receive 500 and retry with new cookie ...')

      $.axios.cookie = await getCookie()
      
      const config = err.config

      if (!config || !config.retry) return Promise.reject(err)

      config.__retryCount = config.__retryCount || 0

      if (config.__retryCount >= config.retry) {
        return Promise.reject(err)
      }

      config.__retryCount += 1

      await new Promise(resolve => {
        setTimeout(resolve, config.retryDelay || 1)
      })

      return $.axios(config)
    }
  }
)

module.exports = async function getCookieWrapper (...args) {
  const [opts] = args

  // TODO 区分 get post
  // 请求 NeteaseAPI 时需要带上 cookie
  if ((opts.url || '').includes(APIURL)) {
    opts.params = opts.params || {}
    opts.params.cookie = $.axios.cookie || await getCookie()
  }

  return proxyAxios(...args)
}