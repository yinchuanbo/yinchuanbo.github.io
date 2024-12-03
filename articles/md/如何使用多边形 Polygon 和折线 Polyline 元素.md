---
title: "如何使用多边形 Polygon 和折线 Polyline 元素"
tag: "Svg"
time: 2024-12-03 20:55:06
---

在这个示例中，我们将结合之前学到的所有内容。这里我们使用了圆形、矩形、直线、折线和多边形。

我们从正面开始。请注意，不仅墙元素上有类名，整个 SVG 元素上也有类名。

```html
<svg class="house" width="200" height="200" viewBox="-100 -100 200 200">
  <polygon class="wall" points="-65,80 -65,-10 0,-70 65,-10 65,80" />
</svg>
```

```css
.house {
  stroke: black;
  stroke-width: 2px;
  fill: white;
}
```

<img src="../imgs/111/23.png" />

<img src="../imgs/111/24.png" />

接着我们在顶部添加一个屋顶。这是这里唯一的新内容。我们使用了一个 `polyline`（折线）。折线和多边形的区别在于，多边形总是会自动闭合，而折线则保持开放状态。请注意，我们再次使用了 `stroke-linecap` 属性，就像在 [姜饼人示例](https://svg-tutorial.com/svg/gingerbread-figure) 中那样。

```html
<svg class="house" width="200" height="200" viewBox="-100 -100 200 200">
  <polyline class="roof" points="-75,-8 0,-78 75,-8" />
</svg>
```

```css
.house .roof {
  fill: none;
  stroke: #d1495b;
  stroke-width: 10px;
  stroke-linecap: round;
}
```

<img src="../imgs/111/25.png" />

<img src="../imgs/111/26.png" />

然后，我们继续为门、窗户和楼梯添加简单的元素。左侧图像的最终代码如下：

```html
<svg class="house" width="200" height="200" viewBox="-100 -100 200 200">
  <polygon class="wall" points="-65,80 -65,-10 0,-70 65,-10 65,80" />
  <polyline class="roof" points="-75,-8 0,-78 75,-8" />

  <rect class="door" x="-45" y="10" width="30" height="60" rx="2" />
  <circle class="door-knob" cx="-35" cy="40" r="2" />
  <rect class="stair" x="-47" y="70" width="34" height="5" />
  <rect class="stair" x="-49" y="75" width="38" height="5" />

  <rect class="window" x="5" y="15" width="40" height="35" rx="5" />
  <line x1="5" y1="32.5" x2="45" y2="32.5" />
  <line x1="25" y1="15" x2="25" y2="50" />
  <rect class="window-sill" x="2" y="48" width="46" height="5" rx="5" />

  <circle class="window" cx="0" cy="-25" r="15" />
  <line x1="-15" y1="-25" x2="15" y2="-25" />
  <line x1="0" y1="-40" x2="0" y2="-10" />
</svg>
```

```css
.house {
  stroke: black;
  stroke-width: 2px;
  fill: white;
}

.house .roof {
  fill: none;
  stroke: #d1495b;
  stroke-width: 10px;
  stroke-linecap: round;
}

.house .door {
  fill: #d1495b;
}

.house .stair {
  fill: gray;
}

.house .window {
  fill: #fdea96;
}

.house .window-sill {
  fill: #d1495b;
  stroke-linecap: round;
}
```

<img src="../imgs/111/27.png" />