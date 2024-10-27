---
title: "vite插件开发,项目版本号自增,自动压缩构建产物上传oss"
tag: "前端工程化"
time: 2024-09-15 12:50:54
---

## 1.项目版本号自增

> 每次项目写完打包前都要手动修改`package.json`里面的版本号,非常麻烦,借用`vite`插件来实现版本号自增

### 新建`autoIncrementVersion.js`文件

```ts
import { Plugin } from "vite";
import fs from "fs";
import path from "path";
//版本号自增
const incrementVersion = (version: string) => {
  const parts = version.split(".").map(Number);
  parts[2]++;
  if (parts[2] > 9) {
    parts[2] = 0;
    parts[1]++;
    if (parts[1] > 9) {
      parts[1] = 0;
      parts[0]++;
    }
  }
  return parts.join(".");
};

export default function autoIncrementVersion(): Plugin {
  return {
    name: "vite:autoIncrementVersion",
    apply: "build",
    //构建开始时的钩子
    buildStart(options) {
      if (options) {
        const pkg = JSON.parse(
          fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8")
        );
        pkg.version = incrementVersion(pkg.version);
        fs.writeFileSync(
          path.resolve(__dirname, "../package.json"),
          JSON.stringify(pkg, null, 2)
        );
      }
    },
  };
}
```

## 使用

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoIncrementVersion from "./vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), autoIncrementVersion()],
});
```

## 2.打包完成后自动压缩为`zip`文件,并且上传至`oss`

> 公司项目都是后端来部署的,前端开发完毕打包后需要上传到`oss`,后端只需要一个下载链接就 ok 了

```js
import { Plugin } from "vite";
import OSS from "ali-oss"; //阿里云oss
import path from "path";
import archiver from "archiver";
import fs from "fs";
//我们公司使用的是阿里云oss
const client = new OSS({
  region: "", // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
  accessKeyId: "", // 设置OSS_ACCESS_KEY_ID。
  accessKeySecret: "", // 设置OSS_ACCESS_KEY_SECRET。
  bucket: "", // 填写存储空间名称。
});
//压缩文件夹-上传
const compressFolder = (fileName: string) => {
  const output = fs.createWriteStream(`${__dirname}/../${fileName}.zip`);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", function () {
    const size = (archive.pointer() / 1024 / 1024).toFixed(2);
    console.log(`
          ----------------------------------------------------------
          ------                  压缩完成                    ------
          ------ 文件路径：项目根目录：${fileName}.zip     ------
          ------               文件大小${size}M                  ------
          ------                准备上传至oss                 ------
          ----------------------------------------------------------
      `);
    client
      .put(
        `/app2/zhong-ning/${fileName}.zip`,
        path.normalize(`${__dirname}/../${fileName}.zip`)
      )
      .then((res) => {
        const url = `https:**/${fileName}.zip`;
        console.log(`
          ----------------------------------------------------------
          ------                  上传成功                    ------
          ------                版本号${pkg.version}                   ------
          地址：${url}                 
          ----------------------------------------------------------
      `);
      });
  });

  archive.on("warning", function (err: { code: string }) {
    if (err.code === "ENOENT") {
    } else {
      throw err;
    }
  });

  archive.on("error", function (err: any) {
    throw err;
  });
  archive.pipe(output);
  /* 这里需要第二个参数fileName,否则是直接压缩文件夹里面的内容,不带文件夹 */
  archive.directory(fileName, fileName);
  archive.finalize();
};

export default function autoUploadZip(fileName: string): Plugin {
  return {
    name: "vite:autoUploadZip",
    apply: "build",
    enforce: "post",
    //服务器关闭时钩子
    closeBundle() {
      compressFolder(fileName);
    },
  };
}
```

### 使用

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoUploadZip from "./vite-plugins/autoUploadZip.ts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), autoUploadZip("打包文件夹名称")],
});
```

```sh
//控制台使出
✓ built in 18.30s

          ----------------------------------------------------------
          ------                  压缩完成                    ------
          ------        文件路径：项目根目录：**.zip           ------
          ------                文件大小***M                  ------
          ------                准备上传至oss                 ------
          ----------------------------------------------------------


          ----------------------------------------------------------
          ------                  上传成功                     ------
          ------                   版本号*.*.*                 ------
          地址：************************************************.zip
          ----------------------------------------------------------
```
