---
title: "noUiSlider 一款轻量级的 JavaScript 开源滑块库"
tag: "工具集"
---

在前端开发中，滑块控件因其直观性和灵活性而成为常用的界面元素之一。今天，我们将探讨一个流行的开源  `JavaScript`  滑块库—— `noUiSlider` 。

<img src="../imgs/82/01.webp" />

## noUiSlider 是什么？

`noUiSlider`  是一个轻量级的、响应式的  `JavaScript`  范围滑块库，它支持多点触控和键盘操作。它利用 GPU 加速，无需重新流式布局，因此在旧设备上也能保持流畅的性能。此外，它不需要任何外部依赖，能够完美适应响应式设计 。

**特点**

- • **轻量级**：压缩后的 JS 文件大小仅为几 KB。
- • **无障碍支持**：遵循  `WCAG 2.0`  指南，提供键盘导航和  `ARIA`  属性。
- • **跨浏览器兼容**：支持 IE9 及以上版本，以及所有现代浏览器。
- • **响应式设计**：基于  `CSS3` `和HTML5`，能够自动适应不同的屏幕尺寸。
- • **灵活性**：支持连续和非连续的值，以及步长设置。
- • **事件处理**：提供丰富的事件监听选项，方便与应用程序的其他部分进行交互。
- • **API 友好**：提供清晰的`JavaScript API`，易于初始化和控制滑块 。

## 快速开始

### 安装

你可以通过  `npm`  安装  `noUiSlider`：

```sh
npm install nouislider --save
```

或者直接在  `HTML`  文件中引入 CDN：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.3/nouislider.min.js"></script>
```

### 初始化

在  `HTML`  中创建一个滑块容器：

```html
<div id="slider"></div>
```

然后，在  `JavaScript`  中初始化滑块：

```js
var slider = document.getElementById("slider");
noUiSlider.create(slider, {
  start: [20, 80],
  range: {
    min: 0,
    max: 100,
  },
});
```

<img src="../imgs/82/02.webp" />

## 进阶功能

### 滑块类型

`noUiSlider`  支持的多种滑块样式类型，常用的有以下几种

<img src="../imgs/82/03.webp" />

**多手柄滑块**

<img src="../imgs/82/04.webp" />

**非线性滑块**

<img src="../imgs/82/05.webp" />

`noUiSlider`  还提供了丰富的 API，包括事件监听、值的获取和设置、滑块的启用和禁用等。支持响应式设计，可以很好地适应不同的屏幕尺寸和设备。`noUiSlider`  的样式可以通过 CSS 进行定制，来满足项目的需求。可以使用预定义的类或者直接通过  `CSS`  来改变滑块的外观

## 应用场景

应用于各种  `Web`  应用程序中，以增强用户界面的交互性和视觉吸引力。以下是一些实际应用案例：

- **在线预订系统**：在酒店或航班预订网站上，可以用来让用户选择入住日期或飞行时间的范围。
- **价格过滤器**：电子商务网站常用  `noUiSlider`  作为价格筛选工具，允许用户滑动以选择特定价格区间内的产品。
- **音量控制**：音乐播放器或视频平台可能会使用  `noUiSlider`  来提供精细的音量调节。
- **颜色选择器**：图形设计软件或在线配色工具中，`noUiSlider`  可以用来选择颜色的亮度或饱和度。
- **自定义表单**：在需要用户输入数值范围的表单中，`noUiSlider`  提供了一种直观的输入方式。

## 结论

`noUiSlider`  是一个功能强大且高度可定制的滑块库，适用于各种  `Web`  项目。它的轻量级和高性能使其成为实现滑块控件的理想选择。无论是用于数据输入、界面控制还是动态展示，`noUiSlider`  都能提供出色的用户体验。
