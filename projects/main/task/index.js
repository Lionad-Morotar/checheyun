const fs = require('fs')
const path = require('path')

const taskHandle = {}

fs.readdirSync(__dirname).forEach(file => {
    const valid = file.endsWith('.js') && !file.startsWith('index')
    if (!valid) return

    const taskname = file.replace(/\.js$/i, '')

    const rawTaskHandle = require(path.join(__dirname, file))
    taskHandle[taskname] = async (...args) => {
        console.log('[TASK-BEGIN]', taskname)
        await rawTaskHandle(...args)
        console.log('[TASK-DONE]', taskname)
    }
})

module.exports = taskHandle