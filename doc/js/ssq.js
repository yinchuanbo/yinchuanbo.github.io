async function getTxtCodes() {
  try {
    const codes = await fetch("../ssq.txt").then((res) => res.text());
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
    const response = await fetch("../ssq.txt");
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
    let [redStr, blueStr] = code.split("+");
    redStr = redStr.trim();
    blueStr = blueStr.trim();
    const redArray = redStr.split(",");
    redArray.forEach((red) => {
      oneHtml += `<span class="red__ball" data-red-val="${red}">${red}</span>`;
    });
    // oneHtml += `<span class="codes__separator">+</span>`;
    oneHtml += `<span class="blue__ball" data-blue-val="${blueStr}">${blueStr}</span>`;
    oneHtml += `</li>`;
    if ((index + 1) % 5 === 0) {
      oneHtml += `<li class="codes__line"></li>`;
    }
    allHtml += oneHtml;
  });
  allHtml += `</ul>`;
  document.getElementById("codes").innerHTML = allHtml;

  // Add animation to lottery balls on hover
  document.querySelectorAll(".red__ball, .blue__ball").forEach((ball) => {
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
      `https://www.mxnzp.com/api/lottery/common/latest?code=ssq&app_id=mfop6rrgg6fvmngd&app_secret=N1BsK2hadVZHU2hQRDQvMmRtdXBPQT09`
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
  let [winningRedStr, winningBlueStr] = result.split("+");
  winningRedStr = winningRedStr.trim();
  winningBlueStr = winningBlueStr.trim();
  const winningRedArray = winningRedStr.split(",");

  // Collect matched numbers and prize levels for each code
  const matchResults = [];
  document.querySelectorAll(".codes__li").forEach((codeItem, codeIndex) => {
    const redBalls = codeItem.querySelectorAll(".red__ball");
    const blueBall = codeItem.querySelector(".blue__ball");
    
    const redMatches = Array.from(redBalls)
      .filter(ball => winningRedArray.includes(ball.textContent));
    
    const blueMatches = blueBall.textContent === winningBlueStr ? 1 : 0;
    
    // Calculate prize level
    const prizeLevel = calculatePrizeLevel(redMatches.length, blueMatches);
    
    // Only add to results if it's an actual winning prize level (greater than 0)
    if (prizeLevel > 0) {
      matchResults.push({
        codeIndex: codeIndex + 1,
        redMatches: redMatches.length,
        blueMatches: blueMatches,
        prizeLevel: prizeLevel
      });
    } else if (redMatches.length > 0 || blueMatches > 0) {
      // Add partial matches but with prize level 0 (didn't win)
      matchResults.push({
        codeIndex: codeIndex + 1,
        redMatches: redMatches.length,
        blueMatches: blueMatches,
        prizeLevel: 0
      });
    }
  });
  
  // Show dialog with results
  showDialog(time, result, matchResults);

  // Reset any previously active elements
  document
    .querySelectorAll(".red__ball.active, .blue__ball.active")
    .forEach((el) => {
      el.classList.remove("active");
    });

  // Animate matching red balls with staggered delay
  winningRedArray.forEach((redCode, idx) => {
    const getRedBallDom = document.querySelectorAll(
      `[data-red-val="${redCode}"]`
    );

    getRedBallDom.forEach((item) => {
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

  // Animate matching blue balls
  setTimeout(() => {
    const getBlueBallDom = document.querySelectorAll(
      `[data-blue-val="${winningBlueStr}"]`
    );

    getBlueBallDom.forEach((item) => {
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
    });
  }, winningRedArray.length * 200);

  // Scroll to first match if any
  const firstMatch = document.querySelector(
    ".red__ball.active, .blue__ball.active"
  );
  if (firstMatch) {
    setTimeout(() => {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }, (winningRedArray.length + 1) * 200);
  }
};

// Calculate prize level based on the number of matched red and blue balls
function calculatePrizeLevel(redMatches, blueMatches) {
  if (redMatches === 6 && blueMatches === 1) return 1; // 一等奖
  if (redMatches === 6 && blueMatches === 0) return 2; // 二等奖
  if (redMatches === 5 && blueMatches === 1) return 3; // 三等奖
  if (redMatches === 5 && blueMatches === 0 || redMatches === 4 && blueMatches === 1) return 4; // 四等奖
  if (redMatches === 4 && blueMatches === 0 || redMatches === 3 && blueMatches === 1) return 5; // 五等奖
  if (redMatches === 2 && blueMatches === 1 || redMatches === 1 && blueMatches === 1 || redMatches === 0 && blueMatches === 1) return 6; // 六等奖
  return 0; // 未中奖
}

function showDialog(time, result, matchResults) {
  const [redStr, blueStr] = result.split("+").map(s => s.trim());
  const redArray = redStr.split(",");
  
  let redBallsHtml = '';
  redArray.forEach(num => {
    redBallsHtml += `<span class="red__ball result-ball">${num}</span>`;
  });
  
  // Count actual winning entries (prize level > 0)
  const winningEntries = matchResults.filter(match => match.prizeLevel > 0);
  
  // Generate the prize results HTML
  let prizeResultsHtml = '';
  if (winningEntries.length > 0) {
    // User has at least one winning entry
    prizeResultsHtml = `<div class="prize-results">
      <h3>恭喜您中奖啦！</h3>
      <div class="prize-list">`;
      
    // Only show winning entries
    winningEntries.forEach(match => {
      const prizeNames = ["未中奖", "一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖"];
      prizeResultsHtml += `
        <div class="prize-item winning">
          <div class="prize-code">第 ${match.codeIndex} 注</div>
          <div class="prize-details">
            <span class="prize-level level-${match.prizeLevel}">${prizeNames[match.prizeLevel]}</span>
            <span class="prize-match">(红球 ${match.redMatches} + 蓝球 ${match.blueMatches})</span>
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
        ${redBallsHtml}
        <span class="codes__separator">+</span>
        <span class="blue__ball result-ball">${blueStr}</span>
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
