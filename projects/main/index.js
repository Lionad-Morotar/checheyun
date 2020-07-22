const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')

const routerWiki = require('./router/wiki')
const routerTask = require('./router/task')
const taskHandle = require('./task')

const { host, port, serverURL } = require('./config')
const { prepareAgenda } = require('./agenda/index')
const { useErrorHandle } = require('./agenda/error')
const { runNetease, useRefreshLogin } = require('./netease')

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

    await taskHandle['create-playlist-from-wiki']({
        url: 'http://localhost:3001/wiki/source?title=%E6%B7%B1%E7%A7%98%E4%B9%90%E6%9B%B2%E9%9B%86/%E8%A1%A5&block=%E6%A6%82%E8%BF%B0'
    })
}
main()