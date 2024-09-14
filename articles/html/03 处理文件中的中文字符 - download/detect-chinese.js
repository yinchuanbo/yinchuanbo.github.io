const fs = require("fs");
const path = require("path");

const type = "ejs"; // js, css, or ejs
const chineseRegex = /[\u4e00-\u9fa5]/;

function getFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(
      (file) =>
        file.endsWith(".js") || file.endsWith(".css") || file.endsWith(".ejs")
    )
    .map((file) => path.join(dir, file));
}

function checkFileForChineseCharacters(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const chineseLines = [];

  if (type === "ejs") {
    lines.forEach((line, index) => {
      // Split the line into parts: before EJS tag, EJS tag content, after EJS tag
      const parts = line.split(/<%.*?%>/);

      parts.forEach((part, partIndex) => {
        // Check for HTML comments in each part
        if (part.includes("<!--")) {
          const commentContent = part.split("<!--")[1].split("-->")[0];
          if (chineseRegex.test(commentContent)) {
            chineseLines.push({ lineNumber: index + 1, content: line.trim() });
          }
        }

        // Check for EJS comments
        if (partIndex % 2 === 1 && part.startsWith("#")) {
          if (chineseRegex.test(part)) {
            chineseLines.push({ lineNumber: index + 1, content: line.trim() });
          }
        }
      });
    });
  } else {
    lines.forEach((line, index) => {
      if (chineseRegex.test(line)) {
        chineseLines.push({ lineNumber: index + 1, content: line.trim() });
      }
    });
  }

  if (chineseLines.length > 0) {
    console.log(`文件 ${filePath} 包含 ${chineseLines.length} 行中文字符:`);
    chineseLines.forEach(({ lineNumber, content }) => {
      console.log(
        `  第 ${lineNumber} 行: ${content.slice(0, 50)}${
          content.length > 50 ? "..." : ""
        }`
      );
    });
    return true;
  }
  return false;
}

function main(directory) {
  console.log(`检查目录: ${directory}`);
  let files = getFiles(directory);
  files = files.filter((file) => !file.includes(".min."));
  console.log(`找到 ${files.length} 个 ${type.toUpperCase()} 文件\n`);

  let filesWithChineseCharacters = 0;
  files.forEach((file) => {
    if (checkFileForChineseCharacters(file)) {
      filesWithChineseCharacters++;
    }
  });

  console.log(`\n检查完成。`);
  console.log(
    `总计 ${files.length} 个文件中有 ${filesWithChineseCharacters} 个文件包含中文字符。`
  );
}

const langs = ["ar", "de", "en", "es", "fr", "it", "jp", "kr", "pt", "tw"];
for (let i = 0; i < langs.length; i++) {
  const lan = langs[i];
  const targetDirectory = `./${lan}/${type}`;
  main(targetDirectory);
}
