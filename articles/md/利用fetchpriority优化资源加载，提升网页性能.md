---
title: "利用fetchpriority优化资源加载，提升网页性能"
tag: "性能优化"
time: 2024-12-07 18:44:28
---

在网页开发中，资源加载的优化一直是提升用户体验的关键环节。 在没有 fetchpriority 之前， [浏览器](https://www.kelen.cc/posts/html-fetch-priority#)对资源的加载优先级有一定的预设规则，但这些规则可能不完全符合我们的优化需求。使用 fetchpriority，我们可以更精确地控制资源的加载顺序，从而优化页面的关键渲染路径（Critical Rendering Path），提升如最大内容绘制（Largest Contentful Paint, LCP）等性能指标。

## 什么是 fetchpriority?

fetchpriority 是一个 HTML 属性，它可以被添加到任何加载资源的 HTML 元素上，如图片、脚本等。 通过这个属性，我们可以告诉浏览器哪些资源更加重要，应该优先加载。 fetchpriority 有三个可选值值：low、high 和默认的 auto。

- low：降低资源的相对优先级。
- high：提高资源的相对优先级。
- auto：默认值，让浏览器决定优先级。

如何使用 fetchpriority 来提高资源加载权重呢？下面举个几个常见的场景。

## 提高图片加载权重

假设我们有一个图片轮播，其中包含了页面的主要内容。我们希望浏览器优先加载当前显示的图片，以提升 LCP 性能。

```html
<!-- 当前显示的图片设置高优先级 -->
<img src="current-image.jpg" fetchpriority="high" />
<!-- 其他轮播图片设置低优先级 -->
<img src="other-image1.jpg" fetchpriority="low" />
<img src="other-image2.jpg" fetchpriority="low" />
```

## 优化延迟加载的图片

对于使用 `loading="lazy"` 属性的延迟加载图片，我们可以通过 `fetchpriority` 来优化它们的加载顺序。

```html
<!-- 延迟加载的图片，优先加载主要内容图片 -->
<img src="main-content-image.jpg" loading="lazy" fetchpriority="high" />
<!-- 其他延迟加载的图片 -->
<img src="lazy-image1.jpg" loading="lazy" fetchpriority="low" />
<img src="lazy-image2.jpg" loading="lazy" fetchpriority="low" />
```

## JS 资源的加载优先级

对于 JS 资源，我们可以使用 `fetchpriority` 来调整它们的加载顺序，确保关键脚本首先被加载。

```html
<!-- 重要的JavaScript脚本 -->
<script src="critical.js" fetchpriority="high"></script>
<!-- 较不重要的JavaScript脚本 -->
<script src="non-critical.js" fetchpriority="low"></script>
```

## fetch 请求优先级

可以使用 `fetchpriority` 来设置 fetch 请求的优先级。

```js
// 高优先级的fetch请求，用于获取主要内容
fetch("https://api.example.com/content", { fetchpriority: "high" })
  .then((response) => response.json())
  .then((data) => console.log("Main content:", data));
// 低优先级的fetch请求，用于获取评论
fetch("https://api.example.com/comments", { fetchpriority: "low" })
  .then((response) => response.json())
  .then((data) => console.log("Comments:", data));
```

fetchpriority 为我们提供了一个强大的工具来优化资源加载，从而提升网页的性能和用户体验。虽然 [浏览器](https://www.kelen.cc/posts/html-fetch-priority#)支持该属性，但是也要适当使用，不要滥用，过度使用反而会适得其反。