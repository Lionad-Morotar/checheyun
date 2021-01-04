const moment = require("moment")
const apis = require('../../service')
const utils = require('../../utils')

module.exports = ({ id, ID }) => ({
    api: apis.getComment,
    query: {
        id,
        page: 1,
        lastTime: 0
    },
    dataHold: {
        comments: [],
        hotComments: [],
    },
    ondata: ({ data, dataHold }) => {
        const comments = (data.comments || []).filter(x => 
            !dataHold.comments.find(y => x.commentId === y.commentId)
        )
        const hotComments = (data.hotComments || []).filter(x => 
            !dataHold.hotComments.find(y => x.commentId === y.commentId)
        )

        dataHold.comments.push(
            ...comments
                .map(x => utils.filterNull(x))
                .map(x => {
                    x._time = x.time
                    x.time = moment(x.time).format("YYYY-MM-DD H:mm:ss")
                    return x
                })
        )
        dataHold.hotComments.push(
            ...hotComments.map(x => utils.filterNull(x))
        )
    },
    step: ({ query, data, dataHold }) => {
        const doNext = data.comments.length !== 0
        if (doNext) {
            Object.assign(query, {
                page: query.page + 1,
                lastTime: dataHold.comments[dataHold.comments.length - 1]._time
            })
        }
        return doNext
    },
    onprogress: ({ progress, query, logger, task, dataHold }) => {
        progress === 'step'
            && logger.store(query.id, {
                id: query.id,
                type: task.type,
                page: query.page - 1,
                count: dataHold.comments.length
            })
        progress === 'done'
            && logger.update(query.id, {
                    id: query.id,
                    status: 'success',
                    callback: stores => delete stores[id]
                })
        logger.printNew()
    },
    stop: ({ collection, dataHold }) => {
        let oldone = { ...ID }
        delete oldone._v
        collection.deleteMany(oldone, function(err) {
            if (err) throw err
            collection.insertOne({...ID, ...dataHold }, function(err) {
                if (err) throw err
            })
        })
    },
})