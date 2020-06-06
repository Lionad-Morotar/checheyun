const connectDB = require('../../../src/connect-db')
const Clawler = require('../../../src')

connectDB().then(mongo => {
    const db = mongo.db("评论")
    const collection = db.collection('原曲')

    // const task = [
    //     { type: 'song', url: 'https://music.163.com/#/song?id=500686301' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=509647' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=500684331' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=500686301' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=509647' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=500684331' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=409931925' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=500686309' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=500686309' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=1399645446' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=22636829' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=500684337' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=500684337' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=509653' },
    //     { type: 'song', url: 'https://music.163.com/#/song?id=22636831' },
    // ]

    const task = 'https://music.163.com/#/playlist?id=2807339852'

    new Clawler({ collection })
        .get(task)
        .then(() => {
            console.log('task done')
        })
        .catch(error => {
            console.log('task error : ', error)
        })
})
