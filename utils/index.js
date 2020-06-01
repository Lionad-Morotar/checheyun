function getQuery(name, url = window.location.href) {
  const match = url.match(new RegExp(`${name}=([^&]*)`))

  return match ? match[1] : null
}

module.exports = {
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