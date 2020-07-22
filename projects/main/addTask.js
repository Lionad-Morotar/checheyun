const request = require('request')

const task = {
    type: 'create-playlist-from-wiki',
}
const body = JSON.stringify(task)

const options = {
  url: 'http://127.0.0.1:3001/task/add',
  body,
  headers: {
    'Content-Type': 'application/json',
  },
}

request.post(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Request Done')
    } else {
      console.error('Request Failed')
    }
})