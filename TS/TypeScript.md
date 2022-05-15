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

## 官方描述

> Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

从上面这段话中我们可以得知：

- 几乎`interface`的所有特性都可以用`type`实现
-  `interface`可以添加新的属性，是可扩展的

##　区别一

针对第一点，参考官方对`interface`与`type`的描述：

> - Interfaces are basically a way to describe data shapes, for example, an object.
> - Type is a definition of a type of data, for example, a union, primitive, intersection, tuple, or any other type.

`interface`用来描述数据的形状（data shapes）

> 至于什么是数据的形状呢？ 例如二叉树中数据以分层的形式排布，每个元素最多由两个子元素；在链表中，数据以链式存储，顺序布局，这便是`data shapes`，结合数据本身，以及保留`data shapes`的相关操作（对于链表来说就是对链表节点的添加、删除等，不破坏原有结构），这三者就组成了数据结构。

`type`是数据类型的定义，如**联合类型（A |Ｂ）**、**基本类型**、**交叉类型（Ａ＆B**）、**元组**等，此外type 语句中还可以使用 **`typeof `**获取实例的类型进行赋值。

简而言之，**`interface`右边必须是 `data shapes`, 而`type`右边可以是任何类型。**

> 开头提到`interface`是可扩展的的，也是得益于声明合并，而`type`虽然通过`extends`可以达到类似的效果，但谈不上可扩展。官方描述中也提到:
>
> **`the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.`**

## 区别二

针对第二点，`interface`支持声明合并（`declaration merging`），`type alias`不支持。

```js
interface Person {
  name: string;
}
interface Person {
  age: number;
}
// 合并为:interface Person { name: string age: number}

type User = {
  name: string;
};
type User = {
  age: number;
};
// error: Duplicate identifier 'User'.
```

## 总结

主要有两点区别：

1. `interface`右边只能是`data shapes`,而`type`右边涵盖的范围更大，还可以是**联合类型（A |Ｂ）**、**基本类型**、**交叉类型（Ａ＆B**）、**元组**等，也可以使用`typeof`
2. `interface`支持声明合并，`type`不支持声明合并。

## 参考

[TS Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)

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

注： <p style="color: green">√</p>表示**strictNullChecks**为`false`时的情况

✔

`never`和`unknown`朝着两个相反的方向行进，所有的类型都可以赋值给`unknown`, `never`可以赋值给任何类型；`unknown`不能赋值给除any和自身之外的任何类型，除`Never`本身外，任何类型都不能赋值给`Never`

## 应用场景

1. **用于从来不会返回值的函数**

   这可能有两种情况，一是函数中可能死循环

   ```js
   function loop():never {
       while(true) {
           console.log('I always does something and never ends.')
       }
   }
   ```

   另外一种情况就是这个函数总是会抛出一个错误，因此也总是没有返回值

   ```ts
   function loop():never {
       throw new Error('error!')
   }
   ```

