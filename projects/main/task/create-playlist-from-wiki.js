const request = require('request')

const { serverURL, joinAPI } = require('../config')

// TODO utils
function getQuery(name, url = window.location.href) {
  const match = url.match(new RegExp(`${name}=([^&]*)`))

  return match ? match[1] : null
}

async function getWIKISource({ title, block }) {
    console.log(`${serverURL}/wiki/source?title=${title}&block=${block}`)
    return new Promise(resolve => {
        request.get({
            url: `${serverURL}/wiki/source?title=${title}&block=${block}`
        }, (error, res) => {
            if (error || res.statusCode !== 200) {
                console.error('[Server Failed] GetWIKISource')
                console.error(error)
            } else {
                const data = JSON.parse(res.body)
                resolve(data.data)
            }
        })
    })
}

async function createPlayList({ title: name, description }) {
    console.log(joinAPI(`/playlist/create?name=${name}`))
    return new Promise(resolve => {
        request.post({
            url: joinAPI(`/playlist/create?name=${name}`)
        }, (error, res) => {
            if (error || res.statusCode !== 200) {
                console.error('[API Failed] CreatePlayList')
                console.error(error)
            } else {
                resolve()
            }
        })
    })
}

module.exports = async function createPlayListFromWIKI (opts = {}) {
    const {
        url,
        title = getQuery('title', url),
        block = getQuery('block', url),
    } = opts
    const decodeTitle = decodeURIComponent(title)

    const source = await getWIKISource({ title, block })
    
    await createPlayList({
        title,
        description: source
    })
}