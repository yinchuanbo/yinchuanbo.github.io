---
title: "使用 BroadcastChannel 进行跨页面通信"
tag: "通信"
---

在现代 Web 应用程序中，有时候我们需要在不同的页面之间进行通信，例如在一个页面上的操作需要更新另一个页面上的内容。这时候，`BroadcastChannel` 可以成为一个非常有用的工具。`BroadcastChannel` 允许我们在不同的浏览器标签页或者不同的窗口之间进行消息广播。

### 什么是 BroadcastChannel？

`BroadcastChannel` 是一个 JavaScript API，它提供了一种简单的跨页面通信机制。通过 `BroadcastChannel`，我们可以创建一个频道，不同页面或者同一页面中的不同 JavaScript 上下文可以通过这个频道进行消息的发送和接收。

### 如何使用 BroadcastChannel？

使用 `BroadcastChannel` 很简单，首先我们需要创建一个频道：

```js
const channel = new BroadcastChannel("myChannel");
```

上面的代码创建了一个名为 `'myChannel'` 的频道。接下来，我们可以通过这个频道发送消息：

```js
channel.postMessage("Hello, world!");
```

要在其他页面或者同一页面的不同上下文中接收消息，我们可以监听 `message` 事件：

```js
channel.onmessage = (event) => {
  console.log("Received message:", event.data);
};
```

### 示例

假设我们有两个页面，一个发送消息，一个接收消息。

**发送消息的页面 (page1.html)**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page 1</title>
  </head>
  <body>
    <button onclick="sendMessage()">Send Message</button>
    <script>
      const channel = new BroadcastChannel("myChannel");

      function sendMessage() {
        channel.postMessage("Hello from Page 1!");
      }
    </script>
  </body>
</html>
```

**接收消息的页面 (page2.html)**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page 2</title>
  </head>
  <body>
    <div id="message"></div>
    <script>
      const channel = new BroadcastChannel("myChannel");

      channel.onmessage = (event) => {
        document.getElementById("message").textContent = event.data;
      };
    </script>
  </body>
</html>
```

### 注意事项

- `BroadcastChannel` 仅在同源页面之间有效。这意味着，只有当两个页面具有相同的协议 (`http` 或 `https`)，主机 (`localhost:8080` 和 `localhost:8081` 是不同的主机)，以及端口号时，它们才能够相互通信。

- 虽然 `BroadcastChannel` 是一个强大的工具，但在使用时需要注意不要滥用，以免出现安全或性能问题。

### 结论

`BroadcastChannel` 提供了一个简单而强大的方式，在不同的浏览器标签页或者同一页面的不同上下文中进行消息广播和接收。它是现代 Web 应用程序中跨页面通信的一种很好的解决方案。
