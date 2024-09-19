---
title: "深入理解 JavaScript 的 Promise 与 async/await"
tag: "Promise"
---

JavaScript 中的异步编程是开发现代 Web 应用的核心部分，而 Promise 和 async/await 是处理异步操作的关键工具。本文将详细讲解 Promise 的概念与用法，并介绍如何使用 async/await 来简化异步代码。

## 1\. 异步编程简介

在 JavaScript 中，异步操作允许程序在等待某个任务完成时，继续执行其他代码，而不会阻塞主线程。这对于处理如网络请求、文件读写、定时器等耗时任务尤为重要。

## 2\. 什么是 Promise？

Promise 是一种用于处理异步操作的对象，它代表一个尚未完成但预计会在未来某个时间点完成的操作。Promise 有三种状态：

- **Pending（待定）** ：初始状态，操作尚未完成。
- **Fulfilled（已完成）** ：操作成功完成。
- **Rejected（已拒绝）** ：操作失败。

### 2.1 Promise 的基本用法

```js
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("操作成功！");
  } else {
    reject("操作失败！");
  }
});

promise
  .then((result) => {
    console.log(result); // 操作成功！
  })
  .catch((error) => {
    console.error(error);
  });
```

在这个示例中，我们创建了一个新的 Promise，并在构造函数中传递了一个执行器函数，该函数包含两个参数：`resolve` 和 `reject`。当异步操作成功时，调用 `resolve()`，否则调用 `reject()`。通过 `then()` 方法可以处理成功的结果，而通过 `catch()` 方法可以处理错误。

### 2.2 链式调用

Promise 允许链式调用，这意味着你可以在一个 `then()` 后面接另一个 `then()`，以处理连续的异步操作。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
});

promise
  .then((result) => {
    console.log(result); // 1
    return result * 2;
  })
  .then((result) => {
    console.log(result); // 2
    return result * 2;
  })
  .then((result) => {
    console.log(result); // 4
  });
```

在上面的代码中，每个 `then()` 返回的值都会被传递给下一个 `then()`。通过这种方式，我们可以串联多个异步操作，并且确保它们按照正确的顺序执行。

## 3\. 处理多个 Promise

有时你需要同时处理多个异步操作。Promise 提供了几种方法来处理这种场景。

### 3.1 Promise.all()

`Promise.all()` 方法接受一个 Promise 对象的数组，只有当所有的 Promise 都成功时，它才会返回一个新的 Promise，结果是一个包含所有操作结果的数组。如果任何一个 Promise 失败，`Promise.all()` 会立即返回失败的 Promise。

```js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 42, "foo"]
});
```

### 3.2 Promise.race()

`Promise.race()` 也是接受一个 Promise 数组，但它只会返回第一个完成的 Promise，不论是成功还是失败。

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "one");
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "two");
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // "two"
});
```

在这个例子中，`promise2` 先完成，因此 `Promise.race()` 返回的是 `promise2` 的值。

## 4\. async 和 await 的引入

尽管 Promise 极大地简化了异步编程，但复杂的链式调用仍然可能让代码难以维护。为此，JavaScript 引入了 `async` 和 `await` 关键字，让异步代码看起来像同步代码。

### 4.1 async 函数

`async` 关键字用于声明一个异步函数，返回一个 Promise。如果函数内没有显式返回 Promise，JavaScript 会自动将其包装成 Promise。

```js
async function fetchData() {
  return "数据获取成功！";
}

fetchData().then((result) => console.log(result)); // 数据获取成功！
```

### 4.2 await 关键字

`await` 关键字只能在 `async` 函数内部使用，它用于等待一个 Promise 完成，并返回其结果。`await` 使得异步代码看起来像同步代码，这大大提高了代码的可读性。

```js
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("数据获取成功！"), 2000);
  });
}

async function processData() {
  console.log("开始获取数据...");
  const result = await fetchData();
  console.log(result); // 数据获取成功！
  console.log("数据处理完成");
}

processData();
```

在这个例子中，`await` 让 `fetchData()` 函数在 `processData()` 中的调用看起来像是同步的。程序会等待 `fetchData()` 完成后再执行下面的代码。

## 5\. 错误处理

在使用 `async/await` 时，可以通过 `try/catch` 语句进行错误处理，这与同步代码的错误处理方式相同。

```js
async function processData() {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (error) {
    console.error("数据处理出错：", error);
  }
}
```

## 6\. Promise 和 async/await 的对比

### 代码风格

- **Promise**：适合处理简单的异步操作，特别是在链式调用和并发控制时表现良好。
- **async/await**：使异步代码看起来像同步代码，更适合处理复杂的异步逻辑和流程控制。

### 错误处理

- **Promise**：错误处理依赖于 `catch()`，需要在每个链式调用后处理错误。
- **async/await**：错误处理使用 `try/catch`，更符合传统的同步代码风格。
