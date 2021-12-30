const http = require('http')
const fs = require('fs')
const MyServer = http.createServer()
MyServer.on('request', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'image/png'})
  // 设置一个从读取流到写出流的管道
  fs.createReadStream('./resource/marvel.png').pipe(res)
}).listen(3000)
console.log('server runs on port 3000!')