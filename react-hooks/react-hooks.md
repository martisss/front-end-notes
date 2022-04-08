## useState

适用于与DOM状态改变相关的变量

jsx语法 用声明式方式描述数据与UI的关系

## useEffect
:question: 函数体也是每次 render 都会执行，那么，需要每次都会 render 执行的语句是放在 无依赖的 useEffect 中呢，还是直接放在函数体中比较好呢？
- :raised_hands:  这两种情况的语义是不一样的。**useEffect 代表副作用，是在函数 render 完后执行。而函数体中的代码，是直接影响当次 render 的结果。副作用一定是和当前 render 的结果没关系的，而只是 render 完之后做的一些额外的事情。**
  <br>

- 每次副作用执行，都会返回一个新的clear函数, **clear函数会在DOM渲染完成之后,下一次副作用逻辑之前执行**

- **组件销毁也会执行一次**

:question: 两种写法的异同
```js
const handleIncrement = useCallback(() => setCount(count + 1), [count]);


const handleIncrement = useCallback(() => setCount(q => q + 1), []);
```

- :raised_hands: 后者是更好的写法，因为 handleIncrement 不会每次在 count 变化时都使用新的。从而接收这个函数的组件 props 就认为没有变化，避免可能的性能问题。但是有时候如果 DOM 结构很简单，其实怎么写都没什么影响。但两种代码实际上都是每次创建函数的，只是第二种写法后面创建的函数是被 useCallback 忽略的。所以这里也看到了 setState 这个 API 的另外一种用法，就是可以接收一个函数作为参数：setSomeState(previousState => {})。这样在这个函数中通过参数就可以直接获取上一次的 state 的值了，而无需将其作为一个依赖项。这样做可以减少一些不必要的回调函数的创建。

如果在useEffect中调用了一些函数，如果只在这其中调用，可以考虑将其定义到useEffect中，如果该函数中使用了state, props，那么也要把相应的依赖放进依赖数组中；

如果该函数没有使用prop或者state中的值，也可以考虑将其提到组件之外定义，或者将其用useCallback包裹

## Hooks检查
```shell
npm install eslint-plugin-react-hooks --save-dev
```
ESLint 配置文件中加入两个规则：rules-of-hooks 和 exhaustive-deps。如下：
```js

{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    // 检查 Hooks 的使用规则
    "react-hooks/rules-of-hooks": "error", 
    // 检查依赖项的声明
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## useMemo
避免重复计算，避免子组件的重复渲染
## useCallback
## useRef
- ref 的值发生变化时，是不会触发组件的重新渲染的
- ref 的值发生变化时，是不会触发组件的重新渲染的

## useReduer

**当你想更新一个状态，并且这个状态更新依赖于另一个状态的值时，你可能需要用`useReducer`去替换它们。**

## 对比类组件生命周期
componentDidMount,componentWillUnmount，和 componentDidUpdated **大致可以**对应useEffect，但不是完全对应
原因如下：
- useEffect(callback) 这个 Hook 接收的 callback，只有在依赖项变化时才被执行。
  - 而传统的 componentDidUpdate 则一定会执行。这样来看，Hook 的机制其实更具有语义化
  - 过去在 componentDidUpdate 中，我们通常都需要手动判断某个状态是否发生变化，然后再执行特定的逻辑。
- callback 返回的函数（一般用于清理工作）在下一次依赖项发生变化以及组件销毁之前执行，而传统的 componentWillUnmount **只在组件销毁时才会执行。**

注：useEffect 第二个参数传入空，就只在组件初始化时和销毁前分别执行一次

类比 componentWillMount
```jsx

import { useRef } from 'react';

// 创建一个自定义 Hook 用于执行一次性代码
function useSingleton(callback) {
  // 用一个 called ref 标记 callback 是否执行过
  const called = useRef(false);
  // 如果已经执行过，则直接返回
  if (called.current) return;
  // 第一次调用时直接执行
  callBack();
  // 设置标记为已执行过
  called.current = true;
}


