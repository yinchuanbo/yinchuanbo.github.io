const fs = require("fs");
const path = require("path");

// 获取指定目录下的所有一级 *.html 文件并排序
function getSortedHtmlFiles(directory) {
  try {
    const files = fs.readdirSync(directory); // 读取目录内容
    const htmlFiles = files
      .filter((file) => {
        const filePath = path.join(directory, file);
        return (
          file.endsWith(".html") && // 只保留 .html 文件
          fs.statSync(filePath).isFile() // 确保是文件而不是文件夹
        );
      })
      .sort((a, b) => a.localeCompare(b)); // 按文件名排序

    return htmlFiles;
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`);
    return [];
  }
}

// 使用示例
const directoryPath = path.resolve("./three-js");
const sortedHtmlFiles = getSortedHtmlFiles(directoryPath);

const html = (str = "") => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code - yuxian</title>
    <link rel="shortcut icon" href="../code.svg" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=fallback"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../css/index.css" />
  </head>
  <body>
    <div class="layout">
      <header class="header">
        <div class="header-content">
          <a href="/" class="home-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </a>
        </div>
        <div class="search-box">
          <input type="text" placeholder="Search articles..." id="searchInput" />
        </div>
      </header>
      <main class="content">
        <ul>${str}</ul>
      </main>
      <footer class="footer">
        <p> 2025 yuxian. All rights reserved.</p>
      </footer>
    </div>
    <script>
      // Simple search functionality
      document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
          const title = card.querySelector('a').textContent.toLowerCase();
          if (title.includes(searchTerm)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    </script>
  </body>
</html>

`;
};

let strHTML = "";

for (let i = 0; i < sortedHtmlFiles.length; i++) {
  const element = sortedHtmlFiles[i];
  if (element === "index.html") continue;
  strHTML += `<li class="card"><a href="${element}">${element.replace(".html", "")}</a></li>`;
}

fs.writeFileSync("./three-js/index.html", html(strHTML));
