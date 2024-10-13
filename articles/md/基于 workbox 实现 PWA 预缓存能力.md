---
title: "基于 workbox 实现 PWA 预缓存能力"
tag: "Services Worker"
---

## 引言

Service Worker 是一项流行的技术，尽管在许多项目中尚未得到充分利用。基于本次项目首页加载优化的机会，决定尝试使用 Google 出品的 Workbox，以观察其优化效果。

## 开始

### 安装

项目使用 Webpack 打包，而 Workbox 提供了 Webpack 插件，因此只需执行 `npm i workbox-webpack-plugin --save-dev` 即可安装。

### 初始化配置

安装依赖后，需在原有项目中添加以下 Webpack 配置：

```js
const WorkboxPlugin = require("workbox-webpack-plugin");
module.exports = {
  // Other webpack config...
  plugins: [
    // Other plugins...
    new WorkboxPlugin.GenerateSW(), // 采用默认配置
  ],
};
```

然后在项目首页加入以下代码以注册 Service Worker：

```html
<script>
  // Check that service workers are registered
  if ("serviceWorker" in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener("load", () => {
      // navigator.serviceWorker.register('/sw.js');
      // 文档中用的是sw.js，实际上webpack生成的文件是service-worker.js
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
</script>
```

完成这些基本配置后，Service Worker 应该已经生效，会对 Webpack 打包的项目文件进行预缓存。

### 自定义配置

之前仅采用了 Workbox 的默认配置。具体的完整配置可参照 文档。这里仅介绍一些常用的简单自定义配置，配置使用 `key` -> `value` 形式传参：

```js
new WorkboxPlugin.GenerateSW({
  option: "value",
});
```

**swDest**

此参数指定 Webpack 生成的 `service-worker.js` 文件相对于 Webpack 输出目录的路径，默认值是 `service-worker.js`：

```js
new WorkboxPlugin.GenerateSW({
  swDest: "sw.js", // {output}/sw.js
});
```

**importWorkboxFrom**

此参数指定页面将从何处加载 Workbox 库文件，默认是 CDN，会从 Google Cloud 上获取依赖的文件。考虑到国内的网络环境，这里一般设置成 `local`，Webpack 会打包出依赖的文件，供页面加载时使用：

```js
new WorkboxPlugin.GenerateSW({
  importWorkboxFrom: "local",
});
```

**chunks**

此参数可以指定 Workbox 需要预缓存的 chunk，因为在预缓存阶段，如果文件数量太多，依然会占用浏览器请求并发数，可能导致其他请求被阻塞，因此对于较大型的项目，合理配置需要预缓存的文件是必要的：

```js
new WorkboxPlugin.GenerateSW({
  chunks: ["chunk1", "chunk2"],
});
```

**excludeChunks**

与 `chunks` 参数相反，这里指定不需要预缓存的文件。

**include**

此参数的功能与 `chunks` 类似，但通过正则表达式匹配需要预缓存的文件：

```js
new WorkboxPlugin.GenerateSW({
  // precache html和js文件
  include: [/.html$/, /.js$/],
});
```

**exclude**

与 `include` 相反。

**runtimeCaching**

以上配置针对的是预缓存，即在页面加载完后会自动去缓存一次的文件，而 `runtimeCaching` 针对的是在页面运行中发起的请求的缓存策略。

**urlPattern**

此参数是一个正则表达式，命中该规则的请求将被缓存下来：

```js
new WorkboxPlugin.GenerateSW({
  runtimeCaching: [
    {
      // 缓存所有图片
      urlPattern: /.(?:jpg|jpeg|svg|png)/,
    },
  ],
});
```

**handler**

此参数决定命中的请求使用什么缓存策略，可选的参数有 `networkFirst`、`networkOnly`、`cacheFirst`、`cacheOnly`、`staleWhileRevalidate`，分别代表：

- networkFirst：网络优先，即优先使用网络请求返回的结果，当网络请求失败时，尝试使用缓存结果。