```
## 自定义hooks的四个典型使用场景
基于state的改变会导致函数组件的重新执行这一特性

自定义hook能够跟随函数组件重复执行，并且每次都返回最新结果。

因此，我们可以非常放心大胆的封装异步逻辑。

### hooks优点：

更好地体现了 React 的开发思想，即从 State => View 的函数式映射。此外， Hooks 也解决了 Class 组件存在的一些代码冗余、难以逻辑复用的问题。
- 简化了逻辑复用
  - 没有hooks之前要想实现逻辑复用 必须依赖高洁组件，这样带来的问题是：高阶组件会产生冗余的组件节点，让调试变得困难
- 有助于关注点分离
  - 在类组件中，业务逻辑代码是分散在各个生命周期方法中的，代码是从技术角度组织在一起的，而在函数组件中代码是从业务角度组织在一起的
### 自定义Hooks两个特点
- 名字以use开头
- 函数内部调用了其他Hooks
### 典型应用场景
#### 抽取业务逻辑
```js

import { useState, useCallback }from 'react';
 
function useCounter() {
  // 定义 count 这个 state 用于保存当前数值
  const [count, setCount] = useState(0);
  // 实现加 1 的操作
  const increment = useCallback(() => setCount(count + 1), [count]);
  // 实现减 1 的操作
  const decrement = useCallback(() => setCount(count - 1), [count]);
  // 重置计数器
  const reset = useCallback(() => setCount(0), []);
  
  // 将业务逻辑的操作 export 出去供调用者使用
  return { count, increment, decrement, reset };
}

/* *************************************************************** */
import React from 'react';

function Counter() {
  // 调用自定义 Hook
  const { count, increment, decrement, reset } = useCounter();

  // 渲染 UI
  return (
    <div>
      <button onClick={decrement}> - </button>
      <p>{count}</p>
      <button onClick={increment}> + </button>
      <button onClick={reset}> reset </button>
    </div>
  );
}
```
#### 封装通用逻辑
```js

import React from "react";

export default function UserList() {
  // 使用三个 state 分别保存用户列表，loading 状态和错误状态
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // 定义获取用户的回调函数
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://reqres.in/api/users/");
      const json = await res.json();
      // 请求成功后将用户数据放入 state
      setUsers(json.data);
    } catch (err) {
      // 请求失败将错误状态放入 state
      setError(err);
    }
    setLoading(false);
  };

  return (
    <div className="user-list">
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? "Loading..." : "Show Users"}
      </button>
      {error && 
        <div style={{ color: "red" }}>Failed: {String(error)}</div>
      }
      <br />
      <ul>
        {users && users.length > 0 &&
          users.map((user) => {
            return <li key={user.id}>{user.first_name}</li>;
          })}
      </ul>
    </div>
  );
}
```
将以下逻辑抽离出来
1. 创建 data，loading，error 这 3 个 state；
2. 请求发出后，设置 loading state 为 true；
3. 请求成功后，将返回的数据放到某个 state 中，并将 loading state 设为 false；
4. 请求失败后，设置 error state 为 true，并将 loading state 设为 false。
```js
import { useState } from 'react'

