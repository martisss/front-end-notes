const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const isFunction = obj => typeof obj === 'function'
const isObject = obj => obj && typeof obj === 'object'
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
const isPromise = promise => promise instanceof Promise

function Promise(f) {
  this.state = PENDING
  this.result = null
  this.callbacks = []

  // 切换到 fulfilled 状态
  // 切换到 rejected 状态
  let onFulfilled = value => transition(this, FULFILLED, value)
  let onRejected = reason => transition(this, REJECTED, reason)

  // 确保 resolve/reject 只有一次调用作用
  let ignore = false
  let resolve = value => {
    if (ignore) return
    ignore = true
    resolvePromise(this, value, onFulfilled, onRejected)
  }
  let reject = reason => {
    if (ignore) return
    ignore = true
    onRejected(reason)
  }

  try {
    f(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

// then 方法的核心用途是构建下一个promise的状态
Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    let callback = { onFulfilled, onRejected, resolve, reject }

    if (this.state === PENDING) {
      this.callbacks.push(callback)
    } else {
      setTimeout(() => handleCallback(callback, this.state, this.result), 0)
    }
  })
}
// 在当前状态和下一个 promise 之间进行状态传递
const handleCallback = (callback, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = callback
  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
    }
  } catch (error) {
    reject(error)
  }
}


const handleCallbacks = (callbacks, state, result) => {
  while(callbacks.length) handleCallback(callbacks.shift(), state, result)
}

// 对单个 promise 状态进行迁移
const transition = (promise, state, result) => {
  if (promise.state !== PENDING) return
  promise.state = state
  promise.result = result
  // 当状态变更时，异步清空所有 callbacks
  setTimeout(() => handleCallbacks(promise.callbacks, state, result), 0)
}

// 对特殊的result进行处理
const resolvePromise = (promise, result, resolve, reject) => {
  // 如果 result 是本身，抛出TypeError错误
  if (result === promise) {
    let reason = new TypeError('Can not fulfill promise with itself')
    return reject(reason)
  }

  // 如果是一个promise, 沿用它的state和result状态
  if (isPromise(result)) {
    return result.then(resolve, reject)
  }

  // 如果 result 是一个 thenable 对象。先取 then 函数，再 call then 函数，
  // 重新进入 The Promise Resolution Procedure 过程。
  if (isThenable(result)) {
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




Promise.defer = Promise.deferred = function(){
  let dfd = {};
  dfd.promise = new Promise((resolve, reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd;
}
module.exports = Promise;