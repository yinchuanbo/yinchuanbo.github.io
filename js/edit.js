const liElementsWithDataPath = document.querySelectorAll("li[data-path]");
const preDom = document.querySelector("#pre");
const html = preDom.innerHTML;
const data = JSON.parse(html);
const editorContainer = document.querySelector("#editor");
let editor = null;

const imgArr = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

function getDataByPath(data, path) {
  const keys = path.split("/");
  const fileName = keys.pop();
  const fileExtension = fileName.split(".").pop();
  let result = data;
  for (const key of keys) {
    if (result[key] !== undefined) {
      result = result[key];
    } else {
      return { data: null, extension: null };
    }
  }
  return { data: result[fileName], extension: fileExtension };
}

function decodeHtmlEntities(encodedString) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = encodedString;
  return textarea.value;
}

function init(obj, extension) {
  obj = decodeHtmlEntities(obj);
  if (editor) {
    editor.dispose();
  }

  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs",
    },
  });

  require(["vs/editor/editor.main"], function () {
    let language = extension;
    if (extension === "js") language = "javascript";
    if (extension === "ejs") language = "html";
    if (extension === "babelrc") language = "json";

    editor = monaco.editor.create(editorContainer, {
      value: obj,
      language: language,
      theme: "vs-dark",
      fontSize: 16,
      fontFamily: "JetBrains Mono",
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
      lineNumbers: true,
      lineHeight: 24,
      wordWrap: "on",
      padding: { top: 10, bottom: 10 },
    });
  });
}

window.onload = () => {
  const firstPath = document.querySelector("li[data-path]");
  if (firstPath) {
    firstPath.classList.add("active");
    const path = firstPath.dataset.path;
    if (path) {
      const { data: obj, extension } = getDataByPath(data, path);
      if (!imgArr.includes(extension)) {
        init(obj, extension);
      } else {
        editorContainer.innerHTML = `<img src="${obj}" style="max-width: 100%; height: auto; margin: 0;" />`;
      }
    }
  }

  liElementsWithDataPath.forEach((item) => {
    item.onclick = () => {
      const path = item.dataset.path;
      const curActive = document.querySelector("li[data-path].active");
      if (path) {
        curActive?.classList.remove("active");
        item.classList.add("active");
        const { data: obj, extension } = getDataByPath(data, path);
        if (!imgArr.includes(extension)) {
          init(obj, extension);
        } else {
          editorContainer.innerHTML = `<img src="${obj}" style="max-width: 100%; height: auto; margin: 0;" />`;
        }
      }
    };
  });
};
