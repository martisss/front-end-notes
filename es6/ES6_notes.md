# 前言

ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。

# 0. let & const

ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效

另外，for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
```
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);}
// abc
// abc
// abc
```
上面代码正确运行，输出了 3 次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域。
## a. let 命令

### let 不存在变量提升
let 不存在变量提升，所声明的变量一定要在声明后使用，否则报错。
var命令会发生“变量提升”现象，即变量可以在声明之前使用，值为undefined。

### 暂时性死区
**含义：ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。（ReferenceError）**
### 不允许重复性声明
let不允许在相同作用域内，重复声明同一个变量。

## b. 块级作用域
#### 为什么需要块级作用域？

ES5 只有全局作用域和函数作用域，没有块级作用域
缺点：
- 内层变量可能会覆盖外层变量。
```
var tmp = new Date();

function f() {
  console.log(tmp);
  if (false) {
    var tmp = 'hello world';
  }}

f(); // undefined
```
- 用来计数的循环变量泄露为全局变量。
```
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);}

console.log(i); // 5
```
#### ES6 的块级作用域

ES6 允许块级作用域的任意嵌套，内层作用域可以定义外层作用域的同名变量。块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了

#### 块级作用域与函数声明
区别：
- ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。
- ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。

**但是浏览器中的实现规则不一样。
考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。**

ES6 在附录 B里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。

1. 允许在块级作用域内声明函数。
2. 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
3. 函数声明还会提升到所在的块级作用域的头部。
- ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。
## c. const命令

#### 基本用法

- const声明一个只读的常量。一旦声明，常量的值就不能改变。
- 对于const来说，只声明不赋值，就会报错
- const的作用域与let命令相同：只在声明所在的块级作用域内有效。
- const命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用
- 不可重复声明

#### 本质

const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。
对于简单类型，值保存在变量指向的内存地址
对于复合类型，变量指向的内存地址所保存的是指向实际数据的指针

tips：将一个对象冻结，使用Object.freeze方法
```

const foo = Object.freeze({});
// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```
一个将对象彻底冻结的函数（将对象的属性也冻结）
```
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });};
```
#### ES6 声明变量的六种方法

var function (ES5)
let const  import class

## d. 顶层对象的属性
顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。

ES6 为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。

## e. globalThis对象
- 浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
- 浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。
- Node 里面，顶层对象是global，但其他环境都不支持。

同一段代码为了能够在各种环境，都能取到顶层对象，现在一般是使用this关键字，但是有局限性。
- 全局环境中，this会返回顶层对象。但是，Node.js 模块中this返回的是当前模块，ES6 模块中this返回的是undefined。
- 函数里面的this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this会指向顶层对象。但是，严格模式下，这时this会返回undefined。
- 不管是严格模式，还是普通模式，new Function('return this')()，总是会返回全局对象。但是，如果浏览器用了 CSP（Content Security Policy，内容安全策略），那么eval、new Function这些方法都可能无法使用。
综上所述，很难找到一种方法，可以在所有情况下，都取到顶层对象。下面是两种勉强可以使用的方法。
```
// 方法一
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// 方法二
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```

# 1. 变量的解构赋值
## a. 数组的解构赋值
### 基本用法
**完全解构**  等号两边的模式相同，解构不成功，undefined
**不完全解构**  即等号左边的模式，只匹配一部分的等号右边的数组 
```
let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4
```
如果等号的右边不是数组（或者严格地说，不是可遍历的结构），那么将会报错
### 默认值
-解构赋值允许指定默认值
```
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```
只有当一个数组成员严格等于undefined，默认值才会生效。
- 如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。
- 默认值可以引用解构赋值的其他变量，但该变量必须已经声明。
```
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

## b. 对象的解构赋值
### 与数组解构的差异

数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。
### 指定默认值
默认值生效的条件是，对象的属性值严格等于undefined
### 注意点
注意点
（1）如果要将一个已经声明的变量用于解构赋值，必须非常小心。
```
// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error
```
上面代码的写法会报错，因为 JavaScript 引擎会将{x}理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。
```
// 正确的写法
let x;
({x} = {x: 1});
```
上面代码将整个解构赋值语句，放在一个圆括号里面，就可以正确执行。关于圆括号与解构赋值的关系，参见下文。

（2）解构赋值允许等号左边的模式之中，不放置任何变量名。因此，可以写出非常古怪的赋值表达式。
```
({} = [true, false]);
({} = 'abc');
({} = []);
```
上面的表达式虽然毫无意义，但是语法是合法的，可以执行。

（3）由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。
```
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```
上面代码对数组进行对象解构。数组arr的0键对应的值是1，[arr.length - 1]就是2键，对应的值是3。方括号这种写法，属于“属性名表达式”
## c. 字符串的解构赋值
字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象。
```
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```
类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。
```
let {length : len} = 'hello';
len // 5
```
## d. 数值和布尔值的解构赋值
解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错
```
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true

let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```
## e. 函数参数的解构赋值
```
function add([x, y]){
  return x + y;
}

add([1, 2]); // 3

//函数参数解构也可以指定默认值
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

//undefined就会触发函数参数的默认值。
[1, undefined, 3].map((x = 'yes') => x);
// [ 1, 'yes', 3 ]
```
## f. 圆括号问题
建议只要有可能，就不要在模式中放置圆括号。
以下三种解构赋值不得使用圆括号。
（1）变量声明语句
（2）函数参数  （属于变量声明）
（3）赋值语句的模式
```
// 全部报错
({ p: a }) = { p: 42 };
([a]) = [5];
上面代码将整个模式放在圆括号之中，导致报错。

// 报错
[({ p: a }), { x: c }] = [{}, {}];
上面代码将一部分模式放在圆括号之中，导致报错。
```
可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。
```
[(b)] = [3]; // 正确
({ p: (d) } = {}); // 正确
[(parseInt.prop)] = [3]; // 正确
```
## g. 用途
- 交换变量值
- 从函数返回多个值
```
// 返回一个数组

function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```
- 函数参数的定义
```
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```
- 提取JSON数据
```
//快速提取 JSON 数据的值。
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```
- 指定函数参数的默认值
```
指定参数的默认值，就避免了在函数体内部再写var foo = config.foo || 'default foo';这样的语句。
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
``` 
- 遍历Map结构
```
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```
如果只想获取键名，或者只想获取键值，可以写成下面这样。
```
// 获取键名
for (let [key] of map) {
  // ...
}

