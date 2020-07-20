let times = 0
const container = []

function errorHandle() {
    if (container.length === 0) {
        if (times++ % 100 === 0) {
            console.log(new Date(), 'No Error Found (￣▽￣)"')
        }
    } else {
        console.error(new Date(), 'Error Founded (+_+)')
    }
}

async function useErrorHandle(agenda) {
    agenda.define('warn exists error', errorHandle)

    await agenda.every('10 seconds', 'warn exists error')
}

module.exports = {
    useErrorHandle
}