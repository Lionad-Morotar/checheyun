const request = require('request')

request.get({
    url: `http://localhost:3001/wiki/source?title=%E6%B7%B1%E7%A7%98%E4%B9%90%E6%9B%B2%E9%9B%86/%E8%A1%A5&block=%E6%A6%82%E8%BF%B0`
}, (error, res) => {
    const data = JSON.parse(res.body)
    console.log(data.message)
    if (error || res.statusCode !== 200) {
        console.error('[Server Failed] GetWIKISource')
    } else {
        // resolve(res)
    }
})