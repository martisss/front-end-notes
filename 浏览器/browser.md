# Document

## DOM && BOM

文档对象模型（Document Object Model），简称 DOM，将**所有页面内容表示为可以修改的对象。**

浏览器对象模型（Browser Object Model），简称 BOM，表示由浏览器（主机环境）提供的用于**处理文档（document）之外的所有内容的其他对象**。

## DOM树

一共有 [12 种节点类型](https://dom.spec.whatwg.org/#node)。实际上，我们通常用到的是其中的 4 种：

1. `document` — DOM 的“入口点”。
2. 元素节点 — HTML 标签，树构建块。
3. 文本节点 — 包含文本。
4. 注释 — 有时我们可以将一些信息放入其中，它不会显示，但 JS 可以从 DOM 中读取它。

> 

HTML/XML 文档在浏览器内均被表示为 DOM 树

- 标签（tag）成为元素节点，并形成文档结构。
- 文本（text）成为文本节点。

## 遍历DOM

![image.png](https://s2.loli.net/2021/12/22/ktNZ5VCByjfm4zo.png)

>  最顶层的树节点可以直接作为 `document` 的属性来使用：

```js
<html> = document.documentElement
<body> = document.body
<head> = document.head
```

在 DOM 中，`null` 值就意味着“不存在”或者“没有这个节点”。

> DOM集合

`childNodes` 是一个 **集合**，不是数组，可以用`for...of`迭代，不能使用数组方法

- **DOM 集合是只读的**
- **DOM 集合是实时的**

> 兄弟节点和父节点

nextSibling, nextSibling, parentNode

## 纯元素导航

![image.png](https://s2.loli.net/2021/12/22/unhtlBEQyDYSie5.png)

> **为什么是** `parentElement`**? 父节点可以不是一个元素吗？**

根节点 `document.documentElement`（`<html>`）的父节点是 `document`。但 `document` 不是一个元素节点，所以 `parentNode` 返回了 `document`，但 `parentElement` 返回的是 `null`

> 对于一个给定的DOM节点

- 对于所有节点：`parentNode`，`childNodes`，`firstChild`，`lastChild`，`previousSibling`，`nextSibling`。
- 仅对于元素节点：`parentElement`，`children`，`firstElementChild`，`lastElementChild`，`previousElementSibling`，`nextElementSibling`。

## 查找元素

> ## [document.getElementById 或者只使用 id](https://zh.javascript.info/searching-elements-dom#documentgetelementbyid-huo-zhe-zhi-shi-yong-id)

> ## [querySelectorAll](https://zh.javascript.info/searching-elements-dom#querySelectorAll)

`querySelectorAll` 返回的是一个 **静态的** 集合。就像元素的固定数组。

> ## [querySelector](https://zh.javascript.info/searching-elements-dom#querySelector)

> ## [matches](https://zh.javascript.info/searching-elements-dom#matches)

> ## [closest](https://zh.javascript.info/searching-elements-dom#closest)

`elem.closest(css)` 方法会查找与 CSS 选择器匹配的最近的祖先。

> ## [getElementsBy*](https://zh.javascript.info/searching-elements-dom#getelementsby)

所有的 `getElementsBy` 方法都会返回一个 **实时的（live）** 集合。这样的集合始终反映的是文档的当前状态，并且在文档发生更改时会“自动更新”。



有 6 种主要的方法，可以在 DOM 中搜索元素节点：

| 方法名                   | 搜索方式     | 可以在元素上调用？ | 实时的？ |
| ------------------------ | ------------ | ------------------ | -------- |
| `querySelector`          | CSS-selector | ✔                  | -        |
| `querySelectorAll`       | CSS-selector | ✔                  | -        |
| `getElementById`         | `id`         | -                  | -        |
| `getElementsByName`      | `name`       | -                  | ✔        |
| `getElementsByTagName`   | tag or `'*'` | ✔                  | ✔        |
| `getElementsByClassName` | class        | ✔                  | ✔        |

目前为止，最常用的是 `querySelector` 和 `querySelectorAll`

此外：

- `elem.matches(css)` 用于检查 `elem` 与给定的 CSS 选择器是否匹配。
- `elem.closest(css)` 用于查找与给定 CSS 选择器相匹配的最近的祖先。`elem` 本身也会被检查。

- 如果 `elemB` 在 `elemA` 内（`elemA` 的后代）或者 `elemA==elemB`，`elemA.contains(elemB)` 将返回 true。



## 节点属性

每个 DOM 节点都属于一个特定的类。这些类形成层次结构（hierarchy）。完整的属性和方法集是继承的结果。

![image.png](https://s2.loli.net/2021/12/22/HVwTYIJniLuld31.png)

主要的 DOM 节点属性有：

- `nodeType`

  我们可以使用它来查看节点是文本节点还是元素节点。1` 表示元素，`3` 表示文本节点，其他一些则代表其他节点类型。只读。

- `nodeName/tagName`

  用于元素名，标签名（除了 XML 模式，都要大写）。对于非元素节点，`nodeName` 描述了它是什么。只读。

- `innerHTML`

  元素的 HTML 内容。可以被修改。

- `outerHTML`

  元素的完整 HTML。对 `elem.outerHTML` 的写入操作不会触及 `elem` 本身。而是在外部上下文中将其替换为新的 HTML。

- `nodeValue/data`

  非元素节点（文本、注释）的内容。两者几乎一样，我们通常使用 `data`。可以被修改。

- `textContent`

  元素内的文本：HTML 减去所有 `<tags>`。写入文本会将文本放入元素内，所有特殊字符和标签均被视为文本。可以安全地插入用户生成的文本，**并防止不必要的 HTML 插入**。

- `hidden`

  当被设置为 `true` 时，执行与 CSS `display:none` 相同的事。

## Attributes and properties

- 特性（attribute）— 写在 HTML 中的内容。

  > - 它们的名字是大小写不敏感的（`id` 与 `ID` 相同）。
  >
  > - 它们的值总是字符串类型的。
  >
  > - `attributes` 集合是可迭代对象，该对象将所有元素的特性（标准和非标准的）作为 `name` 和 `value` 属性存储在对象中。
  >
  > - 非标准特性  dataset
  >
  >   > **所有以 “data-” 开头的特性均被保留供程序员使用。它们可在 `dataset` 属性中使用。**

- 属性（property）— DOM 对象中的内容。

  > dom属性是多类型的
  >
  > - 大部分是字符串
  >
  > - 布尔  input.checked
  > - 对象  style

> 浏览器会辨别 **标准的** 特性并以此创建 DOM 属性。

> 属性-特性同步

当一个标准的特性被改变，对应的属性也会自动更新

:astonished:例外：

- `input.value` 只能从特性同步到属性，反过来则不行：

  > - 改变特性值 `value` 会更新属性。
  >
  > - 但是属性的更改不会影响特性。
  >
  >   用户行为可能会导致 `value` 的更改，然后在这些操作之后，如果我们想从 HTML 中恢复“原始”值，那么该值就在特性中

简略的对比：

|      | 属性                                   | 特性                         |
| :--- | :------------------------------------- | :--------------------------- |
| 类型 | 任何值，标准的属性具有规范中描述的类型 | 字符串                       |
| 名字 | 名字（name）是大小写敏感的             | 名字（name）是大小写不敏感的 |

操作特性的方法：

- `elem.hasAttribute(name)` — 检查是否存在这个特性。
- `elem.getAttribute(name)` — 获取这个特性值。
- `elem.setAttribute(name, value)` — 设置这个特性值。
- `elem.removeAttribute(name)` — 移除这个特性。
- `elem.attributes` — 所有特性的集合。



- 我们需要一个非标准的特性。但是如果它以 `data-` 开头，那么我们应该使用 `dataset`。
- 我们想要读取 HTML 中“所写的”值。对应的 DOM 属性可能不同，例如 `href` 属性一直是一个 **完整的** URL，但是我们想要的是“原始的”值。

## 修改文档

### 创建元素

创建元素节点

**document.createElement(tag)**

创建文本节点

**document.createTextNode(text)**

### 插入/替换

- `node.append(...nodes or strings)` —— 在 `node` **末尾** 插入节点或字符串，
- `node.prepend(...nodes or strings)` —— 在 `node` **开头** 插入节点或字符串，
- `node.before(...nodes or strings)` —— 在 `node` **前面** 插入节点或字符串，
- `node.after(...nodes or strings)` —— 在 `node` **后面** 插入节点或字符串，
- `node.replaceWith(...nodes or strings)` —— 将 `node` 替换为给定的节点或字符串。



`elem.insertAdjacentHTML(where, html)`。

该方法的第一个参数是代码字（code word），指定相对于 `elem` 的插入位置。必须为以下之一：

- `"beforebegin"` — 将 `html` 插入到 `elem` 前插入，
- `"afterbegin"` — 将 `html` 插入到 `elem` 开头，
- `"beforeend"` — 将 `html` 插入到 `elem` 末尾，
- `"afterend"` — 将 `html` 插入到 `elem` 后。

### 删除

移除一个节点，可以使用 `node.remove()`

注意：如果我们要将一个元素 **移动** 到另一个地方，则无需将其从原来的位置中删除。

**所有插入方法都会自动从旧位置删除该节点。**

## 克隆节点

```js
elem.cloneNode(true) //深克隆
elem.cloneNode(false) //浅克隆
```

## DocumentFragment

`DocumentFragment` 是一个特殊的 DOM 节点，用作来传递节点列表的包装器（wrapper）

**可以向其附加其他节点，但是当我们将其插入某个位置时，则会插入其内容**

与<template>元素有关

## 其他

### document.write(html)

在页面加载完成之前将 HTML 附加到页面, 页面加载完成后，这样的调用将会擦除文档

### [createTextNode vs innerHTML vs textContent](https://zh.javascript.info/modifying-document#createtextnodevsinnerhtmlvstextcontent)

createTextNode 与 textContent 做的事情相同，都会将

目标内容作为文本添加到节点中

### 旧式方法

这里还有“旧式”的方法：

- `parent.appendChild(node)`
- `parent.insertBefore(node, nextSibling)`
- `parent.removeChild(node)`
- `parent.replaceChild(newElem, node)`

这些方法都返回 `node`

## 样式和类

- `className` — 字符串值，可以很好地管理整个类的集合。
- `classList` — 具有 `add/remove/toggle/contains` 方法的对象，可以很好地支持单个类。

要改变样式：

- `style` 属性是具有驼峰（camelCased）样式的对象。对其进行读取和修改与修改 `"style"` 特性（attribute）中的各个属性具有相同的效果。要了解如何应用 `important` 和其他特殊内容 — 在 [MDN](https://developer.mozilla.org/zh/docs/Web/API/CSSStyleDeclaration) 中有一个方法列表。
- `style.cssText` 属性对应于整个 `"style"` 特性（attribute），即完整的样式字符串。

要读取已解析的（resolved）样式（对于所有类，在应用所有 CSS 并计算最终值之后）：

- `getComputedStyle(elem, [pseudo])` 返回与 `style` 对象类似的，且包含了所有类的对象。只读。

## 元素大小和滚动

![image-20211223135115932](D:\NOTES\浏览器\browser.assets\image-20211223135115932.png)

![image-20211223135225427](D:\NOTES\浏览器\browser.assets\image-20211223135225427.png)

![image-20211223135314714](D:\NOTES\浏览器\browser.assets\image-20211223135314714.png)

:astonished:`scrollLeft/scrollTop` **是可修改的**

元素具有以下几何属性：

- `offsetParent` — 是最接近的 CSS 定位的祖先，或者是 `td`，`th`，`table`，`body`。
- `offsetLeft/offsetTop` — 是相对于 `offsetParent` 的左上角边缘的坐标。
- `offsetWidth/offsetHeight` — 元素的“外部” width/height，边框（border）尺寸计算在内。
- `clientLeft/clientTop` — 从元素左上角外角到左上角内角的距离。对于从左到右显示内容的操作系统来说，它们始终是左侧/顶部 border 的宽度。而对于从右到左显示内容的操作系统来说，垂直滚动条在左边，所以 `clientLeft` 也包括滚动条的宽度。
- `clientWidth/clientHeight` — 内容的 width/height，包括 padding，但不包括滚动条（scrollbar）。
- `scrollWidth/scrollHeight` — 内容的 width/height，就像 `clientWidth/clientHeight` 一样，但还包括元素的滚动出的不可见的部分。
- `scrollLeft/scrollTop` — 从元素的左上角开始，滚动出元素的上半部分的 width/height。

除了 `scrollLeft/scrollTop` 外，所有属性都是只读的。如果我们修改 `scrollLeft/scrollTop`，浏览器会滚动对应的元素。

**CSS width 与 clientWidth 的不同点**

1. `clientWidth` 值是数值，而 `getComputedStyle(elem).width` 返回一个以 `px` 作为后缀的字符串。
2. `getComputedStyle` 可能会返回非数值的 width，例如内联（inline）元素的 `"auto"`。
3. `clientWidth` 是元素的内部内容区域加上 padding，而 CSS width（具有标准的 `box-sizing`）是内部内容区域，**不包括 padding**。
4. 如果有滚动条，并且浏览器为其保留了空间，那么某些浏览器会从 CSS width 中减去该空间（因为它不再可用于内容），而有些则不会这样做。`clientWidth` 属性总是相同的：如果为滚动条保留了空间，那么将减去滚动条的大小。

## [窗口的 width/height](https://zh.javascript.info/size-and-scroll-window#chuang-kou-de-widthheight)

几何：

- 文档可见部分的 width/height（内容区域的 width/height）：`document.documentElement.clientWidth/clientHeight`

  > `window.innerWidth/innerHeight` 包括了滚动条

- 整个文档的 width/height，其中包括滚动出去的部分：

  ```javascript
  let scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  ```

滚动：

- 读取当前的滚动：`window.pageYOffset/pageXOffset`。

- 更改当前的滚动：

  - `window.scrollTo(pageX,pageY)` — 绝对坐标，
  - `window.scrollBy(x,y)` — 相对当前位置进行滚动，
  - `elem.scrollIntoView(top)` — 滚动以使 `elem` 可见（`elem` 与窗口的顶部/底部对齐, top=true/false）。

- 禁止当前滚动

  >  document.body.style.overflow = "hidden"
  >
  > 缺点是会使滚动条消失, 可以在 `document.body` 中滚动条原来的位置处通过添加 `padding`，来替代滚动条

## 坐标

页面上的任何点都有坐标：

1. 相对于窗口的坐标 — `elem.getBoundingClientRect()`。
2. 相对于文档的坐标 — `elem.getBoundingClientRect()` 加上当前页面滚动。

窗口坐标非常适合和 `position:fixed` 一起使用，文档坐标非常适合和 `position:absolute` 一起使用。

这两个坐标系统各有利弊。有时我们需要其中一个或另一个，就像 CSS `position` 的 `absolute` 和 `fixed` 一样。





# 浏览器

## 架构

### 多进程架构的优点

> 一个进程崩溃了不会影响其他进程

> 有助于安全和隔离

## 导航

定义：从请求网页到浏览器准备渲染网页的过程，叫做导航

第一步：**处理输入**。UI线程会判断用户输入的是查询字符串还是URL。因为Chrome的地址栏同时也是搜索框。

第二步：**开始导航**。如果输入的是URL，UI线程会通知网络线程发起网络调用，获取网站内容。此时标签页左端显示旋转图标，网络线程进行DNS查询、建立TLS连接（对于HTTPS）。网络线程可能收到服务器的重定向头部，如HTTP 301。此时网络线程会跟UI线程沟通，告诉它服务器要求重定向。然后，再发起对另一个URL的请求。

第三步：**读取响应**。服务器返回的响应体到来之后，网络线程会检查接收到的前几个字节。响应的Content-Type头部应该包含数据类型，如果没有这个字段，则需要MIME类型嗅探

> 如果响应是HTML文件，那下一步就是把数据交给渲染器进程。但如果是一个zip文件或其他文件，那就意味着是一个下载请求，需要把数据传给下载管理器。

第四步：**联系渲染器进程**。所有查检完毕，网络线程确认浏览器可以导航到用户请求的网站，于是会通知UI线程数据已经准备好了。UI线程会联系渲染器进程渲染网页。

第五步：**提交导航**。数据和渲染器进程都有了，就可以通过IPC从浏览器进程向渲染器进程提交导航。渲染器进程也会同时接收到不间断的HTML数据流。当浏览器进程收到渲染器进程的确认消息后，导航完成，文档加载阶段开始。

最后一步：**初始加载完成**。提交导航之后，渲染器进程将负责加载资源和渲染页面（具体细节后面介绍）。而在“完成”渲染后（在所有iframe中的`onload`事件触发且执行完成后），渲染器进程会通过IPC给浏览器进程发送一个消息。此时，UI线程停止标签页上的旋转图标。

## 渲染

## 交互



https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/



## 回流和重绘

https://juejin.cn/post/6844903734951018504在·

### 浏览器渲染过程如下：

解析HTML，生成DOM树，解析CSS，生成CSSOM树

将DOM树和CSSOM树结合，生成渲染树(Render Tree)

Layout(回流):根据生成的渲染树，进行回流(Layout)，得到节点的几何信息（位置，大小）

Painting(重绘):根据渲染树以及回流得到的几何信息，得到节点的绝对像素

Display:将像素发送给GPU，展示在页面上。

