---
title: "vue3 vite 使用 代理转发"
tag: "Vue"
time: 2025-01-19 18:37:32
---

## 1\. vue3 vite 使用 代理转发

在使用 Vue 3 和 Vite 构建的前端项目中，配置代理转发是一种常见的解决跨域问题的方法。

通过在  `vite.config.js`  文件中配置代理规则，可以有效地将前端请求转发到后端服务器，从而避免因浏览器同源策略导致的跨域问题。

下面详细介绍如何在 Vue 3 和 Vite 项目中配置代理转发。

### 1.1. 创建或编辑  `vite.config.js`  文件

首先，确保你的项目中存在  `vite.config.js`  文件。如果项目中还没有这个文件，你需要手动创建它。

这个文件用于配置 Vite 的各种选项，包括开发服务器的代理设置。

### 1.2. 配置代理规则

在  `vite.config.js`  文件中，可以通过  `server.proxy`  属性来配置代理规则。这里是一个具体的例子，展示了如何将  `/api`  开头的请求代理到本地的  `http://127.0.0.1:3000`  服务器上：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

exportdefaultdefineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

**1.2.1. 配置项解释**

- **`/api`**：这是匹配请求路径的前缀。所有以  `/api`  开头的请求都会被代理。
- **`target`**：这是目标服务器的地址。所有匹配的请求将被转发到这个地址。
- **`changeOrigin`**：设置为  `true`  时，Vite 会更改请求头中的  `Origin`  字段为  `target`  地址，这对于某些后端服务器来说是必要的。
- **`rewrite`**：这是一个函数，用于重写请求路径。在这个例子中，它会将  `/api`  前缀去掉，确保后端能够接收到正确的路径。

### 1.3. 在前端代码中使用代理

在前端代码中，你可以像往常一样发起请求，只需确保请求路径以  `/api`  开头。

例如，如果你使用  `axios`  发起请求，可以这样写：

```js
import axios from'axios';

asyncfunctionfetchUserData() {
try {
    const response = await axios.get('/api/user/data');
    console.log('User Data:', response.data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// 调用函数
fetchUserData();
```

在这个例子中，实际的请求会被代理到  `http://127.0.0.1:3000/user/data`。

### 1.4. 高级配置

**1.4.1. 多个代理规则**

如果你需要配置多个代理规则，可以在  `proxy`  对象中添加更多的条目。例如：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

exportdefaultdefineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/auth": {
        target: "http://127.0.0.1:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""),
      },
    },
  },
});
```

**1.4.2. 处理 WebSocket 代理**

如果你的应用需要处理 WebSocket 请求，可以在代理规则中添加  `ws`  选项：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

exportdefaultdefineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        ws: true, // 处理 WebSocket 请求
      },
    },
  },
});
```

### 1.5. 测试和调试

配置完成后，启动 Vite 开发服务器并测试你的请求是否能够正确地被代理到后端服务器。如果遇到问题，可以检查浏览器的开发者工具中的网络请求，查看请求是否被正确代理。

### 1.6. 总结

通过在  `vite.config.js`  中配置代理规则，可以轻松解决 Vue 3 和 Vite 项目中的跨域问题。这种方法不仅简单易用，而且在开发过程中非常有效。
