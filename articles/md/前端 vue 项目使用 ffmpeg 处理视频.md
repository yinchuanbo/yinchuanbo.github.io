---
title: "前端 vue 项目使用 ffmpeg 处理视频"
tag: "Vue"
time: 2024-11-03 13:44:50
---

## 前言

最近的一项需求要求前端支持视频压缩，并能够播放 .avi 格式的视频。因为浏览器本身并不支持 .avi 格式的视频播放，所以在上传之前需要将其转换为 .mp4 格式。本文将介绍如何实现视频的压缩和转码功能。

## 项目主要依赖

- vite: 3.0.1
- @ffmpeg/ffmpeg: 0.12.7
- @ffmpeg/util: 0.12.1
- @ffmpeg/core: 0.12.6

## Vite 配置

```js
export default defineConfig({
 ...
  optimizeDeps: { exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'] },
 ...
})
```

## FFmpeg 资源文件处理

复制 `node_modules` 下的 `@ffmpeg/core` `esm` 目录到项目外层的 public 下, `esm` 目录包含 `ffmpeg-core.js`、`ffmpeg-core.wasm`两个文件。public 目录下的文件不会被构建工具处理，这些文件将保持原样被复制到构建输出目录。

## 使用 Pinia 维护 FFmpeg 实例

由于 ffmpeg 资源包很大(约 30M)，组件第一次使用时，或者组件卸载后重新渲染，都需要重新加载资源，因此为了节省时间，我们使用 Pinia 来维护一个全局唯一的 ffmpeg 实例。有个特殊情况是，同时有多个页面都用到这功能, 当前页的视频还在处理中，未完成就切换路由到其它页面需要调用`ffmpeg.terminate()`终止掉之前的, 而终止后是需要重新调`FFmpeg.load()`加载资源的。