const useAsyncFunction = (asyncFunction) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const execute = useCallback(
    () => {
      setLoading(true)
      setError(null)
      setData(null)
      asyncFunction()
        .then((Response) => {
          setData(Response)
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    },
    [asyncFunction],
  )
  return { execute, loading, data, error }
}
```
使用新hooks之后的userList
```js
import React from "react";

export default function UserList() {
  const { 
    execute: fetchUsers,
    data: users,
    loading,
    error
  } = useAsyncFunction( async () => {
    const res = await fetch('https://request/api/1234')
    const json = await res.json()
    return json.data
  })

  return (
    ...
  );
}
```

#### 监听浏览器状态
```js

import React, { useCallback } from 'react';
import useScroll from './useScroll';

function ScrollTop() {
  const { y } = useScroll();

  const goTop = useCallback(() => {
    document.body.scrollTop = 0;
  }, []);

  const style = {
    position: "fixed",
    right: "10px",
    bottom: "10px",
  };
  // 当滚动条位置纵向超过 300 时，显示返回顶部按钮
  if (y > 300) {
    return (
      <button onClick={goTop} style={style}>
        Back to Top
      </button>
    );
  }
  // 否则不 render 任何 UI
  return null;
}

```
#### 拆分复杂组件
拆分逻辑的目的不一定是为了重用，而可以是仅仅为了业务逻辑的隔离。所以在这个场景下，我们不一定要把 Hooks 放到独立的文件中，而是可以和函数组件写在一个文件中。这么做的原因就在于，这些 Hooks 是和当前函数组件紧密相关的，所以写到一起，反而更容易阅读和理解。
**需求**  
- 展示一个博客文章的列表，并且有一列要显示文章的分类。
- 我们还需要提供表格过滤功能，以便能够只显示某个分类的文章。
  - 为了支持过滤功能，后端提供了两个 API：一个用于获取文章的列表，另一个用于获取所有的分类。这就需要我们在前端将文章列表返回的数据分类 ID 映射到分类的名字，以便显示在列表里。


**把 Hooks 就看成普通的函数，能隔离的尽量去做隔离，从而让代码更加模块化，更易于理解和维护。**
```js
把 Hooks 就看成普通的函数，能隔离的尽量去做隔离，从而让代码更加模块化，更易于理解和维护。
```
## 全局状态管理：redux
### redux store特点
- 全局唯一
- 树状结构

```js
import { createStore } from "redux"
const initialState = { value: 0}

function counterReducer (state = initialState, action) {
  switch(action.type) {
    case "increment":
      return {
        ...state,
        value: state.value + action.step
      }
    case 'decrement':
      return {
        ...state,
        value: state.value - action.step
      }
    case 'reset':
      return {
        ...state,
        value: 0
      }
  }
}

store.subscribe(() => console.log(store.getState()))
const store = createStore(counterReducer)
const incrementAction = {type: 'increment', step: 2}
const decrementAction = {type: 'decrement', step: 1}
store.dispatch(incrementAction)
store.dispatch(decrementAction)
```

### 在react中使用redux
在 react-redux 的实现中，为了确保需要绑定的组件能够访问到全局唯一的 Redux Store，利用了 React 的 Conext 机制去存放 Store 的信息。通常我们会将这个 Context 作为整个 React 应用程序的根节点。
```js

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```
之后就可以使用useSelector和useDispatch这两个hook
```js

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```
### 使用Redux处理异步逻辑
使用Middlewares（中间件），使用redux-thunk
```js

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducer'

const composedEnhancer = applyMiddleware(thunkMiddleware)
const store = createStore(rootReducer, composedEnhancer)
```
```js

function fetchData() {
  return dispatch => {
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }
}
```
dispatch 一个函数用于来发送请求，通常，我们会写成如下的结构：
```js

import fetchData from './fetchData';

function DataList() {
  const dispatch = useDispatch();
  // dispatch 了一个函数由 redux-thunk 中间件去执行
  dispatch(fetchData());
}
```

## 08 复杂状态管理：保证状态一致性
### 保证状态最小化
在定义一个状态时，要问问自己这个状态是否能够通过其他状态计算得到，如果可以，那么可以用useMemo去缓存这个数据，而不是去重新定义一个新的状态，虽然这样最终也能解决问题，但是却加大了状态管理的难度。保证状态最小化这一原则在面对复杂场景时显得尤为重要
### 避免中间状态，确保唯一数据源
如果某个状态有多个数据来源，那么就要尽量避免设置这样的中间状态，保证数据来源的唯一性
![image.png](https://i.loli.net/2021/09/18/uTB5LQ6zkocxsUY.png)

## 09 异步处理：向服务器发送请求
### 实现自己的API client
```js
import axios from 'axios'

// 定义相关的endpoints
const endpoints = {
  test:'xxx',
  prod:'xxx',
  staging: 'xxx',
}

// 创建axios 实例
const instance  = axios.create({
  baseURL: endpoints.test,
  timeout: 30000,
  headers: { Authorization: 'xxxx'}
})

// 通过axios定义拦截器预处理所有请求
instance.interceptors.response.use(
  (res) => {
    //定义请求成功的逻辑
    return res
  },
  (err) => {
    if(err.response.status === 403) {
      // 定义 处理未授权的请求，比如跳转到登录界面
      document.location = '/login'
    }
    return Promise.reject(err)
  }
)

export default instance
```
请求文章数据的逻辑
```js
import { useState, useEffect } from 'react' 
import apiClient from './apiClient'
const useArticle = (id) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  useEffect(() => {
    setData(null)
    setLoading(true)
    setErr(null)
    apiClient
      .get(`/posts/${id}`)
      .then((res) => {
        setLoading(false)
        setData(res.data)
      })
      .catch((err) => {
        setErr(err)
        setLoading(false)
      })
  }, [id])
  return {loading, data, err }
}
```
在文章的展示页面：
```js

