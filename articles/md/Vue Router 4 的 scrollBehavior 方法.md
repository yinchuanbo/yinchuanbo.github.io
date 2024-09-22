---
title: "Vue Router 4 的 scrollBehavior 方法"
tag: "Vue"
---

在构建现代 Web 应用时，单页应用（SPA）已经成为主流。Vue 作为一款灵活且强大的前端框架，结合 Vue Router，能够帮助开发者轻松处理页面导航。而在实际应用中，页面导航后的滚动行为对用户体验的影响至关重要。例如，用户希望在切换页面时自动滚动到顶部、在返回之前的页面时保持原有滚动位置，或者导航到页面的特定锚点。为此，Vue Router 提供了 `scrollBehavior` 方法，帮助开发者实现自定义的滚动行为。

本文将深入分析 `scrollBehavior` 的应用场景，并结合 Vue 3 和 Vue Router 4 提供可运行的代码示例，演示如何使用这一功能来改善用户体验。

## 什么是 `scrollBehavior`？

`scrollBehavior` 是 Vue Router 4 提供的一个配置选项，用于控制路由导航时页面的滚动行为。通过 `scrollBehavior`，开发者可以自定义页面导航后的滚动位置，比如回到页面顶部、滚动到某个特定的锚点或者恢复到之前的滚动位置。

### 参数介绍：

- **`to`**: 目标路由对象，表示即将导航到的路由。
- **`from`**: 当前路由对象，表示正在离开的路由。
- **`savedPosition`**: 保存的滚动位置，仅在使用浏览器的前进/后退按钮时生效。如果通过编程方式跳转，该参数为 `null`。

### 返回值：

- 可以返回滚动位置的对象，例如 `{ top: 0 }` 表示滚动到页面顶部。
- 可以返回 `null` 表示保持当前的滚动位置不变。
- 可以返回 `savedPosition` 恢复用户离开页面时的滚动位置。
- 可以返回 `{ el: to.hash }`，让页面滚动到某个 DOM 元素，通常是锚点。

## 使用场景

### 1\. 页面导航后自动回到顶部

在一些页面较长的应用中，用户可能会滚动到底部。当用户切换到另一个页面时，期望页面自动滚动到顶部，而不是保持在之前的滚动位置。这对于用户体验至关重要，特别是在手机端的小屏幕设备上。

### 2\. 恢复之前的滚动位置

在某些情况下，当用户从一个页面导航到另一个页面后，再次返回原页面时，期望回到离开时的滚动位置。例如，在商品列表页面滚动查看多个商品后，用户点击查看某个商品的详情，再返回商品列表时，应该回到之前浏览到的商品位置，而不是从页面顶部重新开始。

### 3\. 导航到页面的锚点

在一些文档类页面中，导航可能需要定位到页面的某个特定部分（例如章节）。这时候，可以利用 `scrollBehavior` 实现跳转到页面的锚点。

## 在 Vue 3 和 Vue Router 4 中的使用

在 Vue 3 和 Vue Router 4 中，`scrollBehavior` 的 API 基本保持了 Vue 2 的形式，但引入了一些现代化的改进，如 `el` 选择器的支持和更好的异步处理机制。

### 项目初始化

首先，确保项目已经安装了 Vue 3 和 Vue Router 4：

```sh
npm install vue-router@4
```

### 基本的 `scrollBehavior` 配置

```js
import { createRouter, createWebHistory } from 'vue-router';
​
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 路由配置
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // 返回之前保存的位置（前进/后退）
    } else if (to.hash) {
      // 如果有 hash 锚点，则滚动到指定元素
      return { el: to.hash, behavior: 'smooth' };
    } else {
      // 默认情况下滚动到页面顶部
      return { top: 0 };
    }
  }
});
```

### 进一步优化：延迟渲染与滚动

在实际项目中，页面渲染和组件加载可能存在一定的延迟，特别是在异步加载内容时，直接滚动可能会失效。例如，用户导航到带有 `#section1` 的页面时，目标元素可能尚未渲染完成，导致滚动无法生效。

解决方案是引入一个延迟机制，确保页面完全渲染之后再执行滚动操作。

```js
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition;
  } else if (to.hash) {
    // 使用 Promise 延迟滚动操作，确保渲染完成后再滚动
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ el: to.hash, behavior: 'smooth' });
      }, 300); // 延迟 300 毫秒
    });
  } else {
    return { top: 0 };
  }
}
```

通过延迟 300 毫秒，可以确保页面渲染完毕后再执行滚动操作，避免滚动操作失败。

