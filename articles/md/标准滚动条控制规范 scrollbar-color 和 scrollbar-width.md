---
title: "标准滚动条控制规范 scrollbar-color 和 scrollbar-width"
tag: "Css"
time: 2024-12-03 20:41:29
---

Chrome 在 121 版本开始，原生支持了两个滚动条样式相关的样式 scrollbar-color 和 scrollbar-width。

要知道，在此前，虽然有 [::-webkit-scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar) 规范可以控制滚动条，可是，`::-webkit-scrollbar` 是非标准特性，在 MDN 文档中都明确了不应该在生产环境使用它。

而 `scrollbar-color` 和 `scrollbar-width` 是官方标准，在 [CSS Scrollbars Styling Module Level 1](https://drafts.csswg.org/css-scrollbars/#scrollbar-width) 规范中被提出。

本文，我们就将一起学习看看这两个属性的使用。

## scrollbar-color 设置滚动条颜色

顾名思义，scrollbar-color 就是用于设置滚动条颜色的。

不过有意思的是，一个完整的滚动条，其实是有多个小组件组成的，所以能设置的颜色其实也有很多。

以非标准规范 `::-webkit-scrollbar` 为例，它将滚动条拆分成了这么多个部分：

<img src="../imgs/111/16.png" />

当然，新规范没有这么复杂，我们简化上述的图，可以得到这么一张图：

<img src="../imgs/111/17.png" />

而 `scrollbar-color` 能够设置的，正是上图中的 track 和 thumb 的颜色：

- 轨道（track）是指滚动条，其一般是固定的而不管滚动位置的背景。
- 滑块（thumb）是指滚动条通常漂浮在轨道的顶部上的移动部分。

简单举个例子:

```html
<div class="scroll-box">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis quaerat
    ipsam fugit fugiat cupiditate asperiores neque libero natus atque, suscipit
    error esse inventore numquam molestiae quas laborum eius debitis cum? Lorem
    ipsum dolor sit amet consectetur adipisicing elit. Reiciendis quaerat ipsam
    fugit fugiat cupiditate asperiores neque libero natus atque, suscipit error
    esse inventore numquam molestiae quas laborum eius debitis cum? ...
  </p>
</div>
```

```css
.scroll-box {
  border: 1px solid #666;
  overflow: scroll;
}
```

正常而言，当 `<p>` 标签内的内容足够多，溢出到开始滚动，则滚动条样式为：

<img src="../imgs/111/18.png" />

此时，我们可以通过 `scrollbar-color` 设置滚动条的轨道颜色和滑块颜色：

```css
.scroll-box {
  border: 1px solid #666;
  overflow: scroll;
  scrollbar-color: #fff #000;
  // OR
  scrollbar-color: #000 #fff;
}
```

则，样式表现如下：

<img src="../imgs/111/19.png" />

看图就非常好理解了，简单而言 `scrollbar-color: #000 #fff`，需要设置两个颜色，将第一种颜色应用于滚动条滑块，第二种颜色应用于滚动条轨道。

当然，上图是在 Windows 操作系统下的样式表现，我再补充一张在 macOS/iOS 操作系统下的样式表现效果：

<img src="../imgs/111/20.png" />

由于 macOS/iOS 操作系统默认情况下，即便容器内是可滚动的，也不会显示滚动条，上述效果都是在 Hover 状态或者滚动状态下的效果。

并且，**值得注意的是，大家可以发现，macOS/iOS 操作系统下滚动条轨道是透明的，无法被设置颜色，只能设置滚动条滑块的颜色**。

完整的 DEMO，你可以戳这里：[CodePen Demo -- Scrollbar-color Demo](https://codepen.io/Chokcoco/pen/GRLQzYB?editors=1100)

当然，值得注意的是。很多人看中文版的 [MDN 文档（2024-04-06）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scrollbar-color)，会看到除了直接设置两个颜色值，以及上面的 `auto` 关键字，规范还提供了 `light` 和 `dark` 关键字：

```css
 {
  /* Keyword values */
  scrollbar-color: auto;
  scrollbar-color: dark;
  scrollbar-color: light;
}
```

在我实测过后，发现实际没有任何浏览器（用户代理）目前支持 `light` 和 `dark` 关键字。

中文文档存在一定的滞后性，还是推荐大家直接看英文文档：

<img src="../imgs/111/21.png" />

## crollbar-width 设置滚动条粗细

了解完 `scrollbar-color` 后，我们再来看看 `scrollbar-width`。这个从名字也很好理解，设置滚动条的宽度。

那是否和我们想象的一样，可以任意设置滚动条的宽度，甚至乎，可以定制化的设置滑块和轨道的宽度？

遗憾的是，在 [CSS Scrollbars Styling Module Level 1](https://drafts.csswg.org/css-scrollbars/#scrollbar-width) 一期滚动条规范中，这个属性的功能被设置的非常弱。

不要说分别设置滑块和轨道的宽度，`scrollbar-width` 目前甚至不支持接受一个宽度数值。

什么意思呢？也就是，当前 `scrollbar-width` 只接收 3 个关键字：

- `scrollbar-width: auto`：系统默认的滚动条宽度。
- `scrollbar-width: thin`：系统提供的瘦滚动条宽度，或者比默认滚动条宽度更窄的宽度
- `scrollbar-width: none`：不显示滚动条，但是该元素依然可以滚动

简单示意图如下：

<img src="../imgs/111/22.png" />

完整的 DEMO，你可以戳这里：[CodePen Demo -- Scrollbar-width Demo](https://codepen.io/Chokcoco/pen/eYoVxqd?editors=1100)

## 总结一下

可以看到，其实就目前 `scrollbar-width` 而言，其能力还是属于比较鸡肋的。相对正常的样式，仅仅多了一种瘦版样式选择以及提供了无滚动条模式。

当然，整个 `scrollbar-color` 和 `scrollbar-width` 相较于非标准的 `::-webkit-scrollbar` 规范已经是非常大的一步跨越。只是其功能的丰富性和全面性还需要等待。