// 获取键值
for (let [,value] of map) {
  // ...
}
```
- 输入模块的指定方法
```
const { SourceMapConsumer, SourceNode } = require("source-map");
```
# 2. 字符串的扩展
## a. 字符的Unicode表示法
允许采用\uxxxx形式表示一个字符，其中xxxx表示字符的 Unicode 码点
[详见](https://es6.ruanyifeng.com/#docs/string)
## b. 字符串的遍历器接口
- 字符串可以被for...of循环遍历
- 以识别大于0xFFFF的码点，传统的for循环无法识别这样的码点
```
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "    

for (let i of text) {
  console.log(i);
}
// "𠮷"    正确识别
```
## c. 直接输入U+2028 和 U+2029
JavaScript 规定有5个字符，不能在字符串里面直接使用，只能使用转义形式。
U+005C：反斜杠（reverse solidus)
U+000D：回车（carriage return）
U+2028：行分隔符（line separator）
U+2029：段分隔符（paragraph separator）
U+000A：换行符（line feed）
[详见](https://es6.ruanyifeng.com/#docs/string)
## d. JSON.stringfy()的改造
[详见](https://es6.ruanyifeng.com/#docs/string)
JSON.stringify()的问题在于，它可能返回0xD800到0xDFFF之间的单个码点。

UTF-8 标准规定，0xD800到0xDFFF之间的码点，不能单独使用，必须配对使用。比如，\uD834\uDF06是两个码点，但是必须放在一起配对使用，代表字符𝌆。这是为了表示码点大于0xFFFF的字符的一种变通方法。单独使用\uD834和\uDFO6这两个码点是不合法的，或者颠倒顺序也不行，因为\uDF06\uD834并没有对应的字符。

**ES2019 改变了JSON.stringify()的行为。如果遇到0xD800到0xDFFF之间的单个码点，或者不存在的配对形式，它会返回转义字符串，留给应用自己决定下一步的处理**
## e. 模板字符串
使用反引号 ``, 在模板字符串中使用反引号要加反斜杠
**注：** 
- 如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。
- 模板字符串中嵌入变量名写在``${}``中，{}中可以放入任意JavaScript表达式，引用对象属性，或者调用函数
## f. 实例： 模板编译
##### **待填充**
## g. 标签模板
#### **看晕了**
## e. 模板字符串的限制
#### **待。。。**

# 3. 字符串的新增方法
## a. String.fromCodePoint()
ES5 提供String.fromCharCode()方法，用于从 Unicode 码点返回对应字符，但是这个方法不能识别码点大于0xFFFF的字符。
ES6 提供了String.fromCodePoint()方法，可以识别大于0xFFFF的字符，弥补了String.fromCharCode()方法的不足。在作用上，正好与下面的codePointAt()方法相反。
```
String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
```
上面代码中，如果String.fromCodePoint方法有多个参数，则它们会被合并成一个字符串返回。

注意，fromCodePoint方法定义在String对象上，而codePointAt方法定义在字符串的实例对象上。
## b. String.raw()
该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，往往用于模板字符串的处理方法。
```
String.raw`Hi\n${2+3}!`
// 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"

String.raw`Hi\\n`
// 返回 "Hi\\\\n"

String.raw`Hi\\n` === "Hi\\\\n" // true
```
## c. codePointAt()
JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符。
```
//
let s = '𠮷a';

for(let item of s) {
  console.log(item.codePointAt(0).toString())
}

let arr = [...s]
arr.forEach(item => console.log(item.codePointAt(0).toString(16)))
```
## d. 实例方法：normalize()
用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。
[详见 字符串的扩展方法](https://es6.ruanyifeng.com/#docs/string-methods)
## e. 实例方法 includes(), startsWith(), endsWith()
之前只提供了indexOf方法
- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
三个方法都支持第二个参数，表示开始搜索的位置。
## f. 实例方法 repeat()
repeat方法返回一个新字符串，表示将原字符串重复n次。
- 参数如果是小数，会被取整。-1到0之间的小数视为0（事先取整）
- 参数NaN等同于 0。
- 如果repeat的参数是字符串，则会先转换成数字。
- repeat的参数是负数或者Infinity，会报错。（除-1 到 0之间的小数）
## g. 实例方法：padStart(), padEnd()
在字符串头部或者尾部用指定字符串补全
```
'x'.padStart(4, 'ab') // 'abax'
省略第二个参数，采用空格补全
'x'.padEnd(5, 'ab') // 'xabab'
```
padStart()的常见用途是为数值补全指定位数。下面代码生成 10 位的数值字符串
```
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"
```
另一个用途是提示字符串格式。
```
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```
## h. trimStart(), trimEnd()
消除头部尾部的空格，与trim一致
对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。
## i. matchAll()
matchAll()方法返回一个正则表达式在当前字符串的所有匹配，详见《正则的扩展》
## j. replaceAll()
之前的replace()只能替换第一个匹配
```
let a = 'aabbcc'
console.log(a.replace('b','v'))

