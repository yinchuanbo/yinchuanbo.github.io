---
title: "使用 template HTML 标签的 10 个重要技巧"
tag: "Html"
time: 2024-08-30 17:34:29
---

`<template>` HTML 标签是一个功能强大但经常被忽视的元素。它允许你定义可重复使用的内容，这些内容可以被克隆并插入到 DOM 中，而不会在最初渲染。这一功能在创建动态、交互式 Web 应用时尤为有用。在本文中，我们将探讨 10 个有效使用 `<template>` 标签的技巧，帮助你在项目中充分发挥其潜力。

1. 理解 `<template>` 标签的基础 `<template>` 标签是一个 HTML 元素，它包含不会在页面加载时渲染的客户端内容。相反，这些内容可以使用 JavaScript 在稍后克隆并插入到文档中。

```html
<template id="my-template">
  <div class="content">
    <h2>模板内容</h2>
    <p>这段内容在模板中。</p>
  </div>
</template>
```

**为什么有用？** 通过使用 `<template>`，你可以创建可重用的内容块，这些块存储在文档中，但直到需要时才会显示。这在需要动态创建多个 UI 组件实例或管理大型数据集时特别有用。

2. 利用 `<template>` 标签创建动态内容 `<template>` 标签最常见的用途之一是动态生成内容。例如，你可以克隆模板内容并将其追加到 DOM 中，以显示从 API 获取的数据。

```js
const template = document.getElementById("my-template");
const clone = template.content.cloneNode(true);
document.body.appendChild(clone);
```

**最佳实践**

- 确保唯一的 ID：克隆内容时，确保更新 ID 或其他需要保持唯一的属性。
- 避免过度克隆：仅克隆所需的内容，以避免不必要的内存使用。

3. 使用 `<template>` 标签创建可重用的 UI 组件 `<template>` 标签非常适合创建可重用的 UI 组件，例如模态窗口、工具提示或卡片。通过将组件结构存储在模板中，你可以轻松实例化多个实例而无需重复代码。

```html
<template id="card-template">
  <div class="card">
    <h3>卡片标题</h3>
    <p>卡片内容。</p>
  </div>
</template>

<script>
  const template = document.getElementById("card-template");
  for (let i = 0; i < 3; i++) {
    const clone = template.content.cloneNode(true);
    document.body.appendChild(clone);
  }
</script>
```

**提示**

- 模块化代码：将模板定义与 JavaScript 逻辑分开，保持代码整洁有序。
- 克隆后定制：修改克隆的内容（例如文本或属性），以创建组件的独特实例。

4. 将 `<template>` 标签与 JavaScript 框架集成许多现代 JavaScript 框架和库（如 React、Vue 和 Angular）使用自己的模板系统。然而，在某些场景下，原生的 `<template>` 标签仍然非常有用，例如在需要管理框架生命周期之外的内容时。

**原生 JavaScript 示例**

```js
const template = document.getElementById("my-template");
const list = document.getElementById("item-list");

fetch("/api/items")
  .then((response) => response.json())
  .then((items) => {
    items.forEach((item) => {
      const clone = template.content.cloneNode(true);
      clone.querySelector("h2").textContent = item.title;
      clone.querySelector("p").textContent = item.description;
      list.appendChild(clone);
    });
  });
```

**提示**

- 为特殊情况使用 `<template>` 标签：在框架特定解决方案可能不够灵活的场景中，使用 `<template>` 标签。
- 与 Web 组件结合：在自定义元素中使用 `<template>` 标签来定义 shadow DOM 内容。

5. 使用 `<template>` 优化性能`<template>` 标签对于性能优化非常有用。由于 `<template>` 中的内容在克隆之前不会渲染，你可以通过推迟非必要内容的渲染来减少初始页面加载时间。

```html
<template id="deferred-content">
  <div class="hidden-content">
    <p>这段内容稍后加载。</p>
  </div>
</template>

<script>
  window.addEventListener("load", () => {
    const template = document.getElementById("deferred-content");
    const clone = template.content.cloneNode(true);
    document.body.appendChild(clone);
  });
</script>
```

**最佳实践**

- 延迟非关键内容：使用 `<template>` 加载用户不立即需要的内容。
- 延迟加载：将 `<template>` 与延迟加载技术结合使用，以进一步提高性能。

6. 通过 `<template>` 增强可访问性使用 `<template>` 标签时，要注意可访问性。由于模板中的内容在插入 DOM 之前不会渲染，确保克隆的内容对所有用户都可访问非常重要。

**提示**

```js
const template = document.getElementById("accessible-template");
const clone = template.content.cloneNode(true);
clone.querySelector(".content").setAttribute("aria-live", "polite");
document.body.appendChild(clone);
```

- 克隆后添加 ARIA 属性：确保在模板内容插入 DOM 后添加任何必要的 ARIA 属性。
- 屏幕阅读器测试：使用屏幕阅读器测试你的应用，以确保克隆的内容是可访问的。

