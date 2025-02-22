---
title: "HTML - 无限可能"
tag: "Html"
time: 2024-09-01 15:21:24
---

## 位置元素

HTML5 引入的语义化标签（`<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<section>`）提供了更明确的方式来描述网页内容的结构和含义。

`<main>`：表示文档或应用的主体内容。它应该包含文档中大部分内容，且该内容应该与文档的其余部分（如侧边栏、导航栏、页脚等）有所区分。每个文档只能有一个`<main>`元素，并且它不能被包含在`<article>`, `<aside>`, `<footer>`, `<header>`, 或 `<nav>`元素内。

`<nav>`：表示页面中的导航链接区域。它通常包含指向文档中其他部分或网站中其他页面的链接。虽然`<nav>`元素主要用于链接，但它也可以包含描述这些链接的标题或其他内容。

`<aside>`：表示与页面其余部分相关的补充内容，这部分内容可以是侧边栏、广告、友情链接、引述等。`<aside>`的内容应该与页面的主要内容分开，但对其有辅助作用。

`<header>`：元素表示页面或页面某个区域的头部。它通常包含网站的标志、标题、导航栏或其他引入性内容。`<header>`元素可以包含标题、段落、列表、表格、表单等任何元素。

`<footer>`：元素表示页面或页面某个区域的底部。它通常包含版权信息、联系方式、网站地图链接、相关链接等。`<footer>`元素可以包含页脚通常包含的元素，如版权文本、联系信息、导航链接等。

`<section>`：元素表示文档中的一个独立区域，比如章节、页眉、页脚或文档中的其他部分。`<section>`元素应该包含标题（`<h1>-<h6>`元素），但也可以不包含。使用`<section>`元素可以为内容提供上下文，帮助读者更好地理解文档的结构。

## tabindex 属性

tabindex 属性用于指定元素在页面中的 Tab 键焦点顺序。通过设置不同的 tabindex 属性值，可以控制元素在使用 Tab 键进行导航时的焦点移动顺序。

tabindex 属性的值可以是正整数、0 或-1。具体地说：

- 正整数：指定元素的 Tab 键焦点顺序。较小的值将优先获取焦点，相同值的元素将按照它们在 DOM 树中的顺序获取焦点。
- 0：将元素添加到 Tab 键焦点顺序中，但顺序由它们在 DOM 中出现的位置决定。
- \-1：将元素从 Tab 键焦点顺序中移除，但仍然可以通过其他方式（如脚本）获得焦点。

tabindex 属性可以应用于所有 HTML 元素，包括可聚焦的元素（如按钮、链接等）和不可聚焦的元素（如 div、span 等）。然而，需要注意的是，将 tabindex 属性应用于不可聚焦的元素可能并不总是符合可访问性最佳实践，因为这样做可能会打破用户的自然导航流程。

一个常见的例子是自定义的键盘导航顺序。在 HTML 中，某些元素（如`<button>`、`<a>`、`<input>`等）默认情况下是可以被键盘的 Tab 键选中的。但是，如果想要改变这些元素的 Tab 键选中顺序，或者让原本不支持 Tab 键选中的元素（如`<div>`）也能被选中，就可以使用 tabindex 属性。

以下是一个简单的例子，其中有两个按钮和一个`<div>`元素，使用 tabindex 属性来改变它们的 Tab 键选中顺序：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Tabindex Example</title>
  </head>
  <body>
    <!-- 默认情况下，这个按钮会被第一个Tab键选中，因为它的DOM顺序靠前 -->
    <button>Button 1 (Default Tab Order)</button>

    <!-- 设置 tabindex 为 2，所以它会在 tabindex 为 1 的元素之后被选中 -->
    <button tabindex="2">Button 2 (tabindex="2")</button>

    <!-- 设置 tabindex 为 1，所以它会在默认的按钮之前被选中 -->
    <button tabindex="1">Button 3 (tabindex="1")</button>

    <!-- 默认情况下，div 元素是不能通过Tab键选中的，但我们可以设置 tabindex="0" 使其变得可选 -->
    <div
      tabindex="0"
      style="border: 1px solid black; padding: 10px; margin: 10px;"
    >
      Div Element (tabindex="0") - Now focusable with Tab key
    </div>
  </body>
