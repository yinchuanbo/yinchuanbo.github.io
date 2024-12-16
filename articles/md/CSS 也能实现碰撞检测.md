---
title: "CSS 也能实现碰撞检测"
tag: "Css"
time: 2024-12-16 17:04:27
---

本文，我们将一起学习，使用纯 CSS，实现如下所示的动画效果：

<img src="../imgs/122/01.gif" />

上面的动画效果，非常有意思，核心有两点：

1. 小球随机做 X、Y 方向的直线运动，并且能够实现碰撞到边界的时候，实现反弹效果
2. 小球在碰撞边界的瞬间，颜色发生随机的变化

嗯？很有意思的效果。**看上去，我们好像使用 CSS 实现了碰撞检测**。

然而，实际情况真的是这样吗？让我们一起一探究竟！

## 实现 X 轴方向的运动

这里其实我们并没有实现碰撞检测，因为小球和小球之间接触时，并没有发生碰撞效果。

我们只实现了，小球与边界之间的碰撞反应。不过这里，也并非碰撞检测，我们只需要设置好单个方向的运动动画，并且设置 `animation-direction: alternate;` 即可！

下面，我们一起来实现单个方向上的运动动画：

```html
<div></div>
```

```css
div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #0cf;
    animation: horizontal 3s infinite linear alternate;
}

@keyframes horizontal {
    from { 
        left: 0;
    }
    to { 
        left: calc(100vw - 100px);
    }
}
```

简单解读一下：

1. 元素设置为 `position: absolute` 绝对定位，利用 `left` 进行 X 轴方向的运动
2. 我们让元素 `div` 运动的距离为 `left: calc(100vw - 100px)`，元素本身的高宽都是 `100px`，因此相当于运动到屏幕的最右侧
3. 动画设置了 `alternate` 也就是 `animation-direction: alternate;` 的简写，表示**动画在每个循环中正反交替播放**

这样，我们就巧妙的实现了，在视觉上，小球元素移动到最右侧边界时，回弹的效果：

<img src="../imgs/122/02.gif" />

## 如法炮制 Y 轴方向的运动

好，有了上面的铺垫，我们只需要再如法炮制 Y 轴方向的运动即可。

利用元素的 `top` 进行 Y 轴方向的运动：

```css
div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #0cf;
    animation: 
        horizontal 3s infinite linear alternate,
        vertical 3s infinite  linear alternate;
}

@keyframes horizontal {
    from { 
        left: 0;
    }
    to { 
        left: calc(100vw - 100px);
    }
}

@keyframes vertical {
    from { 
        top: 0;
    }
    to { 
        top: calc(100vh - 100px);
    }
}
```

我们增加了一个 `vertical 3s infinite linear alternate` Y 轴的运动动画，实现小球从 `top: 0` 到 `top: calc(100vh - 100px);` 的运动。

这样，我们就成功的得到了 X、Y 两个方向上的小球运动，它们叠加在一起的效果如下：

<img src="../imgs/122/03.gif" />

> 颜色的变化可以忽略，GIF 录制问题。

当然，此时的问题在于，缺少了随机性，小球的始终在左上和右下角之间来回运动。

为了解决这个问题，我们需要添加一定的随机性，这个问题也要解决，我们只需要让两个方向上运动时间不一致即可。

我们修改一下代码，让 X、Y 轴的运动时长不一致即可：

```css
div {
    position: absolute;
    // ...
    animation: 
        horizontal 2.6s infinite linear alternate,
        vertical 1.9s infinite  linear alternate;
}
```

如此一来，整体的效果就好上了不少，由于整个动画是无限反复进行的，随着时间的推进，整个动画呈现出来的就是**无序、随机的运动**：

<img src="../imgs/122/04.gif" />

## 使用 transform 替代 top、left

当然，上面的效果基本上没有什么太大的问题了，但是代码层面不够优雅，主要有两点问题：

1. 元素移动使用的是 `top` 和 `left`，性能相对较差，需要使用 `transform` 进行替代
2. 代码中 hardcode 了 `100px`，由于 DEMO 中小球的大小是 `100px x 100px`，并且在动画的代码中也使用了 `100px` 这个值进行了运动终态的计算，因此如果想修改小球的元素大小，需要改动地方较多

