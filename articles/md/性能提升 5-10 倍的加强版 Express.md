---
title: "性能提升 5-10 倍的加强版 Express"
tag: "NodeJS"
time: 2024-10-13 20:52:51
---

今天来跟大家介绍一个最新开源的 Node.js 框架：`µExpress`。

µExpress（读作 Micro-Express）是一款基于  `µWebSockets`  的高速 HTTP 服务器，其主要特色是与 Express.js 4 完全兼容。虽然它的 API 和功能与 Express.js 完全相同，但性能却大幅提升。

它完全可以成为 Express.js 的替代品，对于需要高并发和高性能的应用来说，µExpress 是一个理想的选择。

## 主要特点

- 全兼容性：几乎所有 Express.js 的功能和中间件都能在 µExpress 中使用，只需将  `express`  替换为  `ultimate-express`  就能无缝迁移。另外，µExpress 还保持了与 Express.js 相同的开发体验，这使得开发者可以轻松切换而无需改动大量代码。

- 极速性能：µExpress 基于  `µWebSockets`  重实现，采用高性能的事件驱动模式，大幅提升了性能表现。在性能测试中，µExpress 多次超越 Express.js，表现出卓越的吞吐能力和低延迟。

## 类似的项目

- `Express on Bun`

Bun 是一个高速的 JavaScript 运行时，其中的 HTTP 模块基于  `uWebSockets`  实现。因此，在 Bun 上运行 Express 其性能相较于在 Node.js 上有所提升，大约是 2-3 倍。然而，由于 Bun 并未进行特定的  `uWebSockets`  优化，所以它的性能仍然不及 µExpress。µExpress 通过深度集成  `µWebSockets`，充分利用其高性能特性，进一步优化了路由和中间件处理。

- `Hyper-Express`

Hyper-Express 提供了一个类似于 Express 的 API，但它并非一个直接可替换的选项，其实现方式与 Express 存在许多差异。这导致了许多随机的 quirks 和问题，使得从 Express 切换到 Hyper-Express 变得相对困难。此外，Hyper-Express 内建的中间件也与 Express 的不同，许多专为 Express 编写的中间件在 Hyper-Express 中并不适用。而 µExpress 保持了与 Express 的高度兼容性，仅仅通过替换  `require`  语句就能轻松迁移。

- `uWebSockets-Express`

uWebSockets-Express 是一个与 Express 更为接近的替代品，但仍旧缺少许多 API，并且在底层调用 Express 方法以实现某些功能。它并未尝试通过使用原生的  `uWebSockets`  路由来优化性能。这意味着它在速度上无法与 µExpress 匹敌，而 µExpress 则利用了  `uWebSockets`  的原生性能，进行深度优化。

## 安装与使用

首先安装  `ultimate-express`：

```sh
npm install ultimate-express
```

将项目中的  `require('express')`  替换为  `require('ultimate-express')`。

```sh
const express = require('ultimate-express');
```

下面是一个简单的示例代码，与传统 Express 写法几乎没有差异：

```js
const express = require("ultimate-express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, µExpress!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

更复杂的示例中，我们可以使用路由、中间件和模板引擎等，实现和 Express 一样的功能，例如：

```js
const express = require("ultimate-express");
const app = express();

// 使用中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(express.static("public")); // 提供静态文件服务

// 路由定义
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to api!" });
});

app.post("/data", (req, res) => {
  console.log(req.body);
  res.send("Data received");
});

// 启动服务器
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## 性能表现

使用  `wrk`  工具进行性能测试，测试环境为 Ubuntu 22.04, Node.js 20.17.0, AMD Ryzen 5 3600, 64GB RAM，测试结果显示：

