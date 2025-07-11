// 日期格式化函数
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 暗色模式持久化
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

// 目录生成
document.addEventListener("DOMContentLoaded", function () {
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    toTop.onclick = function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
  }

  // 格式化页面中的日期
  const dateElements = document.querySelectorAll("header p");
  dateElements.forEach((el) => {
    const text = el.textContent;
    const dateMatch = text.match(
      /(\d{4}-\d{2}-\d{2})|([A-Za-z]{3} \d{2}, \d{4})/
    );
    if (dateMatch) {
      const formattedDate = formatDate(dateMatch[0]);
      el.textContent = text.replace(dateMatch[0], formattedDate);
    }
  });

  const headings = document.querySelectorAll("main h2, main h3");
  const toc = document.querySelector(".toc");

  headings.forEach((heading) => {
    if (!heading.id) {
      heading.id =
        "heading-" +
        heading.textContent
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .replace(/(\d+)-(\d+)/g, "$1$2");
    }
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.style.paddingLeft = heading.tagName === "H3" ? "15px" : "0";
    toc.appendChild(link);
  });

  // 平滑滚动处理
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.getElementById(
        this.getAttribute("href").substring(1)
      );
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});

// 分类筛选功能
if (
  document.querySelector(".home-articles-list") &&
  document.getElementById("category-list")
) {
  document
    .getElementById("category-list")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("category-btn")) {
        const cat = e.target.getAttribute("data-category");
        document
          .querySelectorAll(".category-btn")
          .forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
        document.querySelectorAll(".home-articles-list li").forEach((li) => {
          if (cat === "all" || li.getAttribute("data-category") === cat) {
            li.style.display = "";
          } else {
            li.style.display = "none";
          }
        });
      }
    });
}

// 主题切换功能
const themeToggle = document.createElement("button");
themeToggle.className = "theme-toggle";
themeToggle.textContent = "切换主题";
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});
document.body.appendChild(themeToggle);
