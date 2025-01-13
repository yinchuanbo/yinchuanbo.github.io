---
title: "ES6 中引入的 new.target 你知道吗"
tag: "JavaScript"
time: 2025-01-13 11:29:52
---

## 一. 什么是 new.target

new.target 是 ES6 中引入的特性，用于在构造函数或类的内部检测函数/方法是否是通过**new**关键字调用的。

- 使用 new 关键字调用时，new.target 是一个引用；
- 非 new 关键字调用时，new.target 为 undefined。

使用详情请看下文

## 二. 在构造函数中的使用

构造函数也是函数，既可以使用 new 关键字调用，也可以直接调用。但在构造函数内部，两种调用方式下的 new.target 值是不同的。

当构造函数通过 new 关键字调用时，new.target 值为这个构造函数的引用：

```js
function CustomConstructor() {
  console.log("new.target值：", new.target);
  console.log(new.target === CustomConstructor);
}

new CustomConstructor();
```

输出：

<img src="../imgs/134/11.webp" />

当构造函数直接作为函数调用时，new.target 值为 undefined：

```js
function CustomConstructor() {
  console.log("new.target值：", new.target);
  console.log(new.target === CustomConstructor);
}

CustomConstructor();
```

输出：

<img src="../imgs/134/12.webp" />

使用这个特性，我们可以通过判断构造函数是否是被“new”的方式调用，从而执行不同的行为表现。

比如，我们定义一个函数必须作为构造函数使用，禁止作为普通函数调用：

```js
function CustomConstructor() {
  if (new.target === undefined) {
    throw new Error("必须用作构造函数");
  }
  console.log("正常执行");
}
```

当使用 new CustomConstructor()时，输出：

<img src="../imgs/134/13.webp" />

当使用 CustomConstructor()时，输出：

<img src="../imgs/134/14.webp" />

## 三. 在类中的使用

类必须通过 new 调用，同构造函数类似，**当 new 一个类时，其中的 new.target 值就是这个类的引用**：

```js
class CustomClass {
  constructor() {
    console.log("new.target：", new.target);
    console.log(new.target === CustomClass);
  }
}

new CustomClass();
```

输出：

<img src="../imgs/134/15.webp" />

使用这些判断，可以更灵活地实现我们的不同需求

## 四. new.target 的注意事项

1. new.target 是一个只读属性，不能被赋值；
2. 箭头函数中 new.target 会指向最近的外层函数的 new.target，因为箭头函数没有自己的 this、new.target 等。
