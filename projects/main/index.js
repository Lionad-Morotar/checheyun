const { prepareAgenda } = require('./agenda/index')
const { useErrorHandle } = require('./agenda/error')

async function main() {
    // 初始化任务调度工具
    await prepareAgenda([
        useErrorHandle,
    ])
}

main()