2. **穷尽检查（Exhaustiveness checking）**

   对于一个联合类型，将其类型收窄为`never`

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

   通过case 对可能的类型进行了相应处理，因此`default`处`val`的类型是`never`，这也体现了`never`是一个底层类型：`never`只能赋值给`never`。如果之后联合类型`All`中添加了新的类型，但是在代码中忘记进行相应处理，那么就能提前暴露处错误，提醒开发者进行处理。

   ##　Never和void的区别

   1. 从赋值的角度来看，`undefined`可以赋值给`void`类型的变量，除了`never`本身，任何值都不能赋值给`never`类型，也就是说`never`意味着没有任何值。

      > **strictNullChecks**为`false`时，`null`类型也是可以赋值给`void`的

   2. `void` 表示一个函数并不会返回任何值，当函数并没有任何返回值，或者返回不了明确的值的时候，就应该用这种类型。

      `never`表示一个函数从来不返回值，可能这个函数处于死循环，一直在运行，也可能这个函数运行过程中报错；`never`只能赋值给`never`，可以利用这个特性进行**穷尽检查（Exhaustiveness checking）**。

   
   
   
   
   > **注：**  
   >
   >   当基于上下文的推导，返回类型为`void`时，不会强制返回函数一定不能返回内容，也就是说当这样一个类型`(type vf = () => void)`被应用时，也是可以返回值的，只不过返回的值会被忽略。
   >
   > ```js
   > type voidFunc = () => void;
   >  
   > const f1: voidFunc = () => {
   >   return true;
   > };
   > 
   > let a = f1() //let a: void
   >  
   > const f2: voidFunc = () => true;
   >  
   >  let b = f2()  //let b: void
   > const f3: voidFunc = function () {
   >   return true;
   > };
   > 
   > let c = f3() //let c: void
   > ```
   >
   > 可以看到`a` `b` `c`的类型都是`void`
   >
   > 但当一个函数字面量定义返回一个 `void` 类型，函数是一定不能返回任何东西的
   >
   > ```js
   > function f2(): void {
   >   return true;  //Type 'true' is not assignable to type 'void'.
   > }
   >  
   > const f3 = function (): void {
   >   return true;  //Type 'true' is not assignable to type 'void'.
   > };
   > ```
   
   

# note

ts执行静态类型检查，在代码运行之前暴露出错误，逻辑错误，拼写错误，。。

开启这个命令之后报错就不会生成新的文件

```
tsc --noEmitOnError hello.ts
```

设置目标编译版本

```
tsc test.ts --target es2015
```

# Strictness

tsconfig.json

```
noImplicitAny: true  //隐式推断为any都会报错

```

strictNullChecks为false时， null和undefined可以赋值给很多其他类型（除了never）,另外访问值可能为null或者undefind的变量时也不会报错，为true主要是提醒开发人员不要忘记处理null和undefined，这时可以使用后缀`!`,即非空断言，但不会改变运行时的行为，因此前提是开发者确定此处不为空。

typescript 是结构类型系统，只关心结构是否保持一致



# 类型断言

断言只能把一个类型断言的更具体，或者更不具体，即把对应类型的范围放大或者缩小，而不能将一种具体的类型断言成另一种具体的类型。

可以使用两次断言

```
const a = (expr as any) as T
```

# 字面量类型

通常将其运用于联合类型中

字面量类型的推导可能导致的问题：

```ts
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method); //error Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

第二个参数需要的是字面量类型，`"GET" | "POST"`, 而req.method此时的类型是`string`

解决办法：

```js
1.
const req = { url: "https://example.com", method: "GET" as "GET"};
2. 
handleRequest(req.url, req.method as 'GET')
3.
const req = { url: "https://example.com", method: "GET" } as const
//将整个对象转换为字面量类型

```

# 函数

写约束的时候保持克制，如无必要，勿增实体。

## 泛型函数

```js
function first<T>(arr: T[]): T | undefined {
    return arr[0]
}
```

## 推断

```js
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}
 
// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

## 泛型约束

```js
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```

使用`extends`语法来约束参数类型，在这里要注意返回类型要和输入类型一致，不仅仅是满足泛型约束的要求

## 指定类型参数

```js
function combine<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.concat(arr2)
}

const res = combine<string | number>([1,2,3], ['abc'])
```

## 函数重载

函数重载或⽅法重载是使⽤相同名称和不同参数数量或类型创建多个⽅法的⼀种能⼒

重载签名至少两个，后面跟实现签名，实现签名对外界来说是不可见的

实现签名必须和重载签名兼容

```ts
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
This overload signature is not compatible with its implementation signature.
function fn(x: string | number) {
  return "oops";
}
```

## 在函数中声明this

