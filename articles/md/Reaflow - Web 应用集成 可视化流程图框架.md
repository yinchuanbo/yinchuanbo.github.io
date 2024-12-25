---
title: "Reaflow - Web 应用集成 可视化流程图框架"
tag: "工具集"
time: 2024-12-25 21:16:51
---

Reaflow 是一个强大灵活的图表流程图框架，适用于需要在 Web 应用中集成复杂图表和流程图的场景，除此之外，还可以构建工作流编辑器。Reaflow 的核心优势在于其模块化设计和高度的可定制性，使其能够适应各种不同的应用场景。

## 安装使用：

```sh
npm install reaflow --save
```

```jsx
import React from'react';
import { Canvas } from'reaflow';
const nodes = [
  {
    id: '1',
    text: '1'
  },
  {
    id: '2',
    text: '2'
  }
];
const edges = [
  {
    id: '1-2',
    from: '1',
    to: '2'
  }
];
exportconst MyDiagram = () => (
<Canvas
    nodes={nodes}
    edges={edges}
  />
);
```

## 示例展示：

### 自定义节点样式：

<img src="../imgs/127/01.webp" />

### 多节点：

<img src="../imgs/127/02.webp" />

### 嵌套节点：

<img src="../imgs/127/03.webp" />

### 节点内容为网页元素：

<img src="../imgs/127/04.webp" />

### 自定义拖拽新增节点：

<img src="../imgs/127/05.webp" />

## 部分 Reaflow 配置：

### Canvas 组件

nodes: 要在画布上渲染的节点数组。

edges: 要在画布上渲染的边数组。

selections: 用于选择的节点/边的键数组。

pannable: 画布是否可以平移。

panType: 平移时使用的交互类型。

zoomable: 画布是否可以缩放。

defaultPosition: 画布加载时的位置。

fit: 加载时是否适应画布。

maxHeight: 画布可滚动区域的最大高度。

maxWidth: 画布可滚动区域的最大宽度。

zoom: 缩放因子。

layoutOptions: ELKJS 布局选项。

onLayoutChange: 布局变化时的回调函数。

className: 容器的 CSS 类名。

animated: 节点/边是否动画。

width: 画布的静态宽度。

readonly: 是否可以拖动连接。

dragNode: 拖动节点的元素。

arrow: 边显示的箭头。

node: 节点或回调以返回元素。

edge: 边或回调以返回元素。

onMouseEnter: 鼠标进入画布时的回调函数。

onMouseLeave: 鼠标离开画布时的回调函数。

onCanvasClick: 画布被点击时的回调函数。

ref: CanvasRef 的引用。

### Node 组件

id: 节点的标识符。

height: 节点的高度。

width: 节点的宽度。

offsetX: 节点的 x 轴偏移量。

offsetY: 节点的 y 轴偏移量。

properties: 节点数据。

className: 节点的 CSS 类名。

style: 节点的样式。

parent: 节点的父节点。

animated: 节点是否动画。

draggable: 节点是否可拖动。

linkable: 节点是否可链接。

selectable: 节点是否可选中。

removable: 节点是否可移除。

dragType: 拖动类型。

dragCursor: 拖动时的光标样式。

nodes: 节点数据数组。

edges: 边数据数组。

onRemove: 节点被移除时的回调函数。

onClick: 节点被点击时的回调函数。

onDrag: 拖动时的回调函数。

## 功能和特性：

复杂自动布局：Reaflow 利用 ELKJS 库提供复杂的自动布局功能，这意味着开发者可以创建复杂的图表和流程图，而无需手动调整节点的位置。

节点/边/端口定制：开发者可以轻松定制节点、边和端口的外观和行为，以适应特定的设计需求。

缩放/平移/居中控制：提供了内置的缩放、平移和居中控制功能，增强了用户的交互体验。

拖放连接和重新排列：支持拖放节点和端口进行连接，以及重新排列图表中的元素。

节点/边的嵌套：允许开发者创建嵌套的节点和边，以构建层次化的图表结构。

基于邻近性的节点链接辅助：提供辅助功能，帮助开发者基于节点的邻近性创建链接。

节点/边选择辅助：提供选择辅助功能，方便开发者处理节点和边的选择逻辑。

撤销/重做助手：内置撤销和重做功能，使用户能够轻松撤销或重做他们的操作。
