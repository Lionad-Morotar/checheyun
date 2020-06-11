const connectDB = require('../../../src/connect-db')
const Clawler = require('../../../src')

connectDB().then(mongo => {
    const db = mongo.db("封面")
    const collection = db.collection('MyLove')

    const loveArtists = [
        "https://music.163.com/#/artist?id=88148",
        "https://music.163.com/#/artist?id=17243",
        "https://music.163.com/#/artist?id=19618",
        "https://music.163.com/#/artist?id=13188",
        "https://music.163.com/#/artist?id=15802",
        "https://music.163.com/#/artist?id=190894",
        "https://music.163.com/#/artist?id=14437",
        "https://music.163.com/#/artist?id=27600",
        "https://music.163.com/#/artist?id=15081",
        "https://music.163.com/#/artist?id=102035",
        "https://music.163.com/#/artist?id=12204860",
        "https://music.163.com/#/artist?id=38912",
        "https://music.163.com/#/artist?id=44265",
        "https://music.163.com/#/artist?id=189603",
        "https://music.163.com/#/artist?id=14429",
        "https://music.163.com/#/artist?id=35235",
        "https://music.163.com/#/artist?id=839340",
        "https://music.163.com/#/artist?id=13970913",
        "https://music.163.com/#/artist?id=71203",
        "https://music.163.com/#/artist?id=12132600",
        "https://music.163.com/#/artist?id=12126331",
        "https://music.163.com/#/artist?id=37614",
        "https://music.163.com/#/artist?id=45110",
        "https://music.163.com/#/artist?id=4726",
        "https://music.163.com/#/artist?id=13950",
        "https://music.163.com/#/artist?id=15164",
        "https://music.163.com/#/artist?id=12639",
        "https://music.163.com/#/artist?id=15175",
        "https://music.163.com/#/artist?id=44296",
        "https://music.163.com/#/artist?id=14576",
        "https://music.163.com/#/artist?id=818004",
        "https://music.163.com/#/artist?id=22247",
        "https://music.163.com/#/artist?id=66386",
        "https://music.163.com/#/artist?id=46198",
        "https://music.163.com/#/artist?id=11996090",
        "https://music.163.com/#/artist?id=43884",
        "https://music.163.com/#/artist?id=37825",
        "https://music.163.com/#/artist?id=45274",
        "https://music.163.com/#/artist?id=14873",
        "https://music.163.com/#/artist?id=93062",
        "https://music.163.com/#/artist?id=16069",
        "https://music.163.com/#/artist?id=104700",
        "https://music.163.com/#/artist?id=123825",
        "https://music.163.com/#/artist?id=5342",
        "https://music.163.com/#/artist?id=90097",
        "https://music.163.com/#/artist?id=15290",
        "https://music.163.com/#/artist?id=31296",
        "https://music.163.com/#/artist?id=122455",
        "https://music.163.com/#/artist?id=31283",
        "https://music.163.com/#/artist?id=21182",
        "https://music.163.com/#/artist?id=31262",
        "https://music.163.com/#/artist?id=816336",
        "https://music.163.com/#/artist?id=31919218",
        "https://music.163.com/#/artist?id=27623",
        "https://music.163.com/#/artist?id=94779",
        "https://music.163.com/#/artist?id=13228211",
        "https://music.163.com/#/artist?id=13226201",
        "https://music.163.com/#/artist?id=123421",
        "https://music.163.com/#/artist?id=19481",
        "https://music.163.com/#/artist?id=1039350",
        "https://music.163.com/#/artist?id=224360",
    ]

    const loveSongs = [
        "https://music.163.com/#/song?id=3949801",
        "https://music.163.com/#/song?id=622670",
        "https://music.163.com/#/song?id=29732992",
        "https://music.163.com/#/song?id=863073353",
        "https://music.163.com/#/song?id=28798998",
        "https://music.163.com/#/song?id=4916157",
        "https://music.163.com/#/song?id=448119",
        "https://music.163.com/#/song?id=16323797",
        "https://music.163.com/#/song?id=28577326",
        "https://music.163.com/#/song?id=4341314",
        "https://music.163.com/#/song?id=520847330",
        "https://music.163.com/#/song?id=21126950",
        "https://music.163.com/#/song?id=622872",
        "https://music.163.com/#/song?id=29755282",
        "https://music.163.com/#/song?id=28907016",
        "https://music.163.com/#/song?id=441552",
        "https://music.163.com/#/song?id=3949566",
        "https://music.163.com/#/song?id=1315927375",
        "https://music.163.com/#/song?id=1472386",
        "https://music.163.com/#/song?id=5410090",
        "https://music.163.com/#/song?id=1405248551",
        "https://music.163.com/#/song?id=3256645",
        "https://music.163.com/#/song?id=22636878",
        "https://music.163.com/#/song?id=3950627",
        "https://music.163.com/#/song?id=441491902",
        "https://music.163.com/#/song?id=535590199",
        "https://music.163.com/#/song?id=2001864",
        "https://music.163.com/#/song?id=3256572",
        "https://music.163.com/#/song?id=517924244",
        "https://music.163.com/#/song?id=421203303",
        "https://music.163.com/#/song?id=30512594",
        "https://music.163.com/#/song?id=3950552",
        "https://music.163.com/#/song?id=29572733",
        "https://music.163.com/#/song?id=2001811",
        "https://music.163.com/#/song?id=406232",
        "https://music.163.com/#/song?id=493911",
        "https://music.163.com/#/song?id=373525",
        "https://music.163.com/#/song?id=30051730",
        "https://music.163.com/#/song?id=28577329",
        "https://music.163.com/#/song?id=511838186",
        "https://music.163.com/#/song?id=3950039",
        "https://music.163.com/#/song?id=19278706",
        "https://music.163.com/#/song?id=22822543",
        "https://music.163.com/#/song?id=3950015",
        "https://music.163.com/#/song?id=458323",
        "https://music.163.com/#/song?id=29836330",
        "https://music.163.com/#/song?id=857896",
        "https://music.163.com/#/song?id=28987636",
        "https://music.163.com/#/song?id=20744788",
        "https://music.163.com/#/song?id=857891",
        "https://music.163.com/#/song?id=139774",
        "https://music.163.com/#/song?id=425280970",
        "https://music.163.com/#/song?id=28996630",
        "https://music.163.com/#/song?id=2060546",
        "https://music.163.com/#/song?id=27588028",
        "https://music.163.com/#/song?id=3949584",
        "https://music.163.com/#/song?id=3949580",
        "https://music.163.com/#/song?id=29764380",
        "https://music.163.com/#/song?id=16835222",
        "https://music.163.com/#/song?id=441532",
        "https://music.163.com/#/song?id=441550",
        "https://music.163.com/#/song?id=17867241",
        "https://music.163.com/#/song?id=22712173",
        "https://music.163.com/#/song?id=406238",
        "https://music.163.com/#/song?id=28885223",
        "https://music.163.com/#/song?id=423406418",
        "https://music.163.com/#/song?id=1335322572",
        "https://music.163.com/#/song?id=3950047",
        "https://music.163.com/#/song?id=22822551",
        "https://music.163.com/#/song?id=28308972",
        "https://music.163.com/#/song?id=5307982",
        "https://music.163.com/#/song?id=28377225",
        "https://music.163.com/#/song?id=16846091",
        "https://music.163.com/#/song?id=34613432",
        "https://music.163.com/#/song?id=28577335",
        "https://music.163.com/#/song?id=493981",
        "https://music.163.com/#/song?id=1235586",
        "https://music.163.com/#/song?id=32196520",
        "https://music.163.com/#/song?id=28577343",
        "https://music.163.com/#/song?id=1234853",
        "https://music.163.com/#/song?id=16835358",
        "https://music.163.com/#/song?id=22743825",
        "https://music.163.com/#/song?id=5410057",
        "https://music.163.com/#/song?id=1231917",
        "https://music.163.com/#/song?id=2103920",
        "https://music.163.com/#/song?id=28465302",
        "https://music.163.com/#/song?id=22822506",
        "https://music.163.com/#/song?id=446177154",
        "https://music.163.com/#/song?id=33875750",
        "https://music.163.com/#/song?id=993480",
        "https://music.163.com/#/song?id=19945726",
        "https://music.163.com/#/song?id=27918863",
        "https://music.163.com/#/song?id=1323087576",
        "https://music.163.com/#/song?id=28360908",
        "https://music.163.com/#/song?id=16835330",
        "https://music.163.com/#/song?id=28302653",
        "https://music.163.com/#/song?id=730631",
        "https://music.163.com/#/song?id=33233769",
        "https://music.163.com/#/song?id=29393038",
        "https://music.163.com/#/song?id=22822520"
    ]

    // loveSongs.length = 3
    const task = {
        type: 'song-cover',
        task: {
            query: {
                ids: loveSongs.map(x => x.match(/\d+$/)[0]).join(',')
            },
            _noformat: true
        }
    }

    new Clawler({ collection })
        .addTask(task)
        .distributeTask()
        .then(() => {
            console.log('task done')
        })
        .catch(error => {
            console.log('task error : ', error)
        })
})
