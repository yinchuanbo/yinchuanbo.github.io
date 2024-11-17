---
title: "非常强大的标准 JavaScript API - AbortController"
tag: "JavaScript"
time: 2024-09-29 22:09:04
---

今天，我们来聊聊一个可能被你忽视，而且非常强大的标准 JavaScript API - `AbortController` 。

在过去，大家在提到 `AbortController` 的时候，一般会举请求中断的例子，就连 MDN 给到的描述也是这样的：

<img src="../imgs/80/01.webp" />

但是 `AbortController` 的能力可不止于此，`AbortController` 是 JavaScript 中的一个全局类，它可以用来终止任何异步操作，使用方法如下：

```js
const controller = new AbortController();
controller.signal;
controller.abort();
```

我们创建一个 `AbortController` 实例后，会得到两个东西：

- `signal` 属性，这是一个 `AbortSignal` 实例，我们可以将它传递给要中断的 API，来响应中断事件并进行相应处理，例如，传递给 `fetch()` 方法就可以终止这个请求了；
- `.abort()` 方法，调用这个方法会触发 `signal` 上的中止事件，并将信号标记为已中止。

我们可以通过监听 `abort` 事件，然后根据特定的逻辑实现中止：

```js
controller.signal.addEventListener("abort", () => {
  // 实现中止逻辑
});
```

我们来了解一些支持 `AbortSignal` 的标准 JavaScript API。

## 用法

### 事件监听器

我们可以在添加事件监听器时提供一个中止 `signal`，这样在中止发生时，监听器会自动删除。

```js
const controller = new AbortController();
window.addEventListener("resize", listener, { signal: controller.signal });
controller.abort();
```

如果我们调用 `controller.abort()` ，就会从 `window` 中删除 `resize` 监听器。这是一种非常优雅的处理事件监听器的方式，因为我们不再需要抽象监听器函数来调用 `removeEventListener()` 。

```js
// const listener = () => {}
// window.addEventListener('resize', listener)
// window.removeEventListener('resize', listener)
const controller = new AbortController();
window.addEventListener("resize", () => {}, { signal: controller.signal });
controller.abort();
```

如果应用的不同部分负责删除监听器，传递一个 `AbortController` 实例会更加方便，然后我就发现可以使用单个 `signal` 来删除多个事件监听器！

```js
useEffect(() => {
  const controller = new AbortController();
  window.addEventListener("resize", handleResize, {
    signal: controller.signal,
  });
  window.addEventListener("hashchange", handleHashChange, {
    signal: controller.signal,
  });
  window.addEventListener("storage", handleStorageChange, {
    signal: controller.signal,
  });
  return () => {
    // 调用 `.abort()` 会删除所有关联的事件监听器
    controller.abort();
  };
}, []);
```

在上面的例子中，我在 React 中添加了一个 `useEffect()` 钩子，其中引入了一些具有不同用途和逻辑的事件监听器。然后，在清理函数中，我只需调用一次 `controller.abort()` 就可以删除所有添加的监听器，还是很好用的！

### Fetch 请求

`fetch()` 函数也支持 `AbortSignal`，中断请求应该也是 `AbortController` 使用最多的场景。

一旦 `signal` 上的 `abort` 事件被触发，`fetch()` 函数返回的请求 `Promise` 就会被拒绝，从而终止未完成的请求。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>文件上传示例</title>
  </head>
  <body>
    <input type="file" id="fileInput" />
    <button id="uploadButton">上传</button>
    <button id="cancelButton">取消上传</button>

    <script>
      function uploadFile(file) {
        const controller = new AbortController();

        // 将中止信号传递给 fetch 请求
        const response = fetch("/upload", {
          method: "POST",
          body: file,
          signal: controller.signal,
        });

        return { response, controller };
      }

      document.getElementById("uploadButton").addEventListener("click", () => {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (!file) {
          alert("请选择一个文件");
          return;
        }

        const { response, controller } = uploadFile(file);

        response
          .then((res) => res.json())
          .then((data) => {
            console.log("文件上传成功:", data);
          })
          .catch((err) => {
            if (err.name === "AbortError") {
              console.log("文件上传被取消");
            } else {
              console.error("文件上传失败:", err);
            }
          });

        // 保存 controller 以便取消上传
        window.currentUploadController = controller;
      });

      document.getElementById("cancelButton").addEventListener("click", () => {
        if (window.currentUploadController) {
          window.currentUploadController.abort();
          console.log("点击了取消上传按钮");
        } else {
          console.log("没有正在进行的上传操作");
        }
      });
    </script>
  </body>
