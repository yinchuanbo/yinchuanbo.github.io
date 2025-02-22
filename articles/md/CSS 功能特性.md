---
title: "CSS 功能特性"
tag: "Css"
time: 2024-09-01 15:21:24
---

### 01 clamp()

> clamp() 函数的作用是把一个值限制在一个上限和下限之间，当这个值超过最小值和最大值的范围时，在最小值和最大值之间选择一个值使用。它接收三个参数：最小值、首选值、最大值。

```css
.box {
  width: clamp(220px, 55%, 300px);
}
h1 {
  letter-spacing: 2px;
  font-size: clamp(1.8rem, 2.5vw, 2.8rem);
}
```

### 02 smooth

> 平滑滚动。

```html
<div class="top">
  <a href="#bottom">TOP</a>
</div>
<div class="bottom" id="bottom">BOTTOM</div>
```

```css
html {
  scroll-behavior: smooth;
}
.top,
.bottom {
  height: 100vh;
}
```

### 03 scroll snap

> 允许开发者在用户完成滚动后将视窗锁定在特定的元素或位置；设置了在有滚动容器的情形下吸附至吸附点的严格程度。

**语法：**

```sh
#不吸附
scroll-snap-type: none;

#表示吸附轴的关键字
scroll-snap-type: x;
scroll-snap-type: y;
scroll-snap-type: block;
scroll-snap-type: inline;
scroll-snap-type: both;

#表示吸附程度的可选关键字
#mandatory 或 proximity
scroll-snap-type: x mandatory;
scroll-snap-type: y proximity;
scroll-snap-type: both mandatory;

#全局值
scroll-snap-type: inherit;
scroll-snap-type: initial;
scroll-snap-type: revert;
scroll-snap-type: revert-layer;
scroll-snap-type: unset;
```

```html
<div class="holster">
  <div class="container x mandatory-scroll-snapping" dir="ltr">
    <div>x 轴强制、从左往右</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
  <div class="container x proximity-scroll-snapping" dir="ltr">
    <div>x 轴靠近、从左往右</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
  <div class="container y mandatory-scroll-snapping" dir="ltr">
    <div>y 轴强制、从左往右</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
  <div class="container y proximity-scroll-snapping" dir="ltr">
    <div>y 轴靠近、从左往右</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
  <div class="container x mandatory-scroll-snapping" dir="rtl">
    <div>x 轴强制、从右往左</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
  <div class="container x proximity-scroll-snapping" dir="rtl">
    <div>x 轴靠近、从右往左</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
  <div class="container y mandatory-scroll-snapping" dir="rtl">
    <div>y 轴强制、从右往左</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
  <div class="container y proximity-scroll-snapping" dir="rtl">
    <div>y 轴靠近、从右往左</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </div>
</div>
```

```css
/* 滚动吸附 */
.x.mandatory-scroll-snapping {
  scroll-snap-type: x mandatory;
}
.y.mandatory-scroll-snapping {
  scroll-snap-type: y mandatory;
}
.x.proximity-scroll-snapping {
  scroll-snap-type: x proximity;
}
.y.proximity-scroll-snapping {
  scroll-snap-type: y proximity;
}

.container > div {
  text-align: center;
  scroll-snap-align: center;
  flex: none;
}
```

### 04 inset

> 属性 inset 为简写属性，对应于 top、right、bottom 和 left 属性。其与 margin 简写属性具有相同的多值语法。

**语法：**

```sh
#长度值
inset: 10px; #应用于所有边
inset: 4px 8px; #上下 | 左右
inset: 5px 15px 10px; #上 | 左右 | 下
inset: 2.4em 3em 3em 3em; #上 | 右 | 下 | 左

#包含块的宽度（左或右）或高度（上或下）的百分比
inset: 10% 5% 5% 5%;

#关键词值
inset: auto;

#全局值
inset: inherit;
inset: initial;
inset: revert;
inset: revert-layer;
inset: unset;
```

