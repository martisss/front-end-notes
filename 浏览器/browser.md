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

**在 DOM 的世界中，`null` 就意味着“不存在”**,在 DOM 中，`null` 值就意味着“不存在”或者“没有这个节点”。

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

所有的 `"getElementsBy*"` 方法都会返回一个 **实时的（live）** 集合。这样的集合始终反映的是文档的当前状态，并且在文档发生更改时会“自动更新”。



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

  元素内的文本：HTML 减去所有 `<tags>`。写入文本会将文本放入元素内，所有特殊字符和标签均被视为文本。可以安全地插入用户生成的文本，并防止不必要的 HTML 插入。

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