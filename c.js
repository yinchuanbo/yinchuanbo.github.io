const fs = require("fs").promises;
const path = require("path");

async function getMaxNumberFromMarkdownFiles() {
  try {
    const files = await fs.readdir(path.join(__dirname, "src"));
    const mdFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".md"
    );
    const numbers = mdFiles
      .map((file) => {
        const nameWithoutExt = path.basename(file, ".md");
        return parseInt(nameWithoutExt, 10);
      })
      .filter((num) => !isNaN(num));
    if (numbers.length === 0) {
      return null;
    }
    return Math.max(...numbers);
  } catch (error) {
    console.error("Error reading files:", error);
    throw error;
  }
}

const createNewMd = async (nameNum = 0) => {
  try {
    const newMdName = `${nameNum}.md`;
    const filePath = path.join(__dirname, "src", newMdName);
    const content = `---
title: 
category: 
date: 
---`;

    // 写入文件
    await fs.writeFile(filePath, content, "utf8");
    console.log(`成功创建文件: ${newMdName}`);
    return newMdName;
  } catch (error) {
    console.error("创建文件失败:", error);
    throw error;
  }
};

getMaxNumberFromMarkdownFiles()
  .then((maxNumber) => {
    createNewMd(maxNumber + 1);
  })
  .catch((error) => {
    console.error("处理失败:", error);
  });
