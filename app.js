const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const marked = require("marked");

let tagsNav = {};

const articlesDir = path.join(__dirname, "articles/md");

function removeHtml(directoryPath = null) {
  try {
    const files = fs.readdirSync(directoryPath);
    files.forEach((file) => {
      if (path.extname(file) === ".html") {
        const filePath = path.join(directoryPath, file);
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error("操作失敗: " + err);
  }
}

function extractMetaData(content = "") {
  const titleMatch = content.match(/title:\s*"(.+)"/);
  const tagMatch = content.match(/tag:\s*"(.+)"/);
  const title = titleMatch ? titleMatch[1] : null;
  const tag = tagMatch ? tagMatch[1] : null;
  return { title, tag };
}

removeHtml(path.join(__dirname, "md"));

function getNavList(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      getNavList(filePath);
    } else {
      const fileName = path.basename(filePath);
      let content = fs.readFileSync(filePath, "utf8");
      const { tag } = extractMetaData(content);
      if (!tagsNav[tag]) {
        tagsNav[tag] = [fileName];
      } else {
        tagsNav[tag].push(fileName);
      }
    }
  });
}

function readMarkdownFilesSync(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      readMarkdownFilesSync(filePath);
    } else if (path.extname(file) === ".md") {
      const fileName = path.basename(filePath);
      let content = fs.readFileSync(filePath, "utf8");
      const { title, tag } = extractMetaData(content);
      content = content.replace(/---\s*[\s\S]*?---\s*/, "");
      content = content.trim();
      const mdHtml = marked.parse(content);
      handleEditTemp(fileName, mdHtml, title, tag);
    }
  });
}

function renderNavList(navList = [], filename = "") {
  const allList = navList.map((item, idx) => {
    return `<li class="${
      item.trim() === filename.trim() ? "active" : ""
    }"><a title="${item.replace(".md", "")}" href="/md/${item.replace(
      ".md",
      ".html"
    )}">${idx + 1 < 10 ? "0" + (idx + 1) : idx + 1} ${item.replace(
      ".md",
      ""
    )}</a></li>`;
  });
  return allList.join("");
}

function handleEditTemp(filename = "", html = "", title = "", tag = "") {
  const editPage = fs.readFileSync("./templates/edit.html", "utf-8");
  const navList = tagsNav[tag];
  const navHTML = renderNavList(navList, filename);
  const detailHTML = ejs.render(editPage, {
    filename,
    html,
    isMd: true,
    title,
    tag,
    navHTML,
  });
  const htmlName = `./md/${filename.replace("md", "html")}`;
  const outputFilePath = path.join(__dirname, htmlName);
  fs.writeFileSync(outputFilePath, detailHTML, "utf-8");
}

function renderHome() {
  const homeTemplateContent = fs.readFileSync(
    "./templates/index.html",
    "utf-8"
  );
  const homeOutputFilePath = path.join(__dirname, `./index.html`);
  const keys = Object.keys(tagsNav);
  let homeHTML = `<ul>`;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const first = tagsNav[key][0];
    homeHTML += `<li><a href="/md/${first.replace(
      ".md",
      ".html"
    )}">${key}</a></li>`;
  }
  homeHTML += `</ul>`;
  const homeTempHTML = ejs.render(homeTemplateContent, {
    list: homeHTML,
  });
  fs.writeFileSync(homeOutputFilePath, homeTempHTML, "utf-8");
}

getNavList(articlesDir);
readMarkdownFilesSync(articlesDir);
renderHome();
