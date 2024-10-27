---
title: "安全赋值运算符，新的 JavaScript 提案让你告别 try catch"
tag: "新特性"
time: 2024-09-20 23:36:53
---

在现代 Web 开发中，错误处理一直是个重要但复杂的问题。传统的 `try-catch` 语句虽然功能强大，但是容易导致代码冗长且难以维护。

为了简化这一过程，`ECMAScript` 近期引入了一个新的提案：`proposal-safe-assignment-operator`，“安全赋值运算符”（Safe Assignment Operator，记作`?=`）。

## 提案概要

安全赋值运算符 `?=` 的目标就是简化错误处理。

它通过将函数的结果转换为一个数组来处理错误。

- 如果函数抛出错误，则运算符返回 `[error, null]`；
- 如果函数成功执行，则返回 `[null, result]`。

这一运算符与 `Promise、async` 函数以及任何实现了 `Symbol.result` 方法的值兼容。

例如，当执行 `I/O` 操作或与基于 `Promise` 的 API 交互时，运行时可能会出现意外错误。

如果忽略了这些错误，可能会导致意外的行为和潜在的安全漏洞。使用安全赋值运算符可以有效地处理这些错误：

```js
const [error, response] ?= await fetch("https://blog.conardli.top");
```

## 提案动机

1. **简化错误处理**：通过消除 `try-catch` 块，简化错误管理流程；
2. **增强代码可读性**：减少嵌套，提高代码的清晰度，使错误处理的流程更直观；
3. **跨 API 一致性**：在不同的 API 中建立统一的错误处理方法，确保行为一致性；
4. **提高安全性**：减少忽略错误处理的风险，从而增强代码整体安全性。

## 使用示例

以下是一个典型的不使用 `?=` 运算符的错误处理示例：

```js
async function getData() {
  const response = await fetch("https://blog.conardli.top");
  const json = await response.json();
  return validationSchema.parse(json);
}
```

上述函数存在多个可能存在异常的点（例如 `fetch()、json()、parse()`），我们可以使用 `?=` 运算符进行非常简洁、易读的处理：

```js
async function getData() {
  const [requestError, response] ?= await fetch("https://blog.conardli.top");

  if (requestError) {
    handleRequestError(requestError);
    return;
  }

  const [parseError, json] ?= await response.json();

  if (parseError) {
    handleParseError(parseError);
    return;
  }

  const [validationError, data] ?= validationSchema.parse(json);

  if (validationError) {
    handleValidationError(validationError);
    return;
  }

  return data;
}
```

## 提案功能

### Symbol.result

任何实现了 `Symbol.result` 方法的对象都可以与 `?=` 运算符一起使用。

`Symbol.result` 方法必须返回一个数组，其中第一个元素表示错误，第二个元素表示结果。

```js
function example() {
  return {
    [Symbol.result]() {
      return [new Error("报错啦！"), null]
    },
  }
}

const [error, result] ?= example() // Function.prototype also implements Symbol.result
// const [error, result] = example[Symbol.result]()

// error is Error('123')
```

### 安全赋值运算符 (?=)

`?=` 运算符调用运算符右侧对象或函数上的 `Symbol.result` 方法，确保以结构化方式一致地处理错误和结果。

```js
const obj = {
  [Symbol.result]() {
    return [new Error("Error"), null]
  },
}

const [error, data] ?= obj
// const [error, data] = obj[Symbol.result]()
```

```js
function action() {
  return 'data'
}

const [error, data] ?= action(argument)
// const [error, data] = action[Symbol.result](argument)
```

结果应符合 `[error, null | undefined]` 或 `[null, data]` 的格式。

当在函数中使用 `?=` 运算符时，传递给该函数的所有参数都将转发给 `Symbol.result` 方法。

```js
declare function action(argument: string): string

const [error, data] ?= action(argument1, argument2, ...)
// const [error, data] = action[Symbol.result](argument, argument2, ...)
```

当 `?=` 运算符与对象一起使用时，不会将任何参数传递给 `Symbol.result` 方法。

```js
declare const obj: { [Symbol.result]: () => any }

const [error, data] ?= obj
// const [error, data] = obj[Symbol.result]()
```

### 递归处理机制

在使用 `[error, null]` 数组时，一旦遇到第一个异常就会生成。然而，如果 `[null, data]` 数组中的数据也实现了 `Symbol.result` 方法，那么该方法将会被递归调用。

```js
const obj = {
  [Symbol.result]() {
    return [
      null,
      {
        [Symbol.result]() {
          return [new Error("Error"), null]
        },
      },
    ]
  },
}

const [error, data] ?= obj
// const [error, data] = obj[Symbol.result]()

// error 是 Error('string')
```

这种行为有助于处理各种包含 `Symbol.result` 方法的 `Promise` 或对象：

- `async function(): Promise<T>`
- `function(): T`
- `function(): T | Promise<T>`

### 处理 Promise

`Promise` 是除了 `Function` 之外，唯一可以与 `?=` 操作符一起使用的实现。

```js
const promise = getPromise()
const [error, data] ?= await promise
// const [error, data] = await promise[Symbol.result]()
```

你可能已经注意到 `await` 和 `?=` 可以一起使用，而且绝对没问题。由于递归处理特性，它们可以很好地组合在一起。

```js
const [error, data] ?= await getPromise()
// const [error, data] = await getPromise[Symbol.result]()
```

执行顺序如下：

1. `getPromise[Symbol.result]()` 调用时可能抛出错误（如果它是一个返回 Promise 的同步函数）。
2. 如果抛出错误，错误将被赋值给 `error`，并且执行将停止。
3. 如果没有错误抛出，结果将被赋值给 `data`。因为 `data` 是一个 Promise，并且 Promise 具有 `Symbol.result` 方法，所以它将被递归处理。
4. 如果 Promise 被拒绝（reject），错误将被赋值给 `error`，并且执行将停止。
5. 如果 Promise 被解决（resolve），结果将被赋值给 `data`。

通过这种递归处理机制，你可以简化对各种复杂嵌套对象和 Promise 的处理，让代码更加简洁和易读。

## Polifll

这个提案还处于初期阶段，要进入标准还需要很长的时间，当下需要使用可以用这个 `polifill`：

`https://github.com/arthurfiorette/proposal-safe-assignment-operator/blob/main/polyfill.js`

但是，`?=` 运算符本身没办法直接进行 `polyfill`。当针对较旧的 `JavaScript` 环境时，需要使用编译器将 `?=` 运算符转换为相应的 `[Symbol.result]` 调用。

```js
const [error, data] ?= await asyncAction(arg1, arg2)
// should become
const [error, data] = await asyncAction[Symbol.result](arg1, arg2)


const [error, data] ?= action()
// should become
const [error, data] = action[Symbol.result]()


const [error, data] ?= obj
// should become
const [error, data] = obj[Symbol.result]()
```

提案地址：https://github.com/arthurfiorette/proposal-safe-assignment-operator