'aabbcc'.replace(/b/g, '_')
```
replaceAll() 
[详见](https://es6.ruanyifeng.com/#docs/string-methods)
# 4. 正则的扩展
#### 待填充
# 5. 数值的扩展
## a. 二进制八进制表示（0b 0B 0o 0O
如果要将0b和0o前缀的字符串数值转为十进制，要使用Number方法）
```
Number('0b111')  // 7
Number('0o10')  // 8
```
## b. 数值分隔符  （-）
## c. Number.isFinite(), Number.isNaN()
与全局的isFinite(),isNaN()不同，这两者会将非数值转为数值再进行判断，新的判断方法只针对数值  
## d. Number.parseInt(),Number.parseFloat()
与全局方法相同，意在逐步减少全局方法，使得语言逐步模块化
## e. Number.isInteger()
判断一个数值是否是整数，只针对数值，其余会返回false
太精确的数值判断不适用，
由于 JavaScript 采用 IEEE 754 标准，数值存储为64位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）。如果数值的精度超过这个限度，第54位及后面的位就会被丢弃
，如果一个数值的绝对值小于Number.MIN_VALUE（5E-324），即小于 JavaScript 能够分辨的最小值，会被自动转为 0。这时，Number.isInteger也会误判。
## f. Number.EPSILON
它表示 1 与大于 1 的最小浮点数之间的差。
小数点后面有连续 51 个零。这个值减去 1 之后，就等于 2 的 -52 次方。
Number.EPSILON实际上是 JavaScript 能够表示的最小精度
Number.EPSILON的实质是一个可以接受的最小误差范围。
```
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```
## g. Number.isSafeInteger()
判断一个数是否是安全整数
avaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点）
```
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) -1 //true
Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER
```
## h. Math对象的扩展
### Math.trunc()
### Math.sign()
### Math.cbrt()
### Math.clz32(
### ,,,,,,,
## BigInt
- BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。
- 为了与 Number 类型区别，BigInt 类型的数据必须添加后缀n
- BigInt 可以使用负号（-），但是不能使用正号（+），因为会与 asm.js 冲突。
- 几乎所有的数值运算符都可以用在 BigInt，但是有两个例外
不带符号的右移位运算符>>>
一元的求正运算符+

# 6. 函数的扩展
## a. 函数参数的默认值
  - 允许设置默认值，不允许重复声明，惰性求值，每次重新计算值
  - 与解构赋值一起用
```
  // 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

上面两种写法都对函数的参数设定了默认值，
区别是写法一函数参数的默认值是空对象，
但是设置了对象解构赋值的默认值；
写法二函数参数的默认值是一个有具体属性的对象，
但是没有设置对象解构赋值的默认值。
```

- length属性
  略显鸡肋，返回没有指定默认值的参数个数。
- 作用域
  一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。
  如果在该作用域内找不到对应变量，就会去外层作用域寻找
- 应用
  利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。

```
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo()
// Error: Missing parameter

```

## b. rest 参数
```
function push(array, ...items) {
  items.forEach(function(item) {
    array.push(item);
    console.log(item);
  });
}

var a = [];
push(a, 1, 2, 3)
```
## c. 严格模式
只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

**原因** ：**函数内部的严格模式，同时适用于函数体和函数参数。但是，函数执行的时候，先执行函数参数，然后再执行函数体。这样就有一个不合理的地方，只有从函数体之中，才能知道参数是否应该以严格模式执行，但是参数却应该先于函数体执行。**

两种方法可以规避这种限制。第一种是设定全局性的严格模式，这是合法的。
```
'use strict';

function doSomething(a, b = a) {
  // code
}
```
第二种是把函数包在一个无参数的立即执行函数里面。
```
const doSomething = (function () {
  'use strict';
  return function(value = 42) {
    return value;
  };
}());
```
## d. name 属性
函数的name属性，返回该函数的函数名。
注意：
- 将一个匿名函数赋值给一个变量，ES5 的name属性，会返回空字符串，而 ES6 的name属性会返回实际的函数名;如果是具名函数，则会返回实际的函数名
- Function构造函数返回的函数实例，name属性的值为anonymous
- bind返回的函数，name属性值会加上bound前缀
## e. 箭头函数
- 多于一条语句，代码块要用大括号，并return
- 如果要返回一个对象，大括号外要加小括号
- 不能当作构造函数，即不能new
- 不可以使用arguments对象，该对象在函数体内不存在
- 不可以使用yield命令，因此箭头函数不能用作 Generator 函数
- 没有this
箭头函数的不适用场合：
- 定义对象的方法，且该方法内部包括this
- 需要动态this的时候，也不应使用箭头函数
```
  var button = document.getElementById('press');
button.addEventListener('click', () => {
  this.classList.toggle('on');
});
上面代码运行时，点击按钮会报错，因为button的监听函数是一个箭头函数，导致里面的this就是全局对象。如果改成普通函数，this就会动态指向被点击的按钮对象。
```
## f. 尾调用优化
尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。
- 尾调用不一定出现在函数尾部，只要是最后一步操作即可。
```
function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
```
以下情况均不属于尾调用,调用后不能有操作
```
// 情况一
function f(x){
  let y = g(x);
  return y;
}

// 情况二
function f(x){
  return g(x) + 1;
}

// 情况三
function f(x){
  g(x);
}
等同于
function f(x){
  g(x)
  return undefined
}
```
“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义。

注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。

注意，目前只有 Safari 浏览器支持尾调用优化，Chrome 和 Firefox 都不支持。
- 递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。对于其他支持“尾调用优化”的语言（比如 Lua，ES6），只需要知道循环可以用递归代替，而一旦使用递归，就最好使用尾递归。

**ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。**
## g. 函数参数的尾逗号
**ES2017 允许函数的最后一个参数有尾逗号（trailing comma）。**
## h. Function.prototype.toString()
修改后的toString()方法，明确要求返回一模一样的原始代码。
**包括注释**
## i. catch 命令的参数省略
JavaScript 语言的try...catch结构，以前明确要求catch命令后面必须跟参数，接受try代码块抛出的错误对象。

ES2019 做出了改变，允许catch语句省略参数。
```
try {
  // ...
} catch {
  // ...
}

```
# 7. 数组的扩展
## a. 扩展运算符
应用：
### 数组的复制
```
es5
const a1 = [1, 2];
const a2 = a1.concat();
es6
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1
```
### 数组的合并
```
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```
**注意都是浅拷贝**
### 与解构赋值结合
```
// ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list
下面是另外一些例子。

const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]

const [first, ...rest] = [];
first // undefined
rest  // []

const [first, ...rest] = ["foo"];
first  // "foo"
rest   // []
```
### 字符串
```
[...'hello']
// [ "h", "e", "l", "l", "o" ]
正确识别四个字节的 Unicode 字符。
```
'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3
```
上面代码的第一种写法，JavaScript 会将四个字节的 Unicode 字符，识别为 2 个字符，采用扩展运算符就没有这个问题。

- 实现了 Iterator 接口的对象
任何定义了遍历器（Iterator）接口的对象（参阅 Iterator 一章），都可以用扩展运算符转为真正的数组。

let nodeList = document.querySelectorAll('div');
let array = [...nodeList];
上面代码中，querySelectorAll方法返回的是一个NodeList对象。它不是数组，而是一个类似数组的对象。这时，扩展运算符可以将其转为真正的数组，原因就在于NodeList对象实现了 Iterator 。

