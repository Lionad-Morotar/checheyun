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
            throw new TypeError('Param missing: collection <---> MongoDBCollection')
        }
        this.taskRec = []
        this.todoList = []
        this.doingList = []
        this.interval = 0
        this.logger = arg.logger || logger
        this.collection = arg.collection
        this.config = Object.assign({
            force: false,
            validType: 'ID'
        }, globalConfig, arg)
    }

    // 调度任务并获取任务执行的返回结果
    async exec (tasks, config = {}) {
        Object.assign(this.config, config)
        this.addTask(tasks, config.callback, false)
        return Promise.resolve(await this.distributeTask())
    }

    // 添加任务
    addTask (tasks, callback, isSingleTask = true) {
        let newTask = []
        if (!isSingleTask){
            newTask = tasks.map(x => ({
                callback,
                id: String(+new Date())+String(Math.random()).slice(-6),
                task: formatTask(x)
            }))
        } else {
            newTask = [{
                callback,
                id: String(+new Date())+String(Math.random()).slice(-6),
                task: tasks instanceof Array
                    ? tasks.map(x => formatTask(x))
                    : formatTask(tasks)
            }]
        }
        this.todoList.push(...newTask)
        return this
    }

    recordTask (task, taskList = this.doingList) {
        taskList.push(task)
    }
    removeTask (task, taskList = this.doingList) {
        taskList.splice(
            taskList.findIndex(x => x === task),
            1
        )
    }

    /**
     * 返回剩下的并发数量
     */
    calcRestConcurrenceCount(todoList = this.todoList) {
        const doingListEmpty = this.config.maxConcurrenceCount - this.doingList.length
        return Math.min(doingListEmpty < 0 ? 0 : doingListEmpty, todoList.length)
    }

    /**
     * 开始执行任务，并发控制
     * @param {*} taskList 
     */
    async distributeTask(taskList = this.todoList, doingList = this.doingList) {
        return new Promise(async resolve => {
            const totalTaskLen = doingList.length + taskList.length
            const results = []
            let doingBinded = null
            
            function doing(restConcurrenceCount = this.calcRestConcurrenceCount()) {
                return new Promise(resolve => {
                    while (restConcurrenceCount-- > 0) {
                        const task = taskList.pop()
                        const { id: taskID, callback: taskCallback, task: taskDetail } = task
                        this.recordTask(task)
                        this.run(taskDetail).then(async res => {
                            results.push(res)
                            if (results.length === totalTaskLen) resolve(results)
                            // logger.log(`[RestItem] ${results.length} / ${totalTaskLen}`)
                            this.removeTask(task)

                            // 继续下一个任务
                            resolve(await doingBinded())
                            // 任务间隙休息片刻
                            await new Promise(resolve => setTimeout(resolve, this.interval))
                        })
                    }
                })
            }
            doingBinded = doing.bind(this)
            await doingBinded()
            resolve(results)
        })
    }
    
    /**
     * 执行任务
     * @param {*} task 
     */
    async run (task) {
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
        // eslint-disable-next-line
        const hasFind = findRes.length > 0

        let projectOpts = null
        const optsInitialValue = { 
            autoSave: this.config.autoSave,
            hasFind: findRes[0],
            id, 
            ID, 
        }
        // TODO refactor
        switch (type) {
            case 'song-cover':
                projectOpts = require('./projects/get-song-cover')({ ID, id, hasFind: findRes[0], query })
            break
            case 'song':
                projectOpts = require('./projects/get-song-comments')(optsInitialValue)
            break
            case 'album':
                projectOpts = require('./projects/get-album-songs')(optsInitialValue)
            break
            default:
                try {
                    projectOpts = require(`./projects/get-${type}`)(optsInitialValue)
                } catch (error) {
                    throw new Error('Task type required')
                }
            break
        }
        
        // eslint-disable-next-line
        // if (hasFind) {
        //     logger.log(`[Use Cashe] type: ${chalk.green(type)} id: ${chalk.green(id)}`)
        // }

        const { result, ...taskOpts } = await getData(Object.assign({
            ID,
            hasFind: findRes[0],
            instance: this,
            config: this.config,
            logger: this.logger,
            collection: this.collection,
            task: { type }
        }, projectOpts))

        return result
    }
    
}

module.exports = Crawler