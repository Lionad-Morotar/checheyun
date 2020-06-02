const MongoClient = require('mongodb').MongoClient
const crawler = require('../../../src/comments')

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, function(err, mongo) {
    if (err) throw err
    const db = mongo.db("评论")
    const collection = db.collection('原曲')

    const list = [
        'https://music.163.com/#/playlist?id=2807339852'
    ]

    crawler({ 
        collection, 
        list
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

