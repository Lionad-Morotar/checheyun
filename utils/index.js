function getQuery(name, url = window.location.href) {
  const match = url.match(new RegExp(`${name}=([^&]*)`))

  return match ? match[1] : null
}

/**
 * 递归删除 Object 中 值为 Null 的键（和 Null 数组元素）
 * @param {Object} obj 
 */
function washObj(obj) {
  const isObj = x => x instanceof Object && x !== null
  const washKey = x => isObj(x) ? washObj(x) : x
  return obj instanceof Array
    ? obj.filter(x => x).map(x => washKey(x))
    : (Object.keys(obj).map(k => {
        obj[k] === null
          ? delete obj[k]
          : (obj[k] = washKey(obj[k]))
    }), obj)
}

module.exports = {
    washObj,
    judgeURLType (url) {
        const typeReg = {
            song: url => url.indexOf('https://music.163.com/#/song') !== -1,
            album: url => url.indexOf('https://music.163.com/#/playlist') !== -1,
        }
        const findType = Object.keys(typeReg).find(k => typeReg[k](url))
        return findType
    },
    parseURL (url) {
        return {
            id: getQuery('id', url)
        }
    }
}