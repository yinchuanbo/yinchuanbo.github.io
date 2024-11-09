---
title: "IIFE、UMD、ESM、CJS 傻傻分不清楚"
tag: "前端工程化"
time: 2024-11-09 12:35:00
---

最近有同学在尝试使用 `rollup` 完成 **前端库** 开发，不过在打包环节出现了一些小问题，那就是 **库的打包格式划分要比项目复杂的多**。`IIFE、UMD、ESM、CJS` 这些打包格式到底要怎么使用？每一个又代表的是什么意思呢？

所以，今天咱们就针对这个问题，来统一为大家解释一下！

## 为什么要关注打包格式？

打包格式本质上决定了我们打包后的代码该如何在不同的环境下运行。

比如，你可能会打包一个工具库，希望它既能在浏览器环境下以 `<script>` 引入，也能在 Node.js 中通过 `require` 引入，还能通过 `import` 在现代的模块化项目中使用。不同的场景需要不同的打包格式支持，那么想要达成这样的目的，我们就必须要了解打包格式！

目前常见的打包格式主要有 4 种，分别为：`IIFE、UMD、ESM、CJS`。

## 1\. IIFE (Immediately Invoked Function Expression)

IIFE（立即执行函数表达式）是一种将代码包裹在立即执行的函数中的打包格式。这种格式可以直接在浏览器中运行，因为所有代码都被封装在一个函数里，所以不会污染全局作用域。

### 使用场景

适合直接用 `<script>` 标签引入的场景，在这种情况下，你只需要加载文件，就可以立即运行。

### 代码示例

```js
// Rollup 配置
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.iife.js",
    format: "iife", // IIFE 格式
    name: "MyLibrary", // 全局变量名
  },
};
```

上面的配置会生成一个 `IIFE` 格式的文件。假设你的库名为 `MyLibrary`，在浏览器中引入这个打包文件后，就可以通过 `window.MyLibrary` 访问你的库。

### 打包结果示例

```js
(function () {
  "use strict";
  function sayHello() {
    console.log("Hello, World!");
  }
  window.MyLibrary = { sayHello };
})();
```

这里可以看到所有代码被包裹在一个立即执行函数中。因为我们指定了 `name: 'MyLibrary'`，最终结果会挂载到 `window.MyLibrary` 下。

## 2\. UMD (Universal Module Definition)

UMD（通用模块定义）是一个兼容性极强的格式，它同时支持 AMD（异步模块定义）和 CommonJS 模块规范。也就是说，不管你是在浏览器、Node.js，还是其他模块加载器环境中，UMD 格式都能适用。

### 使用场景

适合需要兼容性强的库，既希望支持 `require` 引入，也希望能在浏览器中通过 `<script>` 引入的场景。

### 代码示例

```js
// Rollup 配置
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.umd.js",
    format: "umd", // UMD 格式
    name: "MyLibrary",
  },
};
```

## 打包结果示例

```js
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : (global.MyLibrary = factory());
})(this, function () {
  "use strict";

  function sayHello() {
    console.log("Hello, World!");
  }

  return { sayHello };
});
```

UMD 格式的代码根据不同的环境，选择不同的导出方式：

- 如果检测到 `module.exports` 存在，则导出为 CommonJS；
- 如果 `define.amd` 存在，则支持 AMD。
- 否则，将库挂载到全局对象（在浏览器环境中通常是 `window`）。

## 3\. ESM (ES Module)

ESM（ES 模块）是 ES6 规范下的模块化格式。

ESM 格式支持 `import` 和 `export`，在现代浏览器以及支持模块化的环境（比如 Node.js >=12）中，ESM 是首选格式，因为它在加载效率、按需加载方面都有天然优势。

### 使用场景

适合现代的模块化项目，通过 `import` 和 `export` 语法进行模块导入导出。

### 代码示例

```js
// Rollup 配置
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.esm.js",
    format: "es", // ESM 格式
  },
};
```

### 打包结果示例

```js
// bundle.esm.js
function sayHello() {
  console.log("Hello, World!");
}

export { sayHello };
```

这里我们直接使用了 `export`，ESM 格式生成的代码可以直接被其他模块通过 `import` 引入，而不需要任何额外的包装。

## 4\. CJS (CommonJS)

CJS（CommonJS）是 Node.js 的模块规范。

在 CommonJS 中，使用 `module.exports` 和 `require` 来导出和导入模块。CJS 格式在 Node.js 环境中非常常见。

### 使用场景

适合在 Node.js 环境中使用的库，适合需要使用 `require` 的场景。

### 代码示例

```js
// Rollup 配置
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.cjs.js",
    format: "cjs", // CJS 格式
  },
};
```

### 打包结果示例

```js
"use strict";

function sayHello() {
  console.log("Hello, World!");
}

module.exports = { sayHello };
```

在 CJS 格式下，我们通过 `module.exports` 导出函数或对象，这样其他文件就可以使用 `require` 导入该模块。

## 如何选择正确的格式

在使用 Rollup 打包时，我们应该根据使用场景选择合适的格式：

- **IIFE**：适合直接在浏览器中以 `<script>` 方式引入，不需要模块化的支持。
- **UMD**：适合需要支持多种加载方式的库，兼容性最好。
- **ESM**：首选的现代模块格式，适合现代模块化项目。
- **CJS**：适合在 Node.js 环境中使用的模块。

## 多格式输出的组合

为了兼容不同的使用场景，很多库会选择同时输出多种格式。即：我们可以通过一种统一的配置，一次性完成多种格式的输出：

```js
// Rollup 配置
export default {
  input: "src/index.js",
  output: [
    { file: "dist/bundle.iife.js", format: "iife", name: "MyLibrary" },
    { file: "dist/bundle.umd.js", format: "umd", name: "MyLibrary" },
    { file: "dist/bundle.esm.js", format: "es" },
    { file: "dist/bundle.cjs.js", format: "cjs" },
  ],
};
```

这样配置后，Rollup 会生成四种不同格式的文件，我们可以根据需要，选择合适的文件进行引入。
