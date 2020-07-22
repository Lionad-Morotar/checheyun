const express = require('express')

const taskHandle = require('../task')

const router = express.Router()

// TODO add task in cmd
// 添加任务
router.post('/task/add', async (req, res) => {
    const { type } = req.body
    console.log('[ADD-TASK]', type)
    const handle = taskHandle[type]
    if (handle) {
        await handle(req.body)
        res.send(200).end()
    } else {
        res.json({ status: 404, message: `Task ${type} is not support` })
    }
})

module.exports = router