</html>
```

上面例子中的 `uploadFile()` 函数发起了一个 `POST` 请求，返回关联的 `response` Promise 以及一个 `AbortController` 实例，当用户点击取消上传按钮的时候，我们可以通过 `AbortController` 实例随时终止这个请求。

Node.js 中由 `http` 模块发出的请求也支持 `signal` 属性！

```js
const http = require("http");
const { AbortController } = require("abort-controller");

function makeRequest() {
  const controller = new AbortController();

  const options = {
    hostname: "example.com",
    port: 80,
    path: "/",
    method: "GET",
    // 将 AbortSignal 传递给请求
    signal: controller.signal,
  };

  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("Response:", data);
    });
  });

  req.on("error", (e) => {
    if (e.name === "AbortError") {
      console.log("请求被取消");
    } else {
      console.error(`请求遇到问题: ${e.message}`);
    }
  });

  req.end();

  // 模拟取消操作，例如在 2 秒后取消请求
  setTimeout(() => {
    controller.abort();
  }, 2000);
}

makeRequest();
```

## `AbortSignal` 类的静态方法

`AbortSignal` 类还具有一些静态方法，可以简化 JavaScript 中的请求处理。

### `AbortSignal.timeout`

我们可以使用 `AbortSignal.timeout()` 静态方法作为快捷方式，创建一个在经过一定超时时间后会触发中止事件的信号。如果只想在请求超时后取消请求，就不需要创建一个 `AbortController` 了：

```js
document.getElementById("fetchButton").addEventListener("click", () => {
  const url = "https://jsonplaceholder.typicode.com/posts/1"; // 示例 API 地址

  fetch(url, {
    // 如果请求超过 1700 毫秒则自动中止
    signal: AbortSignal.timeout(1700),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("网络响应失败");
      }
      return response.json();
    })
    .then((data) => {
      console.log("请求成功:", data);
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.error("请求超时被取消:", error);
      } else {
        console.error("请求出错:", error);
      }
    });
});
```

### `AbortSignal.any`

类似于 `Promise.race()` 处理多个 Promise 的方式，我们可以使用 `AbortSignal.any()` 静态方法将多个中止信号组合到一个里面，下面是一个具体的例子：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AbortSignal.any 示例</title>
  </head>
  <body>
    <button id="stopButton">停止监听</button>

    <script>
      const publicController = new AbortController();
      const internalController = new AbortController();

      // 创建 WebSocket 连接
      const socket = new WebSocket("wss://conardli.websocket.org");

      // 当 WebSocket 连接打开时触发
      socket.addEventListener("open", () => {
        console.log("WebSocket 连接已建立");
        socket.send("Hello WebSocket!");
      });

      // 处理收到的消息
      function handleMessage(event) {
        console.log("收到消息:", event.data);
      }

      // 使用 AbortSignal.any 将多个中止信号组合到一个中
      socket.addEventListener("message", handleMessage, {
        signal: AbortSignal.any([
          publicController.signal,
          internalController.signal,
        ]),
      });

      // 模拟取消操作
      document.getElementById("stopButton").addEventListener("click", () => {
        publicController.abort();
        console.log("停止监听消息事件");
      });

      // 也可以通过内部控制器取消
      setTimeout(() => {
        internalController.abort();
        console.log("内部控制器自动中止监听");
      }, 5000);
    </script>
  </body>
</html>
```

1. 创建了两个 `AbortController` 实例，分别为 `publicController` 和 `internalController`。
2. 使用 WebSocket 建立连接，并在连接建立后发送一条消息。
3. 为 WebSocket 的 `message` 事件添加监听器，并通过 `AbortSignal.any` 组合两个中止信号。
4. 在页面中添加了一个按钮，当点击按钮时将调用 `publicController.abort()` 来停止监听消息事件。
5. 另外，使用 `setTimeout` 模拟了一个内部控制器在 5 秒后自动中止监听操作。

通过这种方式，可以灵活地组合多个中止信号，当任意一个信号触发时，相关的事件监听器都会被取消。

## 取消流

我们还可以使用 `AbortController` 和 `AbortSignal` 来取消流。

