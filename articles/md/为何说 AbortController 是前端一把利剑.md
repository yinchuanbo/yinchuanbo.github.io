---
title: "为何说 AbortController 是前端一把利剑"
tag: "JavaScript"
time: 2025-01-04 22:08:55
---

<img src="../imgs/133/10.webp" />

## 1\. 通过 AbortController 提前终止 fetch

首先看一个例子，其使用 AbortController 来实现可以提前中止的 fetch：

```js
fetchButton.onclick = async () => {
  const controller = new AbortController();
  // 添加取消按钮
  abortButton.onclick = () => controller.abort();
  try {
    const r = await fetch("/json", { signal: controller.signal });
    const json = await r.json();
    // 这里执行业务逻辑
  } catch (e) {
    const isUserAbort = e.name === "AbortError";
    // 如果是 AbortController 取消的则是 AbortError（一种 DOMException）
  }
};
```

上面示例展示了在 `AbortController` 出现之前不可能实现的事情，即 `主动取消网络请求`。浏览器将提前终止 fetch，从而节省用户网络带宽。当然，提前终止也不必非要由用户手动发起。

上面示例中 `controller.signal` 返回的是 `AbortSignal`，其代表一个信号对象，其允许开发者与异步操作（例如 fetch 请求）进行通信，并在需要时通过 AbortController 对象中止。

如果开发者想从多个信号中中止，可以使用 `AbortSignal.any()` 组合成单个信号，比如下面的示例：

```js
try {
  const controller = new AbortController();
  const timeoutSignal = AbortSignal.timeout(5000);
  const res = await fetch(url, {
    // This will abort the fetch when either signal is aborted
    signal: AbortSignal.any([controller.signal, timeoutSignal]),
  });
  const body = await res.json();
} catch (e) {
  if (e.name === "AbortError") {
    // Notify the user of abort.
  } else if (e.name === "TimeoutError") {
    // Notify the user of timeout
  } else {
    // A network error, or some other problem.
    console.log(`Type: ${e.name}, Message: ${e.message}`);
  }
}
```

AbortController 和 AbortSignal 两者用途还是有一定的区别：

- `AbortController`：允许通过 controller.abort() 显式中止其附加的信号
- `AbortSignal` ：不能直接中止，但开发者可以将其传递给 fetch() 之类的调用或直接监听其中止状态。

可以使用 `signal.aborted` 检查其状态，或为 `abort` 事件添加事件监听器，例如：fetch() 在内部执行此操作 。

```js
if (signal.aborted) {}
signal.addEventListener('abort', () => ());
```

AbortController 取消请求后服务器就不会继续处理该请求，也不会发送响应，从而避免了不必要的数据传输。同时，针对客户端来说会减少并发的连接数量，提高页面的响应性能。

## 2.AbortController 的典型使用场景

### 2.1 中止 WebSocket 等传统对象

很多老版本的 DOM API 其实并不支持 AbortSignal，例如：WebSocket，其只有一个 `.close()` 方法用于在请求完成后关闭连接。此时，开发者可以通过下面的方式显式取消请求：

```js
function abortableSocket(url, signal) {
  const w = new WebSocket(url);
  if (signal.aborted) {
    w.close();
    // 已经取消，直接失败
  }
  signal.addEventListener("abort", () => w.close());
  return w;
}
```

请注意，如果已经中止，AbortSignal 不会触发其 “abort”，因此必须检查是否已经 aborted，在这种情况下立即 .close()。

### 2.2 移除事件处理程序

在通过 removeEventListener 移除 DOM 事件处理函数时，开发者必须保证第二个事件处理函数是同一个。

```js
window.addEventListener("resize", () => doSomething());
// addEventListener 和 removeEventListener 非同一个函数
window.removeEventListener("resize", () => doSomething());
```

有了 AbortController 后，这一切变得非常简单，开发者只需要将 signal 传递给 addEventListener 的第三个参数即可。

```js
const controller = new AbortController();
const { signal } = controller;
window.addEventListener("resize", () => doSomething(), { signal });
// 通过. abort() 方法移除事件处理函数
controller.abort();
```

当然，针对旧版本的浏览器可以尝试添加 Polyfill 以支持 AbortController。

### 2.3 React hooks 中的异步任务

在 React 中，如果 Effect 在再次触发之前没有完成，开发者一般不容易发现，此时 Effect 会并行运行。

```js
function FooComponent({something}) {
  useEffect(async () => {
    const j = await fetch(url + something);
    // do something with J
  }, [something]);
  return <>...<>;
}
```

此时，开发者可以做的是创建一个 AbortController，每当下一个 useEffect 调用运行时就中止上一个请求：

```js
function FooComponent({something}) {
  useEffect(() => {
    const controller = new AbortController();
    const {signal} = controller;
    const p = (async () => {
      // 真正执行的逻辑
      const j = await fetch(url + something, { signal});
      // 这里处理返回值
    })();
    return () => controller.abort();
  }, [something]);
  return <>...<>;
}
```

### 2.4 React hooks 中的异步任务

Node.js 里新版的 setTimeout 可以用 AbortController 取消，例如下面的代码：

```js
const { setTimeout: setTimeoutPromise } = require("node:timers/promises");
const ac = new AbortController();
const signal = ac.signal;
// 📢 这里传入了 AbortSignal
setTimeoutPromise(1000, "foobar", { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === "AbortError") console.log("The timeout was aborted");
  });
ac.abort();
```

不过这个 Promise 版的 setTimeout 并不传入回调，回调需要在 .then() 里或者 await 后面自己调用。

但是，浏览器的 setTimeout 目前并不支持 AbortController，可能是原因是其已经设计了更先进的 `scheduler.postTask() API`，该方法用于根据优先级添加要执行的任务，因此 setTimeout 没理由增强了。

```js
// Declare a TaskController with default priority
const abortTaskController = new TaskController();
// Post task passing the controller's signal
scheduler
  .postTask(() => console.log("Task executing"), {
    signal: abortTaskController.signal,
  })
  .then((taskResult) => console.log(`${taskResult}`)) //This won't run!
  .catch((error) => console.error("Error:", error)); // Log the error
// Abort the task
abortTaskController.abort();
```

值得一提的是， `TaskController` 是 AbortController 的子级，除了可以调用 abort() 取消 task，还可以通过 `setPriority()` 方法中途修改 task 的优先级，如果不需要控制优先级，则可以直接使用 AbortController。
