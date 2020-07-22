const Crawler = require("crawler")
const express = require('express')

const errorHandle = require('../src/error')

/* @see https://github.com/bda-research/node-crawler */
const crawler = new Crawler({
    maxConnections : 2
})

const router = express.Router()

// 获取 WIKI 页面实体信息的源码
router.get('/wiki/source', (req, res) => {
    console.log('[GET-WIKI-SOURCE]')
    const { title, block } = req.query
    // TODO make createURL utils
    const uri = `https://thwiki.cc/index.php?title=${encodeURIComponent(title)}&action=edit&viewsource=1`
    crawler.direct({
        uri: uri,
        skipEventRequest: false,
        callback: function(error, response) {
            if(error) {
                errorHandle.add(error)
                res.send(500).end()
            } else {
                const $ = response.$
                const content = $('textarea').text()
                let message = content
                if (block) {
                    const regex = new RegExp(`[\\w\\W]*== ${block} ==([\\w\\W]+?)==`)
                    const match = message.match(regex)
                    message = match && match[1] || message
                }
                res.json({ status: 200, message })
            }
        }
    })
})

module.exports = router