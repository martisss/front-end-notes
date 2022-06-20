## useDataApi

https://www.robinwieruch.de/react-hooks-fetch-data/

1. 使用useReducer进行状态管理
2. didCancel 标志位进行abort控制，放置组件卸载（切换到别的路由）之后继续发送请求。
3. 返回state和 setUrl， url变化，驱动副作用执行，重新获取数据

```js
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case `FETCH_INIT`:
        return {
          ...state,
          isLoading: true,
          isError: false
        }
    case `FETCH_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    default: 
      throw new Error()
  }
}

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};
```

app.jsx

```jsx
export default function App() {
  const [query, setQuery] = useState('redux');
  const [state, doFetch] = useDataApi('https://hn.algolia.com/api/v1/search?query=redux', { hits: [] });

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch(
            `http://hn.algolia.com/api/v1/search?query=${query}`,
          );

          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {state.isError && <div>Something went wrong ...</div>}

      {state.isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {state.data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}
```

## 请求用户列表-使用回调函数

```jsx

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
        {users.length > 0 &&
          users.map((user) => {
            return <li key={user.id}>{user.first_name}</li>;
          })}
      </ul>
    </div>
  );
}

```

## useEffect相关: 不能滥用useEffect

`Event handlers`是**「组件内部包含的函数」**，用于执行用户操作，可以包含`副作用`。

下面这些操作都属于`Event handlers`：

- 更新`input`输入框
- 提交表单
- 导航到其他页面

当我们编写组件时，应该尽量将组件编写为纯函数。

对于组件中的副作用，首先应该明确

是**「用户行为触发的」**还是**「视图渲染后主动触发的」**？

对于前者，将逻辑放在`Event handlers`中处理。

对于后者，使用`useEffect`处理。

## 使用useEffect时在开发模式下会执行两次

### 订阅事件之后要记得取消

```jsx
useEffect(() => {
  function handleScroll(e) {
    console.log(e.clientX, e.clientY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 触发动画后要重置为初始状态

```js
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

### 获取数据

放弃此次请求或者忽略请求的结果

#### 忽略请求结果

```jsx
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

