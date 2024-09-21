---
title: "使用 Axios 配置动态域名的基础 URL 和项目打包"
tag: "Engineering"
---

在 Web 开发中，我们常常需要根据不同的环境（如开发、测试和生产）配置不同的 API 基础 URL。使用 Axios 作为 HTTP 客户端，我们可以通过动态配置基础 URL 来实现这一目标。本文将介绍如何在 Axios 中配置动态域名，并提供项目打包的示例。

## 为什么需要动态配置基础 URL？

在开发过程中，我们可能需要不同的 API 端点来满足不同环境的需求。例如：

- **开发环境**：使用本地服务器的 API。
- **测试环境**：使用测试服务器的 API。
- **生产环境**：使用生产服务器的 API。

通过动态配置基础 URL，我们可以确保我们的应用在不同的环境中使用正确的 API 端点，而无需修改代码。

## 示例代码

### 1\. 创建获取基础 URL 的函数

我们需要一个函数来根据当前的域名返回正确的基础 URL。

```js
const getBaseURL = () => {
  const hostname = window.location.hostname;
  if (hostname === "www.example.com") {
    return "https://api.example.com/v1";
  } else if (hostname === "staging.example.com") {
    return "https://staging.api.example.com/v1";
  } else {
    return "https://default.api.example.com/v1"; // 默认 URL
  }
};
```

这个函数检查当前的 `hostname`，并根据它返回相应的基础 URL。你可以根据实际情况调整这些 URL。

### 2\. 创建 Axios 实例

使用 `axios.create` 方法创建一个 Axios 实例，并将 `baseURL` 设置为我们刚刚定义的动态 URL。

```js
import axios from "axios";

// 创建 Axios 实例
const api = axios.create({
  baseURL: getBaseURL(), // 动态设置 baseURL
  timeout: 7000, // 设置请求超时时间
});

export default api;
```

### 3\. 在项目中使用 Axios 实例

在你的组件或服务中使用配置好的 Axios 实例来发送请求。

```html
<template>
  <div>
    <button @click="fetchData">Fetch Data</button>
  </div>
</template>

<script>
  import api from "../api"; // 引入配置好的 Axios 实例

  export default {
    methods: {
      fetchData() {
        api
          .get("/data")
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      },
    },
  };
</script>
```

## 项目打包配置

为了确保你的应用在不同环境下使用正确的基础 URL，你需要在打包过程中配置环境变量。这可以通过使用构建工具（如 Webpack 或 Vite）来完成。

### 1\. 使用 Webpack 配置环境变量

在你的项目根目录下，创建一个 `.env` 文件，并添加不同环境的配置。

- .env.development:

```sh
VUE_APP_BASE_URL=https://api.example.com/v1
```

- .env.staging:

```sh
VUE_APP_BASE_URL=https://staging.api.example.com/v1
```

- .env.production:

```sh
VUE_APP_BASE_URL=https://default.api.example.com/v1
```

在你的 `webpack.config.js` 中，使用 `DefinePlugin` 来注入环境变量：

```js
const webpack = require("webpack");
const path = require("path");

module.exports = {
  // 其他配置...
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        BASE_URL: JSON.stringify(process.env.VUE_APP_BASE_URL),
      },
    }),
  ],
  // 其他配置...
};
```

### 2\. 使用 Vite 配置环境变量

在 Vite 项目中，你也可以使用 `.env` 文件来配置环境变量。创建如下环境文件：

- .env.development:

```sh
VUE_APP_BASE_URL=https://api.example.com/v1
```

- .env.staging:

```sh
VUE_APP_BASE_URL=https://staging.api.example.com/v1
```

- .env.production:

```sh
VUE_APP_BASE_URL=https://default.api.example.com/v1
```

然后在你的代码中使用这些环境变量：

```js
const getBaseURL = () => {
  return import.meta.env.VITE_BASE_URL;
};
```
