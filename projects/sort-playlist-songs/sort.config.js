module.exports = {
  playlistID: '5445763637',
  sort: [
    'alia',
    'translate',
    'publishtime',
    'time'
  ],
}

/*

【配置说明】

playlistID：歌单 ID，如 https://music.163.com/#/playlist?id=5445763637 的 ID 为 5445763637
sort：排序方法，可堆叠，优先级从左至右逐渐降低，如 ['albumname-asc', 'name-dec'] 意味先按专辑名由 A-Z 排序，相同专辑的曲子按由 Z-A 排序


【排序字段】

以下列举一些基本的排序参数：

name：歌曲名
translate：歌曲翻译后名称（比如很多《Cannon》后面会跟一个“卡农”）
alia：歌曲别名（歌曲别名和翻译名不是一个东西哦）
albumname：专辑名
time：曲子时长（以秒计）
author：歌手名（注意，歌曲可能会有多作者，目前仅排序第一作者）
publishtime：歌曲发布日期（约等于专辑发布日期）

以下是高级排序参数（慎用，因为还没测好）：

pop：歌曲热度（不确定具体计算规则，可能和播放量相关）


【排序参数】

-asc：正序，按 0-9、A-Z 排序，默认即按此排序
-dec：倒序，按 Z-A、9-0 排序


【其它说明】

排序方法可与排序参数任意组合，如 'name-asc', 'name-dec', 'name'，由于不填写排序参数会自动回退到正序排序，所以 'name' 等同于 'name-asc'

*/