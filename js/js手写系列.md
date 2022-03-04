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

## todo



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
    timeout = setTimeout(func.apply(this, args), wait)
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

let arr = [null ,null, 4,5]
console.log(deepClone(arr))
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

