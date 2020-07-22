const APIURL = `http://localhost:3000`
const joinAPI = url => APIURL + url

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3001

const serverURL = `http://${host}:${port}`

module.exports = {
    APIURL,
    joinAPI,
    serverURL,
    host,
    port,
}