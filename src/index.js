const chalk = require('chalk')
const globalConfig = require('./config')
const logger = require('./logger')
const utils = require('../utils')
const formatTask = require('./format-task')
const getData = require('./get-data')

class Crawler {

    /**
     * Crawler
     * @param {Object} arg 
     * // @param {String} arg.validType 比对任务数据与数据库是否同版本的方式
     * @param {Boolean} arg.force 是否忽略数据库同版本的暂存文件
     */
    constructor (arg) {
        if (!arg.collection) {
            throw new TypeError('Param collection must be MongoDBCollection')
        }
        this.taskRec = []
        this.todoList = []
        this.doingList = []
        this.logger = arg.logger || logger
        this.collection = arg.collection
        this.config = Object.assign({
            force: false,
            validType: 'ID'
        }, globalConfig, arg)
    }

    /**
     * 调度任务并获取结果
     * @param {*} tasks 
     * @param {*} config 
     */
    async get (tasks, config = {}) {
        Object.assign(this.config, config)
        this.addTask(tasks)
        await this.distributeTask()
        return Promise.resolve()
    }

    /**
     * 添加任务
     * @param {*} tasks 
     * @param {*} callback 
     */
    addTask (tasks, callback) {
        const newTaskID = +new Date()
        const newTask = {
            callback,
            id: newTaskID,
            task: tasks instanceof Array
                ? tasks.map(x => formatTask(x))
                : formatTask(tasks)
        }
        this.todoList.push(newTask)
        return this
    }

    /**
     * 删除任务
     * @param {*} task 
     */
    async removeTask (taskRec, taskList = this.doingList) {
        taskList.splice(
            taskList.findIndex(x => x === taskRec),
            1
        )
    }

    /**
     * 返回剩下的并发数量
     */
    canCreateNewTaskLen(todoList = this.todoList) {
        const doingListEmpty = this.config.maxConcurrenceCount - this.doingList.length
        return Math.min(doingListEmpty, todoList.length)
    }

    /**
     * // 分配任务到待办列表
     * @param {*} taskList 
     */
    async distributeTask(taskList = this.todoList, doingList = this.doingList) {
        let i = this.canCreateNewTaskLen()
        while (i-- > 0) {
            const task = taskList.pop()
            doingList.push(task)
            return await this.execTask(task)
        }
    }

    /**
     * // 执行一项任务
     * @param {*} taskRec 
     */
    async execTask (taskRec) {
        const { id: taskID, callback: taskCallback, task } = taskRec

        let res
        if (task instanceof Array) {
            const results = await this.handleTaskList(task)
            res = {
                ...results[0],
                results: results.map(x => x.result),
            }
        } else {
            res = await this.handleTask(task)
        }
        const { result, ...taskOpts } = res

        if (taskCallback) {
            await taskCallback(taskOpts)
        }
        await this.removeTask(taskRec)
        await this.distributeTask()

        return result
    }

    /**
     * 执行系列任务
     * @param {*} task 
     */
    async handleTaskList (task) {
        const results = []
        const taskCopy = [...task]
        const doingList = []
        return new Promise(resolve => {
            const run = async () => {
                const task = taskCopy.pop()
                doingList.push(task)
                const singleTaskRes = await this.handleTask(task)
                results.push(singleTaskRes)
                doingList.splice(
                    doingList.findIndex(x => x === task), 
                    1
                )
                
                if (taskCopy.length <= 0) {
                    resolve(results) 
                } else {
                    calcRunLen()
                }
            }
            const calcRunLen = () => {
                let i = Math.min(this.config.maxConcurrenceCount - this.doingList.length + 1 - doingList.length, taskCopy.length)
                while (i-- > 0) {
                    run()
                }
            }
            calcRunLen()
        })
    }

    /**
     * 执行单项任务
     * @param {*} task 
     */
    async handleTask (task) {
        const { deep, url } = task
        const { query } = task.task || {}
        const { id } = utils.parseURL(url)
        const urlType = utils.judgeURLType(url)
        const type = task.type || urlType
        const ID = {
            _id: id,
            _v: this.config.versionType[type] || this.config.versionType[urlType] || 'default',
            type,
        }

        const findFn = {
            ID:  async () => {
                return await new Promise(resolve => {
                    this.collection.find(ID).toArray(function(err, res) {
                        if (err) throw err
                        resolve(res)
                    })
                })
            }
        }[this.config.validType]

        const findRes = this.config.force ? [] : (await findFn())
        const hasFind = findRes.length > 0

        let projectOpts = null
        // TODO refactor
        switch (type) {
            case 'song-cover':
                projectOpts = require('./projects/get-song-cover')({ ID, id, hasFind: findRes[0], query })
            break
            case 'song':
                projectOpts = require('./projects/get-song-comments')({ ID, id, hasFind: findRes[0] })
            break
            case 'song-meta':
                projectOpts = require('./projects/get-song-meta')({ ID, id, hasFind: findRes[0] })
            break
            case 'album':
                projectOpts = require('./projects/get-album-songs')({ ID, id, hasFind: findRes[0] })
            break
        }
        
        // if (hasFind) {
        //     logger.log(`[SKIP Fetch: ${chalk.green(id)}] Type: ${chalk.green(type)}`)
        // }

        const { result, ...taskOpts } = await getData(Object.assign({
            hasFind: findRes[0],
            instance: this,
            config: this.config,
            logger: this.logger,
            collection: this.collection,
            task: { type }
        }, projectOpts))

        return { result, ...taskOpts }
    }
    
}

module.exports = Crawler