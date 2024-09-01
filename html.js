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
        const fileContent = fs.readFileSync(itemPath, "utf-8");
        if (itemPath.includes(".md")) {
          result[item] = marked.parse(fileContent);
        } else {
          result[item] = fileContent;
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

const structure = getCodesDirectoryStructure();

const templateContent = fs.readFileSync("./templates/edit-html.html", "utf-8");

let uniqueId = 0;

function convertToHTML(structure, parentPath = "") {
  let html = "<ul>";
  for (const key in structure) {
    if (structure.hasOwnProperty(key)) {
      uniqueId++;
      const currentPath = parentPath ? `${parentPath}/${key}` : key;
      if (typeof structure[key] === "object") {
        html += `<li><h3>${key}</h3>${convertToHTML(structure[key], currentPath)}</li>`;
      } else {
        let hz = "";
        const hzJS = key.endsWith(".js");
        const hzHTML = key.endsWith(".html");
        const hzCSS = key.endsWith(".css");
        const hzMD = key.endsWith(".md");
        const hzImg = imageExtensions.includes("." + key.split(".").pop());
        if (hzMD) {
          hz = `<svg t="1723729102337" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22764" width="200" height="200"><path d="M456.32 433.216v227.712h49.792V362.304H456.32v0.512L350.976 468.16 246.144 363.264v-0.896h-49.792v298.624h49.792V433.664l104.96 104.96 35.2-35.2-0.128-0.064L456.32 433.216z m-328.256-294.4h768a64 64 0 0 1 64 64v618.624a64 64 0 0 1-64 64h-768a64 64 0 0 1-64-64V202.752a64 64 0 0 1 64-64z m581.76 427.968V362.304h-49.728v201.792L580.8 484.8l-35.2 35.2 140.8 140.8 35.2-35.2-0.064-0.064 105.6-105.664-35.2-35.2-82.048 82.112z" fill="#61A0FF" p-id="22765"></path></svg>`;
        }
        if (hzImg) {
          hz = `<svg t="1723729063841" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20903" width="200" height="200"><path d="M813.4144 153.856H204.9536c-59.5968 0-108.0832 48.4864-108.0832 108.0832v494.08c0 59.5968 48.4864 108.0832 108.0832 108.0832h608.4608c59.5968 0 108.0832-48.4864 108.0832-108.0832v-494.08c0-59.5968-48.4864-108.0832-108.0832-108.0832z m46.6432 602.1632c0 25.7024-20.9408 46.6432-46.6432 46.6432H204.9536c-25.7024 0-46.6432-20.9408-46.6432-46.6432v-158.0544c1.28-0.9216 2.5088-1.8432 3.6352-2.9696l172.0832-171.4688c0.1536-0.1536 0.5632-0.512 1.28-0.4608 0.768 0.0512 1.0752 0.4608 1.2288 0.6656l175.0016 222.8736c12.3904 15.7696 30.9248 24.1152 49.7664 24.1152 12.288 0 24.6784-3.5328 35.4816-10.9056l127.5392-86.9888c0.512-0.3584 1.1776-0.4096 1.6896-0.1024l133.9904 67.328v115.968z m0-184.832l-106.4448-53.4528c-20.48-10.2912-44.9536-8.6528-63.8976 4.2496l-127.5392 86.9888c-0.7168 0.512-1.7408 0.3584-2.2528-0.3584L384.8704 385.7408a63.0784 63.0784 0 0 0-45.824-24.0128c-17.9712-1.0752-35.6352 5.5808-48.384 18.2784L158.3104 511.8976V261.9392c0-25.7024 20.9408-46.6432 46.6432-46.6432h608.4608c25.7024 0 46.6432 20.9408 46.6432 46.6432v309.248z" fill="#FF6C39" p-id="20904"></path><path d="M696.832 277.504c-45.056 0-81.664 36.6592-81.664 81.664S651.776 440.832 696.832 440.832s81.664-36.6592 81.664-81.664S741.888 277.504 696.832 277.504z m0 101.888c-11.1616 0-20.224-9.0624-20.224-20.224s9.0624-20.224 20.224-20.224 20.224 9.0624 20.224 20.224-9.0624 20.224-20.224 20.224z" fill="#FF6C39" p-id="20905"></path></svg>`;
        }
        if (hzCSS) {
          hz = `<svg t="1723728108552" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2302" width="200" height="200"><path d="M512 512zM128.3 64.3l69.8 805.8 313.4 89.5L825.8 870l69.9-805.7H128.3z m580.9 669.3l-197.1 56.2-196.8-56.5L301.9 578h96.4l6.9 79.1 107.1 30.3 0.3 0.5h0.1l106.9-29.7L630.7 530H406.1l-8-99.9h241.1l8.8-101.9H280.2l-8-97.9H753l-43.8 503.3z" fill="#264DE4" p-id="2303"></path></svg>`;
        }
        if (hzHTML) {
          hz = `<svg t="1723728069970" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2156" width="200" height="200"><path d="M89.088 59.392l62.464 803.84c1.024 12.288 9.216 22.528 20.48 25.6L502.784 993.28c6.144 2.048 12.288 2.048 18.432 0l330.752-104.448c11.264-4.096 19.456-14.336 20.48-25.6l62.464-803.84c1.024-17.408-12.288-31.744-29.696-31.744H118.784c-17.408 0-31.744 14.336-29.696 31.744z" fill="#FC490B" p-id="2157"></path><path d="M774.144 309.248h-409.6l12.288 113.664h388.096l-25.6 325.632-227.328 71.68-227.328-71.68-13.312-169.984h118.784v82.944l124.928 33.792 123.904-33.792 10.24-132.096H267.264L241.664 204.8h540.672z" fill="#FFFFFF" p-id="2158"></path></svg>`;
        }
        if (hzJS) {
          hz = `<svg fill="none" height="2500" width="2183" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 141.53199999999998"><path d="M10.383 126.894L0 0l124 .255-10.979 126.639-50.553 14.638z" fill="#e9ca32"/><path d="M62.468 129.277V12.085l51.064.17-9.106 104.851z" fill="#ffde25"/><g fill="#fff"><path d="M57 26H43.5v78L33 102V91.5l-12.5-2V113l36.5 9.5zM67.127 26H104.5L102 40.95H81.394v24.533H102L99.5 115l-32.373 7.5V107L89 99.5 90.263 79l-23.136 3.35z"/></g></svg>`;
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
    key,
    // preview: `/codes/${key}`,
    hasHtml,
    len,
  });
  const sanitizedKey = key.replace(/\s+/g, "_");
  const htmlName = `${sanitizedKey}.html`;
  const outputFilePath = path.join(__dirname, `html/${htmlName}`);
  fs.writeFileSync(outputFilePath, tempHTML, "utf-8");
  urls.push({
    htmlName,
    key,
  });
}

const homeTemplateContent = fs.readFileSync("./templates/index.html", "utf-8");
const homeOutputFilePath = path.join(__dirname, `html/index.html`);

let homeHTML = `<ul>`;
for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  homeHTML += `<li class="card"><a href="${url.htmlName}">${url.key}</a></li>`;
}

homeHTML += `</ul>`;

const homeTempHTML = ejs.render(homeTemplateContent, {
  list: homeHTML,
});
fs.writeFileSync(homeOutputFilePath, homeTempHTML, "utf-8");
