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

