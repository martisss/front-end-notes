## useReducer
```js
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => {
        dispatch({
          type: 'step',
          step: Number(e.target.value)
        });
      }} />
    </>
  );
}
```
**React会保证dispatch在组件的声明周期内保持不变。所以上面例子中不再需要重新订阅定时器。**

effect和step状态解耦。effect不再关心怎么更新状态，它只负责告诉我们发生了什么。更新的逻辑全都交由reducer去统一处理:
```js
const initialState = {
  count: 0,
  step: 1,
};

function reducer(state, action) {
  const { count, step } = state;
  if (action.type === 'tick') {
    return { count: count + step, step };
  } else if (action.type === 'step') {
    return { count, step: action.step };
  } else {
    throw new Error();
  }
}
```

以下代码可以正常运行，但这样并不好，思考为什么？
```js
function SearchResults() {
  const [data, setData] = useState({ hits: [] });

  async function fetchData() {
    const result = await axios(
      'https://hn.algolia.com/api/v1/search?query=react',
    );
    setData(result.data);
  }

  useEffect(() => {
    fetchData();
  }, []); // Is this okay?

  // ...
```

在之后的迭代过程中，可能会对fetchData拆分，或是增加某些功能，其中的函数使用了某些state或者prop，但是**忘记更新使用这些函数的effects的依赖，effects就不会同步props和state带来的变更**。


**解决方案**:
如果某些函数仅在effect中调用，可以把它们的定义移到effect中：
```js
function SearchResults() {
  // ...
  useEffect(() => {
    // We moved these functions inside!
    function getFetchUrl() {
      return 'https://hn.algolia.com/api/v1/search?query=react';
    }
    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, []); //  Deps are OK
  // ...
}
```

但是这样带来的问题是如果有多个effect想要使用同一个getFetchUrl，那么同一份代码可能会要复制多次。简而言之，可以解决问题，但不够优雅，复用性不强。
但是如果将getFetchUrl直接作为依赖项，由于每次渲染函数都会不同，因此这样的依赖并不能解决问题。
解决手段有两个：
1. 将没有使用组件内任何值的函数放到组件外定义，这样就可以在effects自由使用该函数；
  不再需要把它设为依赖，因为它们不在渲染范围内，因此不会被数据流影响
2. 将该函数用useCallback包装一下
```js
function SearchResults() {
  const getFetchUrl = useCallback((query) => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, []); 

  useEffect(() => {
    const url = getFetchUrl('react');
    // ... Fetch data and do something ...
  }, [getFetchUrl]); 

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... Fetch data and do something ...
  }, [getFetchUrl]); 

  // ...
}
```
特别地，如果query是从组件状态中读取
```js
  const [query, setQuery] = useState('react');

  // ✅ Preserves identity until query changes
  const getFetchUrl = useCallback(() => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, [query]);  // ✅ Callback deps are OK
```
对于通过属性从父组件传入的函数
```js
function Child({ fetchData }) {
  let [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]); 
```
**在class组件中，函数属性本身并不是数据流的一部分。组件的方法中包含了可变的this变量导致我们不能确定无疑地认为它是不变的。因此，即使我们只需要一个函数，我们也必须把一堆数据传递下去仅仅是为了做“diff”。我们无法知道传入的this.props.fetchData 是否依赖状态，并且不知道它依赖的状态是否改变了。**