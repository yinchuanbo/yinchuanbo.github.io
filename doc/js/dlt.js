async function getTxtCodes() {
  try {
    const codes = await fetch("../dlt.txt").then((res) => res.text());
    let codesArray = codes.split("\n");
    codesArray = codesArray.filter(Boolean);
    codesArray = codesArray.map((code) => code.replace(/\r$/, ""));
    return codesArray;
  } catch (error) {
    console.error("Error loading lottery codes:", error);
    return [];
  }
}

async function reader() {
  const codesArray = await getTxtCodes();

  if (codesArray.length === 0) {
    document.getElementById("codes").innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>加载彩票号码数据失败，请刷新页面重试。</p>
      </div>
    `;
    return;
  }
  
  // Get the file's last modified date
  try {
    const response = await fetch("../dlt.txt");
    const lastModified = new Date(response.headers.get('last-modified'));
    const formattedDate = lastModified.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    document.getElementById("update-time").textContent = formattedDate;
  } catch (error) {
    document.getElementById("update-time").textContent = "未知";
    console.error("Error getting last modified date:", error);
  }

  let allHtml = `<ul class="codes__ul">`;
  codesArray.forEach((code, index) => {
    // Add animation delay based on index
    let oneHtml = `<li class="codes__li" style="--item-index: ${index}"><i class="codes__li_index">${
      index + 1
    }</i>`;
    let [frontStr, backStr] = code.split("+");
    frontStr = frontStr.trim();
    backStr = backStr.trim();
    const frontArray = frontStr.split(",");
    const backArray = backStr.split(",");

    // Display front numbers (red balls)
    frontArray.forEach((front) => {
      oneHtml += `<span class="front__ball" data-front-val="${front}">${front}</span>`;
    });

    // Add separator
    // oneHtml += `<span class="codes__separator">+</span>`;

    // Display back numbers (blue balls)
    backArray.forEach((back) => {
      oneHtml += `<span class="back__ball" data-back-val="${back}">${back}</span>`;
    });

    oneHtml += `</li>`;
    if ((index + 1) % 5 === 0) {
      oneHtml += `<li class="codes__line"></li>`;
    }
    allHtml += oneHtml;
  });
  allHtml += `</ul>`;
  document.getElementById("codes").innerHTML = allHtml;

  // Add animation to lottery balls on hover
  document.querySelectorAll(".front__ball, .back__ball").forEach((ball) => {
    const randomDuration = 2 + Math.random() * 1.5;
    ball.style.transition = `all ${randomDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;

    ball.addEventListener("mouseenter", () => {
      ball.style.transform = "scale(1.15) rotate(5deg)";
    });

    ball.addEventListener("mouseleave", () => {
      ball.style.transform = "scale(1) rotate(0deg)";
    });
  });
}

// Initialize the page
reader();

// Cache DOM elements
let dialogElement = null;

// Get latest lottery data
const getLatestData = async () => {
  try {
    // Show loading overlay
    showLoadingOverlay();
    
    const response = await fetch(
      `https://www.mxnzp.com/api/lottery/common/latest?code=cjdlt&app_id=mfop6rrgg6fvmngd&app_secret=N1BsK2hadVZHU2hQRDQvMmRtdXBPQT09`
    );
    
    // Hide loading overlay
    hideLoadingOverlay();
    
    return await response.json();
  } catch (error) {
    // Hide loading overlay on error
    hideLoadingOverlay();
    
    console.error("Error fetching lottery data:", error);
    return null;
  }
};

