const fs = require("fs");
const fs2 = require("fs").promises;
const path = require("path");
const { minify } = require("terser");

const langs = ["ar", "de", "en", "es", "fr", "it", "jp", "kr", "pt", "tw"];

langs.forEach((curLan) => {
  const srcDir = path.join(".", curLan, "dist", "js");
  const destDir = path.join(".", curLan, "dev", "js");

  const specialFiles = ["lottie-player.js"];

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const compressJS = async (filePath) => {
    try {
      const fileContent = await fs2.readFile(filePath, "utf-8");
      const minified = await minify(fileContent);
      let originalFileName = null;
      originalFileName = path.basename(filePath, path.extname(filePath));
      if (originalFileName === "blogDetail") {
        originalFileName = `blogDetail.js`;
      } else {
        originalFileName = `${originalFileName}.min.js`;
      }
      await fs2.writeFile(path.join(srcDir, originalFileName), minified.code);
    } catch (error) {
      console.error(`压缩和混淆文件 ${filePath} 时出错：`, error);
    }
  };

  fs.readdir(srcDir, (err, files) => {
    if (err) {
      console.error("读取源文件夹出错:", err);
      return;
    }
    files.forEach((file) => {
      if (path.extname(file).toLowerCase() === ".js") {
        const srcFilePath = path.join(srcDir, file);
        let destFilePath = path.join(destDir, file);
        if (specialFiles.includes(file)) {
          const newFileName = `${file.split(".")[0]}.min.js`;
          const newSrcFilePath = path.join(srcDir, newFileName);
          fs.renameSync(srcFilePath, newSrcFilePath);
        } else if (!file.includes(".min.")) {
          fs.rename(srcFilePath, destFilePath, (err) => {
            if (err) {
              console.error(`移动文件 ${file} 出错:`, err);
            } else {
              const currentPath = `${destDir}\\${file}`;
              compressJS(currentPath);
            }
          });
        }
      }
    });
  });
});
