---
title: "有意思的气泡 Loading 效果"
tag: "Css"
time: 2024-12-20 10:23:54
---

今日，群友提问，如何实现这么一个 Loading 效果：

<img src="../imgs/125/07.gif" />

这个确实有点意思，但是这是 CSS 能够完成的？

没错，这个效果中的核心气泡效果，其实借助 CSS 中的滤镜，能够比较轻松的实现，就是所需的元素可能多点。参考我们之前的：

- [使用纯 CSS 实现超酷炫的粘性气泡效果](https://github.com/chokcoco/iCSS/issues/188)
- [巧用 CSS 实现酷炫的充电动画](https://github.com/chokcoco/iCSS/issues/75)

## 圆弧的实现

首先，我们可能需要实现这样一段圆弧：

<img src="../imgs/125/07.png" />

这里需要用到的技术是：

角向渐变 `conic-gradient()` + `mask` 以及两个伪元素。图片示意如下：

<img src="../imgs/125/08.png" />

核心代码如下图：

```html
<div class="g-container">
  <div class="g-circle"></div>
</div>
```

```css
:root {
  --headColor: hsl(130, 75%, 75%);
  --endColor: hsl(60, 75%, 40%);
}
.g-container {
  position: relative;
  background: #000;
}
.g-circle {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: conic-gradient(
    var(--headColor) 0,
    var(--headColor) 10%,
    hsl(120, 75%, 70%),
    hsl(110, 75%, 65%),
    hsl(100, 75%, 60%),
    hsl(90, 75%, 55%),
    hsl(80, 75%, 50%),
    hsl(70, 75%, 45%),
    var(--endColor) 30%,
    var(--endColor) 35%,
    transparent 35%
  );
  mask: radial-gradient(
    transparent,
    transparent 119px,
    #000 120px,
    #000 120px,
    #000 100%
  );

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 30px;
    height: 30px;
    background: var(--headColor);
    top: 0;
    left: 135px;
    border-radius: 50%;
  }

  &::after {
    background: var(--endColor);
    left: unset;
    top: 214px;
    right: 26px;
  }
}
```

这样，我们就得到了这样一个图形：

<img src="../imgs/125/09.png" />

## 气泡的实现

接下来，我们来实现尾部气泡向外扩散的效果。

由于这里涉及了多个气泡的不同运动动画，多个标签元素肯定是少不了了。

因此，接下来我们要做的事情：

1. 我们需要多一组元素，将其绝对定位到上述圆环的头部或者尾部
2. 给每个子元素随机设置多个大小不一的圆，颜色保持一致
3. 给每个子元素随机设置不同方向的，向外扩散的位移动画
4. 给每个子元素随机设置负的 `animation-delay`，造成动画上的先后顺序，并以此形成整个无限循环的气泡扩散动画

这里，由于有许多小气泡的动画，这个数量，我设置成了 100。那肯定是不能一个一个手写它们的动画代码，需要借助 SASS/LESS 等预处理器的循环、随机等函数。

核心代码如下：

```html
<div class="g-container">
  <div class="g-circle"></div>
  <ul class="g-bubbles">
    <li class="g-bubble"></li>
    // ... 共 100 个 bubble 元素
    <li class="g-bubble"></li>
  </ul>
</div>
```

```css
// 上面圆环的代码，保持一致，下面只补充气泡动画的代码
.g-bubbles {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50px;
  top: 100px;
  left: 235px;
  background: var(--headColor);
}

.g-bubble {
  position: absolute;
  border-radius: 50%;
  background-color: inherit;
}

@for $i from 1 through 100 {
  .g-bubble:nth-child(#{$i}) {
    --rotate: calc(#{random(360)} * 1deg);
    --dis: calc(#{random(100)} * 1px);
    --width: calc(3px + #{random(25)} * 1px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--width);
    height: var(--width);
    animation: move
      #{(random(1500) + 1500) /
      1000}s
      ease-in-out -#{random(3000) /
      1000}s
      infinite;
  }
}

@keyframes move {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  75% {
    opacity: 0.9;
  }
  100% {
    transform: rotateZ(var(--rotate)) translate(-50%, var(--dis));
    opacity: 0.4;
  }
}
```

核心在于 `@for $i from 1 through 100 { }` 这段 SASS 代码内部，我们实现了上面说的 (2)(3)(4) 的功能点！

这样，我们就得到了这样一个效果，在尾部有大量气泡动画，不断向外扩散的效果：

<img src="../imgs/125/08.gif" />

## 借助滤镜实现粘性气泡效果

OK，到这里整个效果基本就做完了。当然，也是剩下最后最重要的一步，需要让多个气泡之间产生一种粘性融合的效果。

这个技巧在此前非常多篇文章中，也频繁提及过，就是利用 `filter: contrast()` 滤镜与 `filter: blur()` 滤镜。

如果你还不了解这个技巧，可以戳我的这篇文章看看：[你所不知道的 CSS 滤镜技巧与细节](https://github.com/chokcoco/iCSS/issues/30)

简述下该技巧：

单独将两个滤镜拿出来，它们的作用分别是：

1. `filter: blur()`： 给图像设置高斯模糊效果。
2. `filter: contrast()`： 调整图像的对比度。

但是，当他们“合体”的时候，产生了奇妙的融合现象。

<img src="../imgs/125/09.gif" />

仔细看两圆相交的过程，在边与边接触的时候，会产生一种边界融合的效果，通过对比度滤镜把高斯模糊的模糊边缘给干掉，利用高斯模糊实现融合效果。

基于此，我们再简单改造下我们的 CSS 代码，所需要加的代码量非常少：

1. 加上滤镜 blur() 和 contrast() ，形成融合粘性效果
2. 加上整个圆环的旋转即可效果
3. 加上滤镜 hue-rotate()，实现色彩的变换动画

```css
.g-container {
  // ... 保持一致
  background: #000;
  filter: blur(3px) contrast(5);
  animation: rotate 4s infinite linear;
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
    filter: blur(3px) contrast(5) hue-rotate(360deg);
  }
}
```

就这样，我们就大致还原了题图的效果：

<img src="../imgs/125/10.gif" />

完整的代码，你可以戳这里：[CodePen Demo -- Pure CSS Loading Animation](https://codepen.io/Chokcoco/pen/xxybQYY?editors=0100)

## 修复违和感

当然，上面的效果，乍一看还行，仔细看，违和感很重。

原因在，扩散出来的小球也跟着一起半圆环一起进行了旋转动画，看上去就有点奇怪。

正确的做法应该是，圆环尾部的气泡应该是原地发散消失的。

那么，怎么能够做到气泡效果，一直发生在圆环的尾部，同时消失的时候有不跟着整个圆环一起进行旋转呢？我们想要的最终效果，应该是这样：

<img src="../imgs/125/11.gif" />

这里，我们可以拆解一下。想象，如果去掉圆环的旋转，其实我们只需要实现这样一个效果即可：

<img src="../imgs/125/12.gif" />

整个动画的核心就转变成了如何实现这么一个效果。看似复杂，其实也很好做。

首先，我们重新改造一下上述的 `.g-bubbles`。

1. 生成 N 个一样大小的小球元素，定位在整个容器的中间

```html
<div class="g-container">
  <div class="g-circle"></div>
  <ul class="g-bubbles">
    <li class="g-bubble"></li>
    // ... 共 200 个 bubble 元素
    <li class="g-bubble"></li>
  </ul>
</div>
```

```css
.g-bubbles {
  position: absolute;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  border-radius: 50px;
}
.g-bubble {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: hsl(60, 75%, 40%);
}
```

得到这么一个效果，所以圆形小点，都暂时汇聚在容器的中心：

<img src="../imgs/125/10.png" />

这里需要简单解释一下：

<img src="../imgs/125/11.png" />

其次，我们借助 SASS，按照元素的顺序，把它们顺序排列到圆环轨迹之上：

```css
$count: 200;
@for $i from 1 through $count {
  .g-bubble:nth-child(#{$i}) {
    --rotate: calc(#{360 / $count} * #{$i} * 1deg);
    transform: rotateZ(var(--rotate)) translate(135px, 0);
    opacity: 1;
  }
}
```

由于我们设置了 div 小球的个数为 200 个，这样，我们就得到了一圈由 200 个圆形小球形成的圆环：

<img src="../imgs/125/12.png" />

接下来这一步非常重要，我们设定一个动画：

1. 让每个小球在动画的 `75% ~ 100%` 阶段做透明度从 1 到 0 的变换，而 `0% ~ 75%` 的阶段保持透明度为 0
2. 让 200 个 div 依次进行这个动画

依次消失：

```css
@for $i from 1 through $count {
  .g-bubble:nth-child(#{$i}) {
    --rotate: calc(#{360 / $count} * #{$i} * 1deg);
    --delayTime: calc(4000 * #{$i / $count} * -1ms);
    transform: rotateZ(var(--rotate)) translate(135px, 0);
    opacity: 1;
    animation: showAndHide 4000ms linear var(--delayTime) infinite;
  }
}
@keyframes showAndHide {
  0% {
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  75.1% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

这样，我们就得到了一个圆形小球气泡围绕圆环渐次消失的效果：

<img src="../imgs/125/13.gif" />

配合上整个圆环，效果就会是这样：

<img src="../imgs/125/14.gif" />

很接近了，但是没有随机的感觉，气泡也没有散开的动画。解决的方案：

1. 所以我们需要让气泡在执行透明度变化的同时，进行一个随机的发散位移
2. 小圆形气泡的大小也可以带上一点随机，同时，在动画过程逐渐缩小

当然，整个动画的基础，还是在容器设置了 滤镜 blur() 和 contrast() 的加持之下的，这样，我们给气泡再补上随机动画散开及缩放的动画：

```css
@for $i from 1 through $count {
  .g-bubble:nth-child(#{$i}) {
    --rotate: calc(#{360 / $count} * #{$i} * 1deg);
    --delayTime: calc(4000 * #{$i / $count} * -1ms);
    --scale: #{0.4 + random(10) / 10};
    --x: #{-100 + random(200)}px;
    --y: #{-100 + random(200)}px;
    transform: rotateZ(var(--rotate)) translate(135px, 0);
    opacity: 1;
    animation: showAndHide 4000ms linear var(--delayTime) infinite;
  }
}

@keyframes showAndHide {
  0% {
    transform: rotateZ(var(--rotate)) translate(135px, 0);
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  75.1% {
    transform: rotateZ(var(--rotate)) translate(135px, 0) scale(var(--scale));
    opacity: 1;
  }
  100% {
    transform: rotateZ(var(--rotate)) translate(
        calc(135px + var(--x)),
        var(--y)
      )
      scale(0.2);
    opacity: 0;
  }
}
```

只看一圈的气泡圆形，我们能得到了这样的效果：

<img src="../imgs/125/15.gif" />

配合上圆环的效果：

<img src="../imgs/125/16.gif" />

配合上父容器的 `filter: hue-rotate()` 动画，就能实现颜色的动态变换，得到我们最终想要的效果：

<img src="../imgs/125/17.gif" />

这样，没有了第一版本的违和感，整个效果也显得比较自然。

完整的代码，你可以戳这里：[CodePen Demo -- Pure CSS Loading Animation](https://codepen.io/Chokcoco/pen/zYmvzdB)
