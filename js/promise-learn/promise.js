
const isFunction = obj => typeof obj === 'function'
const isObject = obj => !!(obj && typeof obj === 'object')
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
const isPromise = promise => promise instanceof Promise
/* 
1.promise 有 3 个状态，分别是 pending, fulfilled 和 rejected。
在 pending 状态，promise 可以切换到 fulfilled 或 rejected，
反之不行
*/
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(f) {
  this.state = PENDING
  this.result = null
  // 存储then方法注册的callback
  this.callbacks = []

  let onFulfilled = (value) => transition(this, FULFILLED, value)
  let onRejected = (reason) => transition(this, REJECTED, reason)

  let ignore = false
  this.resolve = (value) => {
    if (ignore) return
    ignore = true
    resolvePromise(this, value, onFulfilled, onRejected)
  }
  let reject = (reason) => {
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

const handleCallbacks = (callbacks, state, result) => {
  while (callbacks.length) handleCallback(callbacks.shift(), state, result)
}

const transition = (promise, state, result) => {
  if (promise.state !== PENDING) return
  promise.state = state
  promise.result = result
  setTimeout(() => handleCallbacks(promise.callbacks, state, result), 0)
}

/* 2. then方法 
then 方法核心用途是，构造下一个 promise 的 result。
如果是pending，就存储进callbacks
如果是其他的，执行相应方法
*/
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

// handleCallback 函数，根据 state 状态，判断是走 fulfilled 路径，还是 rejected 路径。
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
/* 3.Promise Resolution Procedure */
const resolvePromise = (promise, result, resolve, reject) => {
  if (result === promise) {
    let reason = new TypeError('Can not fulfill promise with itself')
    return reject(reason)
  }
// 如果是promise，沿用它的状态
  if (isPromise(result)) {
    return result.then(resolve, reject)
  }
//  result 是一个 thenable 对象。先取 then 函数，再 call then 函数，
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


Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve,reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd;
}
module.exports = Promise;


Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() =>{
  console.log(6);
})

// 大家先思考一下

