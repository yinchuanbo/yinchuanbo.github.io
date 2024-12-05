---
title: "如何使用 SVG 绘制三次贝塞尔曲线"
tag: "Svg"
time: 2024-12-05 13:18:44
---

当我们想要弯曲一条线时，二次贝塞尔曲线非常好，但它们有一定的局限性。我们无法绘制出粗壮的曲线或在线段之间进行平滑连接。

使用三次贝塞尔曲线时，我们有两个控制点。第一个控制点定义了曲线的初始方向，第二个控制点则设置了曲线如何到达其终点。拖动下面的坐标以查看其效果。

<img src="../imgs/112/20.png" />

<img src="../imgs/112/21.png" />

```html
<svg width="450" height="450">
  <path
    d="M 100 350 C 93 78 408 140 350 350"
    stroke="#fa3838"
    stroke-width="20"
    fill="none"
  />
</svg>
```

## 连接线段

三次贝塞尔曲线非常适合在线段之间进行平滑连接。我们可以将第一个控制点设置为延续前一个线段，并将第二个控制点与下一个线段对齐。

将鼠标悬停在代码或图像中的坐标上，以查看它们是如何定位的。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
      M -90,0
      L -30,-30
      C 30,-60 60,-30 30,30
      L 0,90"
    fill="none"
    stroke="red"
    stroke-width="10"
  />
</svg>
```

<img src="../imgs/112/22.png" />

<img src="../imgs/112/23.png" />

<img src="../imgs/112/24.png" />

<img src="../imgs/112/25.png" />

<img src="../imgs/112/26.png" />

<img src="../imgs/112/27.png" />

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
      M -30,70
      L 30,0
      C 90,-70 -80,-30 -20,10
      L 40,50"
    fill="none"
    stroke="red"
    stroke-width="10"
  />
</svg>
```

<img src="../imgs/112/28.png" />

<img src="../imgs/112/29.png" />

<img src="../imgs/112/30.png" />

<img src="../imgs/112/31.png" />

<img src="../imgs/112/32.png" />

<img src="../imgs/112/33.png" />

## 如何使用 SVG 绘制个人资料图标

我们可以使用三次贝塞尔曲线创建的一个简单图标是个人资料图标。头部是一个圆形，身体由一个三次贝塞尔曲线和一条直线构成。

然而，在这个示例中，我们并没有使用 `L` 命令来完成身体。相反，我们使用 `Z` 命令来闭合路径。`Z` 命令通过从当前点绘制一条直线到起始点来闭合路径。

```html
<svg
  width="200"
  height="200"
  viewBox="-100 -100 200 200"
  fill="none"
  stroke="black"
  stroke-width="10"
>
  <circle cy="-40" r="20" />
  <path
    d="
      M -50,70
      C -50,-20 50,-20 50,70
      Z"
  />
</svg>
```

<img src="../imgs/112/34.png" />

<img src="../imgs/112/35.png" />

<img src="../imgs/112/36.png" />

<img src="../imgs/112/37.png" />

<img src="../imgs/112/38.png" />

<img src="../imgs/112/39.png" />

## 如何用 SVG 绘制礼品盒

在这个例子中，礼品盒的丝带使用了三次贝塞尔曲线，平滑地延续了之前的直线，然后转回即将到来的线的方向。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
      M 0 0
      L 30 0
      C 50 0 50 -25 30 -15
      L 0 0"
    fill="none"
    stroke="red"
    stroke-width="4"
  />
</svg>
```

<img src="../imgs/112/40.png" />

<img src="../imgs/112/41.png" />

<img src="../imgs/112/42.png" />

<img src="../imgs/112/43.png" />

<img src="../imgs/112/44.png" />

除了三次贝塞尔曲线，这幅图的其余部分主要由几个矩形和一个圆组成。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <circle cx="0" cy="-50" r="10" fill="#a9172a" />
  <rect class="box" x="-60" y="-40" width="120" height="100" />
  <rect class="box" x="-70" y="-47" width="140" height="20" />
  <rect class="stripe" x="-20" y="-40" width="40" height="100" />
  <rect class="stripe" x="-25" y="-47" width="50" height="20" />

  <path
    class="ribbon"
    d="
      M 0 -50
      L 30 -50
      C 50 -50 50 -70 30 -65
      L 0 -50"
  />

  <path
    class="ribbon"
    d="
      M 0 -50
      L -30 -50
      C -50 -50 -50 -70 -30 -65
      L 0 -50"
  />
</svg>
```

```css
.box {
  fill: #d1495b;
  stroke: black;
  stroke-width: 2px;
}

.stripe {
  fill: white;
  stroke: black;
  stroke-width: 2px;
}

.ribbon {
  stroke: #b73a3b;
  stroke-width: 4px;
  fill: none;
}
```

<img src="../imgs/112/45.png" />