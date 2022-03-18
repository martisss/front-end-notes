# 理念

react的理念是构造快速响应的大型web应用程序，制约快速响应的有两个场景，cpu的瓶颈和IO的瓶颈，对于前者来说，js线程和GUI渲染线程是互斥的，当js线程执行时间过长时，就会出现掉帧的现象引起卡顿，为解决这一问题，react启用时间分片，也就是js任务的执行分配到每一帧的时间中，那么每一帧剩下的时间浏览器就有时间进行布局和绘制， react等待下一帧的时间进行布局和绘制，

# React架构

## React16架构



React16架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

### scheduler

浏览器api[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)，这个函数将在浏览器空闲时期被调用。但是兼容性不好，且触发频率不稳定，比如当我们的浏览器切换tab后，之前tab注册的`requestIdleCallback`触发的频率会变得很低，`React`实现了功能更完备的`requestIdleCallback`polyfill，这就是**Scheduler**。

### reconciler

reconciler工作阶段成为render阶段，renderer工作阶段成为commit阶段。

React16中，**Reconciler**与**Renderer**不再是交替工作, 在内存中reconciler完成所有工作，然后交给renderer

> `Reconciler`内部采用了`Fiber`的架构。

`React Fiber`可以理解为：

`React`内部实现的一套状态更新机制。支持任务不同`优先级`，可中断与恢复，并且恢复后可以复用之前的`中间状态`。

##### Fiber

在`React15`及以前，`Reconciler`采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

为了解决这个问题，`React16`将**递归的无法中断的更新**重构为**异步的可中断更新**

1. 每个`Fiber节点`对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
2. 作为动态的工作单元来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

#### 双缓存Fiber

**在内存中构建并直接替换**的技术叫做[双缓存 (opens new window)](https://baike.baidu.com/item/双缓冲)。

`React`使用“双缓存”来完成`Fiber树`的构建与替换——对应着`DOM树`的创建与更新。

`React`应用的根节点通过使`current`指针在不同`Fiber树`的`rootFiber`间切换来完成`current Fiber`树指向的切换。

#### mount时

1. 首次执行`ReactDOM.render`会创建`fiberRootNode`（源码中叫`fiberRoot`）和`rootFiber`。其中`fiberRootNode`是整个应用的根节点，`rootFiber`是`<App/>`所在组件树的根节点。

   > `fiberRootNode`的`current`会指向当前页面上已渲染内容对应`Fiber树`，即`current Fiber树`。

2. 接下来进入`render阶段`，根据组件返回的`JSX`在内存中依次创建`Fiber节点`并连接在一起构建`Fiber树`，被称为`workInProgress Fiber树`。
3. `workInProgress Fiber树`在`commit阶段`渲染到页面,`fiberRootNode`的`current`指针指向`workInProgress Fiber树`使其变为`current Fiber 树`。

#### update时

1. 检测到状态改变，开启新一次的render阶段，并构建一棵新的`workInProgress Fiber 树`。和`mount`时一样，`workInProgress fiber`的创建可以复用`current Fiber树`对应的节点数据。这就涉及到diff算法，决定哪些部分可以进行复用
2. `workInProgress Fiber 树`在`render阶段`完成构建后进入`commit阶段`渲染到页面上。渲染完毕后，`workInProgress Fiber 树`变为`current Fiber 树`。

### Render阶段 TODO

#### Fiber树是如何构建的

从rootFiber开始向下深度优先遍历，为每个Fiber节点调用beginWork方法，该方法会根据传入的`Fiber节点`创建`子Fiber节点`，并将这两个`Fiber节点`连接起来。直到遍历到叶子节点，然后向上递归调用`completeWork`方法处理每个节点，如果存在兄弟节点，继续调用beiginWork方法，重复上述操作。

#### beginWork方法

主要作用是传入当前Fiber节点，创建子Fiber节点。

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...省略函数体
}
```

current代表上次更新时的Fiber节点， 根据fiber节点是否为空，可以判断处于mount还是update阶段。

`render阶段`的工作是在内存中进行，当工作结束后会通知`Renderer`需要执行的`DOM`操作。要执行`DOM`操作的具体类型就保存在`fiber.effectTag`中。

#### completeWork

> **effectList**

每个执行完`completeWork`且存在`effectTag`的`Fiber节点`会被保存在一条被称为`effectList`的单向链表中。

`effectList`中第一个`Fiber节点`保存在`fiber.firstEffect`，最后一个元素保存在`fiber.lastEffect`。

### Commit 阶段 TODO

#### before mutation

`before mutation阶段`，会遍历`effectList`，依次执行：

1. 处理`DOM节点`渲染/删除后的 `autoFocus`、`blur`逻辑
2. 调用`getSnapshotBeforeUpdate`生命周期钩子
3. 调度`useEffect`

#### mutation

`mutation阶段`会遍历`effectList`，依次执行`commitMutationEffects`。该方法的主要工作为“根据`effectTag`调用不同的处理函数处理`Fiber`。

#### layout

`layout阶段`会遍历`effectList`，依次执行`commitLayoutEffects`。该方法的主要工作为“根据`effectTag`调用不同的处理函数处理`Fiber`并更新`ref`。

# Diff算法

对比两棵树时，diff算法会首先比较两棵树的根节点

当根节点的元素类型不一样时，会卸载原来的树，建立新的树

当对比相同类型的元素，会保留DOM节点，仅比对及更新有改变的属性。

当对比同类型的组件元素时，当一个组件更新，其组件实例保持不变，因此可以在不同的渲染时保持 state 一致，React 将更新该组件实例的 props 以保证与最新的元素保持一致

diff算法的优化策略：

1. 只对同级元素进行diff
2. 两个不同类型的元素会产生出不同的树,会销毁原来的节点及其子孙节点
3. 通过标记key的方式进行列表对比

Diff`的入口函数`[reconcileChildFibers](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1280)

从同级的节点数量将Diff分为两类：

1. 当`newChild`类型为`object`、`number`、`string`，代表同级只有一个节点
2. 当`newChild`类型为`Array`，同级有多个节点

## 单节点diff

1. 首先判断上次更新时的fiber节点是否存在对应的dom节点

2. 然后判断该节点是否可以复用

   - 如果可以复用的话就返回上次更新的fiber节点的副本，作为新生成的fiber节点
   - 如果不能复用的话就标记该DOM需要被删除，新生成一个Fiber节点并返回

   > 如何判断是否可以复用？

   首先比较key是否相同，如果key相同再去比较type是否相同，如果type也相同表明可以复用该节点，如果type不同，将该fiber及其兄弟fiber标记为删除（deleteRemainingChildren）；如果key不同，将该fiber标记为删除（因为可能找得到其他兄弟节点的key相同）（deleteChild)

是对象的话调用[ reconcileSingleElement](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1141)

## 多节点diff

**Diff**算法的整体逻辑会经历两轮遍历：

> 第一轮遍历：处理`更新`的节点。
>
> 第二轮遍历：处理剩下的不属于`更新`的节点。

原因：不同操作优先级不同，相较于`新增`和`删除`，`更新`组件发生的频率更高。

> 此外，`JSX对象` `newChildren`为数组形式，但是和`newChildren`中每个组件进行比较的是`current fiber`，同级的`Fiber节点`是由`sibling`指针链接形成的单链表，即不支持双指针遍历。



# 面试题

# 为什么React要用JSX

1. JSX是一个`Javascript`的语法扩展，或者说是一个类似于`XML`的`ECMAScript`语法扩展，本身没有太多的语法定义，也不希望引入更多的标准。

- JSX 主要用于声明 React 元素，但 React 中并不强制使用 JSX。即使使用了 JSX，也会在构建过程中，通过 Babel 插件编译为 React.createElement。所以 JSX 更像是 React.createElement 的一种语法糖。

1. 设计初衷：关注点分离，将代码分割成不同部分的设计原则，是面向对象的程序设计的核心概念
2. 技术方案对比

- 模板:React 团队认为模板不应该是开发过程中的关注点，因为引入了模板语法、模板指令等概念，是一种不佳的实现方案
- 模板字符串：模板字符串编写的结构会造成多次内部嵌套，使整个结构变得复杂，并且优化代码提示也会变得困难重重
- JXON：代码提示困难的原因而被放弃

# :question:Bable插件如何实现JSX到JS的编译

  `Babel`读取代码并解析，生成`AST`，再将`AST` 传入插件层进行转换，在转换时就可以将`JSX`的结构转换为`React.createElement`的函数。

```js
module.exports = function (babel) {
  var t = babel.types;
  return {
    name: "custom-jsx-plugin",
    visitor: {
      JSXElement(path) {
        var openingElement = path.node.openingElement;
        var tagName = openingElement.name.name;
        var args = []; 
        args.push(t.stringLiteral(tagName)); 
        var attribs = t.nullLiteral(); 
        args.push(attribs); 
        var reactIdentifier = t.identifier("React"); //object
        var createElementIdentifier = t.identifier("createElement"); 
        var callee = t.memberExpression(reactIdentifier, createElementIdentifier)
        var callExpression = t.callExpression(callee, args);
        callExpression.arguments = callExpression.arguments.concat(path.node.children);
        path.replaceWith(callExpression, path.node); 
      },
    },
  };
};
12345678910111213141516171819202122
```

# :question:如何避免生命周期中的坑

- 生命周期时一个抽象的概念
- 挂载：组件从初始化到完成加载的过程

1. `constructor`：是类通用的构造函数，常用于初始化
     社区中去除`constructor`的原因：
   a. `constructor`并不推荐去处理初始化之外的逻辑
   b. `constructor`不属于`React`的生命周期，只是`Class`的初始化函数
   c. 移除`constructor`,代码会更整洁
2. `getDerivedStateFromProps`:使组件在`props`变化时更新`state`
   调用时机:
   a. `props`被传入时
   b. `state`发生变化时
   c. `forceUpdate`被调用时
3. `render`:返回的`JSX`结构，用于描述具体的渲染内容
4. `componentDidMount`:组件加载完成时做某些操作

- 更新
    指外部`props`传入，或`state`发生变化时的阶段
- 卸载

1. `componentWillUnmount`：用于执行清理工作。在该阶段解除事件绑定，取消定时器

## 什么时候会触发重新渲染

1. 函数组件：任何情况下都会触发渲染吗，。没有生命周期，官方提供`React.memo`优化手段
2. `React.Component`：不实现`shouldComponentUpdate`函数，有两种情况触发重新渲染
   a. `state`发生变化时
   b. 当父组件的`Props`传入时
3. `React.PuerComponent`:默认实现了`shouldComponentUpdate`函数，仅在`props`与`state`进行浅比较后，确认有变更时才会触发重新渲染

## 错误边界

1. `getDerivedStateFromError`：处理UI降级
2. `componentDidCatch`:捕获报错的具体错误类型

**渲染时的报错，只能通过`componentDidCatch`捕获**

避免坑：
避免生命周期中的坑需要做好两件事：

1. 不在恰当的时候调用了不该调用的代码；
2. 在需要调用时，不要忘了调用

主要有7种情况容易造成生命周期的坑:

1. `getDerivedStateFromProps`容易编写反模式代码，使受控组件与非受控组件区分模糊。
2. `componentWillMount`在`React` 中已被标记弃用，不推荐使用，主要原因是新的异步渲染架构会导致它被多次调用。所以网络请求及事件绑定代码应移至`componentDidMount`中。
3. `componentWillReceiveProps`同样被标记弃用，被`getDerivedStateFromProps` 所取代，主要原因是性能问题。
4. `shouldComponentUpdate`通过返回`true`或者`false`来确定是否需要触发新的渲染。主要用于性能优化
5. `componentWillUpdate` 同样是由于新的异步渲染机制，而被标记废弃，不推荐使用，原先的逻辑可结合 `getSnapshotBeforeUpdate`与`componentDidUpdate`改造使用
6. 如果在`componentWillUnmount`函数中忘记解除事件绑定，取消定时器等清理操作，容易引发 bug。
7. 如果没有添加错误边界处理，当渲染发生异常时，用户将会看到一个无法操作的白屏，所以一定要添加

# 类组件与函数组件的区别

![在这里插入图片描述](https://img-blog.csdnimg.cn/11a9aed4159b4a77b46cb5af1754defa.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

1. 基础认知:类组件与函数组件本质上代表了两种不同的设计思想与心智模式。

- 类组件的根基是 OOP（面向对象编程），所以它有继承、有属性、有内部状态的管理。
- 函数组件的根基是 FP，也就是函数式编程。它属于“结构化编程”的一种，与数学函数思想类似。也就是假定输入与输出存在某种特定的映射关系，那么输入一定的情况下，输出必然是确定的。
  **相较于类组件，函数组件更纯粹、简单、易测试。 这是它们本质上最大的不同。**

1. 独有能力
   类组件通过生命周期包装业务逻辑，这是类组件所特有的

```js
class A extends React.Component {

