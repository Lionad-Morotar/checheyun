const http = require('http')

const { mobile, password } = require('./secret')

/** CONFIG & UTILS */
const APIURL = `http://localhost:3000`
const URL = url => APIURL + url

// 检测网易云API项目是否已经启动
async function detectAPIService() {
    return new Promise(resolve => {
        http.get(APIURL, res => {
            const { statusCode } = res
            if (statusCode === 200) {
                resolve()
            } else {
                throw new Error('NeteaseCloudMusicAPI service not found')
            }
        })
    })
}

// 登录接口
async function login() {
    await new Promise(resolve => {
        http.get(URL(`/login/cellphone?phone=${mobile}&password=${password}`), res => {
            const { statusCode } = res
            if (statusCode === 200) {
                resolve()
            } else {
                throw new Error('Login failed')
            }
        })
    })
}

// 定时刷新登录状态
async function useRefreshLogin (agenda) {
    agenda.define('refresh login state', () => http.get(URL('/login/refresh')))
    await agenda.every('30 minutes', 'refresh login state')
}

// 启动网易云相关服务
async function runNetease() {
    try {
        await detectAPIService()
        await login()
    } catch (err) {
        console.error(err)
        throw new Error('Netease Service Down')
    }
}

module.exports = {
    runNetease,
    useRefreshLogin,
}