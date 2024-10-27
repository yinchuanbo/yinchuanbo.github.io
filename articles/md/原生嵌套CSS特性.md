---
title: "2024 年新的原生嵌套 CSS 特性"
tag: "新特性"
time: 2024-08-30 17:34:29
---

新的原生嵌套 CSS 特性彻底改变了前端开发。

❌ 之前：

你会如何为这些嵌套的 HTML 元素添加样式？

```html
<section>
  你好！
  <div>
    <p><span>codingbeautydev.com</span> -- 以编码为激情</p>
    <p>编码帮助你实现目的感和成长。</p>
  </div>
</section>
```

你通常会感到压力，浪费大量时间重复外部元素名称。

```css
section {
  font-family: Arial;
}

section div {
  font-size: 1.5em;
}

section div p {
  color: blue;
}

section div p span {
  font-weight: bold;
}
```

难怪 SASS 和 LESS 变得如此受欢迎。

✅ 但现在：使用原生 CSS：

变得更加清晰和简单。所有样式现在都被封装在一起，而不是散落各处。

```css
section {
  font-family: Arial;
  div {
    font-size: 1.2em;
    p {
      color: blue;
      span {
        font-weight: bold;
      }
    }
  }
}
```

就像面向对象编程中的封装一样直观：

```js
// ❌ redundancy
// ❌ 冗余
const personName = "Tari Ibaba";
const personSite = "codingbeautydev.com";
const personColor = "🔵blue";

// ✅ encapsulate field
// ✅ 封装字段
class Person {
  name = "Tari Ibaba";
  site = "codingbeautydev.com";
  color = "🔵blue";
}
```

在某些浏览器中，你可能需要使用 `&`：

```css
section {
  font-family: Arial;
  & div {
    font-size: 1.2em;
    & p {
      color: blue;
      & span {
        font-weight: bold;
      }
    }
  }
}
```

## 那么类和 ID 呢？

如果你想通过 `class` 或 `id` 属性来为嵌套元素添加样式怎么办？

```html
<section class="class1">
  你好！
  <div id="id1">
    <p class="class2">
      <span id="url">codingbeautydev.com</span> -- 以编码为激情
    </p>
    <p>编码具有认知挑战性和精神刺激性。</p>
  </div>
</section>
```

嵌套 CSS 将非常相似：

```css
.class {
  font-family: Arial;
  #id1 {
    font-size: 1.2em;
    .class2 {
      color: purple;
      #url {
        font-weight: bold;
      }
    }
  }
}
```

它也适用于兄弟选择器：

```css
div {
  section {
    + p {
      color: blue;
    }
    ~ p {
      color: red;
    }
  }
}
```

## 伪类和伪元素

是的：

```css
button {
  background-color: blue;
  :hover {
    background-color: yellow;
  }
}
```

## 媒体查询

嵌套 CSS 的另一个巨大卖点：

❌ 之前：

创建媒体查询很混乱，查询样式和元素的主要样式是分开的：

```css
.hamburger {
  display: none;
}

.header {
  font-size: 40px;
}

@media (orientation: landscape) {
  .header {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .hamburger {
    display: block;
  }
  .header {
    font-size: 24px;
  }
}
```

✅ 现在：

让元素样式包含查询样式比让查询样式包含元素样式的小片段更直观。

嵌套 CSS 让你可以轻松做到这一点：

```css
.hamburger {
  display: none;

  @media (max-width: 480px) {
    display: block;
  }
}

.header {
  font-size: 40px;

  @media (orientation: landscape) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
}
```

使用原生嵌套 CSS，你可以更直观地创建样式。

SASS 现在基本上没用了 — 特别是现在我们在 CSS 中也有了原生变量：

```css
$base-font-size: 16px;
$gutter-width: 10px;

.container {
  padding: calc($gutter-width * 2);
  font-size: $base-font-size;
}

.heading {
  font-size: calc($base-font-size * 1.5);
}
```
