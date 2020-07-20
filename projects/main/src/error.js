const error = {
    container: [],
    get length() {
        return this.container.length
    },

    add (item) {
        this.container.push(item)
    }
}

module.exports = error