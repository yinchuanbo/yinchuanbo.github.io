---
title: "不使用 JS 纯 CSS 获取屏幕宽高"
tag: "Css"
time: 2024-08-30 17:34:29
---

在现代前端开发中，获取屏幕的宽度和高度通常依赖于 JavaScript。然而现代 CSS 也可以获取到屏幕的宽高，通过自定义属性（CSS Variables）和一些数学函数来实现这一目标。本文将详细解析如何使用 CSS 的 `@property` 规则和一些数学运算来获取屏幕的宽高，严格的说是获取**视口的宽度和高度**。

使用 CSS 获取屏幕宽高仅是一种实现方式，部分属性和数学函数有一定的兼容性问题，所以线上环境使用需谨慎。首先来了解一些前置知识点：

## 1\. CSS 自定义属性

CSS 自定义属性（也称为 CSS 变量）允许开发者在 CSS 中定义可重用的值。通过使用 var() 函数，可以在样式表的任何地方引用这些变量。自定义属性的定义通常在 `:root` 选择器中进行，以便在整个文档中使用。

```css
:root {
  --shadow-hue: 180deg;
  --spring-duration: 1.33s;
  --canvas: 220;
  --bg: hsl(var(--canvas), 15%, 22%);
  --wgt: 200;
}
```

## 2\. @property 规则

`@property` 规则是 CSS 的一项新特性，允许开发者定义自定义属性的语法、继承性和初始值。通过 @property，我们可以指定一个属性的类型和默认值。

在我们的示例中，我们定义了两个自定义属性 `--_w` 和 `--_h`，分别表示屏幕的宽度和高度：

```css
@property --_w {
  syntax: "<length>";
  inherits: true;
  initial-value: 100vw;
}

@property --_h {
  syntax: "<length>";
  inherits: true;
  initial-value: 100vh;
}
```

- `syntax: '<length>'` 指定了属性的类型为长度。
- `inherits: true` 表示该属性可以继承。
- `initial-value` 设置了属性的初始值，分别为 100vw 和 100vh，即视口的宽度和高度。

## 3\. 数学运算函数

- `atan2(y, x)` 函数返回从 x 轴到点 `(x, y)` 的角度（以弧度为单位）。
- `tan()` 函数则计算给定角度的正切值。

## 4\. 计算屏幕宽高

在 `:root` 选择器中，我们使用 `tan()` 和 `atan2()` 函数来计算屏幕的宽度和高度，在这里我们将 `var(--_w)` 和 1px 作为参数传递，计算出宽度的角度。通过这种方式，我们可以将宽度和高度转换为无单位的整数值。

```css
:root {
  --w: tan(atan2(var(--_w), 1px));
  --h: tan(atan2(var(--_h), 1px));
}
```

## 5\. 使用 counter 显示宽高

在 `body:before` 伪元素中，我们使用 `counter` 来显示计算出的宽度和高度：

```css
body:before {
  content: counter(w) "x" counter(h);
  counter-reset: h var(--h) w var(--w);
  font-size: 50px;
  font-family: system-ui, sans-serif;
  font-weight: 900;
  position: fixed;
  inset: 0;
  width: fit-content;
  height: fit-content;
  margin: auto;
}
```

- `counter-reset` 用于初始化计数器 h 和 w，并将其值设置为 `var(--h)` 和 `var(--w)`。
- `content: counter(w) "x" counter(h);` 用于显示宽度和高度，格式为 宽度 x 高度。
- 通过设置 `position: fixed` 和 `inset: 0`，我们将内容居中显示在屏幕上。

## 6\. 效果展示

当页面加载时，浏览器会根据视口的实际宽度和高度计算出 `--w` 和 `--h` 的值，并在页面上显示出来。整个过程完全不依赖于 JavaScript。

<img src="../imgs/11/01.gif" />