import { useState } from "react";
import CommentList from "./CommentList";
import useArticle from "./useArticle";
import useUser from "./useUser";
import useComments from "./useComments";

const ArticleView = ({ id }) => {
  const { data: article, loading, error } = useArticle(id);
  const { data: comments } = useComments(id);
  const { data: user } = useUser(article?.userId);    //可选链
  if (error) return "Failed.";
  if (!article || loading) return "Loading...";
  return (
    <div className="exp-09-article-view">
      <h1>
        {id}. {article.title}
      </h1>
      {user && (
        <div className="user-info">
          <img src={user.avatar} height="40px" alt="user" />
          <div>{user.name}</div>
          <div>{article.createdAt}</div>
        </div>
      )}
      <p>{article.content}</p>
      <CommentList data={comments || []} />
    </div>
  );
};
```

### 多个api调用：并行 串行请求
主要的实现思路就包括下面这么四点：
- 组件首次渲染，只有文章 ID 这个信息，产生两个副作用去获取文章内容和评论列表；
- 组件首次渲染，作者 ID 还不存在，因此不发送任何请求；
- 文章内容请求返回后，获得了作者 ID，然后发送请求获取用户信息；
- 展示用户信息。

对比上面的 useArticle 这个 Hook，唯一的变化就是在 useEffect 里加入了ID 是否存在的判断
```js

import { useState, useEffect } from "react";
import apiClient from "./apiClient";

export default (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    // 当 id 不存在，直接返回，不发送请求
    if (!id) return;
    setLoading(true);
    setData(null);
    setError(null);
    apiClient
      .get(`/users/${id}`)
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, [id]);
  return {
    loading,
    error,
    data
  };
};

```

文章的 ID 已经传进来了，因此 useArticle 和 useComments 这两个 Hooks 会发出两个并发的请求，来分别获取信息。

而 userUser 这个 Hook 则需要等 article 内容返回后，才能获得 userId 信息，所以这是一个串行的请求：需要等文章内容的请求完成之后才能发起。


## 10 函数组件设计模式
## 容器模式

**:question: 什么是容器模式**
**把原来需要条件运行的 Hooks 拆分成子组件，然后通过一个容器组件来进行实际的条件判断，从而渲染不同的组件，实现按条件渲染的目的。这在一些复杂的场景之下，也能达到拆分复杂度，让每个组件更加精简的目的。**

注：条件的隔离对象是多个子组件，这就意味着它**通常用于一些比较大块逻辑的隔离**。所以对于一些比较细节的控制，其实还有一种做法，就是**把判断条件放到 Hooks 中**去。
<br>
:question: **Hooks 必须在顶层作用域调用，而不能放在条件判断、循环等语句中，同时也不能在可能的 return 语句之后执行**
- :raised_hands: React 需要在函数组件内部维护所用到的 Hooks 的状态，所以我们无法在条件语句中使用 Hooks
- :question: 具体是怎么维护的呢？  //TODO
  

示例：
```js

// 定义一个容器组件用于封装真正的 UserInfoModal
export default function UserInfoModalWrapper({
  visible,
  ...rest, // 使用 rest 获取除了 visible 之外的属性
}) {
  // 如果对话框不显示，则不 render 任何内容
  if (!visible) return null; 
  // 否则真正执行对话框的组件逻辑
  return <UserInfoModal visible {...rest} />;
}
```
### 使用 render props 模式重用 UI 逻辑
- 在 Class 组件时期，render props 和 HOC（高阶组件）两种模式进行逻辑重用，但是实际上，HOC 的所有场景几乎都可以用 render props 来实现。可以说，**Hooks 是逻辑重用的第一选择。**
- **Hooks的局限性**：只能用作数据逻辑的重用，而一旦涉及 UI 表现逻辑的重用，就有些力不从心了，而这正是 render props 擅长的地方。

计数器demo的render props实现
```js

