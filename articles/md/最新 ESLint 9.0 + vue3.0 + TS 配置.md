---
title: "最新 ESLint 9.0 + vue3.0 + TS 配置"
tag: "前端工程化"
---

### package.json 文件

eslint 相关的包

1. @eslint/js
2. eslint
3. eslint-plugin-vue
4. typescript-eslint
5. vite-plugin-eslint

```json
{
  "name": "mzong-books",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.11"
  },
  "devDependencies": {
    "@eslint/js": "^9.1.1", // eslint官方包
    "@types/node": "^20.10.5",
    "@vitejs/plugin-vue": "^4.5.2",
    "eslint": "^9.1.1", // eslint官方包
    "eslint-plugin-vue": "^9.25.0", // Vue.js 的官方 ESLint 插件。这个插件允许我们使用 ESLint 检查文件的`<template>`和，以及文件中的 Vue 代码。`<script>``.vue``.js`
    "typescript": "^5.2.2",
    "typescript-eslint": "^7.7.1", // ts-eslint解析器，使 eslint 可以解析 ts 语法
    "vite": "^5.0.8",
    "vite-plugin-eslint": "^1.8.1", //  用于vite启动的时候，校验eslint，会在控制台显示具体信息
    "vue-tsc": "^1.8.25"
  }
}
```

### vite.config.ts 文件

这里主要是引用 `vite-plugin-eslint`，使 vite 启动的时候可以校验 eslint 信息

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      // do not fail on serve (i.e. local development)
      ...eslint({
        failOnWarning: false,
        failOnError: false,
      }),
      apply: "serve",
      enforce: "post",
    },
  ],
});
```

### eslint.config.js 文件

```js
// 引入vue模版的eslint
import pluginVue from "eslint-plugin-vue";
import eslint from "@eslint/js";
// ts-eslint解析器，使 eslint 可以解析 ts 语法
import tseslint from "typescript-eslint";
// vue文件解析器
import vueParser from "vue-eslint-parser";
export default tseslint.config({
  // tseslint.config添加了extends扁平函数，直接用。否则是eslint9.0版本是没有extends的
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/essential"], // vue3推荐的eslint配置
  ],
  languageOptions: {
    parser: vueParser, // 使用vue解析器，这个可以识别vue文件
    parserOptions: {
      parser: tseslint.parser, // 在vue文件上使用ts解析器
      sourceType: "module",
    },
  },
  rules: {
    semi: ["warn", "never"],
    "comma-dangle": ["error", "never"],
    "no-unused-vars": 2,
    "space-before-function-paren": 0,
    "generator-star-spacing": "off",
    "object-curly-spacing": 0, // 强制在大括号中使用一致的空格
    "array-bracket-spacing": 0, // 方括号
  },
});
```

### 校验

在组件上随便一个规则

```html
<script setup lang="ts">
import { ref } from 'vue'
const text = { a: 1, b: "2" }
</script>
```
