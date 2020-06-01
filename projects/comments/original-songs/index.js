const MongoClient = require('mongodb').MongoClient
const crawler = require('../../../src/comments')

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, function(err, mongo) {
    if (err) throw err
    const db = mongo.db("评论")
    const collection = db.collection('原曲')

    const list = [
        // 'https://music.163.com/#/song?id=1399646264',
        'https://music.163.com/#/song?id=1436709403'
    ]

    crawler({ 
        collection, 
        list,
        force: true
    })
        .then(() => {
            console.log('task done !')
            mongo.close()
        })
        .catch(error => {
            console.error('task error : ', error.message)
            mongo.close()
        })
})