### 05 inline、block

**padding-inline**

- 兼容性良好

> 定义了元素的逻辑行首和行末内边距，并根据元素的书写模式、行内方向和文本朝向对应至实体内边距。

```css
.box {
  padding-inline: 5% 10%;
  writing-mode: horizontal-tb;
}
```

![](../imgs/45/06.png)

```css
.box {
  padding-inline: 15px 40px;
  writing-mode: vertical-rl;
}
```

![](../imgs/45/07.png)

```css
.box {
  padding-inline: 5% 20%;
  writing-mode: horizontal-tb;
  direction: rtl;
}
```

![](../imgs/45/08.png)

- 属性构成
  - padding-inline-end
  - padding-inline-start
- 语法

```sh
#<length> 值
padding-inline: 10px 20px; #绝对长度
padding-inline: 1em 2em; #相对于文本尺寸
padding-inline: 10px; #同时设置行首和行末值

#<percentage> 值
padding-inline: 5% 2%; #相对于最近包含区块的宽度

#全局值
padding-inline: inherit;
padding-inline: initial;
padding-inline: revert;
padding-inline: revert-layer;
padding-inline: unset;
```

`padding-inline` 属性可用一个或两个值指定。若给一值，则此值同时用于 `padding-inline-start` 和 `padding-inline-end`。若给两值，则第一个用于 `padding-inline-start` 而第二个用于 `padding-inline-end`。

- 为竖排文本设置行向内边距

```html
<div>
  <p class="exampleText">示例文本</p>
</div>
```

```css
div {
  background-color: yellow;
  width: 120px;
  height: 120px;
}
.exampleText {
  writing-mode: vertical-rl;
  padding-inline: 20px 40px;
  background-color: #c8c800;
}
```

![](../imgs/45/09.png)

**padding-block**

- 兼容性良好

> 定义了元素的逻辑块首和块末内边距，并根据元素的书写模式、行内方向和文本朝向对应至实体内边距。

```css
.box {
  padding-block: 10px 20px;
  writing-mode: horizontal-tb;
}
```

![](../imgs/45/10.png)

```css
.box {
  padding-block: 20px 40px;
  writing-mode: vertical-rl;
}
```

![](../imgs/45/11.png)

```css
.box {
  padding-block: 5% 10%;
  writing-mode: horizontal-tb;
}
```

![](../imgs/45/12.png)

```css
.box {
  padding-block: 2em 4em;
  writing-mode: vertical-lr;
}
```

![](../imgs/45/13.png)

- 属性构成
  - padding-block-end
  - padding-block-start
- 语法

```sh
# <length> 值
padding-block: 10px 20px; # 绝对长度
padding-block: 1em 2em; # 相对于文本尺寸
padding-block: 10px; # 同时设置块首和块末值

# <percentage> 值
padding-block: 5% 2%; # 相对于最近包含区块的宽度

# 全局值
padding-block: inherit;
padding-block: initial;
padding-block: revert;
padding-block: revert-layer;
padding-block: unset;
```

`padding-block` 属性可用一个或两个值指定。若给一值，则此值同时用于 `padding-block-start` 和 `padding-block-end`。若给两值，则第一个用于 `padding-block-start` 而第二个用于 `padding-block-end`。

- 为竖排文本设置块向内边距

```html
<div>
  <p class="exampleText">示例文本</p>
</div>
```

```css
div {
  background-color: yellow;
  width: 120px;
  height: 120px;
}

.exampleText {
  writing-mode: vertical-rl;
  padding-block: 20px 40px;
  background-color: #c8c800;
}
```

![](../imgs/45/14.png)

**margin-inline**

- 兼容性良好

> 定义了元素的逻辑行首和行末外边距，并根据元素的书写模式、行内方向和文本朝向对应至实体外边距。

```css
.box {
  margin-inline: 5% 10%;
  writing-mode: horizontal-tb;
}
```

