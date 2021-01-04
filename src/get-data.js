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

        // 可用此参数找到数据库中同 id 的旧版本信息
        oldone: args.ID ? (() => {
            const oldone = { ...args.ID }
            delete oldone._v
            return oldone
        })() : null,
        // 进度函数
        onprogress: _ => _,
        // 数据储存
        dataHold: {}
    }, args)

    Object.assign(opts, {
        // 是否在结束时将 dataHold 自动存入数据库
        autoSave: true,
        // 仅当 dataHold 不为空时保存
        saveWhenDataHold: true,
    }, args.config)

    const api = opts.hasFind
        ? _ => new Promise(resolve => resolve({ body: opts.hasFind }))
        : args.api

    return new Promise(resolve => {

        function callback (ret = opts.dataHold) {
            setTimeout(
                async () => {
                    if (opts.stop) {
                        await opts.stop(opts)
                    } else if (opts.autoSave) {
                        if (opts.saveWhenDataHold && Object.keys(opts.dataHold) === 0) return
                        const { collection, oldone } = opts
                        await new Promise((resolve, reject) => {
                            collection.deleteMany(oldone, function(err) {
                                if (err) reject(err)
                                collection.insertOne({...opts.oldone, ...opts.dataHold }, function(err) {
                                    if (err) reject(err)
                                    resolve()
                                })
                            })
                        })
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