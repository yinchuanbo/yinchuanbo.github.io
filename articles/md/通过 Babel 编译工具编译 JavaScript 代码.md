---
title: "通过 Babel 编译工具编译 JavaScript 代码"
tag: "TypeScript + React"
---

1. 执行命令

```sh
npm init
```

2. 继续添加 Babel 编译工具的核心功能模块，具体包括 `@babel/core` 、`@babel/cli` 和 `@babel/preset-env`。

- `@babel/core`: Babel 编译工具的核心功能

- `@babel/cli`: 一个能够在命令行终端（终端控制台）中使用的工具

- `@babel/preset-env`: 插件和预设功能模块，如代码转换功能

安装如上功能：

```sh
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

3. 在根目录下新建 `babel.config.json` 文件，

```json
// babel.config.json
// 适用于 babel 7.8.0 以上版本
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "node": "current"
        },
        "useBuiltIns": "usage",
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ]
}
```

4. 下面添加一个用于将 ES6 箭头语法转化为 ES5 的官方插件 `@babel/plugin-transform-arrow-functions`

```sh
npm install --save-dev @babel/plugin-transform-arrow-functions
```

5. 更新配置文件

```json
// babel.config.json
// 适用于 babel 7.8.0 以上版本
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "node": "current"
        },
        "useBuiltIns": "usage",
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ],
  "plugins": ["@babel/plugin-transform-arrow-functions"]
}
```

6. 在终端执行命令

```sh
babel src --out-dir lib
```
