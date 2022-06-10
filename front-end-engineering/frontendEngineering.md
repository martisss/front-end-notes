# 前端工程化解决了什么问题？

**效率、规范、性能**

- js全局作用域冲突，引入不同的js文件，可能存在变量重名
  - 使用模块化的方式解决
    - npm  模块管理
    - webpack 模块打包  --> bundle.js（包含了所需模块的文件）
- 编码规范问题  --->  Eslint
- 资源合并和压缩问题  
- 高版本js降级    ---> babel.js

# 面临的问题

项目量级增加：  模块化、npm、webpack, 比如loadsh

项目数量扩大：研发平台、脚手架

复杂多高：H5/小程序、服务端、脚手架，---> 工程脚手架（统一解决不同技术栈的工程差异，不同团队不用重复造轮子）

团队人数增长：研发平台、脚手架

# 企业前端工程化应用场景

- 项目研发模式升级（模块化+MVVM）
- 工程脚手架： vue,react,egg.js
- 研发脚手架：创建、发布
- 项目性能优化：项目本身的性能，研发时的构建性能

ZBestPC项目架构升级　　原生js => webpack +vue

vue-elm项目架构升级， 工程架构升级+性能优化（构建性能优化＋访问性能优化）

imooc-build工程化脚手架开发  升级

# 模块化

模块包含输入和输出，模块内部实现是**私有**的，通过暴露接口与其他模块进行通信

，通过模块化拆分，使得业务逻辑更加清晰

## 发展历程

1. 全局function:

   问题：容易造成全局命名空间冲突，直接挂在在全局对象上

2. 全局namespace,通过对象封装模块，再把这个对象挂载在全局对象上，将函数作为该对象的一个属性，

   问题：外部可以更改该对象中的值，不安全，没有达到私有化的要求

3. IIFE模式，通过自执行函数创建闭包

   > 函数作用域+闭包
   >
   > 函数作用域下的变量天生具有私有化性质，直接将这个函数打印出来是看不到函数内部的变量的，然后再通过闭包的方式将相应变量暴露出来
   >
   > **注意：函数作用域和对象属性的区别**

   问题：无法解决模块之间的依赖问题

```js
  (function(){
    let a = '12'
    function say() {
      console.log(a)
    }

    function len() {
      console.log(a.length)
    };
    function getA() {
      return a
    };
    function api() {
      console.log('api 模块')
    }
    function setA(val) {
      a = val
    }
    window.__module = {
      say,
      len,
      getA,
      setA,
      api
    }
})()
```

4. IIFE模式增强，传入自定义依赖

   缺点：多依赖传入时，代码阅读困难，无法支持大规模的模块化开发，无特定语法支持，代码简陋

   ```js
   //html head
     <script type="text/javascript" src="moudle2.js"></script>
     <script type="text/javascript" src="moudle1.js"></script>bb
   
   
   //module1.js
   (function(global){
       let a = '12'
       function say() {
         console.log(a)
       }
   
       function len() {
         console.log(a.length)
       };
       function getA() {
         return a
       };
       function setA(val) {
         a = val
       }
       global.__module = {
         say,
         len,
         getA,
         setA,
         api
       }
   })(window, api = window.__module_api)
   
   //module2.js
   (function(global){
       function api() {
           console.log('api模块')
       }
       global.__module_api = {
           api
       }
   })(window)
   ```

经过前面的发展，解决了模块封装性的问题，匿名函数模式也是现代模块的基石，但还有一个问题需要解决，也就是模块加载的问题，

**引入多个 script后带来的问题**

- 请求过多 

- 依赖模糊

- 难以维护

因此出现了模块加载器进行模块的依赖管理

> ```js
> YUI3 Loader 
> 
> // hello.js  编写模块，需要依赖的模块通过回调函数的入参传入
> YUI.add('hello', function(Y){
>     Y.sayHello = function(msg){
>         Y.DOM.set(el, 'innerHTML', 'Hello!');
>     }
> },'3.0.0',{
>     requires:['dom']
> })
> 
> // main.js  使用模块，依赖通过回调函数入参传入
> YUI().use('hello', function(Y){
>     Y.sayHello("hey yui loader");
> })
> ```

