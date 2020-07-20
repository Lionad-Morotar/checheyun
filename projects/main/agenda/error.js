const container = []

function errorHandle() {
    if (container.length === 0) {
        console.log(new Date(), 'No Error')
    } else {
        console.error(new Date(), 'Has Error')
    }
}

async function useErrorHandle(agenda) {
    agenda.define('warn exists error', errorHandle)

    await agenda.every('10 seconds', 'warn exists error')
}

module.exports = {
    useErrorHandle
}