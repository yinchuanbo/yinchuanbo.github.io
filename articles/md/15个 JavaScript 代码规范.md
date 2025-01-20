---
title: "15个 JavaScript 代码规范"
tag: "JavaScript"
time: 2025-01-20 17:20:23
---

代码不仅是给机器执行的，更是给人阅读和维护的。特别是在团队协作中，代码的可读性、可维护性和一致性至关重要。对于 JavaScript 这门灵活多变的语言来说，代码规范更是不可或缺，分享一些比较重要的 JavaScript 代码规范及建议。

### 1\. 命名规范

变量和函数使用驼峰命名法（camelCase），类名使用帕斯卡命名法（PascalCase）。常量使用全大写和下划线。

```js
// 好的示例
const MAX_COUNT = 10;
let userName = 'Alice';
function calculateTotal() {}
class UserProfile {}

// 避免
let user_name = 'Alice';
function calculate_total() {}
```

### 2\. 使用严格模式

在文件开头添加 ‘use strict’ 声明，避免一些常见的编程错误。

```js
"use strict";

function doSomething() {
  // 代码实现
}
```

### 3\. 变量声明

优先使用 const，其次是 let，避免使用 var。确保变量在使用前已声明。

```js
// 好的示例
const PI = 3.14159;
let count = 1;

// 避免
var name = "John";
```

### 4\. 代码缩进

使用统一的缩进风格，推荐使用 2 或 4 个空格（不要使用 tab）。

```js
function example() {
  if (condition) {
    doSomething();
  }
}
```

### 5\. 分号使用

在每个语句后添加分号，避免自动分号插入（ASI）带来的问题。

```js
// 好的示例
let message = "Hello";
console.log(message);

// 避免
let message = "Hello"
console.log(message)
```

### 6\. 字符串使用

优先使用单引号或反引号，保持整个项目风格统一。使用模板字符串进行字符串拼接。

```js
// 好的示例
const name = 'John';
const greeting = `Hello, ${name}!`;

// 避免
const name = "John";
const greeting = 'Hello, ' + name + '!';
```

### 7\. 空格规范

操作符前后添加空格，提高代码可读性。

<img src="../imgs/139/05.webp" />

### 8\. 注释规范

为函数和复杂逻辑添加必要的注释，使用JSDoc风格。

<img src="../imgs/139/06.webp" />

### 9\. 模块导入导出

使用 ES6 模块语法，明确指定导入的内容。

<img src="../imgs/139/07.webp" />

### 10\. 条件判断

优先使用三元运算符代替简单的 if-else 语句，复杂逻辑保持 if-else 结构。

<img src="../imgs/139/08.webp" />

### 11\. 异步处理

优先使用 async/await 处理异步操作，提高代码可读性。

<img src="../imgs/139/09.webp" />

### 12\. 数组和对象

使用解构赋值和展开运算符，使代码更简洁。

<img src="../imgs/139/10.webp" />

### 13\. 错误处理

使用 try-catch 块处理可能的错误，提供有意义的错误信息。

<img src="../imgs/139/11.webp" />

### 14\. 函数规范

函数应该短小精悍，遵循单一职责原则。参数不应超过3个，超过时考虑使用对象参数。

<img src="../imgs/139/12.webp" />

### 15\. 性能考虑

避免在循环中创建函数，使用防抖和节流控制频繁操作。

```js
// 好的示例
const debounced = debounce(() => {
  // 处理逻辑
}, 300);

// 避免
for (let i = 0; i < 1000; i++) {
  const handler = () => console.log(i);
}
```