const Clawler = require('./src')
const connectDB = require('./src/connect-db')

connectDB().then(mongo => {
    const db = mongo.db("单曲-元信息")
    const collection = db.collection('test')

    const tasks = [
        { 
            type: 'song-meta', 
            url: 'https://music.163.com/#/song?id=22636827' 
        }
    ]

    new Clawler({ collection, force: true })
        .get(tasks)
        .then(() => {
            console.log('task done')
        })
        .catch(error => {
            console.log('task error : ', error)
        })
})