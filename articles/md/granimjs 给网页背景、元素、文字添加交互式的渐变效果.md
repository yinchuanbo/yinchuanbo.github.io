---
title: "granimjs 给网页背景、元素、文字添加交互式的渐变效果"
tag: "工具集"
---

granim.js 是一个开源 JavaScript 库，专门用于创建流畅和交互式的渐变动画。这些动画可以作为网页的背景，也可以给其他元素添加渐变动画，如按钮或滑块的视觉反馈。还可以为文字加上渐变效果，为用户带来视觉上的吸引力。

<img src="../imgs/84/01.gif" />

示例代码：

基础渐变动画

<img src="../imgs/84/02.gif" />

```js
// js
var granimInstance = new Granim({
  element: "#canvas-basic",
  direction: "diagonal",
  isPausedWhenNotInView: true,
  states: {
    "default-state": {
      gradients: [
        ["#ff9966", "#ff5e62"],
        ["#00F260", "#0575E6"],
        ["#e1eec3", "#f05053"],
      ],
    },
  },
});
```

复杂渐变动画

<img src="../imgs/84/03.gif" />

```js
var granimInstance = new Granim({
  element: "#canvas-complex",
  direction: "left-right",
  isPausedWhenNotInView: true,
  states: {
    "default-state": {
      gradients: [
        [
          { color: "#833ab4", pos: 0.2 },
          { color: "#fd1d1d", pos: 0.8 },
          { color: "#38ef7d", pos: 1 },
        ],
        [
          { color: "#40e0d0", pos: 0 },
          { color: "#ff8c00", pos: 0.2 },
          { color: "#ff0080", pos: 0.75 },
        ],
      ],
    },
  },
});
```

带图像和混合模式的渐变动画

<img src="../imgs/84/04.gif" />

```js
var granimInstance = new Granim({
    element: '#canvas-image-blending',
    direction: 'top-bottom',
    isPausedWhenNotInView: true,
    image : {
        source: '../assets/img/bg-forest.jpg',
        blendingMode: 'multiply'
    },
    states : {
        "default-state": {
            gradients: [
                ['#29323c', '#485563'],
                ['#FF6B6B', '#556270'],
                ['#80d3fe', '#7ea0c4'],
                ['#f0ab51', '#eceba3']
            ],
            transitionSpeed: 7000
        }
    }
}
```

文字图像蒙层渐变

<img src="../imgs/84/05.gif" />

```js
var granimInstance = new Granim({
  element: "#logo-canvas",
  direction: "left-right",
  states: {
    "default-state": {
      gradients: [
        ["#EB3349", "#F45C43"],
        ["#FF8008", "#FFC837"],
        ["#4CB8C4", "#3CD3AD"],
        ["#24C6DC", "#514A9D"],
        ["#FF512F", "#DD2476"],
        ["#DA22FF", "#9733EE"],
      ],
      transitionSpeed: 2000,
    },
  },
});
```

## API 介绍：

### 选项 (Options)

- `element` (必需): 指定用于渐变动画的 canvas 元素的 CSS 选择器或 HTMLCanvasElement。
- `name`: 用于设置深色/浅色主题的类名前缀。
- `elToSetClassOn`: 设置深色/浅色类名的元素。
- `direction`: 渐变的方向，可选项包括 'diagonal'、'left-right'、'top-bottom'、'radial' 或 'custom'。
- `customDirection`: 自定义渐变方向的对象。
- `isPausedWhenNotInView`: 当动画不在视窗内时是否暂停。
- `scrollDebounceThreshold`: 滚动时的防抖阈值。
- `stateTransitionSpeed`: 状态转换的动画时长。
- `defaultStateName`: 默认状态的名称。
- `states` (必需): 包含所有状态的对象。
- `image`: 包含图像选项的对象。

### 状态 (States)

- `gradients` (必需): 定义渐变颜色和位置的数组。
- `transitionSpeed`: 每个渐变之间的过渡时长。
- `loop`: 动画到达最后一个渐变后是否循环。

### 图像 (Image)

- `source` (必需): 图像的源地址。
- `position`: 图像在 canvas 中的位置。
- `stretchMode`: 图像是否拉伸以适应大小。
- `blendingMode`: 图像与渐变的混合模式。

### 回调函数 (Callbacks)

- `onStart`: 动画开始时触发。
- `onGradientChange`: 渐变变化时触发。
- `onEnd`: 动画结束时触发。

### 事件 (Emitted Events)

- 监听关键事件，如 'granim:start'、'granim:end'、'granim:loop' 和 'granim:gradientChange'。

### 方法 (Methods)

- `play()`: 播放动画。
- `pause()`: 暂停动画。
- `clear()`: 停止动画并清除渐变。
- `changeState(stateName)`: 更改状态。
- `changeDirection(directionName)`: 更改方向。
- `changeBlendingMode(blendingModeName)`: 更改混合模式。
- `destroy()`: 销毁实例并移除事件监听器。
