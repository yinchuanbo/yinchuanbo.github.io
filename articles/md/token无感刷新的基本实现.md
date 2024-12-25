---
title: "token 无感刷新的基本实现"
tag: "JavaScript"
time: 2024-12-25 21:40:51
---

<img src="../imgs/127/06.webp" />

## 什么是 token 无感刷新？

在日常的 Web 应用和移动应用开发中，基于 Token 的身份验证是一种常见的方式。然而，Token 通常具有一定的有效期，当 Token 过期时，如果要求用户重新登录，会给用户带来较差的体验。因此，实现 Token 无感刷新就显得尤为重要，它能够在用户无感知的情况下更新 Token，保障用户的持续操作流畅性。

## 理解 Token 机制与无感刷新需求

Token 是一种用于代表用户身份的字符串，通常在用户登录成功后由服务器颁发给客户端。客户端在后续的请求中携带这个 Token，服务器通过验证 Token 来确认用户身份并授权访问相应资源。

例如，在一个使用 JSON Web Tokens（JWT）的系统中，Token 包含了用户的身份信息（如用户 ID）以及过期时间等元数据，并且使用密钥进行签名，以防止篡改。

## 无感刷新的必要性

当 Token 过期时，如果没有无感刷新机制，用户在进行某个操作（如提交表单、查看新页面等）时，会收到类似 “Token 过期，请重新登录” 的提示。这会中断用户的操作流程，降低用户体验。而无感刷新能够在 Token 即将过期或已经过期时，自动获取新的 Token，使得用户能够继续操作而不会察觉到 Token 的更新过程。

## 如何实现 token 无感刷新？

### 前端部分

**设置 Token 拦截器**

```js
import axios from "axios";
const instance = axios.create();
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

这里检查本地存储中是否存在 Token，如果有则将其添加到请求头的`Authorization`字段中，以便服务器进行身份验证。

**处理 Token 过期响应**

**当服务器返回 Token 过期的错误响应（通常是一个特定的 HTTP 状态码，如 401 Unauthorized）时，拦截器需要捕获这个响应并进行处理。**

首先，清除本地存储中的旧 Token：

```js
localStorage.removeItem("token");
```

然后，尝试刷新 Token。这通常需要向服务器发送一个专门用于刷新 Token 的请求

```js
const refreshToken = localStorage.getItem("refreshToken");
if (refreshToken) {
  return axios
    .post("/api/refresh-token", { refreshToken })
    .then((response) => {
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      // 重新发起之前失败的请求
      return instance(config);
    })
    .catch((error) => {
      // 如果刷新 Token 失败，可能需要跳转到登录页面等处理
      console.error("Refresh token failed:", error);
      window.location.href = "/login";
    });
} else {
  // 如果没有刷新 Token，直接跳转到登录页面
  window.location.href = "/login";
}
```

这里假设服务器在验证刷新 Token 有效后会返回一个新的访问 Token，将新 Token 存储到本地存储中，然后重新发起之前因为 Token 过期而失败的请求。
