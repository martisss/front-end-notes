// 如果直接require("api"),那么就会去node_modules里面去找相应模块
import {handle, api, getX, x} from './api.js'

const data = api()
handle(data)
console.log(111)
console.log(x)

console.log(getX())
