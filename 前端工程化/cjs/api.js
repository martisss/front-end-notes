const handle = require('./handle')
function api() {
  return {
    name: 'leo',
    age: 18,
    gender: 'male'
  }
}


let x = 1

function getX() {
  return x
}
module.exports = {
  api,
  handle,
  getX,
  x
}