![](../imgs/45/15.png)

```css
.box {
  margin-inline: 10px 40px;
  writing-mode: vertical-rl;
}
```

![](../imgs/45/16.png)

```css
.box {
  margin-inline: 5% 10%;
  writing-mode: horizontal-tb;
  direction: rtl;
}
```

![](../imgs/45/17.png)

- 属性构成
  - margin-inline-start
  - margin-inline-end
- 语法

```sh
#<length> 值
margin-inline: 10px 20px; #绝对长度
margin-inline: 1em 2em; #相对于文本尺寸
margin-inline: 5% 2%; #相对于最近区块容器的宽度
margin-inline: 10px; #同时设置行首和行末值

#关键词值
margin-inline: auto;

#全局值
margin-inline: inherit;
margin-inline: initial;
margin-inline: revert;
margin-inline: revert-layer;
margin-inline: unset;
```

根据 `writing-mode`、`direction` 和 `text-orientation` 所定义的值，此属性对应于 `margin-top` 和 `margin-bottom`，或者 `margin-right` 和 `margin-left` 属性。

`margin-inline` 属性可用一个或两个值指定。

- 用一个值指定时，行首和行末应用同样的外边距。
- 用两个值指定时，第一个外边距应用于行首，第二个应用于行末。
- 设置行首和行末外边距

```css
div {
  background-color: yellow;
  width: 120px;
  height: auto;
  border: 1px solid green;
}

p {
  margin: 0;
  margin-inline: 20px 40px;
  background-color: tan;
}

.verticalExample {
  writing-mode: vertical-rl;
}
```

```html
<div>
  <p>示例文本</p>
</div>
<div class="verticalExample">
  <p>示例文本</p>
</div>
```

![](../imgs/45/18.png)

**margin-block**

- 兼容性良好

> 定义了元素的逻辑块首和块末外边距，并根据元素的书写模式、行内方向和文本朝向对应至实体外边距。

```css
.box {
  margin-block: 10px 20px;
  writing-mode: horizontal-tb;
}
```

![](../imgs/45/19.png)

```css
.box {
  margin-block: 20px 40px;
  writing-mode: vertical-rl;
}
```

![](../imgs/45/20.png)

```css
.box {
  margin-block: 5% 20%;
  writing-mode: horizontal-tb;
}
```

![](../imgs/45/21.png)

```css
.box {
  margin-block: 1rem auto;
  writing-mode: vertical-lr;
}
```

![](../imgs/45/22.png)

- 属性构成
  - margin-block-start
  - margin-block-end

```sh
#<length> 值
margin-block: 10px 20px; #绝对长度
margin-block: 1em 2em; #相对于文本尺寸
margin-block: 5% 2%; #相对于最近区块容器的宽度
margin-block: 10px; #同时设置块首和块末值

#关键词值
margin-block: auto;

#全局值
margin-block: inherit;
margin-block: initial;
margin-block: revert;
margin-block: revert-layer;
margin-block: unset;
```

根据 writing-mode、direction 和 text-orientation 所定义的值，此属性对应于 margin-top 和 margin-bottom，或者 margin-right 和 margin-left 属性。

`margin-block` 属性可用一个或两个值指定。

1. 用**一个**值指定时，**块首和块末**应用同样的外边距。
2. 用**两个**值指定时，第一个外边距应用于**块首**，第二个应用于**块末**。

- 设置块首和块末外边距

```html
<div>
  <p>示例文本</p>
</div>
<div class="verticalExample">
  <p>示例文本</p>
</div>
```

```css
div {
  background-color: yellow;
  width: 120px;
  height: auto;
  border: 1px solid green;
}

p {
  margin: 0;
  margin-block: 20px 40px;
  background-color: tan;
}

.verticalExample {
  writing-mode: vertical-rl;
}
```

![](../imgs/45/23.png)

**border-inline**

- 兼容性良好