| 测试类型                    | Express req/sec | µExpress req/sec | Express 吞吐量 | µExpress 吞吐量 | µExpress 加速比 |
| --------------------------- | --------------- | ---------------- | -------------- | --------------- | --------------- |
| routing/simple-routes       | 11.16k          | 75.14k           | 2.08 MB/sec    | 14.46 MB/sec    | 6.73X           |
| routing/lot-of-routes       | 4.63k           | 54.57k           | 0.84 MB/sec    | 10.03 MB/sec    | 11.78X          |
| routing/some-middlewares    | 10.12k          | 61.92k           | 1.79 MB/sec    | 11.32 MB/sec    | 6.12X           |
| routers/nested-routers      | 10.18k          | 51.15k           | 1.82 MB/sec    | 9.40 MB/sec     | 5.02X           |
| middlewares/express-static  | 6.58k           | 32.45k           | 10.15 MB/sec   | 49.43 MB/sec    | 4.87X           |
| engines/ejs                 | 5.50k           | 40.82k           | 2.45 MB/sec    | 18.38 MB/sec    | 7.42X           |
| middlewares/body-urlencoded | 8.07k           | 50.52k           | 1.68 MB/sec    | 10.78 MB/sec    | 6.26X           |

这些结果显示，µExpress 在处理简单路由、多路由和中间件等场景中，均表现出极高的性能提升。

## 与其他框架比较

在高性能 HTTP 框架的比较中，µExpress 依然表现出色：

| 框架             | 平均  | Ping  | Query  | Body  |
| ---------------- | ----- | ----- | ------ | ----- |
| uws              | 94.3k | 108k  | 104.8k | 69.6k |
| hyper-express    | 66.4k | 80k   | 70k    | 49.1k |
| ultimate-express | 57.3k | 64.6k | 60.2k  | 47.2k |
| h3               | 35.4k | 41.2k | 34.4k  | 30.6k |
| fastify          | 33.1k | 40.1k | 40.1k  | 19.1k |
| hono             | 26.6k | 36.2k | 34.7k  | 8.9k  |
| koa              | 24.0k | 28.2k | 24.6k  | 19.3k |
| express          | 10.4k | 11.2k | 10.6k  | 9.4k  |

## 使用 µExpress 进行性能优化的最佳实践

µExpress 是一个高性能的 HTTP 服务器，它通过多种方式优化了路由和中间件处理。以下是一些关于如何充分利用 µExpress 优势的性能优化建议。

### 路由优化

µExpress 尽可能对路由进行优化，在以下情况下可以实现最高效的路由处理：

1. **启用大小写敏感**：默认启用与普通 Express 不同。大小写敏感的路由匹配更加高效。
2. **避免使用正则字符**：路径中使用字符串而非正则字符（如  `*`, `+`, `()`, `{}`, 等）可以被 µExpress 最优化处理。
3. **单级路由深度**：仅能优化一级深度的路由嵌套。多级嵌套将降低性能。

通过上述优化，路由处理速度可提升至普通路由的 10 倍，因为这些路由使用了原生的  `uWS`  路由并且路径是预先计算好的。

### 中间件优化

1. **使用内置静态文件中间件**：避免使用外部的  `serve-static`  模块，而使用内置的  `express.static()`。后者针对 µExpress 进行了优化。
2. **使用内置的请求体解析中间件**：避免使用  `body-parser`  模块，而使用内置的  `express.text()`  和  `express.json()`  等。这些内置中间件同样得到了优化。
3. **避免不必要的请求体读取**：不要在不需要请求体的 GET 方法或其他方法上设定读取请求体。读取请求体会使端点速度降低大约 15%。

### 线程优化

默认情况下，µExpress 创建一个（如果 CPU 只有一个核心则为零）子线程以提高文件读取性能。你可以通过在  `express()`  中设置  `threads`  值来更改这一数量，或者设置为  `0`  以禁用线程池：

`const app = express({ threads: 0 });   `

线程在所有  `express()`  实例之间共享，使用最大线程数。请注意，更多的线程不一定会带来更好的性能。有时候完全不使用线程反而更快，建议进行测试来找出最佳的设置。

### IP 地址处理

请避免在响应完成后读取  `req.connection.remoteAddress`  或  `req.ip`（如果没有启用  `trust proxy`）。在 µWS 中读取 IP 比较慢，如果在响应后读取 IP，会使得每个请求都会读取 IP，即使不需要，这会让 µExpress 在后续请求处理上大幅变慢。

## 最后

- Github：https://github.com/dimdenGD/ultimate-express
