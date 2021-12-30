# 盒模型



## 1. js获取盒模型的宽高

第一种：

dom.style.width/height

这种方法只能获取使用内联样式的元素的宽和高。

- 第二种：

dom.currentStyle.width/height

这种方法获取的是浏览器渲染以后的元素的宽和高，无论是用何种方式引入的css样式都可以，但只有IE浏览器支持这种写法。

- 第三种：

window.getComputedStyle(dom).width/height

这种方法获取的也是浏览器渲染以后的元素的宽和高，但这种写法兼容性更好一些。

- 第四种：

dom.getBoundingClientRect().width/height

## 2. 去除inline-block元素间间距的方法

1. 去除html中的空格

2. 去除闭合标签的后半部分

3. font-size : 0

   > ```js
   > .space {
   > 		font-size: 0
   > 	}
   > .space a {
   >     display: inline-block;
   >     padding: .5em 1em;
   >     background-color: #cad5eb;
   > 		font-size: 17px;
   > }
   > ```
   >
   > 

4. letter-spacing || word-spacing

    > ```
    > .space {
    >     word-spacing: -6px;
    > }
    > .space a {
    >     word-spacing: 0;
    > }
    > ```

    > ```
    > .space {
    >     letter-spacing: -3px;
    > }
    > .space a {
    >     letter-spacing: 0;
    > }
    > ```

## 3. 行内元素的padding, margin

**影响左右，不影响上下**, **行内元素（inline-block）的padding左右有效** ，但是由于**设置padding上下不占页面空间，无法显示效果，所以无效**。 但注意，背景色会覆盖上面的内容

## 4. 什么是BFC？BFC的原理? 创立条件？使用场景？清除浮动方法？

BFC就是“块级格式化上下文”的意思， 决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。通俗的讲，就是一个特殊的块，内部有自己的布局方式，不受外边元素的影响。

原理：

- 内部的Box会在垂直方向上一个接一个的放置

- 垂直方向上的距离由margin决定。（完整的说法是：属于同一个BFC的两个相邻Box的margin会发生重叠（塌陷），与方向无关。）

- 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）

- BFC的区域不会与float的元素区域重叠

- 计算BFC的高度时，浮动子元素也参与计算

- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然

成立条件：

float属性不为none

position属性为absolute或fixed

display属性为inline-block、table-cell、table-caption、flex、inline-flex

overflow属性不为visible（- overflow: auto/ hidden;）

使用场景：

1. 可以用来自适应布局。

2. 可以清除浮动：（塌陷问题）

3. 解决垂直边距重叠：

清除浮动方法：

1. 额外标签法（在最后一个浮动标签后，新加一个标签，给其设置clear：both；）（不推荐）

2. 父级添加overflow属性（父元素添加overflow:hidden）（不推荐）， 触发bfc

3. 使用after伪元素清除浮动（推荐使用）

```html

.clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
}
.clearfix{
    *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
 
<body>
    <div class="fahter clearfix">
        <div class="big">big</div>
        <div class="small">small</div>
        <!--<div class="clear">额外标签法</div>-->
    </div>
    <div class="footer"></div>
</body>

```

4. 使用before和after双伪元素清除浮动

```html
 .clearfix:after,.clearfix:before{
    content: "";
    display: table;
}
.clearfix:after{
    clear: both;
}
.clearfix{
    *zoom: 1;
}
 
 <div class="fahter clearfix">
        <div class="big">big</div>
        <div class="small">small</div>
    </div>

 <div class="footer"></div>
复制代码
```

优点：代码更简洁

缺点：用zoom:1触发hasLayout.

推荐使用

5. 浮动父元素

```html
img{
  width:50px;
  border:1px solid #8e8e8e;
  float:left;
}
<div style="float:left">
  <img src="images/search.jpg"/>
  <img src="images/tel.jpg"/>
  <img src="images/weixin.png"/>
  <img src="images/nav_left.jpg"/>
</div>
复制代码
```

这种方式也不推荐，了解即可。


