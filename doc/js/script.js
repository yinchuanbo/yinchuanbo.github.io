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

function categoryBtnCount() {
  const categoryBtns = document.querySelectorAll(".category-btn");
  categoryBtns.forEach((btn) => {
    const category = btn.getAttribute("data-category");
    const categoryCount = document.querySelectorAll(
      `li[data-category="${category}"]`
    ).length;
    const allCount = document.querySelectorAll(".home-articles-list li").length;
    btn.innerHTML = `${btn.textContent} <span class="category-count">${
      category === "all" ? allCount : categoryCount
    }</span>`;
  });
}

// 创建图片预览overlay
function createImagePreviewOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "img-preview-overlay";

  const img = document.createElement("img");
  img.className = "preview-img";

  const closeBtn = document.createElement("div");
  closeBtn.className = "close-preview";
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  });

  const controls = document.createElement("div");
  controls.className = "img-controls";

  const zoomInBtn = document.createElement("button");
  zoomInBtn.className = "img-control-btn";
  zoomInBtn.innerHTML = "+";
  zoomInBtn.addEventListener("click", () => {
    const currentWidth = parseInt(img.style.maxWidth || "90%");
    if (currentWidth < 150) {
      img.style.maxWidth = currentWidth + 10 + "%";
    }
  });

  const zoomOutBtn = document.createElement("button");
  zoomOutBtn.className = "img-control-btn";
  zoomOutBtn.innerHTML = "-";
  zoomOutBtn.addEventListener("click", () => {
    const currentWidth = parseInt(img.style.maxWidth || "90%");
    if (currentWidth > 30) {
      img.style.maxWidth = currentWidth - 10 + "%";
    }
  });

  const resetBtn = document.createElement("button");
  resetBtn.className = "img-control-btn";
  resetBtn.innerHTML = "⟲";
  resetBtn.addEventListener("click", () => {
    img.style.maxWidth = "90%";
  });

  controls.appendChild(zoomOutBtn);
  controls.appendChild(resetBtn);
  controls.appendChild(zoomInBtn);

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  overlay.appendChild(controls);

  // 点击overlay背景关闭预览
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    }
  });

  // ESC键关闭预览
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.querySelector(".img-preview-overlay.active")
    ) {
      const activeOverlay = document.querySelector(
        ".img-preview-overlay.active"
      );
      activeOverlay.classList.remove("active");
      setTimeout(() => {
        document.body.removeChild(activeOverlay);
      }, 300);
    }
  });

  return { overlay, img };
}

// 图片点击全屏预览功能
function setupImagePreview() {
  const images = document.querySelectorAll("main img");

  images.forEach((img) => {
    img.addEventListener("click", () => {
      const { overlay, img: previewImg } = createImagePreviewOverlay();
      previewImg.src = img.src;
      document.body.appendChild(overlay);

      // 使用setTimeout确保DOM更新后再添加active类以触发动画
      setTimeout(() => {
        overlay.classList.add("active");
      }, 10);
    });
  });
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

  categoryBtnCount();

  // 设置图片点击预览
  setupImagePreview();
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

// 专题页动态加载
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".special-page")) {
    const listLinks = document.querySelectorAll(".special-list ul li a");
    const contentContainer = document.getElementById("special-content");

    async function loadContent(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const html = await response.text();
        contentContainer.innerHTML = html;
        Prism.highlightAll();
        setupImagePreview();
        const headings = contentContainer.querySelectorAll("h2, h3");
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
        });
      } catch (error) {
        console.error("加载内容出错:", error);
        contentContainer.innerHTML = "<p>加载内容失败，请稍后重试。</p>";
      }
    }

    listLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const url = this.getAttribute("data-url");
        loadContent(url);
        listLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
        window.scroll(0, 0);
      });
    });

    // 加载第一个内容
    if (listLinks.length > 0) {
      listLinks[0].click();
    }
  }
});

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