/* 基础函数 */

const sort = map => compareFn => (a, b) => compareFn(map(a), map(b))
const byDisc = (a, b) => String(a) === String(b) ? 0 : (String(a) < String(b) ? -1 : 1)
const byNumber = (a, b) => +a - +b
const flip = fn => (a, b) => -fn(a, b)
const flat = (...fns) => (a, b) => fns.reduce((sortResult, fn) => sortResult || fn(a, b), 0)

/* 向外暴露的业务层排序函数 */

const sortMethods = {
  name: sort(x => x.name)(byDisc),
  translate: sort(x => ((x.tns && x.tns[0]) ? x.tns[0] : ''))(byDisc),
  alia: sort(x => ((x.alia && x.alia[0]) ? x.alia[0] : ''))(byDisc),
  albumname: sort(x => x.al.name)(byDisc),
  time: sort(x => x.dt)(byNumber),
  author: sort(x => x.ar[0].name)(byDisc),
  albumauthor: sort(x => (x.al && x.al.artist && x.al.artist.name || ''))(byDisc),
  // 专辑内曲子的发布时间可能会有偏差，这里做估算，同专辑发布时间
  publishtime: sort(x => (+x.publishTime / 1000).toFixed(0))(byNumber),
  albumpubtime: sort(x => (+x.al.publishTime / 1000).toFixed(0))(byNumber),
  albumsongs: sort(x => x.al.songs.findIndex(s => s.id === x.id))(byNumber),
  pop: sort(x => x.pop)(byNumber)
}

const flipType = { asc: 0, dec: 1 }

// 从配置字符串得到排序方法
function getSortFn(s) {
  try {
    const [key, ascType = 'asc'] = s.split('-')
    const flipCompare = flipType[ascType]
    const sortFn = sortMethods[key]
    return flipCompare ? flip(sortFn) : sortFn
  } catch (error) {
    throw new Error('[Config Error] 排序配置解析错误', error)
  }
}

/**
 * 初始化函数
 * @param {object} config 配置文件是从文件读取的，见 .sort.config.js
 * @returns {function} sortFn 排序方法，用作数组 sort API 参数
 */
module.exports = function init(config) {
  const { sort: configSort = [] } = config
  if (!configSort || configSort.length === 0) throw new Error('[Config Error] 请在配置文件内填写排序方法')
  const sortFns = (configSort instanceof Array ? configSort : [configSort]).map(x => getSortFn(x))

  return flat(...sortFns)
}