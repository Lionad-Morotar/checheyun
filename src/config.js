// 最大并发
const maxConcurrenceCount = 5

// 获取每页评论的延迟
const calcPerPageInterval = _ => ~~(350 + Math.random() * 350)

// 数据库 Version 字段对应的所保存的信息的变更记录
const versionType = {

    // 默认类型
    // '0.1' 抓取测试，使用的是 Music-API-Next 库
    // '1.0' 在 Music-API-Next 的基础上修复了分页问题，将抓取的评论字段几乎都保留
    // '1.1' 更换请求逻辑为 NeteaseMusicAPI 库，抓取热评
    song: '1.1', 

    // '0.1' 抓取测试，保存歌曲的元信息（不包含评论）
    'song-meta': '0.1',

    // '0.1' 抓取测试...
    album: '0.1', 

    // '0.1' 抓取测试...
    playlist: '0.1', 

    // '0.1' 抓取歌曲封面
    // '0.2' 保存所有歌曲字段
    'song-cover': '0.2',
}

module.exports = {
    maxConcurrenceCount,
    calcPerPageInterval,
    versionType
}