> 用于在样式表中的某处同时设置逻辑行向边框的各属性值。

```css
.box {
  border-inline: solid;
  writing-mode: horizontal-tb;
}
```

![](../imgs/45/24.png)

```css
.box {
  border-inline: dashed red;
  writing-mode: vertical-rl;
}
```

![](../imgs/45/25.png)

```css
.box {
  border-inline: 1rem solid;
  writing-mode: horizontal-tb;
  direction: rtl;
}
```

![](../imgs/45/26.png)

`border-inline` 所对应的实体边框取决于元素的书写模式、行内方向和文本朝向。根据 `writing-mode`、`direction` 和 `text-orientation` 所定义的值，此属性对应于 `border-top` 和 `border-bottom`，或者 `border-right` 和 `border-left` 属性。

另一方向的边框可用 `border-block` 设置，此属性会设置 `border-block-start` 和 `border-block-end`。

- 语法

```sh
border-inline: 1px;
border-inline: 2px dotted;
border-inline: medium dashed blue;

# 全局值
border-inline: inherit;
border-inline: initial;
border-inline: revert;
border-inline: revert-layer;
border-inline: unset;
```

- 竖排文本的边框

```html
<div>
  <p class="exampleText">示例文本</p>
</div>
```

```css
div {
  background-color: yellow;
  width: 120px;
  height: 120px;
}
.exampleText {
  writing-mode: vertical-rl;
  border-inline: 5px dashed blue;
}
```

![](../imgs/45/27.png)

### 06 min()、max()

1. min()

```sh
width: min(1vw, 4em, 80px);
```

在上面的例子中，宽度最多是 80px。如果视口的宽度小于 800px，或者一个 em 的宽度小于 20px，则会更窄。换句话说，最大宽度是 80px，

**示例**

`min()` 让我们在设置图像的最大宽度时更简单。在下面这个例子中，在小型设备上宽度拉伸为 window 的一半，但在大型设备上，不超过 300px，不使用媒体查询：

```css
.logo {
  width: min(50vw, 300px);
}
```

```html
<img
  src="https://developer.mozilla.org/static../imgs/45b-docs-sprite.svg"
  alt="MDN Web Docs"
  class="logo"
/>
```

在这个例子中，除非视口比 600px 更窄，否则 logo 的宽会被设置为 300px，到时候，它会随着视口的缩小而缩小，而且总是视口宽度的 50%。

**给 label 和 input 设置最大值**

CSS 方法的另一个用途时设置响应式组件（form）的最大尺寸：让 label 和 input 的宽度随着组件的缩小而缩小。

```html
<form>
  <label>Type something:</label>
  <input type="text" />
</form>
```

```css
input,
label {
  padding: 2px;
  box-sizing: border-box;
  display: inline-block;
  width: min(40%, 400px);
  background-color: pink;
}

form {
  margin: 4px;
  border: 1px solid black;
  padding: 4px;
}
```

这里，form 的 margin，border，padding 总是它父元素的宽度的 100%。我们声明 input 和 label 的宽度比 form 的 40% 还小或者 400px 宽，只要取决于哪一个最小。换句话说，input 和 label 的最大宽度就是 400px，最窄就是 form 的 40%。因此看起来会显得很小。

![](../imgs/45/05.png)

**无障碍问题**

当 min() 用于控制文本大小时，要保证文本足够大以便于阅读。建议把 min() 方法嵌入到 max() 中， relative length unit 这样就可以便于阅读，比如：

```css
small {
  font-size: max(min(0.5vw, 0.5em), 1rem);
}
```

这用于保证最小值是 1rem，这样在页面缩放时文本也会缩放。

2. max()

```sh
width: max(10vw, 4em, 80px);
```

在上面这个例子中，宽度最小会是 80px，除非视图宽度大于 800px 或者是一个 em 比 20px 宽。简单来说，最小宽度是 80px。你也可以认为 max() 的值提供了一个属性最小可能的值。

