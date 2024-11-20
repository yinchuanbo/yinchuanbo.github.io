---
title: "解决前端PC页面受系统及浏览器百分比影响导致的样式问题"
tag: "疑难问题"
time: 2024-11-20 10:14:07
---

## 背 景：

PC 项目上线后、用户反馈在笔记本上显示异常，根据反馈发现，笔记本分辨率是 2k 分辨率，系统推荐用户设置缩放百分比为 150%，因此，浏览器也跟系统比例进行了放大，导致根据设计稿开发的部分页面出现了滚动条；那么肯定会有人说自适应呀，其实针对这样的问题自适应也能解决（会给用户的感觉可能跟使用老年手机一样，字体什么的都放大了，虽然没有滑动条，但是换行了，表格展示窗口小了等等问题），如果系统缩放比大于 150% 达到 200%、300%，怎么搞？

个人比较懒，本来想在网上找一个拿来即用的方案，发现没有，面对那么多页面我又不想挨个调整，于是 idea 就来了,废话不多说，上方案。

## 方案思路：

问题是比例被放大导致的，那就反其道行之

```js
const scale = window.devicePixelRatio；
const changeScale = 1 / scale
const body = document.body;
body.style.zoom = changeScale;
```

无论初始百分比多大页面展示始终为

```js
devicePixelRatio = 1;
```

但是，光仅仅几行代码肯定是不行的，比如：你页面中使用了 calc 等相关计算宽高的逻辑，其也会随着缩放而变化；解决办法来了，利用 css 变量, 例如：

```css
:root {
  --scale-num: 1;
}
.ant-pro-grid-content {
  height: calc(
    (100vh - (24px + 76px + 24px) * var(--scale-num)) / var(--scale-num)
  );
}
```

根据各自项目，可以把需要调整的样式移到 style.css 文件里面，之所以不用非 css 的样式是因为不好处理, 因为我懒的研究了。重点来了，你需要把你的 style.css 文件引入主入口文件 main.js，并设置如下代码：

```js
document.documentElement.style.setProperty(
  "--scale-num",
  `${1 / window.devicePixelRatio}`
);
```
