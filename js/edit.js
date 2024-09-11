const liElementsWithDataPath = document.querySelectorAll("li[data-path]");
const preDom = document.querySelector("#pre");
const html = preDom.innerHTML;
const data = JSON.parse(html);
const wrapperContent = document.querySelector(".layout__main_right");
let isEx = false;

let imgArr = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

let editor = null;

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
  if (editor) editor.dispose();
  wrapperContent.innerHTML = "";
  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs",
    },
  });
  require(["vs/editor/editor.main"], function () {
    // monaco.editor.defineTheme("myCustomTheme", {
    //   base: "vs", // 基础主题: 'vs', 'vs-dark', 'hc-black'
    //   inherit: true,
    //   rules: [{ token: "comment", foreground: "999999", fontStyle: "italic" }],
    //   colors: {
    //     "editor.foreground": "#D4D4D4",
    //     "editor.selectionBackground": "#264F78",
    //     "editor.lineHighlightBackground": "#242424",
    //     "editor.inactiveSelectionBackground": "#3B3A30",
    //     "editorIndentGuide.background": "#2A2D2E",
    //     "editorIndentGuide.activeBackground": "#2A2D2E",
    //   },
    // });

    // monaco.editor.setTheme("myCustomTheme");

    let lan = extension;
    if(extension === "js") lan = "javascript";
    if(extension === "ejs") lan = "html";
    if(extension === "babelrc") lan = "json";
    editor = monaco.editor.create(wrapperContent, {
      value: obj,
      language: lan,
      automaticLayout: true,
      theme: "vs-dark",
      fontSize: 16,
      fontFamily: "JetBrains Mono",
      scrollbar: {
        vertical: "hidden",
        horizontal: "hidden",
      },
      wordWrap: "on",
      lineNumbers: true,
      lineHeight: 40,
      minimap: {
        enabled: false,
      },
    });
  });
}

window.onload = () => {
  // layoutEdit();
  const firstPath = document.querySelector("li[data-path]");
  if (firstPath) {
    firstPath.classList.add("active");
    const path = firstPath.dataset.path;
    if (path) {
      const { data: obj, extension } = getDataByPath(data, path);
      if (!imgArr.includes(extension)) {
        init(obj, extension);
      } else {
        wrapperContent.innerHTML = "";
        wrapperContent.insertAdjacentHTML(
          "beforeend",
          `<img src="${obj}" style="margin-bottom: 0!important" />`
        );
      }
    }
  }
  liElementsWithDataPath.forEach((item) => {
    item.onclick = () => {
      const path = item.dataset.path;
      const curActive = document.querySelector("li[data-path].active");
      if (path) {
        curActive.classList.remove("active");
        const { data: obj, extension } = getDataByPath(data, path);
        if (!imgArr.includes(extension)) {
          init(obj, extension);
        } else {
          wrapperContent.innerHTML = "";
          wrapperContent.insertAdjacentHTML(
            "beforeend",
            `<img src="${obj}" style="margin-bottom: 0!important" />`
          );
        }
        item.classList.add("active");
      }
    };
  });

  //
  const h3s = document.querySelectorAll(".layout__main_left h3");
  h3s.forEach((item) => {
    item.onclick = () => {
      item.classList.toggle("isshow");
    };
  });
};

function layoutEdit() {
  const leftBorder = document.querySelector(".left__border");
  const resizer = document.querySelector(".layout__main_left");
  // const resizable = document.querySelector(".layout__main_right");
  leftBorder.addEventListener("mousedown", initResize);
  function initResize(e) {
    e.preventDefault();
    document.addEventListener("mousemove", startResizing);
    document.addEventListener("mouseup", stopResizing);
  }
  function startResizing(e) {
    const resizerRect = resizer.getBoundingClientRect();
    // const resizableRect = resizable.getBoundingClientRect();
    let newWidth = e.clientX - resizerRect.left;

    if (newWidth < 300) {
      newWidth = 300;
    } else if (newWidth > 750) {
      newWidth = 750;
    }
    resizer.style.width = `${newWidth}px`;
    editor?.layout();
  }
  function stopResizing() {
    document.removeEventListener("mousemove", startResizing);
    document.removeEventListener("mouseup", stopResizing);
  }
}
