const utils = require('../utils')

module.exports = function formatTask(s) {
    if (s && s._noformat) {
        return s
    }
    if (typeof s === 'string') {
        return {
            type: utils.judgeURLType(s),
            url: s
        }
    } else if (typeof s === 'object') {
        return Object.assign({
            type: utils.judgeURLType(s.url)
        }, s)
    } else {
        throw new TypeError('Param error')
    }
}