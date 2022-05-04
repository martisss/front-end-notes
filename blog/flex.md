## 前置知识

## flex缩写

面试案例

## 双列布局

##　三列布局

## flex grow 与 flex wrap

实现关键代码：

```css
ul {
  display: flex;
  flex-wrap: wrap;
  margin: 2vmin;
}

li {
  height: 30vh;
  flex-grow: 1;
  margin: 2vmin;
}
```



##　flex-order 与 flex-basis

**html:**

```js
  <div class="wrapper">
    <header class="header">Header</header>
    <article class="main">
      <p>掘金是一个帮助开发者成长的社区,是给开发者用的 Hacker News,给设计师用的 Designer News,和给产品经理用的 Medium。</p>  
    </article>
    <aside class="aside aside-1">Aside 1</aside>
    <aside class="aside aside-2">Aside 2</aside>
    <footer class="footer">Footer</footer>
  </div>
```

**css:**

```css
  .wrapper {
    display: flex;
    flex-flow: row wrap;
    font-weight: bold;
    text-align: center; 
  }
  .wrapper > * {
    flex: 1 100%; 
    padding: 10px;
  }

  @media all and (min-width: 700px) {
    .aside {
      flex: 1 auto;
    }
  }

  @media all and (min-width: 900px) {
    .main    { flex: 3 0px; }
    .aside-1 { order: 1; } 
    .main    { order: 2; }
    .aside-2 { order: 3; }
    .footer  { order: 4; }
  }
```





