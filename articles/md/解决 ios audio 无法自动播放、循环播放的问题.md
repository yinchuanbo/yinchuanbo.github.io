---
title: "解决 ios audio 无法自动播放、循环播放的问题"
tag: "疑难问题"
time: 2024-08-30 17:34:29
---

`ios` 手机在使用 `audio` 或者 `video` 播放的时候，个别机型无法实现自动播放，可使用下面的代码 `hack`。

```js
// 解决ios audio无法自动播放、循环播放的问题
var music = document.getElementById("video");
var state = 0;

document.addEventListener(
  "touchstart",
  function () {
    if (state == 0) {
      music.play();
      state = 1;
    }
  },
  false
);

document.addEventListener(
  "WeixinJSBridgeReady",
  function () {
    music.play();
  },
  false
);

//循环播放
music.onended = function () {
  music.load();
  music.play();
};
```
