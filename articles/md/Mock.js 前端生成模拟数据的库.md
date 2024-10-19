---
title: "Mock.js 前端生成模拟数据的库"
tag: "工具"
---

> http://mockjs.com/

## Mock.js 超全、超详细总结：保姆级别教程

### 1\. 介绍

Mock.js 是一个前端生成模拟数据的库，它能够帮助开发者在前后端分离的开发模式中快速搭建和调试前端页面。通过 Mock.js，开发者可以在后端接口尚未完成时生成模拟数据，以便前端开发和测试。

### 2\. Mock.js 的安装

你可以通过 npm 或直接引入脚本文件来安装 Mock.js。

**通过 npm 安装：**

```sh
npm install mockjs
```

**通过 CDN 引入：**

```html
<script src="https://unpkg.com/mockjs@1.0.1/dist/mock.js"></script>
```

### 3. 基本使用

Mock.js 的核心是  `Mock.mock()`  方法。这个方法可以用来创建模拟数据或拦截 Ajax 请求并返回模拟数据。

```js
// 基本使用
Mock.mock(url, type, data);
// 示例
Mock.mock("/api/user", "get", {
  name: "John Doe",
  age: 25,
  gender: "male",
});
```

### 4. 生成随机数据

Mock.js 提供了一系列内置的占位符，用于生成各种类型的随机数据。占位符以  `@`  开头，支持数据类型包括字符串、数字、布尔值、日期、时间、图片、颜色、地址等。

**常用占位符：**

```js
Mock.mock("/api/user", "get", {
  name: "@name", // 随机生成姓名
  age: "@integer(20, 50)", // 生成 20-50 的随机整数
  birth: '@date("yyyy-MM-dd")', // 生成日期
  avatar: '@image("200x200")', // 生成图片
  address: "@county(true)", // 生成详细地址
});
```

**常用占位符说明：**

- `@string`：随机字符串，如  `@string('lower', 5)`。
- `@integer`：随机整数，如  `@integer(0, 100)`。
- `@float`：随机浮点数，如  `@float(0, 10, 2, 2)`。
- `@boolean`：随机布尔值，如  `@boolean`。
- `@date`：随机日期，如  `@date('yyyy-MM-dd')`。
- `@time`：随机时间，如  `@time('HH:mm:ss')`。
- `@image`：随机图片，如  `@image('200x200', '#50B347', '#FFF', 'Mock.js')`。

### 5. 数据模板

Mock.js 的强大之处在于数据模板，它允许你定义更加复杂和灵活的数据结构。通过结合占位符和数据模板，可以生成各种嵌套、循环和递归的数据结构。

```js
Mock.mock("/api/posts", "get", {
  "list|10": [
    {
      "id|+1": 1, // 自增 ID
      title: "@title",
      author: "@name",
      content: "@paragraph",
      created_at: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
});
```

**数据模板语法：**

- `'prop|count': value`：生成指定数量的数组。
- `'prop|min-max': value`：生成指定范围内的随机数组。
- `'prop|min-max.dmin-dmax': value`：生成指定范围内的浮点数。
- `'prop|+step': value`：生成自增值。

### 6. 拦截 Ajax 请求

Mock.js 可以拦截和模拟 Ajax 请求，无需改变前端代码。使用  `Mock.setup()`  可以全局配置 Ajax 请求的响应时间等。

```js
Mock.setup({
  timeout: "200-600",
});

// 拦截 GET 请求
Mock.mock("/api/users", "get", {
  "users|5-10": [
    {
      "id|+1": 1,
      name: "@name",
      "age|20-30": 25,
      "gender|1": ["male", "female"],
    },
  ],
});
```

### 7. 自定义函数和扩展

Mock.js 支持使用自定义函数生成数据，也支持扩展更多的占位符。

```js
Mock.Random.extend({
  constellation: function () {
    const constellations = [
      "白羊座",
      "金牛座",
      "双子座",
      "巨蟹座",
      "狮子座",
      "处女座",
      "天秤座",
      "天蝎座",
      "射手座",
      "摩羯座",
      "水瓶座",
      "双鱼座",
    ];
    returnthis.pick(constellations);
  },
});

// 使用自定义扩展
Mock.mock("/api/constellation", "get", {
  constellation: "@constellation",
});
```

### 8\. 使用场景与总结

Mock.js 非常适用于前后端分离的项目开发，特别是在接口设计和开发周期较长的项目中。通过 Mock.js，开发者可以提前模拟接口数据，进行前端开发和测试，提升开发效率，减少前后端联调时间。

**总结：**

- • Mock.js 是一个强大的模拟数据生成工具，适合前端开发阶段使用。
- •  提供了丰富的随机数据生成器，可以轻松生成各种类型的数据。
- •  支持复杂的数据模板和自定义扩展，灵活性强。
- •  能够拦截 Ajax 请求，便于前端独立调试。
