---
title: "使用 vite 如何开启 gzip 压缩"
tag: "前端工程化"
time: 2024-10-19 16:20:31
---

## 使用 vite 如何开启 gzip 压缩

在 Vite 中启用 GZIP 压缩并不是默认功能，但你可以通过使用插件来实现这一目标。

下面是一个使用 `vite-plugin-compression` 插件的例子，这个插件允许你在 Vite 项目中启用 GZIP 压缩。

首先，你需要安装 `vite-plugin-compression` 插件。打开你的终端并运行以下命令：

```sh
npm install --save-dev vite-plugin-compression
```

接着，你可以在 `vite.config.js` 文件中配置插件。如果你还没有这个文件，你需要创建一个。以下是配置示例：

```js
// vite.config.js
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    compression({
      verbose: true, // 输出压缩日志
      disable: false, // 是否禁用压缩
      threshold: 10240, // 对超过10KB的文件进行压缩
      algorithm: "gzip", // 使用gzip压缩
      ext: ".gz", // 压缩后文件的扩展名
    }),
  ],
});
```

在这个例子中，我们启用了 GZIP 压缩，并设置了几个选项：

- `verbose: true` 表示会在控制台输出压缩信息。

- `disable: false` 确保插件不会被禁用。

- `threshold: 10240` 指定只有大于 10KB 的文件才会被压缩。

- `algorithm: 'gzip'` 指定使用 GZIP 压缩算法。

- `ext: '.gz'` 设置压缩后的文件扩展名为 `.gz`。

现在当你运行 `vite build` 命令时，Vite 将会压缩符合条件的文件，并在构建输出目录中生成 `.gz` 文件。

请注意，上述配置仅适用于生产环境的构建。在开发环境下，Vite 并不会自动发送 GZIP 压缩的文件，因为开发服务器通常不支持这样的功能。为了在开发环境中支持 GZIP 压缩，你可能需要使用支持 GZIP 的开发服务器，或者配置代理到支持 GZIP 的服务器。

如果你希望在开发环境中也启用 GZIP 压缩，可以考虑使用其他插件，例如 `vite-plugin-gzip-dev` 或者手动设置服务器中间件来处理 GZIP 请求。不过，通常来说在开发环境中使用 GZIP 压缩并不常见，因为它可能会增加开发服务器的复杂性，并且对于开发过程来说没有必要。
