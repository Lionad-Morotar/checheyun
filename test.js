const Clawler = require('./src')
const connectDB = require('./src/connect-db')
const api = require('./service')
const { ensureCookie } = require('./service/cookie')

function getIDs (items = []) {
    return items.map(x => x.id)
}
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
            // 'https://music.163.com/#/playlist?id=5445763637'
            'https://music.163.com/#/playlist?id=5447218503'
        ])
    const playlist = playlists[0]

    /* 找到歌单中所有歌曲的元信息 */

    // TODO for await of
    playlists.map(async playlist => {
        const { trackIds } = playlist
        const songIds = trackIds.map(x => x.id)

        const tasks = songIds.map(x => ({
            type: 'song-meta',
            url: `https://music.163.com/#/song?id=${x}`
        }))
        const isOffLineNow = true
        const songs = await new Clawler({ 
            collection: db.collection('单曲-元信息'), 
            maxConcurrenceCount: isOffLineNow ? 200 : 5 })
            .exec(tasks)

        /* 歌曲排序 */

        const sortMethods = {
            'song-name': (isASC = true) => {
                return (a, b) => {
                    const turn = (isASC ? 1 : -1)
                    return a.name < b.name ? -1 * turn : turn
                }
            }
        }

        const sortMethod = 'song-name'
        const sortByASC = true
        const sortFn = sortMethods[sortMethod](sortByASC)

        // console.log('[Before Sort]', getNames(songs))

        songs.sort(sortFn)

        // console.log('[After Sort]', getNames(songs))

        console.log('[After Sort]', getNames(songs))
        console.log('[After Sort]', getIDs(songs))
        console.log(playlist.id)

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