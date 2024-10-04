---
title: "如何高效检查 JavaScript 对象中的键是否存在"
tag: "Js"
---

## 问题背景

假设我们有一个简单的对象：

```js
const user = {
  name: "John",
  age: 30,
};
```

我们想在访问 `name` 键之前检查它是否存在：

```js
if (user.name) {
  console.log(user.name);
}
```

这个方法表面上看没问题，但如果 `name` 键存在但值是 `undefined` 会怎样呢？

```js
const user = {
  name: undefined,
};

if (user.name) {
  // 这段代码不会执行！
}
```

直接访问一个不存在的键会返回 `undefined`，但是访问值为 `undefined` 的键也是返回 `undefined`。所以我们不能依赖直接键访问来检查键是否存在。

## 使用 typeof

一种常见的方法是使用 `typeof` 来检查类型：

```js
if (typeof user.name !== "undefined") {
  console.log(user.name);
}
```

`typeof` 会对不存在的键返回 `"undefined"`，对存在的键返回其它类型，如 `"string"`。然而，这种方法有几个缺点：

- 需要额外的操作（`typeof`）而不是直接比较
- 比较冗长且需要否定检查（`!==`）
- 可读性不如其他方法
- 容易拼写错误 `'undefined'`

## 使用 in 操作符

`in` 操作符允许我们检查键是否存在于对象中：

```js
if ("name" in user) {
  console.log(user.name);
}
```

这种方法比 `typeof` 更简洁：

- 简单且可读
- 内置语言特性，专为此设计
- 对所有值都有效，包括 `undefined`

但是，`in` 操作符也会检查对象的原型链。因此它对原型链上存在的键也会返回 `true`。

## 使用 hasOwnProperty

要仅检查对象自身的键，可以使用 `hasOwnProperty`：

```js
if (user.hasOwnProperty("name")) {
  console.log(user.name);
}
```

这种方法只会返回对象自身拥有的键，而不会检查继承的属性：

- 只检查自身键，不包括继承的
- 方法名清晰，容易理解

缺点是 `hasOwnProperty` 需要方法调用，在性能关键的代码中可能会有影响。

## 性能比较

哪种方法最快呢？以下是直接键访问 `in`、`hasOwnProperty` 和 `typeof` 的简单性能比较：

```js
const user = {
  name: "John",
};

let key = "name";

function directAccess() {
  return user[key] !== undefined;
}

function inOperator() {
  return key in user;
}

function hasOwnProperty() {
  return user.hasOwnProperty(key);
}

function typeofCheck() {
  return typeof user[key] !== "undefined";
}

function objectKeysCheck() {
  return Object.keys(user).includes(key);
}

// 运行每个函数100万次
let start = performance.now();
for (let i = 0; i < 1000000; i++) {
  directAccess();
}
console.log(`directAccess took ${performance.now() - start} ms`);

start = performance.now();
for (let i = 0; i < 1000000; i++) {
  inOperator();
}
console.log(`inOperator took ${performance.now() - start} ms`);

start = performance.now();
for (let i = 0; i < 1000000; i++) {
  hasOwnProperty();
}
console.log(`hasOwnProperty took ${performance.now() - start} ms`);

start = performance.now();
for (let i = 0; i < 1000000; i++) {
  typeofCheck();
}
console.log(`typeofCheck took ${performance.now() - start} ms`);

start = performance.now();
for (let i = 0; i < 1000000; i++) {
  objectKeysCheck();
}
console.log(`objectKeysCheck took ${performance.now() - start} ms`);
```

结果如下（ 测试机器：apple m1 ,内存 16G）：

- directAccess 耗时 1.59 毫秒
- inOperator 耗时 0.97 毫秒（注：inOperator 和 typeofCheck 有时会比较接近）
- hasOwnProperty 耗时 4.74 毫秒
- typeofCheck 耗时 1.16  毫秒
- Object.keys()耗时  8.48  毫秒

如上所示，inOperator 运算显著快于其他方法。

## 总结

- 直接键访问较快且易读但无法处理`undefined`值
- `in`操作符最快但能处理所有值，包括`undefined`
- `hasOwnProperty`较慢但只检查对象自身的键
- `typeof`速度较快但需要冗长的否定检查
- Object.keys()方法直观，但速度最慢

在大多数情况下，`in`操作符在可读性和性能之间提供了最佳平衡。只有在需要排除继承键时才使用`hasOwnProperty`。

理解这些不同方法的细微差别是检查 JavaScript 键的关键。根据具体需求选择合适的工具，除非性能至关重要，否则应优先考虑可读性。