上述两个问题，使用 `transform: translate()` 都可以解决，但是我们为什么一开始不用 `transform` 呢？

我们来尝试一下，使用 transform 替代 top、left：

```css
div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #0cf;
    animation: 
        horizontal 2.6s infinite linear alternate,
        vertical 1.9s infinite  linear alternate;
}
@keyframes horizontal {
    from { transform: translateX(0); }
    to { transform: translateX(calc(100vw - 100%)); }
}
@keyframes vertical {
    from { transform: translateY(0); }
    to { transform: translateY(calc(100vh - 100%)); }
}
```

上述代码中，我们使用了 transform 替代 top、left 运动。并且，将动画代码中的 `100px` 替换成了 `100%`，这一点的好处是，在 `transform: translate` 中，`100%` 表示的是元素本身的高宽，这样，当我们改变元素本身的大小时，就无需再改变 `@keyframes` 中的代码，通用性更强。

我们来看看修改后的效果：

<img src="../imgs/122/05.gif" />

有点问题！预想中的效果并没有出现，整个动画只有 Y 轴方向上的动画效果。

这是什么原因呢？

其本质在于，定义的 `vertical 1.9s infinite linear alternate` 的垂直方向的动画效果覆盖了在其之前定义的 `transform: translateX(calc(100vw - 100%))` 动画效果。

说人话就是 X、Y 轴的动画都使用了 `transform` 属性，**两者之间造成了冲突**。

### 使用 animation-composition 进行动画合成

在之前，这种情况基本是无解的，常见的解决方案就是：

1. 解法一：使用 `top`、`left` 替代 transform
2. 解法二：多一层嵌套，将一个方向的动画拆解到元素的父元素上

不过，到今天，这个问题有了更好的解法！也就是 CSS animation 家族中的新属性 —— `animation-composition`。

这是一个非常新的属性，表示**动画合成属性**，从 Chrome 112 版本开始支持。

有三种不同的取值：

```css
{
    animation-composition: replace;        // 表示动画值替换
    animation-composition: add;              // 表示动画值追加
    animation-composition: accumulate; // 表示动画值累加
}
```