### 代码示例

**main.js 配置路由和 scrollBehavior**

在 `main.js` 中，我们创建路由，并通过 `scrollBehavior` 自定义滚动行为。

```js
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import PageOne from './components/PageOne.vue';
import PageTwo from './components/PageTwo.vue';
import PageThree from './components/PageThree.vue';
​
// 定义路由
const routes = [
  { path: '/page-one', component: PageOne },
  { path: '/page-two', component: PageTwo },
  { path: '/page-three', component: PageThree }
];
​
// 创建路由器实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 返回保存的滚动位置
      return savedPosition;
    } else if (to.hash) {
      // 如果目标路由包含 hash 锚点，滚动到指定锚点
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, behavior: 'smooth' });
        }, 300); // 延迟 300ms，确保页面渲染完成
      });
    } else {
      // 默认滚动到页面顶部
      return { top: 0 };
    }
  }
});
​
// 创建并挂载 Vue 应用
createApp(App).use(router).mount('#app');
```

1. **savedPosition**：如果使用浏览器的前进/后退按钮，Vue Router 会提供保存的滚动位置。通过返回 `savedPosition`，我们可以恢复到用户离开时的位置。

2. **锚点滚动**：如果路由包含 `hash`（例如 `/page-three#section1`），`scrollBehavior` 将会滚动到指定的 DOM 元素并使用平滑滚动。

3. **滚动到顶部**：如果既没有 `savedPosition` 也没有 `hash`，页面将自动滚动到顶部。

**PageOne 页面：**

```html
<template>
  <div>
    <h1>Page One</h1>
    <p>
      This is the first page. It should scroll to the top when navigating here.
    </p>
    <!-- 模拟长页面 -->
    <div style="height: 1500px; background-color: lightblue;"></div>
  </div>
</template>
```

**PageTwo 页面：**

```html
<template>
  <div>
    <h1>Page Two</h1>
    <p>
      This is the second page. It should retain the scroll position when
      navigating back.
    </p>
    <!-- 模拟长页面 -->
    <div style="height: 2000px; background-color: lightgreen;"></div>
  </div>
</template>
```

**PageThree 页面：**

```html
<template>
  <div>
    <h1>Page Three</h1>
    <p>
      This is the third page. Clicking a link should scroll to the specific
      section.
    </p>
    <!-- 模拟长页面 -->
    <div style="height: 800px; background-color: lightgray;">
      Scroll down to see more content.
    </div>
    <!-- 目标锚点 -->
    <h2 id="section1" style="background-color: lightcoral;">
      Section 1 - Scroll to me
    </h2>
    <p>This section should be scrolled to when navigating to #section1.</p>
    <div style="height: 500px; background-color: lightgray;"></div>
  </div>
</template>
```

**App 导航链接**

在 `App.vue` 中，我们提供了跳转到不同页面和带有锚点的页面的导航链接，帮助用户触发滚动行为。

```html
<template>
  <div id="app">
    <nav>
           <router-link to="/page-one">Page One</router-link>      <router-link
        to="/page-two"
        >Page Two</router-link
      >
           <router-link to="/page-three">Page Three</router-link>    
       <router-link to="/page-three#section1">Page Three #Section1</router-link>
    </nav>
       <router-view></router-view>  
  </div>
</template>
​
<style scoped>
  nav {
     margin: 20px 0px;
     position: fixed;
     top: 0;
     left: 0;
     right: 0;
     display: flex;
     justify-content: space-around;
     align-items: center;
  }
</style>
```

- **Page One**：点击链接后，页面会导航到 `PageOne.vue`，并且自动回到页面顶部。
- **Page Two**：点击链接后，页面会导航到 `PageTwo.vue`。如果用户之前在该页面滚动过，再次返回该页面时，页面会恢复之前的滚动位置。
- **Page Three**：点击链接后，页面会导航到 `PageThree.vue`。
- **Page Three #Section1**：点击该链接后，页面会滚动到 `PageThree.vue` 中的 `#section1` 锚点位置。

## 总结

通过本文的详细分析和代码示例，我们展示了如何在 Vue Router 4 中使用 `scrollBehavior` 来处理三种常见的页面滚动需求：

1. 页面切换时自动回到顶部。
2. 浏览器前进/后退时保持页面滚动位置。
3. 页面导航时滚动到指定锚点位置。

使用 `scrollBehavior` 可以显著提升用户在单页应用中的导航体验。通过合适的配置，可以确保在不同场景下，用户的滚动行为符合预期，从而提升页面的友好交互性和用户体验。
