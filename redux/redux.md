# Redux基本使用

## 创建store

```jsx
import {createStore} from 'redux'
const initialState  ={
  count: 0
}

function reducer(state=initialState, action) {
  console.log('reducer', state, action);
  switch(action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      };
    case 'DECREMENT':
      return {
        count: state.count - 1
      };
    case 'RESET':
      return {
        count: 0
      };
    default:
      return state;
  }
}

const store = createStore(reducer);
```

### reducer

action是个具有type属性的普通对象

- reducer 绝不能返回 undefined

- Reducers 必须是纯函数

  > 不要改变函数作用域以外的变量，不要调用其他会改变的函数
  >
  > fetch, 改变state，dispatch

为了避免state以不可预测的方式更改，有以下规则：

- State 是只读的，唯一修改它的方式是 actions。

- 更新的唯一方式：dispatch(action) -> reducer -> new state。

- Reducer 函数必须是“纯”的 —— 不能修改它的参数，也不能有副作用（side effect）。



## 连接react 与 Redux

react-redux是react与react-redux之间的桥梁，通过react-redux提供的Provider组件与connect函数使得每个组件都能够访问store, Provider组件提层基于context

```jsx
import { Provider } from 'react-redux'
const App = () => (
  <div>
    <Provider store={store}>
      <Counter />
    </Provider>
  </div>
);
```

## 连接组件与Redux

组件底部加入：

```js
function mapStateToProps(state) {
  return {
    count: state.count
  };
}

export default connect(mapStateToProps)(Counter)
```

`Connect` 做的是在 Redux 内部 hook，取出整个 state，然后把它传进你提供的 `mapStateToProps` 函数，它是个自定义函数

`mapStateToProps` 返回的对象以 props 形式传给了你的组件。没有 `mapStateToProps` 函数，`connect` 不会传递任何 state。

## 抽象

### action生成器

action.js

```js
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";

export function increment() {
  return { type: INCREMENT };
}

export const decrement = () => ({ type: DECREMENT });

```

使用

```js
  increment = () => {
    this.props.dispatch(increment()); // << 在这使用 dispatch需要的上一个对象而不是函数
  };
```



### mapDispatchToProps

action.js

```js
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";

export function increment() {
  return { type: INCREMENT };
}

export const decrement = () => ({ type: DECREMENT });

```

组件Counter.js

```js
import { increment, decrement } from './actions';
...
...
  increment = () => {
    // 我们可以调用 `increment` prop,
    // 它会 dispatch action:
    this.props.increment();
  }
...
...
// 在这个对象中, 属性名会成为 prop 的 names,
// 属性值应该是 action 生成器函数.
// 它们跟 `dispatch` 绑定起来.
const mapDispatchToProps = {
  increment,
  decrement
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

```

## 使用 Redux Thunk 获取数据

```sh
npm install --save redux-thunk
```

reducers 应该是“纯”的，我们不能做在 reducer 里面做任何 API 调用或者 dispatch actions。

也不能在 action 生成器里面做这些事！

Redux 只接受**简单对象**作为 actions。

thunk是一个返回值为函数而非简单 action 对象的 action 生成器



Action 生成器返回的函数接收两个参数：`dispatch` 函数和 `getState`。

大多数场景只需要 `dispatch`，但有时你想根据 Redux state 里面的值额外做些事情。这种情况下，调用 `getState()` 你就会获得整个 state 的值然后按需所取。

```js
function doStuff() {
  return function(dispatch, getState) {
    // 在这里 dispatch actions
    // 或者获取数据
    // 或者该干啥干啥
  }
}
```

### 使用

```js
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
...
...
const store = createStore(reducer, applyMiddleware(thunk))
```

假设有多个`reducer`,每个处理各自的state，用`rootReducer.js`将各个reducer聚合在一起

> productsReducer.js

```js
import {
  FETCH_PRODUCTS_BEGIN,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE
} from './productActions';

const initialState = {
  items: [],
  loading: false,
  error: null
};

export default function productsReducer(state=initialState, action){
  switch(action.type) {
    case FETCH_PRODUCTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: false
      }
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.products
      }
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    default:
      return state
  }
}


```



> rootReducer.js

```js
import products from './productsReducer'
import { combineReducers } from 'redux'
// ...一些其他的reducer

export default combineReducers({
  products,
  // ...其他的reducer
})
```

> index.js

```js
....
....
const store = createStore(rootReducer, applyMiddleware(thunk));
....
....
```

> productsAction.js

```js
const FETCH_PRODUCTS_BEGIN = 'FETCH_PRODUCTS_BEGIN'
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_LOADING'
const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE'

export const fetchProductsBegin = () => {
  return {
    type: FETCH_PRODUCTS_BEGIN
  }
}
export const fetchProductsSuccess = products => {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: { products }
  }
}
export const fetchProductsFAILURE = error => {
  return {
    type: FETCH_PRODUCTS_FAILURE,
    payload: { error }
  }
}

export const fetchProducts = () => {
  return dispatch => {
    dispatch(fetchProductsBegin())
    fetch('/products')
      .then(res => res.json)
      .then(json => {
        dispatch(fetchProductsSuccess(json.products))
        return json.products
      })
      .catch(err => dispatch(fetchProductsFAILURE(err)))
  }
}

```