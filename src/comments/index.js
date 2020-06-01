const globalConfig = require('./config')
const logger = require('../logger')
const utils = require('../../utils')

module.exports = function crawler(arg) {
    /* 参数合并 */
    config = {
        list: [],
        unCrawList: [],
        crawingList: [],
        force: false,
        valid: _ => false,
        logger,
    }
    if (arg instanceof Array) {
        config.list = arg
    } else {
        Object.assign(config, arg)
    }
    if (!config.collection) {
        throw new TypeError('Param collection must be MongoDBCollection')
    }

    /* 清洗待抓取列表 */
    config.list.map(x => {
        const item = x instanceof Object ? x : { url: x  }
        const { type = utils.judgeURLType(item.url), url } = item
        if (!url) {
            throw new TypeError('Param url should be String')
        }
        if (!globalConfig.isValidCrawType(type)) {
            throw new TypeError('Param type should be valid Enums : ' + String(globalConfig.validCrawType))
        }

        const shouldSkip = config.valid({ type, url })
        !shouldSkip && config.unCrawList.push({ type, url })
    })

    /* 抓取函数 */
    function craw(item) {
        const { type, url } = item
        let crawler = null
        
        switch (type) {
            case 'album':
                crawler = require('./album')
            case 'song':
                crawler = require('./song')
        }

        function deleteFromList() {
            config.crawingList.splice(
                config.crawingList.findIndex(x => x.type === type && x.url === url),
                1
            )
        }

        try {
            crawler.run({
                _config: config,
                type,
                url,
                callback: deleteFromList
            })
        } catch (error) {
            throw error
        }

        return { type, url }
    }
    
    return new Promise(resolve => {
        /* 抓取列表 */
        const task = {
            stop: false,
            checkStop(extraValid) {
                task.stop = extraValid && (config.crawingList.length === 0 && config.unCrawList.length === 0)
                if (task.stop) {
                    resolve()
                }
            },
            run () {
                if (task.stop) return
                
                const crawNext = Math.min(globalConfig.maxConcurrenceCount - config.crawingList.length, config.unCrawList.length)
                if (crawNext > 0) {
                    let i = crawNext
                    while (i-- > 0) {
                        const item = config.unCrawList.pop()
                        config.crawingList.push(craw(item))
                    }
                }
                task.checkStop(!crawNext)

                setTimeout(() => {
                    logger.log()
                    task.run()
                }, 300)
            }
        }
        task.run()
    })
}

