---
title: "一起了解 React 19 带来的6个主流特性"
tag: "React"
time: 2025-02-22 18:19:50
---

## 1\. 支持 Actions

### 1.1 什么是 Actions

使用 async 转换（Transitions）的函数称为 Actions，其会自动处理以下操作：

- 待处理状态 (Pending state)：请求开始前状态设置为 pending ，在提交最终状态更新时重置。
- 乐观更新：支持新的 useOptimistic Hooks，开发者可以在提交请求时向用户显示乐观的即时反馈。
- 错误处理：开发者可以在请求失败时显示错误边界，并自动将乐观更新恢复为原始值。
- 表单：`<form>` 元素支持将函数传递给 action 和 formAction 属性，将函数传递给 action 属性默认启用 Actions，并在提交后自动重置表单。

### 1.2 Actions 的典型场景

React 应用的一个常见用例是执行数据变异，然后更新响应状态。例如，当用户提交表单更改姓名时将发出 API 请求，然后处理响应。以前，开发者需要手动处理 pending 状态、错误 / 乐观更新和顺序请求。例如，下面示例在 useState 中处理待处理和错误状态：

```jsx
const [isPending, setIsPending] = useState(false);
const [error, setError] = useState(null);
const handleSubmit = async () => {
  setIsPending(true);
  const error = await updateName(name);
  setIsPending(false);
  if (error) {
    setError(error);
    return;
  }
  redirect("/path");
};
```

React 19 添加了在转换中使用 async 函数的支持以自动处理 pending 状态、错误、表单和乐观更新。 例如下面的示例中，开发者可以使用 useTransition 处理 pending 状态：

```jsx
const [isPending, startTransition] = useTransition();
const handleSubmit = () => {
  startTransition(async () => {
    const error = await updateName(name);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  });
};
```

startTransition 会立即将 isPending 状态设置为 true，接着发出异步请求，并在完成转换后重置 isPending 为 false，从而在数据发生变化时保持当前 UI 的响应和交互。

## 2\. 支持新的 useActionState Hooks

> useActionState 在 Canary 版本中被称为 useFormState，但已重命名并弃用。

useActionState 的引入是为了让 Actions 的使用更加简单，其接受一个函数（Action），并返回要调用的包装后的 Action，其函数签名如下;

```jsx
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
// permalink 表示包含此表单修改的唯一页面 URL 的字符串
```

因为 Actions 是可组合的，因此当调用包装的 Action 时，useActionState 将返回 Action 的最后结果作为 data，同时将 Action 的状态设置为 pending。

```jsx
function ChangeName({ name, setName }) {
  // 这里启用 useActionState 的 Hooks
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      returnnull;
    },
    null
  );
  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

当 `<form>` 操作成功时，React 将自动重置表单中不受控的组件。如果开发者需要手动重置 `<form>`，可以调用新的 requestFormReset React DOM API。当然，开发者还可以给 `<form>` 中的 button 等控件提供 formAction 达到同样的效果：

```jsx
import { useActionState } from "react";
async function increment(previousState, formData) {
  return previousState + 1;
}
function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  );
}
```

表单状态是表单上次提交时 Action 返回的值，如果表单尚未提交则表示传递的初始状态。如果与服务器函数一起使用，useActionState 允许在水合完成之前显示服务器提交表单的响应。

## 3\. 支持 useFormStatus Hooks

useFormStatus Hooks 用于编写需要访问其所在 <form> 信息的组件（提供上次表单提交的状态信息），而无需知道组件的 props，相对 Context 的优势是非常简单：

```jsx
mport {useFormStatus} from"react-dom";
import action from'./actions';
function Submit() {
const status = useFormStatus();
return<button disabled={status.pending}>Submit</button>
}
exportdefaultfunction App() {
return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

要获取状态信息，Submit 组件必须在 <form> 中渲染。Hook 返回 pending 属性等信息，该信息表示表单是否正在主动提交。

## 4\. 支持 useOptimistic Hooks

useOptimistic 是一个 React Hook，可让开发者在异步操作时显示不同的状态。其接受某个状态作为参数，并返回该状态的副本，该副本在异步操作（例如：网络请求）的持续时间内可能会有所不同。开发者需要提供一个函数，其接受当前状态和操作的输入，并返回在操作 pending 期间的乐观状态。

此状态称为 “乐观” 状态，通常用于立即向用户展示执行操作的结果，即使操作实际上并未完成。

```jsx
import {useOptimistic, useState, useRef} from "react";
import {deliverMessage} from "./actions.js";

function Thread({messages, sendMessage}) {
const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    // 乐观更新
    formRef.current.reset();
    // 重置表单
    await sendMessage(formData);
    // 真实同步消息到服务端
  }
const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,(state, newMessage) => [
      ...state,{
        text: newMessage,
        sending: true
      }
    ]
  );
return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
export defaultfunction App() {
const [messages, setMessages] = useState([
    {text: "Hello there!", sending: false, key: 1}
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

在表单方面，乐观更新技术有助于提高应用的响应速度。当用户提交表单时，界面会立即更新为预期结果，而无需等待服务器响应以反映更改。

## 5\. 支持 use

开发者可以使用 use 读取一个 Promise，React 将会暂停直到 Promise resolve：

```jsx
import { use } from "react";

function Comments({ commentsPromise }) {
  // `use` 会等待 Promise resolve
  const comments = use(commentsPromise);
  return comments.map((comment) => <p key={comment.id}>{comment}</p>);
}

function Page({ commentsPromise }) {
  // 在 Comments 中使用 `use` 时展示这里的 <Suspense>
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}
```

需要注意的是，use 不支持在 render 中创建的 Promise，否则抛出警告。开发者还可以通过 use 来有条件的读取上下文：

```jsx
function Heading({ children }) {
  if (children == null) {
    return null;
  }
  const theme = use(ThemeContext);
  return <h1 style={{ color: theme.color }}>{children}</h1>;
}
```

## 6.React DOM Static APIs 用于 SSG

React v19 向 react-dom/static 中添加了两个用于静态站点生成 (Static Site Generation，SSG) 的 API，包括：

- prerender
- prerenderToNodeStream

这些 API 会等待数据加载以生成静态 HTML(Static HTML Generation) 来改进 renderToString，通知支持与 Node.js Streams 和 Web Streams 等流式环境配合使用。例如，在 Web Stream 环境中，开发者可以使用 prerender 将 React 树预渲染为静态 HTML：

```jsx
import { prerender } from "react-dom/static";
async function handler(request) {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ["/main.js"],
  });
  return new Response(prelude, {
    headers: { "content-type": "text/html" },
  });
}
```

Prerender API 会等待所有数据加载完毕后再返回静态 HTML 流，而流可以转换为字符串，也可以通过流式响应发送。该 API 不支持在加载时流式传输内容，开发者可以利用现有的 React DOM 服务器渲染 API ，例如：renderToPipeableStream、renderToReadableStream 等。

```jsx
import { renderToPipeableStream } from "react-dom/server";
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ["/main.js"],
  onShellReady() {
    response.setHeader("content-type", "text/html");
    pipe(response);
  },
});
```

或者下面的 renderToReadableStream：

```jsx
import { renderToReadableStream } from "react-dom/server";

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ["/main.js"],
  });
  return new Response(stream, {
    headers: { "content-type": "text/html" },
  });
}
```
