/* @see https://github.com/agenda/agenda */
const Agenda = require('agenda')
const chalk = require('chalk')

/**
 * 初始化任务调度工具
 * @param {Function in Array} tasks 待初始化的 Agenda 任务
 */
async function prepareAgenda(tasks) {
    console.log(chalk.green('Prepare Agenda Start ...'))
    const mongoConnectionString = "mongodb://localhost:27017"
    const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'agendaJobs'}})
    await agenda.start()

    // TODO make utils
    let forAwaitOf = {
        handle : null,
        async runNext() {
            this.handle = tasks.pop()
            if (this.handle) {
                console.log('Use Agenda Handle: ', this.handle.name)
                await this.handle(agenda)
                await this.runNext()
            }
        }
    }
    await forAwaitOf.runNext()
    console.log(chalk.green('Prepare Agenda Done'))
}

module.exports = {
    prepareAgenda
}