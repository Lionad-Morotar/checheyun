const fs = require('fs')
const path = require('path')
const request = require("request")
const connectDB = require('./src/connect-db')

const invalidcharRe = /[\.~!@#$%^&*，。；‘’\\{\[\]}|]/g

const imgs = []

connectDB().then(mongo => {
    const db = mongo.db("封面")
    const collection = db.collection('MyLove')

    collection.find({}).toArray(function(err, res) {
        if (err) throw err
        res.map(x => imgs.push({
          name: x.name.replace(invalidcharRe, ' ').replace(/\s+/g, ' '),
          src: x.al.picUrl
        }))

        ;(async function() {
          for await (let img of imgs) {
            // console.log(img.name)
            await new Promise((resolve, reject) => {
              const writeStream = fs.createWriteStream(path.join(__dirname, './temp/' + img.name + '.jpg'))
              const readStream = request(img.src)
              readStream.pipe(writeStream)
              readStream.on('error', function() {
                  console.error("错误:" + err) 
                  reject()
              })
              writeStream.on("finish", function() {
                  writeStream.end()
                  resolve()
              })
            })
          }
        })()
    })
})