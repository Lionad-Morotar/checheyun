const fs = require('fs')
const path = require('path')

const taskHandle = {}

fs.readdirSync(__dirname).forEach(file => {
    const valid = file.endsWith('.js') && !file.startsWith('index')
    if (!valid) return

    const taskname = file.replace(/\.js$/i, '')

    taskHandle[taskname] = require(path.join(__dirname, file))
})

module.exports = taskHandle