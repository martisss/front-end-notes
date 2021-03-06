# call :bulb:

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

# apply :bulb:

```js
Function.prototype.myCall = function(context, args=[]) {
  let cxt = context || window
  cxt.fn = this
  const res = cxt.fn(...args)
  delete cxt.fn
  return res
}
```

# bind :tada:

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
  fBind.prototype = Object.create(this.prototype)
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

# 防抖 :bulb:

事件触发后延迟一段时间后再执行回调，如果这段时间内再次触发事件，则重新计时

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
const debounce = (func, delay) => {
  // 通过闭包取得上一次的timeout
  let timeout
  return function() {
    let context = this
    let args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), delay)
  }
}
```

# 节流 :bulb:

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

# 继承 :bulb:

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



# 类型判断 :bulb:

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

# 数组去重 :bulb:

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

# 数组扁平化 :bulb:

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
console.log(flatten([1,2,3,[1,[3,5]]]))

```



# 深浅拷贝 :bulb:

## 浅拷贝

针对数组

```js
arr.slice()
arr.concat()
//es6
newArr = [...arr]
Array.from(arr)
```

针对对象

```js
Object.assign({}, target)

let clone = {...user}
```



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

对于数组来说

```js

let arr  = [1, null, 2, undefined, function(){}]

JSON.parse(JSON.stringify(arr))
```

> JSON.stringify(..) 在对象中遇到 undefined 、 function 和 symbol 时会自动将其忽略， 在 数组中则会返回 null （以保证单元位置不变）
>
> 对包含循环引用的对象执行 JSON.stringify(..) 会出错。

https://segmentfault.com/a/1190000020255831

```js
function deepClone(obj) {
    //判断是否是对象
  if(obj === null || typeof obj !== 'object') return obj
    //判断是数组还是普通对象
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
     //1. 不是对象，直接判断是否相等
    if(!isObject(obj1) || !isObject(obj2)) return obj1 === obj2
      //2. 是对象，引用相同，是同一对象，返回true
    if(obj1 === obj2) return true
    // 3. 都是对象或者数组，且不相等
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

# 将URL参数解析成JS对象 :bulb:

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



# new :bulb:

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

# instanceof :bulb:

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

# Object.create() :bulb:

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

# 图片懒加载 :bulb:

## 监听scroll + 节流

```js
// img节点列表，图片请求地址在data-src属性中，可通过img.dataset.src取得
let imgList = [...document.querySelectorAll('img')]
let length = imgList.length

const imgLazyLoad = (function(){
  let count = 0
  return function() {
    let deletedIndex = []
    imgList.forEach((img, index) => {
      let rect = img.getBoundingClientRect()
      if(rect.top<window.innerHeight) {
        img.src = img.dataset.src
        deletedIndex.push(index)
        count++
      }
    })
    if(count === length) { document.removeEventListener('scroll', imgLazyLoad)}
    imgList = imgList.filter((img, index)=> !deletedIndex.includes(index))
  }
})()

const throttle = function(fn, delay) {
  let cxt, pre = 0
  return () => {
    cxt = this
    let args = arguments
    let now = +new Date()
    if(now-pre>delay) {
      fn.apply(cxt, args)
    }
    pre = now
  }
}

document.addEventListener('scroll', throttle(fn, 500))
```

## intersectionObserver

```js
let imgList = [...document.querySelectorAll('img')]

const imgLazyLoad = function() {
  const io = new IntersectionObserver(inters => {
    inters.forEach((item, index) => {
      if(item.isIntersecting) {
        item.target.src = img.target.dataset.src
        io.unobserve(item.target)
      }
    })
  })
  imgList.forEach(el => io.observe(el))
}

const throttle = function(fn, delay) {
  let cxt, pre=0, args
  return function() {
    args = arguments
    cxt = this
    let now = +new Date()
    if(now-pre) {
      fn.apply(cxt, args)
      pre = now
    }
  }
}