  componentDidMount() {

     fetchPosts().then(posts => {

      this.setState({ posts });

    }

  }

  render() {

    return ...

  }

}
12345678910111213141516171819
```

在还没有 Hooks 的时代，函数组件的能力是相对较弱的。在那个时候常常用高阶组件包裹函数组件模拟生命周期。当时流行的解决方案是 Recompose。如下代码所示：

```js
const PostsList = ({ posts }) => (

  <ul>{posts.map(p => <li>{p.title}</li>)}</ul>

)

const PostsListWithData = lifecycle({

  componentDidMount() {

    fetchPosts().then(posts => {

      this.setState({ posts });

    })

  }

})(PostsList);

1234567891011121314151617181920
```

这一解决方案在一定程度上增强了函数组件的能力，但它并没有解决业务逻辑掺杂在生命周期中的问题。Recompose 后来加入了 React 团队，参与了 Hooks 标准的制定，并基于 Hooks 创建了一个完全耳目一新的方案。
这个方案从一个全新的角度解决问题：不是让函数组件去模仿类组件的功能，而是提供新的开发模式让组件渲染与业务逻辑更分离。设计出如下代码：

```js
import React, { useState, useEffect } from 'react';



function App() {

  const [data, setData] = useState({ posts: [] });

  useEffect(() => {

    (async () => {

      const result = await fetchPosts();

      setData(result.data);

    }()

  }, []);



  return (

    <ul>{data.posts.map(p => <li>{p.title}</li>)}</ul>

  );

}



export default App;

12345678910111213141516171819202122232425262728293031323334
```

1. 使用场景

- 在不使用 Recompose 或者 Hooks 的情况下，如果需要使用生命周期，那么就用类组件，限定的场景是非常固定的
- 但在 recompose 或 Hooks 的加持下，这样的边界就模糊化了，类组件与函数组件的能力边界是完全相同的，都可以使用类似生命周期等能力。

1. 设计模式
   在设计模式上，因为类本身的原因，类组件是可以实现继承的，而函数组件缺少继承的能力。
2. 性能优化

- 类组件的优化主要依靠 shouldComponentUpdate 函数去阻断渲染。
- 函数组件一般靠 React.memo 来优化。React.memo 并不是去阻断渲染

1. 未来趋势
     由于 React Hooks 的推出，函数组件成了社区未来主推的方案。
     React 团队从 Facebook 的实际业务出发，通过探索时间切片与并发模式，以及考虑性能的进一步优化与组件间更合理的代码拆分结构后，认为类组件的模式并不能很好地适应未来的趋势。 他们给出了 3 个原因：

- this 的模糊性
- 业务逻辑散落在生命周期中
- React 的组件代码缺乏标准的拆分方式
    而使用 Hooks 的函数组件可以提供比原先更细粒度的逻辑组织与复用，且能更好地适用于时间切片与并发模式

> 作为组件而言，类组件与函数组件在使用与呈现上没有任何不同，性能上在现代浏览器中也不会有明显差异。
> 它们在开发时的心智模型上却存在巨大的差异。类组件是基于面向对象编程的，它主打的是继承、生命周期等核心概念；而函数组件内核是函数式编程，主打的是 immutable、没有副作用、引用透明等特点。
> 前，在使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件。
> 但现在由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。
> 其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。
> 性能优化上，类组件主要依靠 shouldComponentUpdate 阻断渲染来提升性能，而函数组件依靠 React.memo 缓存渲染结果来提升性能。
> 从上手程度而言，类组件更容易上手，从未来趋势上看，由于React Hooks 的推出，函数组件成了社区未来主推的方案。
> 类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展。

# 如何设计`React`组件

![在这里插入图片描述](https://img-blog.csdnimg.cn/5507890c1e5f4c0ba4516360eaa09adb.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/eff8fded13654189afbdb0f82e311e77.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

## 设计分类

### 展示组件

1. 代理组件
   代理组件常用于封装常用属性，减少重复代码
   举一个最常见的例子，当需要定义一个按钮的时候，需要在按钮上添加 button 属性，代码如下：

```html
<button type="button">
1
```

当然在 React 中使用的时候，不可能每次都写这样一段代码，非常麻烦。常见的做法是封装：

```js
const Button = props =><button type="button" {...props}>
1
```

在开发中使用 Button 组件替代原生的 button，可以确保 type 保证一致。
在使用 Antd 开发时，你也会采用类似的设计模式，大致情况如下：

```js
import { Button as AntdButton } from from 'antd'
const Button = props =>
  <AntdButton size="small" type="primary" {...props}>
export default Button
1234
```

虽然进行封装感觉是多此一举，但切断了外部组件库的强依赖特性。在引入外部组件库需要考虑两点：

- 如果当前组件库不能使用了，是否能实现业务上的无痛切换
- 如果需要批量修改基础组件的字段，如何解决
  代理组件的设计模式很好地解决了上面两个问题。从业务上看，代理组件隔绝了 Antd，仅仅是一个组件 Props API 层的交互。这一层如若未来需要替换，是可以保证兼容、快速替换的，而不需要在原有的代码库中查找修改。其次，如果要修改基础组件的颜色、大小、间距，代理组件也可以相对优雅地解决，使得这些修改都内聚在当前的 Button 组件中，而非散落在其他地方

2. 样式组件
   样式组件也是一种代理组件，只是又细分了处理样式领域，将当前的关注点分离到当前组件内。你是否还记得在第 02 讲中提到过“关注点分离”的概念，其中就说到“将代码分隔为不同部分，其中每一部分都会有自己的关注焦点”。
   但在工程实践中，我们并不会因为一个按钮需要协商 className 而封装成一个组件，就像下面这样：

```js
const Button = props => (
  <button type="button" className="btn btn-primary">
)
123
```

真实工程项目的样式管理往往是复杂的，它更接近于下面这个例子：

```js
import classnames from "classnames";

const StyleButton = ({ className, primary, isHighLighted,  ...props }) => (
  <Button
    type="button"
    className={classnames("btn", {
     btn-primary: primary,
     highLight: isHighLighted,
}, className)}
    {...props}
  />
);
123456789101112
```

复杂的样式管理对于 Button 是没有意义的，如果直接使用 Button，在属性上修改，对工程代码而言就是编写大量的面条代码。而 StyleButton 的思路是将样式判断逻辑分离到自身上，面向未来改动的时候会更为友好。

3. 布局组件
   布局组件的基本设计与样式组件完全一样，但它基于自身特性做了一个小小的优化。
   首先来看下它的基础使用案例，主要用于安放其他组件，类似于这样的用法：

```js
<Layout
  Top={<NavigationBar />}
  Content={<Article />}
  Bottom={<BottomBar />}
/>
12345
```

布局本身是确定的，不需要根据外部状态的变化去修改内部组件。所以这也是一个可以减少渲染的优化点。（当然，这里的样式结构写得比较简单）

```js
class Layout extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    <div>
      <div>{this.props.NavigationBar}</div>
      <div>{this.props.Article}</div>
      <div>{this.props.BottomBar}</div>
    </div>
  }
}
123456789101112
```

由于布局组件无需更新，可以通过写死shouldComponentUpdate 的返回值直接阻断渲染过程。对于大型前端工程，类似的小心思可以带来性能上的提升。当然，这也是基于代理组件更易于维护而带来的好处。

### 灵巧组件

由于灵巧组件面向业务，所以相对于展示组件来说，其功能更为丰富、复杂性更高，而复用度更低。展示组件专注于组件本身特性，灵巧组件更专注于组合组件。那么最常见的案例则是容器组件。

1. 容器组件
   容器组件几乎没有复用性，它主要用在两个方面：**拉取数据与组合组件**。可以看这样一个例子：

```js
const CardList = ({ cards }) => (
  <div>
    {cards.map(card => (
      <CardLayout
        header={<Avatar url={card.avatarUrl} />}
        Content={<Card {...card} />}
      />
        {comment.body}-{comment.author}
    ))}
  </div>
);
1234567891011
```

这是一个 CardList 组件，负责将 cards 数据渲染出来，接下来将获取网络数据。如下代码所示：

```js
class CardListContainer extends React.Component {
  state = { cards: [] }
 
  async componentDidMount() {
    const response = await fetch('/api/cards')
    this.setState({cards: response})
  }
 
  render() {
    return <CardList cards={this.state.cards} />
  }
}
123456789101112
```

像这样切分代码后，你会发现容器组件内非常干净，没有冗余的样式与逻辑处理。你有没有发现这也是采取了关注点分离的策略？其实这一策略还可以直接应用到你的工作中。因为互联网人的工作常常是多线并行，如果想把事做得更漂亮，可以尝试把它切分成多个片段，让自己的关注点在短时间内更为集中，从而做到高效快速地处理。
\2. 高阶组件
React 的官方文档将高阶组件称为 React 中复用组件逻辑的高级技术。高阶组件本身并不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。简而言之，高阶组件的参数是组件，返回值为新组件的函数。
这样听起来有一些高阶函数的味儿了。那什么是高阶函数呢？如果一个函数可以接收另一个函数作为参数，且在执行后返回一个函数，这种函数就称为高阶函数。在 React 的社区生态中，有很多基于高阶函数设计的库，比如 reselector 就是其中之一。
思想一脉相承，React 团队在组件方向也汲取了同样的设计模式。源自高阶函数的高阶组件，可以同样优雅地抽取公共逻辑

a. 抽取公共逻辑
用一个常见的例子来说，就是登录态的判断。假设当前项目有订单页面、用户信息页面及购物车首页，那么对于订单页面与用户信息页面都需要检查当前是否已登录，如果没有登录，则应该跳转登录页。
一般的思路类似于：

```js
const checkLogin = () => {
  return !!localStorage.getItem('token')
}
class CartPage extends React.Component {
   ...
}
class UserPage extends  React.Component {
  componentDidMount() {
    if(!checkLogin) {
      // 重定向跳转登录页面
    }
  }
  ...
}
class OrderPage extends  React.Component {
  componentDidMount() {
    if(!checkLogin) {
      // 重定向跳转登录页面
    }
  }
  ...
 }
