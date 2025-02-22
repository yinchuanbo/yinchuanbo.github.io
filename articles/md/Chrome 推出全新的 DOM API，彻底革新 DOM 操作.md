---
title: "Chrome 推出全新的 DOM API，彻底革新 DOM 操作"
tag: "新特性"
time: 2025-02-22 16:25:44
---

随着 Web 应用程序变得越来越复杂，开发者对 DOM 操作的灵活性和效率提出了更高的要求。Chrome 的最新版本（133 版）引入了一个颠覆性的 DOM 操作方法，称为 moveBefore。这一创新特性为前端开发带来了新的可能性。

## 什么是 moveBefore？

moveBefore 是 Chrome 133+ 中引入的一种新的 DOM 操作方法。它的核心功能是在移动 DOM 元素的同时保留其当前状态。这听起来可能只是一个小小的改进，但它实际上解决了传统 DOM 操作中一个长期存在的痛点。

## 传统 DOM 操作的问题

在传统的 DOM 操作中，移动一个元素通常需要先使用 removeChild 将其从父节点中移除，然后再使用 insertBefore 等方法将其重新插入到其他位置。然而，这种方法会导致状态丢失。例如：

- 移动正在播放的视频（嵌入在 iframe 中）会导致视频重新加载
- 移动一个聚焦的输入框会导致焦点丢失
- 在 CSS 动画过程中移动一个元素可能会中断动画

moveBefore 可以优雅地解决这些问题，在移动过程中保留元素状态。

## moveBefore 的语法

moveBefore 的语法与 insertBefore 非常相似，这使得开发者可以轻松迁移现有代码：

```js
parent.moveBefore(node, referenceNode);
```

其中：

parent 是目标元素的父节点

node 是要移动的元素

referenceNode 是 node 将要插入到其前面的节点。如果为 null，node 将被移动到 parent 子节点列表的末尾。

### 示例用法

考虑以下 DOM 结构：

```html
<div id="container">
  <p id="item1">Item 1</p>
  <p id="item2">Item 2</p>
</div>
```

要将 item1 移动到 item2 之后：

```js
const container = document.getElementById("container");

const item1 = document.getElementById("item1");
const item2 = document.getElementById("item2");

container.moveBefore(item1, item2.nextSibling);
```

移动后的 DOM 结构：

```html
<div id="container">
  <p id="item2">Item 2</p>
  <p id="item1">Item 1</p>
</div>
```

### 状态保留的强大之处

moveBefore 真正的厉害之处在于它能够在移动过程中保持元素状态。这在许多情况下至关重要：

### 视频播放场景

传统方法在移动嵌入的 iframe 时会中断视频播放。moveBefore 允许视频连续播放，从而提升用户体验并减少服务器负载。

### 实际应用

1. **拖放操作**：在任务管理应用中实现平滑的拖放功能，移动任务卡片时保留其状态。
2. **动态列表排序**：在电子商务网站或内容管理系统中无缝重新排序列表项，而不会丢失列表项的状态。
3. **创建流畅动画**：通过在保持元素动画状态的同时移动元素，来设计自然而连续的动画。

### 浏览器支持

目前，moveBefore 在 Chrome 133 及以上版本中支持。Safari 和 Firefox 已表示支持此 API，尽管它们的稳定版本中尚未发布。

可以使用以下代码检查浏览器支持：

```js
if (!("moveBefore" in Element.prototype)) {
  console.log("Current browser doesn't support moveBefore");
} else {
  console.log("Current browser supports moveBefore");
}
```

