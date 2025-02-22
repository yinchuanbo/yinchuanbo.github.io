---
title: "你需要自定义 @property 而不是 CSS 变量的情况"
tag: "Css"
time: 2024-09-01 15:21:24
---

> 快速摘要：尽管自定义属性和 CSS 变量是不同的但相关的概念，但人们在描述 CSS 中的占位符值时经常交替使用它们。Preethi Sam 通过一个示例演示了在哪些情况下自定义属性比变量更合适，并展示了自定义属性为设计复杂、精细的动画提供的更大的自由度和灵活性。

我们通常使用 CSS 变量作为我们计划重用的某些值的占位符——为了避免重复相同的值，并在需要时能够轻松更新整个值。

```css
:root {
  --mix: color-mix(in srgb, #8a9b0f, #fff 25%);
}

div {
  box-shadow: 0 0 15px 25px var(--mix);
}
```

我们可以使用`@property`在 CSS 中注册自定义属性。你可能找到的最常见示例展示了如何使用`@property`[动画渐变的颜色](https://css-tricks.com/interpolating-numeric-css-variables/)，这是我们通常无法做到的，因为 CSS 变量被识别为字符串，而我们需要的是一个可以插值的数字格式。这就是`@property`允许我们定义变量的值、语法、初始值和继承，就像你在 CSS 规范中找到的那样。

例如，以下是我们如何注册一个名为`--circleSize`的自定义属性，它被格式化为百分比值，默认设置为`10%`，并且不由子元素继承。

```css
@property --circleSize {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 10%;
}

div {
  /* 红色div */
  clip-path: circle(var(--circleSize) at center bottom);
  transition: --circleSize 300ms linear;
}

section:hover div {
  --circleSize: 125%;
}
```

在这个示例中，使用了[`circle()`](https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/circle) 函数将`<div>`元素裁剪成——你猜对了——一个圆形。`circle()`的半径值设置为注册的自定义属性`--circleSize`，然后在悬停时使用`transition`独立更改。结果接近[Material Design 的涟漪效果](https://m3.material.io/foundations/interaction/states/applying-states#d8d475ac-672e-4692-ae60-eb557c4990bc)，我们可以做到这一点，因为我们告诉 CSS 将自定义属性视为百分比值而不是字符串：

查看 CodePen [CSS @property \[forked\]](https://codepen.io/smashingmag/pen/PovwepK) 由 [Preethi Sam](https://codepen.io/rpsthecoder)。

定义和规范我们自己的 CSS 属性的自由赋予了我们新的动画超能力，这些能力曾经只能通过 JavaScript 实现，比如渐变颜色的过渡。

这是一个我的想法，它使用与涟漪相同的基本思想，只是它将多个自定义属性链接在一起，这些属性被格式化为颜色、长度和角度度数，用于更复杂的动画，其中文本在文本颜色变化时滑出容器。

查看 CodePen [Text animation with @property \[forked\]](https://codepen.io/smashingmag/pen/rNgavyb) 由 [Preethi Sam](https://codepen.io/rpsthecoder)。

让我们使用这个演示作为练习，了解更多关于使用@property at-rule 定义自定义属性，结合我们在涟漪中看到的插值渐变值的概念。

在前端、设计和 UX 方面，与 Brad Frost、Stéph Walter 等人一起参加 **[Smashing Workshops](https://www.smashingconf.com/online-workshops/)**，获得实用的收获、现场会议、**视频录像**和友好的 Q&A。

## HTML

```html
<div class="scrolling-text">
  <div class="text-container">
    <div class="text">
      <ruby>壹<rt>one</rt></ruby>
      <ruby>蜀<rt>two</rt></ruby>
      <ruby>兩<rt>three</rt></ruby>
    </div>
  </div>
</div>
```

HTML 包含我们将要动画化的中文字符。这些中文字符使用[`<ruby>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby)标签标记，以便在[`<rt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt)标签中提供它们的英文翻译。这个想法是`.scrolling-text`是组件的父容器，在其中，有一个子元素持有滑动的文本字符，允许字符进出视野。

## 垂直滑动

在 CSS 中，让我们在悬停时使字符垂直滑动。我们正在制作的是一个固定高度的容器，我们可以使用它在字符超出可用空间时将它们裁剪出视野。

```css
.scrolling-text {
  height: 1lh;
  overflow: hidden;
  width: min-content;
}
.text-container:has(:hover, :focus) .text {
  transform: translateY(-2lh);
}
.text {
  transition: transform 2.4s ease-in-out;
}
```

查看 CodePen [Vertical text transition \[forked\]](https://codepen.io/smashingmag/pen/pomvVPx) 由 [Preethi Sam](https://codepen.io/rpsthecoder)。

将`.scrolling-text`容器的宽度设置为[`min-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/min-content)，使字符紧密贴合，垂直堆叠在单列中。容器的高度设置为`1lh`。由于我们在容器上设置了[`overflow: hidden`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)，所以在任何给定时间点，容器中只显示一个字符。

> **提示**：你也可以使用 HTML [`<pre>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre) 元素或[`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space) 或 [`text-wrap`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap) 属性来控制文本的换行方式。

在悬停时，文本移动`-2lh`，或者单个文本字符高度的两倍，在相反的，或者说向上的方向。所以，基本上，我们通过两个字符滑动，以便在文本容器处于悬停状态时，从第一个字符动画到第三个字符。

## 将渐变应用于文本

这是一个有趣的样式设置：

```css
.text {
  background: repeating-linear-gradient(
    180deg,
    rgb(224, 236, 236),
    rgb(224, 236, 236) 5px,
    rgb(92, 198, 162) 5px,
    rgb(92, 198, 162) 6px
  );
  background-clip: text;
  color: transparent; /* 显示下面的背景 */
  background-size: 20% 20%;
}
```

你发现自己在工作中使用重复渐变的频率有多高？然而，有趣的部分是它之后的内容。看，我们正在文本上设置`transparent`颜色，这允许`repeating-linear-gradient()`透过它显示。[但由于文本在 CSS 中像所有其他元素一样是一个盒子](https://css-tricks.com/the-css-box-model/)，我们通过文本本身裁剪背景，使它看起来像是文本是从渐变中切出来的。

查看 CodePen [A gradient text (Note: View in Safari or Chrome) \[forked\]](https://codepen.io/smashingmag/pen/BaeyxZJ) 由 [Preethi Sam](https://codepen.io/rpsthecoder)。

非常整洁，对吧？现在，它看起来像是我们的文本字符上涂有条纹图案。

## 动画渐变

在这里，我们将采用其他教程中介绍的相同动画渐变概念，并将其融入到我们正在做的事情中。为此，我们将首先将一些`repeating-linear-gradient()`值注册为自定义属性。但与其它实现不同的是，我们的实现有点复杂，因为我们将动画化多个值，而不仅仅是，比如说，更新色调。

相反，我们正在动画化两种颜色、一个长度和一个角度。

```css
@property --c1 {
  syntax: "<color>";
  inherits: false;
  initial-value: rgb(224, 236, 236);
}
@property --c2 {
  syntax: "<color>";
  inherits: false;
  initial-value: rgb(92, 198, 162);
}
@property --l {
  syntax: "<length> | <percentage>";
  inherits: false;
  initial-value: 5px;
}
@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 180deg;
}

.text {
  background: repeating-linear-gradient(
    var(--angle),
    var(--c1),
    var(--c1) 5px,
    var(--c2) var(--l),
    var(--c2) 6px
  );
}
```

我们希望在包含文本的容器悬停或聚焦时更新我们注册的自定义属性的值。这只需要重新声明属性及其更新后的值。

```css
.text-container:has(:hover, :focus) .text {
  --c1: pink;
  --c2: transparent;
  --l: 100%;
  --angle: 90deg;

  background-size: 50% 100%;
  transform: translateY(-2lh);
}
```

为了非常清楚地说明正在发生的事情，这些是在悬停时更新的自定义属性和值：

- `--c1`：从`rgb(224, 236, 236)`的颜色值开始，更新为`pink`。
- `--c2`：从`rgb(92, 198, 162)`的颜色值开始，更新为`transparent`。
- `--l`：从长度值`5px`开始，更新为`100%`。
- `--angle`：从`180deg`的角度值开始，更新为`90deg`。

所以，渐变中使用的两种颜色在过渡到其他颜色时，渐变的整体大小增加并旋转。就好像我们为渐变编排了一个短暂的舞蹈动作。

## 优化过渡

同时，包含字符的`.text`元素向上滑动以一次显示一个字符。唯一的问题是我们必须告诉 CSS 在悬停时会发生什么`transition`，我们直接在`.text`元素上这样做：

```css
.text {
  transition: --l, --angle, --c1, --c2, background-size,
    transform 2.4s ease-in-out;
  transition-duration: 2s;
}
```

是的，我完全可以使用`all`关键字来选择所有正在过渡的属性。但我更喜欢额外的步骤，分别声明每一个。这是一个小习惯，可以防止浏览器监视太多事情，这可能会使速度稍微变慢。

## 最终演示

这是最终结果：

查看 CodePen [Text animation with @property \[forked\]](https://codepen.io/smashingmag/pen/qBGEYXO) 由 [Preethi Sam](https://codepen.io/rpsthecoder)。

我希望这个小练习不仅展示了我们可以用 CSS 自定义属性制作的各种花哨的东西，而且还有助于澄清自定义属性和标准变量之间的区别。标准变量是更易于维护的代码的优秀占位符（以及它们自己的一些[花哨技巧](https://css-tricks.com/the-css-custom-property-toggle-trick/)），但当你发现自己需要更新支持多个值的属性中的一个值时——比如渐变中的颜色——`@property` at-rule 就是你需要的，因为它让我们能够定义具有自定义规范的变量，设置变量的语法、初始值和继承行为。

> 当我们可以单独和独立地修改值，并承诺动画时，它既有助于简化代码，又为设计复杂的动画打开了新的可能性，这些动画可以用相对灵活的代码来实现。

这就是为什么`@property`是一个有用的 CSS 标准，要牢记并准备使用，当你考虑涉及独立值变化的动画时。
