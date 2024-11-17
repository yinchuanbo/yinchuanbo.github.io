---
title: "20 几个你不得不知道的 Promise 高级用法"
tag: "Promise"
time: 2024-11-15 22:07:57
---

## 1. 并发控制

使用`Promise.all`可以并行执行多个 Promise，但当需要控制并发的请求数量时，可以通过实现一个并发控制函数来控制同时执行的 Promise 数量。

```js
const concurrentPromises = (promises, limit) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    let result = [];
    const executor = () => {
      if (i >= promises.length) {
        return resolve(result);
      }
      const promise = promises[i++];
      Promise.resolve(promise)
        .then((value) => {
          result.push(value);
          if (i < promises.length) {
            executor();
          } else {
            resolve(result);
          }
        })
        .catch(reject);
    };
    for (let j = 0; j < limit && j < promises.length; j++) {
      executor();
    }
  });
};
```

## 2. Promise 超时

有时候，我们希望 Promise 在一定时间内如果没有得到解决就自动 reject。这可以用下面的方式实现。

```js
const promiseWithTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error("Timeout after " + ms + "ms")), ms)
    ),
  ]);
```

## 3. Promise 的取消

JavaScript 原生的 Promise 是无法取消的，但我们可以通过引入一个可控的中断逻辑来模拟取消 Promise。

```js
const cancellablePromise = (promise) => {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (value) => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
      (error) => (isCanceled ? reject({ isCanceled, error }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
};
```

## 4. 检测 Promise 状态

原生的 Promise 不允许直接查询状态。但可以通过一定的技巧来了解当前 Promise 是否已解决、被拒绝或尚未解决。

```js
const reflectPromise = (promise) =>
  promise.then(
    (value) => ({ status: "fulfilled", value }),
    (error) => ({ status: "rejected", error })
  );
```

## 5. 顺序执行 Promise 数组

有时候我们需要按顺序执行一组 Promise，以确保前一个异步操作完成后再开始下一个。

```js
const sequencePromises = (promises) =>
  promises.reduce((prev, next) => prev.then(() => next()), Promise.resolve());
```

## 6. 基于条件的 Promise 链

在某些场合下，需要根据条件判断是否执行下一个 Promise。

```js
const conditionalPromise = (conditionFn, promise) =>
  conditionFn() ? promise : Promise.resolve();
```

## 7. Promise 的重试逻辑

当 Promise 因为某些暂时性的错误被拒绝时，可能希望能够重试执行。

```js
const retryPromise = (promiseFn, maxAttempts, interval) => {
  return new Promise((resolve, reject) => {
    const attempt = (attemptNumber) => {
      if (attemptNumber === maxAttempts) {
        reject(new Error("Max attempts reached"));
        return;
      }
      promiseFn()
        .then(resolve)
        .catch(() => {
          setTimeout(() => {
            attempt(attemptNumber + 1);
          }, interval);
        });
    };
    attempt(0);
  });
};
```

## 8. 确保 Promise 只解决一次

在某些情况下，可能希望确保 Promise 只会解决一次，即使可能会被多次调用`resolve`。

```js
const onceResolvedPromise = (executor) => {
  let isResolved = false;
  return new Promise((resolve, reject) => {
    executor((value) => {
      if (!isResolved) {
        isResolved = true;
        resolve(value);
      }
    }, reject);
  });
};
```

## 9. 使用 Promise.allSettled 处理多个异步操作

与`Promise.all`不同的是，`Promise.allSettled`会等到所有的 prromise 都结束后才完成，无论每个 promise 结束后是 fulfilled 还是 rejected。

```js
const promises = [fetch("/api/endpoint1"), fetch("/api/endpoint2")];
Promise.allSettled(promises).then((results) => {
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Promise ${index + 1} succeeded with value ${result.value}`);
    } else {
      console.error(`Promise ${index + 1} failed with reason ${result.reason}`);
    }
  });
});
```

## 10. 处理多个 Promises 的最快响应

当处理多个异步请求，而只关心最快回应的结果时，可以使用`Promise.race`来实现。

```js
const promises = [fetch("/api/endpointA"), fetch("/api/endpointB")];
Promise.race(promises)
  .then((value) => {
    // 处理最快的响应
  })
  .catch((reason) => {
    // 处理最早的拒绝
  });
