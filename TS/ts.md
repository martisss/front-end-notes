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

# any和unknown有什么区别？

首先是二者的相同点：`unknown`和`any`都是顶层类型，也就是所有类型都可以赋值给`unknown`和`any`

不同点在于**与`any`相比，`unknown`是更符合类型安全原则**的，使用`any`就意味着放弃了类型安全检查，此时你可以对一个`any`类型的的变量进行任何操作，但如果这个变量是`unknown`，你不能直接对它进行操作，因为`unknown`此刻类型是未知的，直接操作可能会出错，需要`unknown`进行**类型收窄**。

> 传统功夫是讲究`化劲儿`的，`any`就是这样一股`化劲儿`，哪里不通怼哪里，`化劲儿`练到最后就可以将`anyscript`修炼到大成，也就是纯正的`Javascript`，即没有类型检查的阶段！

注意观察下面的例子:

> 使用 any 跳过了类型检查，不会报错；

```ts
function sayMyName(callback: any) {
    callback()
}
```

> 同样是顶层类型，unknown 会有类型检查

```ts
function sayMyName(callback: unknown) {
    callback()
} //(parameter) callback: unknown Object is of type 'unknown'.
```

虽然上述例子中，使用`any`时不会爆出类型错误，但是最终运行代码时还是可能会报错，比如运行 `sayMyName(1)`; 但 使用`unknown`时，同样的代码，TS为我们指出了潜在的错误，这也是`TypeScript`的初衷，因此说：**`与`any`相比，`unknown`是更符合类型安全原则的`**。

对使用`unknown`的情形进行类型收窄：

```ts
function sayMyName(callback: unknown) {
    if(typeof callback === 'function') {
        callback()
    }
}
```

将unknown收窄到特定类型，就不会报错了。

也可以使用类型断言达到类似效果

```js
let res: unknown = 123
let a: string = res as string //通过类型检查，但运行报错
const b: number = res as number 

console.log(a.toLocaleLowerCase()) 
// [ERR]: a.toLocaleLowerCase is not a function 
```

# TS中Never有什么作用？

## bottom type

首先, `Never`是一个`bottom type`，这如何体现呢？

![image-20220430125622956](../pictures/image-20220430125622956.png)

`never`和`unknown`朝着两个相反的方向行进，所有的类型都可以赋值给`unknown`, `never`可以赋值给任何类型；`unknown`不能赋值给除any和自身之外的任何类型，除`Never`本身外，任何类型都不能赋值给`Never`

## 应用场景

1. 用于从来不会返回值的函数

   这可能有两种情况，一是函数中可能死循环

   ```js
   function loop():never {
       while(true) {}
   }
   ```

   另外一种情况就是这个函数总是会抛出一个错误，因此也总是没有返回值

   ```ts
   function loop():never {
       throw new Error('error!')
   }
   ```

2. 对于一个联合类型，将其类型收窄为`never`

   ```ts
   interface Foo {
     type: 'foo'
   }
   interface Bar {
     type: 'bar'
   }
   type All = Foo | Bar
   ```

   ```ts
   function handleValue(val: All) {
     switch (val.type) {
       case 'foo':
         // 这里 val 被收窄为 Foo
         break
       case 'bar':
         // val 在这里是 Bar
         break
       default:
         // val 在这里是 never
         const exhaustiveCheck: never = val
         break
     }
   }
   ```

   通过case 对可能的类型进行了相应处理，因此`default`处`val`的类型是`Never`，这也体现了`Never`是一个底层类型：`Never`只能赋值给`Never`。如果之后联合类型`All`中添加了新的类型，但是在代码中忘记进行相应处理，那么就能提前暴露处错误，提醒开发者进行处理。

   ## 

   
