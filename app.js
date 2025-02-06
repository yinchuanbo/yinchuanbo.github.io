const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const marked = require("marked");
const { execSync } = require("child_process");

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
  const timeMatch = content.match(/time:\s*(.+)/); // 移除了双引号
  const title = titleMatch ? titleMatch[1] : null;
  const tag = tagMatch ? tagMatch[1] : null;
  const time = timeMatch ? timeMatch[1].trim() : null; // trim 去掉前后空格
  return { title, tag, time };
}

removeHtml(path.join(__dirname, "md"));

const getFileFirstCommitDate = (filePath) => {
  try {
    const command = `git log --reverse --format=%ai -- "${filePath}"`;
    const output = execSync(command, { cwd: articlesDir }).toString().trim();
    const firstCommitDate = output.split("\n")[0];
    const time = firstCommitDate ? new Date(firstCommitDate) : new Date();
    const formattedDate = formatDate(time);
    return formattedDate;
  } catch (error) {
    const time = new Date();
    const formattedDate = formatDate(time);
    return formattedDate;
  }
};

function getNavList(dir) {
  const files = fs.readdirSync(dir);
  // for (let i = 0; i < files.length; i++) {
  //   const file = files[i];
  //   const time = getFileFirstCommitDate(file);
  //   console.log(time);
  //   const filePath = path.join(articlesDir, file)
  //   const data = fs.readFileSync(filePath, 'utf8');
  //   const updatedData = data.replace(/(tag:\s*".*?")/, `$1\ntime: ${time}`);
  //   fs.writeFileSync(filePath, updatedData, 'utf8');
  // }
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
      const { title, tag, time } = extractMetaData(content);
      content = content.replace(/---\s*[\s\S]*?---\s*/, "");
      content = content.trim();
      const mdHtml = marked.parse(content);
      handleEditTemp(fileName, mdHtml, title, tag, time);
    }
  });
}

const formatDate = (date) => {
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
};

function renderNavList(navList = [], filename = "") {
  navList.sort((b, a) => {
    const aPath = path.join(articlesDir, a);
    const bPath = path.join(articlesDir, b);
    let aContent = fs.readFileSync(aPath, "utf8");
    const { time: aTime } = extractMetaData(aContent);
    let bContent = fs.readFileSync(bPath, "utf8");
    const { time: bTime } = extractMetaData(bContent);
    return new Date(bTime) - new Date(aTime);
  });

  let allList = navList.map((item, idx) => {
    return `<li class="${
      item.trim() === filename.trim() ? "active" : ""
    }"><a title="${item.replace(".md", "")}" href="/md/${item.replace(
      ".md",
      ".html"
    )}"><span>${idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}</span> ${item.replace(
      ".md",
      ""
    )}</a></li>`;
  });
  allList = allList.reverse();
  return allList.join("");
}

function handleEditTemp(
  filename = "",
  html = "",
  title = "",
  tag = "",
  time = ""
) {
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
    time,
    mode: "",
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
  const homeOutputFilePath = path.join(__dirname, `./md/index.html`);
  const sortedEntries = Object.entries(tagsNav).sort(
    (a, b) => b[1].length - a[1].length
  );

  // 转换回对象
  tagsNav = Object.fromEntries(sortedEntries);
  const keys = Object.keys(tagsNav);
  let homeHTML = `<ul>`;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const first = tagsNav[key].at(-1);
    homeHTML += `<li class="card"><a href="/md/${first.replace(
      ".md",
      ".html"
    )}">${key}(${tagsNav[key]?.length})</a></li>`;
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