</html>
```

在这个例子中，即使 "Button 3" 在 DOM 树中的顺序排在最后，但由于它的 tabindex 设置为 1（比 "Button 1" 的默认 tabindex 值小），所以当你使用 Tab 键进行导航时，它会成为第一个被选中的元素。而 "Button 2" 的 tabindex 设置为 2，所以它在 "Button 1" 和 "Button 3" 之后被选中。最后，`<div>` 元素由于设置了 tabindex="0"，也变得可以通过 Tab 键进行导航。

## loading="lazy"

loading="lazy" 属性主要用于`<img>`和`<iframe>`元素，用于延迟加载图片或内联框架（即仅在它们接近视口时加载）。这有助于减少页面加载时的带宽使用和 CPU 资源，从而改善页面性能。

默认情况下，当浏览器加载一个 HTML 页面时，它会尝试立即获取并加载页面上所有的图片和内联框架。然而，当页面很大或者有很多图片时，这可能会导致性能问题，因为用户可能永远不会滚动到页面的某些部分，但这些部分的图片仍然会被加载。`loading="lazy"`属性告诉浏览器：“只有在用户需要时才加载这个资源。” 具体来说，当图片或内联框架在视口外时，浏览器不会加载它们，但当它们即将进入视口时（例如，当用户向下滚动页面时），浏览器会开始加载它们。

看个例子：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lazy Loading Example</title>
  </head>
  <body>
    <!-- 使用 loading="lazy" 的图片 -->
    <img src="image1.jpg" alt="Image 1" loading="lazy" />
    <img src="image2.jpg" alt="Image 2" loading="lazy" />
    <img src="image3.jpg" alt="Image 3" loading="lazy" />

    <!-- 假设这些图片在页面的底部，用户需要滚动才能看到它们 -->
    <!-- 当用户滚动到这些图片时，它们才会开始加载 -->

    <!-- 不使用 lazy loading 的图片（默认行为） -->
    <!-- 这些图片在页面加载时会立即开始加载，无论用户是否需要它们 -->
    <img src="always-loaded-image.jpg" alt="Always Loaded Image" />
  </body>
</html>
```

## srcset 和 sizes 属性

srcset 和 sizes 属性用于实现响应式图像。这两个属性允许你提供多个不同尺寸或分辨率的图像文件，浏览器将根据设备的像素密度、视口宽度和其他因素选择最合适的图像进行加载。

### srcset

srcset 属性允许指定一组图像源，每个源都带有一个描述符（通常是像素密度描述符 x 或宽度描述符 w）。浏览器会根据这些描述符和当前设备的特性（如像素密度或视口宽度）来选择最合适的图像。例如：

```html
<img
  src="small.jpg"
  alt="Responsive Image"
  srcset="medium.jpg 1000w, large.jpg 2000w"
  sizes="(max-width: 600px) 50vw, 100vw"
/>
```

在这个例子中，srcset 属性指定了两个额外的图像源：medium.jpg 和 large.jpg。1000w 和 2000w 是宽度描述符，表示这些图像的宽度。浏览器将使用这些信息和 sizes 属性来确定应该加载哪个图像。

### sizes

sizes 属性为浏览器提供了关于图像预期显示尺寸的信息。这个属性通常与媒体查询一起使用，以指定不同视口宽度下图像的尺寸。浏览器会使用这些信息来选择与 srcset 属性中定义的图像源相匹配的图像。

在上面的例子中，sizes 属性定义了两个尺寸条件：

- 如果视口宽度最大为 600 像素（max-width: 600px），则图像的宽度为视口宽度的 50%（50vw）。
- 否则，图像的宽度为视口的 100%（100vw）。

在上面的示例中，浏览器会执行以下步骤来选择要加载的图像：

1. 检查视口的宽度。
2. 根据 sizes 属性中的媒体查询确定图像的预期尺寸。
3. 根据图像的预期尺寸和 srcset 属性中的描述符选择一个最合适的图像源进行加载。

