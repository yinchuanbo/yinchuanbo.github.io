---
title: "scss 日常用法"
tag: "Css"
time: 2024-09-01 15:21:24
---

### 1\. 变量（Variables）

```scss
$primary-color: #3498db;
$secondary-color: #2ecc71;

body {
  background-color: $primary-color;
  color: $secondary-color;
}
```

### 2\. 嵌套（Nesting）

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      display: inline-block;
    }
  }
  a {
    text-decoration: none;
  }
}
```

### 混合（Mixins）

```scss
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

.button {
  @include border-radius(5px);
}
```

### 4\. 继承（Inheritance）

```scss
%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success-message {
  @extend %message-shared;
  background-color: #dff0d8;
}

.error-message {
  @extend %message-shared;
  background-color: #f2dede;
}
```

### 5\. 导入（Import）：将多个 Sass 文件合并为一个文件

```scss
@import "variables";
@import "mixins";
@import "base";
```

### 6\. 函数（Functions）：使用 Sass 提供的内置函数或自定义函数进行数学计算、颜色操作等

```scss
$base-font-size: 16px;

@function em($target, $context: $base-font-size) {
  @return #{$target / $context}em;
}

h1 {
  font-size: em(24px);
}
```

### 7\. 循环（Loops）：使用 Sass 的循环功能来减少重复代码

```scss
@for $i from 1 through 3 {
  .item-#{$i} {
    width: 100px * $i;
  }
}
```

### 8\. 条件语句（Control Directives）：使用 Sass 中的条件语句来根据条件设置样式

```scss
$theme: dark;

body {
  @if $theme == dark {
    background-color: #333;
    color: #fff;
  } @else {
    background-color: #fff;
    color: #333;
  }
}
```

### 9\. 模块化（Modularity）：将样式表拆分为多个模块，并通过导入文件组织样式

```scss
// _variables.scss
$primary-color: #3498db;
```

```scss
// _mixins.scss
@mixin button-styles {
  padding: 10px;
  border: 1px solid $primary-color;
}
```

```scss
// style.scss
@import "variables";
@import "mixins";
.button {
  @include button-styles;
}
```

### 10\. 自定义指令（Custom Directives）：使用 Sass 的 @at-root 和 @at-root-parent 指令来控制样式的输出

```scss
@mixin nested-styles {
  @at-root {
    color: #333;
  }
}
.container {
  @include nested-styles;
}
```

转换为 css:

```css
color: #333;
```

### 11\. 插值（Interpolation）：使用 #{} 插入 Sass 变量、表达式等到样式中

```scss
$property: margin;
$value: 10px;
.element {
  #{$property}-top: $value;
}
```

### 12\. 继承选择器（Selector Inheritance）：使用 @at-root 和 & 结合实现选择器的继承

```scss
%hover-effect {
  &:hover {
    color: red;
  }
}
.element {
  @at-root {
    .other-class {
      @extend %hover-effect;
    }
  }
}
```

### 13\. Placeholders（%）：使用 % 定义占位符样式，在需要时再通过 @extend 引用

```scss
%clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
.container {
  @extend %clearfix;
}
```

### 14\. 模块化（Module Bundling）：使用 @use 和 @forward 指令进行模块化开发，实现更好的样式组织和隔离

```scss
// _variables.scss
$primary-color: #3498db;
```

```scss
// _mixins.scss
@mixin button-styles {
  padding: 10px;
  border: 1px solid $primary-color;
}
```

```scss
// style.scss
@use "variables";
@use "mixins";
.button {
  @include mixins.button-styles;
}
```

### 15\. 扩展原生 CSS 功能（Extending Native CSS Features）：使用 Sass 实现 CSS 中没有的功能，例如循环生成动画、栅格系统等

```scss
@for $i from 1 through 12 {
  .col-#{$i} {
    width: (100% / 12) * $i;
    float: left;
  }
}
```

### 16\. 动态导入（Dynamic Import）：根据需求动态加载 SCSS 文件并合并样式

```scss
$theme: light;

@function get-theme-file() {
  @return "themes/" + $theme + ".scss";
}

@import get-theme-file();
```

### 17\. 自定义 @规则（Custom @ Rules）：通过 mixin 和混合宏实现自定义样式规则，扩展 Sass 的能力

```scss
@mixin custom-placeholder {
  &::placeholder {
    color: red;
  }
}
.input {
  @include custom-placeholder;
}
```

### 18\. 多重继承（Multiple Inheritance）：通过 @extend 同时继承多个占位符或选择器

```scss
%button-base {
  padding: 10px;
  border: 1px solid black;
}

%button-red {
  color: red;
}

.element {
  @extend %button-base, %button-red;
}
```

### 19\. 条件语句（Conditional Statements）：使用 @if、@else if 和 @else 实现根据条件应用不同样式

```scss
$theme: dark;

.element {
  @if $theme == dark {
    background-color: black;
    color: white;
  }  if">@else if $theme == light {
    background-color: white;
    color: black;
  } @else {
    background-color: gray;
    color: black;
  }
}
```

### 20\. 颜色函数（Color Functions）：使用 Sass 的颜色函数进行颜色计算、转换等操作

```scss
$base-color: #3498db;
.element {
  background-color: darken($base-color, 10%);
}
```

### 21\. 样式映射（Style Maps）：使用 map 数据类型管理多个相关的样式属性

```scss
$colors: (
  primary: blue,
  secondary: green,
);
.element {
  color: map-get($colors, primary);
}
```

### 22\. 模块化开发（Modular Development）：通过文件分割、模块化导入等方式组织 Sass 文件，提高可维护性

```scss
@import "variables";
@import "mixins";
@import "base";
@import "components";
```

### 23\. 函数式混合（Functional Mixins）：创建函数式混合以支持更复杂的样式计算

```scss
@function divide($a, $b) {
  @return $a / $b;
}
@mixin apply-transform($x, $y) {
  transform: translate(divide($x, 2), divide($y, 2));
}
.element {
  @include apply-transform(100px, 200px);
}
```

### 24\. 使用 @each 循环遍历列表或映射（@each Loop for Lists or Maps）：使用 @each 循环遍历列表或映射进行样式处理

```scss
$colors: (
  primary: blue,
  secondary: green,
  tertiary: red,
);

@each $key, $value in $colors {
  .#{$key}-button {
    background-color: $value;
  }
}
```

### 25\. 样式函数（Style Functions）：定义自定义函数以处理样式属性的计算或转换

```scss
@function adjust-color($color, $percent) {
  @return mix(white, $color, $percent);
}
.element {
  background-color: adjust-color(blue, 30%);
}
```
