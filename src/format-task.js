const utils = require('../utils')

module.exports = function formatTask(s) {
    if (typeof s === 'string') {
        return {
            type: utils.judgeURLType(s),
            url: s
        }
    } else if (typeof s === 'object') {
        if (!s.url) {
            throw new Error('Param error, no url passed')
        }
        return Object.assign({
            type: utils.judgeURLType(s.url)
        }, s)
    } else {
        throw new TypeError('Param error')
    }
}