document.addEventListener('scroll', throttle(imgLazyLoad))
```



# 数组 :bulb:

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

# Promise :bulb:

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
        if(res.length === promiseArr.length) resolve(res)
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
            Promise.resolve(p).then(
                val => {
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

## 扁平数据和树形数据互转

```js
let arr = [
    {
        id: '02',
        name: '小亮',
        pid: '01',
        job: '产品leader',
    },
    {
        id: '01',
        name: '张大大',
        pid: '',
        job: '项目经理',
    },
    {
        id: '03',
        name: '小美',
        pid: '01',
        job: 'UIleader',
    },
    {
        id: '04',
        name: '老马',
        pid: '01',
        job: '技术leader',
    },
    {
        id: '05',
        name: '老王',
        pid: '01',
        job: '测试leader',
    },
    {
        id: '06',
        name: '老李',
        pid: '01',
        job: '运维leader',
    },
    {
        id: '07',
        name: '小丽',
        pid: '02',
        job: '产品经理',
    },
    {
        id: '08',
        name: '大光',
        pid: '02',
        job: '产品经理',
    },
    {
        id: '09',
        name: '小高',
        pid: '03',
        job: 'UI设计师',
    },
    {
        id: '10',
        name: '小刘',
        pid: '04',
        job: '前端工程师',
    },
    {
        id: '11',
        name: '小华',
        pid: '04',
        job: '后端工程师',
    },
    {
        id: '12',
        name: '小李',
        pid: '04',
        job: '后端工程师',
    },
    {
        id: '13',
        name: '小赵',
        pid: '05',
        job: '测试工程师',
    },
    {
        id: '14',
        name: '小强',
        pid: '05',
        job: '测试工程师',
    },
    {
        id: '15',
        name: '小涛',
        pid: '06',
        job: '运维工程师',
    },
]



// 1. 嵌套结构
// 2. 嵌套结构中的每一项多了children属性
function toTree (arr) {
    // 最终返回的结果
    let tree = []
    let map = {}
    for (let item of arr) {
        map[item.id] = {
            ...item,
            children: [],
        }
    }
    for (let item of arr) {
        let newItem = map[item.id]
        let parent = map[item.pid]
        parent ? parent.children.push(newItem) : tree.push(newItem)
    }
    return tree
}
console.log(toTree(arr))



let tree = [
    {
        id: '01',
        name: '张大大',
        pid: '',
        job: '项目经理',
        children: [
            {
                id: '02',
                name: '小亮',
                pid: '01',
                job: '产品leader',
                children: [
                    {
                        id: '07',
                        name: '小丽',
                        pid: '02',
                        job: '产品经理',
                        children: [],
                    },
                    {
                        id: '08',
                        name: '大光',
                        pid: '02',
                        job: '产品经理',
                        children: [],
                    },
                ],
            },
            {
                id: '03',
                name: '小美',
                pid: '01',
                job: 'UIleader',
                children: [
                    {
                        id: '09',
                        name: '小高',
                        pid: '03',
                        job: 'UI设计师',
                        children: [],
                    },
                ],
            },
            {
                id: '04',
                name: '老马',
                pid: '01',
                job: '技术leader',
                children: [
                    {
                        id: '10',
                        name: '小刘',
                        pid: '04',
                        job: '前端工程师',
                        children: [],
                    },
                    {
                        id: '11',
                        name: '小华',
                        pid: '04',
                        job: '后端工程师',
                        children: [],
                    },
                    {
                        id: '12',
                        name: '小李',
                        pid: '04',
                        job: '后端工程师',
                        children: [],
                    },
                ],
            },
            {
                id: '05',
                name: '老王',
                pid: '01',
                job: '测试leader',
                children: [
                    {
                        id: '13',
                        name: '小赵',
                        pid: '05',
                        job: '测试工程师',
                        children: [],
                    },
                    {
                        id: '14',
                        name: '小强',
                        pid: '05',
                        job: '测试工程师',
                        children: [],
                    },
                ],
            },
            {
                id: '06',
                name: '老李',
                pid: '01',
                job: '运维leader',
                children: [
                    {
                        id: '15',
                        name: '小涛',
                        pid: '06',
                        job: '运维工程师',
                        children: [],
                    },
                ],
            },
        ],
    },
]

function toArr(tree, arr=[]) {
    for(let item of tree) {
        const {children, ...newItem} = item
        arr.push(newItem)
        if(children) {
            toArr(children,arr)
        }
    }
    return arr
}
console.log(toArr(tree))
```

# 柯里化 :bulb:

```js

function Curry(fn) {
  let curryF = (...args) => {
    if(fn.length === args.length) return fn(...args)
    return (...arg) => curryF(...args, ...arg)
  }
  return curryF
}
```



手写快排

手写深拷贝

手写红包算法（注意均衡分配和浮点数计算精度问题）

将奇数排在前面，偶数排在后面。要求时间复杂度O(n)。空间复杂度O(1)（不能用splice）

解析出URL中所有的部分

实现一个compare函数，比较两个对象是否相同

螺旋矩阵

大数相加

找出出现次数最多的英语单词

节点倒序（将ul.id=list，将ul节点下的10000个li节点倒序。考虑性能。）

实现一个函数计算 "1+12-31+100-93"

判断链表是否有环

手写useReducer

手写useDidMount

手写useDidUpdate，模拟componentDidUpdate

手写usePrevious

爬楼梯

删除单向链表中的某个节点

柯里化

中划线转大写

千位分割

使用es5实现es6的let关键字

