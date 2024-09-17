---
title: "为什么你应该停止使用传统的 margin 和 padding 来设置 CSS 样式"
tag: "Css"
---

随着使用网络的人比以往任何时候都多，确保网络体验对所有用户都可访问的需求变得更加迫切。这包括从从不同方向/角度（（从右到左，从上到下等）。

当添加传统的 `margin` 和 `padding` 时，你明确地定义了来自各个方向（上、下、左和右）的边距和填充。这可能会在你的区域设置中创建一个看起来不错的布局，但当使用不同区域设置的用户以与你设计的方式不同的 方向/角度 和查看内容时，可能会感到困惑。

_**每个现代开发者都应该使用`margin-inline`/`margin-block`和`padding-inline`/`padding-block`。**_

我们来分析这些 CSS 属性是如何工作的，以及为什么我们要使用它们。

`margin-inline`和`padding-inline`控制左右 margin/padding。我们不是明确定义与这些特定方向对应的边距，而是将它们定义为`start`和`end`边距。虽然一个区域可能从左开始到右结束，但其他区域可能不是，所以以这种方式定义它们将确保无论区域设置如何，margin 和 padding 都会按预期显示。

同样，`margin-block`和`padding-block`控制上下 margin/padding，使用相同的`start`和`end`模式，而不是明确定义`top`和`bottom`。

**要同时为多个方向定义 margin 或 padding，你可以使用：**

- `margin-inline: [start值] [end值];` 用于左右边距
- `margin-block: [start值] [end值];` 用于上下边距
- `padding-inline: [start值] [end值];` 用于左右填充
- `padding-block: [start值] [end值];` 用于上下填充

**要仅为一个方向定义边距或填充，你可以使用：**

- `margin-inline-start`（而不是`margin-left`）
- `margin-inline-end`（而不是`margin-right`）
- `margin-block-start`（而不是`margin-top`）
- `margin-block-end`（而不是`margin-bottom`）
- `padding-inline-start`（而不是`padding-left`）
- `padding-inline-end`（而不是`padding-right`）
- `padding-block-start`（而不是`padding-top`）
- `padding-block-end`（而不是`padding-bottom`）

## 我们看一些例子：

```css
/* 传统 */
margin-left: 1.2em;
/* 等效 */
margin-inline-start: 1.2em;
/* 传统 */
padding-top: 5px;
/* 等效 */
padding-block-start: 5px;
```

或者当为多个方向定义填充时：

```css
/* 传统 */
padding: 5px 10px 20px 15px;
/* 等效 */
padding-block: 5px 20px;
padding-inline: 15px 10px;
```

当与使用 flexbox 进行内容对齐而不是`float`结合使用时，这些现代`margin`/`padding`模式更加强大。Flexbox 是一个与方向无关的布局模型。它不是明确地将元素对齐到`left`、`right`、`top`或`bottom`，而是允许将内容对齐到其父元素的垂直和水平`start`和`end`。

## 例如：

```css
/* 在从左到右查看时将子元素对齐到右侧，或在从右到左查看时对齐到左侧。 */
parent-element {
  display: flex;
  align-items: flex-end;
}
```

即使您的应用程序或网站目前不支持根据地域以不同的方向/方位显示文本/内容，开发人员最终也应通过采用上述模式，努力使所有用户都能获得无障碍的网络体验。这是一个很容易实现的过渡，每个开发人员都应采用，以实现未来的无障碍访问。
