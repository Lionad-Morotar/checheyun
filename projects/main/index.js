const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')

const routerWiki = require('./router/wiki')
const routerTask = require('./router/task')

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

        const port = process.env.PORT || 3001
        const host = process.env.HOST || 'localhost'

        app.server = app.listen(port, host, () => {
            resolve()
            console.log(chalk.green(`Server running @ http://${host}:${port} (Alt+LeftClick to open)`))
        })
    })
} 

// Program Entry
async function main() {
    // await runNetease()
    // await prepareAgenda([
    //     useErrorHandle,
    //     useRefreshLogin
    // ])
    await runServer()
}
main()