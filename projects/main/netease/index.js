const { APIURL, joinAPI } = require('../config')
const { mobile, password } = require('./secret')

// 检测网易云API项目是否已经启动
async function detectAPIService() {
    return new Promise(resolve => {
        $.axios({ url: APIURL })
            .then(resolve)
            .catch(error => {
                console.log(error)
                throw new Error('[ERR] NeteaseCloudMusicAPI service not found')
            })
    })
}

// 登录接口
async function login() {
    return await new Promise(resolve => {
        $.axios({ url: joinAPI(`/login/cellphone?phone=${mobile}&password=${password}`) })
            .then(resolve)
            .catch(error => {
                throw new Error('[ERR] Login failed')
            }) 
    })
}

async function getCookie () {
    const loginData = await login()
    console.log('===\n', loginData.cookie, '\n===')
    return loginData.cookie
}

// 定时刷新登录状态
async function useRefreshLogin (agenda) {
    agenda.define('refresh login state', () => $.axios.cookie && $.axios.post(joinAPI('/login/refresh')))
    await agenda.every('30 minutes', 'refresh login state')
}

// 启动网易云相关服务
async function runNetease() {
    try {
        await detectAPIService()
    } catch (err) {
        console.error(err)
        throw new Error('[ERR] Netease Service Down')
    }
}

module.exports = {
    runNetease,
    useRefreshLogin,
    getCookie,
}