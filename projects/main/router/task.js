const express = require('express')

const router = express.Router()

// TODO add task in cmd
// 添加任务
router.post('/task/add', (req, res) => {
    const { type } = req.body
    console.log('[ADD-TASK]', type)
})

module.exports = router