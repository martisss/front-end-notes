# 泛型

数据结构的本质是什么？

主要包括三个部分：

- 数据本身：
- 数据的形状：例如二叉树中数据以分层的形式排布，每个元素最多由两个子元素。在链表中，数据以链式存储，顺序布局
- 一组保留形状的操作：对链表进行添加，删除节点等操作之后，得到的依然是一个链表

两个专注点：

- 一个是数据，包括数据的类型以及数据结构的实例中保存的实际值
- 另一个是数据的形状和保留形状的操作。

泛型数据结构帮助我们解耦了这些关注点：泛型数据结构处理数据的布局、形状和任何保留形状的操作，它并不关心具体的数据内容，通过将数据布局的职责交付给独立于实际数据内容的泛型数据结构，可以让代码变得组件化。



泛型：泛型为类型提供变量， 一个没有泛型的数组可以容纳任何类型的数组，提供了泛型的数组描述特定类型变量

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
```



# Structural Type System

鸭子类型

要求两个对象满足“形状匹配（shape matching）”，而不关心两个对象的具体实现。

```ts
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // logs "12, 26"
 
const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3"
 
const color = { hex: "#187ABF" };
logPoint(color);
```

另一个例子， {} 创建的字面量对象与类

```ts
class VirtualPoint {
  x: number;
  y: number;
 
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
 
const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // logs "13, 56"
```

# interface 与 type的区别

> Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

从上面这段话中我们可以得知：

- 几乎`interface`的所有特性都可以用`type`实现
-  `interface`可以添加新的属性

针对第一点，参考官方对`interface`与`type`的描述：

> - Interfaces are basically a way to describe data shapes, for example, an object.
> - Type is a definition of a type of data, for example, a union, primitive, intersection, tuple, or any other type.

`interface`用来描述数据的形状（data shapes）

> 至于什么是数据的形状呢？ 例如二叉树中数据以分层的形式排布，每个元素最多由两个子元素；在链表中，数据以链式存储，顺序布局，这便是`data shapes`，结合数据本身，以及保留`data shapes`的相关操作（对于链表来说就是对链表节点的添加、删除等，不破坏原有结构），这三者就组成了数据结构。

`type`是数据类型的定义，如联合类型、基本类型、交叉类型等，此外type 语句中还可以使用 `typeof `获取实例的类型进行赋值

简而言之，`interface`右边必须是 `data shapes`, 而`type`右边可以是任何类型。

针对第二点，`interface`支持声明合并（`declaration merging`），`type alias`不支持。

