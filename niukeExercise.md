# 求数组a的最大值
Math.max.apply(null,a)
apply方法，方法有两个参数，用作 this 的对象和要传递给函数的参数的数组。

#变量回收规则
代码回收规则如下：

1.全局变量不会被回收。

2.局部变量会被回收，也就是函数一旦运行完以后，函数内部的东西都会被销毁。

3.只要被另外一个作用域所引用就不会被回收