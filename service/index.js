const Netease = require("./netease")

const Service = new Netease()

const getComment = async options => {
  const querys = Object.assign({
    page: 1,
    limit: 20
  }, options)
  return await Service.getComment(querys)
}

module.exports = {
  getComment
}
