---
title: "如何使用 SVG 绘制基本路径"
tag: "Svg"
time: 2024-12-04 15:00:25
---

在我们学习了基本形状之后，现在是时候学习 `path`（路径）元素了。path 是 SVG 中最强大的元素。我们几乎可以用路径定义任何图形，如果你打开任何 SVG 文件，你会发现主要都是由路径组成的。

路径的形状是通过 `d` 属性来定义的。在这里我们可以定义多个绘图命令。每个命令都以一个表示命令类型的字母开始，并以坐标结束。

这里我们只介绍两个最基本的命令：移动到（move-to）和连线到（line-to）。移动到命令会将光标移动到某个点，但不会绘制线条；而连线到命令会从前一个点绘制一条直线到指定点。每个命令都会继续前一个命令的操作。当我们绘制一条线时，我们只需要定义终点，起点将会是前一个命令的终点。

这样的翻译准确地保留了原文的技术内容，同时使用了更符合中文表达习惯的语言。需要我为您解释其中的任何概念吗？

### 汉堡菜单图标

在开始箭头示例之前，让我们绘制一个简单的汉堡菜单图标。我们将在同一个路径中使用移动到（`M`）和连线到（`L`）命令来绘制三条线。首先，我们用 `M -45, -45` 移动到顶部线条的起点，然后用 `L 45, -45` 绘制一条线到终点。你可以将鼠标悬停在代码中或图像上的坐标上，以查看它们的具体位置。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
        M -45, -45
        L  45, -45"
    stroke="#333333"
    stroke-width="15"
    stroke-linecap="round"
  />
</svg>
```

<img src="../imgs/111/28.png" />

<img src="../imgs/111/29.png" />

<img src="../imgs/111/30.png" />

然后我们继续以同样的方式绘制更多的线条。路径的一个有趣之处是，它们不必是连续的。我们可以在同一个路径中使用多个移动到（`move-to`）命令。X 和 Y 坐标之间的逗号是可选的。这次我们省略了它们。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
        M -45 -45
        L  45 -45
        M -45   0
        L  45   0
        M -45  45
        L  45  45"
    stroke="#333333"
    stroke-width="15"
    stroke-linecap="round"
  />
</svg>
```

<img src="../imgs/111/31.png" />

<img src="../imgs/111/32.png" />

像这样的图标在 HTML 中常常显得杂乱无章。在后面的章节中，我们将学习如何在 CSS 中内联这个图标，并像页面左上角所示那样使用它。

### 心形图标

这是另一个示例，使用了一个移动到命令和两个连线到命令绘制而成。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
        M -30 -20
        L   0  10
        L  30 -20"
    fill="none"
    stroke="red"
    stroke-width="80"
    stroke-linecap="round"
  />
</svg>
```

<img src="../imgs/111/33.png" />

在上面的示例中，如果我们减小 `stroke-width` 属性的值，那么我们会发现上面的代码实际上是一个简单的 V 形。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
        M -30 -20
        L   0  10
        L  30 -20"
    fill="none"
    stroke="red"
    stroke-width="10"
    stroke-linecap="round"
  />
</svg>
```

<img src="../imgs/111/34.png" />

### 练习：你会如何制作全屏图标？

你知道不仅可以将视频全屏显示，还可以将其他任何网页元素全屏显示吗？点击下面的图标看看它是如何工作的。

你会如何制作下面的全屏图标？查看这个 [YouTube 教程](https://youtu.be/jX3mIQdQQ2w?si=oisc74y6ouJp_JZf) 来学习如何制作。

```html
<svg width="30" height="30" data-astro-cid-xccz6tsb="">
  <path
    id="enter-fullscreen"
    stroke="black"
    stroke-width="3"
    fill="none"
    d="
            M 10, 2 L 2,2 L 2, 10
            M 20, 2 L 28,2 L 28, 10
            M 28, 20 L 28,28 L 20, 28
            M 10, 28 L 2,28 L 2, 20"
    data-astro-cid-xccz6tsb=""
  ></path>
  <path
    id="exit-fullscreen"
    stroke="transparent"
    stroke-width="3"
    fill="none"
    d="
            M 10, 2 L 10,10 L 2, 10
            M 20, 2 L 20,10 L 28, 10
            M 28, 20 L 20,20 L 20, 28
            M 10, 28 L 10,20 L 2, 20"
    data-astro-cid-xccz6tsb=""
  ></path>
</svg>
```

<img src="../imgs/111/36.png" />

### 箭头图标

接下来，为了进行今天的示例，我们可以用非常类似的方式绘制一个箭头。我们从中间绘制一条线，然后继续这条线来绘制上面的翅膀。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
        M -70 0
        L 70 0
        L 30 -50"
    fill="none"
    stroke="#D1495B"
    stroke-width="25"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
```

<img src="../imgs/111/35.png" />

<img src="../imgs/111/37.png" />

你可能注意到，在之前的示例中我们也使用了 `stroke-linejoin` 属性。这个属性的作用类似于 `stroke-linecap`，但它影响的是路径段的连接。如果我们去掉这个属性，路径将如下所示：

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="
        M -70 0
        L 70 0
        L 30 -50"
    fill="none"
    stroke="#D1495B"
    stroke-width="25"
    stroke-linecap="round"
  />
</svg>
```

<img src="../imgs/111/38.png" />

然后我们可以通过再次移动到水平线的末端，绘制一条直线向下，从而完成箭头的下翅膀。你可能会注意到，在本页和其他页面的导航按钮底部，我们包含了一个类似的 SVG。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <path
    d="M -70 0 L 70 0 L 30 -50 M 70 0 L 30 50"
    fill="none"
    stroke="#D1495B"
    stroke-width="25"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
```

<img src="../imgs/111/39.png" />