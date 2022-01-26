// 初始化定义聊天状态的变量
const socketio = require('socket.io')
let io
let guestNumber = 1
const nickNames = {}
const namesUsed = []
const currentRoom = {}

/* 它启动Socket.IO服务器，限定Socket.IO向控制台输出的日志的详细程度，
并确定该如何处理每个接进来的连接。 */
exports.listen = function(server) {
  // 启动socket io 服务器， 允许它搭载在已有的http服务上
  io = socketio.listen(server)
  io.set('log level', 1)

  io.sockets.on('connection', (socket) => {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
    // 用户连接上来时放入聊天室lobby中
    joinRoom(socket, 'Lobby')

    // 处理用户消息，处理用户更名， 聊天室的创建及变更
    handleMessageBroadcasting(socket, nickNames)
    handleNameChangeAttempts(socket, nickNames, nameUsed)
    handleRoomJoining(socket)

    // 用户发出请求时，向其提供已经被占用的聊天室的列表
    socket.on('rooms', () => {
      socket.emit('rooms', io.sockets.manager.rooms)
    })
    // 定义用户断开连接后的清除逻辑
    handleClientDisconnection(socket, nicknames, namesUsed)
  })
}

function assignGuestName(socket, guestNumber, nickNames, nameUsed) {
  let name = 'Guest' + guestNumber
  nickNames[socket.id] = name
  socket.emit('nameResult', {
    success: true,
    name: name
  })
  namesUsed.push(name)
  return guestNumber+1
}

function joinRoom(socket, room) {
  // 用户进入房间？？？
  socket.join(room)
  // 记录用户的当前房间
  currentRoom[socket.id] = room
  // 告诉用户进入了新房间
  socket.broadcast.to(room).emit('message', {
    text: `${nick[socket.id]} has joined ${room}.`
  })
  // 如果不止一个用户在这个房间里，汇总一下都有哪些人
  const usersInRoom = io.sockets.clients(room)
  if(usersInRoom.length > 1) {
    const usersInRoomSummary = `Users currently in ${room}:`
    for(let index in usersInRoom) {
      const userSocketId = usersInRoom[index].id
      if(userSocketId != socket.id) {
        if(index > 0) {
          usersInRoomSummary += ', '
        }
        usersInRoomSummary += nickNames[userSocketId]
      }
    }
    usersInRoomSummary += '.'
    socket.emit('message', {text: usersInRoomSummary})

  }
}

/* 处理用户的更名需求，如果没有注册就注册,并删掉其之前的昵称，方便其他用户使用；
如果昵称已经被占用，就返回错误信息 */
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  // 添加nameAttempt 事件的监听器
  socket.on('nameAttempt', name => {
    if(name.indexOf('Guest') == 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin wth "Guest".'
      })
    } else {
      if(namesUsed.indexOf(name) == -1) {
        const previousName = nickNames[socket.id]
        const previousNameIndex = namesUsed.indexOf(previousName)
        namesUsed.push(name)
        nickNames[socket.id] = name
        delete namesUsed[previousNameIndex]
        socket.emit('nameResult', {
          success: true,
          name: name
        })
      } else  {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        })
      }
    }
  })
}

// 处理用户发送过来的消息，并将消息转发给其他所有用户
function handleMessageBroadcasting(socket) {
  socket.on('message', message => {
    socket.broadcast.to(message.room).emit('message', {
      text: `${nickNames[socket.id]}:${message.text}`
    })
  })
}

function handleRoomJoining(socket) {
  socket.on('join', room => {
    socket.leave(currentRoom[socket.id])
    joinRoom(socket, room.newRoom)
  })
}

function handleClientDisconnection(socket) {
  socket.on('disconnect', () => {
    const nameIndex = namesUsed.indexOf(nickNames[socket.id])
    delete namesUsed[nameIndex]
    delete nickNames[socket.id]
  })
}