例如，如果视口宽度为 800 像素，浏览器将选择 large.jpg 图像进行加载，因为它的宽度描述符（2000w）与图像的预期尺寸最为匹配。如果视口宽度为 400 像素，浏览器可能会选择 medium.jpg 图像进行加载。如果浏览器不支持 srcset 和 sizes 属性，它将回退到使用 src 属性中指定的图像（即 small.jpg）。

## FormData API

FormData API 提供了一种表示表单数据的键值对集合的方式，并且可以轻松地使用该对象通过 JavaScript 发送表单数据。

以下是如何使用 FormData API 的基本步骤：

1. 创建 FormData 对象：可以使用 `new FormData()` 来创建一个空的 FormData 对象，或者传入一个 HTML 表单元素（例如 `<form>`）来自动获取表单中的所有数据。

```js
// 创建一个空的FormData对象
const formData = new FormData();
// 使用HTML表单元素
const formData = new FormData(document.getElementById("myForm"));
```

2. 添加数据：使用 append() 方法向 FormData 对象中添加数据。该方法接受两个参数，第一个参数是键名（字段名），第二个参数是值。如果指定的键名已经存在，则新的值将被添加到已存在的值列表中。

```js
formData.append("username", "John");
formData.append("password", "123456");
```

3. 发送数据：在发送数据请求时，可以将 FormData 对象作为数据参数传递。

```js
// 使用Fetch API
fetch("/submit-form", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## autocomplete 属性

autocomplete 属性主要用于 `<form>`、`<input>`、`<select>` 和 `<textarea>` 元素。这个属性用于控制浏览器是否应该自动完成表单字段。它基于用户之前输入过的值来提供自动完成功能。autocomplete 属性有两个可能的值：

- on：这是默认值。如果设置了此值，浏览器会尝试自动完成表单字段。
- off：如果设置了此值，浏览器将不会为表单字段提供自动完成功能。

对于 `<input>` 元素，autocomplete 属性特别适用于 text、search、url、telephone、email、password、date、month、week、time、datetime-local、number、range、color 等类型。

例如，如果想禁用一个文本输入框的自动完成功能，你可以这样写：

```html
<input type="text" name="username" autocomplete="off" />
```

另外，对于密码字段，有一个特殊的值 `new-password`，当设置为这个值时，浏览器将不会为密码字段提供基于之前密码的自动完成建议。这通常用于新密码的输入字段，以防止浏览器自动填充旧密码。

## 自定义元素

HTML 自定义元素是 Web 组件（Web Components）的一部分，它允许定义新的 HTML 元素及其行为。通过自定义元素，可以创建可复用的、封装好的组件，这些组件可以在多个项目中重用，或者通过其他开发者共享。

### 定义

自定义元素的定义通常使用 class 扩展 HTMLElement、HTMLUnknownElement 或其他 HTML 内置元素类。然后，需要调用 `customElements.define()` 方法来注册这个新元素。

下面是一个简单的例子，展示如何定义一个名为 my-custom-element 的自定义元素：

```js
class MyCustomElement extends HTMLElement {
  constructor() {
    // 必须首先调用 super 方法
    super();
    // 元素的功能代码...
    this.innerHTML = `<p>Hello, I'm a custom element!</p>`;
  }
  // 可以添加其他方法或属性...
}

// 注册自定义元素
window.customElements.define("my-custom-element", MyCustomElement);
```

### 使用

一旦注册了自定义元素，就可以像使用其他 HTML 元素一样在 HTML 中使用它：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Custom Element Example</title>
    <!-- 引入自定义元素的 JavaScript 文件 -->
    <script src="my-custom-element.js"></script>
  </head>
  <body>
    <!-- 使用自定义元素 -->
    <my-custom-element></my-custom-element>
  </body>
</html>
```

### 注意：

- 自定义元素的名称必须包含一个短横线（-），这是为了避免与现有的和未来的 HTML 元素名称冲突。
- 在 constructor 中，你必须首先调用 super() 方法。
- 自定义元素的生命周期回调（如 connectedCallback、disconnectedCallback、adoptedCallback、attributeChangedCallback）可以在元素的不同阶段执行特定的操作。
- 自定义元素可以使用 Shadow DOM 来封装其内部结构和样式，以避免与外部的样式和脚本冲突。
- 自定义元素可以定义自己的属性和插槽，以提供更多的功能和灵活性。

## 资源加载优先级

