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

