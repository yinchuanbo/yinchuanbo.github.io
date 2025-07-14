const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const frontMatter = require("front-matter");
const chokidar = require("chokidar");

const app = express();
const PORT = process.env.PORT || 3000;
const srcDir = path.join(__dirname, "src");
const docDir = path.join(__dirname, "doc");
const templatePath = path.join(__dirname, "templates", "template.html");
const indexTemplatePath = path.join(__dirname, "templates", "index.html");

// 设置静态文件目录
app.use(express.static(docDir));

// 读取模板文件
const template = fs.readFileSync(templatePath, "utf8");
const indexTemplate = fs.existsSync(indexTemplatePath)
  ? fs.readFileSync(indexTemplatePath, "utf8")
  : `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>灏天阁</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <main>
        <ul class="home-articles-list">
          {{{articleList}}}
        </ul>
      </main>
    </body>
    </html>
  `;

// 编译单个 Markdown 文件到 HTML
async function compileMarkdown(filePath) {
  try {
    const marked = (await import("marked")).marked;
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { attributes, body } = frontMatter(fileContent);
    // 确保 attributes 存在并提供默认值
    const title = attributes.title || "无标题";
    const category = attributes.category || "未分类";
    let dateStr = attributes.date;
    if (dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dateStr = `${year}.${month}.${day}`;
    } else {
      dateStr = "未知日期";
    }

    const date = dateStr;

    const htmlContent = marked(body);

    // 替换模板中的占位符
    let output = template
      .replace(/{{title}}/g, title)
      .replace(/{{category}}/g, category)
      .replace(/{{date}}/g, date)
      .replace(/{{{content}}}/g, htmlContent);

    // 生成输出文件名
    const outputFileName = path.basename(filePath, ".md") + ".html";
    const outputPath = path.join(docDir, outputFileName);

    // 确保 doc 目录存在
    fs.ensureDirSync(docDir);
    fs.writeFileSync(outputPath, output);
    console.log(`已生成：${outputPath}`);

    // 更新 index.html
    await generateIndex();
  } catch (error) {
    console.error(`处理 ${filePath} 时出错:`, error);
  }
}

// 生成 index.html，列出所有文章
async function generateIndex() {
  try {
    const files = fs.readdirSync(srcDir).filter((file) => file.endsWith(".md"));
    let articleList = "";
    const categorySet = new Set();
    const articles = [];

    // 收集所有文章信息
    for (const file of files) {
      const filePath = path.join(srcDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { attributes } = frontMatter(fileContent);
      const htmlFileName = path.basename(file, ".md") + ".html";
      const title = attributes.title || "无标题";
      const category = attributes.category || "未分类";
      let date = attributes.date ? new Date(attributes.date) : new Date(0);

      articles.push({
        title,
        category,
        date,
        htmlFileName,
      });
      categorySet.add(category);
    }

    // 按日期倒序排序
    articles.sort((a, b) => b.date - a.date);

    // 生成文章列表
    articles.forEach((article, index) => {
      const dateStr =
        article.date.getTime() > 0
          ? `${article.date.getFullYear()}.${String(
              article.date.getMonth() + 1
            ).padStart(2, "0")}.${String(article.date.getDate()).padStart(
              2,
              "0"
            )}`
          : "未知日期";

      articleList += `<li data-category="${article.category}"><a href="/${article.htmlFileName}">${article.title} <span class="article-date">${dateStr}</span></a></li>`;
    });

    // 生成分类按钮
    let categoryFilter = `<button class="category-btn" data-category="all">全部</button>`;
    Array.from(categorySet)
      .sort()
      .forEach((cat) => {
        categoryFilter += `\n<button class="category-btn" data-category="${cat}">${cat}</button>`;
      });

    // 替换 index 模板中的占位符
    const indexContent = indexTemplate
      .replace("{{{articleList}}}", articleList)
      .replace("{{{categoryFilter}}}", categoryFilter);
    fs.writeFileSync(path.join(docDir, "index.html"), indexContent);
    console.log(`已生成：${path.join(docDir, "index.html")}`);
  } catch (error) {
    console.error("生成 index.html 时出错:", error);
  }
}

// 编译所有 Markdown 文件
async function compileAllMarkdown() {
  try {
    fs.ensureDirSync(docDir);
    const files = fs.readdirSync(srcDir).filter((file) => file.endsWith(".md"));
    for (const file of files) {
      await compileMarkdown(path.join(srcDir, file));
    }
  } catch (error) {
    console.error("编译所有 Markdown 文件时出错:", error);
  }
}

// 监听 src 目录的变化
chokidar
  .watch(srcDir, { ignored: /(^|[\/\\])\../ })
  .on("all", async (event, filePath) => {
    if (filePath.endsWith(".md")) {
      console.log(`检测到文件变化：${filePath} (${event})`);
      await compileMarkdown(filePath);
    }
  });

// 根路由
app.get("/", (req, res) => {
  const indexPath = path.join(docDir, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res
      .status(404)
      .send(
        "Index page not found. Please ensure Markdown files exist in src/ and try again."
      );
  }
});

// 初始编译所有 Markdown 文件
compileAllMarkdown();

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