12345678910111213141516171819202122
```

虽然已经抽取了一个函数，但还是需要在对应的页面添加登录态的判断逻辑。然而如果有高阶组件的话，情况会完全不同。

```js
const checkLogin = () => {
  return !!localStorage.getItem('token')
}
const checkLogin = (WrappedComponent) => {
          return (props) => {
              return checkLogin() ? <WrappedComponent {...props} /> : <LoginPage />;
          }
// 函数写法
class RawUserPage extends  React.Component {
  ...
}
const UserPage = checkLogin(RawUserPage)
// 装饰器写法
@checkLogin
class UserPage extends  React.Component {
  ...
}
@checkLogin
class OrderPage extends  React.Component {
  ...
}
123456789101112131415161718192021
```

从上面的例子中可以看出无论采用函数还是装饰器的写法，都使得重复代码量下降了一个维度。

还有一个非常经典的场景就是页面埋点统计。如果使用装饰器编写的话，大概是这样的：

```js
const trackPageView = (pageName) = { 
   // 发送埋点信息请求
   ... 
}
const PV = (pageName) => {
  return (WrappedComponent) => {
    return class Wrap extends Component {
      componentDidMount() {
        trackPageView(pageName)
      }
 
      render() {
        return (
          <WrappedComponent {...this.props} />
        );
      }
    }
  };
}
@PV('用户页面')
class UserPage extends  React.Component {
  ...
}
@PV('购物车页面')
class CartPage extends  React.Component {
  ...
}
@PV('订单页面')
class OrderPage extends  React.Component {
  ..
}
12345678910111213141516171819202122232425262728293031
```

就连埋点这样的烦琐操作都变得优雅了起来。那我想同时使用 checkLogin 与 PV 怎么办呢？这里涉及到了一个新的概念，就是链式调用。
b. 由于高阶组件返回的是一个新的组件，所以链式调用是默认支持的。基于 checkLogin 与 PV 两个例子，链式使用是这样的：

```js
// 函数调用方式
class RawUserPage extends React.Component {
  ...
}
const UserPage = checkLogin(PV('用户页面')(RawUserPage))
// 装饰器调用方式
@checkLogin
@PV('用户页面')
class UserPage extends  React.Component {
  ...
}
1234567891011
```

在链式调用后，装饰器会按照从外向内、从上往下的顺序进行执行。
除了抽取公用逻辑以外，还有一种修改渲染结果的方式，被称为渲染劫持。
c. 渲染劫持
渲染劫持可以通过控制 render 函数修改输出内容，常见的场景是显示加载元素，如下情况所示：

```js
function withLoading(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            if(this.props.isLoading) {
                return <Loading />;
            } else {
                return super.render();
            }
        }
    };
}
1234567891011
```

通过高阶函数中继承原组件的方式，劫持修改 render 函数，篡改返回修改，达到显示 Loading 的效果。
但高阶组件并非万能，它同样也有缺陷。
d. 缺陷

- 丢失静态函数
  由于被包裹了一层，所以静态函数在外层是无法获取的。如下面的案例中 getUser 是无法被调用的。

```js
// UserPage.jsx
@PV('用户页面')
export default class UserPage extends  React.Component {
  static getUser() {
      ...
  } 
}
// page.js
import UserPage from './UserPage'
UserPage.checkLogin() // 调用失败，并不存在。
12345678910
```

如果希望外界能够被调用，那么可以在 PV 函数中将静态函数复制出来。

```js
const PV = (pageName) => {
  return (WrappedComponent) => {
    class Wrap extends Component {
      componentDidMount() {
        trackPageView(pageName)
      }
 
      render() {
        return (
          <WrappedComponent {...this.props} />
        );
      }
    }
     Wrap.getUser = WrappedComponent.getUser;
     return Wrap;
  };
 } 
1234567891011121314151617
```

这样做确实能解决静态函数在外部无法调用的问题，但一个类的静态函数可能会有很多，都需要一一手动复制么？其实也有更为简便的处理方案。社区中早就有了现成的工具，通过 hoist-non-react-statics 来处理，可以自动复制所有静态函数。如下代码所示。

```js
import hoistNonReactStatics from 'hoist-non-react-statics';
const PV = (pageName) => {
  return (WrappedComponent) => {
    class Wrap extends Component {
      componentDidMount() {
        trackPageView(pageName)
      }
 
      render() {
        return (
          <WrappedComponent {...this.props} />
        );
      }
    }
     hoistNonReactStatics(Wrap, WrappedComponent);
     return Wrap;
  };
 }
123456789101112131415161718
```

- refs 属性不能透传
  ref 属性由于被高阶组件包裹了一次，所以需要进行特殊处理才能获取。React 为我们提供了一个名为 React.forwardRef 的 API 来解决这一问题，以下是官方文档中的一个案例：

```js
function withLog(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }
    render() {
      const {forwardedRef, ...rest} = this.props;
      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }
  // 注意 React.forwardRef 回调的第二个参数 “ref”。
  // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
  // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
12345678910111213141516171819
```

这段代码读起来会有点儿头皮发麻，它正确的阅读顺序应该是从最底下的`React.forwardRef`部分开始，通过`forwardedRef`转发`ref`到`LogProps`内部。

## 工程实践

通过以上的梳理，接下来看一下如何在目录中给组件安排位置。

```js
src
├── components
│├── basic
│├── container
│└── hoc
└── pages
123456
```

- 首先将最基本的展示组件放入 basic 目录中；
- 然后将容器组件放入 container；
- 高阶组件放入 hoc 中;
- 将页面外层组件放在页面目录中；
- 通过目录级别完成切分。
  在开发中，针对 basic 组件，建议使用类似 Storybook 的工具进行组件管理。因为Storybook 可以有组织地、高效地构建基础组件，

# :question:如何在渲染劫持中为原本的渲染结果添加新的样式

首先回滚上面的案例，在调用 super.render 的时候就可以拿到原本的渲染结果

```js
function withLoading(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            if(this.props.isLoading) {
                return <Loading />;
            } else {
                return super.render();
            }
        }
    };
}
1234567891011
```

# :question:`setState`是同步更新还是异步更新

## 异步场景

当调用 setState 函数时，就会把当前的操作放入队列中。React 根据队列内容，合并 state 数据，完成后再逐一执行回调，根据结果更新虚拟 DOM，触发渲染。

```js
class Test extends Component {
    state = {
        count: 0
    }

    componentDidMount(){
        this.setState({
           count: 1
         }, () => {
            console.log(this.state.count) //1
         })
        console.log(this.state.count) // 0
    }

    render(){
        ...
    }
}
123456789101112131415161718
class Test extends Component {
    state = {
        count: 0
    }

    componentDidMount(){
        this.setState({
           count: this.state.count + 1
         }, () => {
            console.log(this.state.count)
         })
         this.setState({
           count: this.state.count + 1
         }, () => {
            console.log(this.state.count)
         })
    }

    render(){
        ...
    }
}
12345678910111213141516171819202122
```

如果你觉得答案是 1,2，那肯定就错了。这种迷惑性极强的考题在面试中非常常见，因为它反直觉。

如果重新仔细思考，你会发现当前拿到的 this.state.count 的值并没有变化，都是 0，所以输出结果应该是 1,1。

当然，也可以在 setState 函数中获取修改后的 state 值进行修改。

```js
class Test extends Component {
    state = {
        count: 0
    }

    componentDidMount(){
        this.setState(
          preState=> ({
            count:preState.count + 1
        }),()=>{
           console.log(this.state.count)
        })
        this.setState(
          preState=>({
            count:preState.count + 1
        }),()=>{
           console.log(this.state.count)
        })
    }

    render(){
        ...
    }
}
123456789101112131415161718192021222324
```

这些通通是异步的回调，如果你以为输出结果是 1,2，那就又错了，实际上是 2,2。

由于我们接受 setState 是异步的，所以会认为回调函数是异步回调，打出 0 的 console.log 会先执行，打出 1 的会后执行。

### 为什么 setState 是异步的

- 保持内部一致性，如果改为同步更新的方式，尽管 setState 变成了同步，但是 props 不是
- 为后续的架构升级启用并发更新，为了完成异步渲染，React 会在 setState 时，根据它们的数据来源分配不同的优先级，这些数据来源有：事件回调句柄、动画效果等，再根据优先级并发处理，提升渲染性能

## 同步场景

异步场景中的案例使我们建立了这样一个认知：setState 是异步的，但下面这个案例又会颠覆你的认知。如果我们将 setState 放在 setTimeout 事件中，那情况就完全不同了。

```js
class Test extends Component {
    state = {
        count: 0
    }

    componentDidMount(){
        this.setState({ count: this.state.count + 1 });
        console.log(this.state.count);
        setTimeout(() => {
          this.setState({ count: this.state.count + 1 });
          console.log("setTimeout: " + this.state.count);
        }, 0);
    }

    render(){
        ...
    }
}
123456789101112131415161718
```

正确的结果是 0,2。因为 setState 并不是真正的异步函数，它实际上是通过队列延迟执行操作实现的，通过 isBatchingUpdates 来判断 setState 是先存进 state 队列还是直接更新。值为 true 则执行异步操作，false 则直接同步更新。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2c9565b0dacc42619071e9f61a75ce62.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)
在 onClick、onFocus 等事件中，由于合成事件封装了一层，所以可以将 isBatchingUpdates 的状态更新为 true；在 React 的生命周期函数中，同样可以将 isBatchingUpdates 的状态更新为 true。那么在 React 自己的生命周期事件和合成事件中，可以拿到 isBatchingUpdates 的控制权，将状态放进队列，控制执行节奏。而在外部的原生事件中，并没有外层的封装与拦截，无法更新 isBatchingUpdates 的状态为 true。这就造成 isBatchingUpdates 的状态只会为 false，且立即执行。所以在 addEventListener 、setTimeout、setInterval 这些原生事件中都会同步更新。

## 回答：

> 1. setState 并非真异步，只是看上去像异步。在源码中，通过 isBatchingUpdates 来判断
> 2. setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。
> 3. 那么什么情况下 isBatchingUpdates 会为 true 呢？在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。
> 4. 但在 React 无法控制的地方，比如原生事件，具体就是在 addEventListener 、setTimeout、setInterval 等事件中，就只能同步更新。
> 5. 一般认为，做异步设计是为了性能优化、减少渲染次数，React 团队还补充了两点:

```
1. 保持内部一致性。如果将 state 改为同步更新，那尽管 state 的更新是同步的，但是 props不是。  
2. 启用并发更新，完成异步渲染。  
12
```

![[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-759UPTCi-1629098697312)(https://s0.lgstatic.com/i/image2/M01/01/3E/CgpVE1_YU2KAStLdAAFVKxh7Dyg317.png#pic_center)]](https://img-blog.csdnimg.cn/cf4fde21c5e54b2985ee3b75291bc7f5.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

## 进阶：

这是一道经常会出现的 React setState 笔试题：下面的代码输出什么呢？

```js
class Test extends React.Component {
  state  = {
      count: 0
  };

    componentDidMount() {
    this.setState({count: this.state.count + 1});
    console.log(this.state.count);

    this.setState({count: this.state.count + 1});
    console.log(this.state.count);

    setTimeout(() => {
      this.setState({count: this.state.count + 1});
      console.log(this.state.count);

      this.setState({count: this.state.count + 1});
      console.log(this.state.count);
    }, 0);
  }
 
