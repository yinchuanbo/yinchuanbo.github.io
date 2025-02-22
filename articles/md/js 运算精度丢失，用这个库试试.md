---
title: "js 运算精度丢失，用这个库试试"
tag: "工具集"
time: 2024-09-01 15:21:24
---

## 简述

当`js`进行算术运算时，有时候会遇到以下几个问题：

```js
// 控制台可以尝试以下代码
0.1 + 0.2; // 0.30000000000000004
0.3 - 0.1; // 0.19999999999999998
19.9 * 100; // 1989.9999999999998
```

为什么会遇到这个问题呢？

由于在计算机运算过程中，十进制的数会被转化为二进制来运算，有些浮点数用二进制表示是无穷的，浮点数运算标准（IEEE 754）64 位双精度的小数部分最多支持 53 位二进制位，运算过程中超出的二进制位会被截断。运算完后再转为十进制。所以产生了精度问题。

为了解决此问题，整理了一些第三方的`js`库。

## 相关`js`库推荐

| js 库名称  | 备注                               |
| ---------- | ---------------------------------- |
| Math.js    | JavaScript 和 Node.js 的扩展数学库 |
| decimal.js | javaScript 任意精度的库            |
| big.js     | 一个轻量的任意精度库               |

## `big.js`

### 版本介绍

本次用的`big.js`版本为`6.2.1`

### 页面引入

下载`big.js`:

- 因为作为本地测试，就不下载压缩版本了: [https://cdn.jsdelivr.net/npm/big.js@6.2.1/big.js](https://cdn.jsdelivr.net/npm/big.js@6.2.1/big.js) ​
- 若需要压缩版本: [https://cdn.jsdelivr.net/npm/big.js@6.2.1/big.min.js](https://cdn.jsdelivr.net/npm/big.js@6.2.1/big.min.js)

引入到`html`页面：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Big js</title>
  </head>
  <body>
    <!-- 引入页面 -->
    <script src="./js/big.js"></script>
    <script>
      // 尝试Big构造方法
      console.log("Big", Big);
    </script>
  </body>
</html>
```

### 工程化项目

```sh
npm install big.js
```

在所需页面引入：

```js
// 现在一般用 es 模块引入
import Big from "big.js";
```

### 使用

基本演示：

```js
// 加
let a = new Big(0.1)
a = a.plus(0.2)
​
// 由于运算结果是个对象，所以展示以下值
console.log('a', a) //  {s: 1, e: -1, c: Array(1)}
// 可以使用 Number || toNumber() 转为我们需要的数值
console.log('a', a.toNumber) || console.log('a', Number(a)) // 0.3
```

可以链式调用：

```js
x.div(y).plus(z).times(9);
```
