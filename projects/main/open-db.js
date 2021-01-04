const promise = require('bluebird')
const path = require('path')
const cmd = require('node-cmd')

const mongoPath = path.join(__dirname, './db')

const getAsync = promise.promisify(cmd.get, { multiArgs: true, context: cmd })

let restTryTime = 1

async function tryConnect() {
  const command = `start cmd /k "mongod --dbpath ${mongoPath}"`
  console.log('command: ', command)
  getAsync(command).then((error, result) => {
    if (error && restTryTime--) {
      throw error
    }
  })
}

tryConnect()