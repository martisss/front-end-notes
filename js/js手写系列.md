# call

```js
Function.prototype.myCall = function(context) {
  let cxt = context || window
  cxt.fn = this
  let args = [...arguments].slice(1)
  let res = cxt.fn(...args)
  delete cxt.fn
  return res
}

// 测试一下
var foo = {
  value: 1
};

function bar(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value);
}

bar.myCall(foo); // 1
bar.myCall(foo, 'kevin', 18); 
// kevin
// 18
// 1
```

# apply

```js
Function.prototype.myCall = function(context, args=[]) {
  let cxt = context || window
  cxt.fn = this
  const res = cxt.fn(...args)
  delete cxt.fn
  return res
}
```

# bind

> bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )

```js
Function.prototype.myBind = function(context) {
  let self = this
  let args = [...arguments].slice(1)

  const fBind = function() {
    let bindArgs = [...arguments]
    // 当作为构造函数时，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
    // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
    return self.apply(this instanceof fBind ? this : context, args.concat(bindArgs))
  }
  // 实例可以继承绑定函数原型中的值
  //fBind.prototype = this.prototype
  //改为以下实现，避免修改绑定函数的原型
  temp.prototype = Object.create(this.prototype)
  return fBind
}
let Person = {
  name: 'Tom',
  say(age) {
      console.log(this)
      console.log(`我叫${this.name}我今年${age}`)
  }
}
Person.prototype.listen = function() {}

let Person1 = {
  name: 'Tom1'
}


// 搞定测试
let fn = Person.say.bind(Person1)
fn()
fn(18)
```

# 防抖

```js
function debounce(func, wait) {
  let timeout
  return function(){
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}
```

上述实现setTimeout中func的this指向window，需修改；JavaScript 在事件处理函数中会提供事件对象 event，上述实现在func函数中打印event是undefind，需修改

```js
function debounce(func, wait) {
  let timeout
  return function(){
    let args = arguments
    let context = this
    clearTimeout(timeout)
    timeout = setTimeout(func.apply(context, args), wait)
  }
}
```

# 节流

持续触发事件，每隔一段时间，只执行一次事件。

```js
function throttle(func, wait) {
  let prev = 0, context, args
  return function() {
    let now = +new Date()
    context = this
    args = arguments
    if(now-prev > wait) {
      func.apply(context, args)
      prev = now
    }
  }
}
```

## TODO

# 继承

## 原型链继承

```js
function Parent() {
  this.hobbies = ['swimming', 'running']
}


function Child(age) {
  this.age = age
}

Child.prototype = new Parent()

let child1 = new Child(12)
let child2 = new Child(13)

console.log(child1.hobbies)
child1.hobbies.push('boxing')
console.log(child2.hobbies)
```

两个问题：共用引用类型、子类型实例化时无法传参

## 借用构造函数继承

```js
function Parent(name) {
  this.hobbies = ['swimming', 'running']
  this.name = name
}


function Child(age, name) {
  Parent.call(this, name)
  this.age = age
}

let child1 = new Child(12, 'xiaohong')
let child2 = new Child(13, 'xiaoming')

console.log(child1.hobbies)
child1.hobbies.push('boxing')
console.log(child2.hobbies)
console.log(child1.name)
console.log(child2.name)	
```

解决了公用引用类型的问题，可以传参

缺点：子类实例化时方法会多次重复创建

## 组合继承

```js
function Parent(name) {
  this.hobbies = ['swimming', 'running']
  this.name = name
}

// 继承构造函数实例上的属性
function Child(age, name) {
  Parent.call(this, name)
  this.age = age
}

// 继承构造函数实例原型上的属性
Child.prototype = new Parent()
Child.prototype.constructor = Child

let child1 = new Child(12, 'xiaohong')
let child2 = new Child(13, 'xiaoming')

console.log(child1.hobbies)
child1.hobbies.push('boxing')
console.log(child2.hobbies)
console.log(child1.name)
console.log(child2.name)

```

缺点：父类构造函数调用了两次，导致子类实例和原型上存在同名属性

## 原型式继承

> 与原型链继承有相似之处

> 就是 ES5 Object.create 的模拟实现，**将传入的对象作为创建的对象的原型**

```js
function createObj(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
```

缺点: 与原型链继承一样, 引用类型的属性会被所有实例共享

## 寄生式继承

创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。可以看到内部使用了`Object.create()`，因此其本质上是**在原型式继承返回的新对象上增加了新的属性和方法，实现增强效果。**

```js
function createObj (o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```

缺点： 同借用构造函数继承，每次都会重新创建方法，且`Object.create()`执行浅复制，多个实例的引用类型指向相同，造成污染。

## 寄生组合式继承

