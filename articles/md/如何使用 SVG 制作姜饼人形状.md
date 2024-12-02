---
title: "如何使用 SVG 制作姜饼人形状"
tag: "Svg"
time: 2024-12-02 20:43:52
---

<img src="../imgs/111/06.png" />

## 将样式属性移至 CSS

由于我们的 SVG 现在嵌入在 HTML 文件中，因此可以为每个元素分配 CSS 类，并将部分属性移动到 CSS 中。不过，我们只能移动表示样式的属性。位置属性和定义形状的属性必须保留在 HTML 中，而颜色、描边和字体相关的属性则可以移动到 CSS 中。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <circle class="head" cx="0" cy="-50" r="30" />
</svg>
```

```css
.head {
  fill: #cd803d;
}
```

<img src="../imgs/111/07.png" />

<img src="../imgs/111/08.png" />

## 圆角线条

我们已经了解了 `fill` 属性和一些 `stroke` 属性，但这里还有另一个样式属性：`stroke-linecap`。它可以让我们的线条端点变得圆润。注意，这里的腿和手臂是简单的直线。

为了对比，如果我们去掉线条端点样式，并设置一个更小的线宽，就会呈现出如下效果。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <line class="limb" x1="-40" y1="-10" x2="40" y2="-10" />
  <line class="limb" x1="-25" y1="50" x2="0" y2="-15" />
  <line class="limb" x1="25" y1="50" x2="0" y2="-15" />
</svg>
```

```css
.limb {
  stroke: #cd803d;
}
```

<img src="../imgs/111/09.png" />

<img src="../imgs/111/10.png" />

<img src="../imgs/111/11.png" />

<img src="../imgs/111/12.png" />

但通过设置较粗的线宽和圆形的线条端点，我们可以为我们的图形塑造出腿和手臂的形状。

```css
.limb {
  stroke: #cd803d;
  stroke-width: 35px;
  stroke-linecap: round;
}
```

<img src="../imgs/111/13.png" />

## 圆角矩形

现在，让我们为图形添加嘴巴。我们可以使用另一个矩形来实现。请注意定义中的 `rx` 属性，它会使矩形的边缘变得圆润。这与常规 HTML 元素的 `border-radius` 属性类似。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <circle class="head" cx="0" cy="-50" r="30" />
  <!-- add -->
  <rect class="mouth" x="-10" y="-40" width="20" height="5" rx="2" />
</svg>
```

```css
.head {
  fill: #cd803d;
}
/* add */
.mouth {
  fill: none;
  stroke: white;
  stroke-width: 2px;
}
```

<img src="../imgs/111/14.png" />

<img src="../imgs/111/15.png" />

## 姜饼人图形

当我们将所有部分组合在一起，并添加眼睛和纽扣后，最终的代码如下所示：

```html
<svg class="gingerbread" width="200" height="200" viewBox="-100 -100 200 200">
  <circle class="head" cx="0" cy="-50" r="30" />

  <circle class="eye" cx="-12" cy="-55" r="3" />
  <circle class="eye" cx="12" cy="-55" r="3" />
  <rect class="mouth" x="-10" y="-40" width="20" height="5" rx="2" />

  <line class="limb" x1="-40" y1="-10" x2="40" y2="-10" />
  <line class="limb" x1="-25" y1="50" x2="0" y2="-15" />
  <line class="limb" x1="25" y1="50" x2="0" y2="-15" />

  <circle cx="0" cy="-10" r="5" />
  <circle cx="0" cy="10" r="5" />
</svg>
```

```css
.head {
  fill: #cd803d;
}

.eye {
  fill: white;
}

.mouth {
  fill: none;
  stroke: white;
  stroke-width: 2px;
}

.limb {
  stroke: #cd803d;
  stroke-width: 35px;
  stroke-linecap: round;
}
```
