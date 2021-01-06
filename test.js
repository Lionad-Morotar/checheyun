const Clawler = require('./src')
const connectDB = require('./src/connect-db')
const { ensureCookie } = require('./service/cookie')

connectDB().then(async mongo => {

  const db = mongo.db("爬虫缓存")
  db.collection('专辑').find({ _id: '85879713' }).toArray((err, item) => {
    console.log(item)
  })

  return

  try {
    await ensureCookie()
  } catch (error) {
    console.error(error)
  }

  const album = await new Clawler({ collection: db.collection('专辑') })
    .exec([
      `https://music.163.com/#/album?id=85879303`
    ])

})

console.log('\n[DONE]')