本文不会详细介绍 `animation-composition`，感兴趣的可以看看 MDN 的属性介绍或者 XBOXYAN 大佬的这篇文章 -- [了解一下全新的CSS动画合成属性animation-composition](https://juejin.cn/post/7224903881729720380?searchId=2023082117561558870BC0CEBB37C57E03)

这里，基于上面的代码，我们只需要再多设置一个 `animation-composition: accumulate` 即可解决问题：

```css
div {
    animation: 
        horizontal 2.6s infinite linear alternate,
        vertical 1.9s infinite  linear alternate;
    animation-composition: accumulate;
}
```

此时，我们就能通过一个元素，利用 transform 得到 X、Y 两个方向位移动画的合成效果，也就是我们想要的效果：

<img src="../imgs/122/06.gif" />

## 使用 steps 实现颜色切换

解决了位移动画的问题，我们就只剩下最后一个问题了，如何在碰撞的瞬间，实现颜色的切换？

这里也非常好解决，由于我们是知道每一轮 X、Y 方向上的动画时长的，那我们只需要在每次这个结点上，切换一次颜色即可。

并且，由于颜色不是过渡变换，而是直接的跳变，所以，我们需要用到 animation 中的 `animation-timing-function: steps()`，也就是步骤缓动函数。

> 对 `animation-timing-function: steps()` 还不太了解的，可能需要先补一补基础，可以看看这一篇文章：[深入浅出 CSS 动画](https://github.com/chokcoco/iCSS/issues/141)

举个例子，假设 X 方向上，单次的动画时长为 3s，那我们可以设置一个 `steps(10)` 的颜色动画，总时长为 30s，这样，每隔 3s 就会触发一次 `steps()` 步骤动画，颜色的变化就能够和小球与边界的碰撞动画发生在同一时刻。

那如何快速实现颜色的变化呢？利用 `filter: hue-rotate()` 即可快速实现颜色的变化。

理解一下下面的代码：

```html
<div class="normal"></div>
<div class="steps"></div>
```

```css
div {
    width: 200px;
    height: 200px;
    background: #fc0;
}
.normal {
    animation: colorChange 10s linear infinite;
}
.steps {
    animation: colorChange 10s steps(5) infinite;
}
@keyframes colorChange {
    100% {
        filter: hue-rotate(360deg);
    }
}
```

这里，我们用 `filter: hue-rotate(360deg)` 的改变，实现颜色的变化，观察下面的动图，理解 `steps(5)` 的作用。

1. `animation: colorChange 10s linear infinite` 表示背景动画的过渡变化
2. `animation: colorChange 10s steps(5) infinite`，这里表示 10s 的动画分成 5 步，每两秒，会触发一次动画：

效果如下：

<img src="../imgs/122/07.gif" />

理解了这一步，我们就可以把颜色的变化，也一起叠加到上述的小球变化中：

```css
div {
    animation: 
        horizontal 2.6s infinite linear alternate,
        vertical 2s infinite  linear alternate,
        colorX 26s infinite steps(10),
        colorY 14s infinite steps(7);
    animation-composition: accumulate;
}

@keyframes horizontal {
    from { transform: translateX(0); }
    to { transform: translateX(calc(100vw - 100%)); }
}
@keyframes vertical {
    from { transform: translateY(0); }
    to { transform: translateY(calc(100vh - 100%)); }
}
@keyframes colorX {
    to {
        filter: hue-rotate(360deg);
    }
}
@keyframes colorY {
    to {
        filter: hue-rotate(360deg);
    }
}
```

这样，我们就成功的得到了题图中的效果：

<img src="../imgs/122/08.gif" />

完整的代码，你可以戳这里：[Random Circle Path](https://codepen.io/Chokcoco/pen/bGONqaE?editors=0100)

## 应用于图片效果、应用与多粒子效果

OK，上面，我们就把整个效果的完整原理剖析了一遍。

掌握了整个原理之后，我们就可以把这个效果应用于不同场景中。

譬如，假设我们有这么一张图片：

<img src="../imgs/122/01.png" />

基于上面的效果，稍加改造，我们就可以得到类似的如下效果：

```html
<div></div>
```

```css
div {
    width: 220px;
    height: 97px;
    background: linear-gradient(#f00, #f00), url(https://s1.ax1x.com/2023/08/15/pPQm9oT.jpg);
    background-blend-mode: lighten;
    background-size: contain; 
    animation: horizontal 3.7s infinite -1.4s linear alternate,
            vertical 4.1s infinite -2.1s linear alternate,
            colorX 37s infinite -1.4s steps(10),
            colorY 28.7s infinite -2.1s steps(7);
    animation-composition: accumulate;
}
@keyframes horizontal {
    from { transform: translateX(0); }
    to { transform: translateX(calc(100vw - 100%)); }
}
@keyframes vertical {
    from { transform: translateY(0); }
    to { transform: translateY(calc(100vh - 100%)); }
}
@keyframes colorX {
    to {
        filter: hue-rotate(2185deg);
    }
}
@keyframes colorY {
    to {
        filter: hue-rotate(1769deg);
    }
}
```

效果如下：

<img src="../imgs/122/09.gif" />

上面的 DEMO 是基于元素背景色的，本 DEMO 是基于图片的，因此这里多了一步，利用 `mix-blend-mode`，实现了图片颜色的变化。

完整的代码，你可以戳这里：[CodePen Demo -- Random DVD Path](https://codepen.io/Chokcoco/pen/WNYVmBo)

### 实现多粒子碰撞

OK，我们再进一步，基于上面的效果，我们可以实现各种有趣的粒子效果，如果同时让页面存在 1000 个粒子呢？

下面是我使用 [CSS-Doodle](https://css-doodle.com/) 实现的纯 CSS 的粒子效果，其核心原理与上面的保持一致，只是添加了更多的随机性：

Amazing！是不是非常有趣，整个效果的代码基于 CSS-doodle 的语法，不超过 40 行。完整的代码，你可以戳这里：[CSS Doodle - CSS Particles Animation](https://codepen.io/Chokcoco/pen/PoXYjGV?editors=1000)