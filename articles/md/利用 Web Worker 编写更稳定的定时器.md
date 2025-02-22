---
title: "利用 Web Worker 编写更稳定的定时器"
tag: "Web Worker"
time: 2024-09-01 15:21:24
---

当浏览器最小化或处于后台时，会对`setTimeout`和`setInterval`进行一定的优化，可能是节流，也可能将任务集中到浏览器回到前台的时候（此时可能看到多次定时回调函数在短时间内被触发）。因此如果需要一个更稳定的定时器，比如程序逻辑中需要一个不间断的定时，可以利用 Web Wokrer。

原理很简单，因为 Web Worker 运行在另一个线程中，不受主线程的影响。示例：

```js
let normalTime = 0;
setInterval(() => {
  console.debug("Normal: ", normalTime++);
}, 1000);
const blob = new Blob(
  [
    `let workerTime = 0;
    self.setInterval(()=>{
        console.debug('In Worker: ', workerTime);
        self.postMessage(workerTime);
        workerTime++;
    }, 1000);`,
  ],
  { type: "application/javascript" }
);
const worker = new Worker(URL.createObjectURL(blob));
worker.onmessage = (ev) => {
  console.debug("Out of Worker: ", ev.data);
};
```

利用`Blob`动态创建了一个 Web Worker，在其中开启一个定时器，向外发送时间消息。

运行这段代码，将浏览器最小化，过了一段时间后再看，`normalTime`的数值就会小于`workerTime`。而`workerTime`就是更准确的计数值，**虽然受限于`setInterval`本身其并不是精确的计时，但这个方法会更加稳定**。
