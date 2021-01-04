const globalConfig = require('./config')

function getData(args = {}) {
    const opts = Object.assign({
        // config,
        // api,
        // query,
        // ondata,
        // step,
        // stop,
        // logger,
        // collection,
        // callback,
        
        // 进度函数
        onprogress: _ => _,
        // 数据储存
        dataHold: {},
        // 可用此参数找到数据库中同 id 的旧版本信息
        oldone: args.ID ? (() => {
            const oldone = { ...args.ID }
            delete oldone._v
        })() : null
    }, args)

    const api = opts.hasFind
        ? _ => new Promise(resolve => resolve({ body: opts.hasFind }))
        : args.api

    return new Promise(resolve => {

        function callback (ret = opts.dataHold) {
            setTimeout(
                async () => {
                    if (opts.stop) {
                        await opts.stop(opts)
                    }
                    resolve({
                        ...opts,
                        result: ret,
                    })
                }, 
                globalConfig.calcPerPageInterval()
            )
        }

        function getOne() {
            opts.skip
                ? resolve({
                    ...opts,
                    result: opts.hasFind
                })
                : api(opts.query)
                    .then(data => {
                        if (!data.body) {
                            throw new Error('Recieve wrong data, has not data.body')
                        }

                        opts.data = data.body
                        opts.ondata(opts)


                        const doNext = opts.step && opts.step(opts)
                        if (doNext) {
                            opts.onprogress({ progress: 'step', ...opts })
                            setTimeout(
                                () => getOne(), 
                                globalConfig.calcPerPageInterval()
                            )
                        } else {
                            opts.onprogress({ progress: 'done', ...opts })
                            callback()
                        }
                    })
                    .catch(error => {
                        throw error
                    })
        }
        getOne()
    })
}

module.exports = getData