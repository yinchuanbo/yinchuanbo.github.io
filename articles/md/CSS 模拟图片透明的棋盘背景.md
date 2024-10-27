---
title: "CSS 模拟图片透明的棋盘背景"
tag: "Css"
time: 2024-09-08 12:25:22
---

### 线性渐变

首先，在 HTML 中创建一个 300x300 像素的区域：

```html
<div class="transparent-bg" style="width: 300px; height: 300px;"></div>
```

接下来，创建一个渐变图形：

```css
background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(
    45deg,
    transparent 75%,
    #ccc 75%
  ), linear-gradient(-45deg, transparent 75%, #ccc 75%);
```

<img src="../imgs/62/01.webp" />

这个代码会生成四个三角形。为了形成交错的方块，需要移动灰色三角形的位置，这可以通过  `background-position`  来实现。假设图形是 20x20 像素，3 号色块向 1 号移动，2 和 4 号色块分别向右上角移动，代码如下：

```css
background-position: 0 0, 0 -10px, -10px 10px, 10px 0px;
```

<img src="../imgs/62/02.webp" />

然后，通过无数个这样的图形组合成棋盘背景。设置  `background-size`  为  `20px`，如果使用其他值，需要重新计算  `background-position`。

```css
background-size: 20px 20px;
```

最终的完整代码如下：

```css
.transparent-bg {
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(
      45deg,
      transparent 75%,
      #ccc 75%
    ), linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 -10px, -10px 10px, 10px 0px;
}
```

需要注意的是，这里使用了  `transparent`  来表示白色方块，这样如果下方有颜色背景或其他元素，就会显示出来，可能并不理想。那么是否可以改成其他颜色呢？例如改成红色，效果如下：

<img src="../imgs/62/03.webp" />

有些怪异，但还有另一种方法。

## 锥形渐变

`conic-gradient`  是 CSS 中的一种渐变函数，用于创建圆形渐变效果。我们可以设置交错的色块，把圆形区域分成四块，从灰色 → 白色 → 灰色 → 白色，对应的代码如下：

```css
background-image: conic-gradient(
  #ccc 0 25%,
  #fff 25% 50%,
  #ccc 50% 75%,
  #fff 75%
);
```

<img src="../imgs/62/04.webp" />

这一步就达到了单元图形的效果，接下来只需要设置  `background-size`  即可，完整代码如下：

```css
.transparent-bg {
  background-image: conic-gradient(
    #ccc 0 25%,
    #fff 25% 50%,
    #ccc 50% 75%,
    #fff 75%
  );
  background-size: 20px 20px;
}
```

注意，锥形渐变最后一段灰色 → 白色其实是重复前面的部分，因此可以使用重复锥形渐变  `repeating-conic-gradient`，代码如下：

```css
background-image: repeating-conic-gradient(#ccc 0 25%, #ff0 25% 50%);
```

在锥形渐变的方法中，没有使用  `transparent`，这意味着可以使用其他不透明色而不影响效果。

<img src="../imgs/62/05.webp" />
