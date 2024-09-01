---
title: "window.open 弹窗被阻止解决方案"
tag: "常见问题"
---

```html
<button type="button" id="btn">CLICK</button>
```

```js
function windowOpen(callback = function () {}) {
  let winRef = window.open("", "_blank");
  if (typeof callback === "function") {
    callback?.(winRef);
  }
}

btn.onclick = function () {
  windowOpen((winRef) => {
    // 处理其他逻辑
    // ...
    winRef.location.href = "https://www.baidu.com/";
  });
};
```
