const http = require('http')
const fs = require('fs')
const path = require("path")
const mime = require('mime')
const cache = {}

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'})
  response.write('Error 404: resource not found')
  response.end()
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  )
  response.end(fileContents)
}

// 有缓存，读缓存；无缓存，访问文件系统；文件不存在，返回404
function serveStatic(response, cache, absPath) {
  if(cache[absPath]) {  // 是否缓存
    sendFile(response, absPath, cache[absPath]) // 从缓存中返回文件
  } else {
    fs.exists(absPath, exists => {  //文件是否存在
      if(exists) {
        fs.readFile(absPath, (err, data) => { //读取文件
          if(err) {
            send404(response)
          } else {
            cache[absPath] = data
            sendFile(response, absPath, data)
          }
        })
      } else {
        send404(response) // 发送404
      }
    })
  }
}

const server = http.createServer((request, response) => {
  let filePath = false
  if(request.url == '/') {
    // 默认返回的html文件
    filePath = 'public/index.html'
  } else {
    // 转换为文件的相对路径
    filePath = `public/${request.url}`
  }
  let absPath = `./${filePath}`
  // 返回静态文件
  serveStatic(response, cache, absPath)
})

server.listen(3000, () => {
  console.log("chatroom server runs on port 3000")
})