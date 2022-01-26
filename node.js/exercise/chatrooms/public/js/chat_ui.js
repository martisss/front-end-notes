import {Chat} from './chat'
function divEscapedContentElement(message) {
  return $('<div></div>').text(message)
}

function divSystemContentElement(message) {
  return $('<div></div>').html('<i>'+ message +'</i>')
}

function precessUserInput(chatApp, socket) {
  const message = $('#send-message').val()
  let systemMessage

  if(message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message)
    if(systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage))
    }
  } else {
    chatApp.sendMessage($('#room').text(), message)
    $('#messages').append(divEscapedContentElement(message))
    $('#messages').scrollTop($('#messages').prop('scrollHeight'))
  }
  $('#send-message').val('')
}

// 客户端初始化逻辑
const socket = io.connect()

$(document).ready(() => {
  const chatApp = new Chat(socket)
  // 显示更名尝试结果
  socket.on('nameResult', (result) => {
    let message 
    if(result.success) {
      message = 'You are now known as ' + result.name + '.'
    } else {
      message = result.message
    }
    $('#messages').append(divSystemContentElement(message))
  })

  socket.on('joinResult', result => {
    $('#room').text(result.room)
    $('#messages').append(divSystemContentElement('Room changed.'))
  })

  // 显示接收到的消息
  socket.on('message', message => {
    const newElement = $('<div></div>').text(message.text)
    $('#messages').append(newElement)
  })
  // 显示可用房间列表
  socket.on('rooms', rooms => {
    $('#room-list').empty()
    for(let room in rooms) {
      room = room.substring(1, room.length)
      if(room != '') {
        $('#room-list').append(divEscapedContentElement(room))
      }
    }
    $('#room-list div').click(() => {
      chatApp.processCommand('/join' + $(this).text())
      $('#send-message').focus()
    })
  })

  setInterval(()=>{
    socket.emit('rooms')
  }, 1000)
  $('#send-message').focus()
  $('#send-form').submit(() => {
    processUserInput(chatApp, socket)
    return false
  })
})