// 如果直接require("api"),那么就会去node_modules里面去找相应模块
const {handle, api, getX, x} = require('./api')

const data = api()
handle(data)

console.log(x)

console.log(getX())
