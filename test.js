const Clawler = require('./src')
const connectDB = require('./src/connect-db')

connectDB().then(async mongo => {

    const db = mongo.db("爬虫缓存")
    const playlists = await new Clawler({ collection: db.collection('歌单') })
        .exec([ 
            'https://music.163.com/#/playlist?id=5445763637'
        ])
    console.log(playlists)

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
            maxConcurrenceCount: isOffLineNow ? 5 : 5 })
            .exec(tasks)

        console.log(songs)

        console.log('done')
    })
    
})