```js
function Parent(name) {
  this.hobbies = ['swimming', 'running']
  this.name = name
}

// 继承构造函数实例上的属性
function Child(age, name) {
  Parent.call(this, name)
  this.age = age
}

// 继承构造函数实例原型上的属性
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

let child1 = new Child(12, 'xiaohong')
let child2 = new Child(13, 'xiaoming')

console.log(child1.hobbies)
child1.hobbies.push('boxing')
console.log(child2.hobbies)
console.log(child1.name)
console.log(child2.name)

```

## class 实现继承

```js
class Animal {
    constructor(name) {
        this.name = name
    } 
    getName() {
        return this.name
    }
}
class Dog extends Animal {
    constructor(name, age) {
        super(name)
        this.age = age
    }
}

```



# 类型判断

```js
function typeOf(target) {
  return Object.prototype.toString.call(target).slice(8,-1).toLowerCase()
}

// test
let date = new Date()
let set = new Set()
let num = 1
let num1 = Number(1)
console.log(typeOf(date))
console.log(typeOf(set))
console.log(typeOf(num))
console.log(typeOf(num1))
console.log(typeOf(null))
```

# 数组去重

> es6

```js
function unique(arr) {
  // return Array.from(new Set(arr))
  return [...new Set(arr)]
}

let unique = (arr) => [...new Set(arr)]
```

> es5

```js
function unique(arr) {
  return arr.filter((item, index, arr) => arr.indexOf(item) ===index)
}
```

# 数组扁平化

> 1

```js
const arr = [4,[1, [2, [3]]]]

function flatten(arr) {
  let res = []
  for(let item of arr) {
    if(Array.isArray(item)) {
      res = res.concat(flatten(item))
    } else {
      res.push(item)
    }
  }
  return res
}

console.log(flatten(arr))
```

> 2

```js
const arr = [4,[1, [2, [3]]]]

function flatten(arr) {
  return arr.reduce((res, cur) => res.concat(Array.isArray(cur) ? flatten(cur) : cur), [])
}

console.log(flatten(arr))
```

> 3

```js
const arr = [4,[1, [2, [3]]]]

function flatten(arr) {
  while(arr.some(item => Array.isArray(item))) {
    // 每次展平一层
    arr = [].concat(...arr)
  }
  return arr
}

console.log(flatten(arr))
```

> 4

```js
function* flatten(arr) {
    for(const item of arr) {
        if(Array.isArray(item)){
            yield* flatten(item)
        } else {
            yield item
        }
    }
}

console.log([...flatten([1,2,3,[1,[3,5]]])])
console.log(flatten([1,2,3,[1,[3,5]]]))}

```



# 深浅拷贝

对于数组来说

```js
arr.slice()
arr.concat()
//es6
newArr = [...arr]
Array.from(arr)

let arr  = [1, null, 2, undefined, function(){}]

JSON.parse(JSON.stringify(arr))
```

> JSON.stringify(..) 在对象中遇到 undefined 、 function 和 symbol 时会自动将其忽略， 在 数组中则会返回 null （以保证单元位置不变）
>
> 对包含循环引用的对象执行 JSON.stringify(..) 会出错。

## 浅拷贝

```js
function deepClone(obj) {
  if(typeof obj !== 'object') return
  let newObj = obj instanceof Array ? [] : {}
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}
```

> 值为null时深拷贝为其赋值一个空对象
>
> ```js
> deepCopy({
>         value: null
> })
> ```

## 深拷贝

```js
function deepClone(obj) {
  if(obj === null || typeof obj !== 'object') return obj
  let newObj = obj instanceof Array ? [] : {}
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return newObj
}

let arr = [null ,[{name: 1, age: 2},{name: 2, age: 3}], 4,5, undefined]
console.log(deepClone(arr))
```

简单版深拷贝：只考虑普通对象属性，不考虑内置对象和函数。

## 深度比较

```js
  function isObject(obj) {return !!(obj && typeof obj === 'object')}
  function isEqual(obj1, obj2) {
    if(!isObject(obj1) || !isObject(obj2)) return obj1 === obj2
    if(obj1 === obj2) return true
    // 都是对象或者数组，且不相等
    let keys1 = Object.keys(obj1)
    let keys2 = Object.keys(obj2)
    if(keys1.length !== keys2.length) return false
    for(let key in keys1) {
      const res = isEqual(obj1[key], obj2[key])
      if(!res) return false
    }
    return true
  }
```

## 将URL参数解析成JS对象

```js
  function queryToObj() {
    const res = {}
    const search = location.search.substr(1)
    search.split('&').forEach(str => {
      const arr = str.split('=')
      const key = arr[0]
      const val = arr[1]
      res[key] = val
    })
    return res
  }


  function queryToObj() {
    const res = {}
    const pList = new URLSearchParams(location.search)
    for(const [key, val] of pList) {
      res[key] = val
    }
    return res
  }
```