可以用Array.from()把类似数组的对象转换为数组，就可以使用扩展运算符
```
### Map 和 Set 结构，Generator 函数
扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Map 结构。

let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]
Generator 函数运行后，返回一个遍历器对象，因此也可以使用扩展运算符。
- Map 和 Set 结构，Generator 函数
const go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

[...go()] // [1, 2, 3]
上面代码中，变量go是一个 Generator 函数，执行后返回的是一个遍历器对象，对这个遍历器对象执行扩展运算符，就会将内部遍历得到的值，转为一个数组。

如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错。

const obj = {a: 1, b: 2};
let arr = [...obj]; // TypeError: Cannot spread non-iterable object
## b. Array.from()‘
### 转换数组
**将类似数组的对象和可遍历的对象（包括map,set）转换为数组**
```
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```
### 接收第二个参数，类似与map方法
### 将字符串转换为数组，返回长度
避免 JavaScript 将大于\uFFFF的 Unicode 字符，算作两个字符的 bug。
```
function countSymbols(string) {
  return Array.from(string).length;
}
```
## C. Array.of()
Array.of()方法用于将一组值，转换为数组,弥补Array()的不足，参数个数的不同，导致行为不统一
```
Array.of()方法可以用下面的代码模拟实现。

function ArrayOf(){
  return [].slice.call(arguments);
}
```
## d. 数组实例的copyWithin()
数组实例的copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
```
Array.prototype.copyWithin(target, start = 0, end = this.length

/ 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]

// 将3号位复制到0号位
[].copyWithin.call({length: 5, 3: 1}, 0, 3)
// {0: 1, 3: 1, length: 5}
```
## e. 数组实例的find() 和 findIndex()
数组实例的find方法，用于找出**第一个**符合条件的数组成员。它的**参数是一个回调函数**，所有数组成员依次执行该回调函数，直到找出**第一个返回值为true**的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。

find方法的回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。findIndex()同上

均可接收第二个参数，用来绑定this

```
function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person)
```
另外，这两个方法都可以发现NaN，弥补了数组的indexOf方法的不足。

```
[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))
// 0
```

## f. 数组实例的fill方法
使用给定值填充一个数组，
填充值如果是一个数组，那么被赋值的是**同一个内存地址的对象**，而不是深拷贝对象。
```
let arr = new Array(3).fill({name: "Mike"});
arr[0].name = "Ben";
arr
// [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

let arr = new Array(3).fill([]);
arr[0].push(5);
arr
// [[5], [5], [5]]
```
## g. 数组实例的 entries()，keys() 和 values() 
keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历,返回遍历器对象
## h. 数组实例的 includes() 
Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。

该方法的第二个参数表示搜索的起始位置，默认为0

indexOf方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观。二是，它内部使用严格相等运算符（===）进行判断，这会导致对NaN的误判。
## i. 数组实例的flat(), flatMap()
Array.prototype.flat()用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。

参数为要展开的层数，默认为1，如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。

flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。
只能展开一层数组  

flatMap()方法的参数是一个遍历函数，该函数可以接受三个参数，分别是当前数组成员、当前数组成员的位置（从零开始）、原数组。

flatMap()方法还可以有第二个参数，用来绑定遍历函数里面的this。

# 8. 对象的扩展
## a. 属性的简洁表示法
ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。
**注意**：简写的对象方法不能用作构造函数，会报错。
## b. 属性名表达式
注意：
- 属性名表达式与简洁表示法，不能同时使用，会报错。
```
// 报错
const foo = 'bar';
const bar = 'abc';
const baz = { [foo] };

// 正确
const foo = 'bar';
const baz = { [foo]: 'abc'};
```
- 属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串[object Object]，这一点要特别小心

```
const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};

myObject // Object {[object Object]: "valueB"}
```
## c. 方法的name属性
函数的name属性，返回函数名。对象方法也是函数，因此也有name属性。
- 方法的name属性返回函数名（即方法名）
- 如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set。
```
const obj = {
  get foo() {},
  set foo(x) {}
};

obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name // "get foo"
descriptor.set.name // "set foo"
```

有两种特殊情况：bind方法创造的函数，name属性返回bound加上原函数的名字；Function构造函数创造的函数，name属性返回anonymous。
```
(new Function()).name // "anonymous"

var doSomething = function() {
  // ...
};
doSomething.bind().name // "bound doSomething"
```
如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述。
```
const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
  [key1]() {},
  [key2]() {},
};
obj[key1].name // "[description]"
obj[key2].name // ""
```
上面代码中，key1对应的 Symbol 值有描述，key2没有。
## d. 可枚举性和遍历
### 可枚举性
Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
目前，有四个操作会忽略enumerable为false的属性。

- for...in循环：只遍历对象自身的和继承的可枚举的属性。
- Object.keys()：返回对象自身的所有可枚举的属性的键名。
- JSON.stringify()：只串行化对象自身的可枚举的属性。
- Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

for...in 返回继承的属性，其余方法忽略继承的属性
**注意**：ES6 规定，所有 Class 的原型的方法都是不可枚举的。
```
Object.getOwnPropertyDescriptor(class {foo() {}}.prototype, 'foo').enumerable
// false
```
### 遍历
ES6 一共有 5 种方法可以遍历对象的属性。

**（1） for...in**

for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

**（2）Object.keys(obj)**

Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

**（3）Object.getOwnPropertyNames(obj)**

Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

**（4）Object.getOwnPropertySymbols(obj)**

Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。

**（5）Reflect.ownKeys(obj)**

Reflect.ownKeys返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

首先遍历所有数值键，按照数值升序排列。
其次遍历所有字符串键，按照加入时间升序排列。
最后遍历所有 Symbol 键，按照加入时间升序排列。
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
// ['2', '10', 'b', 'a', Symbol()]
上面代码中，Reflect.ownKeys方法返回一个数组，包含了参数对象的所有属性。这个数组的属性次序是这样的，首先是数值属性2和10，其次是字符串属性b和a，最后是 Symbol 属性。
## e. super 关键字
this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
```
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```
JavaScript 引擎内部，super.foo等同于Object.getPrototypeOf(this).foo（属性）或Object.getPrototypeOf(this).foo.call(this)（方法）。
```
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  },
};

