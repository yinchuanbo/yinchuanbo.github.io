---
title: "CSS 颜色设置透明度的新姿势"
tag: "Css"
time: 2024-09-01 15:21:24
---

在 CSS 中，我们有很多种方式为元素设置透明度，常见的是给元素设置透明度和给颜色设置透明度，不同的方式将会带来不一样的效果。那么今天，我们就一起来聊聊 CSS 中的不透明度。感兴趣的同学，请继续往下阅读。

## 设计中的透明度

我们先从设计中开始。就拿 Figma 这样的设计软件来举例。设计师在给一个对象设置透明度，往往会有以下几种方式：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f239eb410924d58a2bc0732a1ea7887~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这两种方式中，第一种就是给整个对象（或图层）设置  `opacity` ，即：

```css
.element {
  background: #d9d9d9;
  opacity: 0.5;
}
```

第二种是给元素背景颜色设备透明度，例如：

```css
.element {
  background: rgb(217 217 217 / 0.5);
}
```

它们不同之处是，`opacity`  属性会将整个元素设备透明度，包括它的所有 UI 样式，比如背景颜色（`background-color`）、文本颜色（`color`）和边框（`border`）等。而  `rgb()`  只是调整背景颜色的透明度。

从这一点而言，如果我们要给元素的 UI 颜色设置透明度时，不应该使用  `opacity`  属性，更应该使用带有透明度的颜色值。

## 给颜色设置透明度

在 CSS 中，可以用于设置颜色的函数有很多种，比如我们熟悉的  `rgb()` 、`hsl()` ，包括后面新出的颜色函数  `hwb()` 、`lab()` 、`lch()` 、`oklab()`  和  `oklch()`  等，都可以显式指定透明通道的值。例如：

```css
:root {
  --opacity-in-rgb: rgb(0 0 0 / 0.5);
  --opacity-in-hsl: hsl(0deg 0% 0% / 50%);
  --opacity-in-hwb: hwb(0deg 0% 100% / 50%);
  --opacity-in-lab: lab(0 0 0 / 0.5);
  --opacity-in-lch: lch(0 0 0 / 0.5);
  --opacity-in-oklab: oklab(0 0 0 / 0.5);
  --opacity-in-oklch: oklch(0 0 0 / 0.5);
  --opacity-in-color: color(display-p3 0 0 0 / 0.5);
}
```

包括十六进制 HEX 的颜色，也可以用来描述带有透明度的颜色，例如：

```css
:root {
  --opacity-in-hex: #00000080;
}
```

但它们有一个共同的特性，那就需要知道各个颜色函数对应的颜色通道的值。这是一个极为不方便的地方。换句话说，如果有一种方式，可以将一个颜色直接转换成带有透明通道的颜色值，对于 Web 开发者是不是要方便的多。假设你的品牌色是一个十六进制的颜色（比如， `#09face`），现在你需要给该颜色添加  `50%`  的透明度。按照以往的方式，你需要知道  `0% ~ 100%`  之间对应的十六进制硬编码，或者将十六进制转换为其他描述颜色的函数，例如  `rgb()`  或  `hsl()`  等。

庆幸的是，CSS 新增的一些颜色函数功能，可以让事情变得简单地说。比如相对颜色、混合颜色等。

### 相对颜色

我个人更喜欢相对颜色的语法。使用此语法，你只需要在相应的颜色函数中使用  `from`  关键词，该关键词可以为你解构颜色模型，以便你可以在该颜色模型中调整颜色，比如设置颜色透明度：

```css
:root {
  --brand-color: #09face;
}

.element {
  color: rgb(from var(--brand-color) r g b / 50%);
  color: hsl(from var(--brand-color) h s l / 50%);
  color: hwb(from var(--brand-color) h w b / 50%);
  color: lch(from var(--brand-color) l c h / 50%);
  color: lab(from var(--brand-color) l a b / 50%);
  color: oklab(from var(--brand-color) l a b / 50%);
  color: oklch(from var(--brand-color) l c h / 50%);
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e5cbdecd4074abbb9d680a611a27ffa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> Demo 地址：[codepen.io/airen/full/…](https://codepen.io/airen/full/KKrPPYe) （请使用 Safari 浏览器查看）

在上面的示例中，我使用了十六进制来描述品牌色，并应用了  `50%`  的透明度。在所有颜色模型中，结果都相同。我认为这看起来很好。

不幸的是，相对颜色语法到目前为止（写这篇文章时）也只得到了 Safari 浏览器的支持。

更为有意思的是，颜色相对语法还可以使用  `calc()`  函数，对颜色各个部分进行调整，例如：

```css
.add-opacity {
  --original-collor: #09face;
  background: rgb(from var(--original-collor) r g b / 50%);
  background: hsl(from var(--original-collor) h s l / 50%);
  background: oklch(from var(--original-collor) l c h / 50%);
  background: hwb(from var(--original-collor) h w b / 50%);
  background: lab(from var(--original-collor) l a b / 50%);
  background: lch(from var(--original-collor) l c h / 50%);
}
```

> Demo 地址：[codepen.io/airen/full/…](https://codepen.io/airen/full/jOevEeB) （请使用 Safari 浏览器查看）

### CSS color-mix() 函数

有意思的是，CSS 的  `color-mix()`  也可以用来调整颜色的不透明度。假设你要创建品牌颜色的半透明版本，你可以使用  `transparent`  与品牌色混合，并起调整  `transparent` （透明颜色）的混合比例。它看起来有点像这样：

```css
:root {
  --brand-color: #8832cc;

  --brand-color-a10: color-mix(in oklch, var(--brand-color), transparent 90%);
  --brand-color-a20: color-mix(in oklch, var(--brand-color), transparent 80%);
  --brand-color-a30: color-mix(in oklch, var(--brand-color), transparent 70%);
  --brand-color-a40: color-mix(in oklch, var(--brand-color), transparent 60%);
  --brand-color-a50: color-mix(in oklch, var(--brand-color), transparent 50%);
  --brand-color-a60: color-mix(in oklch, var(--brand-color), transparent 40%);
  --brand-color-a70: color-mix(in oklch, var(--brand-color), transparent 30%);
  --brand-color-a80: color-mix(in oklch, var(--brand-color), transparent 20%);
  --brand-color-a90: color-mix(in oklch, var(--brand-color), transparent 10%);
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7a78a45e9944c6eb20f3ed26cdda2b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> Demo 地址：[codepen.io/airen/full/…](https://codepen.io/airen/full/eYPXPrZ)

通过这种方式使用  `color-mix`  函数，你可以保留品牌颜色的同时还可以进行透明度的调整。同样，相对颜色语法确实是为此而设计的，但是使用  `color-mix()`  也很酷。

## [小结](http://localhost:3000/#/./CSS/opacity-in-css?id=%e5%b0%8f%e7%bb%93)

CSS 的相对颜色和  `color-mix()`  都是 CSS 颜色的新特性，在这里我们利用这些新特性，帮助我们更好的给颜色设置透明度。
