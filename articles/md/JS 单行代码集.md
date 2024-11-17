---
title: "25 个杀手级 JavaScript 单行代码"
tag: "JavaScript"
time: 2024-08-30 17:34:29
---

1. 将内容复制到剪贴板为了提高网站的用户体验，我们经常需要将内容复制到剪贴板，以便用户将其粘贴到指定位置。

```js
const copyToClipboard = (content) => navigator.clipboard.writeText(content);
copyToClipboard("Hello fatfish");
```

2. 获取鼠标选择

我们需要获取用户选择的内容

```js
const getSelectedText = () => window.getSelection().toString();
getSelectedText();
```

3. 打乱数组

```js
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
shuffleArray([1, 2, 3, 4, -1, 0]); // [3, 1, 0, 2, 4, -1]
```

4. 将 rgba 转换为十六进制

我们可以将 rgba 和十六进制颜色值相互转换。

```js
const rgbaToHex = (r, g, b) =>
  "#" +
  [r, g, b].map((num) => parseInt(num).toString(16).padStart(2, "0")).join("");
rgbaToHex(0, 0, 0); // #000000rgbaToHex(255, 0, 127) //#ff007f
```

5. 将十六进制转换为 rgba

```js
const hexToRgba = hex => {  const [r, g, b] = hex.match(/\w\w/g).map(val => parseInt(val, 16))  return `rgba(${r}, ${g}, ${b}, 1)`;}
hexToRgba('#000000') // rgba(0, 0, 0, 1)hexToRgba('#ff007f') // rgba(255, 0, 127, 1)
```

6. 获取多个数字的平均值

使用 reduce 我们可以非常方便地获取一组数组的平均值。

```js
const average = (...args) => args.reduce((a, b) => a + b, 0) / args.length;
average(0, 1, 2, -1, 9, 10); // 3.5
```

7. 检查数字是偶数还是奇数

你如何判断数字是奇数还是偶数？

```js
const isEven = (num) => num % 2 === 0;
isEven(2); // trueisEven(1) // false
```

8. 删除数组中的重复元素

要删除数组中的重复元素，使用 Set 会变得非常容易。

```js
const uniqueArray = (arr) => [...new Set(arr)];
uniqueArray([1, 1, 2, 3, 4, 5, -1, 0]); // [1, 2, 3, 4, 5, -1, 0]
```

9. 检查对象是否为空对象

```js
const isEmpty = (obj) =>
  Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;
isEmpty({}); // trueisEmpty({ name: 'fatfish' }) // false
```

10. 反转字符串

```js
const reverseStr = (str) => str.split("").reverse().join("");
reverseStr("fatfish"); // hsiftaf
```

11. 计算两个日期之间的间隔

```js
const dayDiff = (d1, d2) =>
  Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / 86400000);
dayDiff(new Date("2023-06-23"), new Date("1997-05-31")); // 9519
```

12. 找出日期所在的年份

```js
const dayInYear = (d) =>
  Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
dayInYear(new Date("2023/06/23")); // 174
```

13. 将字符串的首字母大写

```js
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
capitalize("hello fatfish"); // Hello fatfish
```

14. 生成指定长度的随机字符串

```js
const generateRandomString = (length) =>
  [...Array(length)].map(() => Math.random().toString(36)[2]).join("");
generateRandomString(12); // cysw0gfljoyxgenerateRandomString(12) // uoqaugnm8r4s
```

15. 获取两个整数之间的随机整数

```js
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
random(1, 100); // 27
random(1, 100); // 84
random(1, 100); // 55
```

16. 指定数字四舍五入

```js
const round = (n, d) => Number(Math.round(n + "e" + d) + "e-" + d);
round(3.1415926, 3); //3.142
round(3.1415926, 1); //3.1
```

17. 清除所有 cookie

```js
const clearCookies = document.cookie
  .split(";")
  .forEach(
    (cookie) =>
      (document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`))
  );
```

18. 检测是否为暗模式

```js
const isDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
console.log(isDarkMode);
```

19. 滚动到页面顶部

```js
const goToTop = () => window.scrollTo(0, 0);
goToTop();
```

20. 确定是否为 Apple 设备

```js
const isAppleDevice = () => /Mac|iPod|iPhone|iPad/.test(navigator.platform);
isAppleDevice();
```

21. 随机布尔值

```js
const randomBoolean = () => Math.random() >= 0.5;
randomBoolean();
```

22. 获取变量的类型

```js
const typeOf = (obj) =>
  Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
typeOf(""); // string
typeOf(0); // number
typeOf(); // undefined
typeOf(null); // null
typeOf({}); // object
typeOf([]); // array
typeOf(0); // number
typeOf(() => {}); // function
```

23. 确定当前选项卡是否处于活动状态

```js
const checkTabInView = () => !document.hidden;
```

24. 检查元素是否处于焦点

```js
const isFocus = (ele) => ele === document.activeElement;
```

25. 随机 IP

```js
const generateRandomIP = () => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(
    "."
  );
};
generateRandomIP(); // 220.187.184.113
generateRandomIP(); // 254.24.179.151
```
