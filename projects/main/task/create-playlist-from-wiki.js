const { serverURL, joinAPI } = require('../config')

// TODO utils
function getQuery(name, url) {
  const match = url.match(new RegExp(`${name}=([^&]*)`))

  return match ? match[1] : null
}

// 从 WIKI 获取专辑信息
async function getWIKISource({ title, block }) {
    return new Promise(resolve => {
        $.axios({
            method: 'get',
            url: `${serverURL}/wiki/source?title=${title}&block=${block}`,
        }).then(data => {
            resolve(data.data)
        }).catch(error => {
            console.error('[Server Failed] WIKISource')
        }) 
    })
}

// 搜索歌单是否在网易云存在
async function searchAlbum({ title }) {
    const searchType = { album : '10' }
    return new Promise(resolve => {
        $.axios({
            method: 'get',
            url: joinAPI(`/search?keywords=${title}&type=${searchType.album}`)
        }).then(data => {
            const res = data.result || { albums: [], albumCount: 0 }
            resolve(res)
        }).catch(error => {
            console.error('[API Failed] searchAlbum')
        })
    })
}

// 获取专辑内容
async function getAlbumInfo({ id }) {
    return new Promise(resolve => {
        $.axios({
            method: 'post',
            url: joinAPI(`/album?id=${id}`)
        }).then(data => {
            const res = data.songs || []
            resolve(res)
        }).catch(error => {
            console.error('[API Failed] GetAulbumInfo')
        })
    })
}

// 创建歌单
async function createPlayList({ title: name, description }) {
    return new Promise(resolve => {
        $.axios({
            method: 'post',
            url: joinAPI(`/playlist/create?name=${name}`)
        }).then(data => {
            resolve(data.id)
        }).catch(error => {
            console.error('[API Failed] createPlayList')
        })
    })
}

// 添加歌曲到歌单
async function addSongsToPlayList({ id, ids }) {
    return new Promise(resolve => {
        $.axios({
            method: 'post',
            url: joinAPI(`/playlist/tracks?op=add&pid=${id}&tracks=${ids}`)
        }).then(data => {
            resolve(data)
        }).catch(error => {
            console.error('[API Failed] AddSongsToPlayList')
        })
    })
}

// 更新歌单描述
async function updatePlayListDescription({ id, des }) {
    return new Promise(resolve => {
        $.axios({
            method: 'post',
            url: joinAPI(`/playlist/desc/update?id=${id}&desc=${des}`)
        }).then(data => {
            resolve(data)
        }).catch(error => {
            console.error('[API Failed] UpdatePlayListDescription')
        })
    })
}

// 更新歌单标签
async function updatePlayListTag({ id, tags }) {
    return new Promise(resolve => {
        $.axios({
            method: 'post',
            url: joinAPI(`/playlist/tags/update?id=${id}&tags=${tags}`)
        }).then(data => {
            resolve(data)
        }).catch(error => {
            console.error('[API Failed] UpdatePlayListTag')
        })
    })
}

// 评论歌单
async function commentPlayList({ id, content }) {
    const commentType = { album: 2 }
    return new Promise(resolve => {
        $.axios({
            method: 'post',
            url: joinAPI(`/comment?t=1&type=${commentType.album}&id=${id}&content=${content}`)
        }).then(data => {
            resolve(data)
        }).catch(error => {
            console.error('[API Failed] CommentPlayList')
        })
    })
}

// TODO task controller
module.exports = async function createPlayListFromWIKI (opts = {}) {
    const {
        url,
        title = getQuery('title', url),
        block = getQuery('block', url),
        tags = [],
        comments = []
    } = opts
    const decodeTitle = decodeURIComponent(title || '')

    const source = await getWIKISource({ title, block })
    
    const searchAlbumInfo = await searchAlbum({ title })
    if (searchAlbumInfo.albumCount <= 0) {
        throw new Error(`[ERR] Album ${decodeTitle} is not exists !`)
    } else if (searchAlbumInfo.albumCount >= 2) {
        console.log('[WARN] Multy Album Founded')
        // TODO show album name in the cmd and input index to crawl
    }
    const selectAlbum = searchAlbumInfo.albums[0]

    await $.suspend()
    const songs = await getAlbumInfo({ id: selectAlbum.id })
    
    await $.suspend()
    const newPlayListID = await createPlayList({
        title,
        description: source
    })

    await $.suspend()
    await addSongsToPlayList({ 
        id: newPlayListID, 
        ids: songs.map(x => x.id).join(',') 
    })

    await $.suspend()
    await updatePlayListDescription({ 
        id: newPlayListID, 
        des: encodeURIComponent(source)
    })

    await $.suspend()
    await updatePlayListTag({ 
        id: newPlayListID, 
        tags: tags.join(',')
    })
    
    for await (comment of comments) {
        await $.suspend()
        await commentPlayList({ 
            id: newPlayListID,
            content: encodeURIComponent(comment)
        })
    }
}