**为字体设定一个最小字号**

```css
h1 {
  font-size: 2rem;
}
h1.responsive {
  font-size: max(4vw, 2em, 2rem);
}
```

**无障碍**

```css
small {
  font-size: max(min(0.5vw, 0.5em), 1rem);
}
```

### 07 line-clamp

- 兼容性良好

> 属性可以把块容器中的内容限制为指定的行数。

它只有在 display 属性设置成 `-webkit-box` 或者 `-webkit-inline-box` 并且 `box-orient` 属性设置成 `vertical` 时才有效果。

在大部分情况下，也需要设置 overflow 属性为 hidden，否则，里面的内容不会被裁减，并且在内容显示为指定行数后还会显示省略号。

当应用于锚（anchor）元素时，截断可以发生在文本中间，而不必在末尾。

**语法**

```sh
#关键词值
-webkit-line-clamp: none;

#整数值
-webkit-line-clamp: 3;
-webkit-line-clamp: 10;

#全局值
-webkit-line-clamp: inherit;
-webkit-line-clamp: initial;
-webkit-line-clamp: revert;
-webkit-line-clamp: revert-layer;
-webkit-line-clamp: unset;
```

**截断段落**

```html
<p>
  在此示例中，<code>-webkit-line-clamp</code> 属性设置为
  <code>2</code>，即文本在超过两行后将被截断。文本截断处将显示省略号。
</p>
```

```css
p {
  width: 300px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

![](../imgs/45/04.png)

### 08 :has()

- 火狐浏览器不支持

```css
/* 当 h1 元素后面紧跟着一个兄弟元素 p 时，会应用以下样式 */
h1:has(+ p) {
  margin-bottom: 0;
}
```

**与兄弟组合器一起使用**

- 以下示例中的 :has() 样式声明会调整 H1 标题后面的间距，如果它们后面紧跟着 H2 标题。

```html
<section>
  <article>
    <h1>Morning Times</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </article>
  <article>
    <h1>Morning Times</h1>
    <h2>Delivering you news every morning</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </article>
</section>
```

```css
h1,
h2 {
  margin: 0 0 1rem 0;
}
h1:has(+ h2) {
  margin: 0 0 0.25rem 0;
}
```

![](../imgs/45/02.png)

**与 :is() 伪类一起使用**

- 这个示例建立在前一个示例之上，展示了如何用 :has() 选择多个元素。

```html
<section>
  <article>
    <h1>Morning Times</h1>
    <h2>Delivering you news every morning</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </article>
  <article>
    <h1>Morning Times</h1>
    <h2>Delivering you news every morning</h2>
    <h3>8:00 am</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </article>
</section>
```

```css
h1,
h2,
h3 {
  margin: 0 0 1rem 0;
}
:is(h1, h2, h3):has(+ :is(h2, h3, h4)) {
  margin: 0 0 0.25rem 0;
}
```

![](../imgs/45/03.png)

这个选择器也可以写作：

```css
:is(h1, h2, h3):has(+ h2, + h3, + h4) {
  margin: 0 0 0.25rem 0;
}
```

### 09 :is

- 兼容性良好

> 以选择器列表作为参数，并选择该列表中任意一个选择器可以选择的元素；这对于以更紧凑的形式编写大型选择器非常有用。

**尝试一下：**

```html
<ol>
  <li>Saturn</li>
  <li>
    <ul>
      <li>Mimas</li>
      <li>Enceladus</li>
      <li>
        <ol>
          <li>Voyager</li>
          <li>Cassini</li>
        </ol>
      </li>
      <li>Tethys</li>
    </ul>
  </li>
  <li>Uranus</li>
  <li>
    <ol>
      <li>Titania</li>
      <li>Oberon</li>
    </ol>
  </li>
</ol>
```

```css
ol {
  list-style-type: upper-alpha;
  color: darkblue;
}