`<link>` 标签的 rel 属性值中与资源加载优先级相关的属性包括：

1. prefetch：一种资源提示，告诉浏览器在将来可能需要某个资源，并且希望浏览器在空闲时间预取它。这可以用于提高页面加载速度，特别是当用户预计会导航到需要该资源的页面时。

```html
<link rel="prefetch" href="https://example.com/next-page.html" />
```

2. preload: 一种资源提示，表示浏览器应该预加载指定的资源。这通常用于告诉浏览器在页面加载的早期阶段就开始下载某些资源，以便在用户需要时它们可以更快地可用。通常用于预取用户可能会导航到的下一个页面的资源，以便在用户点击链接时更快地加载页面。

```html
<link rel="preload" href="path/to/next-page.html" />
```

3. dns-prefetch：一种链接类型，它允许浏览器在页面的其他资源开始加载之前，在后台执行 DNS 查找。这可以加快页面的后续加载，特别是当页面中的某些资源位于与页面不同的域时。

```html
<link rel="dns-prefetch" href="//example.com" />
```

4. modulepreload：一种链接类型，用于预加载 ES6 模块。它告诉浏览器在需要该模块之前就开始下载它，但并不会立即执行。这可以提高模块的加载速度，尤其是在模块较大或网络条件较差的情况下。

```html
<link rel="modulepreload" href="path/to/module.js" />
```

## Shadow DOM

Shadow DOM 是一种浏览器提供的技术，它允许将一个独立的 DOM（文档对象模型）子树附加到一个元素上，并将其与外部 DOM 隔离开来。这样可以确保子树中的元素和样式不会影响到外部 DOM，同时也可以为子树中的元素提供独立的样式和事件处理机制。

Shadow DOM 是 Web 组件技术的核心部分，旨在将组件的结构、样式和行为封装在一个独立的、隔离的 DOM 树中，从而与主文档的 DOM 树相互隔离。这种封装性使得开发者可以创建可复用、独立和高度封装的组件，对于构建复杂的 Web 应用和在大型项目中使用组件化开发非常有价值。

Shadow DOM 的工作原理是，当一个元素被附加了 Shadow DOM 后，浏览器会创建一个独立的 DOM 子树，并将其附加到该元素上。这个子树中的元素和样式将被隔离在 Shadow DOM 中，不会影响到外部 DOM。同时，Shadow DOM 中的元素也可以通过特定的机制与外部 DOM 进行通信。

## 命名插槽

在 `Web Components` 的上下文中，`slot="slot_name"` 是一种用于内容分发或内容投影的机制。它允许将内容从父元素（即宿主元素）传递到子元素（通常是自定义元素）的特定位置。

具体来说，当在自定义元素内部使用 `<slot>` 标签时，可以为其指定一个 name 属性。然后，在父元素中，可以使用带有 slot 属性的元素来指定哪些内容应该被投影到这个命名的 `<slot>` 中。

```html
<!-- 自定义元素 my-component 的模板 -->
<template id="my-component-template">
  <div>
    <h2>标题</h2>
    <slot name="content"></slot>
    <!-- 命名的 slot -->
    <p>这是一个自定义组件的底部内容。</p>
  </div>
</template>

<!-- 使用自定义元素并传递内容 -->
<my-component>
  <p slot="content">这是一些被投影到 content slot 的内容。</p>
  <!-- 注意：没有指定 slot 的内容不会被投影到任何 slot，而是被忽略 -->
</my-component>

<!-- JavaScript 用于定义自定义元素（简化版） -->
<script>
  class MyComponent extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "open" });
      const template = document.querySelector("#my-component-template");
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
  window.customElements.define("my-component", MyComponent);
</script>
```

在上面的例子中，`<p slot="content">` 元素的内容会被投影到 `<slot name="content"></slot>` 的位置。注意，只有带有 `slot="content"` 属性的元素才会被投影到该位置。没有指定 slot 属性的内容在这种情况下会被忽略。

## HTML 媒体捕获

HTML 媒体捕获是 HTML 表单的一个扩展，它允许用户通过一个文件上传控件方便地访问设备的媒体捕获功能，如照相机、麦克风等。这个 API 通过元素的 capture 属性来实现，可以直接从设备的摄像头或麦克风获取媒体数据。它的使用非常简单，只需要在元素中设置 capture 属性为 "camera" 或 "microphone" 即可。