const obj = {
  x: 'world',
  foo() {
    super.foo();
  }
}

Object.setPrototypeOf(obj, proto);

obj.foo() // "world"
```
上面代码中，super.foo指向原型对象proto的foo方法，但是绑定的this却还是当前对象obj，因此输出的就是world。
## f. 扩展运算符
### 解构赋值
```
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```
- 解构赋值要求等号右边是一个对象,等号右边是undefined或null，就会报错，因为它们无法转为对象。
- 解构赋值必须是最后一个参数，否则会报错
```
let { ...z } = null; // 运行时错误
let { ...z } = undefined; // 运行时错误
let { ...x, y, z } = someObject; // 句法错误
let { x, ...y, ...z } = someObject; // 句法错误
```
- 解构赋值的拷贝是浅拷贝，即如果一个键的值是复合类型的值（数组、对象、函数）、那么解构赋值拷贝的是这个值的引用，而不是这个值的副本。
- 扩展运算符的解构赋值，不能复制继承自原型对象的属性。
### 扩展运算符
象的扩展运算符（...）用于取出参数对象的**所有可遍历属性**，拷贝到当前对象之中
- 数组是特殊的对象，所以对象的扩展运算符也可以用于数组。
- 扩展运算符后面是一个空对象，则没有任何效果。
```
{...{}, a: 1}
// { a: 1 }
```
- 扩展运算符后面不是对象，则会自动将其转为对象。
```
// 等同于 {...Object(1)}
{...1} // {}
// 等同于 {...Object(true)}
{...true} // {}

// 等同于 {...Object(undefined)}
{...undefined} // {}

// 等同于 {...Object(null)}
{...null} // {}
```
上面代码中，扩展运算符后面是整数1，会自动转为数值的包装对象Number{1}。由于该对象没有自身属性，所以返回一个空对象。
- 扩展运算符后面是字符串，它会自动转成一个类似数组的对象，因此返回的不是空对象。
```
{...'hello'}
// {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}
```
- 等同于使用Object.assign()方法。
```
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```
上面的例子只是拷贝了对象实例的属性，如果想完整克隆一个对象，还拷贝对象原型的属性，可以采用下面的写法。
```
// 写法一
const clone1 = {
  __proto__: Object.getPrototypeOf(obj),
  ...obj
};

// 写法二
const clone2 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
);

// 写法三
const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)
```
推荐写法二
扩展运算符可以用于合并两个对象。
```
let ab = { ...a, ...b };
// 等同于
let ab = Object.assign({}, a, b);
```
如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉。
```
let aWithOverrides = { ...a, x: 1, y: 2 };
// 等同于
let aWithOverrides = { ...a, ...{ x: 1, y: 2 } };
// 等同于
let x = 1, y = 2, aWithOverrides = { ...a, x, y };
// 等同于
let aWithOverrides = Object.assign({}, a, { x: 1, y: 2 });
```
如果把自定义属性放在扩展运算符前面，就变成了设置新对象的默认属性值。
```
let aWithDefaults = { x: 1, y: 2, ...a };
// 等同于
let aWithDefaults = Object.assign({}, { x: 1, y: 2 }, a);
// 等同于
let aWithDefaults = Object.assign({ x: 1, y: 2 }, a);
```
与数组的扩展运算符一样，对象的扩展运算符后面可以跟表达式。
```
const obj = {
  ...(x > 1 ? {a: 1} : {}),
  b: 2,
};
```
扩展运算符的参数对象之中，如果有取值函数get，这个函数是会执行的。
```
let a = {
  get x() {
    throw new Error('not throw yet');
  }
}

let aWithXGetter = { ...a }; // 报错
```
上面例子中，取值函数get在扩展a对象时会自动执行，导致报错。
# 9. 对象的新增方法
## a. Object.is()
ES5 比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===）。它们都有缺点，
**前者会自动转换数据类型，**
**后者的NaN不等于自身，以及+0等于-0**
## b. Object.assign()
Object.assign()方法用于对象的合并，将源对象（source）的所有**可枚举属性**，复制到目标对象（target）
- 只有一个参数，Object.assign()会直接返回该参数。
- 该参数不是对象，则会先转成对象，然后返回。
- undefined和null无法转成对象，所以如果它们作为参数，就会报错
- 只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）
- 属性名为 Symbol 值的属性，也会被Object.assign()拷贝。
**注意**：
- Object.assign()方法实行的是浅拷贝，而不是深拷贝。
- 同名属性的替换
```
const target = { a: { b: 'c', d: 'e' } }
const source = { a: { b: 'hello' } }
Object.assign(target, source)
// { a: { b: 'hello' } }
```
- 数组的处理
  将数组视为对象
```
  Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]
```
- 取值函数的处理
  Object.assign()只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。
**用途**：
Object.assign()方法有很多用处。

（1）为对象添加属性
```
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}
```
上面方法通过Object.assign()方法，将x属性和y属性添加到Point类的对象实例。

（2）为对象添加方法
```
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});

// 等同于下面的写法
SomeClass.prototype.someMethod = function (arg1, arg2) {
  ···
};
SomeClass.prototype.anotherMethod = function () {
  ···
};
```
上面代码使用了对象属性的简洁表示法，直接将两个函数放在大括号中，再使用assign()方法添加到SomeClass.prototype之中。

（3）克隆对象
```
function clone(origin) {
  return Object.assign({}, origin);
}
```
上面代码将原始对象拷贝到一个空对象，就得到了原始对象的克隆。

不过，采用这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。
```
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
```
（4）合并多个对象

将多个对象合并到某个对象。
```
const merge =
  (target, ...sources) => Object.assign(target, ...sources);
```
如果希望合并后返回一个新对象，可以改写上面函数，对一个空对象合并。
```
const merge =
  (...sources) => Object.assign({}, ...sources);
```
（5）为属性指定默认值
```
const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

function processContent(options) {
  options = Object.assign({}, DEFAULTS, options);
  console.log(options);
  // ...
}
```
上面代码中，DEFAULTS对象是默认值，options对象是用户提供的参数。Object.assign()方法将DEFAULTS和options合并成一个新对象，如果两者有同名属性，则options的属性值会覆盖DEFAULTS的属性值。

注意，由于存在浅拷贝的问题，DEFAULTS对象和options对象的所有属性的值，最好都是简单类型，不要指向另一个对象。否则，DEFAULTS对象的该属性很可能不起作用。
```
const DEFAULTS = {
  url: {
    host: 'example.com',
    port: 7070
  },
};

