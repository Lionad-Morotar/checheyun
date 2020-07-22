const request = require('request')

const { serverURL, joinAPI } = require('../config')

// TODO utils
function getQuery(name, url) {
  const match = url.match(new RegExp(`${name}=([^&]*)`))

  return match ? match[1] : null
}

async function getWIKISource({ title, block }) {
    return new Promise(resolve => {
        $.axios({
            method: 'get',
            url: `${serverURL}/wiki/source?title=${title}&block=${block}`,
        }).then(data => {
            resolve(data)
        }).catch(error => {
            console.error('[Server Failed] WIKISource')
        }) 
    })
}

async function createPlayList({ title: name, description }) {
    return new Promise(resolve => {
        $.axios({
            method: 'post',
            url: joinAPI(`/playlist/create?name=${name}`)
        }).then(data => {
            resolve(data)
        }).catch(error => {
            console.error('[API Failed] CreatePlayList')
        })
    })
}

module.exports = async function createPlayListFromWIKI (opts = {}) {
    const {
        url,
        title = getQuery('title', url),
        block = getQuery('block', url),
    } = opts

    const source = await getWIKISource({ title, block })
    
    await createPlayList({
        title,
        description: source
    })
}