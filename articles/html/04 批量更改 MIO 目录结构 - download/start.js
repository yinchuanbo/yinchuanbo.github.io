const chokidar = require("chokidar");
const liveServer = require("live-server");
const sass = require("node-sass");
const { minify } = require("terser");
var ejs = require("ejs");
const path = require("path");
const fs = require("fs").promises;
const fs2 = require("fs");

const langs = ["ar", "de", "en", "es", "fr", "it", "jp", "kr", "pt", "tw"];

const compressAndObfuscate = async (filePath, curLan = "") => {
  const pathArr = filePath.split("\\");
  const filename = pathArr[pathArr.length - 1];
  const name = filename.split(".");
  try {
    delete require.cache[require.resolve(`./${curLan}/dist/lan/index.js`)];
    let jsonData = require(`./${curLan}/dist/lan/index.js`);
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
        const htmlPath = path.join(__dirname, `./${curLan}/${name[0]}.html`);
        fs2.writeFileSync(htmlPath, result);
      }
    );
  } catch (error) {
    console.error(`${filePath} 编译时出错：`, error);
  }
};

async function asyncEs6Json(curLan = "") {
  delete require.cache[require.resolve(`./${curLan}/dist/lan/index.js`)];
  let jsonData = require(`./${curLan}/dist/lan/index.js`);
  await fs.writeFile(
    path.join(`./`, `./${curLan}/dist/lan/es6.js`),
    `var jsonData = ${JSON.stringify(
      jsonData,
      null,
      2
    )}; export default jsonData`
  );
  await fs.writeFile(
    path.join(`./`, `./${curLan}/dist/lan/normal.js`),
    `var jsonData = ${JSON.stringify(jsonData, null, 2)}`
  );
}

function getAllFilePaths(dirPath) {
  const files = fs2.readdirSync(dirPath);
  const filePaths = [];
  for (const file of files) {
    const filePath = `${dirPath}/${file}`;
    if (fs2.statSync(filePath).isDirectory()) {
      filePaths.push(...getAllFilePaths(filePath));
    } else {
      filePaths.push(filePath);
    }
  }
  return filePaths;
}

const compileSCSS = (filePath, curLan = "") => {
  return new Promise((resolve, reject) => {
    const outputFilePath = path.join(
      `./${curLan}/dist/css`,
      path.basename(filePath).replace(".scss", ".css")
    );
    sass.render(
      {
        file: filePath,
        outputStyle: "compressed",
        outFile: outputFilePath,
      },
      (error, result) => {
        if (!error) {
          fs.writeFile(outputFilePath, result.css)
            .then(() => {
              console.log(`SCSS 文件 ${filePath} 编译成功！`);
              resolve();
            })
            .catch((error) => {
              console.error(
                `写入编译后的 SCSS 文件 ${outputFilePath} 时出错：`,
                error
              );
              reject(error);
            });
        } else {
          console.error(`编译 SCSS 文件 ${filePath} 时出错：`, error);
          reject(error);
        }
      }
    );
  });
};

const compressJS = async (filePath, curLan = "") => {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const minified = await minify(fileContent);
    let originalFileName = null;
    originalFileName = path.basename(filePath, path.extname(filePath));
    if (originalFileName === "blogDetail") {
      originalFileName = `blogDetail.js`;
    } else {
      originalFileName = `${originalFileName}.min.js`;
    }
    await fs.writeFile(
      path.join(`./${curLan}/dist/js`, originalFileName),
      minified.code
    );
    console.log(`文件 ${filePath} 压缩和混淆成功！`);
  } catch (error) {
    console.error(`压缩和混淆文件 ${filePath} 时出错：`, error);
  }
};

const noWatchList = [
  "bottom-message",
  "credits",
  "pay",
  "share-dialog",
  "popup",
  "confirm-dialog",
  "commonSignin",
];

for (let i = 0; i < langs.length; i++) {
  let curPort = 6170;
  curPort += i;
  const lan = langs[i];
  const ejsSourceDir = `./${lan}/ejs`;
  const jsSourceDir = `./${lan}/dev/js`;
  const scssSourceDir = `./${lan}/dist/css`;
  const watcher = chokidar.watch([ejsSourceDir, jsSourceDir, scssSourceDir], {
    ignoreInitial: true,
  });
  watcher.on("change", async (filePath) => {
    if (filePath.endsWith(".ejs") && !filePath.includes("components")) {
      await compressAndObfuscate(filePath, lan);
    } else if (
      filePath.endsWith(".js") &&
      filePath.includes("dist") &&
      !filePath.includes(".min")
    ) {
      try {
        const folders = filePath.split("\\");
        const parentFolder = folders[folders.length - 2];
        if (!noWatchList.includes(parentFolder)) {
          await compressJS(filePath, lan);
        }
      } catch (e) {
        console.log(e);
      }
    } else if (filePath.endsWith(".scss") && filePath.includes("dist")) {
      try {
        await compileSCSS(filePath, lan);
      } catch (e) {
        console.log(e);
      }
    }
  });
  fs2.watchFile(`./${lan}/dist/lan/index.js`, async (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      const filePaths = getAllFilePaths(ejsSourceDir);
      for (let i = 0; i < filePaths.length; i++) {
        let p = filePaths[i];
        if (p.endsWith(".ejs") && !p.includes("components")) {
          p = p.replace(/\//g, "\\");
          await asyncEs6Json(lan);
          await compressAndObfuscate(p, lan);
        }
      }
      console.log("执行完成");
    }
  });
  var params = {
    port: curPort,
    host: "0.0.0.0",
    root: `./${lan}`,
    open: false
  };
  liveServer.start(params);
}
