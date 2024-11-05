function generateLotteryNumbers(nums = 5) {
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
  const redNumbersString = redNumbers.join(',');
  return `${redNumbersString} + ${blueNumber}`;
}

generate.onclick = () => {
  let lotteryNumbers = generateLotteryNumbers();
  leftTextarea.value = lotteryNumbers.join("\n")
}

function excludeNumbers(arr, excludeList) {
  return arr.filter(num => !excludeList.includes(num));
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
    results.push(`${redBalls.join(',')} + ${blueBall}`);
  }
  return results;
}


create.onclick = () => {
  const val = leftTextarea.value;
  if (!val) {
    alert("请生成随机号码")
    return;
  }
  const valArrs = val.split("\n")
  let redBalls = [...Array(33).keys()].map((x) => x + 1);
  let blueBalls = [...Array(16).keys()].map((x) => x + 1);
  for (let i = 0; i < valArrs.length; i++) {
    const valArr = valArrs[i];
    const redBall = valArr.split("+")[0]
    const blueBall = valArr.split("+")[1]
    const redBallArr = redBall.split(',').map(Number);
    const blueBallArr = blueBall.split(',').map(Number);
    redBalls = excludeNumbers(redBalls, redBallArr)
    blueBalls = excludeNumbers(blueBalls, blueBallArr)
  }
  const result = createLotteryNumbers(redBalls, blueBalls, 5);
  console.log('result', result)
}