在下面个例子中，我们创建一个 `WritableStream`，并通过监听 `controller.signal` 的 `abort` 事件来处理流的中止操作。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>取消流操作示例</title>
  </head>
  <body>
    <button id="cancelButton">取消写操作</button>

    <script>
      async function example() {
        const abortController = new AbortController();

        const stream = new WritableStream({
          write(chunk, controller) {
            console.log("正在写入:", chunk);

            // 监听中止信号
            controller.signal.addEventListener("abort", () => {
              console.log("写操作被取消");
              // 处理流中止逻辑，例如清理资源或通知用户
            });
          },
          close() {
            console.log("写入完成");
          },
          abort(reason) {
            console.warn("写入中止:", reason);
          },
        });

        const writer = stream.getWriter();

        // 模拟写入操作
        writer.write("数据块 1");
        writer.write("数据块 2");

        // 保存 abortController 以便取消操作
        window.currentAbortController = abortController;
        writer.releaseLock(); // 创建新写操作前释放写锁

        // 监听取消按钮的点击事件
        document
          .getElementById("cancelButton")
          .addEventListener("click", async () => {
            if (window.currentAbortController) {
              await writer.abort();
              window.currentAbortController.abort();
              console.log("点击了取消写操作按钮");
            } else {
              console.log("没有正在进行的写操作");
            }
          });
      }

      example();
    </script>
  </body>
</html>
```

`WritableStream` 控制器暴露了 `signal` 属性，即同样的 `AbortSignal`。这样，我可以调用 `writer.abort()`，这会在流的 `write()` 方法中的 `controller.signal` 上冒泡触发中止事件。

## 中止任何逻辑

实际上 `AbortController` 的能力还不仅于此，我们可以借助它让任何逻辑变得可中止！

比如下面的例子，我们将 `AbortController` 添加到 Drizzle ORM 事务中，让我们能够一次取消多个事务。

```js
import { TransactionRollbackError } from "drizzle-orm";

function makeCancelableTransaction(db) {
  return (callback, options = {}) => {
    return db.transaction((tx) => {
      return new Promise((resolve, reject) => {
        options.signal?.addEventListener("abort", async () => {
          reject(new TransactionRollbackError());
        });

        return Promise.resolve(callback.call(this, tx)).then(resolve, reject);
      });
    });
  };
}
```

`makeCancelableTransaction()` 函数接受一个数据库实例，并返回一个高阶事务函数，然后可以接受一个中止 `signal` 作为参数。

通过在 `signal` 实例上添加 `abort` 事件的监听器，我可以知道中止在何时发生。这个事件监听器会在中止事件触发时被调用，也就是在 `controller.abort()` 被调用时。因此，发生中止时，我可以通过返回一个 `TransactionRollbackError` 错误来回滚整个事务（这等同于调用 `tx.rollback()` 并抛出相同的错误）。

然后，我们在 Drizzle 中使用它。

```js
const db = drizzle(options);

const controller = new AbortController();
const transaction = makeCancelableTransaction(db);

await transaction(
  async (tx) => {
    await tx
      .update(accounts)
      .set({ balance: sql`${accounts.balance} - 100.00` })
      .where(eq(users.name, "Dan"));
    await tx
      .update(accounts)
      .set({ balance: sql`${accounts.balance} + 100.00` })
      .where(eq(users.name, "Andrew"));
  },
  { signal: controller.signal }
);
```

我们调用了 `makeCancelableTransaction()` 工具函数，并传入 `db` 实例来创建一个自定义可中止事务。从现在开始，我可以像通常在 Drizzle 中一样使用这个自定义事务来执行多个数据库操作，还可以为其提供一个中止 `signal` ，以一次取消所有操作。

## 中止错误处理

每个中止事件都附带中止原因，这让我们能够进行更多的定制化，我们可以对不同的中止原因做出不同的反应。

中止原因是 `controller.abort()` 方法的可选参数。你可以在任何 `AbortSignal` 实例的 `reason` 属性中访问中止原因。

```js
async function fetchData() {
  const controller = new AbortController();
  const signal = controller.signal;

  // 监听 abort 事件，并打印中止原因
  signal.addEventListener("abort", () => {
    console.log("请求中止原因:", signal.reason); // 打印自定义的中止原因
  });

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1",
      { signal }
    );
    const data = await response.json();
    console.log("请求成功:", data);
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("请求因中止被取消:", error.message);
    } else {
      console.error("请求出错:", error.message);
    }
  }

  // 保存 controller 以便取消操作
  window.currentAbortController = controller;
}

fetchData();

// 监听取消按钮的点击事件
document.getElementById("cancelButton").addEventListener("click", () => {
  if (window.currentAbortController) {
    window.currentAbortController.abort("用户取消了请求"); // 提供自定义的中止原因
    console.log("点击了取消请求按钮");
  } else {
    console.log("没有正在进行的请求");
  }
});
```

`reason` 参数可以是任何 JavaScript 值，所以我们可以传递字符串、错误，甚至对象。

## 兼容性

<img src="../imgs/80/02.webp" />

`AbortController` 的兼容性非常好，很久之前就已经被纳入了 Web 兼容性 Baseline，从 2019 年 3 月起，就可在所有主流浏览器中使用了。