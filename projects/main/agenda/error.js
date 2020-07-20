const error = require('../src/error')

let times = 0
function errorHandle() {
    if (error.length === 0) {
        if (times++ % 100 === 0) {
            console.log(new Date(), 'No Error Found ~(￣▽￣)~')
        }
    } else {
        console.error(new Date(), 'Error Founded ~(+__+)~')
    }
}

async function useErrorHandle(agenda) {
    agenda.define('warn exists error', errorHandle)

    await agenda.every('10 seconds', 'warn exists error')
}

module.exports = {
    useErrorHandle
}