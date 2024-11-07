function generateLotteryNumbers(nums = 7) {
  const numbers = [];
  for (let i = 0; i < nums; i++) {
    const redNumbers = generateRedNumbers();
    const blueNumber = generateBlueNumber();
    const formattedNumbers = formatNumbers(redNumbers, blueNumber);
    numbers.push(formattedNumbers);
  }
  return numbers;
}

function generateRedNumbers() {
  const redNumbers = [];
  while (redNumbers.length < 6) {
    const randomNumber = Math.floor(Math.random() * 33) + 1;
    if (!redNumbers.includes(randomNumber)) {
      redNumbers.push(randomNumber);
    }
  }
  return redNumbers.sort((a, b) => a - b);
}

function generateBlueNumber() {
  return Math.floor(Math.random() * 16) + 1;
}

function formatNumbers(redNumbers, blueNumber) {
  const redNumbersString = redNumbers.join(",");
  return `${redNumbersString}+${blueNumber}`;
}

generate.onclick = () => {
  let lotteryNumbers = generateLotteryNumbers();
  leftTextarea.value = lotteryNumbers.join("\n");
};

function excludeNumbers(arr, excludeList) {
  return arr.filter((num) => !excludeList.includes(num));
}

function createLotteryNumbers(redPool, bluePool, nums = 20) {
  const results = [];
  for (let i = 0; i < nums; i++) {
    const redBalls = [];
    while (redBalls.length < 6) {
      const redBall = redPool[Math.floor(Math.random() * redPool.length)];
      if (!redBalls.includes(redBall)) {
        redBalls.push(redBall);
      }
    }
    redBalls.sort((a, b) => a - b);
    const blueBall = bluePool[Math.floor(Math.random() * bluePool.length)];
    results.push(`${redBalls.join(",")}+${blueBall}`);
  }
  return results;
}

create.onclick = () => {
  const val = leftTextarea.value;
  if (!val) {
    alert("请生成随机号码");
    return;
  }
  const valArrs = val.split("\n");
  let redBalls = [...Array(33).keys()].map((x) => x + 1);
  let blueBalls = [...Array(16).keys()].map((x) => x + 1);
  for (let i = 0; i < valArrs.length; i++) {
    const valArr = valArrs[i];
    const redBall = valArr.split("+")[0];
    const blueBall = valArr.split("+")[1];
    const redBallArr = redBall.split(",").map(Number);
    const blueBallArr = blueBall.split(",").map(Number);
    redBalls = excludeNumbers(redBalls, redBallArr);
    blueBalls = excludeNumbers(blueBalls, blueBallArr);
  }
  let result = createLotteryNumbers(redBalls, blueBalls, 5);
  result = result.map((item) => {
    const str = item.replace("+", ",");
    return str.split(",");
  });
  createCanvas(result);
};

const createCanvas = (arr) => {
  const conArr = convertArray(arr);
  const ssqLocal = localStorage.getItem("shuangseqiu");
  if (!ssqLocal) {
    localStorage.setItem("shuangseqiu", conArr);
  } else {
    localStorage.setItem("shuangseqiu", `${ssqLocal}\n${conArr}`);
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
      if (j === cols - 1) {
        ctx.fillStyle = "rgb(71, 136, 244)";
      } else {
        ctx.fillStyle = "rgb(250, 78, 78)";
      }
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

function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

function convertArray(arr) {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    var row = arr[i];
    var rowString = row.slice(0, row.length - 1).join(", ");
    result += rowString + " - " + row[row.length - 1] + "\n";
  }
  return result.trim();
}

const wrapperLeftMask = document.querySelector(".mask_ssq");
const wrapperLeftMaskContent = wrapperLeftMask.querySelector(
  ".wrapper__left_mask_content"
);
const closeLeftDom = wrapperLeftMask.querySelector(".wrapper__left_mask_close");

check.onclick = () => {
  renderHtml();
};

closeLeftDom.onclick = () => {
  wrapperLeftMask.style.display = "none";
};

const renderHtml = () => {
  wrapperLeftMaskContent.innerHTML = "";
  const getBallData = localStorage.getItem("shuangseqiu");
  const ulDom = document.createElement("ul");
  ulDom.id = "boxUl";
  wrapperLeftMaskContent.append(ulDom);
  if (getBallData) {
    wrapperLeftMask.style.display = "flex";
    const getBallLists = getBallData.split("\n");
    if (getBallLists?.length) {
      let liHtmls = "";
      for (let i = 0; i < getBallLists.length; i++) {
        const getBallList = getBallLists[i].trim();
        const splitSymbol = getBallList.includes("-") ? "-" : "+";
        const curBall = getBallList.split(splitSymbol);
        if (curBall?.length === 2) {
          const curBallRed = (curBall[0] + "").trim();
          const curBallBlue = curBall[1].trim();
          const redArrs = curBallRed.split(",");
          let redHtml = "";
          let blueHtml = `<span class="isBlue" data-id="${curBallBlue}">${curBallBlue}</span>`;
          if (redArrs?.length) {
            for (let j = 0; j < redArrs.length; j++) {
              const redArr = (redArrs[j] + "").trim();
              redHtml += `<span class="isRed" data-id="${redArr}">${redArr}</span>`;
            }
          }
          liHtmls += `<li>${redHtml}${blueHtml}</li>`;
        }
      }
      ulDom.innerHTML = liHtmls;
      setTimeout(() => {
        getLastestData();
      }, 100);
    }
  } else {
    alert('没有存储号码')
  }
};

const getLastestData = () => {
  fetch(
    `https://www.mxnzp.com/api/lottery/common/latest?code=ssq&app_id=mfop6rrgg6fvmngd&app_secret=N1BsK2hadVZHU2hQRDQvMmRtdXBPQT09`
  )
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      if (res?.code === 1) {
        let openCode = res?.data?.openCode || "";
        const time = res?.data?.time || "";
        document.querySelector("#time__ssq").textContent = time;
        document.querySelector("#code__ssq").textContent = openCode;
        document.querySelector(".mask_ssq .wrapper__left_mask_time").style.display = "";
        // console.log('time', time)
        // const expect = res?.data?.expect || "";
        // if (time) {
        //   const boxDom = document.querySelector('#box');
        //   const expectDom = document.createElement('div');
        //   expectDom.className = 'tags';
        //   expectDom.innerText = expect
        //   boxDom.appendChild(expectDom)
        // }
        openCode = openCode.split("+");
        let openCodeRed = openCode[0].trim();
        openCodeRed = openCodeRed.split(",");
        const openCodeBlue = parseInt(openCode[1].trim());
        for (let k = 0; k < openCodeRed.length; k++) {
          const redball = parseInt(openCodeRed[k].trim());
          const getAllRed = document.querySelectorAll(
            `.isRed[data-id="${redball}"]`
          );
          getAllRed.forEach((item) => {
            item.classList.add("isActive");
          });
        }
        const getAllBlue = document.querySelectorAll(
          `.isBlue[data-id="${openCodeBlue}"]`
        );
        getAllBlue.forEach((item) => {
          item.classList.add("isActive");
        });
      }
    });
};
