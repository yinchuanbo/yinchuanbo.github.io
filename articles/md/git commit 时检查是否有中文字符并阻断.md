---
title: "git commit 时检查是否有中文字符并阻断"
tag: "Git"
---

## 安装 Husky

```sh
npm install husky --save-dev
```

## 初始化 Husky

```sh
npx husky install
```

## 新增 ./chinese-character-check.js

```js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const chineseRegex = /[\u4e00-\u9fa5]/;

const extensions = [".js", ".css", ".ejs"];

const stagedFiles = execSync(
  "git diff --cached --name-only --diff-filter=ACM",
  { encoding: "utf-8" }
)
  .split("\n")
  .filter((file) => file.trim() !== "")
  .filter(
    (file) =>
      extensions.includes(path.extname(file)) &&
      !file.includes("chinese-character-check")
  );

let hasChineseCharacters = false;

stagedFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    if (chineseRegex.test(line)) {
      console.error(`发现中文字符: ${file}:${index + 1}`);
      console.error(`> ${line.trim()}`);
      hasChineseCharacters = true;
    }
  });
});

if (hasChineseCharacters) {
  console.error("错误: 发现中文字符。请移除这些字符后再次提交。");
  process.exit(1);
} else {
  console.log("检查通过：没有发现中文字符。");
}
```

## 修改 .husky\\_\pre-commit

```sh
#!/bin/sh
. "$(dirname "$0")/husky.sh"

node chinese-character-check.js

if [ $? -ne 0 ]; then
  exit 1
fi
```