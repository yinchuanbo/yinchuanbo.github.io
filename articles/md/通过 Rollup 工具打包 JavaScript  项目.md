---
title: "通过 Rollup 工具打包 JavaScript  项目"
tag: "TypeScript + React"
---

1. 新建目录 rollup-js，并在该目录下创建两个子目录 src 和 dist

- src: 用于存放源码文件

- dist: 存放工具输出的 Bundle 文件

2. 在命令终端执行 `npm init -y`，创建 `package.json` 文件

3. 通过命令行终端安装 Rollup 工具模块及相关的插件，

```sh
npm i --save-dev rollup
npm i --save-dev @rollup/plugin-terser # Rollup 代码压缩工具
```

4. 在目录 src 中新建几个 JS 代码文件，用于测试 Rollup 工具的打包功能

- src/main.js

```js
import { sayHelloTo } from "./modules/hello";
import { sayByeTo } from "./modules/bye";

const resHello = sayHelloTo("king");
console.log(resHello);

const resBye = sayByeTo("king");
console.log(resBye);
```

- src/modules/hello.js

```js
export function sayHelloTo(name) {
  const roSay = `Hello, ${name}`;
  return roSay;
}
```

- src/modules/bye.js

```js
export function sayByeTo(name) {
  const roSay = `See you, ${name}`;
  return roSay;
}
```

5. 在 rollup-js 根目录下新建 rollup.config.js 配置文件，

```js
import terser from "@rollup/plugin-terser";

export default {
  input: "src/main.js", // 入口文件
  output: [
    // 输出文件格式
    {
      file: "dist/main.bundle.js",
      format: "cjs",
    },
    {
      file: "dist/main.es.js",
      format: "es",
    },
    {
      file: "dist/main.min.js",
      format: "iife",
      name: "version",
      plugins: [terser()],
    },
  ],
};
```

6. 配置 package.json 的 scripts 字段

```json
{
  //...
  "type": "module",
  "scripts": {
    "dev": "rollup -c --environment INCLUDE_DEPS,BUILD:development",
    "build": "rollup -c --environment INCLUDE_DEPS,BUILD:production"
  }
  //..
}
```
