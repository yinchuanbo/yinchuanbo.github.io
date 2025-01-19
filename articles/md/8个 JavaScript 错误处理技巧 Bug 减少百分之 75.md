---
title: "8个 JavaScript 错误处理技巧 Bug 减少 75%"
tag: "JavaScript"
time: 2025-01-19 16:42:35
---

错误处理往往是最容易被忽视的环节，但恰恰是它决定了应用的健壮性和用户体验。分享 8 个实用的 JavaScript 错误处理技巧，帮助我们构建更可靠的应用程序。

## 1\. 使用 try-catch 包装异步代码

许多开发者认为 try-catch 只能处理同步代码，实际上通过适当的方式，它也能优雅地处理异步操作。

```js
// ❌ 错误示范
async function fetchUserData() {
  const response = await fetch("/api/users");
  const data = await response.json();
  return data;
}

// ✅ 正确示范
async function fetchUserData() {
  try {
    const response = await fetch("/api/users");
    const data = await response.json();
    return data;
  } catch (error) {
    // 区分不同类型的错误
    if (error instanceof TypeError) {
      console.error("网络请求失败:", error.message);
      // 可以选择重试或返回缓存数据
    } else {
      console.error("解析数据失败:", error.message);
    }
    // 返回默认值或者抛出自定义错误
    return [];
  }
}
```

## 2\. 实现全局错误处理器

全局错误处理可以捕获未被局部 try-catch 捕获的错误，是构建可靠应用的最后一道防线。

```js
// 处理普通JavaScript错误
window.onerror = function (message, source, lineno, colno, error) {
  console.error({
    message,
    source,
    lineno,
    colno,
    error: error?.stack,
  });
  // 向错误监控服务发送报告
  sendErrorReport({
    type: "js_error",
    details: { message, source, lineno, colno },
  });
  return true; // 防止错误继续向上传播
};

// 处理未捕获的Promise错误
window.addEventListener("unhandledrejection", function (event) {
  console.error("未处理的Promise错误:", event.reason);
  event.preventDefault(); // 阻止默认处理
});
```

## 3\. 自定义错误类型

创建自定义错误类型可以更好地区分和处理不同类别的错误。

<img src="../imgs/137/17.webp" />

## 4\. 优雅的错误降级处理

当遇到错误时，应该提供合理的降级方案，而不是让应用直接崩溃。

<img src="../imgs/137/18.webp" />

## 5\. 错误边界处理

在 React 应用中，使用错误边界可以防止整个应用因局部错误而崩溃。虽然普通 JavaScript 没有类似机制，但我们可以实现类似的隔离效果。

<img src="../imgs/137/19.webp" />

## 6\. 优化异步错误处理链

使用 Promise 链时，正确处理错误传播非常重要。

<img src="../imgs/137/20.webp" />

## 7\. 日志分级处理

建立合理的日志分级系统，可以更好地追踪和定位问题。

<img src="../imgs/137/21.webp" />

## 8\. 错误恢复机制

实现自动恢复机制，让应用在遇到错误后能够自动修复。

```js
class ServiceManager {
  constructor(services) {
    this.services = new Map(services);
    this.healthChecks = new Map();
    this.startMonitoring();
  }

  async startService(name) {
    try {
      const service = this.services.get(name);
      await service.start();
      this.monitorService(name);
    } catch (error) {
      console.error(`服务 ${name} 启动失败:`, error);
      this.attemptRecovery(name);
    }
  }

  monitorService(name) {
    const healthCheck = setInterval(async () => {
      try {
        const service = this.services.get(name);
        const isHealthy = await service.checkHealth();
        if (!isHealthy) {
          throw new Error("服务健康检查失败");
        }
      } catch (error) {
        this.handleServiceFailure(name, error);
      }
    }, 30000);

    this.healthChecks.set(name, healthCheck);
  }

  async handleServiceFailure(name, error) {
    console.error(`服务 ${name} 异常:`, error);

    // 停止健康检查
    clearInterval(this.healthChecks.get(name));
    this.healthChecks.delete(name);

    // 尝试重启服务
    await this.attemptRecovery(name);
  }

  async attemptRecovery(name, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`尝试恢复服务 ${name}，第 ${i + 1} 次`);
        await this.startService(name);
        console.log(`服务 ${name} 恢复成功`);
        return true;
      } catch (error) {
        console.error(`恢复尝试 ${i + 1} 失败:`, error);
        await new Promise((resolve) => setTimeout(resolve, 5000 * (i + 1)));
      }
    }
    console.error(`服务 ${name} 恢复失败，已达到最大重试次数`);
    return false;
  }
}
```
