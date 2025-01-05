---
title: "掌握这些 React 技巧，性能与可读性不再是难题"
tag: "React"
time: 2025-01-04 18:34:56
---

React 是一个强大的 JavaScript 库，用于构建用户界面。掌握一些技巧，可以帮助你编写更干净、更高效、更易于维护的代码。本文将探讨五个基本的 React 技巧，助你写出更高性能、更易读的代码。

## 1\. 使用三元运算符代替逻辑与（`&&`）运算符来渲染元素

在 React 中，我们常常需要根据某些条件来条件性地渲染组件或元素。然而，使用`&&`运算符进行条件渲染可能会在评估结果为假值（例如`false`、`null`、`undefined`、`0`或`''`）时变得棘手。为了避免意外的渲染行为，建议使用三元运算符。

### `&&` 行为示例：

- 使用`&&`进行条件渲染：

```jsx
{
  0 && <h1>Hello world 5</h1>;
}
{
  0 ? <h1>Hello world 6</h1> : null;
}
```

- 第一个示例（`{0 && <h1>Hello world 5</h1>}`）将在 UI 中渲染`0`，因为`0`在 JavaScript 中是假值，React 将其解释为`false`。但 React 不会渲染为空，而是渲染假值本身（`0`）。

- 第二个示例（`{0 ? <h1>Hello world 6</h1> : null}`）将*不渲染任何内容*。由于条件是`0`（假值），三元运算符将评估为`null`，React 不会渲染任何内容。

### 使用三元运算符的更好方法：

与其依赖`&&`运算符，你可以使用三元运算符确保在条件为假值时渲染正确的后备内容。

```jsx
{
  0 ? <h1>Hello world 5</h1> : null;
}
```

在这种情况下，如果条件是假值（`0`），React 将渲染`null`，这意味着不渲染任何内容，提供了更可预测和预期的行为。

## 2\. 使用`useState`惰性初始化

React 的`useState`钩子可以接受一个函数作为其初始值，允许你惰性地初始化状态。这在初始状态的计算成本较高或依赖于仅应运行一次的某些计算时特别有用。

### 为什么使用惰性初始化？

- _性能提升_：如果初始状态涉及昂贵的计算或数据获取，惰性初始化有助于将这些成本推迟到实际需要时。
- _避免不必要的计算_：你传递给`useState`作为初始值的函数仅在组件挂载期间执行一次，并且在后续渲染中不会被重新计算。

### 示例：

```tsx
import React, { useState } from "react";

const ExpensiveComponent: React.FC = () => {
  const [count, setCount] = useState(() => {
    // 昂贵的计算
    console.log("Computing initial state");
    returnMath.random(); // 例如，生成一个随机数
  });

  return <div>Initial Random Value: {count}</div>;
};

export default ExpensiveComponent;
```

在这个示例中：

- `useState(() => Math.random())`仅在初始渲染时调用函数一次。
- 这确保了仅在计算成本高昂时才生成随机数，提高了性能。

## 3\. 使用惰性加载组件提高性能

React 的`React.lazy()`和`Suspense`是惰性加载组件的绝佳工具，这有助于将你的 JavaScript 分割成更小的包，并仅在需要时加载它们。这显著减少了初始加载时间，并提高了你的应用性能。

### 示例：

```tsx
import React, { Suspense } from "react";

const LazyComponent = React.lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

在这个示例中：

- `React.lazy()`允许你动态导入`LazyComponent`。
- `Suspense`组件用于在惰性加载的组件完全渲染之前显示加载状态。

通过使用惰性加载，你的应用只会加载初始渲染所需的组件，并按需获取其他组件，增强了性能，特别是在大型应用中。

## 4\. 在 JavaScript 中使用可选链

如果你正在使用 JavaScript，可选链（`?.`）是在访问对象的深层嵌套属性时的救星。它防止了在尝试访问`undefined`或`null`的属性时发生的错误。可选链在现代 JavaScript 中可用，并允许你安全地访问属性，而无需手动检查`null`或`undefined`。

### 示例：

```tsx
function MyComponent({ data }) {
  const address = data?.info?.address ?? "Address not available";
  return <div>{address}</div>;
}
```

在这个示例中：

- `data?.info?.address`安全地访问`address`属性，如果`data`或`info`是`undefined`或`null`，不会抛出错误。
- `??`运算符在`address`是`undefined`时提供默认值。

没有可选链，你需要手动检查每个级别，这很快会导致代码混乱且难以阅读。可选链保持了代码的清晰和无错误。

## 5\. 使用`useRef`以避免重新渲染

在 React 中，当你处理表单并且不需要组件在每次输入变化时重新渲染时，使用`useRef`而不是`useState`更好。`useRef`直接存储输入字段的值，并且在值变化时不触发重新渲染，这使得它对大型表单来说更高效。

### 示例：

```tsx
import React, { useRef } from "react";
const MyForm: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (nameRef.current) {
      alert(`Name: ${nameRef.current.value}`);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <label>
        {" "}
        Name: <input type="text" ref={nameRef} />{" "}
      </label> <button type="submit">Submit</button>{" "}
    </form>
  );
};
export default MyForm;
```

在这个 TypeScript 示例中：

- `useRef`用于跟踪输入值，而不会导致组件在每次输入变化时重新渲染。
- `nameRef.current`用于在表单提交时直接访问输入的值。

当表单值不需要触发重新渲染以进行验证或动态更新时，使用`useRef`特别有用，使其成为性能敏感表单的极佳选择。

## 结论

通过在你的代码中应用这五个 React 技巧，你可以显著提高性能、可读性和可维护性。以下是快速回顾：

1. 使用三元运算符进行条件渲染，而不是`&&`。
2. 利用`useState`中的惰性初始化。
3. 实施组件的惰性加载以改善初始加载时间。
4. 使用 JavaScript 中的可选链进行更安全的属性访问。
5. 在表单中使用`useRef`以避免不必要的重新渲染。
