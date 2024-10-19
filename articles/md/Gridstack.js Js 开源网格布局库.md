---
title: "Gridstack.js Js 开源网格布局库"
tag: "工具集"
---

## Gridstack.js 是什么？

`Gridstack.js`  是一个非常强大的  `JavaScript`  开源库，允许开发者通过简单的代码创建可拖拽、可调整大小的网格布局。这个库非常适合用来构建交互式的仪表板和复杂的用户界面。

下面，我们将从基础到高级，逐步探索  `Gridstack.js`  的使用和功能。

## 基础入门

首先，你需要在你的项目中安装  `Gridstack.js`。可以通过  `npm`  来安装：

```sh
npm install gridstack
```

下面示例我们使用  `CDN`，在你的  `HTML`  文件中引入  `Gridstack.js`  和  `Gridstack.css`：

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/gridstack.js/7.2.3/gridstack.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gridstack.js/7.2.3/gridstack-all.js"></script>
```

接下来，你可以创建一个基础的网格布局：

```html
<div class="grid-stack"></div>
```

在  `JavaScript`  中，你可以初始化  `Gridstack`  实例并加载一些预定义的网格项：

```js
const grid = GridStack.init({
  cellHeight: 80,
  margin: 10,
  minRow: 5, // 确保网格至少有5行高
});
grid.load([
  { x: 0, y: 0, width: 4, height: 2, content: "1" },
  { x: 4, y: 0, width: 4, height: 4, content: "2" },
  { x: 8, y: 0, width: 4, height: 2, content: "3" },
  { x: 0, y: 2, width: 4, height: 2, content: "4" },
  { x: 8, y: 2, width: 4, height: 2, content: "5" },
]);
```

<img ssrc="../imgs/76/02.gif" />

## 进阶使用

`Gridstack.js`  提供了许多高级功能，比如响应式布局、嵌套网格、保存和恢复布局等。你可以通过设置不同的选项来定制网格的行为。例如，你可以设置网格的列数、单元格高度、垂直边距等：

```js
var grid = GridStack.init({
  column: 6, // 设置网格列数
  cellHeight: 80, // 设置单元格高度
  verticalMargin: 20, // 设置垂直边距
  float: true，
  animate: true, // 启用动画
});
```

### 动态操作

`Gridstack.js`  也支持动态地添加、移除和更新网格项。你可以使用  `addWidget`、`removeWidget`  和  `update`  方法来操作网格：

```js
// 添加一个新的网格项
grid.addWidget({ x: 0, y: 0, w: 2, h: 2, content: "新组件" });

// 移除一个网格项
grid.removeWidget(document.querySelector(".grid-stack-item"));

// 更新一个网格项
grid.update(document.querySelector(".grid-stack-item"), { w: 3, h: 3 });
```

### 事件监听

`Gridstack.js`  提供了丰富的事件监听机制，可以用来监听网格项的变化，如添加、移除、拖拽开始、拖拽停止等：

```js
grid.on("change", function (event, items) {
  console.log("网格布局发生了变化", items);
});

grid.on("added", function (event, items) {
  console.log("添加了新的网格项", items);
});

grid.on("removed", function (event, items) {
  console.log("移除了网格项", items);
});
```

## 结论

`Gridstack.js`  是一个功能丰富、易于使用的前端库，它可以帮助开发者快速构建出响应式、交互式的网格布局。无论是简单的仪表板还是复杂的用户界面，`Gridstack.js`  都能提供支持。

到这里，你应该已经对  `Gridstack.js`  有了基本的了解，并且可以开始在你的项目中使用它了。
