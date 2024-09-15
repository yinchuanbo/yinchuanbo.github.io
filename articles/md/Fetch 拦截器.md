---
title: "Fetch 拦截器"
tag: "Request"
---

```js
// 定义需要统一设置的请求头
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
  // 添加其他需要的默认头部
};

// 定义不需要添加默认头部的URL模式
const EXCLUDE_PATTERNS = [
  /^https?:\/\/external-api\.com/, // 外部API
  /\.(jpg|png|gif|svg)$/, // 图片请求
];

// 检查URL是否匹配排除模式
function shouldExclude(url) {
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(url));
}

// 获取认证令牌的函数（根据您的认证机制来实现）
function getAuthToken() {
  return localStorage.getItem("authToken"); // 示例实现
}

if (window.fetch) {
  const originalFetch = window.fetch;

  window.fetch = function (input, options = {}) {
    let url = input;
    if (input instanceof Request) {
      url = input.url;
      options = { ...options, ...input };
    }

    // 如果URL不在排除列表中，添加默认头部
    if (!shouldExclude(url)) {
      options.headers = {
        ...DEFAULT_HEADERS,
        ...options.headers,
      };

      // 添加认证令牌（如果存在）
      const authToken = getAuthToken();
      if (authToken) {
        options.headers["Authorization"] = `Bearer ${authToken}`;
      }
    }

    // 在发送请求前的钩子
    if (typeof window.onBeforeFetch === "function") {
      const modifiedOptions = window.onBeforeFetch(url, options);
      if (modifiedOptions) {
        options = modifiedOptions;
      }
    }

    return originalFetch(input, options)
      .then((response) => {
        // 在收到响应后的钩子
        if (typeof window.onAfterFetch === "function") {
          window.onAfterFetch(url, response);
        }

        // 处理 HTTP 错误
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
      })
      .catch((error) => {
        // 在发生错误时的钩子
        if (typeof window.onFetchError === "function") {
          window.onFetchError(url, error);
        }

        throw error;
      });
  };
}

// 使用示例
window.onBeforeFetch = (url, options) => {
  console.log(`Preparing to fetch: ${url}`);
  // 可以在这里修改 options
  return options;
};

window.onAfterFetch = (url, response) => {
  console.log(`Received response from: ${url}, status: ${response.status}`);
};

window.onFetchError = (url, error) => {
  console.error(`Error fetching ${url}:`, error);
};
```
