const PENDING = 'pending'
const FULLFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 1.状态转换 
// 2.then
// 3.handleCallback
// 4. The Promise Resolution Procedure
function Promise() {
  this.state = PENDING
  this.result = null
  this.callbacks = []

  let onFulfilled = value => trasition(this, FULLFILLED, value)
  let onRejected = value => trasition(this, REJECTED, reason)

  let ignore = false
  let resolve = value => {
    if (ignore) return
    ignore = true
    resolvePromise(this, value, onFulfilled, onRejected)
  }
  
}

// 对单个 promise 进行状态迁移
const trasition = (promise, state, result) => {
  if(promise.state !== PENDING) return
  promise.state = state
  promise.result = result

}

Promise.prototype.then = function(onFulfilled, onRejected) {
  return new Promise((resolve, reject) =>{
    let callback = { onFulfilled, onRejected, resolve, reject }

    if(this.state === PENDING) {
      this.callbacks.push(callback)
    } else {
      setTimeout(() => handleCallback(callback, this.state, this.result), 0)
    }
  })
}


// 在当前 promise 和下一个 promise 之间进行状态传递
const handleCallback = (callback, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = callback
  try {
    if(state === FULLFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
    }
  } catch (error) {
    reject(error)
  }
}

// 对特殊的 result 进行特殊处理
const resolvePromise = (promise, result, resolve, reject) => {
  if (result === promise) {
    let reason = new TypeError('Can not fulfill promise with itself')
    return reject(reason)
  }
  if(isPromise(result)) {
    return result.then(resolve, reject)
  }
  if(isThenable(result)) {
    try {
      let then = result.then
      if (isFunction(then)) {
        return new Promise(then.bind(result)).then(resolve, reject)
      }
    } catch (error) {
      return reject(error)
    }
  }

  resolve(result)
}