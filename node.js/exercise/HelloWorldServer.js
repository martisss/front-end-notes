const http = require('http')
const MyHttpServer = http.createServer()
MyHttpServer.on('request', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  res.end('Hello NodeJS World!')
}).listen(3000)
console.log('MyHttpServer runs at port 3000')