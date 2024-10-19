---
title: "web 端预览 Office 文件的开源项目 vue-office"
tag: "工具集"
---

## 什么是 vue-office

<img src="../imgs/95/15.gif" />

`vue-office`  是一个支持多种文件(docx、.xlsx、pdf)预览的 vue 组件库，支持`vue2`和`vue3`。

我们可以通过如下方式来安装并使用它:

```sh
#docx文档预览组件
npm install @vue-office/docx vue-demi

#excel文档预览组件
npm install @vue-office/excel vue-demi

#pdf文档预览组件
npm install @vue-office/pdf vue-demi
```

## 使用案例:

```html
<template>
  <vue-office-docx
    :src="docx"
    style="height: 100vh;"
    @rendered="renderedHandler"
    @error="errorHandler"
  />
</template>

<script>
  //引入VueOfficeDocx组件
  import VueOfficeDocx from "@vue-office/docx";
  //引入相关样式
  import "@vue-office/docx/lib/index.css";

  export default {
    components: {
      VueOfficeDocx,
    },
    data() {
      return {
        docx: "http://static.shanhuxueyuan.com/test6.docx", //设置文档网络地址，可以是相对地址
      };
    },
    methods: {
      renderedHandler() {
        console.log("渲染完成");
      },
      errorHandler() {
        console.log("渲染失败");
      },
    },
  };
</script>
```

接下来给大家演示一下导入 excel 的效果:

<img src="../imgs/95/14.webp" />

同样的它还能导入 pptx 格式的文件:

<img src="../imgs/95/16.gif" />

## 使用的技术方案

接下来和大家分享一下它用到的技术栈:

1. `@js-preview/docx`，作用：用于处理 docx 文件。
2. `@js-preview/excel`，作用：用于处理 excel 文件。
3. `@js-preview/pdf`，作用：用于处理 pdf 文件。
4. `@vue-office/docx`，作用：用于处理 docx 文件的 Vue 相关实现。
5. `@vue-office/excel`，作用：用于处理 excel 文件的 Vue 相关实现。
6. `@vue-office/pdf`，作用：用于处理 pdf 文件的 Vue 相关实现。
7. `core-js`，作用：JavaScript 标准库的补充。
8. `element-plus`，作用：基于 Vue 的组件库。
9. `vue`，作用：Vue.js 框架核心。
10. `vue-demi`，作用：用于支持 Vue 2 和 Vue 3 的兼容性。
11. `vue-router`，作用：Vue.js 的路由管理。

## 原生支持能力

由上面介绍可以看到, 这个开源项目使用了这三个库:

- @js-preview/docx
- @js-preview/excel
- @js-preview/pdf

那么我们其实也可以基于这三个原生库, 来实现自定义的  `office`  文档预览能力, 虽然我自己亲测下来发现对 excel 的渲染兼容性有待提高, 但是整体上预览能力还是完全够用的.

github 地址: **https://github.com/501351981/vue-office**