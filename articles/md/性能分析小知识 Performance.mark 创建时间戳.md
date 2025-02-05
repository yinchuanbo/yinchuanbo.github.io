---
title: "性能分析小知识 Performance.mark 创建时间戳"
tag: "性能优化"
time: 2025-02-05 14:11:56
---

`Performance.mark()`  是一个 Web API 方法，用于在浏览器的性能时间线中创建一个时间戳。这对于测量代码执行的性能非常有用，因为它允许开发者在特定的代码执行点上标记时间，然后可以通过  `Performance.measure()`  方法来计算两个标记之间的时间差。

以下是如何使用  `Performance.mark()`  方法的步骤：

### 1. 创建标记

使用  `performance.mark()`  方法在代码的特定点创建一个标记。你可以给每个标记起一个唯一的名称。

```js
performance.mark("start");
// ... 你的代码 ...
performance.mark("end");
```

### 2. 测量时间差

使用  `performance.measure()`  方法来计算两个标记之间的时间差。你需要提供一个测量的名称，以及开始和结束标记的名称。

```js
performance.measure("myMeasurement", "start", "end");
```

### 3. 访问测量结果

使用  `performance.getEntriesByName()`  方法来获取测量结果。它返回一个包含测量信息的数组。

```js
const measures = performance.getEntriesByName("myMeasurement");
measures.forEach((measure) => {
  console.log(`${measure.name}: ${measure.duration}ms`);
});
```

### 4. 清理标记和测量

为了避免内存泄漏或混淆后续的测量，可以使用  `performance.clearMarks()`  和  `performance.clearMeasures()`  方法来清除标记和测量。

```js
performance.clearMarks("start");
performance.clearMarks("end");
performance.clearMeasures("myMeasurement");
```

这是一个完整的例子，展示了如何使用  `Performance.mark()`  和相关方法来测量代码执行时间：

```js
// 创建开始标记
performance.mark("start");

// 模拟一些工作
for (let i = 0; i < 1000000; i++) {
  // 一些耗时操作
}

// 创建结束标记
performance.mark("end");

// 测量两个标记之间的时间
performance.measure("loopTime", "start", "end");

// 获取并输出测量结果
const measures = performance.getEntriesByName("loopTime");
measures.forEach((measure) => {
  console.log(`${measure.name}: ${measure.duration}ms`);
});

// 清理标记和测量
performance.clearMarks("start");
performance.clearMarks("end");
performance.clearMeasures("loopTime");
```

使用  `Performance.mark()`  可以帮助你精确地分析代码性能瓶颈，并更好地优化应用程序的性能。
