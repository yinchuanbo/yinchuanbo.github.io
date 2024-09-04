---
title: "通过 Rollup 工具打包 TypeScript 项目"
tag: "TypeScript + React"
---

1. 编写 TS 代码需要安装语言开发包并创建相关 ts 配置文件，具体命令如下:

```sh
npm i --save-dev typescript
tsc --init # 创建 tsconfig.json
```

2. 安装 Rollup 工具模块及相关插件，具体命令如下:

```sh
npm i --save-dev rollup
npm i --save-dev rollup-plugin-terser # 代码压缩工具
npm i --save-dev rollup-plugin-clear # 插件清理工具
```

3. 安装 Rollup 工具关联 TypeScript 语言的相关插件，具体命令如下:

```sh
npm i --save-dev rollup-plugin-typescript # Rollup 工具处理 TypeScript 语言插件
```

4. 在 rollup-ts 项目根目录下创建 rollup.config.js 配置文件，并添加 Rollup 工具相关的配置信息，

```js
import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";
import clear from "rollup-plugin-clear";

export default {
  input: "src/main.ts", // 入口文件
  external: ["ms"],
  plugins: [clear({ targets: ["dist"] }), typescript()],
  output: [
    // 输出文件格式
    {
      file: "dist/main.bundle.ts.js",
      format: "cjs",
    },
    {
      file: "dist/main.es.ts.js",
      format: "es",
    },
    {
      file: "dist/main.min.ts.js",
      format: "iife",
      name: "version",
      plugins: [terser()],
    },
  ],
};
```

5. 在目录 src 中新建几个 TypeScript 代码文件，用于测试

- src/main.ts

```ts
import { sayHelloTo } from "./modules/hello";
import { sayByeTo } from "./modules/bye";

const resHello: string = sayHelloTo("king");
console.log(resHello);

const resBye: string = sayByeTo("king");
console.log(resBye);
```

- src/modules/hello.ts

```ts
export function sayHelloTo(name: string) {
  const roSay = `Hello, ${name}`;
  return roSay;
}
```

- src/modules/bye.ts

```ts
export function sayByeTo(name: string) {
  const roSay = `See you, ${name}`;
  return roSay;
}
```

6. 配置 package.json 的 scripts 字段

```json
{
  //...
  "dev": "rollup -c --environment INCLUDE_DEPS,BUILD:development",
  "build": "rollup -c --environment INCLUDE_DEPS,BUILD:production"
  //..
}
```

7. 执行命令：npm run dev

8. 结果：会输出多个结果文件。
