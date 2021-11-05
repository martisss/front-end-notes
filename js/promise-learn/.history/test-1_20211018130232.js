const isFunction = obj => typeof obj === 'function'
const isObject = obj => obj && typeof  obj == 'object'
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(f) {
  this.result = null
  this.state = PENDING
  this.callbacks = []

  let onFulfilled = value => transition(this, FULFILLED, value)
  let onRejected = reason => transition(this, REJECTED, reason)

  let ignore = false
  let resolve = value => {
    
  }
}