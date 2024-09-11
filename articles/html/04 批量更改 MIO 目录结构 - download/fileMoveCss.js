const fs = require("fs");
const request = require("sync-request");
const cheerio = require("cheerio");
const path = require("path");
const langs = ["ar", "de", "en", "es", "fr", "it", "jp", "kr", "pt", "tw"];

let resources = [],
  filenameSet = new Set();

langs.forEach((lan) => {
  filenameSet = new Set();
  const ejsDir = path.join(".", lan, "ejs");
  const cssDir = path.join(".", lan, "dist", "css");
  const devSssDir = path.join(".", lan, "dev", "scss");
  const jsDir = path.join(".", lan, "dist", "js");

  if (!fs.existsSync(devSssDir)) {
    fs.mkdirSync(devSssDir, { recursive: true });
  }


  const deleteMapFiles = (dirPath) => {
    try {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (path.extname(file) === ".map") {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${filePath}`);
          } catch (err) {
            console.error(`Error deleting ${filePath}:`, err);
          }
        }
      });
    } catch (err) {
      console.error("Error reading directory:", err);
    }
  };

  deleteMapFiles(cssDir);
  deleteMapFiles(jsDir);

  const blogCheck = () => {
    const urls = [
      "https://www.miocreate.com/blog.html",
      "https://www.miocreate.com/blog/adult-chatbot-223.html",
      "https://www.miocreate.com/category/87.html",
    ];
    function fetchResourcesSync(urls) {
      const resourceSources = new Set();
      for (const url of urls) {
        try {
          const res = request("GET", url);
          const $ = cheerio.load(res.getBody());
          $("link[rel='stylesheet']").each((i, element) => {
            const href = $(element).attr("href");
            if (href && !href.includes("https://") && !href.startsWith("//")) {
              resourceSources.add(href);
            }
          });
        } catch (error) {
          console.error(`Error fetching ${url}:`, error.message);
        }
      }
      return Array.from(resourceSources);
    }
    resources = fetchResourcesSync(urls);
    // for (let i = 0; i < resources.length; i++) {
    //   const resourcePath = resources[i];
    //   if (!fs.existsSync(resourcePath)) {
    //     console.error(`在 blog.html 中找到不存在的资源引用: ${resourcePath}`);
    //   }
    // }
  };
  blogCheck();
  function getCssPathFromEjs() {
    const cssFileRegex =
      /<link\s+[^>]*href=["']([^"']+\.css(?:\?[^"']*)?)["']/g;
    function getEjsFiles(dir, files = []) {
      const items = fs.readdirSync(dir);
      items.forEach((item) => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          getEjsFiles(fullPath, files);
        } else if (item.endsWith(".ejs")) {
          files.push(fullPath);
        }
      });
      return files;
    }
    function extractCssPathsFromEjs(filePath) {
      const content = fs.readFileSync(filePath, "utf-8");
      const cssPaths = [];
      let match;
      while ((match = cssFileRegex.exec(content)) !== null) {
        cssPaths.push(match[1]);
      }
      return cssPaths;
    }
    function getAllUniqueCssPaths(ejsDir) {
      const ejsFiles = getEjsFiles(ejsDir);
      const cssPathSet = new Set();
      ejsFiles.forEach((file) => {
        const cssPaths = extractCssPathsFromEjs(file);
        cssPaths.forEach((cssPath) => cssPathSet.add(cssPath.split("?")[0])); // 去重
      });
      return Array.from(cssPathSet); // 转换为数组
    }
    const uniqueCssPaths = getAllUniqueCssPaths(ejsDir);
    const setData = [...new Set([...resources, ...uniqueCssPaths])];
    setData.forEach((item) => {
      const dir = path.basename(item);
      if (!filenameSet.has(dir)) {
        filenameSet.add(dir);
      }
    });
  }
  getCssPathFromEjs();
  filenameSet = [...filenameSet];
  filenameSet = filenameSet.filter((item) => !item.includes("swiper.min.css"));
  filenameSet = filenameSet.sort();
  let filenameObj = {};
  for (let i = 0; i < filenameSet.length; i++) {
    const element = filenameSet[i];
    const name = element.split(".")[0];
    const name01 = `${name}.min.css`;
    const name02 = `${name}.scss`;
    const name03 = `${name}.css`;
    const path01 = path.join(cssDir, name01);
    const path02 = path.join(cssDir, name02);
    const path03 = path.join(cssDir, name03);
    const fileArr = [];
    if (fs.existsSync(path01)) {
      fileArr.push(name01);
    }
    if (fs.existsSync(path02)) {
      fileArr.push(name02);
    }
    if (fs.existsSync(path03)) {
      fileArr.push(name03);
    }
    filenameObj[element] = fileArr;
  }
  let filenameObjCopy = JSON.parse(JSON.stringify(filenameObj));
  for (const key in filenameObj) {
    const val = filenameObj[key];
    const len = val.length;
    const bName = key.split(".")[0];
    if (len === 1) {
      const srcPath = path.join(cssDir, key);
      const destPath = path.join(devSssDir, `${bName}.scss`);
      fs.copyFileSync(srcPath, destPath);
      delete filenameObjCopy[key];
    } else if (len === 2) {
      const path01 = path.join(cssDir, `${bName}.scss`);
      const path02 = path.join(cssDir, `${bName}.css`);
      if (fs.existsSync(path01)) {
        const srcPath = path.join(cssDir, `${bName}.scss`);
        const destPath = path.join(devSssDir, `${bName}.scss`);
        fs.renameSync(srcPath, destPath);
      } else if (fs.existsSync(path02)) {
        const srcPath = path.join(cssDir, `${bName}.css`);
        const destPath = path.join(devSssDir, `${bName}.scss`);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
      delete filenameObjCopy[key];
    } else if (len === 3) {
      const srcPath = path.join(cssDir, `${bName}.scss`);
      const destPath = path.join(devSssDir, `${bName}.scss`);
      if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
        delete filenameObjCopy[key];
      }
      delete filenameObjCopy[key];
    }
  }
});