import { useState, useCallback } from "react";

function CounterRenderProps({ children }) {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  const decrement = useCallback(() => {
    setCount(count - 1);
  }, [count]);

  return children({ count, increment, decrement });
}
```
把计数逻辑封装到一个自己不 render 任何 UI 的组件中，那么在使用的时候可以用如下的代码：
```js

function CounterRenderPropsExample() {
  return (
    <CounterRenderProps>
      {({ count, increment, decrement }) => {
        return (
          <div>
            <button onClick={decrement}>-</button>
            <span>{count}</span>
            <button onClick={increment}>+</button>
          </div>
        );
      }}
    </CounterRenderProps>
  );
}
```
**注意**：完全也可以使用其它的属性名字，而不是 children。我们只需要把这个 render 函数作为属性传递给组件就可以
<br>
使用Hooks设计模式
```js

import { useState, useCallback }from 'react';
 
function useCounter() {
  // 定义 count 这个 state 用于保存当前数值
  const [count, setCount] = useState(0);
  // 实现加 1 的操作
  const increment = useCallback(() => setCount(count + 1), [count]);
  // 实现减 1 的操作
  const decrement = useCallback(() => setCount(count - 1), [count]);
  
  // 将业务逻辑的操作 export 出去供调用者使用
  return { count, increment, decrement };
}
```

**render props案例**
[显示一个列表，如果超过一定数量，则把多余的部分折叠起来，通过一个弹出框去显示。](https://codesandbox.io/s/react-hooks-course-20vzg?file=/src/10/ListWithMore.js)
分析： 每一个列表项具体如何渲染取决于使用场景
```js
import { Popover } from "antd";
import data from "./data";

function ListWithMore({ renderItem, data = [], max }) {
  const elements = data.map((item, index) => renderItem(item, index, data));
  const show = elements.slice(0, max);
  const hide = elements.slice(max);
  return (
    <span className="exp-10-list-with-more">
      {show}
      {hide.length > 0 && (
        <Popover content={<div style={{ maxWidth: 500 }}>{hide}</div>} trigger="click">
          <span className="more-items-wrapper">
            and{" "}
            <span className="more-items-trigger"> {hide.length} more...</span>
          </span>
        </Popover>
      )}
    </span>
  );
}


export default () => {
  return (
    <div className="exp-10-list-with-more">
      <h1>User Names</h1>
      <div className="user-names">
        Liked by:{" "}
        <ListWithMore
          renderItem={(user) => {
            return <span className="user-name">{user.name}</span>;
          }}
          data={data}z
          max={3}
        />
      </div>
      <br />
      <br />
      <h1>User List</h1>
      <div className="user-list">
        <div className="user-list-row user-list-row-head">
          <span className="user-name-cell">Name</span>
          <span>City</span>
          <span>Job Title</span>
        </div>
        <ListWithMore
          renderItem={(user) => {
            return (
              <div className="user-list-row">
                <span>{user.name}</span>
                <span>{user.city}</span>
                <span>{user.job}</span>
              </div>
            );
          }}
          data={data}
          max={5}
        />
      </div>
    </div>
  );
};
```
## 创建自定义事件
### 使用原生事件
只要原生 DOM 有的事件，在 React 中基本都可以使用，只是写法上采用骆驼体就可以了，比如 onMouseOver、onChange 等。
:question: 是否加useCallback?
  - 其实是否需要 useCallback ，和函数的复杂度没有必然关系，而是和回调函数绑定到哪个组件有关。这是为了避免因组件属性变化而导致不必要的重新渲染。而对于原生的 DOM 节点，比如 button、input 等，我们是不用担心重新渲染的。所以呢，如果你的事件处理函数是传递给原生节点，那么不写 callback，也几乎不会有任何性能的影响。
  - 但是如果你使用的是自定义组件，或者一些 UI 框架的组件，那么回调函数还都应该用 useCallback 进行封装。

### React原生事件的原理： 合成事件（synthetic Events）
:sparkle: **由于虚拟 DOM 的存在，在 React 中即使绑定一个事件到原生的 DOM 节点，事件也并不是绑定在对应的节点上，而是所有的事件都是绑定在根节点上。然后由 React 统一监听和管理，获取事件后再分发到具体的虚拟 DOM 节点上。**
原因：
- 虚拟 DOM render 的时候， DOM 很可能还没有真实地 render 到页面上，所以无法绑定事件。
- React 可以屏蔽底层事件的细节，避免浏览器的兼容性问题。同时，对于 React Native 这种不是通过浏览器 render 的运行时，也能提供一致的 API。

### 创建自定义事件
本质上就是传递一个回调函数
```js

