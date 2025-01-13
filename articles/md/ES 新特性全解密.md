---
title: "ES 新特性全解密"
tag: "JavaScript"
time: 2025-01-13 09:59:23
---

JavaScript 作为最流行的编程语言之一，通过 ECMAScript 标准的不断演进，为开发者带来了大量实用的新特性。分享 25 个能显著提升编程效率的 ES 新特性，让我们的代码更简洁、更优雅、更高效。

## 1\. 可选链操作符（Optional Chaining）

告别繁琐的空值检查，用简单的  `?.`  优雅处理对象属性访问。

```js
// 之前的写法
const street = user && user.address && user.address.street;
// 现在的写法
const street = user?.address?.street;
```

## 2\. 空值合并运算符（Nullish Coalescing）

使用  `??`  来处理 null 或 undefined 的默认值设置。

```js
const value = null;
const defaultValue = value ?? "default"; // 'default'
```

## 3\. 私有类字段（Private Class Fields）

使用  `#`  声明私有字段，增强面向对象编程的封装性。

```js
class Person {
  #name;
  constructor(name) {
    this.#name = name;
  }
  getName() {
    return this.#name;
  }
}
```

## 4\. 动态导入（Dynamic Import）

按需加载模块，优化应用性能。

```js
button.addEventListener("click", async () => {
  const module = await import("./feature.js");
  module.doSomething();
});
```

## 5\. Array.prototype.flat() 和 flatMap()

轻松处理嵌套数组。

```js
const nested = [1, [2, 3], [4, [5, 6]]];
const flattened = nested.flat(2); // [1, 2, 3, 4, 5, 6]
```

## 6\. 对象字面量增强

更简洁的对象属性和方法定义。

```js
const name = "Tom";
const age = 18;
const person = {
  name,
  age,
  sayHi() {
    console.log("Hi!");
  },
};
```

## 7\. Promise.allSettled()

等待所有 Promise 完成，无论成功与否。

```js
const promises = [fetch("/api/1"), fetch("/api/2"), fetch("/api/3")];

const results = await Promise.allSettled(promises);
```

## 8\. BigInt

处理超大整数。

```js
const bigNumber = 9007199254740991n;
const result = bigNumber + 1n;
```

## 9\. globalThis

统一的全局对象访问方式。

```js
// 在任何环境下都可用
console.log(globalThis);
```

## 10\. String.prototype.matchAll()

更强大的字符串匹配能力。

```js
const str = "test1test2test3";
const regexp = /test(\d)/g;
const matches = [...str.matchAll(regexp)];
```

## 11\. 逻辑赋值运算符

简化条件赋值操作。

```js
// 逻辑与赋值
x &&= y; // 等同于 x && (x = y)

// 逻辑或赋值
x ||= y; // 等同于 x || (x = y)

// 空值合并赋值
x ??= y; // 等同于 x ?? (x = y)
```

## 12\. Promise.any()

返回第一个成功的 Promise。

```js
const promises = [fetch("/api/1"), fetch("/api/2"), fetch("/api/3")];

try {
  const first = await Promise.any(promises);
  console.log(first);
} catch (error) {
  console.log("All promises rejected");
}
```

## 13\. 数字分隔符

提高大数字的可读性。

```js
const billion = 1_000_000_000;
const bytes = 0xff_ff_ff_ff;
```

## 14\. String.prototype.replaceAll()

替换字符串中的所有匹配项。

<img src="../imgs/134/01.webp" />

## 15\. WeakRef 和 FinalizationRegistry

更好的内存管理机制。

<img src="../imgs/134/02.webp" />

## 16\. 顶层 await

在模块顶层使用 await。

<img src="../imgs/134/03.webp" />

## 17\. 类静态初始化块

更灵活的类静态成员初始化。

<img src="../imgs/134/04.webp" />

## 18\. at() 方法

更直观的数组索引访问。

<img src="../imgs/134/05.webp" />

## 19\. Object.hasOwn()

安全的属性检查方法。

<img src="../imgs/134/06.webp" />

## 20\. 错误原因（Error Cause）

更好的错误追踪。

<img src="../imgs/134/07.webp" />

## 21\. Object.groupBy()

数组分组操作。

<img src="../imgs/134/08.webp" />

## 22\. 正则表达式命名捕获组

更清晰的正则表达式匹配结果。

<img src="../imgs/134/09.webp" />

## 23\. Promise.withResolvers()

更优雅的 Promise 控制。

<img src="../imgs/134/10.webp" />

## 24\. Array 复制方法

方便的数组操作。

```js
const arr = [1, 2, 3];
const copy = arr.toReversed(); // 不修改原数组
const sorted = arr.toSorted(); // 不修改原数组
```

## 25\. 装饰器

增强类和类成员的功能。

```js
function logged(target, context) {
  return class extends target {
    exec(...args) {
      console.log("Starting execution...");
      const result = super.exec(...args);
      console.log("Finished execution.");
      return result;
    }
  };
}

@logged
class Example {
  exec() {
    // ...
  }
}
```
