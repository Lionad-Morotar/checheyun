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
                    console.log(
                        `[${chalk.cyan(x.id)}]`,
                        chalk.magenta(padEnd(x.page, 4)),
                        chalk.magenta(padEnd(x.count, 4)),
                        x.status ? x.status : ''
                    )
                    break
            }
            x.logged = true
            x.callback && x.callback(stores)
        })
    }
}