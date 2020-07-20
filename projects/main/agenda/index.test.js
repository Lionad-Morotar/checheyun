forAwaitOf = {
    handle : null,
    async runNext() {
        this.handle = handles.pop()
        if (this.handle) {
            await this.handle(agenda)
            await this.runNext()
        }
    }
}

handles = [
  async () => console.log(1),
  async () => await new Promise(
    resolve => setTimeout(() => { console.log(2); resolve() }, 1000)
  ),
  async () => console.log(3),
]

forAwaitOf.runNext()