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
![avatar](D:/NOTES/vuenotes/表单数据收集.png)

## 过滤器
![avatar](D:/NOTES/vuenotes/filter.png)

## 内置指令
### v-text
不支持解析
### v-html
支持解析，在网站上动态渲染HTML是危险的
### v-cloak
**v-cloak 解决页面闪烁问题**
vue实例创建完成并接管容器之后，会删掉v-cloak属性
## v-once
v-once 所在接待你在初次动态渲染之后，视为静态内容，以后数据的改变不会引起v-once所在结构的更新，可以优化性能
## v-pre
跳过所在节点的编译过程
可以用其跳过使用指令语法，没有使用插值语法的节点

## 自定义指令

```
  directives:{
    // 相当于bind和update
    <!-- 函数式 -->
    big(element, binding) {
      element.innerText = binding.value * 10
    },
    <!-- 对象式 -->
    fbind:{
      // 指令与元素成功绑定时
      bind(element, binding) {
        element.value = binding.value
      },
      // 元素插入页面时
      inserted(element){
        element.focus()
      },
      // 解析时
      update(element, binding) {
        element.value = binding.value
        element.focus()
      }
    }

  }
```
directives中this指向window,上述为局部指令
以下为全局写法
```
Vue.directive('fbind', {
      // 指令与元素成功绑定时
      bind(element, binding) {
        element.value = binding.value
      },
      // 元素插入页面时
      inserted(element){
        element.focus()
      },
      // 解析时
      update(element, binding) {
        element.value = binding.value
        element.focus()
      }
    })
```
### 自定义指令总结:
**定义语法:**
(1)局部指令:
new Vue({ directives:{指令名:配置对象} })
new Vue({ directives{指令名:回调函数} })

(2)全局指令:
|Vue .directive(指令名,配置对象)或Vue . directive(指令名回调函数)
**配置对象中常用的3个回调:**
(1).bind:指令与元素成功绑定时调用。
(2).inserted:指令所在元素被插入页面时调用。
(3).update:指令所在模板结构被重新解析时调用。
**备注:**
1.指令定义时不加V-，但使用时要加Iv-;
2.指令名如果是多个单词，要使用kebab-case命名方式，不要用camelCase命名。
## Vue生命周期
**常用的生命周期钩子:**
1. mounted:发送ajax请求、启动定时器、绑定自定义事件、订阅消息等[初始化操作]。
2. beforeDestroy:清除定时器、解绑自定义事件、取消订阅消息等[收尾工作]。
  
**关于销毁Vue实例**
1. 销毁后借助Vue开发者工具看不到任何信息。
2. 销毁后自定义事件会失效，但原生DOM事件依然有效。如@click
3. 一般不会再beforeDestroy操作数据，因为即便操作数据，也不会再触发更新流程了。

## Vue组件
传统方式：
- 依赖关系混乱，不好维护
- 代码复用率不高

组件： 实现应用中局部功能代码和资源的集合

组件本质是一个构造函数,vue.extend生成，每次返回全新的VueComponent

### Vue 与 VueComponent的关系
![avatar](D:/NOTES/vuenotes/vueComponent.png)
```
<!-- vm ： Vue实例 vc: 组件实例-->
vm.__proto__ === vc.__proto__.__proto__ === Vue.prototype
vc.__proto__.__proto__.__proto === vm.__proto__ === Object.__proto__
```

## ref属性
- 被用来给元素或子组件注册引用信息(id的替代者)
- 应用在html标签上获取的是真实DOM元素，应用在组件标签上是组件实例对象(vc)

## props
props适用于：
子组件》》》父组件 （父给子一个函数）
父组件》》》子组件  通信
```
<School name="武汉理工大学" location="武汉" :age="100"></School>
<!-- **思考为什么用 :age 而不是 age** -->

  //简单声明接收
  props:['name', 'location'], 
  
  // 接收的同时限制类型
  props: {
    name: String,
    location: String,
    age: Number,
  },

  // 完整形式 类型限制+默认值指定+必要性限制
  props:{
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      default: 1
    },
  },
```
注意： 不要修改props传进来的值，可以复制一份到data中，再进行修改

