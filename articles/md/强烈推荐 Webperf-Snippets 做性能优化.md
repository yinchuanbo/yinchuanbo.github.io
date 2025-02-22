---
title: "强烈推荐 Webperf-Snippets 做性能优化"
tag: "性能优化"
time: 2025-02-21 22:18:05
---

<img src="../imgs/143/10.webp" />

## 1. 什么是 Webperf-Snippets

Webperf-Snippets 是精选的片段列表，用于获取 Web 性能指标以在浏览器控制台中使用或作为 Chrome 开发工具上的片段。

开发者可以使用 Webperf-Snippets 作为 Chrome DevTools Sources 选项卡中的 Snippet。只需要按照如下步骤完成：

- 复制任何 WebPerf 片段
- 打开 Chrome 开发者工具
- 选择 “来源” 选项卡
- 选择 “片段” 子选项卡
- 单击 “新建片段” 按钮，例如：LCP
- 写下片段名称 LCP
- 将复制的代码粘贴到右侧区域
- 运行片段

## 2.Webperf-Snippets 包括那些指标

### Cumulative Layout Shift (CLS)

当浏览器焦点切换到另一个选项卡时，此脚本会显示 CLS 值，因为 CLS 是在页面的生命周期内计算的。

```js
let cumulativeLayoutShiftScore = 0;
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      cumulativeLayoutShiftScore += entry.value;
    }
  }
});

observer.observe({ type: "layout-shift", buffered: true });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    observer.takeRecords();
    observer.disconnect();

    console.log(`CLS: ${cumulativeLayoutShiftScore}`);
  }
});
```

### Largest Contentful Paint (LCP)

下面的脚本会显示有关 LCP（在新选项卡中打开）指标的信息。

可以在浏览器控制台中使用，也可以将其用作 Chrome DevTools Source 选项卡中的片段。以下代码在控制台中列出最大的内容绘制，并在 LCP 元素周围添加绿色虚线。

```js
const po = new PerformanceObserver((list) => {
  let entries = list.getEntries();

  entries = dedupe(entries, "startTime");
  entries.forEach((item, i) => {
    console.dir(item);
    console.log(
      `${i + 1} current LCP item : ${item.element}: ${item.startTime}`
    );
    item.element ? (item.element.style = "border: 5px dotted lime;") : "";
  });
  const lastEntry = entries[entries.length - 1];
  console.log(`LCP is: ${lastEntry.startTime}`);
});
po.observe({ type: "largest-contentful-paint", buffered: true });
function dedupe(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
```

### Time To First Byte

第一个字节的时间 (TTFB) 是一种测量值，用于表示网络服务器或其他网络资源的响应能力。 TTFB 测量从用户或客户端发出 HTTP 请求到客户端浏览器收到页面第一个字节的持续时间。

```js
// Measure the time to first byte of all the resources loaded
// https://webperf-snippets.nucliweb.net
new PerformanceObserver((entryList) => {
  const [pageNav] = entryList.getEntriesByType("navigation");
  console.log(`TTFB (ms): ${pageNav.responseStart}`);
}).observe({
  type: "navigation",
  buffered: true,
});
```

### Scripts Loading

列出 DOM 中的所有 `<scripts>` 并显示一个表格以查看是否加载了异步、延迟和 `/` 或 `type="module"`:

```js
const scripts = document.querySelectorAll("script[src]");
const scriptsLoading = [...scripts].map((obj) => {
  return {
    src: obj.src,
    async: obj.async,
    defer: obj.defer,
    module: obj.type === "module",
    "render blocking":
      obj.async || obj.defer || obj.type === "module" ? "" : "",
  };
});
console.table(scriptsLoading);
```

## 演示视频

<iframe 
src="https://res.cloudinary.com/nucliweb/video/upload/q_auto/vc_vp9/v1/webperf-snippets/devtools-new-snippet.webm?_s=vp-1.9.4" 
scrolling="no" 
border="0" 
frameborder="no" 
framespacing="0" 
allowfullscreen="true" 
width="600"
height="400"
>
</iframe>
