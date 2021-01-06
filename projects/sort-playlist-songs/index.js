const Clawler = require('../../src')
const connectDB = require('../../src/connect-db')
const api = require('../../service')
const { ensureCookie } = require('../../service/cookie')

const isOffLineNow = true

const initSort = require('./sort')
const sortConfig = require('./sort.config')
const { playlistID = '' } = sortConfig
if (!playlistID) throw new Error('[Config Error] 请在配置文件内填写歌单ID')
const sortFn = initSort(sortConfig)

// eslint-disable-next-line
function getIDs (items = []) {
    return items.map(x => x.id)
}
// eslint-disable-next-line
function getNames (items = []) {
    return items.map(x => x.name)
}

connectDB().then(async mongo => {

    try {
        await ensureCookie()
    } catch (error) {
        console.error(error)
    }

    /* 找到歌单信息 */

    const db = mongo.db("爬虫缓存")
    const playlists = await new Clawler({ collection: db.collection('歌单') })
        .exec([ 
            `https://music.163.com/#/playlist?id=${playlistID}`
        ])

    /* 找到歌单中所有歌曲的元信息 */

    playlists.map(async playlist => {
        const { trackIds } = playlist
        const songIds = trackIds.map(x => x.id)

        const songsTask = songIds.map(x => ({
            type: 'song-meta',
            url: `https://music.163.com/#/song?id=${x}`
        }))
        const songs = await new Clawler({ 
            collection: db.collection('单曲-元信息'), 
            maxConcurrenceCount: isOffLineNow ? 200 : 3 })
            .exec(songsTask)

        /* 找到所有歌曲的专辑 */

        const albumIDs = [...new Set(songs.map(x => x.al.id))]
        const albumsTask = albumIDs.map(x => ({
            type: 'album',
            url: `https://music.163.com/#/album?id=${x}`
        }))

        const albums = await new Clawler({ 
            collection: db.collection('专辑'), 
            maxConcurrenceCount: isOffLineNow ? 200 : 3 })
            .exec(albumsTask)

        songs.map(song => {
            const albumID = song.al.id
            song.al = albums.find(x => String(x.id) === String(albumID) )
        })

        /* 歌曲排序 */

        // console.log('[Before Sort]', getNames(songs))
        // console.log('[Before Sort]', getIDs(songs))

        songs.sort(sortFn)

        // console.log('[After Sort]', getNames(songs))
        // console.log('[After Sort]', getIDs(songs))

        // console.log('[测试]', songs.map(x => +(+x.al.publishTime / 1000).toFixed(0)))
        console.log('[测试]', songs.map(x => x.name))

        /* 上传结果 */
        
        // return
        api.updatePlayListSongOrder({
            pid: playlist.id,
            trackIds: getIDs(songs)
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.error(err)
        })
    })

})

console.log('\n[DONE]')