```

## 11. 使用 async/await 简化 Promise

`async`和`await`关键字可以让异步代码看起来更像同步代码，使得逻辑更清晰。

```js
async function asyncFunction() {
  try {
    const result = await aPromise;
    // Do something with result
  } catch (error) {
    // Handle error
  }
}
```

## 12. 连续获取不确定数量的数据页

当获取分页数据时，我们可能不知道一共有多少页，可以采取递归的方式直到取完所有页。

```js
async function fetchPages(apiEndpoint, page = 1, allResults = []) {
  const response = await fetch(`${apiEndpoint}?page=${page}`);
  const data = await response.json();
  if (data.nextPage) {
    return fetchPages(apiEndpoint, page + 1, allResults.concat(data.results));
  } else {
    return allResults.concat(data.results);
  }
}
```

## 13. 映射并发 Promises 并处理结果数组

当需要并发执行异步函数并处理所有结果时，可以使用`Promise.all`。

```js
const fetchUrls = (urls) => {
  const fetchPromises = urls.map((url) =>
    fetch(url).then((response) => response.json())
  );
  return Promise.all(fetchPromises);
};
```

## 14. 使用 Generators 管理流程

通过将`async/await`与 Generators 配合，可以创建一个可控制的异步流程管理器。

```js
function* asyncGenerator() {
  const result1 = yield aPromise1;
  const result2 = yield aPromise2(result1);
  // ...
}
```

## 15. 使用 Promises 替代回调

Promise 提供了一种更标准和便捷的方式来处理异步操作，将回调函数替换为 Promise。

```js
const callbackToPromise = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
```

## 16. 流式处理大型数据集

使用 Promise 处理大型数据集时，最好是流式地获取和处理这些数据，以避免内存过载。

```js
async function processLargeDataSet(dataSet) {
  for (const dataChunk of dataSet) {
    const processedChunk = await process(dataChunk); // Returns a Promise
    await save(processedChunk); // Another async operation
  }
}
```

## 17. 同时执行多个异步任务并处理中途的失败

有时即便其中一个异步任务失败了，也希望其他任务能够顺利完成。

```js
const promises = [promise1, promise2, promise3];
Promise.all(promises.map(reflectPromise)).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      // Do something with result.value
    } else {
      // Handle result.error
    }
  });
});
```

## 18. Promise-pipeline

通过管道化 promise 可以依次执行一系列异步操作。

```js
const promisePipe =
  (...fns) =>
  (value) =>
    fns.reduce((p, f) => p.then(f), Promise.resolve(value));
```

## 19. 使用 promise 实现一个延时

可以使用 Promise 结合 setTimeout 来实现一个异步的延时函数。

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
```

## 20. 动态生成 Promise 链

在一些情况下，可能需要根据不同条件动态生成一系列的 Promise 链。

```js
const tasks = [task1, task2, task3]; // Array of asynchronous tasks

const promiseChain = tasks.reduce((chain, currentTask) => {
  return chain.then(currentTask);
}, Promise.resolve());
```

## 21. 使用 Promise 实现简易的异步锁

在多线程环境中，可以使用 Promise 来实现一个简易的异步锁。

```js
let lock = Promise.resolve();

const acquireLock = () => {
  let release;
  const waitLock = new Promise((resolve) => {
    release = resolve;
  });
  const tryAcquireLock = lock.then(() => release);
  lock = waitLock;
  return tryAcquireLock;
};
```

## 22. 组合多个 Promise 操作为一个函数

可以将多个 Promise 操作合并为一个函数，通过函数复用减少冗余代码。

```js
const fetchDataAndProcess = async (url) => {
  const data = await fetch(url).then((resp) => resp.json());
  return processData(data);
};
```

## 23. 处理可选的异步操作

有些场合下，一个异步操作是可选的，可以使用下面的方式来处理。

```js
async function optionallyAsyncTask(condition, asyncOperation, fallbackValue) {
  if (condition) {
    return await asyncOperation;
  } else {
    return fallbackValue;
  }
}
```
