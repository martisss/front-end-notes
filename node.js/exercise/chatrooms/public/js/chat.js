const Chat = function(socket) {
  this.socket = socket
}

// 发送消息
Chat.prototype.sendMessage = (room, text) {
  const message = {
    room: room,
    text: text
  }
  this.socket.emit('message', message)
}

// 变更房间
Chat.prototype.changeRoom = (room) =>{
  this.socket.emit('join', {
    newRoom: room
  })
}

// 处理聊天命令
Chat.prototype.processCommand = (command) => {
  const words = command.split(' ')
  const command = words[0].substring(1, words[0].length).toLowerCase()
  switch(command) {
    case 'join':
      words.shift()
      const room = words.join(' ')
      this.changeRoom(room)
      break
    case 'nick':
      words.shift()
      const name = words.join(' ')
      this.socket.emit('nameAttempt', name)
      break
    default:
      message - 'Unrecognized command'
      break
  }
  return message
}

export {Chat}