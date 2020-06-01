const chalk = require('chalk')

const stores = {}

function padEnd(s, len) {
    return String(s).padEnd(len)
}

module.exports = {
    store(key, value) {
        stores[key] = value
    },
    update(key, value) {
         Object.assign(stores[key], value, { logged: false })
    },
    log(config) {
        const { once = true } = config || {}

        Object.values(stores).sort().map(x => {
            if (once && x.logged) return

            switch(x.type) {
                case 'comment':
                    const statusColorMap = {
                        success: 'green'
                    }
                    const statusText = x.status && statusColorMap[x.status] && chalk[statusColorMap[x.status]](x.status)

                    console.log(
                        `[歌曲: ${chalk.cyan(x.id)}]`,
                        `页数: ${chalk.magenta(padEnd(x.page, 4))}`,
                        `总数: ${chalk.magenta(padEnd(x.count, 4))}`,
                        statusText ? `状态: ${statusText}` : ''
                    )
                    break
            }
            x.logged = true
            x.callback && x.callback(stores)
        })
    }
}