HTML 媒体捕获的 API 使得开发者能够更容易地获取用户的媒体输入，并将其集成到 Web 应用中。例如，可以使用这个 API 来创建一个简单的照片上传功能，让用户能够直接从他们的设备摄像头拍摄照片并上传到网站。同样，也可以用于音频录制或视频录制等场景。

```html
<input type="file" accept="image/*" capture="camera" />
```

在这个例子中，`<input type="file" accept="image/*" capture="camera">` 是一个带有 capture 属性的文件输入控件。`accept="image/*"` 表示该控件只接受图片文件，而 `capture="camera"` 则指示浏览器使用设备的摄像头来捕获照片。

## controlslist 属性

controlslist 是 `<video>` 和 `<audio>` 元素的一个属性，它允许开发者更细致地控制视频或音频播放器的默认控件的显示与隐藏。通过 controlslist 属性，你可以指定哪些控件应该被显示或隐藏。

这个属性接受一系列的值，每个值对应一个控件。下面是一些可能的值：

- nodownload：禁止显示下载按钮。
- nofullscreen：禁止显示全屏按钮。
- noremoteplayback：禁止显示远程播放按钮（例如，在电视上播放）。
- noplaybackrate：禁止显示播放速率按钮（例如，加快或减慢播放速度）。
- nodirection（对于视频）：禁止显示方向按钮（例如，在 360 度视频中使用的方向控件）。

可以通过组合这些值来定义你想要的控件列表。例如，如果你想要隐藏下载、全屏和远程播放按钮，可以将 controlslist 属性的值设置为 `"nodownload nofullscreen noremoteplayback"`。

```html
<video
  src="example.mp4"
  controls
  controlslist="nodownload nofullscreen"
></video>
```

## Web Share API

Web Share API 是一个允许网页调用操作系统的分享接口的 API，它实质上是 Web App 与本机的应用交换信息的一种方式。通过使用 Web Share API，网页可以将文本、链接甚至文件分享到设备上安装的其他应用。

```js
if (navigator.share) {
  navigator
    .share({
      title: "分享的标题",
      text: "这是一段分享的文本描述",
      url: "https://example.com/share", // 要分享的链接
    })
    .then(() => console.log("分享成功！"))
    .catch((error) => console.log("分享失败：", error));
} else {
  console.log("当前浏览器不支持 Web Share API");
}
```

`<search>` 元素是一个用于封装与搜索或过滤操作相关的表单控件和内容的容器。它允许开发者在语义上标识这些内容为搜索或过滤功能，而不是用来展示搜索结果。搜索结果应作为页面主要内容的一部分展示，而搜索建议等辅助功能可以包含在 `<search>` 元素中。这个元素仅支持全局属性，不包含特定的属性。

```html
<header>
  <h1>Movie website</h1>
  <search>
    <form action="./search/">
      <label for="movie">Find a Movie</label>
      <input type="search" id="movie" name="q" />
      <button type="submit">Search</button>
    </form>
  </search>
</header>
```

## fetchpriority 属性

fetchPriority 属性主要用于 HTMLIFrameElement，表示给浏览器的提示，即浏览器应该如何优先获取 iframe 文档相对于其他 iframe 文档。

fetchPriority 属性值包括：

- high：以相对于其他 iframe 文档的高优先级获取 iframe 文档。
- low：以相对于其他 iframe 文档的低优先级获取 iframe 文档。
- auto：默认模式，表示不优先获取优先级，由浏览器决定什么对用户最有利。

此外，fetchPriority 属性还可以用于 `<img>` 元素和 `<link rel="preload">` 元素，以调整图片或资源的加载优先级。例如，如果你有一个在 CSS 文件中非常重要的图片，需要高优先级加载，可以这样设置：

```html
<link
  rel="preload"
  href="./important-source.png"
  as="image"
  fetchPriority="high"
/>
```

或者，如果想降低图片的请求优先级，可以这样设置：

```html
<img src="example.png" fetchPriority="low" />
```

## File System Access API