API: [ffmpegwasm.netlify.app/docs/api/ff…](https://ffmpegwasm.netlify.app/docs/api/ffmpeg/classes/ffmpeg/#terminate)

## FFmpeg Store 定义

```js
//store/ffmpeg.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export const useFFmpegStore = defineStore("ffmpeg", () => {
  const ffmpeg = new FFmpeg();
  const ffmpegLoaded = ref(false);
  const processStatus = ref("idle");
  const baseURL = import.meta.env.BASE_URL;
  const coreURL = `${baseURL}esm/ffmpeg-core.js`;
  const wasmURL = `${baseURL}esm/ffmpeg-core.wasm`;
  const videoUrl = ref("");
  const progressPercent = ref(0);

  // 默认命令行参数
  const defaultCommands = [
    "-i",
    "input.mp4",
    "-c:v",
    "libx264",
    "-b:v",
    "1000k",
    "-crf",
    "32",
    "-preset",
    "ultrafast",
    "-c:a",
    "aac",
    "-ar",
    "44100",
    "-ab",
    "128k",
    "output.mp4",
  ];

  let _loadPromise = null;

  // 加载 FFmpeg
  const loadFfmpeg = async () => {
    if (!ffmpegLoaded.value && !_loadPromise) {
      _loadPromise = ffmpeg
        .load({
          coreURL: `${window.location.origin}${coreURL}`,
          wasmURL: `${window.location.origin}${wasmURL}`,
        })
        .then(() => {
          ffmpegLoaded.value = true;
        });
    }
    await _loadPromise;
  };

  // 监听进度
  ffmpeg.on("progress", ({ progress }) => {
    progressPercent.value = progress * 100;
  });

  // 处理视频
  const processVideo = async (file, config = {}) => {
    try {
      processStatus.value = "processing";
      await loadFfmpeg();

      const commands =
        Array.isArray(config.commands) && config.commands.length
          ? config.commands
          : defaultCommands;
      const inputFileName = commands[1];
      const outputFileName = commands[commands.length - 1];

      if (file.type.includes("avi") && !/\.avi$/.test(inputFileName)) {
        commands[1] = "input.avi";
      }

      await ffmpeg.writeFile(commands[1], await fetchFile(file));
      await ffmpeg.exec(commands);
      const data = await ffmpeg.readFile(outputFileName);
      const processedFile = new File(
        [data],
        file.name.replace(/\.avi$/, ".mp4"),
        { type: "video/mp4" }
      );

      // blob:http:// 开头的视频地址
      videoUrl.value = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );

      processStatus.value = "done";
      return processedFile;
    } catch (error) {
      console.error(error);
      processStatus.value = "error";
    }
  };

  // 重置状态
  const resetState = () => {
    if (ffmpeg.loaded && processStatus.value === "processing") {
      ffmpeg.terminate();
      _loadPromise = null;
      ffmpegLoaded.value = false;
    }
    processStatus.value = "idle";
    videoUrl.value = "";
    progressPercent.value = 0;
  };

  return {
    ffmpeg,
    ffmpegLoaded,
    videoUrl,
    processStatus,
    progressPercent,
    loadFfmpeg,
    processVideo,
    resetState,
  };
});
```

## useFFmpeg hook 简易封装

```js
// hooks/useFFmpeg.js
import { onUnmounted, onDeactivated } from "vue";
import { storeToRefs } from "pinia";
import { useFFmpegStore } from "@/store/ffmpeg";

export default function useFFmpeg() {
  const ffmpegStore = useFFmpegStore();
  const { processVideo, resetState } = ffmpegStore;
  // 使用 storeToRefs 确保解构出来的状态变量是响应式的
  const { ffmpeg, ffmpegLoaded, videoUrl, processStatus, progressPercent } =
    storeToRefs(ffmpegStore);

  onDeactivated(() => {
    resetState();
  });

  onUnmounted(() => {
    resetState();
  });

  return {
    ffmpeg,
    ffmpegLoaded,
    videoUrl,
    processStatus,
    progressPercent,
    processVideo,
    resetState,
  };
}
```

## 在主入口文件预加载 FFmpeg

由于资源包比较大，所以一开始预加载资源，方便后续操作。如果在使用压缩/转码功能的时候，资源包还没加载完，可以通过 判断`ffmpegLoaded`状态提示 “正在加载视频转码或压缩所需的资源文件...”，

```js
//main.js
import { useFFmpegStore } from "@/store/ffmpeg";

const ffmpegStore = useFFmpegStore();
ffmpegStore
  .loadFfmpeg()
  .then(() => {
    console.log("FFmpeg loaded successfully");
  })
  .catch((error) => {
    console.error("Failed to load FFmpeg:", error);
  });
```

## 组件中的使用示例

这里使用 `ant-design-vue` 的 upload 组件作为例子。我们可以在上传前通过 beforeUpload 钩子处理视频，处理完成后自动上传。对于小于 100MB 的 .mp4 文件，直接上传；对于 .avi 文件或大于 100MB 的 .mp4 文件，则进行压缩和格式转换。目前只支持处理单个视频，因为只有一个 ffmpeg 实例。

```js
import useFFmpeg from "@/hooks/useFFmpeg";

const { ffmpegLoaded, processStatus, progressPercent, processVideo } =
  useFFmpeg();

const handleBeforeUpload = async (file) => {
  const sizeLimit = 100 * 1024 * 1024; // 100 MB
  if (
    (file.size > sizeLimit && file.type.includes("mp4")) ||
    file.type.includes("avi")
  ) {
    return await processVideo(file);
  }
  return file;
};
```

## 遇到的问题及解决方法

在实际开发过程中遇到了一些问题，例如 `ffmpeg.load` 方法会阻塞后续代码的执行且无法捕获错误。通过将 `Vite` 版本从 `2.9.9` 升级到 `3.0.1` 解决了这个问题。

另外，在线上环境中，`ffmpeg-core.wasm` 文件的请求类型变成了普通的 fetch 类型，而不是预期的 wasm 类型。这是因为 Nginx 默认没有正确识别 .wasm 文件的 MIME 类型。解决方法是在 Nginx 配置中添加对 .wasm 文件的支持：

```nginx
server {
    listen       80;
    server_name  localhost;

    # 新增的 location 块，专门处理所有 .wasm 文件
    location ~* /myproject/esm/.*\.wasm$ {
        alias /usr/share/nginx/html/myproject/esm;
        types {
            application/wasm wasm;
        }
        default_type application/wasm;
    }
}
```

## 总结

在本项目中，我们实现了前端视频压缩和格式转换的功能。然而，需要注意的是，我这个需求的最大可上传视频大小为 200M。对于太大的视频，客户端处理并不合适。在实际测试中，尝试在本地开发环境压缩一个 500M 左右的视频，需要 10 多分钟的时间。视频压缩/转码是一个计算密集型任务，需要大量的 CPU 计算能力。由于客户端设备资源有限，因此对于大视频的处理，建议在服务器端进行，以保证处理速度和用户体验。
