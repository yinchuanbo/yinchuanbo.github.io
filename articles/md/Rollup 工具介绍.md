---
title: "Rollup 工具介绍"
tag: "TypeScript + React"
---

Rollup 是一款 Js 模块的打包工具，可将多个小的代码片段编译为完整的库或应用。

Rollup 工具的特性能够保证开发人员随心所欲地使用 Js 模块函数，最大程度地发挥 Js 语言开发灵活性。

ES6 版本 JS 的推出，为开发人员提供了 `import` 和 `export` 语法功能，该语法功能可以实现多个脚本中共享函数和数据，虽然 `import` 和 `export` 已经成为 ES6 的事实标准，但是目前 Node.js 尚未支持该标准。

Rollup 工具的出现确保了开发人员可以放心地使用 `import` 和 `export` 语法来编写代码，并编译为当前被广泛支持的 `CommonJS`、`AMD`、`IIFE`等多种代码格式。

- CommonJS: Node.js 默认的模块规范，可以通过 webpack 工具来加载。

- AMD: 通过 RequireJS 来加载。

- IIFE: 自执行函数，可以通过 `<script>` 标签来加载。

- ESM: ES6 Module 标准规范，可以通过 webpack 工具和 Rollup 工具来加载。

- UMD: 兼容 IIFE、AMD、CJS 三种模块规范。

Rollup 工具除了能够让开发人员使用标准的 ES 模块，可以对所用的代码进行静态分析，并将未实际使用的代码进行剔除。
