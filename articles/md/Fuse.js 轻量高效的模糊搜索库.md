---
title: "Fuse.js 一个轻量高效的模糊搜索库"
tag: "工具库"
---

### 什么是模糊搜索？

一般来说，模糊搜索（更正式的名称是近似字符串匹配）是查找与给定模式近似相等（而不是完全相等）的字符串的技术。

通常我们项目中的的模糊搜索大多数情况下有几种方案可用：

- 前端工程通过正则表达式或者字符串匹配来实现
- 调用后端接口去匹配搜索
- 使用搜索引擎如：ElasticSearch 或 Algolia 等

但是这些方案都有各自的缺陷，比如正则表达式和字符串匹配的效率较低，且无法处理复杂的搜索需求，而调用后端接口和搜索引擎虽然效率高，但是需要额外的服务器资源，且需要维护一套搜索引擎。

所以，Fuse.js 的出现就是为了解决这些问题，它是一个轻量级的模糊搜索库，没有依赖关系，支持复杂的搜索需求，且效率高，当然 Fuse 并不适用于所有场景。

### Fuse.js 的使用场景

它可能不适用于所有情况，但根据您的搜索要求，它可能是最理想的。例如：

- 当您想要对小型到中等大型数据集进行客户端模糊搜索时
- 当您无法证明设置专用后端只是为了处理搜索时
- ElasticSearch 或 Algolia 虽然都是很棒的服务，但对于您的特定用例来说可能有些过度

### Fuse.js 的使用

- 安装

Fuse 支持多种安装方式

1. npm

```sh
npm install fuse.js
```

2. CDN

```html
<script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
```

- 引入

1. ES6 模块语法

```js
import Fuse from "fuse.js";
```

2. CommonJS 语法

```js
const Fuse = require("fuse.js");
```

### 使用

```js
// 1. List of items to search in
const books = [
  {
    title: "Old Man's War",
    author: {
      firstName: "John",
      lastName: "Scalzi",
    },
  },
  {
    title: "The Lock Artist",
    author: {
      firstName: "Steve",
      lastName: "Hamilton",
    },
  },
];

// 2. Set up the Fuse instance
const fuse = new Fuse(books, {
  keys: ["title", "author.firstName"],
});

// 3. Now search!
fuse.search("jon");

// Output:
// [
//   {
//     item: {
//       title: "Old Man's War",
//       author: {
//         firstName: 'John',
//         lastName: 'Scalzi'
//       }
//     },
//     refIndex: 0
//   }
// ]
```

从上述代码中可以看到我们要通过 Fuse 对 books 的这个数组进行模糊搜索，构建的 Fuse 对象中，模糊搜索的 key 定义为 `['title', 'author.firstName']`，支持对 title 及 author.firstName 这两个字段进行搜索。然后执行 fuse 的 search API 就能过滤出我们的期望结果。整体代码还是非常简单的。

### 高级配置

Demo 示例只是提供了一个基础版本的模糊搜索。如果用户想获得更灵活的搜索能力，比如搜索结果排序、权重控制、搜索结果高亮等，那么就需要对 Fuse 进行一些高级配置。

Fuse 的所有配置都是通过 new Fuse 时传入的参数来配置的，下面列举一些常用的配置项：

```js
const options = {
  keys: ["title", "author"], // 指定搜索key值，可多选
  isCaseSensitive: false, //是否区分大小写 默认为false
  includeScore: false, //结果集中是否展示匹配项的分数字段， 分数越大代表匹配程度越低，区间值为0-1,注意：当此项为true时，会返回完整的结果集，只不过每一项中携带了score分数字段
  includeMatches: false, //匹配项是否应包含在结果中。当时true，结果的每条记录都包含匹配项的索引。这个通常我们用来对搜索内容做高亮处理
  threshold: 0.6, // 阈值控制匹配的敏感度,默认值为0.6，如果要完全匹配这里要设置为0
  shouldSort: true, // 是否对结果进行排序
  location: 0, // 匹配的位置，0 表示开头匹配
  distance: 100, // 搜索的最大距离
  minMatchCharLength: 2, // 最小匹配字符长度
};
```

出了上述常用的一些配置项之外，Fuse 还支持更高阶模糊搜索，如[权重搜索，嵌套搜索，运算符拓展搜索](https://www.fusejs.io/examples.html#default-weight)，具体高阶用法可以参考官方文档。 Fuse 的主要实现原理是通过改写[Bitap 算法(近似字符串匹配)](https://en.wikipedia.org/wiki/Bitap_algorithm)算法的内部实现来支撑其模糊搜索的算法依据。