## mixin混入
功能:可以把多个组件共用的配置提取成个混入对 象
使用方式:
第一步定义混合，例如:
```
{
  data()....,
  methods:{....}
}
```
第二步使用混入，例如:
```
(1).全局混入: Vue.mixin(xx)
(2).局部混入: mixins:[ 'xx']
```
## 插件
功能:用于增强Vue
本质:包含instal1方法的” 个对象，install的第 个参 数是Vue,第二个以后的参 数是插件使用者传递的数
据。
**定义插件:**
```
对象. install = function (Vue, options) {
//1..添加全局过滤器
Vue. filter(....)
//2..添加全局指令
Vue . directive(....)
// : 3.，配置全局混入(合)
Vue . mixin(....)
// : 4.，添加实例方法
Vue . prototype . $myMethod = function () {...}
Vue . prototype . $myProperty = xxx
}
使用插件: Vue . use()
```

## 组件编码流程
1. 实现静态组件:抽取组件，使用组件实现静态页面效果、
2. 展示动态数据:
  2.1. 数据的类型、名称是什么?。
  2.2. 数据保存在哪个组件?。
    一个组件用，放在自身
    一堆组件用，放在共同的父组件上
3. 交互一从绑定事件监听开始。

使用v-model绑定的值不能是props传过来的值

## 浏览器本地存储

## 自定义事件
子组件中触发 this.$emit  触发自定义事件
this.$off('事件名') 解绑

绑定自定义事件
- @事件名="方法或者解析式"
- 组件上设置ref属性，mounted中，
```
mounted() {
  this.$refs.name('自定义事件名',触发的方法(, 传递的参数（可选）))
}
```
![avatar](vuenotes/自定义事件.png)

## 全局事件总线
1. 种组件间通信的方式，适用于任意组件间通信。
2. 安装全局事件总线:
```
new Vue({
  beforeCreate() {
    Vue. prototype.$bus = this 
  },
})
```
3. 使用事件总线:
- 接收数据: A组件想接收数据，则在A组件中给$bus绑定自定义事件,事件的回调留在A组件自身。
```
methods(){
  demo(data){.....}
}
mounted() {
  this.$bus.$on('xxxx', this.demo)
}
```
- 提供数据: ``this.$bus.$emit('xxxx',数据)``
4. 最好在beforeDestroy钩子中,用$of去解绑当前组件所用到的事件。

## 消息订阅与发布
pubsub-js

1. -种组件间通信的方式，适用于任意组件间通信。
2.使用步骤:
1.安装pubsub: npm i pubsub-js
2.引入: import pubsub from ' pubsub-js'
3.接收数据: A组件想接收数据，则在A组件中订阅消息，订阅的回调留在A组件自身。
```
   methods(){
     demo(data){.....}
   },
   mounted() {
     this.pid = pubsub.subscribe('xx', this.demo) //订阅消息
   }
   <!-- 也可以直接写成回调，写成function函数形式的话，该函数内部this并不指向vueComponent -->
```
4.提供数据: ``pubsub.publish('xx' ,数据) ``
5.最好在beforeDestroy钩子中，用``pubsub.unsubscribe(pid)``取消订阅。

## $nextTick
1. 语法: this. $nextTick(回调函数)
2. 作用:在下一次DOM更新结束后执行其指定的回调。
3. 什么时候用:当改变数据后，要基于更新后的新DOM进行某些操作时，要在nextTick所指定的回调函数中执行。

## 插槽
1.作用:让父组件可以向子组件指定位置插入html结构，也是一种组件间通信的方式，适用于父组件===>子组件。
2.分类:默认插槽、具名插槽、作用域插槽
3.使用方式:

1.默认插槽: 
```
父组件中:
<Category>
  <div>htm1结构1</div>
</Category>

子组件中:
<template>
   <div>
      <!--定义插槽-->
      <slot>插槽默认内容...</slot>
   </div>
</template>
```

2. 具名插槽
```
父组件中:
<Category>
   <template slot="center">
      <div>html结构1<idiv>
   </template>

   <template v-slot:footer>
      <div>htm1结构2</div>
   </template>
</Category>

子组件中:
<template>
   <div>
      <!--定义插槽-->
      <slot name= "center" >插槽默认内容...</slot>
      <slot name="footer" >插槽默认内容...</slot>
   </div>
</template>
```
3. 作用域插槽:
理解:数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定。(games数据在Category组件中， 但使用
数据所遍历出来的结构由Ap组件决定)
具体编码:
```
<!-- 父组件中: -->
<Category>
   <template scope="scopeData">
      <!--生成的是u1列表-->
      <u1>
         <li v-for="g in scopeData.games" :key="g">{{g}}</li>
      </ul>
   </template>
</Category>

<Category>
<!-- ES6写法 -->
   <template slot-scope="{games}">   //ES6解构赋值
      <!--生成的是h4标题-->
      <h4 v-for="g in games" :key="g">{{g}}</h4>
   </template>
**********************分割线*********************************
<!-- 传统写法 -->
   <template slot-scope=" scopeData">
      <!--生成的是h4标题-->
      <h4 v-for="g in scopeData.games" :key="g">{{g}}</h4>
   </template>
</Category>

<!-- 子组件中: -->
<template>
   <div>
      <slot :games="games"></slot>
   </div>
</template>

<script>
export default {
   name: 'Category',
   props:['title'],
   //数据在子组件自身
   data() {
      return {
         games:
         ['红色警戒',，穿越火线’，'劲舞团'，'超级玛丽']
   },
}
</script>

```

