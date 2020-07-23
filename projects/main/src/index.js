module.exports = {
    /** 
     * 将程序暂停一定时间 
     * @param {Number} timeout = Random from 200ms to 1000ms
     */
    suspend: async (timeout = (100 + Math.random() * 900)) => new Promise(resolve => setTimeout(resolve, timeout))
}