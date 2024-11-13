---
title: "parallel-wait-run 一个并行运行多个 npm scripts 的小工具"
tag: "NodeJS"
time: 2024-11-13 21:51:36
---

## 它是什么

`parallel-wait-run`支持同时运行多个`npm scripts`，并且可以通过自定义的异步函数控制每一个`npm scripts`的启动时机。

<img src="../imgs/102/02.webp" />

上述终端运行截图的[仓库地址](https://github.com/LiuWenXing1996/parallel-example)

## 安装

```sh
# npm
npm install -D parallel-wait-run

# pnpm
pnpm add -D parallel-wait-run

# yarn
yarn add -D parallel-wait-run
```

## 配置

在项目根目录添加配置文件 `parallel.config.ts`（也支持其他`JS`和`TS`扩展名）

```ts
import { defineConfig } from "parallel-wait-run";

export default defineConfig({
  scripts: [
    {
      name: "dev",
      command: `dev command`,
      wait: async () => {
        sleep(1000);
        return true;
      },
    },
    {
      name: `unit-test`,
      command: `unit-test command`,
      wait: async () => {
        sleep(2000);
        return true;
      },
    },
  ],
});
```

也支持使用函数生成配置

```ts
import { defineConfig } from "parallel-wait-run";

export default defineConfig(({ mode, root }) => {
  return {
    scripts: [
      {
        name: "dev",
        command: `pnpm  dev`,
      },
      {
        name: `unit-test`,
        command: `pnpm test-watch`,
      },
    ],
  };
});
```

异步函数也是支持的

```ts
import { defineConfig } from "parallel-wait-run";

export default defineConfig(async ({ mode, root }) => {
  return {
    scripts: [
      {
        name: "dev",
        command: `pnpm  dev`,
      },
      {
        name: `unit-test`,
        command: `pnpm test-watch`,
      },
    ],
  };
});
```

## 运行

```sh
# npm
npm run parallel

# pnpm
pnpm parallel

# yarn
yarn parallel
```

更多配置内容，请参考[文档](https://www.npmjs.com/package/parallel-wait-run)