# new 

```js
function myNew(fn, ...args){
  let obj = Object.create(fn.prototype)
  let res = fn.apply(obj, args)
  return typeof res === 'object' ? res : obj
}

function person(name, age) {
  this.name = name
  this.age = age
}

let p = myNew(person, 'MM', 12)
console.log(p) 


```

# instanceof

> 判断构造函数的prototype是否出现在实例的原型链上

```js
function instanceOf(left, right) {
  let proto = left.__proto__
  // let proto = Object.getPrototypeOf(left)
  while(true) {
    if(proto === null) return true
    if(proto === right.prototype) return true
    proto = proto.__proto__
  }
}
```

# Object.create()

```js
Object.newCreate = function(obj) {
  function F(){}
  F.prototype = obj
  let res = new F()
  if(obj == null) res.__proto__ = null
  return res
}

let obj = {name: '1'}
console.log(Object.newCreate(null).__proto__ == null)
```

# Object.assign()

```js
Object.assign = (obj, ...source) => {
  if(obj == null) return new TypeError()
  let res = Object(obj)
  source.forEach( item => {
    for(let key in item) {
      if(item.hasOwnProperty(key)) {
        res[key] = item[key]
      }
    }
  })
  return res
}
```

# 图片懒加载

```js
    const lazyLoad = function (loadingUrl, targetUrl) {
      let imgNode = document.createElement('img')
      document.body.appendChild(imgNode)
      imgNode.src = loadingUrl
      let image = new Image()
      // 图片加载完成之前放一张占位图
      // 模拟图片加载延时
      // setTimeout(() => {
      //   image.src = targetUrl
      // }, 3000)
      image.src = targetUrl
      image.onload = image.onerror = () => imgNode.src= image.src
    }
```



# 数组

```js
Array.prototype._forEach = function(callback, thisArgs) {
  if(!this) throw new TypeError('this is null or not defined')
  if(typeof callback !== 'function') return new TypeError('callback is not a function')
  let O = this
  let len = this.length
  let k = 0
  for(; k<len; k++) {
    if(k in O) {
      callback.call(thisArgs, O[k], k, O)
    }
  }
}
Array.prototype._map = function(callback, thisArgs) {
  if(!this) throw new TypeError('this is null or not defined')
  if(typeof callback !== 'function') return new TypeError('callback is not a function')
  let O = this
  let res = []
  let len = this.length
  let k = 0
  for(; k<len; k++) {
    if(k in O) {
      res.push(callback.call(thisArgs, O[k], k, O))
    }
  }
  return res
}

Array.prototype._filter = function(callback, thisArgs) {
  if(!this) throw new TypeError('this is null or not defined')
  if(typeof callback !== 'function') return new TypeError('callback is not a function')
  let O = this
  let res = []
  let len = this.length
  let k = 0
  for(; k<len; k++) {
    if(k in O) {
      if(callback.call(thisArgs, O[k], k, O)) {
        res.push(O[k])
      }
    }
  }
  return res
}

Array.prototype._some = function(callback, thisArgs) {
  if(!this) throw new TypeError('this is null or not defined')
  if(typeof callback !== 'function') return new TypeError('callback is not a function')
  let O = this
  let len = this.length
  let k = 0
  for(; k<len; k++) {
    if(k in O) {
      if(callback.call(thisArgs, O[k], k, O)) {
        return true
      }
    }
  }
  return false
}
Array.prototype._reduce = function(callback, initialValue) {
  if(!this) throw new TypeError('this is null or not defined')
  if(typeof callback !== 'function') return new TypeError('callback is not a function')
  let O = this, acc
  let len = this.length
  let k = 0
  if(arguments.length>1) {
    acc = initialValue
  } else {
    while(k<len && !(k in O)) {
      k++
    }
    if(k>len) {
      throw new TypeError( 'Reduce of empty array with no initial value' );
    }
    acc = O[k++]
    while(k<len) {
      if(k in O ) {
        acc = callback(acc, O[k], k ,O)
      }
      k++
    }
  }
  return acc
}



let arr = [1,2,3,4,55,6]
console.log(arr._reduce((acc, item) => item+acc, 0))
// console.log(arr)


```



## forEach

```js

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T, k;
    // 调用者不能为空
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    // 数组长度
    // 转保证转换后的值为正整数，->转为number,转为32位整型
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

```

## map

```js
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, k;
    // 调用者不能为空
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    // 数组长度
    // 转保证转换后的值为正整数，->转为number,转为32位整型
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    let res = []
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        res[k] = callback.call(T, kValue, k, O);
      }
      k++;
    }
    return res
  };
}
```

