// 支持传入 URL 对应的解析类型
const validCrawType = ['album', 'song']

// 最大并发
const maxConcurrenceCount = 5

// 获取每页评论的延迟
const calcPerPageInterval = _ => ~~(1000 + Math.random() * 2000)

const versionsMap = [
    '0.1', // 抓取测试，使用的是 Music-API-Next 库
    '1.0', // 在 Music-API-Next 的基础上修复了一些问题，将抓取的评论字段几乎都保留
]

module.exports = {
    validCrawType,
    isValidCrawType: type => validCrawType.includes(type),
    maxConcurrenceCount,
    calcPerPageInterval,

    searchConfig: {
        vendor: 'netease',
        limit: 20,
    },
    version: versionsMap[versionsMap.length - 1]
}