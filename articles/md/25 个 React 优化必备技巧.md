---
title: "25 个 React 优化必备技巧"
tag: "React"
time: 2024-11-23 22:25:19
---

## 一. 性能优化：编写高效、流畅的 React 应用

性能是任何应用成功的基石，尤其在 React 中，合理的性能优化能显著提升用户体验。以下技巧将帮助您编写高效、流畅的 React 应用：

### 1. 避免在组件内部声明或嵌套组件

虽然在组件内部声明或嵌套其他组件看起来很方便，但这会严重影响应用性能。 每次父组件因状态更新而重新渲染时，嵌套组件也会被重新创建，导致嵌套组件中之前声明的状态和数据丢失，从而造成性能问题。 为了避免这种情况，建议将组件声明独立出来，而不是嵌套在其他组件内部。

```jsx
// 错误的做法：
const UsersList = () => {
  // ❌ 在UsersList组件内部声明User组件
  const User = ({ user }) => {
    // 部分代码
    return <div>{/* User组件JSX */}</div>;
  };
  return <div>{/* UsersList组件JSX */}</div>;
};

// 正确的做法：
// ✅ 在UsersList组件外部声明User组件
const User = ({ user }) => {
  // 部分代码
  return <div>{/* User组件JSX */}</div>;
};

const UsersList = ({ users }) => {
  // 部分代码
  return <div>{/* UsersList组件JSX */}</div>;
};
```

### 2. 正确使用 useEffect 中的依赖项数组

`useEffect`钩子是 React 中处理副作用的重要工具，但如果不正确使用依赖项数组，很容易导致意想不到的 bug，例如闭包过时问题。 为了避免此类问题，请务必将`useEffect`内部引用的所有外部变量都包含在依赖项数组`[]`中。 这能确保`useEffect`只在相关依赖项发生变化时才执行，避免不必要的重新渲染和潜在的错误。

```jsx
useEffect(() => {
  const fetchData = (id) => {
    // 获取数据的代码
  };
  id && fetchData(id);
}, [id]);
```

### 3. 使用 useState 进行状态的延迟初始化

对于复杂的初始状态计算，如果在组件挂载前就执行，可能会影响应用的加载速度。`useState`允许您通过传入一个函数来延迟初始化状态，直到组件实际渲染时才进行计算。 这能确保复杂的计算不会阻塞应用的初始加载过程，从而提升用户体验。

```jsx
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    // 状态的延迟初始化
    try {
      const localValue = window.localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
```

### 4. 使用 useMemo 记忆化耗时函数

在 React 应用中，一些计算可能比较耗时，如果在每次渲染时都重复执行，就会降低应用的性能。`useMemo`钩子可以缓存耗时函数的计算结果，只有当依赖项发生变化时才会重新计算。 这能有效避免重复计算，提高应用的响应速度。

```jsx
// 不要这样写：
function App({ users }) {
  return (
    <ul>
      {users
        .map((user) => ({
          id: user.id,
          name: user.name,
          age: user.age,
        }))
        .sort((a, b) => a.age - b.age)
        .map(({ id, name, age }) => {
          return (
            <li key={id}>
              {name} - {age}
            </li>
          );
        })}
    </ul>
  );
}

// 应该这样写：
function App({ users }) {
  const sortedUsers = useMemo(() => {
    return users
      .map((user) => ({
        id: user.id,
        name: user.name,
        age: user.age,
      }))
      .sort((a, b) => a.age - b.age);
  }, [users]);

  return (
    <ul>
      {sortedUsers.map(({ id, name, age }) => {
        return (
          <li key={id}>
            {name} - {age}
          </li>
        );
      })}
    </ul>
  );
}
```

### 5. 使用自定义钩子实现可复用逻辑

代码复用是提高开发效率的关键。自定义钩子允许您将常用的逻辑封装成可复用的函数，方便在多个组件中使用。 这不仅能减少代码冗余，还能提高代码的可读性和可维护性。

```jsx
function useFetch(url) {
  // 通过url获取API数据的自定义钩子
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [url]);

  return data;
}
```

### 6. 使用 Fragments 避免多余的 DOM 节点

不必要的 DOM 节点会增加渲染负担，影响应用性能。React Fragments (`<> </>` 或 `<React.Fragment></React.Fragment>`) 允许您对多个元素进行分组，而无需在 DOM 中添加额外的节点，从而保持 DOM 结构简洁，提升渲染效率。

```jsx
// 不要这样写：
return (
  <div>
    <Child1 />
    <Child2 />
  </div>
);

// 应该这样写：
return (
  <>
    <Child1 />
    <Child2 />
  </>
);

// 或者这样写：
return (
  <React.Fragment>
    <Child1 />
    <Child2 />
  </React.Fragment>
);
```

### 7. 利用复合组件构建灵活的 UI