import { useState } from "react";

// 创建一个无状态的受控组件
function ToggleButton({ value, onChange }) {
  const handleClick = () => {
    onChange(!value);
  };
  return (
    <button style={{ width: "60px" }} onClick={handleClick}>
      <span>{value ? "On" : "Off"}</span>
    </button>
  );
}
// **********************************************************

import { useState } from "react";
import ToggleButton from './ToggleButton';

function ToggleButtonExample() {
  const [on, setOn] = useState(true);
  return (
    <>
      <h1>Toggle Button</h1>
      <ToggleButton value={on} onChange={(value) => setOn(value)} />
    </>
  );
};
```
## 使用 Hooks 封装键盘事件
```js

import { useEffect, useState } from "react";

// 使用 document.body 作为默认的监听节点
const useKeyPress = (domNode = document.body) => {
  const [key, setKey] = useState(null);
  useEffect(() => {
    const handleKeyPress = (evt) => {
      setKey(evt.keyCode);
    };
    // 监听按键事件
    domNode.addEventListener("keypress", handleKeyPress);
    return () => {
      // 接触监听按键事件
      domNode.removeEventListener("keypress", handleKeyPress);
    };
  }, [domNode]);
  return key;
};
```
实现多个按键的监听
```js
export default function useKeyPress (dom = document.body) {
  const [key, setKey] = useState([])
  const isNext = useRef(true) // 当keyup之后，isNext置为true表示又是新一轮的按键监听
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.type === 'keydown') {
        if (isNext.current) setKey([])
        setKey(keys => [...new Set([...keys, e.key])]) // 去重
        isNext.current = false
      } else {
        isNext.current = true
      }
    }
    dom.addEventListener('keydown', handleKeyPress)
    dom.addEventListener('keyup', handleKeyPress)
    return () => {
      dom.removeEventListener('keydown', handleKeyPress)
      dom.removeEventListener('keydown', handleKeyPress)
    }
  }, [dom])
  return key.join(',')
}
```
## 项目结构组织
每增加一个新的功能，整个应用程序的复杂度不应该明显上升。这样才能保证我们的应用程序始终可扩展，可维护

## React中使用表单
- React是状态驱动，表单是事件驱动，需要将独立事件转换为应用程序的状态
- 表单内元素可能有自己的独立状态，比如input,这就需要在元素状态与表单状态之间做同步
### 受控组件
```js

function MyForm() {
  const [value, setValue] = useState('');
  const handleChange = useCallback(evt => {
    setValue(evt.target.value);
  }, []);
  return <input value={value} onChange={handleChange} />;
}
```
需要注意的是，React 统一了表单组件的 onChange 事件，这样的话，**用户不管输入什么字符，都会触发 onChange 事件**。而**标准的 input 的 onchange 事件**，则只有**当输入框失去焦点时才会触发**。

有时候却会产生性能问题。因为**用户每输入一个字符，React 的状态都会发生变化，那么整个组件就会重新渲染**。所以如果表单比较复杂，那么每次都重新渲染，就可能会引起输入的卡顿。在这个时候，我们就可以将一些表单元素使用非受控组件去实现，从而避免性能问题。

### 非受控组件
所谓非受控组件，就是表单元素的值不是由父组件决定的，而是完全内部的状态。联系第 8 讲提到的唯一数据源的原则，一般我们就不会再用额外的 state 去保存某个组件的值。而是在需要使用的时候，直接从这个组件获取值。
```js

