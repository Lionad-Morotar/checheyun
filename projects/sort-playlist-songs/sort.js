/* 基础函数 */

const calcTypeEnum = {
  dict: (a, b) => String(a) === String(b) ? 0 : (String(a) < String(b) ? -1 : 1),
  number: (a, b) => +a - +b,
  bool: (a, b) => +a === +b ? 0 : (+a < +b ? -1 : 1)
}

function Sort (fn) {
  this.compare = null
  this.pipeline = []
  fn && this.map(fn)
}
Sort.prototype.map = function (fn) {
  this.pipeline.push({
    _type: 'map',
    _value: fn
  })
  return this
}
Sort.prototype.plugin = function (fn) {
  this.pipeline.push({
    _type: 'plugin',
    _value: fn
  })
  return this
}
Sort.prototype.sortby = function (fn) {
  this.compare = calcTypeEnum[fn] || fn
  return this
}
Sort.prototype.seal = function () {
  
  // console.log(this.pipeline)

  this.compare = this.compare || calcTypeEnum.dict

  const pass = piped => (...args) => piped(...args)
  const plugin = plug => piped => (...args) => plug(piped(...args))
  const mapping = map => piped => (...args) => piped(...args.map(x => map(x)))

  // return this.pipeline[1]._value(mapping(this.pipeline[0]._value)(this.pipeline[2]._value))

  return this.pipeline.reduce((last, piped) => {
    const { _type: type, _value: value } = piped
    switch (type) {
      case 'map':
        return mapping(last(value))
      case 'plugin':
        return plugin(value)(last)
    }
  }, pass)(this.compare)
}

const pass = piped => (...args) => piped(...args)
const plugins = {
  asc:
    sort => sort.plugin(pass),
  dec:
    sort => sort.plugin(last => (...args) => -last(...args)),
  is: 
    (sort, args) => sort.map(x => x === args).sortby('bool'),
  has:
    (sort, args) => sort.map(x => x.includes(args)).sortby('bool'),
  name: 
    sort => sort.map(x => x.name),
  translate: 
    sort => sort.map(x => ((x.tns && x.tns[0]) ? x.tns[0] : '')),
  alia: 
    sort => sort.map(x => ((x.alia && x.alia[0]) ? x.alia[0] : '')),
  time: 
    sort => sort.map(x => x.dt),
  author: 
    sort => sort.map(x => x.ar[0].name),
  albumname: 
    sort => sort.map(x => x.al.name),
  albumauthor: 
    sort => sort.map(x => (x.al.artists && x.al.artists.length && x.al.artists.map(x => x.name).join(',') || (x.al.artist && x.al.artist.name || ''))),
  publishtime: 
    sort => sort.map(x => (+x.publishTime / 1000).toFixed(0)),
  albumpubtime: 
    sort => sort.map(x => (+x.al.publishTime / 1000).toFixed(0)),
  albumsongs: 
    sort => sort.map(x => x.al.songs.findIndex(s => s.id === x.id)),
  pop: 
    sort => sort.map(x => x.pop),
}

// 从字符串得到排序方法
function getSortFn(s) {
  try {
    let [...actions] = s.split('-')
    actions = actions.filter(x => x)
      .map(x => {
        const [all, name, argsWithQuote, args] = x.match(/([^(]+)(\(([^)]*)\))?/)
        return [name, args]
      })
    const sort = new Sort()
    actions.map(action => {
      // TODO if (action instanceof Function)
      const [name, args] = action
      // TODO 'a.b.c'
      const plugin = plugins[name]
      plugin(sort, args)
    })
    return sort.seal()
  } catch (error) {
    throw new Error('[Config Error] 排序配置解析错误：' + error)
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

  const fns = (configSort instanceof Array ? configSort : [configSort])
  const sortFns = fns.map(x => getSortFn(x))

  const flat = (...fns) => (a, b) => fns.reduce((sortResult, fn) => sortResult || fn(a, b), 0)
  return flat(...sortFns)
}