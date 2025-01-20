---
title: "你还不会调试线上 vue 组件"
tag: "Vue"
time: 2025-01-20 16:54:01
---

## 案例演示

让我们以 `element-ui` 官网为例

先看下此时的 `chrome devtools` 是没有 `Vue` 的选项卡的

<img src="../imgs/139/01.webp" />

## 一段神奇的代码

其实很简单,我们只需要打开控制台,运行一下以下代码

```js
var Vue, walker, node;
walker = document.createTreeWalker(document.body, 1);
while ((node = walker.nextNode())) {
  if (node.__vue__) {
    Vue = node.__vue__.$options._base;
    if (!Vue.config.devtools) {
      Vue.config.devtools = true;
      if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit("init", Vue);
        console.log("==> vue devtools now is enabled");
      }
    }
    break;
  }
}
```

<img src="../imgs/139/02.webp" />

显示 `vue devtools now is enabled`

证明我们已经成功开启了 `vue devtools`

## 功能验证

然后再重启一下 `chrome devtool` 看下效果

<img src="../imgs/139/03.webp" />

我们会发现此时多了一个 `Vue` 选项卡,功能也和我们本地调试一样使用

对于遇到 `vue` 线上问题调试,真的非常好用!

## vue3

最近无意间又看到了这段代码,适配 `vue3` 亲测 `vben` 能用 https://vben.vvbin.cn/#/login?redirect=/dashboard

<img src="../imgs/139/04.webp" />

```js
const el = document.querySelector("#app");
const vm = el.__vue_app__;

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.push({
  app: vm,
  version: vm.version,
  types: {
    Comment: Symbol("Comment"),
    Fragment: Symbol("Fragment"),
    Static: Symbol("Static"),
    Text: Symbol("Text"),
  },
});
if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit("init", vm);
  console.log("==> vue devtools now is enabled");
}
```