- networkOnly：只使用网络请求结果，不使用缓存。

- cacheFirst：缓存优先，即优先使用缓存结果，缓存结果不存在时，尝试使用网络请求结果。

- cacheOnly: 只使用缓存结果。

- staleWhileRevalidate：有缓存的时候，优先使用缓存结果，同时获取新的网络请求结果，更新缓存。

  对于大部分情况，使用  `staleWhileRevalidate`  就可以了，其他情况根据自身业务的需求，合理使用  `networkFirst`  和  `cacheFirst`，`networkOnly`  和  `cacheOnly`  用的比较少。

```js
new WorkboxPlugin.GenerateSW({
  runtimeCaching: [
    {
      // 缓存所有图片
      urlPattern: /.(?:jpg|jpeg|svg|png)/,
      handler: "staleWhileRevalidate",
    },
  ],
});
```

- options

此参数是一个对象，其中包含了很多缓存相关的配置，这里不多说，直接看 文档。

## 需要注意的点

在完成上述配置后，如果幸运的话，可以直接使用了。不过第一次使用时，还是遇到了不少问题，很大的原因也是之前没用过 Service Worker，有些基本的知识不了解。官方也列出了一些常见的问题和解决方法，详见 常见问题。

### 本地调试

Service Worker 只有在 HTTPS 或者本地环境才能成功注册，也就是在本地开发时，需要使用 `127.0.0.1` 或者 `localhost` 来访问页面才行。

### service-worker.js 文件路径

在前面的配置中，我们注册的 `service-worker.js` 文件默认放在页面的根路径，即 `127.0.0.1/service-worker.js`，但是在我们项目里，静态文件打包后都放在 `public` 目录，也就是说访问 URL 是 `127.0.0.1/public/service-worker.js`，于是把注册的文件路径改成：

```html
<script>
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/public/service-worker.js");
    });
  }
</script>
```

这样 Service Worker 可以成功加载注册了，但是却发现很多资源都无法缓存，这是怎么回事？

原因是每个 Service Worker 都有自己的权限域，而这个域的范围依赖于注册文件的路径。如 `/public/service-worker.js` 注册的 Service Worker 的权限域在 `/public` 下，所以他只能缓存诸如 `127.0.0.1/public/a.png` 这种路径的资源，如 `127.0.0.1/b.png` 就无法缓存了。

要解决这个问题有 2 种方法：

- 为 `service-worker.js`  文件增加  `Service-Worker-Allowed='/'`  响应头，然后修改注册代码：

```js
navigator.serviceWorker.register("/blog/sw.js", { scope: "/" });
```

- 修改文件路径到根路径，在服务端对该文件重定向，因为我们项目用的是 Egg，所以这里配置下  `siteFile`  即可：

```js
config.siteFile = {
  "/service-worker.js": fs.readFileSync(
    path.join(appInfo.baseDir, "/public/service-worker.js")
  ),
};
```

### 跨域资源的缓存

官方文档 中有专门对这种情况的解释，说明了为什么跨域资源需要特殊处理。对于我们来说，针对跨域资源要做的就是在标签上加上 `crossorigin="anonymous"` 的属性：

```html
<link
  crossorigin="anonymous"
  rel="stylesheet"
  href="https://example.com/path/to/style.css"
/>
<img crossorigin="anonymous" src="https://example.com/path/to/image.png" />
```

然后缓存策略使用 `networkFirst` 或者 `staleWhileRevalidate`，最重要的是正则匹配规则需要匹配资源 URL 的头部，不然无法命中跨域资源：

```js
new WorkboxPlugin.GenerateSW({
  runtimeCaching: [
    {
      // To match cross-origin requests, use a RegExp that matches
      // the start of the origin:
      urlPattern: new RegExp("^https://cors.example.com/"),
      handler: "staleWhileRevalidate",
    },
  ],
});
```
