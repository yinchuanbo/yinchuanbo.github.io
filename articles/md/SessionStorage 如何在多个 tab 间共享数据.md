---
title: "SessionStorage 如何在多个 tab 间共享数据"
tag: "疑难问题"
time: 2025-01-18 21:27:57
---

## 如何实现 sessionStorage 数据共享

我们先看下 mdn 中对 sessionStorage 的介绍：

<img src="../imgs/136/20.webp" />

根据 mdn 的描述我们可以清楚的看到，**打开多个相同的 URL 的 Tabs 页面，会创建各自的 `sessionStorage`** 也就是说 **不可共享**。

所以，我们来做一个实验：

1. 我们创建两个 html 文件，分别为 test.html   和  test02.html

```html
<!-- test.html -->
<body>
  <button id="btn">点我</button>
  <script>
    const btn = document.querySelector("#btn");
    btn.addEventListener("click", () => {
      window.sessionStorage.setItem("name", "张三");
      window.open("http://127.0.0.1:5500/test02.html");
    });
  </script>
</body>
```

```html
<!-- test02.html -->
<body>
  <div id="name"></div>
  <script>
    const nameEle = document.querySelector("#name");
    nameEle.innerHTML = window.sessionStorage.getItem("name");
  </script>
</body>
```

两块代码并不复杂，在 test 中我们保存了 name 到 sessionStorage 同时打开了 test02.html ，并且 **保证他们是同域的**，然后再 test02 中，输出了保存的 name（**注意：** 以上代码需要运行在服务上）。

执行以上代码之后，可以发现在 test02 中 **成功** 的打印出了保存的数据 张三！

## 分析原因

那么以上实验证明 sessionStorage 似乎可以共享数据。难道 mdn 上说的是错误的吗？当然不是。

以下是结论：

**sessionStorage 确实无法在多个窗口或标签之间共享数据。但是当通过 window.open 或链接打开新页面时，新页面将复制前一页面的 sessionStorage，以此来完成数据共享！**
