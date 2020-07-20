const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')

const { prepareAgenda } = require('./agenda/index')
const { useErrorHandle } = require('./agenda/error')

// 本地服务器初始化
function runServer() {
    const app = checheyunAPI = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))

    app.use('*', (req, res) => {
        console.log('[REQUEST]', decodeURIComponent(req.originalUrl))
        res.status(200).end()
    })

    const port = process.env.PORT || 3000
    const host = process.env.HOST || ''

    app.server = app.listen(port, host, () => {
        console.log(chalk.green(`Server running @ http://${host ? host : 'localhost'}:${port} (Alt+LeftClick to open)`))
    })

} 

// 入口函数
async function main() {
    await prepareAgenda([
        useErrorHandle,
    ])
    runServer()
}
main()