  render() {
    return null;
  }
};
12345678910111213141516171819202122232425
```

我们可以进行如下的分析：

- 首先第一次和第二次的 console.log，都在 React 的生命周期事件中，所以是异步的处理方式，则输出都为 0；
- 而在 setTimeout 中的 console.log 处于原生事件中，所以会同步的处理再输出结果，但需要注意，虽然 count 在前面经过了两次的 this.state.count + 1，但是每次获取的 this.state.count 都是初始化时的值，也就是 0；
- 所以此时 count 是 1，那么后续在 setTimeout 中的输出则是 2 和 3。
  所以完整答案是 0,0,2,3。

## 探索：

1. “如果改为同步更新的方式，尽管 setState 变成了同步，但是 props 不是”。为什么props不是同步？
     这句话原文对应的是<RFClarification: why is `setState` asynchronous?>(https://github.com/facebook/react/issues/11527) 中的 “even if state is updated synchronously, props are not. (You can’t know props until you re-render the parent component, and if you do this synchronously, batching goes out of the window.)”
     以展示组件为例，展示组件的 props 通常是由父级组件的 state 驱动的，那 state 更新改为同步了，但你无法控制父级什么时候会去变更子组件的 props， 父级在各种场景都有可能会去发起更新。为了提升性能，更新操作仍然需要做成批处理的形式，但这就很有可能会是的处理超过窗口期。《RFClarification: why is `setState` asynchronous?》原文整篇论述非常有意义，翻译可能存在失真，所以还是建议直接看原文理解。 2.因为在 setTimeout 中的 setState，isbatchingupdates 的标识符并不会被设为 true， 不会将变更放入队列，等待合并更新，所以每次 setState 都会被立即执行，拿到结果。

https://codesandbox.io/embed/setstate-uxlec?fontsize=14&hidenavigation=1&theme=dark

# 如何面向组件跨层级通信？

由于 React 是一个组件化框架，那么基于组件树的位置分布，组件与组件之间的关系，大致可分为 4 种。

- 父与子：父组件包裹子组件，父组件向子组件传递数据。
- 子与父：子组件存在于父组件之中，子组件需要向父组件传递数据。
- 兄弟：两个组件并列存在于父组件中，需要金属数据进行相互传递。
- 无直接关系：两个组件并没有直接的关联关系，处在一棵树中相距甚远的位置，但需要共享、传递数据。

## 父与子

父与子的通信是最常见的场景，React 开发的每个组件都在使用这样的设计模式。每个组件都会在父级被使用，再传入 Props，完成信息的传递。这样的交互方式尽管不起眼，容易让人忽略，但正是最经典的设计。

### props

那就让我们看看 Props，这个最常用、也最容易忽略的通信方式。就像下面这样的场景：

- 在初始化时展示默认文案；
- 初始化以后通过网络请求拉取文案数据；
- 通过 Props 传递 state 的文案数据，来更新按钮中的文案。

```js
const Button = ({ text }) => {
    <button type="button">{text}</button>
}
class HomePage extends React.Component {
   state = {
      text: "默认文案"
   }

   asyc componentDidMount() {
     const response = await fetch('/api/buttonText')
     this.setState({
       text: response.buttoText
     })
   }

    render() {
        const {
          text
        } = this.state
        return (
            <Button text={text} />
        )
    }
} 
123456789101112131415161718192021222324
```

## 子与父

子与父的通信主要依赖回调函数。

### 回调函数

回调函数在 JavaScript 中称为 callback。React 在设计中沿用了 JavaScript 的经典设计，允许函数作为参数赋值给子组件。最基础的用法就像下面的例子一样，通过包装传递 text 的值

```js
class Input  extends React.Component {
   handleChanged = (e) => {
     this.onChangeText(e.target.text)
   }
 
   render() {
     return <input onChange={handleTextChanged} />
   }

}
class HomePage extends React.Component {
   handleTextChanged = (text) => {
     console.log(text)
   }

    render() {
        return (
            <Input onChangeText={this.handleTextChanged} />
        )
    }
} 
123456789101112131415161718192021
```

回调函数不仅仅用于传递值，它还可以用在渲染中，父组件根据返回的结果，决定子组件该渲染什么。比如在 React Router 中，我们常常会这样使用它：

```js
<Route path="/hello" render={() => <h1>Hello Everyone</h1>} />
1
```

这里的回调函数没用具体的参数，所以我们可以看接下来的案例：

```js
class FetchPosts extends React.Component {
  state = {
      loading: true,
      data: []
  }

  async componentDidMount() {
    const response = await fetch('/api/posts')
    this.setState({
      data: response.data,
      loading: false,
    })
  }
  render() {
    if (this.state.loading) {
      return <Loading />
    }
    return this.props.renderPosts(this.state.data)
  }
}
class HomePage extends React.Component {
  render() {
    return (
    <FetchPosts
      renderPosts={posts => (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </li>
          ))}
        </ul>
      )}
    />)
  }
}
12345678910111213141516171819202122232425262728293031323334353637
```

采用这样的策略可以使子组件专注业务逻辑，而父组件专注渲染结果。

### 实例函数

需要注意的是，实例函数是一种不被推荐的使用方式。这种通信方式常见于 React 流行初期，那时有很多组件都通过封装 jQuery 插件生成。最常见的一种情况是在 Modal 中使用这种方式。如下代码所示：

```js
import React from 'react'
class HomePage extends React.Component {
   modalRef = React.createRef()
   showModal = () ={
     this.modalRef.show()
   }

   hideModal = () => {
     this.modalRef.hide()
   }

    render() {
        const {
          text
        } = this.state
        return (
            <>
              <Button onClick={this.showModal}>展示 Modal </Button>
              <Button onClick={this.hideModal}>隐藏 Modal </Button>
              <Modal ref={modalRef} />
            </>
          />
        )
    }
}
12345678910111213141516171819202122232425
```

但这种方式并不符合 React 的设计理念，如果你使用过 Antd 的 Modal 组件，你可能会有印象，Antd 将 Modal 显隐的控制放在 visible 参数上，直接通过参数控制。如果你有幸在工作中看到类似的代码，那么这个项目一定有些年头了。

## 兄弟

兄弟组件之间的通信，往往依赖共同的父组件进行中转。可以一起看看下面的案例：

```js
class Input extends React.Component {
   handleChanged = (e) => {
     this.onChangeText(e.target.text)
   }
 
   render() {
     return <input onChange={handleTextChanged} />
   }

}
const StaticText = ({ children }) => {
  return (
    <P>{children}</p>
  )
}
class HomePage extends React.Component {

   state = {
     text: '默认文案'
   }
   handleTextChanged = (text) => {
     this.setState({
       text,
     })
   }

    render() {
        return (
            <>
              <Input onChangeText={this.handleTextChanged} />
              <StaticText>this.state.text</StaticText> 
            </>
        )
    }
}
1234567891011121314151617181920212223242526272829303132333435
```

在案例中，StaticText 组件需要显示的内容来自输入框输入的值，那么通过父组件的 state 进行收集、中转、赋值给 StaticText，就完成了以上的通信。
这种模式主要负责在容器组件中协调各组件。

## 无直接关系

无直接关系就是两个组件的直接关联性并不大，它们身处于多层级的嵌套关系中，既不是父子关系，也不相邻，并且相对遥远，但仍然需要共享数据，完成通信。那具体怎样做呢？我们先从 React 提供的通信方案 Context 说起。

### Context

Context 第一个最常见的用途就是做 i18n，也就是常说的国际化语言包。我们一起来看下这个案例：

```js
import  { createContext } from 'react';
const I18nContext = createContext({
  translate: () => '',
  getLocale: () => {},
  setLocale: () => {},
});
export default I18nContext;
1234567
```

首先使用 React.createContext 创建 Context 的初始状态。这里包含三个函数。

- translate，用于翻译指定的键值。
- getLocale，获取当前的语言包。
- setLocale，设置当前的语言包。
  为了代码简洁性，这里包裹了 I18nProvider，提供了一个组件。如下代码所示：

```js
import React, { useState } from 'react';
import I18nContext from './I18nContext';
class I18nProvider extends React.Component {
  state = {
      locale: '',
  }

  render() {
     const i18n =  {
        translate: key => this.props.languages[locale][key],
        getLocale: () => this.state.locale,
        setLocale: locale => this.setState({
          loacal,
        })
     }
     return (
      <I18nContext.Provider value={i18n}>
        {this.props.children}
      </I18nContext.Provider>
    )
  }
}
export default I18nProvider;
1234567891011121314151617181920212223
```

如果需要共享 Context 的数据，就需要针对每一个组件包装一次消费者，会带来很多无意义的重复代码。如以下代码就是通过高阶函数封装消费者的逻辑来减少重复代码的。

```JS
import React from 'react';
import I18nContext from './I18nContext';
const withI18n = wrappedComponent => {
    return (props) => (
      <I18nContext.Consumer>
        {i18n => <WrappedComponent {...i18n} {...props} />}
      </I18nContext.Consumer>
    )
};
export default withI18n;
12345678910
```

准备工作就绪以后，就需要在最顶层注入 Provider。就像下面第 12 行代码所写的那样。

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { I18nProvider } from './i18n';
const locales = [ 'en-US', 'zh-CN' ];
const languages = {
  'en-US': require('./locales/en-US'),
  'zh-CN': require('./locales/zh-CN'),
}
ReactDOM.render(
  <I18nProvider locales={locales} languages={languages}>
    <App />
  </I18nProvider>,
  document.getElementById('root')
);
123456789101112131415
```

接下来就是使用 Context 实现国际化的效果。Title 组件中显示 title 标题的内容，而在 Footer 组件通过 setLocale 函数修改当前显示的语言。

```js
const Title = withI18n(
  ({ translate }) => { 
    return ( <div>{translate('title')}</div> )
  }
)
const Footer = withI18n(
  ({ setLocale }) => { 
    return ( <Button onClick=(() => {
      setLocale('zh-CN')
    }) /> )
  }
)
123456789101112
```

这是一个标准的实现方案，接下来看一个不太推荐的方案。

### 全局变量与事件

全局变量，顾名思义就是放在 Window 上的变量。但值得注意的是修改 Window 上的变量并不会引起 React 组件重新渲染。
所以在使用场景上，全局变量更推荐用于暂存临时数据。比如在 CallPage 页面点击了按钮之后，需要收集一个 callId，然后在 ReportPage 上报这个 callId。如下代码所示：

```js
class CallPage extends React.Component { 
    render() {
        return <Button onClick={() => {
              window.callId = this.props.callId
        }} />
}
class ReportPage extends React.Component {

    render() {
        return <Button onClick={() => {
              fetch('/api/report', { id: window.callId })
        }} />
    }
}
1234567891011121314
```

如果在这里使用 Context，会显得有点重，但是只依靠 Window 做值的暂存就会简单很多。那为什么不太推荐这个方案呢？因为它跳出了设计模式，用偷懒换取了快捷，在后续的维护中，如果业务需求发生变更，比如需要在某处显示 callId，在 callId 变化后，就要重新渲染新的 callId。那么 Window 的劣势就暴露无遗了。所以这是一个让人可以暂时忘记架构设计，尽情偷懒的方案，但请不要忘记，技术债迟早是要还的。就像兰尼斯特家的家训——有债必偿。
除了全局变量以外，还有一种方案是全局事件。如下代码所示：

```js
class CallPage extends React.Component {
    dispatchEvent = () => {
        document.dispatchEvent(new CustomEvent('callEvent', {
          detail: {
             callId: this.props.callId
          }
        }))
    }
    render() {
        return <Button onClick={this.dispatchEvent} />
}
class ReportPage extends React.Component {
    state = {
      callId: null,
    }

    changeCallId = (e) => {
      this.setState({
        callId: e.detail.callId
      })
    } 

    componentDidMount() {
        document.addEventListener('callEvent', this.changeCallId)
    }
    componentWillUnmount() {
        document.removeEventListener('callEvent', this.changeCallId)
    }

    render() {
        return <Button onClick={() => {
              fetch('/api/report', { id: this.state.callId })
        }} />
    }
}
1234567891011121314151617181920212223242526272829303132333435
```

粗看代码，事件的方式让我们可以修改 state 的值，所以可以重新渲染组件。但不要忘记，事件的绑定往往会在组件加载时放入，如果 CallPage 与 ReportPage 不是同时存在于页面上，那么这个方案又不适用了。

### 状态管理框架

状态管理框架提供了非常丰富的解决方案，常见的有 Flux、Redux 及 Mobx，甚至在一定程度上约束了项目的代码结构。因为这些内容庞杂，所以将会在下一讲中详细介绍。引入第三方的状态管理框架主要困难点在于学习成本相对较高，且整个工程的开发思路也将随着框架的引入而改变。

## 答题

