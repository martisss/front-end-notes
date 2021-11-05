const isFunction = obj => typeof obj === 'function'
const isObject = obj => !!(obj && typeof obj === 'object')
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
const isPromise = promise => promise instanceof Promise

/* 2.1 */
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(f) {

  this.state = PENDING
  this.result = null
  this.callbacks= []

  let onFulfilled = value => transition(this, FULFILLED, value);
  let onRejected = reason => transition(this, REJECTED, reason);

  // 保证 resolve/reject 只有一次调用作用
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

  try{
    f(resolve, reject)
  } catch(error) {
    reject(error)
  }
}


/* 2.2 */
/* then 方法核心用途是，构造下一个 promise 的 result。 */
Promise.prototype.then = function(onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    let callback = { onFulfilled, onRejected, resolve, reject }

    if(this.state === PENDING) {
      this.callbacks.push(callback)
    } else {
      setTimeout(() => handleCallback(callback, this.state, this.result), 0)
    }
  })
}

/* handleCallback 函数，根据 state 状态，判断是走 fulfilled 路径，
还是 rejected 路径。 在当前 promise 和下一个 promise 之间进行状态传递。*/
const handleCallback = (callback, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = callback
  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
    }
  } catch(error) {
    reject(error)
  }
}

const handleCallbacks = (callback, state, result) => {
  while (callbacks.length) handleCallback(callbacks.shift(), state, result)
}

// 对单个 promise 进行状态迁移。
const transition = (promise, state, result) => {
  if(promise.state !== PENDING) return
  promise.state = state
  promise.result = result
  // 当状态变更时，异步清空所有 callbacks
  setTimeout(() => handleCallbacks(promise.callbacks, state, result), 0)
}

/* The Promise Resolution Procedure 一些特殊的 value 被 resolve 时，要做特殊处理 */
const resolvePromise = (promise, result, resolve, reject) => {
  // 第一步，如果 result 是当前 promise 本身，就抛出 TypeError 错误。
  if(result === promise) {
    let reason = new TypeError('Can not fulfill promise with itself')
    return reject(reason)
  }
  // 第二步，如果 result 是另一个 promise，那么沿用它的 state 和 result 状态。
  if(isPromise(result)) {
    return result.then(resolve, reject)
  }
  // 如果 result 是一个 thenable 对象。先取 then 函数，再 call then 函数，
  // 重新进入 The Promise Resolution Procedure 过程。
  if(isThenable(result)) {
    try {
      let then = result.then
      if(isFunction(then)) {
        return new Promise(then.bind(result)).then(resolve)
      }
    } catch(error) {
      return reject(error)
    }
  }
  // 最后，如果不是上述情况，这个 result 成为当前 promise 的 result。
  resolve(result)
}

// 实现一个promise的延迟对象 defer
Promise.defer = Promise.deferred = function(){
  let dfd = {};
  dfd.promise = new Promise((resolve, reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd;
}
module.exports = Promise;