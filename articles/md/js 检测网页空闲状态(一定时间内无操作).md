---
title: "js 检测网页空闲状态(一定时间内无操作)"
tag: "JavaScript"
time: 2024-11-17 11:14:41
---

## 1\. 背景

最近开发项目时，常碰到`“用户在一定时间内无任何操作时，跳转到某个页面”`的需求。

网上冲浪后，也没有找到一个比较好的 js 封装去解决这个问题，从而决定自己实现。

## 2. 如何判断页面是否空闲

首先，我们要知道什么是空闲？用户一定时间内，没有对网页进行任何操作，则当前网页为空闲状态。

用户操作网页，无非就是通过`鼠标`、`键盘`两个输入设备(暂不考虑手柄等设备)。因而我们可以监听相应的输入事件，来判断网页是否空闲(用户是否有操作网页)。

1. 监听鼠标移动事件`mousemove`；
2. 监听键盘/鼠标按下事件`keydown`；
3. 在用户进入网页后，设置延时跳转，如果触发以上事件，则移除延时器，并重新开始。

## 3. 网页空闲检测实现

### 3.1 简易实现

以下代码，简单实现了一个判断网页空闲的方法：

```js
const onIdleDetection = (callback, timeout = 15, immediate = false) => {
  let pageTimer;

  const onClearTimer = () => {
    pageTimer && clearTimeout(pageTimer);
    pageTimer = undefined;
  };
  const onStartTimer = () => {
    onClearTimer();
    pageTimer = setTimeout(() => {
      callback();
    }, timeout * 1000);
  };

  const startDetection = () => {
    onStartTimer();
    document.addEventListener("keydown", onStartTimer);
    document.addEventListener("mousemove", onStartTimer);
  };
  const stopDetection = () => {
    onClearTimer();
    document.removeEventListener("keydown", onStartTimer);
    document.removeEventListener("mousemove", onStartTimer);
  };
  const restartDetection = () => {
    onClearTimer();
    onStartTimer();
  };

  if (immediate) {
    startDetection();
  }

  return {
    startDetection,
    stopDetection,
    restartDetection,
  };
};
```

也许你注意到了，我并没有针对`onStartTimer`事件进行防抖，那这是不是会对性能有影响呢？

是的，肯定有那么点影响，那我为啥不添加防抖呢？

这是因为添加防抖后，形成了`setTimeout`嵌套，嵌套`setTimeout`会有精度问题（[参考](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout)）。

或许你还会说，非活动标签页（网页被隐藏）的`setTimeout`的执行和精度会有问题（[参考非活动标签的超时](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout)）。

确实存在以上问题，接下来我们就来一一解决吧！

### 3.2 处理频繁触发问题

我们可以通过添加一个变量记录开始执行时间，当下一次执行与当前的时间间隔小于某个值时直接退出函数，从而解决这个问题(节流思想应用)。

```js
const onIdleDetection = (callback, timeout = 15, immediate = false) => {
  let pageTimer;
  // 记录开始时间
  let beginTime = 0;
  const onStartTimer = () => {
    // 触发间隔小于100ms时，直接返回
    const currentTime = Date.now();
    if (pageTimer && currentTime - beginTime < 100) {
      return;
    }

    onClearTimer();
    // 更新开始时间
    beginTime = currentTime;
    pageTimer = setTimeout(() => {
      callback();
    }, timeout * 1000);
  };
  const onClearTimer = () => {
    pageTimer && clearTimeout(pageTimer);
    pageTimer = undefined;
  };

  const startDetection = () => {
    onStartTimer();
    document.addEventListener("keydown", onStartTimer);
    document.addEventListener("mousemove", onStartTimer);
  };
  const stopDetection = () => {
    onClearTimer();
    document.removeEventListener("keydown", onStartTimer);
    document.removeEventListener("mousemove", onStartTimer);
  };
  const restartDetection = () => {
    onClearTimer();
    onStartTimer();
  };

  if (immediate) {
    startDetection();
  }

  return {
    startDetection,
    stopDetection,
    restartDetection,
  };
};
```

### 3.3 处理页面被隐藏的情况(完整实现)

我们可以监听`visibilitychange`事件，在页面隐藏时移除延时器，然后页面显示时继续计时，从而解决这个问题。

```js
/**
 * 网页空闲检测
 * @param {() => void} callback 空闲时执行，即一定时长无操作时触发
 * @param {number} [timeout=15] 时长，默认15s，单位：秒
 * @param {boolean} [immediate=false] 是否立即开始，默认 false
 * @returns
 */
const onIdleDetection = (callback, timeout = 15, immediate = false) => {
  let pageTimer;
  let beginTime = 0;
  const onClearTimer = () => {
    pageTimer && clearTimeout(pageTimer);
    pageTimer = undefined;
  };
  const onStartTimer = () => {
    const currentTime = Date.now();
    if (pageTimer && currentTime - beginTime < 100) {
      return;
    }

    onClearTimer();
    beginTime = currentTime;
    pageTimer = setTimeout(() => {
      callback();
    }, timeout * 1000);
  };

  const onPageVisibility = () => {
    // 页面显示状态改变时，移除延时器
    onClearTimer();

    if (document.visibilityState === "visible") {
      const currentTime = Date.now();
      // 页面显示时，计算时间，如果超出限制时间则直接执行回调函数
      if (currentTime - beginTime >= timeout * 1000) {
        callback();
        return;
      }
      // 继续计时
      pageTimer = setTimeout(() => {
        callback();
      }, timeout * 1000 - (currentTime - beginTime));
    }
  };

  const startDetection = () => {
    onStartTimer();
    document.addEventListener("keydown", onStartTimer);
    document.addEventListener("mousemove", onStartTimer);
    document.addEventListener("visibilitychange", onPageVisibility);
  };

  const stopDetection = () => {
    onClearTimer();
    document.removeEventListener("keydown", onStartTimer);
    document.removeEventListener("mousemove", onStartTimer);
    document.removeEventListener("visibilitychange", onPageVisibility);
  };

  const restartDetection = () => {
    onClearTimer();
    onStartTimer();
  };

  if (immediate) {
    startDetection();
  }

  return {
    startDetection,
    stopDetection,
    restartDetection,
  };
};
```

通过以上代码，我们就完整地实现了一个网页空闲状态检测的方法。

## 4. 扩展阅读

chrome 浏览器其实提供了一个`Idle Detection`API，来实现网页空闲状态的检测，但是这个 API 还是一个实验性特性，并且 Firefox 与 Safari 不支持。[API 参考](https://developer.mozilla.org/en-US/docs/Web/API/Idle_Detection_API)