## filter

```js
if (!Array.prototype.filter) {
  Array.prototype.filter = function(callback, thisArg) {
    var T, k;
    // 调用者不能为空
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    // 数组长度
    // 转保证转换后的值为正整数，->转为number,转为32位整型
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    let res = [], k=0
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        if(res[k] = callback.call(T, kValue, k, O)) {
          res.push(O[k])
        }
      }
      k++;
    }
    return res
  };
}
```

## some

```js
if (!Array.prototype.some) {
  Array.prototype.some = function(callback, thisArg) {
    var T, k;
    // 调用者不能为空
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    // 数组长度
    // 转保证转换后的值为正整数，->转为number,转为32位整型
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    let k=0
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        if(callback.call(T, kValue, k, O)) {
          return true
        }
      }
      k++;
    }
    return false
  };
}
```

## every

```js
if (!Array.prototype.every) {
  Array.prototype.every = function(callback, thisArg) {
    var T, k;
    // 调用者不能为空
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    // 数组长度
    // 转保证转换后的值为正整数，->转为number,转为32位整型
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    let k=0
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        if(!callback.call(T, kValue, k, O)) {
          return false
        }
      }
      k++;
    }
      
    return true
  };
}
```

# Promise

```js

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
  let resolve = (value) => {
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
 
```

## Promise.resolve

```js
Promise.resolve = value => {
  if(value instanceof Promise) return value
  return new Promise(resolve => resolve(value))
}
```

## Promise.reject

```js
Promise.reject = value => {
  return new Promise((resolve, reject) => reject(value))
}
```

## Promise.all

```js
Promise.all = promiseArr => {
  return new Promise((resolve, reject) => {
    let index = 0, res = []
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        index++
        res[i] = val
        if(index === promiseArr.length) resolve(res)
      },
      err => reject(err))
    })
  })
}
```

## Promise.race

```js
Promise.race = function(promiseArr) {
    return new Promise((resolve, reject) => {
        promiseArr.forEach(p => {
            Promise.resolve(p).then(val => {
                resolve(val)
            }, err => {
                reject(err)
            })
        })
    })
}

```

## Promise.allSettled

> 以数组形式返回promise数组的中每个promise settled的结果

```js
Promise.allSettled = promiseArr => {
  return new Promise((resolve, reject) => {
    let res = []
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        val => {
          res.push({
            status: 'fulfilled',
            value: val
          })
          if(res.length === promiseArr.length) resolve(res)
        },
        err => {
          res.push({
            status: 'rejected',
            reason: err
          })
          if(res.length === promiseArr.length) resolve(res)
        }
      )
    })
  })
}
```

## Promise.any

```js
Promise.any = function(promiseArr) {
    let index = 0
    return new Promise((resolve, reject) => {
        if (promiseArr.length === 0) return 
        promiseArr.forEach((p, i) => {
            Promise.resolve(p).then(val => {
                resolve(val)
                
            }, err => {
                index++
                if (index === promiseArr.length) {
                  reject(new AggregateError('All promises were rejected'))
                }
            })
        })
    })
}

```

## 最大并发控制实现方式

```js
function concurrentPoll() {
    this.tasks = []
    this.max = 10
    setTimeout(() => {
        this.run()
    }, 0)
}

concurrentPoll.prototype.addTask = function(task) {
    this.tasks.push(task)
}

concurrentPoll.prototype.run = function() {
    if(this.tasks.length === 0) return
    let min = Math.min(this.tasks.length, this.max)
    for(let i=0; i<min; i++) {
        let task = this.tasks.shift()
        this.max--
        task().then(res => {
            console.log(res)
        }).catch(err => console.log(err))
        .finally(() => {
            this.max++
            this.run()
        })
    }
}

const poll = new concurrentPoll(); // 实例
for (let i = 0; i < 100; i++) { // 数据模拟
    poll.addTask(function () {
        return new Promise(
            function (resolve, reject) {
                setTimeout(() => resolve(i), 700)
            }
        )
    })
}
```

# 其他

## 括号匹配

```js
var isValid = function(s) {
    if(s.length % 2 === 1) return false
    let stack = []
    let match = new Map([
        [')', '('],
        ['}', '{'],
        [']', '['],
    ])
    for(let ch of s) {
        if(match.has(ch)) {
            // 不匹配直接返回结果 false
            if(!stack.length || stack[stack.length-1] !== match.get(ch)) return false
            // 匹配之后要消去辅助栈栈顶的元素
            stack.pop()
        } 
        // 如果是左括号，直接入栈
        else {
            stack.push(ch)
        }
    }
    return !stack.length
};
```

