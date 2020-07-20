/* @see https://github.com/agenda/agenda */
const Agenda = require('agenda')
const chalk = require('chalk')

async function prepareAgenda(handles) {
    console.log(chalk.green('Prepare Agenda Start ...'))
    const mongoConnectionString = "mongodb://localhost:27017"
    const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'agendaJobs'}})
    await agenda.start()

    // TODO make utils
    let forAwaitOf = {
        handle : null,
        async runNext() {
            this.handle = handles.pop()
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