// Show loading overlay
function showLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-circle-notch fa-spin"></i>
      <p>正在获取最新开奖数据...</p>
    </div>
  `;
  document.body.appendChild(overlay);
}

// Hide loading overlay
function hideLoadingOverlay() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 500);
  }
}

// Handle check button click
document.querySelector("#check").onclick = async () => {
  const buttonElement = document.querySelector("#check");
  const ulDom = document.querySelector(".codes__ul");
  ulDom.classList.add("codes__ul--active");
  buttonElement.disabled = true;
  buttonElement.querySelector(".front").innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> 加载中...';

  const res = await getLatestData();

  // Reset button
  buttonElement.disabled = false;
  buttonElement.querySelector(".front").innerHTML =
    '<i class="fas fa-search"></i> 查看开奖结果';

  const result = res?.data?.openCode;
  const time = res?.data?.time;

  if (!result) {
    alert("获取最新开奖信息失败，请检查网络连接后重试。");
    return;
  }

  // Remove previous dialog if exists
  if (dialogElement) {
    dialogElement.remove();
  }

  // Parse winning numbers
  let [frontStr, backStr, backStr2] = result.split("+");
  frontStr = frontStr.trim();
  backStr = backStr.trim();
  backStr2 = backStr2.trim();
  const winningFrontArray = frontStr.split(",");
  const winningBackArray = [backStr, backStr2];

  // Collect matched numbers and prize levels for each code
  const matchResults = [];
  document.querySelectorAll(".codes__li").forEach((codeItem, codeIndex) => {
    const frontBalls = codeItem.querySelectorAll(".front__ball");
    const backBalls = codeItem.querySelectorAll(".back__ball");
    
    const frontMatches = Array.from(frontBalls)
      .filter(ball => winningFrontArray.includes(ball.textContent));
    
    const backMatches = Array.from(backBalls)
      .filter(ball => winningBackArray.includes(ball.textContent));
    
    // Calculate prize level
    const prizeLevel = calculatePrizeLevel(frontMatches.length, backMatches.length);
    
    // Only add to results if it's an actual winning prize level (greater than 0)
    if (prizeLevel > 0) {
      matchResults.push({
        codeIndex: codeIndex + 1,
        frontMatches: frontMatches.length,
        backMatches: backMatches.length,
        prizeLevel: prizeLevel
      });
    }
  });
  
  // Show dialog with results
  showDialog(time, result, matchResults);

  // Reset any previously active elements
  document
    .querySelectorAll(".front__ball.active, .back__ball.active")
    .forEach((el) => {
      el.classList.remove("active");
    });

  // Animate matching front numbers with staggered delay
  winningFrontArray.forEach((frontCode, idx) => {
    const getFrontBallDom = document.querySelectorAll(
      `[data-front-val="${frontCode}"]`
    );

    getFrontBallDom.forEach((item) => {
      setTimeout(() => {
        item.classList.add("active");
        // Add bounce animation
        item.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.3)" },
            { transform: "scale(1.1)" },
          ],
          {
            duration: 600,
            easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }
        );
      }, idx * 200);
    });
  });

  // Animate matching back numbers with staggered delay
  setTimeout(() => {
    winningBackArray.forEach((backCode, idx) => {
      const getBackBallDom = document.querySelectorAll(
        `[data-back-val="${backCode}"]`
      );

      getBackBallDom.forEach((item) => {
        setTimeout(() => {
          item.classList.add("active");
          // Add bounce animation
          item.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(1.3)" },
              { transform: "scale(1.1)" },
            ],
            {
              duration: 600,
              easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          );
        }, idx * 200);
      });
    });
  }, winningFrontArray.length * 200);

  // Scroll to first match if any
  const firstMatch = document.querySelector(
    ".front__ball.active, .back__ball.active"
  );
  if (firstMatch) {
    setTimeout(() => {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }, (winningFrontArray.length + winningBackArray.length + 1) * 200);
  }
};

// Calculate prize level based on the number of matched front and back balls
function calculatePrizeLevel(frontMatches, backMatches) {
  if (frontMatches === 5 && backMatches === 2) return 1; // 一等奖
  if (frontMatches === 5 && backMatches === 1) return 2; // 二等奖
  if (frontMatches === 5 && backMatches === 0) return 3; // 三等奖
  if (frontMatches === 4 && backMatches === 2) return 4; // 四等奖
  if (frontMatches === 4 && backMatches === 1) return 5; // 五等奖
  if (frontMatches === 3 && backMatches === 2) return 6; // 六等奖
  if (frontMatches === 4 && backMatches === 0) return 7; // 七等奖
  if (frontMatches === 3 && backMatches === 1 || frontMatches === 2 && backMatches === 2) return 8; // 八等奖
  if (frontMatches === 3 && backMatches === 0 || frontMatches === 2 && backMatches === 1 || frontMatches === 1 && backMatches === 2 || frontMatches === 0 && backMatches === 2) return 9; // 九等奖
  return 0; // 未中奖
}

function showDialog(time, result, matchResults) {
  let [frontStr, backStr, backStr2] = result.split("+");
  frontStr = frontStr.trim();
  backStr = backStr.trim();
  backStr2 = backStr2.trim();

  // Generate the result balls HTML
  let frontBallsHtml = '';
  frontStr.split(",").forEach(num => {
    frontBallsHtml += `<span class="front__ball result-ball">${num}</span>`;
  });

  let backBallsHtml = '';
  [backStr, backStr2].forEach(num => {
    backBallsHtml += `<span class="back__ball result-ball">${num}</span>`;
  });
  
  // Generate the prize results HTML
  let prizeResultsHtml = '';
  if (matchResults.length > 0) {
    // User has at least one winning entry
    prizeResultsHtml = `<div class="prize-results">
      <h3>恭喜您中奖啦！</h3>
      <div class="prize-list">`;
      
    // Only show winning entries
    matchResults.forEach(match => {
      const prizeNames = [
        "未中奖", 
        "一等奖", 
        "二等奖", 
        "三等奖", 
        "四等奖", 
        "五等奖", 
        "六等奖",
        "七等奖",
        "八等奖",
        "九等奖"
      ];
      prizeResultsHtml += `
        <div class="prize-item winning">
          <div class="prize-code">第 ${match.codeIndex} 注</div>
          <div class="prize-details">
            <span class="prize-level level-${match.prizeLevel}">${prizeNames[match.prizeLevel]}</span>
            <span class="prize-match">(前区 ${match.frontMatches} + 后区 ${match.backMatches})</span>
          </div>
        </div>`;
    });
    
    prizeResultsHtml += `
      </div>
    </div>`;
  } else {
    // No winning entries
    prizeResultsHtml = `<div class="no-prize">
      <p>很遗憾，本次未中奖</p>
      <p>再接再厉，下次好运！</p>
    </div>`;
  }
  
  const html = `<div id="myDialog">
      <p><b>开奖时间：</b>${time}</p>
      <div class="result-balls">
        ${frontBallsHtml}
        <span class="codes__separator">+</span>
        ${backBallsHtml}
      </div>
      ${prizeResultsHtml}
      <p class="dialog-close"><i class="fas fa-times-circle"></i> 点击空白处关闭</p>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  dialogElement = document.getElementById("myDialog");

  // Close dialog when clicking outside
  document.addEventListener("click", function closeDialog(e) {
    if (
      dialogElement &&
      !dialogElement.contains(e.target) &&
      e.target.id !== "check"
    ) {
      dialogElement.remove();
      dialogElement = null;
      document.removeEventListener("click", closeDialog);
    }
  });
}
