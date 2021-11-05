## vue特点
- 组件化模式，提高代码复用率
- 声明式编码，无需操作DOM
- 虚拟DOM + diff算法，尽量服用DOM节点

## 数据绑定 
v-bind  单向数据绑定
v-model 双向数据绑定，只能用于输入类元素

## 挂载实例
- el
- $mount
```
const v = new Vue({****
  data:{

  }
})
v.$mount('#root')
```
## data
- 对象式写法
```
const v = new Vue({
  data: {

  }
})
```
- 函数式写法   组件
```
const v = new Vue({
  data() {

  }
})
```

## vue数据代理
- 通过vue实例对象来代理data对象中属性的操作（读/写）
- 好处：方便地操作data中的数据
- 基本原理：通过Object.defineProperty()把data对象中所有属性添加到vue实例，且为添加的每一个属性只当一个setter/getter,去操作data中的对应属性

## 事件修饰符
prevent stop once  
capture self 
passive 事件的默认行为立即执行，不必等待回调函数完成

修饰符可以连着写

@scroll 滚动条滚动  @wheel 滚轮滚动

## 键盘事件
keyup keydown  
@keyup.ctrl.y   可以连着写  ctrl + y 才触发
enter esc space up down left right delete tab

## 计算属性
data中的数据发生改变，模板重新解析，插值语法中有方法的话也会重新调用
computed   作缓存
```
computed: {
  fullname: {
    get() {
      return this.xx
    }
    set() {

    }
  }
}

如果只读不改
简写，一般情况下
computed: {
  fullname() {
    return this.xx
  }
}

```
**get 调用时机：1.初次读取xx时；2.所依赖的数据发生改变时**
计算属性是基于它们的响应依赖关系缓存的。计算属性只在相关响应式依赖发生改变时它们才会重新求值。


原理：底层借助Object.defineProperty方法提供的getter和setter
优势：与methods 相比，内部具有缓存机制，效率更高，调试更方便
如果计算属性需要修改，需要set，且set中要引起计算时依赖的数据发生变化

**计算属性中不能开启 异步任务**

## 监视属性
- 被监视的属性变化时， 回调函数自动调用，进行相关操作
- 监视的属性必须存在
- watch的两种写法
  1. new Vue时传入watch配置
  2. 通过vm.$watch监视

监视多级结构中的某个属性的变化
```
data: {
  numbers: {
    a:1,
    b:2
  }
}
watch: {
  'numbers.a': {
    handler() {
      .....
    }
   }
}
```
监视多级结构中的所有属性的变化
```
//完整写法
data: {
  numbers: {
    a:1,
    b:2
  }
}
watch: {
  //immediate: true, // 初始化时让handler调用一次
  deep: true,  //开启深度监测
  numbers : {
    handler() {
      .....
    }
   }
}
```

**深度监视**
1. vue中的watch默认不检测对象内部值得改变
2. 配置deep:true 可以监测对象内部值改变

```
//简写方式
//配置项中只需要handler
watch: {
  numbers(newValue, oldValue) {
    .......
  }
}

vm.$watch('numbers', function(new, old) {
  ........
})
//此处不能写成箭头函数
```

**总结**： computed和 watch都能完成的任务，使用computed完成，watch中可以开启异步任务

## 条件渲染
v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

## vue中key的作用（key的内部原理）
虚拟DOM中key的作用：
key是虚拟DOM对象的标识，当数据发生变化时，vue会根据新数据生成新的虚拟DOM,随后vue进行新虚拟DOM与旧虚拟DOM的差异比较。
- 找到了相同的key,内容没变，复用；
  内容变了，生成新的真实DOM,替换页面中的DOM
- 未找到相同的key,创建相应的真实DOM，随后渲染到页面

**注意**：使用index作为key可能会引发的问题：
- 若对数据进行逆序添加、删除等破坏顺序的操作，会产生没有必要的真实DOM更新，界面没问题，但效率低
- 如果结构中包含输入类DOM
  会产生错误的DOM更新，界面出现问题

如何选择key:最好选择唯一标识作为key,如果没有破坏顺序的操作，那么使用index作为key,也可以

## 列表渲染

## 监测数据的原理

数据改变，触发setter方法，重新解析模板，生成虚拟dom,然后diff

## vue 修改数组  监视
通过对常见修改数组的方法进行包装实现，一方面调用一般的arr方法，另一方面去重新解析模板
vue修改数组中的某个元素要使用：
- push(), pop(),shift(), unshift(), slice(), sort(), reverse()
- vm.set() vm.$set()
只能给data中的某个对象追加属性，而不能给data追加属性
更新数组在vue中是一种较为高效的操作

## 收集表单数据