文件系统访问 API（File System Access API）是一种 Web API，它允许网页上的 JavaScript 代码请求用户选择本地文件或目录，并对其进行读取和写入操作。这个 API 的引入是为了增强 Web 应用与本地文件系统的交互能力，同时保持用户的安全和隐私。

```html
<button onclick="handleFiles()">选择文件并读取</button>
<pre id="output"></pre>

<script>
  async function handleFiles() {
    try {
      // 显示文件选择器并请求用户选择一个文件
      const [handle] = await window.showOpenFilePicker();

      // 创建一个文件系统文件句柄的引用
      const file = await handle.getFile();

      // 读取文件内容
      const reader = new TextDecoder().decode(await file.arrayBuffer());

      // 在页面上显示文件内容
      document.getElementById("output").textContent = reader;
    } catch (err) {
      console.error("Error:", err);
    }
  }
</script>
```

## Launch Handler API

Launch Handler API 允许控制网页应用的启动方式。具体来说，这个 API 可以控制应用程序是在现有窗口打开，还是在新窗口中打开，以及是否将所选窗口导向至启动网址。

目前，它主要包含一个 client_mode 字段，用于控制应用程序是在现有 Web 应用客户端中启动，还是在新客户端中启动。

```js
"launch_handler": {
  "client_mode": "focus-existing"
}
"launch_handler": {
  "client_mode": ["focus-existing", "auto"]
}
```

## HTML Modules

HTML Modules 允许开发者通过 JavaScript 的 import 语句导入 HTML 文件，并直接访问其内部的元素以及 JavaScript 导出。

```html
<script type="module">
  import { TabList } from "./tablist.html" with { type: 'html' };
  customElements.define("tab-list", TabList);
</script>
```

## blocking="render"

`<script>` 标签 blocking 属性明确指示在获取脚本时应该阻塞某些操作。需要被阻塞的操作必须是一个由以下列出的阻塞标记组成的、由空格分隔的列表。当属性值为 render 时，将阻塞屏幕上的内容渲染。使用 `blocking="render"` 指定资源（如脚本、样式表等）应在加载完成前阻塞渲染。

```html
<script blocking="render" async src="async-script.js"></script>
```

## ElementInternals API

ElementInternals API 是 Web Components 规范中的一部分，特别是与自定义元素（Custom Elements）的表单相关功能有关。这个 API 提供了一种方式，使得自定义元素（特别是那些作为表单控件的自定义元素）可以暴露它们的内部状态给表单处理逻辑，同时保持与原生表单元素的兼容性和互操作性。

ElementInternals 接口允许自定义元素内部实现一些标准表单控件的行为，如验证、报告有效性、设置默认值等，而无需手动模拟这些行为。

以下是一些 ElementInternals API 的主要特性和用途：

表单关联：通过 ElementInternals，自定义元素可以与表单进行关联，就像原生表单控件一样。

验证：ElementInternals 提供了设置和检查自定义元素验证状态的方法，如 `setValidity()`、`checkValidity()` 和 `reportValidity()`。

值管理：可以通过 ElementInternals 的 value 和 valueAsNumber 属性来设置和获取自定义元素的值。

默认值和标签：ElementInternals 允许设置和获取默认值（defaultValue）以及标签（label），这对于表单控件来说非常有用。

表单提交：当自定义元素作为表单的一部分被提交时，ElementInternals 允许控制元素的值是否被包含在提交的数据中。

错误消息：通过 `setCustomValidity()` 方法，可以为自定义元素设置自定义验证错误消息。

## focusgroup 属性

使用 focusgroup 属性，可以通过键盘上的箭头键，在一组可聚焦元素之间实现键盘焦点导航。

```html
<div focusgroup="wrap horizontal">
  <!-- 子元素 -->
</div>
```

## CustomElementRegistry

CustomElementRegistry 是一个对象，它提供了向 HTML/DOM 添加具有自定义逻辑的自己元素的方法。这个对象的主要作用是给页面注册一个自定义标签，并获取已注册的 Custom Elements 的相关信息。

CustomElementRegistry 对象包含了一些方法，如 `define()`，可以用来注册新的自定义元素。你可以通过 window.customElements 属性来获取 CustomElementRegistry 对象的实例。