[函数中声明this](https://github.com/mqyqingfeng/Blog/issues/220/#)

## 调用签名、构造签名

# 结合工具类型学习ts中的关键字

## keyof  & in

```js
type Partial<T> = {
    [P in keyof T]?: T[P];
};

type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

`keyof`操作符返回对象属性名组成的**字面量联合类型**

```ts
type Dog = { name: string; age: number;  };
type D = keyof Dog; //type D = "name" | "age"
```

但要注意遇到索引签名时，`typeof`会直接返回其类型

```ts
type Dog = {  [y:number]: number  };
type dog = keyof Dog;  //type dog = number

type Doggy = {  [y:string]: boolean };
type doggy = keyof Doggy; //type doggy = string | number

type Doggy = {  [y:string]: unknown, [x:number]: boolean};
type doggy = keyof Doggy; //type doggy = string | number
```

因为`JavaScript`的对象属性会默认转换为字符串

主要用来遍历枚举类型

```ts
type Animals = 'pig' | 'cat' | 'dog'

type animals = {
    [key in Animals]: string
}
// type animals = {
//     pig: string;
//     cat: string;
//     dog: string;
// }
```

## Partial & Required

`Partial`：将某个类型里的属性全部变为可选项

思路是先用`keyof`取到该类型所有属性组成的字面量联合类型，然后结合`in` `?`操作符，将每个属性变成可选的

```ts
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```

`Required`：和`Partial`的作用相反，是为了将某个类型里的属性全部变为必选的

```ts
interface Props {
  a?: number;
  b?: string;
}
 
const obj: Props = { a: 5 };
 
const obj2: Required<Props> = { a: 5 };
//Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```

实现思路和前面相似

```ts
type Partial<T> = {
    [P in keyof T]-?: T[P]
}
```

上文对应的`-？`代表着去掉可选，与之对应的还有`+？`，两者正好相反

## readonly

字面意思，只读属性，创建之后不能修改值，TS提供了`Readonly`工具类型将每一个属性变为只读。

`Readonly`的实现思路同`Partial`，先用`keyof`取到该类型所有属性组成的字面量联合类型，然后结合`in` `readonly`操作符，将每个属性变成只读的

```js
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

## extends

```js
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

`extends`关键字的出现频率也很高，主要有以下几个作用：

1. 接口继承

   ```ts
   interface Person {
       name: string;
       age: number;
   }
   
   interface Player extends Person {
       item: 'ball' | 'swing';
   }
   ```

2. 类型约束

   通常和泛型一起使用

   ```ts
   P extends keyof T
   ```

   表示`P`的类型是`keyof T`返回的字面量联合类型

   与之相关的工具类型有`Pick`和`Record`

   `Pick`表示从一个类型中选取指定的几个字段组合成一个新的类型，用法如下：

   ```ts
   type Person = {
     name: string;
     age: number;
     address: string;
     sex: number;
   }
   
   type PickResult = Pick<Person, 'name' | 'address'>
   // { name: string; address: string; }
   ```

   实现方式:

   ```ts
   type Pick<T, K extends keyof T> = {
       [P in K]: T[P];
   };
   ```

   首先进行了类型限定，`K`一定是`T`的子集，然后用`in`遍历`K`中的每个属性

   `Record<K, T>`用来将`K`的每一个键(`k`)指定为`T`类型，这样由多个`k/T`组合成了一个新的类型，用法如下：

   ```ts
   type keys = 'Cat'|'Dot'
   type Animal = {
     name: string;
     age: number;
   }
   
   type RecordResult = Record<keys, Animal>
   // result: 
   // type RecordResult = {
   //     Cat: Animal;
   //     Dot: Animal;
   // }
   ```

   实现方式：

   ```ts
   type Record<K extends keyof any, T> = {
       [P in K]: T
   }
   ```

   `keyof any`是什么鬼？鼠标放上去看看就知道了

   ![image-20220515205738135](../pictures/image-20220515205738135.png)

   因此，`keyof any`即`string | number | symbol`，先对键的取值范围进行了限定，只能是三者中的一个。

3. 条件类型

   常见表现形式为：

   ```js
   T extends U ? 'Y' : 'N'
   ```

   类似`JS`中的三元表达式，可以这样理解：`T`是`U`的子集，那么`T`的结果是`'Y'`, 否则是`'N'`. 

   ```ts
     type A1 = 'x' extends 'x' ? string : number; // string
   
     type A2 = 'x' | 'y' extends 'x' ? string : number; // number
   ```

   上述两个例子都符合刚提到的 “三元表达式” 操作

   要注意的一点就是当`T`泛型时，且传入该泛型的是一个联合类型中，那么该联合类型中的每一个类型都要进行上述操作，最终返回上述操作结果组成的新联合类型，这叫做分配条件类型（[`Distributive Conditional Types`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types=)）

   ```ts
    type P<T> = T extends 'x' ? string : number;
    type A3 = P<'x' | 'y'> // ?   type A3 = string | number
   ```

   同样传入`'x' | 'y'`, 结果却不同。

   实际进行的操作类似如下：

   ```ts
    type A3 = P<'x' | 'y'> 
    type A3 = P<'x'>  | P<'y'>
    type A3 = ('x' extends 'x' ? string : number) | ('y' extends 'x' ? string : number)
   // type A3 = string | number
   ```

   以下情况也不属于分配条件类型生效的情况:

   ```ts
   type A<T> = string extends T ? "yes" : "no"
   
   type A<T> = string extends T ? "yes" : "no"
   ```

   相关的工具类型又有哪些呢？

   先看着两个：`Exclude`和`Extract`

   `Exclude<T, U>`: 排除`T`中属于`U`的部分

   ![image-20220515211128808](../pictures/image-20220515211128808.png)

   `Extract<T, U>`： 提取`T`中属于`U`的部分，即二者交集

   ![image-20220515211136815](../pictures/image-20220515211136815.png)

使用方法：

```ts
type ExcludeResult = Exclude<'name'|'age'|'sex', 'sex'|'address'>
//type ExcludeResult = "name" | "age"
```

```ts
type ExcludeResult = Extract<'name'|'age'|'sex', 'sex'|'address'>
//type ExcludeResult = "sex"
```

实现方式：

```ts
type Exclude<T, U> = T extends U ? never : T

type extract<T, U> = T extends U ? T : never
```

实现思路不再赘述，和`extends`分配条件类型处一样

`NonNullable`工具类型可以从目标类型中排除1`null`和`undefined`，和`Exclude`相比，它将`U`限定的更具体

实现也很简单：

```ts
type A = null | undefined | 'dog' | Function

// type nonNullable<T> = Exclude<T , undefined | null>
type nonNullable<T> = T extends null | undefined ? never : T

type res = nonNullable<A>   // type res = Function | "dog"
```



根据已经实现的`Exclude`类型，可以实现`Omit`类型，`Omit<T, K>`:删除`T`中指定的字段，用法如下：

```ts
type Person = {
  name?: string;
  age: number;
  address: string;
}

// 结果：{ name？: string; age: number; }
type OmitResult = Omit<Person, 'address'>
```

实现方式：

```
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

实现思路：

首先，删除指定字段，字段类型限定在 `string | symbol number`中，然后用`Exclude`从`T`的属性所组成的字面量联合类型中移除指定字段，形成新的联合类型；最后利用`Pick`选取指定字段生成新的类型



## infer

 Parameters

*type* ReturnType<T *extends* (...*args*: *any*) => *any*> = T *extends* (...*args*: *any*) => infer R ? R : *any*;

## *abstract*

 ConstructorParameters

*type* InstanceType<T *extends* *abstract* new (...*args*: *any*) => *any*> = T *extends* *abstract* new (...*args*: *any*) => infer R ? R : *any*;

*type* InstanceType<T *extends* *abstract* new (...*args*: *any*) => *any*> = T *extends* *abstract* new (...*args*: *any*) => infer R ? R : *any*;