processContent({ url: {port: 8000} })
// {
//   url: {port: 8000}
// }
```
上面代码的原意是将url.port改成 8000，url.host不变。实际结果却是options.url覆盖掉DEFAULTS.url，所以url.host就不存在了。
# c. Object.getOwnPropertyDescriptors()
ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。

ES2017 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。

**该方法的引入目的，主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。**
- 用法一：
Object.getOwnPropertyDescriptors()方法配合Object.defineProperties()方法，就可以实现正确拷贝。
```
const source = {
  set foo(value) {
    console.log(value);
  }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }

上面代码中，两个对象合并的逻辑可以写成一个函数。

const shallowMerge = (target, source) => Object.defineProperties(
  target,
  Object.getOwnPropertyDescriptors(source)
);
```

- 用法二: 配合Object.create()方法，将对象属性克隆到一个新对象。这属于浅拷贝。
```
const clone = Object.create(Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj));

// 或者

const shallowClone = (obj) => Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);
```
- 用法三： 实现对象继承
```
//浏览器环境中
const obj = {
  __proto__: prot,
  foo: 124,
}

//非浏览器环境中
const obj = Object.create(prot)
obj.foo = 123
//或者
const obj = Object.assign(
  Object.create(prot),
  {
    foo: 123,
  }
)

//使用Object.getOwnPropertyDescriptors()
const obj = Object.create(
  prot,
  Object.getOwnPropertyDescriptors({
    foo: 123
  })
)
```
用法四：实现Mixin（混入）模式
##### 待了解Mixin
## d. __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf() 
- __proto__
  无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的**Object.setPrototypeOf()（写操作）**、**Object.getPrototypeOf()（读操作）**、**Object.create()（生成操作）**代替。
- Object.setPrototypeOf()
  与上一方法效果相同
- Object.getPrototypeOf() 
  与Object.setPrototypeOf方法配套，用于读取一个对象的原型对象。
  参数不是对象，会被自动转为对象
  参数是undefined或null，它们无法转为对象，所以会报错
## e. Object.keys()，Object.values()，Object.entries() 
  三者分别返回**可遍历属性**的键名/键值/键值对组成的数组
  Object.values会过滤属性名为 Symbol 值的属性。
  Object.entries() ：如果原对象的属性名是一个 Symbol 值，该属性会被忽略。
  Object.entries方法的另一个用处是，将对象转为真正的Map结构。
```
const obj = { foo: 'bar', baz: 42 };
const map = new Map(Object.entries(obj));
map // Map { foo: "bar", baz: 42 }
```
## f. Object.fromEntries()
Object.fromEntries()方法是Object.entries()的逆操作，用于将一个**键值对数组转为对象。**
- 特别适合将 Map 结构转为对象。
```
// 例一
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);

Object.fromEntries(entries)
// { foo: "bar", baz: 42 }

// 例二
const map = new Map().set('foo', true).set('bar', false);
Object.fromEntries(map)
// { foo: true, bar: false }
```
- 配合URLSearchParams对象，将查询字符串转为对象。
```
Object.fromEntries(new URLSearchParams('foo=bar&baz=qux'))
// { foo: "bar", baz: "qux" }
```
# 10. 运算符的扩展
## a. 指数运算符
ES2016 新增了一个指数运算符（**）。
右结合
```
2 ** 2 // 4
2 ** 3 // 8
let a = 1.5;
a **= 2;
// 等同于 a = a * a;

let b = 4;
b **= 3;
// 等同于 b = b * b * b;
```
## b. 链判断运算符
 ES2020 引入了“链判断运算符”（optional chaining operator）``?.``
```
const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value
判断左侧的对象是否为null或undefined。如果是的，就不再往下运算，而是返回undefined
```
```
iterator.return?.()
iterator.return如果有定义，就会调用该方法，否则iterator.return直接返回undefined，不再执行?.后面的部分。

if (myForm.checkValidity?.() === false) {
  // 表单校验失败
  return;
}
```
注意：
- 本质相当于短路机制，不满足条件，不往下执行
- 属性链有圆括号，只对圆括号内部有影响
- 报错场合
```
// 构造函数
new a?.()
new a?.b()

// 链判断运算符的右侧有模板字符串
a?.`{b}`
a?.b`{c}`

// 链判断运算符的左侧是 super
super?.()
super?.foo

// 链运算符用于赋值运算符左侧
a?.b = c
```
- 右侧不得为十进制数值
  如果?.后面紧跟一个十进制数字，那么?.不再被看成是一个完整的运算符，而会按照三元运算符进行处理
## c. Null 判断运算符
ES2020 引入了一个新的 Null 判断运算符??。它的行为类似||，但是只有运算符左侧的值为**null或undefined**时，才会返回右侧的值。
```
const headerText = response.settings.headerText || 'Hello, world!';
const animationDuration = response.settings.animationDuration || 300;
const showSplashScreen = response.settings.showSplashScreen || true;
```
上述情况下，左侧是0，false 或者 空字符串，默认值也会生效。
用法：
- 跟链判断运算符?.配合使用，为null或undefined的值设置默认值。
```
const animationDuration = response.settings?.animationDuration ?? 300;
<!-- 如果response.settings是null或undefined，或者response.settings.animationDuration是null或undefined，就会返回默认值300。 -->
```
- 判断函数参数是否赋值。
```
function Component(props) {
  const enable = props.enabled ?? true;
  // …
}

<!-- 相当于 -->

function Component(props) {
  const {
    enabled: enable = true,
  } = props;
  // …
}
```
**注意**：**如果多个逻辑运算符一起使用，必须用括号表明优先级，否则会报错。**
## e. 逻辑赋值运算符
先执行逻辑运算，再根据结果，视情况执行赋值运算
用法：
- 为变量或属性设置默认值
```
// 老的写法
user.id = user.id || 1;

// 新的写法
user.id ||= 1;

function example(opts) {
  opts.foo = opts.foo ?? 'bar';
  opts.baz ?? (opts.baz = 'qux');
}