针对请求过多的问题，将多个请求合并成一个，后端也要提供支持，比如[alibaba/nginx-http-concat](https://github.com/alibaba/nginx-http-concat)

在这之后出现了CommonJS， 后来又有了AMD、CMD规范，RequireJS和SeaJS是其主要实践者。CommonJS模块想要在浏览器端运行，因此发展出了Browserify, 浏览器端没有require, 对应的发展出了npm，再后来发展到Module Bundler, 例如webpack，发展到了所有的静态资源的依赖管理，再后来发展出了ES Module，在语言层面实现了模块规范。

## CommonJS

   - Node.js是commonJS规范的主要实践者，每个文件就是一个模块

   - 四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。实际使用时，用 `module.exports`定义当前模块对外输出的接口（不推荐直接用 `exports`），用 `require`加载模块
   - commonJS用同步的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快

### **特点：**

- 代码运行在模块作用域，不会污染全局作用域

- 多次加载会使用第一次缓存的结果

- 同步加载，模块加载顺序按照代码书写顺序

- 模块输出的是值的拷贝

  ```js
  const m = require('./api')
  console.log(m.x)
  m.x = 3
  console.log(m.x) //3
  console.log(m.getX()) //1  此处并不是同一个x, 函数作用域和对象属性的区别
  ```

### 实现原理

![image-20220504113841195](D:\NOTES\pictures\image-20220504113841195.png)

在主模块（例如entry.js）使用require加载其他模块，require会将原模块转化为一个module对象，该对象上有一个load方法，使用该方法加载模块时会在原模块外层包裹一个立即执行函数，并传入require,module, exports, `__filename`, `__dirname`, module.exports放入Module catch map里面， 键是模块路径，值是module.exports的值。

> 对于一个模块来说，需要有加载其他模块的能力:  `module(模块的引用)`, `require`
>
> 也需要有暴露自己方法和变量的能力: `exports`
>
> 需要告诉别的模块我在哪：`__filename`,`__dirname`

require 相当于把被引用的 module 拷贝了一份到当前 module 中

- `exports` 和 `module.exports` 的区别和联系:

- `exports` 是 `module.exports` 的引用。作为一个引用，如果我们修改它的值，实际上修改的是它对应的引用对象的值

- 弊端：Node.js 中的实现依赖了 Node.js 的环境变量：`module`，`exports`，`require`，`global`，浏览器没法用, 需要通过browserify这样的工具

### 基本语法

- 暴露模块：`module.exports = value`或`exports.xxx = value`
- 引入模块：`require(xxx)`,如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径

**加载某个模块，其实就是在加载module.exports的值**

> module.exports 会覆盖掉export的结果
>
> ```js
> exports.a = a
> exports.b = b
> module.exports = {c}
> ```

### browserify打包

在浏览器中使用commonjs模块要使用`browserify`

```js
pnpm install browserify -g
browserify 需要打包的文件的路径 -o 打包完成文件的路径
```

存在多个模块时要打包多次

#### 打包原理

- 本质还是通过自执行函数实现模块化

- 将每个模块编号，存入一个对象，每个模块标记依赖模块（通过一个对象传入）

  ```js
  {
      1: [
        function (require, module, exports) {
          .......
        },
        { './handle': 3 },  //模块依赖
      ],
       ........,
       ........,
    },
  ```

  

- 实现了require方法，核心是通过call方法调用模块，并传入require,
  module、exports方法或对象，通过module存储模块信息，通过
  exports存储模块输出信息

![image-20220504123727241](D:\NOTES\pictures\image-20220504123727241.png)

## AMD规范和CMD规范

- AMD的是实现是require.js

- cmd的相应实现是sea.js

#### 引入语法

**AMD**

**定义暴露模块**:

```js
//定义没有依赖的模块
define(function(){
   return 模块
})
//定义有依赖的模块
define(['module1', 'module2'], function(m1, m2){
   return 模块
})
```

**引入使用模块**:

```js
require(['module1', 'module2'], function(m1, m2){
   使用m1/m2
})
```

**CMD**

**定义暴露模块：**

```js
//定义没有依赖的模块
define(function(require, exports, module){
  exports.xxx = value
  module.exports = value
})
//定义有依赖的模块
define(function(require, exports, module){
  //引入依赖模块(同步)
  var module2 = require('./module2')
  //引入依赖模块(异步)
    require.async('./module3', function (m3) {
    })
  //暴露模块
  exports.xxx = value
})

```

**引入使用模块：**

```js
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```

#### **二者的区别：**

**1、AMD推崇依赖前置、提前执行，在定义模块的时候就要声明其依赖的模块**
**2、CMD推崇就近依赖、延迟执行，只有在用到某个模块的时候再去require**
这种区别各有优劣，只是语法上的差距，而且requireJS和SeaJS都支持对方的写法

AMD和CMD最大的区别是**对依赖模块的执行时机处理不同**，注意不是加载的时机或者方式不同

同样都是异步加载模块，AMD在加载模块完成后就会执行该 模块，所有模块都加载执行完后会进入require的回调函数，执行主逻辑，这样的效果就是依赖模块的执行顺序和书写顺序不一定一致，看网络速度，哪个先下载下来，哪个先执行，但是主逻辑一定在所有依赖加载完成后才执行

CMD加载完某个依赖模块后并不执行，只是下载而已，在所有依赖模块加载完成后进入主逻辑，遇到require语句的时候才执行对应的模块，这样模块的执行顺序和书写顺序是完全一致的

## ESModule

- ESModule设计理念是希望在**编译时**就确定模块依赖关系及输入输出
- CommonJS和AMD必 须在运行时才能确定依赖和输入、输出
- ESM通过import加载模块，通过export输出模块

> node14之后默认支持ESM

### import()

- 运行时执行
- 异步加载
- 返回一个Promise对象

适用场合：

- 按需加载
- 条件加载
- 动态加载: 允许模块路径动态生成

`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。

> import 实现按需加载
>
> ```js
> function foo() {
> import('./config.js')
> .then(({ api }) => {
> 
> });
> }
> 
> const modulePath = './utils' + '/api.js';
> import(modulePath);
> ```

import命令具有**提升效果，且是静态执行，因此不能使用表达式和变量**，这些只有在运行时才能得到结果的语法结构。

## ESModule 和 Common.js的区别

1. **CommonJS 模块输出的是一个值的拷贝，不存在动态更新，ES6 模块输出的是值的引用，可以取到模块内部实时的值。**

   > CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
   >
   > ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个**只读引用**。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的 `import`有点像 Unix 系统的“符号连接”，原始值变了，`import`加载的值也会跟着变。因此，**ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。**ES6 输入的模块变量，只是一个“符号连接”，所以**这个变量是只读的**，对它进行重新赋值会报错。

2. **CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。**

   > CommonJS 加载的是一个对象（即 `module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

3. CommonJs是单个值导出，即module.exports指向的对象， ES6 模块一个导出多个

   ```js
   //a.js
   let a = 1;
   let b = 2;
   let c = 3;
   export {b, c}
   export default a
   
   //b.js
   import a, {b, c} from 'a.js'
   //or
   import * as m from 'a.js'
   m.default.a
   m.b
   m.c
   ```

   

4. **CommonJS 模块的 `require()`是同步加载模块，ES6 模块的 `import`命令是异步加载，有一个独立的模块依赖的解析阶段。**

   ```js
   import('./a.js').then(() => {
       .....
   })
   ```

   

5. commonjs 中this指代当前模块， ESM中this是undefined

6. 引入，导出模块的语法不同



# 参考

1. [前端模块化详解(完整版)](https://juejin.im/post/5c17ad756fb9a049ff4e0a62)
2. [从 IIFE 聊到 Babel 带你深入了解前端模块化发展体系](https://juejin.im/post/5cb9e563f265da03712999e8)
3. [hux 模块七日谈](https://link.juejin.cn/?target=http%3A%2F%2Fhuangxuan.me%2Fjs-module-7day%2F%23%2F)

## 浏览器模块化的局限

- 缺乏模块管理能力，模块分散在各个项目中  ------- npm解决
- 性能加载慢，无法大型项目中直接使用 --- webpack解决，打包成单个脚本文件，性能更高

## npm原理

npm init创建模块，npm install安装模块，npm publish发布模块
npm link本地开发，npm config调整配置，npm run调用scripts

npm规范: package.json管理模块信息，node_ modules保存依赖

局限性：只能解决模块的高效管理和获取， 无法解决性能问题