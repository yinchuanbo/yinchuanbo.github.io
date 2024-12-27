---
title: "Vue3 的这个配置一定要打开"
tag: "前端工程化"
time: 2024-12-27 09:38:08
---

## 看别人代码会发疯

相信大部分同学都有类似的`经历`吧：

公司的团队中有人`离职`了或者很久以前的`老项目`需要迭代更新一些新的功能，就需要还活着的开发人员来接手他们的代码 🤣

没错，我就是那个还活着的开发人员！

就拿我最近接手的一个项目来说吧，项目采用 `Vue3` + `Vite` + `Ts` + `Naive UI` 做的架构，其中的各种 `import` 的引入真的是看的我眼花缭乱 😅

当然，有些必要的引入，比如`自定义组件`、`自定义方法`的引入或者一些`第三方库`的引入等这些没办法避免

但是`Vue`的相关依赖，以及组件库中`组件`的导入，我们完全可以通过一些插件式的配置来避免每个组件中重复的引入：

```js
import { ref, reactive, watch, ... } from 'vue';
import { NConfigProvider, NInput, NDatePicker, NSpace, ... } from 'naive-ui'
```

那么怎么让这些依赖和组件实现`自动引入`呢？

可能之前有很多同学了解过这个插件，但是考虑还是有很多人不知道怎么用，所以今天就来分享一下

## 插件 unplugin-auto-import

`unplugin-auto-import` 是一个用于 `Vue` 或 `Vanilla Composition API` 的自动导入 Vue 核心库（如：Vue, Vue Utility Types, Composables）组件和 API 的插件。

`unplugin-auto-import` 是基于 `unimport` 开发，这个插件可以帮助开发者在代码中直接使用`Vue`核心库的功能，而不需要`显式地导入`它们。

这样可以使代码变得更加简洁和高效，同时也可以减少打字和重复代码的出现。

## 怎么配置

就拿我接手的项目来说，是用的 `Vite`，只需要简单的几部配置，就可以直接干掉项目中几百行的`重复代码`：

### 安装

```sh
npm i -D unplugin-auto-import
```

### vite.config.ts 配置

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({ /* options */ }),
  ],
})
```

### 干掉引入的代码

```js
//import { ref, reactive, watch, ... } from 'vue'
//import { NConfigProvider, NInput, NDatePicker, NSpace, ... } from 'naive-ui'
```

## 不止 Vue、Vite

当然，这个插件不仅仅是适用`Vue`和`Vite`，官方的介绍是：

> 按需自动导入`Vite`，`Webpack`，`Rspack`，`Rollup` 和 `esbuild` API，并且支持 `TypeScript`

也就是说，我可以在大部分用了以上的构建工具的开发框架中去使用了，比如 `React`:

```jsx
//import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <div>{ count }</div>
}
```

更多支持的配置信息可以参考官方文档：`https://github.com/unplugin/unplugin-auto-import#readme`

<img src="../imgs/128/01.webp" />

## 支持 TypeScript 类型引入

如果你的项目中使用了`TypeScript`，只需要设置 `dts: true` 即可：

```js
AutoImport({
  dts: true // or a custom path
})
```

插件会在项目根目录生成类型文件 `auto-imports.d.ts`，

`unplugin-auto-import` 插件会根据预设内容，生成对应的全局类型声明

但是要确保该文件在 `tsconfig` 中被 `include`

## 一点建议

并不是所有的依赖都适合去做自动引入，比如一些`全局的方法`和`变量`等，如果做了自动引入，可能会让新加入项目的同学增加阅读代码的`时间成本`，`降低代码可读性`等。

适合引入的比如像一些`通用的APi`，大部分开发者都是知晓的内容适合做自动引入