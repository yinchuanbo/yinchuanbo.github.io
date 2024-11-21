function generateLotteryNumbersDLT(nums = 7) {
  const numbers = [];
  for (let i = 0; i < nums; i++) {
    const redNumbers = generateRedNumbersDLT();
    const blueNumbers = generateBlueNumbersDLT();
    const formattedNumbers = formatNumbersDLT(redNumbers, blueNumbers);
    numbers.push(formattedNumbers);
  }
  return numbers;
}

function generateRedNumbersDLT() {
  const redPool = Array.from({ length: 35 }, (_, i) => i + 1);
  shuffleArray(redPool);
  return redPool.slice(0, 5).sort((a, b) => a - b);
}

function generateBlueNumbersDLT() {
  const redPool = Array.from({ length: 12 }, (_, i) => i + 1);
  shuffleArray(redPool);
  return redPool.slice(0, 2).sort((a, b) => a - b);
}

function formatNumbersDLT(redNumbers, blueNumbers) {
  const redNumbersString = redNumbers.join(",");
  const blueNumbersString = blueNumbers.join(",");
  return `${redNumbersString}+${blueNumbersString}`;
}

generateDLT.onclick = () => {
  let lotteryNumbers = generateLotteryNumbersDLT();
  leftTextareaDLT.value = lotteryNumbers.join("\n");
};

function excludeNumbersDLT(arr, excludeList) {
  return arr.filter((num) => !excludeList.includes(num));
}

function createLotteryNumbersDLT(redPool, bluePool, nums = 20) {
  const results = [];
  for (let i = 0; i < nums; i++) {
    const redBalls = [];
    while (redBalls.length < 5) {
      const redBall = redPool[Math.floor(Math.random() * redPool.length)];
      if (!redBalls.includes(redBall)) {
        redBalls.push(redBall);
      }
    }
    redBalls.sort((a, b) => a - b);

    const blueBalls = [];
    while (blueBalls.length < 2) {
      const blueBall = bluePool[Math.floor(Math.random() * bluePool.length)];
      if (!blueBalls.includes(blueBall)) {
        blueBalls.push(blueBall);
      }
    }
    blueBalls.sort((a, b) => a - b);
    results.push(`${redBalls.join(",")}+${blueBalls.join(",")}`);
  }
  return results;
}

createDLT.onclick = () => {
  const val = leftTextareaDLT.value;
  if (!val) {
    alert("请生成随机号码");
    return;
  }
  const valArrs = val.split("\n");
  let redBalls = [...Array(35).keys()].map((x) => x + 1);
  let blueBalls = [...Array(12).keys()].map((x) => x + 1);
  for (let i = 0; i < valArrs.length; i++) {
    const valArr = valArrs[i];
    const redBall = valArr.split("+")[0];
    const blueBall = valArr.split("+")[1];
    const redBallArr = redBall.split(",").map(Number);
    const blueBallArr = blueBall.split(",").map(Number);
    redBalls = excludeNumbersDLT(redBalls, redBallArr);
    blueBalls = excludeNumbersDLT(blueBalls, blueBallArr);
  }
  let result = createLotteryNumbersDLT(redBalls, blueBalls, 5);
  result = result.map((item) => {
    const str = item.replace("+", ",");
    return str.split(",");
  });
  createCanvasDLT(result);
};

