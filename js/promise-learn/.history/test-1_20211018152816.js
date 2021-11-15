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
    if(ignore) return
    ignore = true
    resolvePromise(this, value, onFulfilled, onRejected)
  }
  let reject = reason => {
    if(ignore) return
    ignore = true
    onRejected(reason)
  }

  try {
    f(resolve, reject)
  } catch(error) {
    reject(error)
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    let callback = {onFulfilled, onRejected, resolve, reject } 
    if(this.state === PENDING) {
      this.callbacks.push(callback)
    } else {
      setTimeout(() => handleCallback(callback, this.state, this.result), 0)
    }
  })
}

const handleCallback = (callback, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = callback
  try {
    if( state === FULFILLED ) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
    }
  } catch(error) {
    reject(error)
  }
}

const handleCallbacks = (callbacks, state, result) => {
  
}