## v-router
### 路由的query参数
```
1.传递参数
<!--跳转并携带query参数，to的字符串写法 -->
<router- link :to="/home/message/detail?id=666&title=你好“>跳转</router-link>

<!--跳转并携带query参数，to的对象写法-->
<router- link
   :to="{
      path:'/home/message/detail',
      query:{
      id:666, 
      title: '你好'
      }
   }"
>跳转</router- link>
```
### params参数
1.配置路由,声明接收params参数
```
{
   path: ' /home',
   component :Home ,
   children:[
      {
         path: 'news' ,
         component: News
      },
      {
         component:Message,
         children:[
            {
               name: 'xiangqing',
               path: 'detail/:id/:title', //使用占位符声明接收params参数
               component: Detail
            }
         ]
      }
}
```
2. 传递参数
```
<!--跳转并携带params参数， to的字符串写法-->
<router- link :to= "/home/ message/ detail/666/你好”>跳转</router- link>

<!--跳转并携带params参数， to的对象写法-->
<router-link
   :to="{
      name: 'xiangqing',
      params: {
         id:666 ,
         title:'你好'
    }
>跳转</router-link>
```

**注意：**：路由携带params参数时，若使用to的对象写法,则不能使用path配置项, 必须使用name配置!

3. 路由的props配置
```
作用:让路由组件更方便的收到参数
{
name: ' xiangqing' ,
path: 'detail/:id',
component :Detail,
//第一种写法: props值为对象， 该对象中所有的key-value的组合最終都会通过props传给Detail组件
// props:{a:900}

//第二种写法: props值为布尔值，布尔值为true, 则把路由收到的所有par ams参数通过props传给Detail组件

// props:true
//第三种写法: props值为函数， 该函数返回的对象中每一组key-value都会 通过props传给Detail组件
props(route){|
   return
      id: route.query.id,
      title :route.query.title
   }
}
```
4. router-link 的 replace
```
 <router-link>的replace属性
1.作用:控制路由跳转时操作浏览器历史记录的模式
2.浏览器的历史记录有两种写入方式:分别为push和replace，push 是追加历史记录，replace 是替换当前记录。路由跳转时候
默认为push
3.如何开启replace模式: <router-link replace ...... >News</router-link>

```
5. 编程式路由导航
```
//$router的两个API
this . $router . push({
   name: 'xiangqing' ,
   params:{
      id:xx,
      title: xXx 
   }
})

this. $router.replace({
   name: 'xiangqing' ,
   params:{
      id:xxx,
      title:xxx
   }
})
```
6. keep-alive
```
<keep-alive include=['aaa', 'bbb']>
</keep-alive>
```
7. 两个新的生命周期钩子
- 作用:路由组件所独有的两个钩子，用于捕获路由组件的激活状态。
- 具体名字:
  activated  路由组件被激活时触发。  deactivafed  路由组件失活时触发。

8. 路由守卫
1.作用:对路由进行权限控制
2.分类:全局守卫、独享守卫、组件内守卫
3.全局守卫: 
```
//全局前置守卫，初始化时执行、每次路由切换前执行
router.beforeEach((to, from, next) => {
   console. log( ' beforeEach' ,to, from)
   if(to. meta. isAuth){ //判断当前路由是否需要进行权限控制
      if(localStorage.getItem('school') == 'atguigu'){ //权限控制的具体规则
      next() //放行
   }else{
      alert('暂无权限查看')
      // next({name: ' guanyu'})
      }else{
      next() //放行
   }
   //全局后置守卫:初始化时执行、每次路由切换后执行
   router.afterEach((to, from)=>{
      console.log('afterEach', to, from)
      if(to . meta. title){
         document. title = to.meta.title //修改网页的title
   }else{
      document. title = 'vue _test '
   }
})
```
9. 独享路由守卫
  beforeEnter


