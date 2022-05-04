import handle from './handle.js'
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
export {
  api,
  handle,
  getX,
  x
}