复合组件通过组合多个子组件来创建一个更复杂的组件，子组件之间可以隐式地进行通信，实现更灵活的 UI 交互。 这使得组件更具扩展性和复用性。

```jsx
function Tab({ children }) {
  return <div>{children}</div>;
}

Tab.Item = function TabItem({ label, children }) {
  return (
    <div>
      <h3>{label}</h3>
      <div>{children}</div>
    </div>
  );
};

// 使用示例
<Tab>
  <Tab.Item label="Tab 1">Content 1</Tab.Item>
  <Tab.Item label="Tab 2">Content 2</Tab.Item>
</Tab>;
```

### 8. 使用 map 方法渲染列表时始终添加 key 属性

在使用`map`方法渲染列表时，`key`属性至关重要。它能帮助 React 高效地更新列表，避免不必要的重新渲染，从而提升性能和用户体验。 `key`的值应该在每次渲染时保持唯一，最好使用数据库 ID 等唯一标识符。 避免使用索引作为`key`，因为索引在数组元素重新排序时会失效，导致性能问题和 UI 异常。

```jsx
// ✅ 使用唯一id作为key
{
  items.map((item) => <Item key={item.id} item={item} />);
}

// ❌ 不要使用索引作为key
{
  items.map((item, index) => <Item key={index} item={item} />);
}
```

### 9. 使用 IntersectionObserver 进行元素的懒加载

对于包含大量图片或视频的长页面，懒加载可以显著提升加载速度和用户体验。Intersection Observer API 可以检测元素是否进入视口，从而实现懒加载，减少初始加载时间和资源消耗。

```js
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 加载图像或其他数据
      }
    });
  });
  observer.observe(elementRef.current);
}, []);
```

### 10. 避免不必要的 useEffect 和 setState 调用

`useEffect` 和 `setState` 会触发组件重新渲染，这会影响性能。 应尽量避免不必要的调用，减少不必要的计算。 在`useEffect`中合理运用依赖项数组可以避免不必要的重新渲染。 同样，减少不必要的`setState`调用能显著提高应用的性能。

```js
// 不要这样写：
const [username, setUsername] = useState("");
const [age, setAge] = useState("");
const [displayText, setDisplayText] = useState("");

useEffect(() => {
  setDisplayText(
    `Hello ${username}, your year of birth is ${new Date().getFullYear() - age}`
  );
}, [username, age]);

// 应该这样写：

const [username, setUsername] = useState("");
const [age, setAge] = useState("");

// 在组件中创建局部变量
const displayText = `Hello ${username},
your year of birth is ${new Date().getFullYear() - age}`;
```

## 二. 代码规范与最佳实践

### 11. 使用错误边界避免生产环境中的应用崩溃

**React 错误边界** 提供了一种强大的机制来捕获和优雅地处理组件渲染过程中发生的错误。它们通过将错误隔离到特定组件来防止整个应用程序崩溃，从而允许应用程序的其他部分继续运行。

```jsx
<ErrorBoundary
  FallbackComponent={ErrorPage}
  onReset={() => (location.href = "/")}
>
  <App />
</ErrorBoundary>
```

### 12. 将大型组件拆分成较小的组件

将大型组件分解成更小、可重用的组件，以提高可读性和可维护性。目标是遵循“单一职责”原则的组件。较小的组件更容易测试、维护和理解。

```jsx
const Header = () => <header>{/* Header组件代码 */}</header>;
const Footer = () => <footer>{/* Footer组件代码 */}</footer>;
```

### 13. 始终为 useState 钩子分配初始值

在函数式组件中声明状态时，始终像这样分配初始值：

```jsx
// 设置空数组的初始值
const [pageNumbers, setPageNumbers] = useState([]);
```

永远不要像这样声明没有任何默认值的任何状态：

```jsx
const [pageNumbers, setPageNumbers] = useState();
```

### 14. 尽可能避免在组件中编写额外的函数

函数式组件中声明的每个函数都会在组件每次重新渲染时重新创建。因此，如果您声明了单独的函数来显示/隐藏操作状态的模态框，例如：

```jsx
const [isOpen, setIsOpen] = React.useState(false);

function openModal() {
  setIsOpen(true);
}

function closeModal() {
  setIsOpen(false);
}
```

那么，您可以通过创建一个处理模态框打开和关闭的单个`toggleModal`函数来简化此逻辑：

```jsx
const [isOpen, setIsOpen] = React.useState(false);

function toggleModal() {
  setIsOpen((open) => !open);
}
```

### 15. 理解 React 中的状态更新和立即访问

在 React 中，请记住状态不会在设置后立即更新。这意味着如果您尝试在设置状态后立即访问状态值，则可能无法获取更新后的值。例如，考虑以下代码，我们尝试在调用`setIsOnline`后立即记录更新后的状态：

```jsx
const [isOnline, setIsOnline] = React.useState(false);

function toggleOnlineStatus() {
  setIsOnline(!isOnline);
  console.log(isOnline); // 记录旧值，而不是更新后的值
}
```