7. 使用 `<template>` 管理大数据集对于需要显示大数据集的应用程序，`<template>` 标签可以帮助有效管理 DOM。通过克隆模板而不是手动创建元素，你可以保持代码简洁，并优化 DOM 交互。

```html
<template id="row-template">
  <tr>
    <td class="name"></td>
    <td class="age"></td>
    <td class="email"></td>
  </tr>
</template>

<script>
  const template = document.getElementById("row-template");
  const tableBody = document.getElementById("table-body");

  fetch("/api/users")
    .then((response) => response.json())
    .then((users) => {
      users.forEach((user) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".name").textContent = user.name;
        clone.querySelector(".age").textContent = user.age;
        clone.querySelector(".email").textContent = user.email;
        tableBody.appendChild(clone);
      });
    });
</script>
```

**提示**

- 高效渲染：使用 `<template>` 标签高效渲染大型表格或列表。
- 批量更新：批量处理 DOM 更新，最小化重排和重绘。

8. 使用 `<template>` 处理条件内容`<template>` 标签非常适合需要根据用户交互或数据来显示内容的场景。这样，你可以提前准备内容，并在必要时显示它。

```html
<template id="login-template">
  <div class="login-form">
    <input type="text" placeholder="用户名" />
    <input type="password" placeholder="密码" />
    <button>登录</button>
  </div>
</template>

<script>
  const template = document.getElementById("login-template");
  const loginContainer = document.getElementById("login-container");
  document.getElementById("show-login").addEventListener("click", () => {
    const clone = template.content.cloneNode(true);
    loginContainer.appendChild(clone);
  });
</script>
```

**提示**

- 预加载模板：预加载可能会根据用户操作显示的内容，以确保流畅的体验。
- 切换可见性：将 `<template>` 与可见性切换结合使用，以创建交互式元素。

9. 通过 `<template>` 简化表单处理表单通常需要动态元素，如添加或移除输入字段。`<template>` 标签可以简化此过程，允许你在需要时克隆预定义的表单字段。

```html
<template id="field-template">
  <div class="form-field">
    <input type="text" placeholder="输入值" />
    <button class="remove-field">移除</button>
  </div>
</template>

<script>
  const template = document.getElementById("field-template");
  const form = document.getElementById("dynamic-form");

  document.getElementById("add-field").addEventListener("click", () => {
    const clone = template.content.cloneNode(true);
    form.appendChild(clone);
  });

  form.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-field")) {
      event.target.closest(".form-field").remove();
    }
  });
</script>
```

**提示**

- 动态表单：

使用 `<template>` 根据用户输入动态添加或移除表单字段。

- 表单验证：确保克隆的表单字段包含所有必要的验证逻辑。

10. 将 `<template>` 与 Web 组件结合使用`<template>` 标签是创建 Web 组件的重要组成部分。通过将 `<template>` 与自定义元素结合使用，你可以封装并重用复杂的 UI 组件。

```html
<template id="tooltip-template">
  <style>
    .tooltip {
      position: absolute;
      background: #333;
      color: #fff;
      padding: 5px;
      border-radius: 4px;
      font-size: 12px;
      visibility: hidden;
      transition: visibility 0.2s;
    }
  </style>
  <div class="tooltip">
    <slot></slot>
  </div>
</template>

<script>
  class TooltipElement extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById("tooltip-template").content;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.cloneNode(true));
    }

    connectedCallback() {
      this.addEventListener("mouseover", () => {
        this.shadowRoot.querySelector(".tooltip").style.visibility = "visible";
      });

      this.addEventListener("mouseout", () => {
        this.shadowRoot.querySelector(".tooltip").style.visibility = "hidden";
      });
    }
  }

  customElements.define("my-tooltip", TooltipElement);
</script>

<!-- 自定义提示工具元素的用法 -->
<my-tooltip>
  将鼠标悬停在我上面
  <span slot="tooltip-text">这是一个提示工具</span>
</my-tooltip>
```

结合 `<template>` 和 Web 组件的优势

- 封装：将组件的样式和逻辑与应用的其余部分隔离开来。
- 可重用性：在应用的不同部分轻松重用复杂组件。
- 一致性：确保 UI 元素在整个应用中表现一致。

`<template>` HTML 标签是一个多功能的工具，可以显著改善你在 Web 应用中管理和操作 DOM 内容的方式。无论是创建可重用组件、管理大数据集，还是优化性能，`<template>` 标签都提供了一种简洁而高效的解决方案。通过掌握本文中讨论的技巧和方法，你可以充分利用 `<template>` 标签的潜力，构建更加动态、易于维护且性能更佳的 Web 应用。

在继续探索 `<template>` 标签的功能时，考虑将其与现代 Web 开发实践（如 Web 组件和 JavaScript 框架）结合使用，以创建更强大和灵活的解决方案。
