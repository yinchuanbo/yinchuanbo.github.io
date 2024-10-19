---
title: "前端如何避免重排 reflow 和重绘 repaint"
tag: "性能优化"
---

<img src="../imgs/78/01.webp" />

## 1\. 如何避免重排（reflow）和重绘（repaint）

避免重排（reflow）和重绘（repaint）对于提高网页性能至关重要。

**重排是指浏览器重新计算元素的位置和大小的过程**，而**重绘则是指浏览器重新绘制元素的过程**。

频繁的重排和重绘会严重影响用户体验，因为它们会导致页面闪烁并消耗更多的 CPU 资源。

以下是一些减少重排和重绘的方法：

### 1.1. 避免重排 (Refow)

**1.1.1. 减少 DOM 操作:**

- 尽量减少对 DOM 树的更改，特别是那些可能引起大量子元素变化的操作。
- 使用文档片段（DocumentFragment）来批量添加多个元素，这可以减少对 DOM 的直接操作次数。

**1.1.2. 避免使用特定属性:**

- 避免使用如`offsetTop`, `offsetLeft`, `scrollLeft`, `scrollTop`, `clientWidth`, `clientHeight`等会引起重排的属性。
- 如果需要这些属性的值，先进行计算，然后执行其他操作。

**1.1.3. 使用 CSS 动画而非 JavaScript:**

- 使用 CSS3 动画和过渡效果，而不是 JavaScript 来改变元素的位置和尺寸，因为 CSS 动画通常比 JavaScript 更高效。

**1.1.4. 利用 position: fixed 或 position: absolute:**

- 对于不需要参与文档流中的元素，可以使用绝对定位或固定定位。这样它们的变化不会引起其他元素的重排。

**1.1.5. 使用 display: none:**

- 要隐藏元素时，使用`display: none`代替`visibility: hidden`，因为后者虽然使元素不可见但仍然保留空间，可能会导致其他元素的重排。

**1.1.6. 使用 requestAnimationFrame:**

- 当需要进行多次 DOM 操作时，可以将这些操作放在`requestAnimationFrame`回调函数中，这样浏览器可以在下一帧绘制之前合并所有变更。

### 1.2. 避免重绘 (Repaint)

**1.2.1. 使用 will-change 属性:**

- 对于经常发生变化的元素，可以使用`will-change`属性告诉浏览器提前准备好硬件加速，这有助于减少重绘的时间。

```js
.element {
    will-change: transform;
}
```

**1.2.2. 使用合成层:**

- 利用`translateZ(0)`、`transform: translate3d(0, 0, 0)`或`backface-visibility: hidden`创建合成层，这些属性会将元素从其父级的渲染树中分离出来，从而减少影响其他元素的重绘。

**1.2.3. 使用离屏 Canvas:**

- 对于复杂的图形操作，可以使用离屏 Canvas 进行绘制，然后再将结果绘制到屏幕上，这样可以减少重绘的次数。

**1.2.4. 使用 display: contents:**

- 对于只作为容器但不希望其自身产生边界的元素，可以使用`display: contents`，这样元素本身不会产生任何视觉输出，从而减少了重绘。

**1.2.5. 使用 CSS 变量:**

- 对于需要动态改变的样式，使用 CSS 变量可以减少重绘，因为它们是在渲染阶段处理的。

**1.2.6. 避免昂贵的样式属性:**

- 尽量避免使用`clip-path`, `filter`, `mix-blend-mode`等昂贵的 CSS 属性，因为它们会导致重绘。

### 1.3. 总结

为了最大限度地减少重排和重绘，可以遵循以下策略：

- **分批更新**：将多个 DOM 操作放在一个函数里，并通过`requestAnimationFrame`来执行。
- **使用合成层**：对于频繁更新的元素，考虑将其置于合成层中。
- **优化样式表**：尽量避免使用触发重排和重绘的 CSS 属性。
- **最小化 DOM 树的复杂性**：简化 DOM 结构可以减少元素的变化对整个页面的影响。

通过上述方法，你可以显著提高网页的性能和响应速度。
