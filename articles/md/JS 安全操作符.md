---
title: "JS新特性：?= 操作符助你告别bug"
tag: "New Features"
---

JavaScript 作为一门动态语言，其`错误处理`一直是一个让开发者头疼的问题。

传统的`try-catch`块虽然功能强大，但往往会导致代码结构变得复杂且难以维护。

幸运的是，`ECMAScript` 提出了一个新的提案——安全赋值操作符（`?=`），旨在简化错误处理，让代码更加清晰和高效。

<img src="../imgs/83/01.webp" />

## 什么是安全赋值操作符？

安全赋值操作符（`?=`）是一种新的语法，它允许开发者在赋值时直接处理错误`不会抛出异常`。这使得错误处理变得更加直观和简洁。

## 如何使用安全赋值操作符？

假设我们有一个异步函数`fetchData`，它可能会抛出错误。使用传统的`try-catch`块，我们需要这样写：

```js
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
```

使用安全赋值操作符，我们可以简化为：

```js
async function fetchData() {
  const [error, data] ?= await fetch("https://api.example.com/data").json();
  if (error) {
    console.error('Fetch error:', error);
    return null;
  }
  return data;
}
```

## 安全赋值操作符的优点

1. **减少代码嵌套**：`?=`操作符减少了`try-catch`块的使用，使代码更加简洁。
2. **提高可读性**：错误处理逻辑更加直观，代码更易于阅读和维护。
3. **跨 API 一致性**：无论使用哪个 API，都可以使用相同的错误处理方式。
4. **提高安全性**：自动处理错误，减少因忽略错误而导致的安全风险。

## 与`Symbol.result`结合使用

`Symbol.result`是一个特殊方法，当对象实现了这个方法时，`?=`操作符可以用来定义自己的错误处理逻辑。例如：

```js
function example() {
  return {
    [Symbol.result]() {
      return [new Error("Error message"), null];
    },
  };
}
const [error, result] ?= example();
if (error) {
  console.error('Error:', error.message);
}
```

## 递归错误处理

`?=`操作符还可以递归处理嵌套对象的错误，这对于处理复杂的错误场景非常有用。

```js
const obj = {
  [Symbol.result]() {
    return [
      null,
      { [Symbol.result]: () => [new Error("Nested error"), null] }
    ];
  },
};
const [error, data] ?= obj;
```

## 异步函数和 Promise

`?=`操作符与 Promise 和 async/await 无缝协作，使得异步代码中的错误处理变得简单。

```js
const [error, data] ?= await fetch("https://api.example.com");
```

## 结论

安全赋值操作符（`?=`）是 JavaScript 错误处理的一次重大进步，它有望减少对`try-catch`块的依赖，使代码更加清晰和安全。虽然这个提案还在开发中，但它的潜力已经显而易见。

### 代码示例

最后，让我们通过一个实际的例子来展示`?=`操作符的用法：

```js
async function getUserData(userId) {
  const [error, user] ?= await database.getUser(userId);
  if (error) {
    console.error('Database error:', error);
    return null;
  }
  return user;
}
```

在这个例子中，如果`getUser`函数抛出错误，`error`变量将捕获这个错误，而`user`变量将为`null`。这样，我们就可以在不使用`try-catch`块的情况下优雅地处理错误。

当然，目前这个提案还处于初期阶段，现阶段想要尝试的话需要使用  **polyfill**：https://github.com/arthurfiorette/proposal-safe-assignment-operator/blob/main/polyfill.js

参考链接：

- https://es.discourse.group/t/safe-assignment-operator/2111