下面的代码也是如此：

```jsx
const [isOnline, setIsOnline] = React.useState(false);

function doSomething() {
  if (isOnline) {
    // isOnline值仍然是旧的，尚未更新
    // 做某事
  }
}

function toggleOnlineStatus() {
  setIsOnline(!isOnline);
  doSomething();
}
```

### 16. 不要在所有情况下都使用 Context API

将属性向下传递到一两个级别的组件并不是问题。属性旨在传递给组件，因此无需仅为避免传递这些属性而使用 Context API。

许多 React 开发人员使用 Context API 只是为了避免传递属性，但这并不是预期的用例。只有当您想要避免**属性穿透**（指的是将属性传递给深度嵌套的组件）时，才应使用 Context API。

### 17. 始终使用`null`作为在状态中存储对象的初始值

当您想在状态中存储对象时，请使用`null`作为初始值，如下所示：

```jsx
const [user, setUser] = useState(null);
```

而不是空对象：

```jsx
const [user, setUser] = useState({});
```

### 18. 始终创建 ContextProvider 组件而不是直接使用 Context.Provider

使用 React Context API 时，不要像下面这样直接将`value`属性传递给`Provider`：

```jsx
const App = () => {
  // ....
  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      <ComponentA />
      <ComponentB />
    </AuthContext.Provider>
  );
};
```

在上面的代码中，每当`App`组件因状态更新而重新渲染时，传递给`AuthContext.Provider`的`value`属性都会更改，因此，`AuthContext.Provider`的开始和结束标记之间的所有直接和间接组件都会不必要地重新渲染。

因此，始终创建一个单独的组件，如下所示：

```jsx
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (user) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

并像下面这样使用它：

```jsx
<AuthContextProvider>
  <ComponentA />
  <ComponentB />
</AuthContextProvider>
```

### 19. 避免在 JSX 中使用逻辑与运算符 (&&) 导致的意外渲染

不要犯这样的错误：

```jsx
{
  users.length && <User />;
}
```

在上面的代码中，如果`users.length`为零，那么最终会在屏幕上显示`0`。因为逻辑`&&`运算符（也称为短路运算符）如果它的值为假值，则会立即返回该值。

因此，如果`users.length`为`0`，则上面的代码等效于下面的代码：

```jsx
{
  0 && <User />;
}
```

其计算结果为`{0}`。

相反，您可以使用以下任何一种方法来正确编写 JSX：

```jsx
→ { users.length > 0 && <User /> }
→ { !!users.length && <User /> }
→ { Boolean(users.length) && <User /> }
→ { users.length ? <User /> : null }
```

## 三、状态管理

### 20. 使用 Context 避免属性穿透

不要将属性通过许多嵌套组件传递，使用 React Context API 进行更易于管理的数据共享。最佳用例：共享全局状态，例如主题、用户数据或设置。

```jsx
export const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (user) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用示例
<AuthContextProvider>
  <App />
</AuthContextProvider>;
```

## 四、高级特性应用

### 21. 使用 useRef 钩子在渲染之间保持值不变

如果您不想在设置值时重新渲染组件，请使用`useRef`钩子，而不是使用`useState`钩子存储值。用例：存储超时、间隔、DOM 引用或任何不需要触发重新渲染的值，以避免闭包问题。

```jsx
const interval = useRef(-1);

useEffect(() => {
  interval.current = setInterval(() => {
    console.log("Timer executed");
  }, 1000);

  return () => clearInterval(interval.current);
}, []);
```

### 22. 使用 React Suspense 进行代码分割

React 的 Suspense 允许您将代码分割成更小的块，通过仅在需要时加载组件来提高性能。

```jsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Profile = lazy(() => import("./pages/profile"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
```

### 23. 使用 StrictMode 突出潜在问题

在开发环境中启用 React 的`StrictMode`可以识别应用程序中的潜在问题，例如不安全的生命周期、已弃用的方法或意外的副作用。启用`StrictMode`会在浏览器控制台中显示警告，这有助于避免未来的错误。

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

## 五、其他最佳实践

### 24. 在提升状态之前先在本地管理状态

避免不必要地将状态提升到父组件。如果某个状态只被单个组件或紧密相关的组件使用，则将其保留在本地，避免使状态管理过于复杂。因为每当父组件中的状态发生变化时，所有直接和间接子组件都会重新渲染。

```jsx
function ChildComponent() {
  const [value, setValue] = useState(0);
  return <div>{value}</div>;
}
```

### 25. 始终为 useState 钩子分配初始值

在函数式组件中声明状态时，始终像这样分配初始值：

```jsx
// 设置空数组的初始值
const [pageNumbers, setPageNumbers] = useState([]);
```

永远不要像这样声明没有任何默认值的任何状态：

```jsx
const [pageNumbers, setPageNumbers] = useState();
```