import { useRef } from "react";

export default function MyForm() {
  // 定义一个 ref 用于保存 input 节点的引用
  const inputRef = useRef();
  const handleSubmit = (evt) => {
    evt.preventDefault();
    // 使用的时候直接从 input 节点获取值
    alert("Name: " + inputRef.current.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" ref={inputRef} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```
通过非受控组件的方式，input 的输入过程对整个组件状态没有任何影响，自然也就不会导致组件的重新渲染。不过缺点也是明显的，输入过程因为没有对应的状态变化，因此要动态地根据用户输入做 UI 上的调整就无法做到了。出现这种情况，主要也是因为所有的用户输入都是 input 这个组件的内部状态，没有任何对外的交互。

**总结**：在实际的项目中，我们一般都是用的受控组件，这也是 React 官方推荐的使用方式。不过对于一些个别的场景，比如对性能有极致的要求，那么非受控组件也是一种不错的选择。

### 使用 Hooks 简化表单处理
核心原理：**把表单的状态管理单独提取出来，成为一个可重用的 Hook**。这样在表单的实现组件中，我们就只需要更多地去关心 UI 的渲染，而无需关心状态是如何存储和管理的，从而方便表单组件的开发。
下方是一个简单示例：
```js

import { useState, useCallback } from "react";

const useForm = (initialValues = {}) => {
  // 设置整个 form 的状态：values
  const [values, setValues] = useState(initialValues);
  
  // 提供一个方法用于设置 form 上的某个字段的值
  const setFieldValue = useCallback((name, value) => {
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  }, []);

  // 返回整个 form 的值以及设置值的方法
  return { values, setFieldValue };
};
*********************************************************************

import { useCallback } from "react";
import useForm from './useForm';

export default () => {
  // 使用 useForm 得到表单的状态管理逻辑
  const { values, setFieldValue } = useForm();
  // 处理表单的提交事件
  const handleSubmit = useCallback(
    (evt) => {
      // 使用 preventDefault() 防止页面被刷新
      evt.preventDefault();
      console.log(values);
    },
    [values],
  );
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name: </label>
        <input
          value={values.name || null}
          onChange={(evt) => setFieldValue("name", evt.target.value)}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          value={values.email || null}
          onChange={(evt) => setFieldValue("email", evt.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

```
### 处理表单验证
遵循状态驱动这个原则：
- 首先：如何定义这样的错误状态；
- 其次：如何去设置这个错误状态。

给已有的 useForm 这个 Hook 增加验证的 API 接口：
```js


// 除了初始值之外，还提供了一个 validators 对象，
// 用于提供针对某个字段的验证函数
const useForm = (initialValues = {}, validators) => {
  const [values, setValues] = useState(initialValues);
  // 定义了 errors 状态
  const [errors, setErrors] = useState({});

  const setFieldValue = useCallback(
    (name, value) => {
      setValues((values) => ({
        ...values,
        [name]: value,
      }));

      // 如果存在验证函数，则调用验证用户输入
      if (validators[name]) {
        const errMsg = validators[name](value);
        setErrors((errors) => ({
          ...errors,
          // 如果返回错误信息，则将其设置到 errors 状态，否则清空错误状态
          [name]: errMsg || null,
        }));
      }
    },
    [validators],
  );
  // 将 errors 状态也返回给调用者
  return { values, errors, setFieldValue };
};
```
在使用的时候传递下面的 validators 对象给 useForm 这个 Hook
```js

function MyForm() {
  // 用 useMemo 缓存 validators 对象
  const validators = useMemo(() => {
    return {
      name: (value) => {
        // 要求 name 的长度不得小于 2
        if (value.length < 2) return "Name length should be no less than 2.";
        return null;
      },
      email: (value) => {
        // 简单的实现一个 email 验证逻辑：必须包含 @ 符号。
        if (!value.includes("@")) return "Invalid email address";
        return null;
      },
    };
  }, []);
  // 从 useForm 的返回值获取 errors 状态
  const { values, errors, setFieldValue } = useForm({}, validators);
  // UI 渲染逻辑...
}
```

