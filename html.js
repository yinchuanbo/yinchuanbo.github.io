const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const marked = require("marked");

const directoryPath = __dirname + "/html";

function deleteHtmlFilesInCurrentDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile() && path.extname(file) === ".html") {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${file}`);
      }
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

deleteHtmlFilesInCurrentDirectory(directoryPath);

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
];

const isImage = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
};

function svgToBase64(svgString) {
  return "data:image/svg+xml;base64," + btoa(svgString);
}
function getDirectoryStructure(dirPath) {
  const result = {};
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      result[item] = getDirectoryStructure(itemPath);
    } else {
      if (isImage(item)) {
        const fileContent = fs.readFileSync(itemPath);
        const base64Content = fileContent.toString("base64");
        if (itemPath.includes(".svg")) {
          result[item] = svgToBase64(fileContent);
        } else {
          result[item] = `data:image/${path
            .extname(item)
            .slice(1)};base64,${base64Content}`;
        }
      } else {
        if (!itemPath.includes(".zip")) {
          const fileContent = fs.readFileSync(itemPath, "utf-8");
          result[item] = fileContent;
          // if (itemPath.includes(".md")) {
          //   result[item] = marked.parse(fileContent);
          // } else {
          //   result[item] = fileContent;
          // }
        }
      }
    }
  });
  return result;
}

function getCodesDirectoryStructure() {
  const codesDirPath = path.join(__dirname, "articles/html");
  const codesDirs = fs.readdirSync(codesDirPath);
  const result = {};
  codesDirs.forEach((dir) => {
    const dirPath = path.join(codesDirPath, dir);
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) {
      result[dir] = getDirectoryStructure(dirPath);
    }
  });
  return result;
}

const structure = reorderFilesAndFolders(getCodesDirectoryStructure());

const templateContent = fs.readFileSync("./templates/edit-html.html", "utf-8");

function reorderFilesAndFolders(obj) {
  const directories = {};
  const files = [];

  // 遍历对象的 key
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // 递归处理子对象（目录）
        directories[key] = reorderFilesAndFolders(obj[key]);
      } else {
        // 非对象则是文件
        files.push({ [key]: obj[key] });
      }
    }
  }

  // 将目录和文件组合，目录在前，文件在后
  const result = { ...directories };
  files.forEach((file) => {
    const [fileName, fileContent] = Object.entries(file)[0];
    result[fileName] = fileContent;
  });

  return result;
}

let uniqueId = 0;

function convertToHTML(structure, parentPath = "") {
  let html = "<ul>";
  for (const key in structure) {
    if (structure.hasOwnProperty(key)) {
      uniqueId++;
      const currentPath = parentPath ? `${parentPath}/${key}` : key;
      if (typeof structure[key] === "object") {
        html += `<li><h3 class="isshow"><svg t="1725442620905" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21383" width="200" height="200"><path d="M256 298.666667l256 256 256-256 85.333333 85.333333-341.333333 341.333333-341.333333-341.333333z" fill="#999" p-id="21384"></path></svg><svg style="margin-right: 2px" t="1725526793251" class="icon" viewBox="0 0 1204 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5715" width="200" height="200"><path d="M561.63235285 164.57352927h335.01838211c27.29779432 0 49.63235285 22.33455854 49.63235366 49.63235284v62.04044147c0 27.29779432-22.33455854 49.63235285-49.63235366 49.63235284H561.63235285c-27.29779432 0-49.63235285-22.33455854-49.63235285-49.63235284v-62.04044147c0-27.29779432 22.33455854-49.63235285 49.63235285-49.63235284z" fill="#AFFCFE" p-id="5716"></path><path d="M983.50735284 933.875H189.38970568c-54.59558862 0-99.26470568-44.66911789-99.26470568-99.26470568V189.38970568c0-54.59558862 44.66911789-99.26470568 99.26470568-99.26470568h285.38602928c68.24448496 18.61213211 54.59558862 53.35477927 99.2647065 99.26470568l31.02021992 49.63235286H983.50735284c54.59558862 0 99.26470568 44.66911789 99.26470569 99.2647065v496.32352928c0 54.59558862-44.66911789 99.26470568-99.26470569 99.26470568z" fill="#2F77F1" p-id="5717"></path></svg>${key}</h3>${convertToHTML(
          structure[key],
          currentPath
        )}</li>`;
      } else {
        let hz = "";
        const hzJS = key.endsWith(".js");
        const hzHTML = key.endsWith(".html") || key.endsWith(".ejs");
        const hzCSS = key.endsWith(".css") || key.endsWith(".scss");
        const hzMD = key.endsWith(".md");
        const hzJSON = key.endsWith(".json");
        const hzImg = imageExtensions.includes("." + key.split(".").pop());
        if (hzMD) {
          hz = `<svg t="1723729102337" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22764" width="200" height="200"><path d="M456.32 433.216v227.712h49.792V362.304H456.32v0.512L350.976 468.16 246.144 363.264v-0.896h-49.792v298.624h49.792V433.664l104.96 104.96 35.2-35.2-0.128-0.064L456.32 433.216z m-328.256-294.4h768a64 64 0 0 1 64 64v618.624a64 64 0 0 1-64 64h-768a64 64 0 0 1-64-64V202.752a64 64 0 0 1 64-64z m581.76 427.968V362.304h-49.728v201.792L580.8 484.8l-35.2 35.2 140.8 140.8 35.2-35.2-0.064-0.064 105.6-105.664-35.2-35.2-82.048 82.112z" fill="#61A0FF" p-id="22765"></path></svg>`;
        }
        if (hzImg) {
          hz = `<svg t="1725442372551" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19228" width="200" height="200"><path d="M779.01824 107.56096a115.22048 115.22048 0 0 1 115.22048 115.22048v537.6a115.22048 115.22048 0 0 1-115.22048 115.22048H241.41824a115.22048 115.22048 0 0 1-115.22048-115.22048V222.8224a115.22048 115.22048 0 0 1 115.22048-115.22048h537.6z" fill="#D1EBC6" p-id="19229"></path><path d="M779.01824 107.56096a115.22048 115.22048 0 0 1 115.22048 115.22048v537.6a115.22048 115.22048 0 0 1-115.22048 115.22048H241.41824a115.22048 115.22048 0 0 1-115.22048-115.22048V222.8224a115.22048 115.22048 0 0 1 115.22048-115.22048h537.6z m0 57.58976H241.41824c-31.82592 0-57.63072 25.8048-57.63072 57.63072v537.6c0 31.82592 25.8048 57.58976 57.63072 57.58976h537.6c31.82592 0 57.58976-25.8048 57.58976-57.58976V222.8224c0-31.82592-25.8048-57.63072-57.58976-57.63072z" fill="#569C39" p-id="19230"></path><path d="M310.23104 430.08a28.79488 28.79488 0 0 1 39.60832 0.57344l323.13344 315.92448a28.79488 28.79488 0 0 1-40.26368 41.20576L348.5696 509.99296a28.79488 28.79488 0 0 0-39.60832-0.6144l-126.85312 116.65408-19.49696-21.21728a28.79488 28.79488 0 0 1 1.72032-40.67328l145.8176-134.144z" fill="#569C39" p-id="19231"></path><path d="M693.53472 498.4832L886.3744 667.648l-38.01088 43.29472-152.86272-134.18496-103.79264 100.59776-40.09984-41.3696 141.96736-137.54368zM560.08704 403.29216a65.29024 65.29024 0 1 0 0-130.58048 65.29024 65.29024 0 0 0 0 130.58048z m0 57.63072a122.88 122.88 0 1 0 0-245.84192 122.88 122.88 0 0 0 0 245.84192z" fill="#569C39" p-id="19232"></path></svg>`;
        }
        if (hzCSS) {
          hz = `<svg t="1725442252356" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14832" width="200" height="200"><path d="M512 512zM128.3 64.3l69.8 805.8 313.4 89.5L825.8 870l69.9-805.7H128.3z m580.9 669.3l-197.1 56.2-196.8-56.5L301.9 578h96.4l6.9 79.1 107.1 30.3 0.3 0.5h0.1l106.9-29.7L630.7 530H406.1l-8-99.9h241.1l8.8-101.9H280.2l-8-97.9H753l-43.8 503.3z" fill="#264DE4" p-id="14833"></path></svg>`;
        }
        if (hzHTML) {
          hz = `<svg t="1723728069970" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2156" width="200" height="200"><path d="M89.088 59.392l62.464 803.84c1.024 12.288 9.216 22.528 20.48 25.6L502.784 993.28c6.144 2.048 12.288 2.048 18.432 0l330.752-104.448c11.264-4.096 19.456-14.336 20.48-25.6l62.464-803.84c1.024-17.408-12.288-31.744-29.696-31.744H118.784c-17.408 0-31.744 14.336-29.696 31.744z" fill="#FC490B" p-id="2157"></path><path d="M774.144 309.248h-409.6l12.288 113.664h388.096l-25.6 325.632-227.328 71.68-227.328-71.68-13.312-169.984h118.784v82.944l124.928 33.792 123.904-33.792 10.24-132.096H267.264L241.664 204.8h540.672z" fill="#FFFFFF" p-id="2158"></path></svg>`;
        }
        if (hzJS) {
          hz = `<svg t="1725441988000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5301" width="200" height="200"><path d="M64 1024h960V576H64z" fill="#F4AF3D" fill-opacity=".7" p-id="5302"></path><path d="M448 64L192 320h256z" fill="#9AA7B0" fill-opacity=".8" p-id="5303"></path><path d="M512 64v320H192v128h640V64z" fill="#9AA7B0" fill-opacity=".8" p-id="5304"></path><path d="M153.28 869.632c14.72 16 28.352 26.368 57.088 26.368 33.664 0 45.632-26.368 45.632-44.928V640h64v229.632C320 916.48 276.928 960 220.8 960c-52.544 0-83.2-15.168-105.6-43.52l38.08-46.848zM446.272 736.128c0-23.616 19.904-32.128 55.808-32.128H576v-64H503.04C433.792 640 384 669.44 384 732.8c0 55.36 26.88 79.36 94.144 93.824 49.28 10.56 65.6 20.032 65.6 40.448 0 20.48-22.912 28.928-65.6 28.928H403.2v64h74.944C608 960 608 896 608 867.072c0-40.448-30.72-72.128-85.824-89.664-55.168-17.536-75.904-17.728-75.904-41.28z" fill="#231F20" fill-opacity=".7" p-id="5305"></path></svg>`;
        }
        if (hzJSON) {
          hz = `<svg t="1725524071646" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4511" width="200" height="200"><path d="M512 579.584a99.328 99.328 0 0 0-18.944 62.464 102.4 102.4 0 0 0 18.944 61.952 59.392 59.392 0 0 0 51.2 24.064 60.928 60.928 0 0 0 51.2-23.04 97.28 97.28 0 0 0 17.92-61.952 104.96 104.96 0 0 0-17.92-64 58.368 58.368 0 0 0-51.2-23.552 60.928 60.928 0 0 0-51.2 24.064z" fill="#3488F0" p-id="4512"></path><path d="M970.24 431.104H916.48V215.552L700.416 0H215.552a107.52 107.52 0 0 0-107.52 108.032v323.072H53.76A53.76 53.76 0 0 0 0 484.864v323.584a53.76 53.76 0 0 0 53.76 53.76h54.272v53.76A108.032 108.032 0 0 0 215.552 1024h592.896a108.032 108.032 0 0 0 107.52-108.032v-53.76h53.76A53.76 53.76 0 0 0 1024 808.448V484.864a53.76 53.76 0 0 0-53.76-53.76zM161.792 102.4A53.76 53.76 0 0 1 215.552 46.592h431.104V153.6a108.032 108.032 0 0 0 108.032 108.032h108.032v162.304H161.792z m527.872 537.088a138.24 138.24 0 0 1-35.328 98.304 120.32 120.32 0 0 1-92.16 37.888 119.296 119.296 0 0 1-90.624-36.352 131.072 131.072 0 0 1-34.816-94.208 139.776 139.776 0 0 1 35.84-99.328 122.368 122.368 0 0 1 94.208-38.4 115.712 115.712 0 0 1 89.6 36.864 135.68 135.68 0 0 1 33.28 95.232z m-347.648 44.544a168.448 168.448 0 0 0-47.616-25.6q-60.928-25.6-60.928-75.264a65.536 65.536 0 0 1 27.648-56.32 121.344 121.344 0 0 1 72.704-19.968 179.2 179.2 0 0 1 64 9.728v51.2a105.984 105.984 0 0 0-60.928-17.92 62.464 62.464 0 0 0-32.768 7.68 22.528 22.528 0 0 0-12.288 19.968 25.6 25.6 0 0 0 8.192 18.432 156.672 156.672 0 0 0 41.472 23.04 135.168 135.168 0 0 1 51.2 34.816 69.12 69.12 0 0 1 14.336 44.032 66.56 66.56 0 0 1-26.624 56.832 124.928 124.928 0 0 1-73.216 20.992 161.28 161.28 0 0 1-73.216-14.336v-55.296A108.544 108.544 0 0 0 307.2 732.16a60.416 60.416 0 0 0 33.792-7.68 23.552 23.552 0 0 0 11.264-19.968 28.16 28.16 0 0 0-10.24-20.48zM97.28 775.68a97.28 97.28 0 0 1-36.352-7.68v-51.2a51.2 51.2 0 0 0 32.768 10.752q39.936 0 39.936-60.416V512h55.296v157.696a117.248 117.248 0 0 1-23.552 78.848 84.992 84.992 0 0 1-68.096 27.136z m764.928 133.12a53.76 53.76 0 0 1-53.76 53.76H215.552a53.76 53.76 0 0 1-53.76-53.76V855.04h700.416z m102.4-137.728h-57.344l-110.08-167.936a192.512 192.512 0 0 1-12.288-20.992 409.6 409.6 0 0 1 0 41.472v147.456h-51.2V512h59.904l105.984 163.328 12.8 20.48a240.128 240.128 0 0 1 0-35.84V512h51.2z" fill="#3488F0" p-id="4513"></path></svg>`;
        }
        html += `<li data-id="${uniqueId}" data-path="${currentPath}">${hz}${key}</li>`;
      }
    }
  }
  html += "</ul>";
  return html;
}

