const { prepareAgenda } = require('./agenda/index')
const { useErrorHandle } = require('./agenda/error')

async function main() {
    await prepareAgenda([
        useErrorHandle,
    ])
}

main()