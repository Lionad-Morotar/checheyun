function getQuery(name, url = window.location.href) {
  const match = url.match(new RegExp(`${name}=([^&]*)`))

  return match ? match[1] : null
}

module.exports = {
    parseURL (url) {
        return {
            id: getQuery('id', url)
        }
    }
}