let urls = [];

for (const key in structure) {
  const len = Object.keys(structure[key]).length;
  const hasHtml = !!structure[key]["index.html"];
  const tempHTML = ejs.render(templateContent, {
    nav: convertToHTML(structure[key]),
    datas: structure[key],
    key: key.replace(" - download", ""),
    preview: `/articles/html/${key}/`,
    hasHtml,
    len,
    isdownload: key.endsWith(" - download")
      ? `/articles/html/${key}/download.zip`
      : "",
  });
  const sanitizedKey = key.replace(/\s+/g, "_");
  const htmlName = `${sanitizedKey}.html`;
  const outputFilePath = path.join(
    __dirname,
    `html/${htmlName.replace("_-_download", "")}`
  );
  fs.writeFileSync(outputFilePath, tempHTML, "utf-8");
  urls.push({
    htmlName,
    key,
  });
}

const homeTemplateContent = fs.readFileSync(
  "./templates/index-html.html",
  "utf-8"
);
const homeOutputFilePath = path.join(__dirname, `html/index.html`);

let homeHTML = `<ul>`;
// 对 urls 进行排序，根据文件夹名称中的数字进行降序排序
urls.sort((a, b) => {
  // 提取文件夹名称中的数字
  const getNumber = (str) => {
    const match = str.match(/^(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const numA = getNumber(a.htmlName);
  const numB = getNumber(b.htmlName);

  return numB - numA; // 降序排序
});

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  const htmlUrl = `/articles/html/${url.key}/`;
  const skipUrl = `/html/${url.htmlName.replace("_-_download", "")}`;
  homeHTML += `<li class="card"><iframe loading="lazy" src="${htmlUrl}" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen></iframe><button onclick="window.open('${skipUrl}')">Get Code</button></li>`;
}

homeHTML += `</ul>`;

const homeTempHTML = ejs.render(homeTemplateContent, {
  list: homeHTML,
});
fs.writeFileSync(homeOutputFilePath, homeTempHTML, "utf-8");