const createCanvasDLT = (arr) => {
  const conArr = convertArrayDLT(arr);
  const dltLocal = localStorage.getItem("dlt");
  if (!dltLocal) {
    localStorage.setItem("dlt", conArr);
  } else {
    localStorage.setItem("dlt", `${dltLocal}\n${conArr}`);
  }
  var canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 40 * arr.length;
  var ctx = canvas.getContext("2d");
  var values = arr;
  var rows = values.length;
  var cols = values[0].length;
  var cellWidth = canvas.width / cols;
  var cellHeight = canvas.height / rows;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var value = values[i][j];
      var x = j * cellWidth;
      var y = i * cellHeight;
      ctx.fillStyle = j >= cols - 2 ? "rgb(71, 136, 244)" : "rgb(250, 78, 78)";
      ctx.fillRect(x, y, cellWidth, cellHeight);
      ctx.fillStyle = "#ffffff";
      ctx.font = "18px hack";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(value.toString(), x + cellWidth / 2, y + cellHeight / 2);
    }
  }
  var dataURL = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  link.href = dataURL;
  link.download = `${generateRandomString(10)}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function convertArrayDLT(arr) {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    var row = arr[i];
    var rowString = row.slice(0, row.length - 2).join(", ");
    result += rowString + " - " + row.slice(row.length - 2).join(",") + "\n";
  }
  return result.trim();
}

const wrapperLeftMaskDLT = document.querySelector(".mask_dlt");
const wrapperLeftMaskContentDLT = wrapperLeftMaskDLT.querySelector(
  ".wrapper__left_mask_content"
);
const closeLeftDomDLT = wrapperLeftMaskDLT.querySelector(
  ".wrapper__left_mask_close"
);

checkDLT.onclick = () => {
  renderHtmlDLT();
};

closeLeftDomDLT.onclick = () => {
  wrapperLeftMaskDLT.style.display = "none";
};

const renderHtmlDLT = () => {
  wrapperLeftMaskContentDLT.innerHTML = "";
  const getBallData = localStorage.getItem("dlt");
  const ulDom = document.createElement("ul");
  ulDom.id = "boxUlDLT";
  wrapperLeftMaskContentDLT.append(ulDom);
  if (getBallData) {
    wrapperLeftMaskDLT.style.display = "flex";
    const getBallLists = getBallData.split("\n");
    if (getBallLists?.length) {
      let liHtmls = "";
      for (let i = 0; i < getBallLists.length; i++) {
        const getBallList = getBallLists[i].trim();
        const splitSymbol = getBallList.includes("-") ? "-" : "+";
        const curBall = getBallList.split(splitSymbol);
        console.log("curBall", curBall);
        if (curBall?.length === 2) {
          const curBallRed = (curBall[0] + "").trim();
          const curBallBlue = curBall[1].trim();
          const redArrs = curBallRed.split(",");
          const blueArrs = curBallBlue.split(",");
          let redHtml = "";
          let blueHtml = "";
          if (redArrs?.length) {
            for (let j = 0; j < redArrs.length; j++) {
              const redArr = (redArrs[j] + "").trim();
              redHtml += `<span class="isRed" data-id="${redArr}">${redArr}</span>`;
            }
          }
          if (blueArrs?.length) {
            for (let j = 0; j < blueArrs.length; j++) {
              const blueArr = (blueArrs[j] + "").trim();
              blueHtml += `<span class="isBlue" data-id="${blueArr}">${blueArr}</span>`;
            }
          }
          liHtmls += `<li>${redHtml}${blueHtml}</li>`;
        }
      }
      ulDom.innerHTML = liHtmls;
      setTimeout(() => {
        getLastestDataDLT();
      }, 100);
    }
  } else {
    alert("没有存储号码");
  }
};

const getLastestDataDLT = () => {
  fetch(
    `https://www.mxnzp.com/api/lottery/common/latest?code=cjdlt&app_id=mfop6rrgg6fvmngd&app_secret=N1BsK2hadVZHU2hQRDQvMmRtdXBPQT09`
  )
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      if (res?.code === 1) {
        let openCode = res?.data?.openCode || "";
        const time = res?.data?.time || "";
        document.querySelector("#time__dlt").textContent = time;
        document.querySelector("#code__dlt").textContent = openCode;
        document.querySelector(
          ".mask_dlt .wrapper__left_mask_time"
        ).style.display = "";
        openCode = openCode.split("+");
        let openCodeRed = openCode[0].trim();
        openCodeRed = openCodeRed.split(",");
        let openCodeBlue = [openCode[1], openCode[2]];
        for (let k = 0; k < openCodeRed.length; k++) {
          const redball = parseInt(openCodeRed[k].trim());
          const getAllRed = document.querySelectorAll(
            `.isRed[data-id="${redball}"]`
          );
          getAllRed.forEach((item) => {
            item.classList.add("isActive");
          });
        }
        for (let k = 0; k < openCodeBlue.length; k++) {
          const blueball = parseInt(openCodeBlue[k].trim());
          const getAllRed = document.querySelectorAll(
            `.isBlue[data-id="${blueball}"]`
          );
          getAllRed.forEach((item) => {
            item.classList.add("isActive");
          });
        }
      }
    });
};

ssqClear.onclick = () => {
  localStorage.removeItem("ssq");
};

dltClear.onclick = () => {
  localStorage.removeItem("dlt");
};
