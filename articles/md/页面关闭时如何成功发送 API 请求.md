---
title: "页面关闭时如何成功发送 API 请求"
tag: "疑难问题"
time: 2024-08-30 17:34:29
---

## 浏览器事件监听

在浏览器中，我们可以使用 `beforeunload` 事件来监听窗口关闭前的事件。

但是，这个事件并不总是可靠的，因为它可能会被浏览器弹出拦截器阻止。

因此，还需要考虑使用 `visibilitychange` 事件，它在页面从可见变为隐藏时触发，这包括了页面关闭和刷新的情况。

```js
window.addEventListener("beforeunload", (event) => {
  // 在这里执行 api 请求
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState == "hidden") {
    // 页面不可见，执行 api
  }
});
```

## 发送 API 请求的方法

有几种方法可以在页面关闭时发送 API 请求，包括传统的 `XMLHttpRequest`、`fetch` API 以及 `Navigator.sendBeacon` 方法。

### \- XMLHttpRequest

XMLHttpRequest 是最早的 API 请求方法，但它在页面关闭时可能会被**取消**

```js
const xhr = new XMLHttpRequest();
xhr.open("POST", "/api/data", true);
xhr.send(JSON.stringify(data));
```

### \- Fetch 使用 keepalive

fetch API 提供了一个 `keepalive` 选项，即使页面关闭了，请求也会继续执行。

```js
fetch("/api/data", {
  method: "POST",
  body: JSON.stringify(data),
  keepalive: true,
});
```

### \- Navigator.sendBeacon

Navigator.sendBeacon 是一个现代的、轻量级的方法，它允许在不阻塞页面卸载的情况下发送数据。

```js
navigator.sendBeacon("/api/data", JSON.stringify(data));
```

1. 通过 `HTTP POST` 请求方式 **异步** 发送数据，同时不会延迟页面的卸载或影响下一导航的站入性能。
2. 支持跨域，但不支持自定义 **headers** 请求头，这意味着：如果用户信息 **Access-Token** 是作为请求头信息传递，需要后台接口支持 **url querystring** 参数传递解析。
3. 考虑其兼容性。

## 最佳实践

在选择发送 API 请求的方法时，我们需要考虑兼容性、数据大小和服务器响应，`Navigator.sendBeacon` 方法是一个不错的选择，但是需要注意的是，它不支持自定义请求头，且数据大小有限制。fetch API 的 keepalive 选项也是一个可靠的选择，但同样需要注意数据大小的限制。
