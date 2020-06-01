// 支持传入 URL 对应的解析类型
const validCrawType = ['album', 'song']

// 最大并发
const maxConcurrenceCount = 5

// 获取每页评论的延迟
const perPageInterval = 2000

module.exports = {
    isValidCrawType: type => validCrawType.includes(type),
    maxConcurrenceCount,
    perPageInterval,

    searchConfig: {
        vendor: 'netease',
        limit: 20,
    },
    version: '0.1'
}