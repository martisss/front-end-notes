# 模块化的发展

## 文件划分

不足之处：

- 变量全局定义导致的变量命名冲突以及调试困难，不知道某个变量具体属于哪个模块
- 模块依赖关系及模块加载顺序管理管理困难

## 命令空间

解决了全局变量定义带来的问题，本质上是在全局对象上挂载一个属性，属性值是一个对象，

但模块内的变量都能被外部访问到

## IIFE私有作用域

利用IIFE创建私有作用域，私有作用域中的变量只有模块返回的那些方法才能访问

## 模块化规范

### CommonJS规范

使用 require 来导入一个模块，用module.exports来导出一个模块

```js
// module-a.js
var data = "hello world";
function getData() {
  return data;
}
module.exports = {
  getData,
};

// index.js
const { getData } = require("./module-a.js");
console.log(getData());
```

**问题：**
模块加载器有Node.js提供，依赖Node.js本身的功能实现
同步加载，不适用于浏览器端，同步模块请求会造成JS解析的阻塞

### AMD规范

通过`define`定义和引入模块，定义模块时将需要导出的成员return出去。

```js
// main.js
define(["./print"], function (printModule) {
  printModule.print("main");
});

// print.js
define(function () {
  return {
    print: function (msg) {
      console.log("print " + msg);
    },
  };
});
```
require 与 define 的区别在于前者只能加载模块，而不能定义一个模块

### ES6 Moudle

>  **浏览器**

现代浏览器支持`ES6 Moudle`，在 HTML 中加入含有`type="module"`属性的 script 标签，那么浏览器会按照 ES Module 规范来进行依赖加载和模块解析，即使不打包也可以实现模块加载

>  Node.js**环境**

在package.json`中声明`type:

```js
// package.json
{
  "type": "module"
}
```

# vite实践

## 安装pnpm，初始化项目

```sh
npm i -g pnpm
//换源
pnpm config set registry https://registry.npmmirror.com/
pnpm create vite
//..
//选择模板
//..
pnpm isntall
pnpm run dev
```

## 注意：

在vite项目中，一个import语句，即代表一个http请求

## no-bundle  =>为什么这么快?

**利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载**，而不是**先整体打包再进行加载**。相比 Webpack 这种必须打包再加载的传统构建模式，Vite 在开发阶段省略了繁琐且耗时的打包过程，这也是它为什么快的一个重要原因。

## 配置文件

```js
export default defineConfig({
  // 手动指定项目根目录位置
  root: path.join(__dirname, 'src')
  plugins: [react()]
})
```

## 生产环境构建

```js
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
```

Vite 提供了开箱即用的 TypeScript 以及 JSX 的编译能力，但实际上底层并没有实现 TypeScript 的类型校验系统，因此需要借助 `tsc` 来完成类型校验(在 Vue 项目中使用 `vue-tsc` 这个工具来完成)

## Vite中接入CSS工程化方案

### 原生css开发的问题

1. **开发体验**欠佳。比如原生 CSS 不支持选择器的嵌套:

```css
// 选择器只能平铺，不能嵌套
.container .header .nav .title .text {
  color: blue;
}

.container .header .nav .box {
  color: blue;
  border: 1px solid grey;
}
```

1. **样式污染**问题。如果出现同样的类名，很容易造成不同的样式互相覆盖和污染。

```ts
// a.css
.container {
  color: red;
}

// b.css
// 很有可能覆盖 a.css 的样式！
.container {
  color: blue;
}
```

1. **浏览器兼容**问题。为了兼容不同的浏览器，我们需要对一些属性(如`transition`)加上不同的浏览器前缀，比如 `-webkit-`、`-moz-`、`-ms-`、`-o-`，意味着开发者要针对同一个样式属性写很多的冗余代码。
2. 打包后的**代码体积**问题。如果不用任何的 CSS 工程化方案，所有的 CSS 代码都将打包到产物中，即使有部分样式并没有在代码中使用，导致产物体积过大。

### 解决方案

1. `CSS 预处理器`：主流的包括`Sass/Scss`、`Less`和`Stylus`。这些方案各自定义了一套语法，让 CSS 也能使用嵌套规则，甚至能像编程语言一样定义变量、写条件判断和循环语句，大大增强了样式语言的灵活性，解决原生 CSS 的**开发体验问题**。
2. `CSS Modules`：能将 CSS 类名处理成哈希值，这样就可以避免同名的情况下**样式污染**的问题。
3. CSS 后处理器`PostCSS`，用来解析和处理 CSS 代码，可以实现的功能非常丰富，比如将 `px` 转换为 `rem`、根据目标浏览器情况自动加上类似于`--moz--`、`-o-`的属性前缀等等。
4. `CSS in JS` 方案，主流的包括`emotion`、`styled-components`等等，顾名思义，这类方案可以实现直接在 JS 中写样式代码，基本包含`CSS 预处理器`和 `CSS Modules` 的各项优点，非常灵活，解决了开发体验和全局样式污染的问题。
5. CSS 原子化框架，如`Tailwind CSS`、`Windi CSS`，通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了原生 CSS **开发体验**的问题。

## vite中的使用

## lint工具链保证代码风格

## ESLint与Prettier集合