/* stylelint-disable-next-line selector-pseudo-class-no-unknown */
:is(ol, ul, menu:unsupported) :is(ol, ul) {
  color: green;
}

:is(ol, ul) :is(ol, ul) ol {
  list-style-type: lower-greek;
  color: chocolate;
}
```

![](../imgs/45/01.png)

在 CSS 中，当使用选择器列表时，如果任何一个选择器无效，则整个列表将被视为无效。使用 :is() 或 :where() 时，如果一个选择器无法解析，整个选择器列表不会被视为无效，而是会忽略不正确或不支持的选择器，并使用其他的选择器。

```css
/* 即使在不支持 :unsupported 的浏览器中，仍将正确解析 :valid */
:is(:valid, :unsupported) {
  /* … */
}
```

```css
/* 在不支持 :unsupported 浏览器中即使它们支持 :valid，仍将忽略。 */
:valid,
:unsupported {
  /* … */
}
```

**简化列表选择器**

`:is()` 伪类可以大大简化你的 CSS 选择器。例如，考虑以下 CSS：

```css
/* 三层或更深的无序列表使用方形符号。 */
ol ol ul,
ol ul ul,
ol menu ul,
ol dir ul,
ol ol menu,
ol ul menu,
ol menu menu,
ol dir menu,
ol ol dir,
ol ul dir,
ol menu dir,
ol dir dir,
ul ol ul,
ul ul ul,
ul menu ul,
ul dir ul,
ul ol menu,
ul ul menu,
ul menu menu,
ul dir menu,
ul ol dir,
ul ul dir,
ul menu dir,
ul dir dir,
menu ol ul,
menu ul ul,
menu menu ul,
menu dir ul,
menu ol menu,
menu ul menu,
menu menu menu,
menu dir menu,
menu ol dir,
menu ul dir,
menu menu dir,
menu dir dir,
dir ol ul,
dir ul ul,
dir menu ul,
dir dir ul,
dir ol menu,
dir ul menu,
dir menu menu,
dir dir menu,
dir ol dir,
dir ul dir,
dir menu dir,
dir dir dir {
  list-style-type: square;
}
```

你可以将其替换为：

```css
/* 三层或更深的无序列表使用方形符号。 */
:is(ol, ul, menu, dir) :is(ol, ul, menu, dir) :is(ul, menu, dir) {
  list-style-type: square;
}
```

**简化段落选择器**

`:is()` 伪类在处理段落和标题时特别有用。由于 `<section>`、`<article>`、`<aside>` 和 `<nav>` 通常嵌套在一起，如果没有 `:is()`，将它们设置为相互匹配很棘手。

例如，没有 :is()，在不同的深度对所有 h1 元素进行样式化可能是非常复杂的：

```css
/* 0 级 */
h1 {
  font-size: 30px;
}

/* 1 级 */
section h1,
article h1,
aside h1,
nav h1 {
  font-size: 25px;
}

/* 2 级 */
section section h1,
section article h1,
section aside h1,
section nav h1,
article section h1,
article article h1,
article aside h1,
article nav h1,
aside section h1,
aside article h1,
aside aside h1,
aside nav h1,
nav section h1,
nav article h1,
nav aside h1,
nav nav h1 {
  font-size: 20px;
}

/* 3 级 */
/* 想都别想！ */
```

然而，使用 `:is()` 将容易的多：

```css
/* 0 级 */
h1 {
  font-size: 30px;
}
/* 1 级 */
:is(section, article, aside, nav) h1 {
  font-size: 25px;
}
/* 2 级 */
:is(section, article, aside, nav) :is(section, article, aside, nav) h1 {
  font-size: 20px;
}
/* 3 级 */
:is(section, article, aside, nav)
  :is(section, article, aside, nav)
  :is(section, article, aside, nav)
  h1 {
  font-size: 15px;
}
```

**:is() 不能选择伪元素**

```css
/* 错误写法 */
some-element:is(::before, ::after) {
  display: block;
}
```
