---
title: "如何使用 SVG 绘制二次贝塞尔曲线"
tag: "Svg"
time: 2024-12-05 13:05:58
---

当我们开始使用曲线时，`path` 元素变得非常强大，例如二次贝塞尔曲线。对于这条曲线，我们还需要设置一个控制点，除了终点之外。

控制点是一个不可见的坐标，线条会向其弯曲。拖动下面的坐标以查看其效果。

<img src="../imgs/112/09.png" />

<img src="../imgs/112/10.png" />

```html
<svg width="450" height="450">
  <path
    d="M 100 350 Q 332 88 350 350"
    stroke="#fa3838"
    stroke-width="20"
    fill="none"
  />
</svg>
```

### 绘制微笑脸

您可以使用二次贝塞尔曲线创建一个微笑图标。看看这个快乐的脸！将鼠标悬停在代码或图像中的坐标上，以查看它们是如何定位的。

在这个图像中，我们还引入了一个新元素——`ellipse`。椭圆的行为类似于圆，但它有两个半径：一个是水平半径，一个是垂直半径。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <circle cx="0" cy="0" r="90" fill="none" stroke="black" stroke-width="10" />
  <ellipse cx="-25" cy="-25" rx="10" ry="15" />
  <ellipse cx="25" cy="-25" rx="10" ry="15" />
  <path
    d="M -40,30 Q 0,60 40,30"
    fill="none"
    stroke="black"
    stroke-width="10"
    stroke-linecap="round"
  />
</svg>
```

<img src="../imgs/112/11.png" />

<img src="../imgs/112/12.png" />

<img src="../imgs/112/13.png" />

<img src="../imgs/112/14.png" />

<img src="../imgs/112/15.png" />

在上面的示例中，控制点与两个端点的距离相同，但这并不是必需的。在下面的示例中，控制点被移动到右侧。将鼠标悬停在图像上以查看控制点。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
      M -60,50
      Q 40,-50 40,50"
    fill="none"
    stroke="black"
    stroke-width="10"
  />
</svg>
```

<img src="../imgs/112/16.png" />

<img src="../imgs/112/17.png" />

### 绘制波浪树

在今天的示例中，我们有一系列二次贝塞尔曲线，其中控制点随着路径向下移动而越来越远离树的中心。

```html
<svg width="200" height="400" viewBox="-100 -200 200 400">
  <path
    d="
      M 0 -80
      Q 5 -75 0 -70
      Q -10 -65 0 -60
      Q 15 -55 0 -50
      Q -20 -45 0 -40
      Q 25 -35 0 -30
      Q -30 -25 0 -20
      Q 35 -15 0 -10
      Q -40 -5 0 0
      Q 45 5 0 10
      Q -50 15 0 20
      Q 55 25 0 30
      Q -60 35 0 40
      Q 65 45 0 50
      Q -70 55 0 60
      Q 75 65 0 70
      Q -80 75 0 80
      Q 85 85 0 90
      Q -90 95 0 100
      Q 95 105 0 110
      Q -100 115 0 120
      L 0 140
      L 20 140
      L -20 140"
    fill="none"
    stroke="#0C5C4C"
    stroke-width="5"
  />
</svg>
```

<img src="../imgs/112/18.png" />

如果我们将上面的每个二次贝塞尔曲线分解为两个具有相同坐标的线段，结果将如下所示：

```html
<svg width="200" height="400" viewBox="-100 -200 200 400">
  <path
    d="
      M 0 -80
      L 5 -75 L 0 -70
      L -10 -65 L 0 -60
      L 15 -55 L 0 -50
      L -20 -45 L 0 -40
      L 25 -35 L 0 -30
      L -30 -25 L 0 -20
      L 35 -15 L 0 -10
      L -40 -5 L 0 0
      L 45 5 L 0 10
      L -50 15 L 0 20
      L 55 25 L 0 30
      L -60 35 L 0 40
      L 65 45 L 0 50
      L -70 55 L 0 60
      L 75 65 L 0 70
      L -80 75 L 0 80
      L 85 85 L 0 90
      L -90 95 L 0 100
      L 95 105 L 0 110
      L -100 115 L 0 120
      L 0 140
      L 20 140
      L -20 140"
    fill="none"
    stroke="black"
  />
</svg>
```

<img src="../imgs/112/19.png" />
