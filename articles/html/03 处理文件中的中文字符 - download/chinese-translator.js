const fs = require("fs");
const path = require("path");
const { translate } = require("@vitalets/google-translate-api");

// 简单的内存缓存
const translationCache = new Map();

// 延迟函数
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 获取目录下的JS和CSS文件（不包括子目录）
function getFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(
      (file) =>
        file.endsWith(".js") || file.endsWith(".css") || file.endsWith(".ejs")
    )
    .map((file) => path.join(dir, file));
}

// 带重试的翻译函数
async function translateWithRetry(text, retries = 3, delayMs = 1000) {
  if (translationCache.has(text)) {
    return translationCache.get(text);
  }
  for (let i = 0; i < retries; i++) {
    try {
      const result = await translate(text, { to: "en" });
      translationCache.set(text, result.text);
      return result.text;
    } catch (error) {
      console.error(`Translation error (attempt ${i + 1}): ${error.message}`);
      if (i < retries - 1) {
        console.log(`Retrying in ${delayMs / 1000} seconds...`);
        await delay(delayMs);
        delayMs *= 2; // 指数退避
      } else {
        console.error("Max retries reached. Skipping this translation.");
        return text; // 返回原文
      }
    }
  }
}

// 翻译中文字符为英文
async function translateChinese(content) {
  const chineseRegex = /[\u4e00-\u9fa5]+/g;
  let match;
  let promises = [];
  let matches = [];

  while ((match = chineseRegex.exec(content)) !== null) {
    const chineseText = match[0];
    matches.push(match);
    promises.push(translateWithRetry(chineseText));
  }

  const translations = await Promise.all(promises);
  translations.forEach((translation, index) => {
    const match = matches[index];
    content = content.replace(match[0], translation);
  });

  return content;
}

// 处理单个文件
async function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    content = await translateChinese(content);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

// 主函数
async function main(directory) {
  let files = getFiles(directory);
  // files = files.filter((file) => !file.includes(".min."));
  for (const file of files) {
    await processFile(file);
    await delay(1000); // 在处理文件之间添加延迟
  }
  console.log("All files processed.");
}

// 运行处理多个语言目录
const langs = ["ar", "de", "en", "es", "fr", "it", "jp", "kr", "pt", "tw"];
for (let i = 0; i < langs.length; i++) {
  const lan = langs[i];
  const targetDirectory = `./${lan}/dist/js`;
  main(targetDirectory);
}