<!-- 新写法 -->

function example(opts) {
  opts.foo ??= 'bar';
  opts.baz ??= 'qux';
}
```
# 11. Symbol
## a. 概述
原始数据类型Symbol，表示独一无二的值
## b. Symbol.prototype.description
```
读取 Symbol描述
const sym = Symbol('foo')
- String(sym)
- sym.toString()
- sym.description()
```
## c. 作为属性名的 Symbol
```
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```
**注意，Symbol 值作为对象属性名时，不能用点运算符。**
## d. 实例：消除魔术字符串
```
常用的消除魔术字符串的方法，就是把它写成一个变量。

const shapeType = {
  triangle: 'Triangle'
};

function getArea(shape, options) {
  let area = 0;
  switch (shape) {
    case shapeType.triangle:
      area = .5 * options.width * options.height;
      break;
  }
  return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });
上面代码中，我们把Triangle写成shapeType对象的triangle属性，这样就消除了强耦合。

如果仔细分析，可以发现shapeType.triangle等于哪个值并不重要，只要确保不会跟其他shapeType属性的值冲突即可。因此，这里就很适合改用 Symbol 值。

const shapeType = {
  triangle: Symbol()
};
上面代码中，除了将shapeType.triangle的值设为一个 Symbol，其他地方都不用修改。
```
## e. 属性名的遍历
Symbol 作为属性名，遍历对象的时候，该属性不会出现在**for...in**、**for...of**循环中，也不会被**Object.keys()**、**Object.getOwnPropertyNames()**、**JSON.stringify()返回。**

但是，它也不是私有属性，有一个
**Object.getOwnPropertySymbols()方法**，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

以 Symbol 值作为键名，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。
## f. Symbol.for()，Symbol.keyFor()
Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。

它们的区别是，前者会被登记在全局环境中供搜索，后者不会。

Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。

比如，如果你调用Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。
## g. 实例：模块的 Singleton 模式内置的 Symbol 值
详见 [ES6 Symbol](https://es6.ruanyifeng.com/#docs/symbol)

## h. 内置的Symbol值
详见 [ES6 Symbol](https://es6.ruanyifeng.com/#docs/symbol)

# 12. Set 和 Map数据结构
## a. Set
1. Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
```
// 去除数组的重复成员
[...new Set(array)]
<!-- 或者 -->
Array.from(new Set(array))

// 去除字符串中的重复字符
[...new Set('ababbc')].join('')
// "abc"
```
2. 向 Set 加入值的时候，不会发生类型转换
```
向 Set 加入值时认为NaN等于自身，而精确相等运算符认为NaN不等于自身。
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}
```
- 属性和方法
```
s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2);
s.has(2) // false
```
3. 遍历操作
Set.prototype.keys()：返回键名的遍历器
  Set.prototype.values()：返回键值的遍历器
  Set.prototype.entries()：返回键值对的遍历器
  Set.prototype.forEach()：使用回调函数遍历每个成员

注意：
- set的遍历顺序与插入顺序一致；
- keys方法与values方法的行为完全一致；
- entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等。
- 默认遍历器函数就是values, 因此可直接用for of 遍历
- 拥有forEach，同数组方法
- 扩展运算发与set结构结合，map filter方法可以间接用于set
```
let set = new Set([1,2,3])
set = new Set([...set].map(x => s*2))

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
```
- 在遍历操作中，同步改变原来的 Set 结构
```
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```
## b. WeakSet
- 与Set的区别
  1. 成员只能是对象
  2. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用
  3. 没有size属性，不能遍历它的成员

## c. Map
- 类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值
- 不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构
- 只有对同一个对象的引用，Map 结构才将其视为同一个键
```
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```
- 实例的属性和操作方法
```
const m = new Map()
m.set('foo', true);
m.size // 2
m.set(262, 'standard')     // 键是数值
m.set(undefined, 'nah')    // 键是 undefined
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  m.has('years')       // false
  .set(3, 'c');

const hello = function() {console.log('hello');};
m.set(hello, 'Hello ES6!') // 键是函数

m.get(hello)  // Hello ES6!
m.has(262)           // true

delete方法删除某个键，返回true。如果删除失败，返回false。

clear方法清除所有成员，没有返回值。
```
- 遍历方法
```
Map.prototype.keys()：返回键名的遍历器。
Map.prototype.values()：返回键值的遍历器。
Map.prototype.entries()：返回所有成员的遍历器。
Map.prototype.forEach()：遍历 Map 的所有成员。
```
## d. WeakMap
区别： 同Set与WeakSet的区别
只有四个方法：get()、set()、has()、delete()

## e. WeakRef
WeakSet 和 WeakMap 是基于弱引用的数据结构，ES2021 更进一步，提供了 WeakRef 对象，用于直接创建对象的弱引用。

let target = {};
let wr = new WeakRef(target);
上面示例中，target是原始对象，构造函数WeakRef()创建了一个基于target的新对象wr。这里，wr就是一个 WeakRef 的实例，属于对target的弱引用，垃圾回收机制不会计入这个引用，也就是说，wr的引用不会妨碍原始对象target被垃圾回收机制清除。

WeakRef 实例对象有一个deref()方法，如果原始对象存在，该方法返回原始对象；如果原始对象已经被垃圾回收机制清除，该方法返回undefined。

## f. FinalizationRegistry
ES2021 引入了清理器注册表功能 FinalizationRegistry，用来指定目标对象被垃圾回收机制清除以后，所要执行的回调函数。
[详见 ES6](https://es6.ruanyifeng.com/#docs/set-map)


# 13. Proxy
# 14. Reflect
# 15. Promise对象
## a. Promise 的含义
Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。
特点：
- 三种状态：pending, fulfilled, rejected
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果

缺点：
- 停不下来
- 要设置回调函数
- pending时无法知道事件具体进行到哪
```
首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。
其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。
```
## 基本用法
ES6 规定，Promise对象是一个构造函数，用来生成Promise实例。
## Promise.prototype.then()
```
then方法返回的是一个新的Promise实例
getJSON("/post/1.json").then(
  post => getJSON(post.commentURL)
).then(
  comments => console.log("resolved: ", comments),
  err => console.log("rejected: ", err)
);
第一个then方法指定的回调函数，返回的是另一个Promise对象。
这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。
如果变为resolved，就调用第一个回调函数，如果状态变为rejected，就调用第二个回调函数。
```
## Promise.prototype.catch()
Promise.prototype.catch()方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
- Promise 状态已经变成resolved，再抛出错误是无效的。
- Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。

**一般来说，不要在then()方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法, 这样可以处理 Promise 内部发生的错误。**
```
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```
## Promise.prototype.finally()
finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。
## Promise.all()
Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
```
const p = Promise.all([p1, p2, p3]);
```
p的状态由p1、p2、p3决定，分成两种情况。

（1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

（2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

注意： 如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。
```
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]
```
## Promise.race()
Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。
```
const p = Promise.race([p1, p2, p3]);
```
上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。
## Promise.allSettled()
Promise.allSettled()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束。该方法由 ES2020 引入。(不管成功还是失败，要能都完成才能往下走))
## Promise.any()
ES2021 引入了Promise.any()方法。该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。

只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。
## Promise.resolve()
有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。
```
const jsPromise = Promise.resolve($.ajax('/whatever.json'));
```
上面代码将 jQuery 生成的deferred对象，转为一个新的 Promise 对象。

Promise.resolve()等价于下面的写法。
```
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
Promise.resolve()方法的参数分成四种情况。

