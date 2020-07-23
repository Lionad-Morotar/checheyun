const request = require('request')

const title = encodeURIComponent('深秘乐曲集/补')
const url = 'https://thwiki.cc/%E6%B7%B1%E7%A7%98%E4%B9%90%E6%9B%B2%E9%9B%86/%E8%A1%A5'

const task = {
    type: 'create-playlist-from-wiki',
    url: `http://localhost:3001/wiki/source?title=${title}&block=%E6%A6%82%E8%BF%B0`,
    tags: ['ACG'],
    comments: [
      `创建于${new Date()}，官网请移步：${url}`
    ],
}
const body = JSON.stringify(task)

const options = {
  url: 'http://127.0.0.1:3001/task/add',
  body,
  headers: {
    'Content-Type': 'application/json',
  },
}

request.post(options, function(error, response) {
    if (!error && response.statusCode == 200) {
      console.log('Request Done')
    } else {
      console.error('Request Failed')
    }
})