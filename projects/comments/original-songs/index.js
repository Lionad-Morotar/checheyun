const MongoClient = require('mongodb').MongoClient
const crawler = require('../../../src/comments')

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, function(err, mongo) {
    if (err) throw err
    const db = mongo.db("comments")
    const collection = db.collection('origin-song')

    const list = [
        {
            url: 'https://music.163.com/#/song?id=1399646264'
        }
    ]

    crawler({ 
        collection, 
        list,
        force: true
    })
        .then(() => {
            console.log('task done !')
            // db.close()
        })
        .catch(error => {
            console.error('task error : ', error.message)
            // db.close()
        })
})

