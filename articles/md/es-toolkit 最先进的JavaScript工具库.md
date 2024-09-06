---
title: "es-toolkit 最先进的JavaScript工具库"
tag: "工具库"
---

<img src="../imgs/27/01.webp" />

## 关于 es-toolkit

es-toolkit 是一个现代的 JavaScript 实用库，提供了一系列强大的函数，适用于日常使用。

与 lodash 等替代品相比，es-toolkit 提供了 显著更小的包体积（最多减少 97%）和 2-3 倍更快的运行时性能。这是通过利用最新的 JavaScript 特性实现的。

es-toolkit 内置 TypeScript 类型，并经过严格测试，确保了 100%的测试覆盖率，以保证最大的可靠性。

## 特点简介

### 最佳性能

es-toolkit 在现代 JavaScript 运行时中的性能比其他库提高了 2-3 倍。

### 小型包体积

与其他替代库相比，es-toolkit 的 JavaScript 代码体积最多减少了 97%。

### 现代化实现

es-toolkit 充分利用现代 JavaScript API 进行简单且无错误的实现。

### 强大的类型支持

es-toolkit 为所有函数提供简单而强大的类型支持。

### 经过实战验证

es-toolkit 具有 100%的测试覆盖率，确保最大的健壮性。

### 全面的运行时支持

es-toolkit 支持包括 Node.js、Deno、Bun 和浏览器在内的所有 JavaScript 环境。

## 功能特点

### 以下是 es-toolkit 提供的一些功能特点：

- Array: 数组操作工具，如 uniq 和 difference。
- Function: 控制函数执行的工具，包括 debounce 和 throttle。
- Math: 数值操作工具，如 sum 和 round。
- Object: 操作 JavaScript 对象的工具，如 pick 和 omit。
- Predicate: 类型保护函数，如 isNotNil。
- Promise: 异步操作工具，如 delay。
- String: 字符串操作工具，如 snakeCase。

## 使用方法

es-toolkit 可通过 npm 安装，适用于 Node.js 和 Bun，也可以通过 JSR 安装到 Deno。

你也可以通过 从 CDN 导入 的方式在浏览器中使用 es-toolkit。

### Node.js

es-toolkit 支持 Node.js 18 及更高版本。使用以下命令安装 es-toolkit：

```sh
npm install es-toolkit
```

### 浏览器

你可以在诸如 jsdelivr 或 unpkg 等 CDN 上找到 es-toolkit。我们将 \_ 定义为包含所有函数，类似于 Lodash。

```html
<script src="https://cdn.jsdelivr.net/npm/es-toolkit"></script>
<script>
  var arr = _.chunk([1, 2, 3, 4, 5, 6], 3);
</script>
```

<img src="../imgs/27/02.webp" />

通过其现代化的实现，es-toolkit 显著减少了其包体积，与 lodash 等其他库相比，可以减少高达 97%。

这使得 es-toolkit 在包体积方面成为最高效的选择，其中一些实用函数的体积甚至少于 100 字节。

### 性能

<img src="../imgs/27/03.webp" />

es-toolkit 设计时考虑了性能，与类似 lodash 的替代库相比，平均性能提升了 2 倍。通过充分利用现代 JavaScript API，部分函数甚至可以获得高达 11 倍的性能提升。

### 与 Lodash 兼容性

```js
// es-toolkit/compat 的目标是提供与 lodash 百分之百的功能兼容性
import { chunk } from "es-toolkit/compat";
chunk([1, 2, 3, 4], 0);
// 返回 [], 与 lodash 完全相同
```

为了最大限度地兼容 lodash，请使用 es-toolkit/compat，这是一个弥合这两个库之间差距的兼容性层。

该模块旨在提供与 lodash 相同的 API，使得在这两个库之间进行切换更加容易。

es-toolkit/compat 已经过 lodash 的实际测试用例进行了全面测试。

需要注意的是，与原始 es-toolkit 相比，es-toolkit/compat 可能会对性能产生轻微影响，并且包大小可能会更大。该模块旨在促进平滑过渡，一旦迁移完成，应替换回原始的 es-toolkit 以获得最佳性能。

### 总结

es-toolkit 是一个现代的 JavaScript 实用库，提供了一系列强大的函数，适用于日常使用,与 Lodash 兼容。
