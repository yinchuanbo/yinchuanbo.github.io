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

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const createNewMd = async (nameNum = 0) => {
  try {
    const newMdName = `${nameNum}.md`;
    const filePath = path.join(__dirname, "src", newMdName);
    const content = `---
title: 
category: 
date: ${getCurrentDateTime()}
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
