const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')

const routerWiki = require('./router/wiki')
const routerTask = require('./router/task')
// const taskHandle = require('./task')
const axios = require('./src/request')
const { host, port, serverURL, joinAPI } = require('./config')
const { prepareAgenda } = require('./agenda/index')
const { useErrorHandle } = require('./agenda/error')
const { runNetease, useRefreshLogin } = require('./netease')

global.$ = global
$.axios = axios
$.axios.cookie = 'MUSIC_U=705353482362c070643e4e54fca22ec84157c7213b481e97245300bca61e48d033a649814e309366; Expires=Thu, 06-Aug-2020 13:20:43 GMT; Path=/;__remember_me=true; Expires=Thu, 06-Aug-2020 13:20:43 GMT; Path=/;__csrf=3631f2a96aac03a23038816df4eecadf; Expires=Thu, 06-Aug-2020 13:20:53 GMT; Path=/'

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