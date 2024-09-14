const fs = require("fs");
const path = require("path");
const request = require("sync-request");
const cheerio = require("cheerio");
const ejs = require("ejs");

const langs = ["ar", "de", "en", "es", "fr", "it", "jp", "kr", "pt", "tw"];

langs.forEach((lan) => {
  const ejsDir = path.join(".", lan, "ejs");
  const cssDir = path.join(".", lan, "dist", "css");
  const jsDir = path.join(".", lan, "dist", "js");
  const imgDir = path.join(".", lan, "dist", "img");

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
          $("script").each((i, element) => {
            const src = $(element).attr("src");
            if (src && !src.includes("https://") && !src.startsWith("//")) {
              resourceSources.add(`./${lan}${src}`);
            }
          });
          $("link[rel='stylesheet']").each((i, element) => {
            const href = $(element).attr("href");
            if (href && !href.includes("https://") && !href.startsWith("//")) {
              resourceSources.add(`./${lan}${href}`);
            }
          });
        } catch (error) {
          console.error(`Error fetching ${url}:`, error.message);
        }
      }
      return Array.from(resourceSources);
    }
    const resources = fetchResourcesSync(urls);
    for (let i = 0; i < resources.length; i++) {
      const resourcePath = resources[i];
      if (!fs.existsSync(resourcePath)) {
        console.error(`在 blog.html 中找到不存在的资源引用: ${resourcePath}`);
      }
    }
  };
  blogCheck();

  const read01 = fs.readdirSync(ejsDir);
  if (read01?.length) {
    for (let i = 0; i < read01.length; i++) {
      const file = read01[i];
      if (path.extname(file).toLowerCase() === ".ejs") {
        const ejsFilePath = path.join(ejsDir, file);
        checkResourceReferences(ejsFilePath, cssDir, jsDir, imgDir);
      }
    }
  }
  const read02 = fs.readdirSync(ejsDir);
  if (read02?.length) {
    for (let i = 0; i < read02.length; i++) {
      const file = read02[i];
      if (path.extname(file).toLowerCase() === ".ejs") {
        const ejsFilePath = path.join(ejsDir, file);
        checkResourceReferences(ejsFilePath, cssDir, jsDir, imgDir, true);
        compressAndObfuscate(ejsFilePath);
      }
    }
  }

  // 编译 ejs
  async function compressAndObfuscate(filePath) {
    const pathArr = filePath.split("\\");
    const filename = pathArr[pathArr.length - 1];
    const name = filename.split(".");
    try {
      delete require.cache[require.resolve(`./${lan}/dist/lan/index.js`)];
      let jsonData = require(`./${lan}/dist/lan/index.js`);
      const templatePath = path.join(__dirname, filePath);
      ejs.renderFile(
        templatePath,
        {
          ...jsonData,
          faceSSwap: JSON.stringify(jsonData.faceSwap),
          allData: JSON.stringify(jsonData),
          voice_Generator: JSON.stringify(jsonData.voiceGenerator),
        },
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          const htmlPath = path.join(__dirname, `./${lan}/${name[0]}.html`);
          fs.writeFileSync(htmlPath, result);
        }
      );
    } catch (error) {
      console.error(`${filePath} 编译时出错：`, error);
    }
  }

  function checkResourceReferences(
    ejsFilePath,
    cssDir,
    jsDir,
    imgDir,
    isHas = false
  ) {
    const ejsContent = fs.readFileSync(ejsFilePath, "utf8");
    const ejsContentWithoutComments = removeCommentedBlocks(ejsContent);
    const cssRegex = /href="(.*?\.css)"/g;
    checkResourceExistence(
      ejsFilePath,
      cssRegex,
      cssDir,
      ejsContentWithoutComments,
      isHas
    );
    const jsRegex = /src="(.*?\.js)"/g;
    checkResourceExistence(
      ejsFilePath,
      jsRegex,
      jsDir,
      ejsContentWithoutComments,
      isHas
    );
    const imgRegex = /src="(.*?\.(?:jpg|jpeg|png|gif|svg))"/g;
    checkResourceExistence(
      ejsFilePath,
      imgRegex,
      imgDir,
      ejsContentWithoutComments,
      isHas
    );
  }

  function handleMatch(match, path) {
    const resourcePath = match.split('"')[1];
    let filep = resourcePath;
    if (resourcePath.startsWith("/dist/")) {
      filep = `./${lan}${resourcePath}`;
    } else if (resourcePath.startsWith("../dist/")) {
      filep = `./${lan}${resourcePath.replace("../dist/", "/dist/")}`;
    } else if (resourcePath.startsWith("../../dist/")) {
      filep = `./${lan}${resourcePath.replace("../../dist/", "/dist/")}`;
    } else if (resourcePath.startsWith("./img/")) {
      filep = `./${lan}${resourcePath.replace("./img/", "/dist/img/")}`;
    } else if (
      resourcePath.startsWith("https://") ||
      resourcePath.startsWith("http://") ||
      resourcePath.startsWith("//")
    ) {
      filep = "";
    }
    return filep;
  }
  function checkResourceExistence(
    ejsFilePath,
    regex,
    resourceDir,
    ejsContent,
    isHas = false
  ) {
    let matches = ejsContent.match(regex);
    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const filep = handleMatch(match, ejsFilePath);
        if (filep && !fs.existsSync(filep)) {
          if (isHas) {
            console.error(`在 ${ejsFilePath} 中找到不存在的资源引用: ${filep}`);
          } else {
            if (!filep.includes(".min.")) {
              const fileNameWithExt = path.basename(filep);
              editEjsScript(ejsFilePath, fileNameWithExt);
            }
          }
        }
      }
    }
  }
});

function removeCommentedBlocks(content) {
  let cleanedContent = content.replace(/\/\*[\s\S]*?\*\//g, "");
  cleanedContent = cleanedContent.replace(/<!--[\s\S]*?-->/g, "");
  return cleanedContent;
}

function editEjsScript(ejsPath = "", filename = "") {
  if (!ejsPath || filename.includes(".min.")) return false;
  const ejsFilePath = ejsPath;
  const jsFileName = filename;
  let fileContent = fs.readFileSync(ejsFilePath, "utf8");
  const escapedJsFileName = jsFileName.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&"
  );
  const scriptRegex = new RegExp(
    `(<script\\s+[^>]*src=["'].*?${escapedJsFileName}["'][^>]*><\\/script>)`,
    "g"
  );
  fileContent = fileContent.replace(scriptRegex, (match) => {
    return match.replace(jsFileName, jsFileName.replace(".js", ".min.js"));
  });
  try {
    fs.writeFileSync(ejsFilePath, fileContent, "utf8");
  } catch (error) {
    console.error(`Error writing the modified EJS file: ${error.message}`);
  }
}
