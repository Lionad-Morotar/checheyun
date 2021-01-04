const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')

const routerWiki = require('./router/wiki')
const routerTask = require('./router/task')
// const taskHandle = require('./task')
const utils = require('./src')
const axios = require('./src/request')
const { host, port, serverURL, joinAPI } = require('./config')
const { prepareAgenda } = require('./agenda/index')
const { useErrorHandle } = require('./agenda/error')
const { runNetease, useRefreshLogin } = require('./netease')

global.$ = global
$.axios = axios
$.axios.cookie = require('./cookie')
$.suspend = utils.suspend

// Init Express Server
function runServer() {
    return new Promise(resolve => {
        const app = checheyunAPI = express()
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: false}))

        app.use('*', (req, res, next) => {
            console.log('[REQUEST IN]', decodeURIComponent(req.originalUrl))
            next()
        })
        app.use(routerTask)
        app.use(routerWiki)

        app.use('*', (req, res) => {
            res.status(404).end()
        })

        app.server = app.listen(port, host, () => {
            resolve()
            console.log(chalk.green(`Server running @ ${serverURL} (Alt+LeftClick to open)`))
        })
    })
} 

// Program Entry
async function main() {
    await runNetease()
    await prepareAgenda([
        useErrorHandle,
        useRefreshLogin
    ])
    await runServer()
}

console.log(`\n☢`, new Date(), `\n`)
main()