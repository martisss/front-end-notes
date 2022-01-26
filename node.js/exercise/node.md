Node的模块系统避免了对全局作用域的污染，从而也就避免了命名冲突，并简化了代码的重 用。模



require是Node中的同步I/O操作，一般在文件顶端引入，在I/O密集的地方尽量不要用require, 所有的同步调用都会阻塞Node, 一般在程序最初加载的时候使用require和其他同步操作

## 模块的导出

用module.exports 可以对外提供单个变量、函数或者对象。如果你创建了一个既有exports又有module.exports 的模块，那它会返回module.exports，而exports会被忽略

> exports只是对module.exports的一个全 局引用，最初被定义为一个可以添加属性的空对象。所

## 查找模块的步骤

![image-20220125232738678](D:\NOTES\node.js\exercise\node.assets\image-20220125232738678.png)