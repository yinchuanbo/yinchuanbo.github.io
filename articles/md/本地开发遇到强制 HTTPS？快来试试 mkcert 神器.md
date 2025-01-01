---
title: "本地开发遇到强制 HTTPS？快来试试 mkcert 神器"
tag: "工具集"
time: 2025-01-01 16:40:42
---

## 前言 🤔

作为前端开发者，你是否遇到过这样的情况：

- 某些第三方 SDK 强制要求 HTTPS（比如微信 JSSDK）
- 需要调试 PWA 或 Service Worker
- 不想把本地代码部署到线上环境去调试
- 被浏览器的"您的连接不是私密连接"提示烦恼

如果你遇到过以上任何一种情况，那么今天要介绍的 mkcert 一定能帮你解决问题！

## mkcert 是什么？ 🎯

mkcert 是一个用于生成本地可信任的开发证书的工具。它可以让你在本地开发环境中轻松配置 HTTPS，而且完全免费！最重要的是，它生成的证书会被系统和浏览器完全信任，不会出现烦人的安全警告。

## 为什么需要 mkcert？💡

在现代前端开发中，越来越多的功能要求必须在 HTTPS 环境下运行：

- WebRTC 音视频功能
- Service Workers 和 PWA
- 微信 JSSDK
- 第三方登录（OAuth）
- 地理位置、摄像头等敏感 API
- Web Payments API

虽然可以使用自签名证书，但每次都要在浏览器中手动添加例外，非常麻烦。而 mkcert 可以一劳永逸地解决这个问题！

## 如何使用 mkcert？🔧

### 1\. 安装 mkcert

**MacOS 用户：**

```sh
brew install mkcert
brew install nss # 如果你使用 Firefox 浏览器
```

**Windows 用户：**

```sh
choco install mkcert
```

**Linux 用户：**

```sh
sudo apt install libnss3-tools
sudo apt install mkcert
```

### 2. 初始化

```sh
mkcert -install
```

这一步会在你的系统中安装本地 CA（证书颁发机构）。

### 3. 生成证书

```sh
mkcert localhost 127.0.0.1 ::1
```

执行完后，你会得到以下文件：

- `localhost+2.pem`（证书文件）
- `localhost+2-key.pem`（私钥文件）

### 4\. 在前端开发服务器中配置 HTTPS

**Vite 配置示例**

```js
// vite.config.js
import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync("localhost+2-key.pem"),
      cert: fs.readFileSync("localhost+2.pem"),
    },
    host: "localhost",
    port: 3000,
  },
});
```

**webpack DevServer 配置示例**

```js
// webpack.config.js
const fs = require("fs");
const path = require("path");

module.exports = {
  // ... 其他配置
  devServer: {
    https: {
      key: fs.readFileSync("localhost+2-key.pem"),
      cert: fs.readFileSync("localhost+2.pem"),
    },
    host: "localhost",
    port: 3000,
  },
};
```

配置完成后，直接运行 `npm run dev` 就能启动 HTTPS 开发服务器了！🎉

## 实际应用场景 🌟

### 场景一：调试 PWA 应用

PWA 必须在 HTTPS 环境下才能注册 Service Worker：

```js
// 在非 HTTPS 环境下会报错
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker 注册成功");
    })
    .catch((err) => {
      console.error("Service Worker 注册失败:", err);
    });
}
```

### 场景二：微信 JSSDK

```js
// 微信 JSSDK 要求必须在 HTTPS 环境下使用
wx.config({
  debug: true,
  appId: "your_app_id",
  timestamp: 1234567890,
  nonceStr: "random_string",
  signature: "sign",
  jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
});
```

使用 mkcert 配置本地 HTTPS 后，你就可以直接在本地环境进行开发和调试，不需要每次都部署到线上环境！