![在这里插入图片描述](https://img-blog.csdnimg.cn/74d4b223e9714f46bdc9210f51bdbaf3.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

> 在跨层级通信中，主要分为一层或多层的情况。

> 如果只有一层，那么按照 React 的树形结构进行分类的话，主要有以下三种情况：父组件向子组件通信，子组件向父组件通信以及平级的兄弟组件间互相通信。

> 在父与子的情况下，因为 React 的设计实际上就是传递 Props 即可。那么场景体现在容器组件与展示组件之间，通过 Props 传递 state，让展示组件受控。
> 在子与父的情况下，有两种方式，分别是回调函数与实例函数。回调函数，比如输入框向父级组件返回输入内容，按钮向父级组件传递点击事件等。实例函数的情况有些特别，主要是在父组件中通过 React 的 ref API 获取子组件的实例，然后是通过实例调用子组件的实例函数。这种方式在过去常见于 Modal 框的显示与隐藏。这样的代码风格有着明显的 jQuery 时代特征，在现在的 React 社区中已经很少见了，因为流行的做法是希望组件的所有能力都可以通过 Props 控制。

> 多层级间的数据通信，有两种情况。第一种是一个容器中包含了多层子组件，需要最底部的子组件与顶部组件进行通信。在这种情况下，如果不断透传 Props 或回调函数，不仅代码层级太深，后续也很不好维护。第二种是两个组件不相关，在整个 React 的组件树的两侧，完全不相交。那么基于多层级间的通信一般有三个方案。

> 第一个是使用 React 的 Context API，最常见的用途是做语言包国际化。

> 第二个是使用全局变量与事件。全局变量通过在 Windows 上挂载新对象的方式实现，这种方式一般用于临时存储值，这种值用于计算或者上报，缺点是渲染显示时容易引发错误。全局事件就是使用 document 的自定义事件，因为绑定事件的操作一般会放在组件的 componentDidMount 中，所以一般要求两个组件都已经在页面中加载显示，这就导致了一定的时序依赖。如果加载时机存在差异，那么很有可能导致两者都没能对应响应事件。

> 第三个是使用状态管理框架，比如 Flux、Redux 及 Mobx。优点是由于引入了状态管理，使得项目的开发模式与代码结构得以约束，缺点是学习成本相对较高。

# 列举一种你了解的 React 状态管理框架

## Flux

  Flux 给我的印象就是平地一声雷，有种“天不生 Flux，状态管理如长夜”的感觉。回顾历史，你会发现 Flux 如同 React 一样对业界影响巨大。如果你对 Flutter 与 SwiftUI 有了解的话，就能理解 React 对后起之秀的那种深远影响。Flux 同样如此，它提出了一种 MVC 以外的成功实践——单向数据流，这同样深远地影响了“后来人”。
  2014 的 Facebook F8 大会上提出了一个观点，MVC 更适用于小型应用，但在面向大型前端项目时，MVC 会使项目足够复杂，即每当添加新的功能，系统复杂度就会疯狂增长。如下图所示，Model 与 View 的关联是错综复杂的，很难理解和调试，尤其是 Model 与 View 之间还存在双向数据流动。

![在这里插入图片描述](https://img-blog.csdnimg.cn/a3d5a11ebb114fbf816bfbe1531c6f73.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)
这对于接手老代码的人来说是个令人头疼的难题，因为他们害怕承担风险，所以不敢轻易修改代码。这也正是 MVC 模式被 Facebook 抛弃的原因。

所以他们提出了一种基于单向数据流的架构。如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/563f5224eec24055aadbac4698c6ce59.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

- View是视图层，即代码中的 React 组件。
- Store是数据层，维护了数据和数据处理的逻辑。
- Dispatcher是管理数据流动的中央枢纽。每一个 Store 提供一个回调。当 Dispatcher 接收一个 Action 时，所有的 Store 接收注册表中的 Action，然后通过回调产生数据。
- Action可以理解为一种事件通知，通常用 type 标记。
    具体的流程是这样的，Store 存储了视图层所有的数据，当 Store 变化后会引起 View 层的更新。如果在视图层触发 Action，比如点击一个按钮，当前的页面数据值会发生变化。Action 会被 Dispatcher 进行统一的收发处理，传递给 Store 层。由于 Store 层已经注册过相关 Action 的处理逻辑，处理对应的内部状态变化后，会触发 View 层更新。
    从应用场景来看，Flux 除了在 Facebook 内部大规模应用以外，业界很少使用。因为它的概念及样板代码相比后起之秀，还是有点多。从如今的视角看，Flux 可称为抛砖引玉的典范，开启了一轮状态管理的军备竞赛。

## Redux

这场军备竞赛的佼佼者非 Redux 莫属。当提到 Redux，不得不提 Elm 这样一种传奇的语言。Elm虽然是一种语言，但实际上主要用于网页开发，它设计了一种 Model、View、Message、Update 的更新思路。
![在这里插入图片描述](https://img-blog.csdnimg.cn/38269dc729ea4ecc92ab76b1502db0e3.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

Elm 有着这样独特的设计：

- 全局单一数据源，不像 Flux 一样有多个 Store；
- 纯函数，可以保证输入输出的恒定；
- 静态类型，可以确保运行安全

在 Redux 的文档中，毫不避讳地提到，自己借鉴了这个设计。
在 Flux 与 Elm 的基础上，Redux 确立了自己的“三原则”。

- 单一数据源，即整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 Store 中。
- 纯函数 Reducer，即为了描述 Action 如何改变状态树 ，编写的一个纯函数的 Reducer。
- state 是只读的，唯一可以改变 state 的方法就是触发 Action，Action 是一个用于描述已发生事件的普通对象。

这三大原则使 Redux 的调试工具实现了时间回溯功能，通过录制回放 Action，完整重现了整个应用路径，这在当时引发了不小的轰动。下图中的 Redux DevTools 是开发中常用的 Redux 调试工具，界面中展示的内容就是时间回溯功能，可以查看每个操作对全局 Store 产生的变化。

在 Redux 社区中有一个经久不衰的话题，就是如何解决副作用（Side Effect）。在 16 年到 18 年之间，即使是在知乎，这也是前端最火的话题。每隔一段时间社区就会冒出一个新的方案，宣称对副作用有了最佳实践。

Redux 团队是这样论述“副作用”的：任何具备业务价值的 Web 应用必然要执行复杂的逻辑，比如 AJAX 请求等异步工作，这类逻辑使函数在每次的执行过程中，产生不同的变化，这样与外界的交互，被称为“副作用”。一个常见的副作用的例子是这样的，你发一个网络请求，需要界面先显示 Loading，再根据请求是否成功，来决定显示数据还是显示报错信息，你会发现在整个过程中，异步操作在 Redux 中无从添加，因为 Redux 本身深受函数式编程的影响，导致：

- 所有的事件都收拢 Action 去触发；
- 所有的 UI 状态都交给 Store 去管理；
- 所有的业务逻辑都交由 Reducer 去处理。

在这里 Action、Reducer 是纯函数，Store 也只是一个 state 状态树，都不能完成处理副作用的操作。

真正可以解决副作用的方案主要分为两类：

- 在 Dispatch 的时候有一个middleware 中间件层，拦截分发的Action并添加额外的复杂行为，还可以添加副作用；
- 允许 Reducer 层直接处理副作用。

你可以看出，这两类方案并没有把副作用从代码中消除，而是通过不同的方式转嫁到不同的层级中。对于每一类我们都看一下主流的解决方案。
第一类中，流行的方案是 Redux-thunk，其作用是处理异步 Action，它的源码在面试中经常被要求独立编写。

```js
function createThunkMiddleware(extraArgument) {
	  return ({ dispatch, getState }) => (next) => (Action) => {
	    if (typeof Action === 'function') {
	      return Action(dispatch, getState, extraArgument);
	    }
	
	    return next(Action);
	  };
	}
	
	const thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;
	
	export default thunk;
1234567891011121314
```

如上代码所示，Redux-thunk 通过添加中间件来判断 Action 是否为函数：

- 如果是函数，则 Dispatch，将当前的整个 state 以及额外参数传入其中；
- 否则就继续流转 Action。

这是一个最早最经典的处理 Redux 副作用的方案，你还可以自己去自定义 Store 的 middleware。那如果 Action 是一个数组，或者是一个 promise ，该怎么处理呢？这都可以实现。因为社区中 Action 可以是数组，可以是 promise，还可以是迭代器，或者 rxjs，比如 Redux-Saga、Redux-Promise、Redux-Observable 等。
第二类方案相对冷门很多，但从设计上而言，思考得却更加深刻。比如 Redux Loop 就深入地借鉴了 Elm。在 Elm 中副作用的处理在 update 层，这样的设计叫分形架构。如下代码所示：

```js
import { loop, Cmd } from 'redux-loop';
function initAction(){
    return {
      type: 'INIT'
    };
}
function fetchUser(userId){
    return fetch(`/api/users/${userId}`);
}
function userFetchSuccessfulAction(user){
   return {
      type: 'USER_FETCH_SUCCESSFUL',
      user
   };
}
function userFetchFailedAction(err){
   return {
      type: 'USER_FETCH_FAILED',
      err
   };
}
const initialState = {
  initStarted: false,
  user: null,
  error: null
};
function Reducer(state = initialState, Action) {
  switch(Action.type) {
  case 'INIT':
    return loop(
      {...state, initStarted: true},
      Cmd.run(fetchUser, {
        successActionCreator: userFetchSuccessfulAction,
        failActionCreator: userFetchFailedAction,
        args: ['123']
      })
    );
  case 'USER_FETCH_SUCCESSFUL':
    return {...state, user: Action.user};
  case 'USER_FETCH_FAILED':
    return {...state, error: Action.error};
  default:
    return state;
  }
}  
123456789101112131415161718192021222324252627282930313233343536373839404142434445
```

那什么是分形架构呢？这就需要提到分形架构：

> 如果子组件能够以同样的结构，作为一个应用使用，这样的结构就是分形架构。

分形架构的好处显而易见，复用容易、组合方便。Redux Loop 就做出了这样的尝试，但在实际的项目中应用非常少，因为你很难遇到一个真正需要应用分形的场景。在真实的开发中，并没有那么多的复用，也没有那么多完美场景实践理论。

虽然 Redux Loop 在分形架构上做出了探索，但 Redux 作者并不是那么满意，他甚至写了一篇长文感慨，没有一种简单的方案可以组合 Redux 应用，并提了一个长久以来悬而未决的 issue。

最后就是关于 Redux 的一揽子解决方案。

- 在国外社区流行的方案是rematch，它提供了一个标准的范式写 Redux。根据具体的案例，你会发现 rematch 的模块更为内聚，插件更为丰富。
- 国内流行的解决方案是[dva](https://github.com/dvajs/dva)

## Mobx

从 Redux 深渊逃离出来，现在可以松口气了，进入 Mobx。如果你喜欢 Vue，那么一定会爱上 Mobx；但是如果喜欢 Redux，那你一定会恨它。不如先抛下这些，看看官方示例：

```js
import {observable, autorun} from 'mobx';
var todoStore = observable({
    /* 一些观察的状态 */
    todos: [],
    /* 推导值 */
    get completedCount() {
        return this.todos.filter(todo => todo.completed).length;
    }
});
/* 观察状态改变的函数 */
autorun(function() {
    console.log("Completed %d of %d items",
        todoStore.completedCount,
        todoStore.todos.length
    );
});
/* ..以及一些改变状态的动作 */
todoStore.todos[0] = {
    title: "Take a walk",
    completed: false
};
// -> 同步打印 'Completed 0 of 1 items'
todoStore.todos[0].completed = true;
// -> 同步打印 'Completed 1 of 1 items'
123456789101112131415161718192021222324
```

Mobx 是通过监听数据的属性变化，直接在数据上更改来触发 UI 的渲染。是不是一听就非常“Vue”。那 Mobx 的监听方式是什么呢？

- 在 Mobx 5 之前，实现监听的方式是采用 Object.defineProperty；
- 在 Mobx 5 以后采用了 Proxy 方案。

## 回答

![在这里插入图片描述](https://img-blog.csdnimg.cn/f282b492ac504ccbb53b1b1c03e98f67.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70#pic_center)

> Flux 是一种使用单向数据流的形式来组合 React 组件的应用架构。

> Flux 包含了 4 个部分，分别是 Dispatcher、 Store、View、Action。Store 存储了视图层所有的数据，当 Store 变化后会引起 View 层的更新。如果在视图层触发一个 Action，就会使当前的页面数据值发生变化。Action 会被 Dispatcher 进行统一的收发处理，传递给 Store 层，Store 层已经注册过相关 Action 的处理逻辑，处理对应的内部状态变化后，触发 View 层更新。

> Flux 的优点是单向数据流，解决了 MVC 中数据流向不清的问题，使开发者可以快速了解应用行为。从项目结构上简化了视图层设计，明确了分工，数据与业务逻辑也统一存放管理，使在大型架构的项目中更容易管理、维护代码。

> Redux 本身是一个 JavaScript 状态容器，提供可预测化状态的管理。社区通常认为 Redux 是 Flux 的一个简化设计版本，但它吸收了 Elm 的架构思想，更像一个混合产物。它提供的状态管理，简化了一些高级特性的实现成本，比如撤销、重做、实时编辑、时间旅行、服务端同构等。

> Redux 的核心设计包含了三大原则：单一数据源、纯函数 Reducer、State 是只读的。

> Redux中整个数据流的方案与 Flux 大同小异。

> Redux 中的另一大核心点是处理“副作用”，AJAX 请求等异步工作，或不是纯函数产生的第三方的交互都被认为是 “副作用”。这就造成在纯函数设计的 Redux 中，处理副作用变成了一件至关重要的事情。社区通常有两种解决方案

> 第一类是在 Dispatch 的时候会有一个 middleware 中间件层，拦截分发的 Action 并添加额外的复杂行为，还可以添加副作用。第一类方案的流行框架有 Redux-thunk、Redux-Promise、Redux-Observable、Redux-Saga 等

> 第二类是允许 Reducer 层中直接处理副作用，采取该方案的有 React Loop，React Loop 在实现中采用了 Elm 中分形的思想，使代码具备更强的组合能力

> 除此以外，社区还提供了更为工程化的方案，比如 rematch 或 dva，提供了更详细的模块架构能力，提供了拓展插件以支持更多功能

> Redux 的优点很多：结果可预测；代码结构严格易维护；模块分离清晰且小函数结构容易编写单元测试；Action 触发的方式，可以在调试器中使用时间回溯，定位问题更简单快捷；单一数据源使服务端同构变得更为容易；社区方案多，生态也更为繁荣

> Mobx 通过监听数据的属性变化，可以直接在数据上更改触发UI 的渲染。在使用上更接近 Vue，比起 Flux 与 Redux 的手动挡的体验，更像开自动挡的汽车。Mobx 的响应式实现原理与 Vue 相同，以 Mobx 5 为分界点，5 以前采用 Object.defineProperty 的方案，5 及以后使用 Proxy 的方案。它的优点是样板代码少、简单粗暴、用户学习快、响应式自动更新数据让开发者的心智负担更低

## 个人观点

> Flux 的设计更偏向 Facebook 内部的应用场景，Facebook 的方案略显臃肿，拓展能力欠佳，所以在社区中热度不够。而 Redux 因为纯函数的原因，碰上了社区热点，简洁不简单的 API 设计使社区疯狂贡献发展，短短数年方案层出不穷。但从工程角度而言，不是每一个项目都适用单一数据源。因为很多项目的数据是按页面级别切分的，页面之间相对隔绝，并不需要共享数据源，是否需要 Redux 应该视具体情况而定。Mobx 在开发项目时简单快速，但应用 Mobx 的场景 ，其实完全可以用 Vue 取代。如果纯用 Vue，体积还会更小巧。

# Virtual DOM 的工作原理是什么

## 历史

React 的原型是 XHP，该框架于 2010 年开源。Facebook 创建 XHP 的目的主要有两点。

- 简化前端开发，按照现在流行的说法叫后端赋能，让后端开发人员能够快速交付页面。
- 避免跨站点脚本攻击，也就是常说的 XSS， Facebook 拥有庞大的站点，很容易因为一处暴露 XSS 而造成整体风险。XSS 不会直接攻击网页，而是通过嵌入 JavaScript 代码的方式，将恶意攻击附加到用户的请求中来攻击用户。它可以被用作窃取用户信息，或者恶意增删用户的一些资料。而 XHP 的优势就在于可以默认启用 XSS 保护。

## 推理

先整理下之前学过的关于虚拟 DOM 的内容。

- 在 JSX 的使用中，JSX 所描述的结构，会转译成 React.createElement 函数，大致像这样：

```js
// JSX 描述
<input type="button"/>
// Babel 转译后
React.createElement('input', { type: "button" })
1234
```

- React 会持有一棵虚拟 DOM 树，在状态变更后，会触发虚拟 DOM 树的修改，再以此为基础修改真实 DOM。

根据上面的已知条件，可以很快地得出结论：React.createElement 返回的结果应该是一个 JavaScript Object。由于是树结构，所以一定包含一个 children 字段，来建立与子级的关联关系。所以可以推测出它的结构像下面这样：

```js
// 想象中的结构
{
  tag: 'input',
  props: {
    type: 'button'
  },
  children: []
}
12345678
```

基于基本认知，React 有两个函数：

- diff 函数，去计算状态变更前后的虚拟 DOM 树差异；
- 渲染函数，渲染整个虚拟 DOM 树或者处理差异点。

现在是不是有些理解为什么 React 与 ReactDOM 是两个库了？正是由于计算与渲染的分工。在日常的开发中，就像下面的代码案例一样，需要同时引入 React 与 ReactDOM 两个库：

```js
import React from 'react';
import ReactDOM from 'react-dom';
ReactDOM.render(<h1>hi!</h2>, document.getElementById('root'));
123
```

其中 React 主要的工作是组件实现、更新调度等计算工作；而 ReactDOM 提供了在网页上渲染的基础。

也正因为这样的拆分，当 React 向 iOS、Android 开发时，只需要通过 React Native 提供 Native 层的元素渲染即可完成。

## 优势

如果将前面的内容稍加整理，可以得出虚拟 DOM 有这样几个优势：

- 性能优越；
- 规避 XSS；
- 可跨平台。
  ** 虚拟 DOM 一定比真实的 DOM 操作性能更高吗** ？
  其实不是，如果只修改一个按钮的文案，那么虚拟 DOM 的操作无论如何都不可能比真实的 DOM 操作更快。所以一定要回到具体的场景进行探讨

如果大量的直接操作 DOM 则容易引起网页性能的下降，这时 React 基于虚拟 DOM 的 diff 处理与批处理操作，可以降低 DOM 的操作范围与频次，提升页面性能。在这样的场景下虚拟 DOM 就比较快，那什么场景下虚拟 DOM 慢呢？首次渲染或微量操作，虚拟 DOM 的渲染速度就会比真实 DOM 更慢。

那虚拟 DOM 一定可以规避 XSS吗？虚拟 DOM 内部确保了字符转义，所以确实可以做到这点，但 React 存在风险，因为 React 留有 dangerouslySetInnerHTML API 绕过转义。

没有虚拟 DOM 不能实现跨平台吗？比如 NativeScript 没有虚拟 DOM 层 ，它是通过提供兼容原生 API 的 JS API 实现跨平台开发。那虚拟 DOM 的优势在哪里？实际上它的优势在于跨平台的成本更低。在 React Native 之后，前端社区从虚拟 DOM 中体会到了跨平台的无限前景，所以在后续的发展中，都借鉴了虚拟 DOM。比如：社区流行的小程序同构方案，在构建过程中会提供类似虚拟 DOM 的结构描述对象，来支撑多端转换。

## 缺点

社区公认虚拟 DOM 的缺点有两个。

- 内存占用较高。因为当前网页的虚拟 DOM 包含了真实 DOM 的完整信息，而且由于是 Object，其内存占用肯定会有所上升。
- 无法进行极致优化。 虽然虚拟 DOM 足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中，虚拟DOM 无法进行针对性的极致优化，比如实现类似 Google Earth 的场景。

## 回答

![在这里插入图片描述](https://img-blog.csdnimg.cn/fdf6b1aa288d4c60b06d2fd9de7956ba.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

> 虚拟 DOM 的工作原理是通过 JS 对象模拟 DOM 的节点。在 Facebook 构建 React 初期时，考虑到要提升代码抽象能力、避免人为的 DOM 操作、降低代码整体风险等因素，所以引入了虚拟 DOM。

> 虚拟 DOM 在实现上通常是 Plain Object，以 React 为例，在 render 函数中写的 JSX 会在 Babel 插件的作用下，编译为 React.createElement 执行 JSX 中的属性参数。

> **React.createElement 执行后会返回一个 Plain Object，它会描述自己的 tag 类型、props 属性以及 children 情况等。这些 Plain Object 通过树形结构组成一棵虚拟 DOM 树。当状态发生变更时，将变更前后的虚拟 DOM 树进行差异比较，这个过程称为 diff，**生成的结果称为 patch。计算之后，会渲染 Patch 完成对真实 DOM 的操作。

> 虚拟 DOM 的优点主要有三点：**改善大规模 DOM 操作的性能、规避 XSS 风险、能以较低的成本实现跨平台开发。**

> 虚拟 DOM 的缺点在社区中主要有两点.
> 内存占用较高，因为需要模拟整个网页的真实 DOM。
> 高性能应用场景存在难以优化的情况，类似像 Google Earth 一类的高性能前端应用在技术选型上往往不会选择 React。

## 进阶

除了渲染页面，虚拟 DOM 还有哪些应用场景？
这个问题考验面试者的想象力。通常而言，我们只是将虚拟 DOM 与渲染绑定在一起，但实际上虚拟 DOM 的应用更为广阔。比如，只要你记录了真实 DOM 变更，它甚至可以应用于埋点统计与数据记录等。可以往这个方向回答，具体案例可以参考 [rrweb](https://github.com/rrweb-io/rrweb)。

# 与其他框架相比，React 的 diff 算法有何不同？

这个题目虽然有对比，但本质上仍然是一道原理题。原理题需要按照“讲概念，说用途，理思路，优缺点，列一遍”的思路来答题。

## Diff 算法

首先主角当然是“diff 算法”，但讨论 diff 算法一定是建立在虚拟 DOM 的基础上的。使用虚拟 DOM 而非直接操作真实 DOM 是现代前端框架的一个基本认知。

而 diff 算法探讨的就是虚拟 DOM 树发生变化后，生成 DOM 树更新补丁的方式。它通过对比新旧两株虚拟 DOM 树的变更差异，将更新补丁作用于真实 DOM，以最小成本完成视图更新。

具体的流程是这样的：

- 真实 DOM 与虚拟 DOM 之间存在一个映射关系。这个映射关系依靠初始化时的 JSX 建立完成；
- 当虚拟 DOM 发生变化后，就会根据差距计算生成 patch，这个 patch 是一个结构化的数据，内容包含了增加、更新、移除等；
- 最后再根据 patch 去更新真实的 DOM，反馈到用户的界面上。

举一个简单易懂的例子：

```js
import React from 'react'

export default class ExampleComponent extends React.Component {
  render() {
    if(this.props.isVisible) {
       return <div className="visible">visbile</div>;
    }
     return <div className="hidden">hidden</div>;
  }
}
12345678910
```

这里，首先我们假定 ExampleComponent 可见，然后再改变它的状态，让它不可见 。映射为真实的 DOM 操作是这样的，React 会创建一个 div 节点。

```html
<div class="visible">visbile</div>
1
```

当把 visbile 的值变为 false 时，就会替换 class 属性为 hidden，并重写内部的 innerText 为 hidden。这样一个生成补丁、更新差异的过程统称为 diff 算法。

在整个过程中你需要注意 3 点：更新时机、遍历算法、优化策略，这些也是面试官最爱考察的。

### 更新时机

更新时机就是触发更新、进行差异对比的时机。根据前面的章节内容可以知道，更新发生在setState、Hooks 调用等操作以后。此时，树的结点发生变化，开始进行比对。那这里涉及一个问题，即两株树如何对比差异?

这里就需要使用遍历算法。

### 遍历算法

遍历算法是指沿着某条搜索路线，依次对树的每个节点做访问。通常分为两种：深度优先遍历和广度优先遍历。

- 深度优先遍历，是从根节点出发，沿着左子树方向进行纵向遍历，直到找到叶子节点为止。然后回溯到前一个节点，进行右子树节点的遍历，直到遍历完所有可达节点。
- 广度优先遍历，则是从根节点出发，在横向遍历二叉树层段节点的基础上，纵向遍历二叉树的层次。

React 选择了哪一种遍历方式呢？它的 diff 算法采用了深度优先遍历算法。因为广度优先遍历可能会导致组件的生命周期时序错乱，而深度优先遍历算法就可以解决这个问题。

### 优化策略

优化策略是指 React 对 diff 算法做的优化手段。

虽然深度优先遍历保证了组件的生命周期时序不错乱，但传统的 diff 算法也带来了一个严重的性能瓶颈，复杂程度为 O(n^3)(后期备注上角标)，其中 n 表示树的节点总数。正如计算机科学中常见的优化方案一样，React 用了一个非常经典的手法将复杂度降低为 O(n)，也就是分治，即通过“分而治之”这一巧妙的思想分解问题。

具体而言， React 分别从树、组件及元素三个层面进行复杂度的优化，并诞生了与之对应的策略。

#### 策略一：忽略节点跨层级操作场景，提升比对效率。

这一策略需要进行树比对，即对树进行分层比较。树比对的处理手法是非常“暴力”的，即两棵树只对同一层次的节点进行比较，如果发现节点已经不存在了，则该节点及其子节点会被完全删除掉，不会用于进一步的比较，这就提升了比对效率。

#### 策略二：如果组件的 class 一致，则默认为相似的树结构，否则默认为不同的树结构。

在组件比对的过程中：

- 如果组件是同一类型则进行树比对；
- 如果不是则直接放入补丁中。

只要父组件类型不同，就会被重新渲染。这也就是为什么shouldComponentUpdate、PureComponent 及 React.memo 可以提高性能的原因。

#### 策略三：同一层级的子节点，可以通过标记 key 的方式进行列表对比。

元素比对主要发生在同层级中，通过标记节点操作生成补丁。节点操作包含了插入、移动、删除等。其中节点重新排序同时涉及插入、移动、删除三个操作，所以效率消耗最大，此时策略三起到了至关重要的作用。

通过标记 key 的方式，React 可以直接移动 DOM 节点，降低内耗。操作代码如下：

```js
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ui>
123456
```

以上是 React Diff 算法最基本的内容，除此以外，由于 React 16 引入Fiber 设计，所以我们还需要了解 Fiber 给 diff 算法带来的影响。

Fiber 机制下节点与树分别采用 FiberNode 与 FiberTree 进行重构。FiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点，使得整个更新过程可以随时暂停恢复。FiberTree 则是通过 FiberNode 构成的树。

Fiber 机制下，整个更新过程由 current 与 workInProgress 两株树双缓冲完成。当 workInProgress 更新完成后，通过修改 current 相关指针指向的节点，直接抛弃老树，虽然非常简单粗暴，却非常合理。

## Vue

Vue 2.0 因为使用了[ snabbdom](https://github.com/snabbdom/snabbdom/tree/8079ba78685b0f0e0e67891782c3e8fb9d54d5b8)，所以整体思路与 React 相同。但在元素对比时，如果新旧两个元素是同一个元素，且没有设置 key 时，snabbdom 在 diff 子元素中会一次性对比旧节点、新节点及它们的首尾元素四个节点，以及验证列表是否有变化。Vue 3.0 整体变化不大，依然没有引入 Fiber 等设计，也没有时间切片等功能。

## 回答

![在这里插入图片描述](https://img-blog.csdnimg.cn/14c29de07eee49bc83e42946e60787fc.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

# 如何解释 React 的渲染流程？

![在这里插入图片描述](https://img-blog.csdnimg.cn/69151dddd082451d80ba288b5010aeb5.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

> React 的渲染过程大致一致，但协调并不相同，以 React 16 为分界线，分为 Stack Reconciler 和 Fiber Reconciler。这里的协调从狭义上来讲，特指 React 的 diff 算法，广义上来讲，有时候也指 React 的 reconciler 模块，它通常包含了 diff 算法和一些公共逻辑。

> 回到 Stack Reconciler 中，Stack Reconciler 的核心调度方式是递归。调度的基本处理单位是事务，它的事务基类是 Transaction，这里的事务是 React 团队从后端开发中加入的概念。在 React 16 以前，挂载主要通过 ReactMount 模块完成，更新通过 ReactUpdate 模块完成，模块之间相互分离，落脚执行点也是事务。

> 在 React 16 及以后，协调改为了 Fiber Reconciler。它的调度方式主要有两个特点，第一个是协作式多任务模式，在这个模式下，线程会定时放弃自己的运行权利，交还给主线程，通过requestIdleCallback 实现。第二个特点是策略优先级，调度任务通过标记 tag 的方式分优先级执行，比如动画，或者标记为 high 的任务可以优先执行。Fiber Reconciler的基本单位是 Fiber，Fiber 基于过去的 React Element 提供了二次封装，提供了指向父、子、兄弟节点的引用，为 diff 工作的双链表实现提供了基础。

> 在新的架构下，整个生命周期被划分为 Render 和 Commit 两个阶段。Render 阶段的执行特点是可中断、可停止、无副作用，主要是通过构造 workInProgress 树计算出 diff。以 current 树为基础，将每个 Fiber 作为一个基本单位，自下而上逐个节点检查并构造 workInProgress 树。这个过程不再是递归，而是基于循环来完成。

> 在执行上通过 requestIdleCallback 来调度执行每组任务，每组中的每个计算任务被称为 work，每个 work 完成后确认是否有优先级更高的 work 需要插入，如果有就让位，没有就继续。优先级通常是标记为动画或者 high 的会先处理。每完成一组后，将调度权交回主线程，直到下一次 requestIdleCallback 调用，再继续构建 workInProgress 树。

> 在 commit 阶段需要处理 effect 列表，这里的 effect 列表包含了根据 diff 更新 DOM 树、回调生命周期、响应 ref 等。

> 但一定要注意，这个阶段是同步执行的，不可中断暂停，所以不要在 componentDidMount、componentDidUpdate、componentWiilUnmount 中去执行重度消耗算力的任务。

> 如果只是一般的应用场景，比如管理后台、H5 展示页等，两者性能差距并不大，但在动画、画布及手势等场景下，Stack Reconciler 的设计会占用占主线程，造成卡顿，而 fiber reconciler 的设计则能带来高性能的表现。

# React 的渲染异常会造成什么后果？

![在这里插入图片描述](https://img-blog.csdnimg.cn/0cbad4e68c8e43fca957c2311a9accc1.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

> React 渲染异常的时候，在没有做任何拦截的情况下，会出现整个页面白屏的现象。它的成型原因是在渲染层出现了 JavaScript 的错误，导致整个应用崩溃。这种错误通常是在 render 中没有控制好空安全，使值取到了空值。

> 所以在治理上，方案是这样的，从预防与兜底两个角度去处理。

> 在预防策略上，引入空安全相关的方案，在做技术选型时，主要考虑了三个方案：第一个是引入外部函数，比如 Facebook 的 idx 或者 Lodash.get；第二个是引入 Babel 插件，使用 ES 2020 的标准——可选链操作符；第三个是 TypeScript，它在 3.7 版本以后可以直接使用可选链操作符。最后我选择了引入 Babel 插件的方案，因为这个方案外部依赖少，侵入性小，而且团队内没有 TS 的项目。

> 在兜底策略上，因为考虑到团队内部和我存在一样的问题，就抽取了兜底的公共高阶组件，封装成了 NPM 包供团队内部使用。

# 如何分析和调优性能瓶颈？

![在这里插入图片描述](https://img-blog.csdnimg.cn/68cab76145c8466a90110c2d00cebbd5.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70#pic_center)

# 如何避免重复渲染

- 优化时机，说明应该在什么时候做优化，这样做的理由是什么；
- 定位方式，用什么方式可以快速地定位相关问题；
- 常见的坑，明确哪些常见的问题会被我们忽略，从而导致重渲染
- 处理方案，有哪些方案可以帮助我们解决这个问题。

## 优化时机

### 原理

React 会构建并维护一套内部的虚拟 DOM 树，因为操作 DOM 相对操作 JavaScript 对象更慢，所以根据虚拟 DOM 树生成的差异更新真实 DOM。那么每当一个组件的 props 或者 state 发生变更时，React 都会将最新返回的元素与之前渲染的元素进行对比，以此决定是否有必要更新真实的 DOM。当它们不相同时，React 会更新该 DOM。这个过程被称为协调。

协调的成本非常昂贵，如果一次性引发的重新渲染层级足够多、足够深，就会阻塞 UI 主线程的执行，造成卡顿，引起页面帧率下降。

### 时机

虽然重新渲染会带来额外的性能负担，但这并不意味着我们就需要立刻优化它，任何结论应该建立在业务标准与数据基础上分析。 你的业务在目标群体中的运行环境标准就是业务标准

## 定位方式

通过数据采集，确认页面在 TP99 帧率不足 30FPS，然后就需要开始定位该页面的问题。定位的第一步应该是还原场景、完整复现。

### 复现

如果你能直接在设备上成功复现该问题，那是最好的，这个问题就没有什么探讨的价值了。而在实际工作中常常会出现一种截然相反的情况，就是无法复现。那首要采取的行动就是寻找运行该页面的设备机型与浏览器版本，确保能在相同环境下复现。如果还是不能，就需要确认影响范围，是否只是在特定的设备或者特定的浏览器版本才会出现该问题，这样就需要转入长期作战，增加埋点日志，采集更多的数据进行复现方式的分析。

### 工具

成功复现后，就需要通过工具定位问题点。通常通过两个工具去处理：

- 通过 Chrome 自带的 Performance 分析，主要用于查询 JavaScript 执行栈中的耗时，确认函数卡顿点，由于和重复渲染关联度不高，你可以自行查阅使用文档
- 通过 React Developer Tools 中的 Profiler 分析组件渲染次数、开始时间及耗时

如果需要查看页面上的组件是否有重新渲染，可以在配置项里直接开启Highlight updates when components render。此时，有组件渲染了，就会直接高亮。
![在这里插入图片描述](https://img-blog.csdnimg.cn/6692f02a45ff4fdba530a6a203f0eb11.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)
打开录制功能，在操作一段时间后暂停，就能看见具体的渲染情况：

- 不渲染的内容，会直接标记为Did not render；
- 重复渲染的内容可直接查看渲染耗时等消息。

React Profiler 的详细使用方式建议阅读[官方文档](https://zh-hans.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)，在排查重复渲染上没有比这更好的工具了。

## 常见的坑

在 React Profiler 的运行结果中，我们可以看出，避免重复渲染并不是不让它去渲染。

- 如果页面有显示信息变化的需求，那就要重新渲染；
- 但如果仅仅是更新单个组件，却触发了大量无关组件更新，那就有问题了。

所以我们避免的是无效的重复渲染，毕竟协调成本很昂贵。

比如有一个这样的列表，内部元素的顺序可以上移下移。代码如下所示：

```js
const initListData = []
for (let i = 0; i < 10; i++) {
  initListData.push({ text: i, id: i });
}
const LisItem = ({ text, id, onMoveUp, onMoveDown }) => (
    <div>
      {text}
      <button onClick={() => onMoveUp(id)}>
        上移
      </button>
      <button onClick={() => onMoveDown(id)}>
        下移
      </button>
    </div>
);
class List extends React.Component {
   state = {
     listData: initListData,
   }
   handleMoveUp = (id) => {
     // ...
   }

   handleMoveDown = (id) => {
     // ...
   }
   render() {
     const {
       listData
     } = this.state
     return (
       <div>
           {
               list.map(({ text, id }, index) => (
                <ListItem
                  key={id}
                  id={id}
                  text={text}
                  onMoveUp={this.handleMoveUp}
                  onMoveDown={this.handleMoveDown}
                />
              ))
           }
       </div>
     )
   }
}
1234567891011121314151617181920212223242526272829303132333435363738394041424344454647
```

这段代码分为两个部分：

- List组件用于展示列表，执行上下移动的逻辑；
- ListItem，也就是列表中展示的行，渲染每行的内容。
  执行这段代码后，如果你点击某行的 ListItem 进行上下移动，在 React Profile 中你会发现其他行也会重新渲染。

如果应用我们前面所学的知识，为 ListItem 添加 React.memo 就可以阻止每行内容重新渲染。如下代码所示：

```js
const LisItem = React.memo(({ text, onMoveUp, onMoveDown }) => (
    <div>
      {text}
      <button onClick={() => onMoveUp(item)}>
        上移
      </button>
      <button onClick={() => onMoveDown(item)}>
        下移
      </button>
    </div>
))
1234567891011
```

要知道无论是 React.memo 还是 PureComponent 都是通过浅比较的方式对比变化前后的 props 与 state，对比过程就是下面这段摘抄于 React 源码的代码。

```js
 if (type.prototype && type.prototype.isPureReactComponent) {
      return (
        !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
      );
    }
12345
```

那是否存在失效的情况呢？

最常见的情况莫过于使用箭头函数，比如像下面这样的写法，通过箭头函数取代原有的 handleMoveUp 函数。 那么此时再打开 React Profile，你会发现每次移动某行时，其他无关行又开始重复渲染了。

```js
<ListItem
    key={id}
    id={id}
    text={text}
    onMoveUp={(id) => { //... }}
    onMoveDown={this.handleMoveDown}
  />
1234567
```

这是因为箭头函数在 List 每次调用 render 时都会动态生成一个新的函数，函数的引用变化了，这时即便使用 React.memo 也是无效的。

JSX 的问题比较好解决，将整个函数提取为一个类属性的函数就可以了，但还有一类问题并不好解决，比如在 React Native 中，有个错误的使用案例是这样的：FlatList 是一个 PureComponent，但每次调用 render 函数都会生成一个新的 data 对象，与上面同理，PureComponent 就破防了，如果下层的子组件没有设置防护，那就层层击穿，开始昂贵的协调了。如下代码所示：

```js
render() {
     const data = this.props.list.map((item) => { /*... */ })
     return (
        <FlatList
          data={data}
          renderItem={this.renderItem}
        />
     )
  }
123456789
```

所以在使用组件缓存的 API 时，一定要避开这些问题。

### 处理方案

那怎么解决呢？React 在设计上是通过数据的变化引发视图层的更新。

#### 缓存

性能不够，缓存来凑，第一类方案是添加缓存来处理，常见的解决方案有 Facebook 自研的 reselect。让我们回到 FlatList 的案例，虽然 this.props.list 每次必须经过转换后才能使用，但我们只要保证 list 不变时转换后的 data 不变，就可以避免重复渲染。

reselect 会将输入与输出建立映射，缓存函数产出结果。只要输入一致，那么会直接吐出对应的输出结果，从而保证计算结果不变，以此来保证 pureComponent 不会被破防。如以下案例所示：

```js
import { createSelector } fr om 'reselect'
const listSelector = props => props.list || []
const dataSelector = createSelector(
  listSelector,
  list => list.map((item) => { /*... */ })
)
render() {
     return (
        <FlatList
          data={dataSelector(this.props)}
          renderItem={this.renderItem}
        />
     )
  }
1234567891011121314
```

#### 不可变数据

第二类方案的心智成本相对比较高，是使用不可变数据，最早的方案是使用ImmutableJS。如果我们无法将 props 或者 state 扁平化，存在多级嵌套且足够深，那么每次修改指定节点时，可能会导致其他节点被更新为新的引用，而ImmutableJS 可以保证修改操作返回一个新引用，并且只修改需要修改的节点。

ImmutableJS 常见的一个错误使用方式就是下面这样的，即在传参时，使用 toJS 函数生成新的对象，那就又破防了。

```js
 <FlatList
        data={immutableList.toJS()}
        renderItem={this.renderItem}
  />
1234
```

这样的错误写法太常见了，存在于大量的 ImmutableJS 项目中。造成的原因是 ImmutableJS 本身的数据遍历 API 使用麻烦，且不符合直觉，所以如今 immerjs 更为流行。

#### 手动控制

最后一种解决方案就是自己手动控制，通过使用 shouldComponentUpdate API 来处理，在生命周期一讲中有详细介绍过，这里就不赘述了。

需要注意，使用 shouldComponentUpdate 可能会带来意想不到的 Bug，所以这个方案应该放到最后考虑。

## 回答：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f298b3a39b444917a9863fd24ca7afbc.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

> 如何避免重复渲染分为三个步骤：选择优化时机、定位重复渲染的问题、引入解决方案。

> 优化时机需要根据当前业务标准与页面性能数据分析，来决定是否有必要。如果卡顿的情况在业务要求范围外，那确实没有必要做；如果有需要，那就进入下一步——定位。

> 定位问题首先需要复现问题，通常采用还原用户使用环境的方式进行复现，然后使用 Performance 与 React Profiler 工具进行分析，对照卡顿点与组件重复渲染次数及耗时排查性能问题。

> 通常的解决方案是加 PureComponent 或者使用 React.memo 等组件缓存 API，减少重新渲染。但错误的使用方式会使其完全无效，比如在 JSX 的属性中使用箭头函数，或者每次都生成新的对象，那基本就破防了。

> 针对这样的情况有三个解决方案：

1. 缓存，通常使用 reselect 缓存函数执行结果，来避免产生新的对象；
2. 不可变数据，使用数据 ImmutableJS 或者 immerjs 转换数据结构；
3. 手动控制，自己实现 shouldComponentUpdate 函数，但这类方案一般不推荐，因为容易带来意想不到的 Bug，可以作为保底手段使用。

# 如何提升 React 代码可维护性？

![在这里插入图片描述](https://img-blog.csdnimg.cn/d66a073f5e6b4bc78645aa7a25cab36c.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70#pic_center)
如何提升 React 代码的可维护性，究其根本是考虑如何提升 React 项目的可维护性。从软件工程的角度出发，可维护性包含了可分析性、可改变性、稳定性、易测试性与可维护性的依从性，接下来我从这五个方面对相关工作进行梳理。

> 可分析性的目标在于快速定位线上问题，可以从预防与兜底两个维度展开工作，预防主要依靠 Lint 工具与团队内部的 Code Review。Lint 工具重在执行代码规划，力图减少不合规的代码；而 Code Review 的重心在于增强团队内部的透明度，做好业务逻辑层的潜在风险排查。兜底主要是在流水线中加入 sourcemap，能够通过线上报错快速定位源码。

> 可改变性的目标在于使代码易于拓展，业务易于迭代。工作主要从设计模式与架构设计展开。设计模式主要指组件设计模式，通过容器组件与展示组件划分模块边界，隔绝业务逻辑。整体架构设计，采用了 rematch 方案，rematch 中可以设计的 model 概念可以很好地收敛 action、reducer 及副作用，同时支持动态引入 model，保障业务横向拓展的能力。Rematch 的插件机制非常利于做性能优化，这方面后续可以展开聊一下。

> 接下来是稳定性，目标在于避免修改代码引起不必要的线上问题。在这方面，主要通过提升核心业务代码的测试覆盖率来完成。因为业务发展速度快、UI 变化大，所以基于 UI 的测试整体很不划算，但背后沉淀的业务逻辑，比如购物车计算价格等需要长期复用，不时修改，那么就得加测试。举个个人案例，在我自己的项目中，核心业务测试覆盖率核算是 91%，虽然没完全覆盖，但基本解决了团队内部恐惧线上出错的心理障碍。

> 然后是易测试性，目标在于发现代码中的潜在问题。在我个人负责的项目中，采用了 Rematch 的架构完成模块分离，整体业务逻辑挪到了 model 中，且 model 自身是一个 Pure Object，附加了多个纯函数。纯函数只要管理好输入与输出，在测试上就很容易。

> 最后是可维护性的依从性，目标在于建立团队规范，遵循代码约定，提升代码可读性。这方面的工作就是引入工具，减少人为犯错的概率。其中主要有检查 JavaScript 的 ESLint，检查样式的 stylelint，检查提交内容的 commitlint，配置编辑器的 editorconfig，配置样式的 prettier。总体而言，工具的效果优于文档，团队内的项目整体可保持一致的风格，阅读代码时的切入成本相对较低。

# React Hook 的使用限制有哪些？

![在这里插入图片描述](https://img-blog.csdnimg.cn/014504dcfe6c40ed81417593dc0db7ec.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

React Hooks 的限制主要有两条：

- 不要在循环、条件或嵌套函数中调用 Hook；
- 在 React 的函数组件中调用 Hook。

> 那为什么会有这样的限制呢？就得从 Hooks 的设计说起。Hooks 的设计初衷是为了改进 React 组件的开发模式。在旧有的开发模式下遇到了三个问题。

> 组件之间难以复用状态逻辑。过去常见的解决方案是高阶组件、render props 及状态管理框架。

> 复杂的组件变得难以理解。生命周期函数与业务逻辑耦合太深，导致关联部分难以拆分。

> 人和机器都很容易混淆类。常见的有 this 的问题，但在 React 团队中还有类难以优化的问题，他们希望在编译优化层面做出一些改进。

> 这三个问题在一定程度上阻碍了 React 的后续发展，所以为了解决这三个问题，Hooks 基于函数组件开始设计。然而第三个问题决定了 Hooks 只支持函数组件。

> 那为什么不要在循环、条件或嵌套函数中调用 Hook 呢？因为 Hooks 的设计是基于数组实现。在调用时按顺序加入数组中，如果使用循环、条件或嵌套函数很有可能导致数组取值错位，执行错误的 Hook。当然，实质上 React 的源码里不是数组，是链表。

> 这些限制会在编码上造成一定程度的心智负担，新手可能会写错，为了避免这样的情况，可以引入 ESLint 的 Hooks 检查插件进行预防。

# useEffect 与 useLayoutEffect 区别在哪里

![在这里插入图片描述](https://img-blog.csdnimg.cn/66550f066b9a47f6921a58278dfa347c.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjAwMTg1,size_16,color_FFFFFF,t_70)

useEffect 与 useLayoutEffect 的区别在哪里？这个问题可以分为两部分来回答，共同点与不同点。

> 它们的共同点很简单，底层的函数签名是完全一致的，都是调用的 mountEffectImpl，在使用上也没什么差异，基本可以直接替换，也都是用于处理副作用。

> 那不同点就很大了，useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景，而 LayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 LayoutEffect 做计算量较大的耗时任务从而造成阻塞。

> 在未来的趋势上，两个 API 是会长期共存的，暂时没有删减合并的计划，需要开发者根据场景去自行选择。React 团队的建议非常实用，如果实在分不清，先用 useEffect，一般问题不大；如果页面有异常，再直接替换为 useLayoutEffect 即可。
