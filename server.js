const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const frontMatter = require("front-matter");
const chokidar = require("chokidar");

const app = express();
const PORT = process.env.PORT || 3003;
const srcDir = path.join(__dirname, "src");
const docDir = path.join(__dirname, "doc");
const templatePath = path.join(__dirname, "templates", "template.html");
const specialTemplatePath = path.join(__dirname, "templates", "special-template.html");
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
async function compileMarkdown(filePath, isSpecial = false, specialDir = '') {
  try {
    const marked = (await import("marked")).marked;
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { attributes, body } = frontMatter(fileContent);
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
    const htmlContent = marked(body);
    let output;
    if (isSpecial) {
      output = `
        <header>
          <h1>${title}</h1>
          <p>${category} | ${dateStr}</p>
        </header>
        ${htmlContent}
      `;
    } else {
      output = template
        .replace(/{{title}}/g, title)
        .replace(/{{category}}/g, category)
        .replace(/{{date}}/g, dateStr)
        .replace(/{{{content}}}/g, htmlContent);
    }
    const outputFileName = path.basename(filePath, ".md") + ".html";
    const outputDir = isSpecial ? path.join(docDir, specialDir) : docDir;
    fs.ensureDirSync(outputDir);
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, output);
    if (!isSpecial) {
      await generateIndex();
    }
  } catch (error) {
    console.error(`处理 ${filePath} 时出错:`, error);
  }
}

async function generateSpecialPage(specialDir) {
  const specialPath = path.join(srcDir, specialDir);
  const files = fs.readdirSync(specialPath).filter(file => file.endsWith(".md"));
  let list = '';
  for (const file of files) {
    const filePath = path.join(specialPath, file);
    await compileMarkdown(filePath, true, specialDir);
    const title = frontMatter(fs.readFileSync(filePath, "utf8")).attributes.title || "无标题";
    const htmlFile = path.basename(file, ".md") + ".html";
    list += `<li><a href="#" data-url="/${specialDir}/${htmlFile}">${title}</a></li>`;
  }
  const specialTemplate = fs.readFileSync(specialTemplatePath, "utf8");
  const output = specialTemplate
    .replace(/{{title}}/g, specialDir)
    .replace(/{{{list}}}/g, list);
  const outputPath = path.join(docDir, `${specialDir}.html`);
  fs.writeFileSync(outputPath, output);
}

async function generateIndex() {
  try {
    let articleList = '';
    const categorySet = new Set();
    const articles = [];
    const specials = [];
    const items = fs.readdirSync(srcDir);
    for (const item of items) {
      const itemPath = path.join(srcDir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        specials.push(item);
      } else if (item.endsWith(".md")) {
        const fileContent = fs.readFileSync(itemPath, "utf8");
        const { attributes } = frontMatter(fileContent);
        const htmlFileName = path.basename(item, ".md") + ".html";
        const title = attributes.title || "无标题";
        const category = attributes.category || "未分类";
        let date = attributes.date ? new Date(attributes.date) : new Date(0);
        articles.push({ title, category, date, htmlFileName });
        categorySet.add(category);
      }
    }
    articles.sort((a, b) => b.date - a.date);
    articles.forEach(article => {
      const dateStr = article.date.getTime() > 0 ? `${article.date.getFullYear()}.${String(article.date.getMonth() + 1).padStart(2, "0")}.${String(article.date.getDate()).padStart(2, "0")}` : "未知日期";
      articleList += `<li data-category="${article.category}"><a href="/${article.htmlFileName}">${article.title}</a></li>`;
    });
    specials.forEach(special => {
      articleList += `<li data-category="special"><a href="/${special}.html">${special}</a></li>`;
    });
    let categoryFilter = `<button class="category-btn" data-category="all">全部</button>`;
    categoryFilter += `\n<button class="category-btn" data-category="special">专题</button>`;
    Array.from(categorySet).sort().forEach(cat => {
      categoryFilter += `\n<button class="category-btn" data-category="${cat}">${cat}</button>`;
    });
    
    const indexContent = indexTemplate
      .replace("{{{articleList}}}", articleList)
      .replace("{{{categoryFilter}}}", categoryFilter);
    fs.writeFileSync(path.join(docDir, "index.html"), indexContent);
  } catch (error) {
    console.error("生成 index.html 时出错:", error);
  }
}

async function compileAllMarkdown() {
  try {
    fs.ensureDirSync(docDir);
    const items = fs.readdirSync(srcDir);
    for (const item of items) {
      const itemPath = path.join(srcDir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        await generateSpecialPage(item);
      } else if (item.endsWith(".md")) {
        await compileMarkdown(itemPath);
      }
    }
    await generateIndex();
  } catch (error) {
    console.error("编译所有 Markdown 文件时出错:", error);
  }
}

// 监听 src 目录的变化
chokidar
  .watch(srcDir, { ignored: /(^|[\\\/])\../ })
  .on("all", async (event, filePath) => {
    if (filePath.endsWith(".md")) {
      const relative = path.relative(srcDir, filePath);
      const parts = relative.split(path.sep);
      if (parts.length > 1) {
        await compileMarkdown(filePath, true, parts[0]);
        await generateSpecialPage(parts[0]);
      } else {
        await compileMarkdown(filePath);
      }
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
