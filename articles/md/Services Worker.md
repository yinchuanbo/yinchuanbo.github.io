---
title: "Services Worker"
tag: "Services Worker"
---

Service Worker 是一个强大的工具，可以让我们精确控制缓存和网络请求，从而提高网站性能和离线体验。下面是一个详细的实施方案：

## service-worker.js

```js
const CACHE_VERSION = "v1.0.0";
const CACHE_NAME = `my-site-cache-${CACHE_VERSION}`;

// 需要缓存的资源列表
const CACHE_URLS = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/scripts/main.js",
  "/images/logo.png",
  // 添加其他需要缓存的资源
];

// 安装事件：缓存核心资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// 激活事件：清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 请求拦截
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 如果在缓存中找到了响应，则返回缓存的版本
      if (cachedResponse) {
        // 对于 HTML 页面，我们总是去网络获取最新版本
        if (event.request.headers.get("accept").includes("text/html")) {
          return fetchAndCache(event.request);
        }
        return cachedResponse;
      }

      // 如果缓存中没有找到，则从网络获取
      return fetchAndCache(event.request);
    })
  );
});

// 从网络获取资源并缓存
function fetchAndCache(request) {
  return fetch(request).then((response) => {
    // 检查是否是有效的响应
    if (!response || response.status !== 200 || response.type !== "basic") {
      return response;
    }

    // 克隆响应，因为响应流只能被读取一次
    const responseToCache = response.clone();

    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, responseToCache);
    });

    return response;
  });
}

// 处理推送通知
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/images/icon.png",
    badge: "/images/badge.png",
  };

  event.waitUntil(
    self.registration.showNotification("Update Available", options)
  );
});

// 处理通知点击事件
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

// 后台同步
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});

// 模拟数据同步函数
function syncData() {
  return fetch("/api/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lastSync: new Date().toISOString(),
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Sync failed");
    })
    .then((data) => {
      // 处理同步成功的情况
      console.log("Sync successful", data);
    })
    .catch((error) => {
      // 处理同步失败的情况
      console.error("Sync failed", error);
    });
}

// 定期更新缓存
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-cache") {
    event.waitUntil(updateCache());
  }
});

// 更新缓存函数
function updateCache() {
  return caches.open(CACHE_NAME).then((cache) => {
    return Promise.all(
      CACHE_URLS.map((url) => {
        return fetch(url).then((response) => {
          if (!response || response.status !== 200) {
            throw new Error(`Failed to fetch ${url}`);
          }
          return cache.put(url, response);
        });
      })
    );
  });
}
```

1. 注册 Service Worker： 在您的主 JavaScript 文件中，添加以下代码来注册 Service Worker：

```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registered: ", registration);
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}
```

2. 缓存策略：

   - 核心静态资源（如 CSS、JS、图片）在 Service Worker 安装时被缓存。
   - HTML 页面总是从网络获取最新版本，以确保内容始终是最新的。
   - 其他资源首先尝试从缓存获取，如果缓存中没有，则从网络获取并缓存。

3. 缓存更新：

   - 当 Service Worker 更新时（CACHE_VERSION 改变），旧的缓存会被清理。
   - 使用 Periodic Sync API 定期更新缓存（需要浏览器支持）。

4. 推送通知： Service Worker 可以接收推送通知，并显示给用户。要使用这个功能，您需要：
   - 获取用户的订阅权限
   - 将订阅发送到您的服务器
   - 从服务器发送推送消息

```js
// 在您的应用中请求通知权限
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("Notification permission granted.");
  }
});
```

5. 后台同步：Service Worker 可以在网络恢复时执行后台同步操作。要使用这个功能：

```js
// 在您的应用中注册同步事件
navigator.serviceWorker.ready.then((registration) => {
  registration.sync.register("sync-data");
});
```

6. 定期同步：Service Worker 可以定期执行任务，如更新缓存。要使用这个功能（需要浏览器支持）：

```js
// 在您的应用中注册周期性同步
navigator.serviceWorker.ready.then((registration) => {
  registration.periodicSync.register("update-cache", {
    minInterval: 24 * 60 * 60 * 1000, // 一天
  });
});
```

7. 版本控制：

   - 更新 CACHE_VERSION 常量来触发新的 Service Worker 安装和旧缓存的清理。
   - 可以实现一个版本检查机制，在检测到新版本时提示用户刷新页面。

8. 错误处理： Service Worker 包含了基本的错误处理。在实际应用中，您可能需要更复杂的错误处理和日志记录机制。

9. 调试：
   - 使用 Chrome 开发者工具的 Application 标签页来调试 Service Worker。
   - 使用 `chrome://serviceworker-internals/` 来查看详细的 Service Worker 信息。

10. 注意事项：
    - Service Worker 只能在 HTTPS 环境下运行（除了 localhost）。
    - 确保 Service Worker 文件的路径正确，通常应该放在网站的根目录。
    - 定期检查并更新 CACHE_URLS 列表，确保所有重要资源都被缓存。

这个 Service Worker 实现提供了一个强大的起点，可以显著提高您网站的性能和可靠性。根据您的具体需求，您可能需要进一步定制和优化这个实现。例如，您可能需要添加更复杂的缓存策略，实现更细粒度的版本控制，或者集成分析和监控功能。
