const fs = require("fs").promises;
const path = require("path");
const https = require("https");
const http = require("http");
const crypto = require("crypto");

// 下载图片并返回保存的文件名，支持重定向
async function downloadImage(url, outputDir, redirects = 0, maxRedirects = 5) {
  const protocol = url.startsWith("https") ? https : http;
  const fileExt = path.extname(url.split("?")[0]) || ".png"; // 获取扩展名，默认为 .png
  const fileName = crypto.createHash("md5").update(url).digest("hex") + fileExt; // 使用 URL 的 MD5 作为文件名
  const filePath = path.join(outputDir, fileName);

  try {
    // 检查文件是否已存在
    await fs.access(filePath);
    console.log(`图片已存在: ${fileName}`);
    return fileName;
  } catch {
    // 文件不存在，下载图片
    return new Promise((resolve, reject) => {
      protocol
        .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (response) => {
          // 处理重定向
          if (
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            if (redirects >= maxRedirects) {
              return reject(new Error(`重定向次数过多: ${url}`));
            }
            console.log(`重定向: ${url} -> ${response.headers.location}`);
            return downloadImage(
              response.headers.location,
              outputDir,
              redirects + 1,
              maxRedirects
            )
              .then(resolve)
              .catch(reject);
          }

          if (response.statusCode !== 200) {
            return reject(
              new Error(`下载失败: ${url}, 状态码: ${response.statusCode}`)
            );
          }

          const fileStream = require("fs").createWriteStream(filePath);
          response.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            console.log(`下载成功: ${fileName}`);
            resolve(fileName);
          });
        })
        .on("error", (err) => {
          reject(new Error(`下载图片失败: ${url}, 错误: ${err.message}`));
        });
    });
  }
}

// 处理 Markdown 文件
async function processMarkdownFile(mdFileName) {
  try {
    // 确保输出目录存在
    const outputDir = path.join(__dirname, "doc", "images");
    await fs.mkdir(outputDir, { recursive: true });

    // 读取 Markdown 文件
    const mdFilePath = path.join(__dirname, "src", mdFileName);
    let mdContent = await fs.readFile(mdFilePath, "utf8");

    // 正则表达式匹配 Markdown 图片语法 ![alt](url)
    const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
    const imageUrls = [];
    let match;

    // 提取所有图片 URL
    while ((match = imageRegex.exec(mdContent)) !== null) {
      imageUrls.push({ alt: match[1], url: match[2] });
    }

    if (imageUrls.length === 0) {
      console.log("未找到远程图片地址");
      return;
    }

    // 下载图片并替换 URL
    for (const { url } of imageUrls) {
      try {
        const fileName = await downloadImage(url, outputDir);
        const localPath = `../images/${fileName}`;
        // 替换 Markdown 中的图片 URL
        mdContent = mdContent.replace(url, localPath);
      } catch (error) {
        console.error(`处理图片失败: ${url}, 跳过: ${error.message}`);
        continue; // 跳过失败的图片，继续处理下一个
      }
    }

    // 写回修改后的 Markdown 文件
    await fs.writeFile(mdFilePath, mdContent, "utf8");
    console.log(`已更新 Markdown 文件: ${mdFileName}`);
  } catch (error) {
    console.error("处理失败:", error.message);
    throw error;
  }
}

// 示例：处理指定的 Markdown 文件
const mdFileName = `${process.argv[2] || "90"}.md`; // 替换为目标文件名
processMarkdownFile(mdFileName)
  .then(() => console.log("处理完成"))
  .catch((error) => console.error("错误:", error));