（1）参数是一个 Promise 实例

如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。

（2）参数是一个thenable对象

thenable对象指的是具有then方法的对象，比如下面这个对象。
```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
Promise.resolve()方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then()方法。

let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function (value) {
  console.log(value);  // 42
});
```
上面代码中，thenable对象的then()方法执行后，对象p1的状态就变为resolved，从而立即执行最后那个then()方法指定的回调函数，输出42。

（3）参数不是具有then()方法的对象，或根本就不是对象

如果参数是一个原始值，或者是一个不具有then()方法的对象，则Promise.resolve()方法返回一个新的 Promise 对象，状态为resolved。
```
const p = Promise.resolve('Hello');

p.then(function (s) {
  console.log(s)
});
// Hello
```
上面代码生成一个新的 Promise 对象的实例p。由于字符串Hello不属于异步操作（判断方法是字符串对象不具有 then 方法），返回 Promise 实例的状态从一生成就是resolved，所以回调函数会立即执行。Promise.resolve()方法的参数，会同时传给回调函数。

（4）不带有任何参数

Promise.resolve()方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。

所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用Promise.resolve()方法。
```
const p = Promise.resolve();

p.then(function () {
  // ...
});
```
上面代码的变量p就是一个 Promise 对象。

需要注意的是，立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。
```
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```
上面代码中，setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.resolve()在本轮“事件循环”结束时执行，console.log('one')则是立即执行，因此最先输出。
## Promise.reject()
Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。

Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。
## Promise.try()
```
function getUsername(userId) {
  return database.users.get({id: userId})
  .then(function(user) {
    return user.name;
  });
}`
```
上面代码中，database.users.get()返回一个 Promise 对象，如果抛出异步错误，可以用catch方法捕获，就像下面这样写。
```
database.users.get({id: userId})
.then(...)
.catch(...)
```
但是database.users.get()可能还会抛出同步错误（比如数据库连接错误，具体要看实现方法），这时你就不得不用try...catch去捕获。
```
try {
  database.users.get({id: userId})
  .then(...)
  .catch(...)
} catch (e) {
  // ...
}
```
上面这样的写法就很笨拙了，这时就可以统一用promise.catch()捕获所有同步和异步的错误。
```
Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...)
```
Promise.try就是模拟try代码块，就像promise.catch模拟的是catch代码块。

# 16. Iterator 和 for...of 循环
## a. Iterator
- 表示集合的数据结构：Array Object Map Set (后两种为ES6加入)
- 遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。
- 作用：
  1. 为各种数据结构，提供一个统一的、简便的访问接口
  2. 使数据结构的成员按照次序排列
  3. 供for...of 使用

遍历器对象实例
```
let temp = makeIterator(['1', '2', '3'])

console.log(temp.next())
console.log(temp.next())
console.log(temp.next())
console.log(temp.next())

function makeIterator (arr){
  let nextIndex = 0
  return {
    next: () => {
      return nextIndex < arr.length ? 
      {value: arr[nextIndex++], done: false} :
      {value: undefined, done: true}
    }
  }
}
```
## b. 默认 Iterator 接口
ES6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”
例子：
```
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
arr是一个数组，原生就具有遍历器接口，部署在arr的Symbol.iterator属性上面。所以，调用这个属性，就得到遍历器对象。
```
下面是类部署 Iterator 接口的写法实例
```
class RangeIterator {
  constructor(start, stop) {
    this.value = start
    this.stop = stop
  }
  [Symbol.iterator]() {
    return this
  }
  next() {
    value = this.value
    if(this.value++ < this.stop) {
      return {value: value, done: false}
    }
    return {value: undefined, done: true}
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```

通过遍历器实现指针结构
```
function Obj(value) {
  this.value = value
  this.next = null
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = {next: next}
  var current = this
  function next() {
    if(current) {
      let value = current.value
      current = current.next
      return {done: false, value: value}
    }
    return {done: true}
  }
  return iterator
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;


for (var i of one){
  console.log(i); // 1, 2, 3
}
```

为一个对象添加Iterator
```
let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        }
        return { value: undefined, done: true };
      }
    };
  }
};
```

类似数组的对象(存在数值键名和length)调用数组的Symbol.iterator方法
**注意**：普通对象部署无用
```
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```
## c. 调用 Iterator 接口的场合
总的来说，接受数组作为参数的场合，其实都调用了遍历器接口
- 解构赋值
- 扩展运算符
- yield*
```
yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```
- 其他场合
由于数组的遍历会调用遍历器接口，下面是一些例子。
```
for...of
Array.from()
Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
Promise.all()
Promise.race()
```

## d. Iterator 与 Generator函数
```
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"
```
## e. 遍历器对象的return, throw()
详见[ES6](https://es6.ruanyifeng.com/#docs/iterator#for---of-%E5%BE%AA%E7%8E%AF)

## f. for...of优点
- 有着同for...in一样的简洁语法，但是没有for...in那些缺点。
- 不同于forEach方法，它可以与break、continue和return配合使用。
- 提供了遍历所有数据结构的统一操作接口。