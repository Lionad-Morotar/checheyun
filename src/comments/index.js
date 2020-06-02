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

    // 剩余可执行并发任务数量
    const canCrawNewLen = _ => Math.min(globalConfig.maxConcurrenceCount - config.crawingList.length, config.unCrawList.length)
    
    return new Promise(resolve => {

        /** 填充任务队列 */
        function crawlNew() {
            let i = canCrawNewLen()
            while (i-- > 0) {
                const item = config.unCrawList.pop()
                config.crawingList.push(crawl(item))
            }
        }

        /* 抓取函数 */
        function crawl(item) {
            const { type, url } = item
            let crawler = null
            
            switch (type) {
                case 'album':
                    crawler = require('./album')
                    break
                case 'song':
                    crawler = require('./song')
                    break
            }

            function deleteFromList() {
                config.crawingList.splice(
                    config.crawingList.findIndex(x => x.type === type && x.url === url),
                    1
                )
            }
            const cbpools = []
            function checkStop(cb) {
                cbpools.push(cb)
                if (config.crawingList.length === 0 && config.unCrawList.length === 0) {
                    Promise.all(cbpools)
                        .then(() => resolve())
                        .catch(error => { throw error })
                }
            }

            try {
                crawler.run({
                    _config: config,
                    type,
                    url,
                    onprogress: () => logger.log(),
                    callback: cb => {
                        deleteFromList()
                        checkStop(cb)
                        setTimeout(() => canCrawNewLen() && crawlNew(), globalConfig.calcPerPageInterval())
                    }
                })
            } catch (error) {
                throw error
            }

            return { type, url }
        }
        
        /** 填充任务初始队列 */
        canCrawNewLen()
            ? crawlNew()
            : resolve()
    })
}

