---
title: "通过 Babel 编译工具编译 TypeScript 代码"
tag: "TypeScript + React"
---

在 Babel 7.15 中，添加了对 TypeScript 语言的支持，只需要添加 `@babel/preset-typescript` 模块，就可以完成该功能。

### 添加 @babel/preset-typescript 模块

```sh
npm install --save-dev @babel/preset-typescript
```

另外，在某些场景下，需要添加 `@babel/plugin-proposal-class-properties` 和 `@babel/plugin-proposal-object-rest-spread` 插件，这两个插件分别用于转换语法特性 “类属性” 和 “对象扩展”。

```sh
npm install --save-dev @babel/plugin-proposal-class-properties
npm install --save-dev @babel/plugin-proposal-object-rest-spread
```

### 更新 babel.config.json 配置文件

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
    ],
    "@babel/typescript"
  ],
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
```

### 通过 `tsc --init` 命令初始化一个 tsconfig 配置文件，用于实现自动编译 TypeScript 代码功能。

### 在 package.json 中，添加 scripts 字段

```json
{
  //...
  "scripts": {
    "babel": "babel src --out-dir lib --extensions \".ts\""
  }
}
```

- src: 指定源文件目录

- --out-dir: 指定输出目录为 lib

- --extensions: 指定需要编译目标文件的后缀