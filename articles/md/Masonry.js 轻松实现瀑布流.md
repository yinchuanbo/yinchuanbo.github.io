---
title: "瀑布流插件 Masonry.js: 轻松在你的网站实现瀑布流布局"
tag: "前端工具集"
---

<img src="../imgs/02/01.png" />

## 什么是 Maronry

<img src="../imgs/02/02.webp" />

**Masonry**  是一个  **JavaScript**  网格布局库。它的工作原理是根据可用的垂直空间将元素放置在最佳位置，有点像泥瓦匠在墙上安装石头。我们在互联网上也许看到过很多瀑布流的案例.

接下来给大家演示一个使用案例:

<img src="../imgs/02/01.gif" />

另一个比较有意思的案例:

<img src="../imgs/02/02.gif" />

当我们动态添加元素的时候, 它可以智能的安排好元素的位置.

再联想一下, 我们玩的消消乐小游戏和拼图类小游戏, 是不是也能用它一键实现呢?

<img src="../imgs/02/03.gif" />

## 如何使用 Maronry

**Maronry**  支持  **CDN**  导入和  **npm**  安装使用, 这里我介绍一下  **npm**  的安装和使用方式.

```sh
npm install masonry-layout
```

我们安装好之后可以先编写一下  `html`  结构:

```html
<div class="grid">
  <div class="grid-item">FlowMix</div>
  <div class="grid-item grid-item--width2">H5</div>
  <div class="grid-item">Dooring</div>
</div>
```

接下来我们就可以直接使用这个库来初始化瀑布流布局了:

```js
var elem = document.querySelector(".grid");
var msnry = new Masonry(elem, {
  // options
  itemSelector: ".grid-item",
  columnWidth: 200,
});

// 元素参数是一个选择器字符串
var msnry = new Masonry(".grid", {
  // options
});
```

使用起来就是这么简单, 当然文档上还有很多高级用法, 我们也可以学习参考一下:

`https://masonry.desandro.com/`

## 分享几个更高级的案例

1. **瀑布流布局动画**

<img src="../imgs/02/04.gif" />

2. 瀑布流 3D 动画

<img src="../imgs/02/05.gif" />

最后

上述项目的 GitHub 地址:

**https://github.com/desandro/masonry**
