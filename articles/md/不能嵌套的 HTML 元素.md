---
title: "不能嵌套的 HTML 元素"
tag: "Html"
time: 2024-09-15 12:50:54
---

大部分 HTML 标签都是可以互相嵌套使用的，但为了确保文档结构的正确性和语义的清晰性，某些标签有特定的嵌套规则，违反这些规则刘然浏览器会尝试自动修复，但可能会导致非开发者预期的页面渲染错误或意想不到的行为

1. **浏览器解析器故障**：浏览器尝试自动修复不正确的嵌套，导致意外的布局和样式问题；
2. **SEO 和可访问性问题**：语义不正确的 HTML 可能会影响搜索引擎优化 (SEO) 和可访问性 (A11y)；
3. **用户体验问题**：可能在不同的设备和浏览器中表现不一致，从而影响用户体验；

大家看看下面说的几个不能嵌套的 HTML 元素，你用错过几个呢～

## 一. a 不能嵌套 a

不能在 `<a>` 标签内嵌套另一个 `<a>` 标签

```html
<!-- 错误 -->
<a href="https://example.com">
  Link 1
  <a href="https://example2.com">Link 2</a>
</a>
```

虽然浏览器通常会自动修复这个错误，但会把内层的 `<a>` 标签移到外面的 `<a>` 标签外面，导致布局和样式异常，同时 SSR 时候会直接渲染失败。

## 二. p 嵌套 block 元素

**不能**在 `<p>` 标签内嵌套**块级元素**（如 `<div>`、`<h1>`、`<p>`）。

段落标签是一个块级容器，但它只能包含**行内元素**（如 `<span>`、`<b>`）

```html
<!-- 错误 -->
<p>This is a paragraph.
  <div>This is a div inside a paragraph.</div>
</p>

<!-- 正确 -->
<p>First paragraph.</p>
<p>Second paragraph.</p>
```

览器通常会自动修复，将内层的块级元素 `<div>` 从段落 `<p>` 中移出，这样段落内容可能会分成多个块，影响文本流和布局。

## 三. ul 和 ol 标签包含非 li 元素

**`<ul>` 和 `<ol>` 只能包含 `<li>` 元素**

```html
<!-- 错误 -->
<ul>
  <div>This is a div inside a ul.</div>
</ul>
```

意外的嵌套可能导致列表显示不完整或破坏列表的结构。

## 四. li 标签在非列表元素中

**`<li>` 标签只能在 `<ul>`、`<ol>` 或 `<menu>` 中使用**

```html
<!-- 错误 -->
<div>
  <li>This is a list item inside a div.</li>
</div>
```

浏览器会自动修复，将 `<li>` 移出 `<div>`，列表项可能显示不正常，破坏文档结构。

## 五. dt 和 dd 标签在非 dl 元素中

`<dt>` 和 `<dd>` 只能在 `<dl>` 中使用

```html
<!-- 错误 -->
<p>
  <dt>This is a term.</dt>
  <dd>This is a description.</dd>
</p>
```

浏览器会修复这个错误，将 `<dt>` 和 `<dd>` 移出 `<p>`，造成定义和描述可能显示不正确。

## 六. form 标签嵌套

表单标签不能嵌套，大部分浏览器会忽略内嵌的 `<form>`，只处理外层表单

```html
<!-- 错误 -->
<form action="/submit">
  <input type="text" name="name" />
  <form action="/nested_submit">
    <input type="text" name="nestedName" />
  </form>
</form>
```

## 七. table 标签包含非表格结构标签

`<table>` 标签只能包含 `<caption>`，`<colgroup>`，`<thead>`，`<tbody>`，`<tfoot>` 和 `<tr>` 标签

```html
<!-- 错误 -->
<table>
  <div>This is a div inside a table.</div>
</table>
```

浏览器可能会修复这个错误，将 `<div>` 移出 `<table>`，导致表格布局不正确，数据未正确显示。

## 八. h1 到 h6 标签嵌套

HTML 规范建议不嵌套标题，这会导致文档结构语义不正确

```html
<!-- 错误 -->
<h1>
  Main title
  <h2>Sub title</h2>
</h1>
```

浏览器会修复这个错误，将内层标题移到外层标题之外，影响文档的可读性和 SEO。

## 九. button 标签嵌套可点击元素

`<button>` 标签不能包含可点击元素（如 `<a>` 标签）

```html
<!-- 错误 -->
<button>
  <a href="https://example.com">Link inside button</a>
</button>
```

浏览器处理不一致，有些会禁用内部链接，有些会忽略内层标签，导致链接无法点击或按钮行为不一致。

## 十. label 标签嵌套其他 label

`<label>` 标签不能嵌套其他 `<label>` 标签

```html
<!-- 错误 -->
<label>
  Outer Label
  <label>Inner Label</label>
</label>
```

浏览器可能会修复这个错误，将内层 `<label>` 移到外层 `<label>` 之外，表单控件关联可能失效，影响表单的可用性。
