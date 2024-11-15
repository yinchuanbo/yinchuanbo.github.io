---
title: "Node 获取整站所有 scss 文件并输出内容"
tag: "NodeJS"
time: 2024-11-15 20:13:01
---

```js
const fs = require("fs");
const path = require("path");
const glob = require("glob"); // 使用同步方法，不需要解构

// 使用同步 glob 查找所有 SCSS 文件
const files = glob.sync("**/*.scss");
files.forEach((filePath) => {
  const absolutePath = path.resolve(filePath);
  console.log("Processing file:", absolutePath);

  // 读取每个 SCSS 文件内容
  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // 获取反转后的 SCSS 内容
    const reversedScss = transformScssToArabicStyle(data);

    // 组合原始 SCSS 和阿拉伯样式 SCSS
    const finalScss = `${data}\n\n[lang='ar'] {\n${reversedScss}\n}`;

    // 将新的 SCSS 内容写入文件
    fs.writeFile(absolutePath, finalScss, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Successfully updated:", absolutePath);
      }
    });
  });
});

// 处理 SCSS 转换（反转样式规则）
function transformScssToArabicStyle(scssContent) {
  // 这里简单反转 SCSS 的规则，实际上可以做更精细的操作
  const reversedScss = scssContent.split("\n").reverse().join("\n");
  return reversedScss;
}
```
