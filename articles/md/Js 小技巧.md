---
title: "Js 小技巧"
tag: "Js"
time: 2024-11-02 16:31:49
---

## 1. +new Date()：时间戳的骚操作

你可能知道 `new Date().getTime()` 可以获取当前时间的时间戳，但我们可以更简单：

```js
console.log(+new Date()); // 类似：1696871204353
```

只需要一个 `+`，就能把 `Date` 对象转换为数字，也就是时间戳。这个技巧利用了 `+` 号的隐式转换功能，比 `new Date().getTime()` 简洁不少。看似很骚气，实际上非常实用！

## 2. ~ 操作符：查找数组元素的新姿势

当你用 `indexOf()` 查找数组中某个元素时，通常要这么写：

```js
if (arr.indexOf(2) !== -1) {
  // 找到了
}
```

有点冗长是不是？试试这个骚操作：

```js
if (~arr.indexOf(2)) {
  // 找到了
}
```

这行代码看着有点让人摸不着头脑。其实，`~` 是按位非操作符，它会把一个数的每一位取反。因为 `indexOf` 找不到元素时返回 `-1`，`~-1` 变成了 `0`，这是 falsy 值；如果找到了，返回的索引经过 `~` 后则是 truthy 值。这样你就可以省去多余的 `!== -1`，一行搞定查找。

## 3. !! 双重否定：真假判断的捷径

```js
console.log(!!1); // true
console.log(!!0); // false
console.log(!!"hello"); // true
console.log(!!""); // false
```

`!!` 是双重否定，先将值转换成布尔值，再否定两次。这个技巧让你可以快速判断值的 truthiness，无论是数字、字符串、对象等，都可以简洁地转换为布尔类型。

## 4. 取整的小技巧

要去掉小数部分，你可能会习惯用 `Math.floor()` 之类的函数。骚操作来了，以下方法能让你不依赖取整函数，快速完成任务：

- `~~` 双取反：

```js
console.log(~~4.9); // 4
console.log(~~-4.9); // -4
```

这个操作符会把数字转换为 32 位整数，类似于 `Math.floor()` 的效果，但更简洁。

- 按位或 | 0：

```js
console.log(4.9 | 0); // 4
console.log(-4.9 | 0); // -4
```

这个技巧同样去掉小数部分，但比 `~~` 更常见。

- Math.trunc()：

如果你不想搞复杂，可以直接用 `Math.trunc()`，它是专门为截断小数部分设计的：

```js
console.log(Math.trunc(4.9)); // 4
console.log(Math.trunc(-4.9)); // -4
```

这些方法不仅能让代码简洁，而且在处理大多数情况下都非常高效。

## 5. 短路运算符：简化条件判断

JavaScript 的 `||` 和 `&&` 不仅可以用来做逻辑判断，还能帮你写出更简洁的代码。

比如，你想给函数参数设置默认值：

```js
function greet(name) {
  name = name || "匿名";
  console.log("你好，" + name);
}
```

如果 `name` 是 falsy 值（如 `undefined`），`||` 会让 `name` 取默认值 `'匿名'`。同样地，`&&` 也能让逻辑判断更短更直观：

```js
const isLoggedIn = true;
isLoggedIn && console.log("欢迎回来！"); // 条件成立，打印消息
```

## 6. 解构赋值：优雅地提取对象属性

解构赋值让你可以优雅地从对象中提取属性。假设你有一个嵌套的用户信息对象：

```js
const user = {
  name: "Alice",
  address: {
    city: "Wonderland",
    zip: "12345",
  },
};
```

你可以这样直接提取属性：

```js
const {
  name,
  address: { city },
} = user;
console.log(name); // Alice
console.log(city); // Wonderland
```

解构赋值避免了反复使用点运算符，让代码简洁易读，尤其在处理复杂嵌套对象时非常有用。

## 7. 标签模板字符串：灵活处理字符串

ES6 的模板字符串你可能用过，写起来很方便：

```js
const name = "Alice";
console.log(`Hello, ${name}!`);
```

但骚气一点的玩法是标签模板字符串，它允许你自定义模板字符串的处理逻辑。来看个例子：

```js
function myTag(strings, ...values) {
  return strings
    .reduce((acc, str, i) => acc + str + (values[i] || ""), "")
    .toUpperCase();
}

const name = "Alice";
const place = "Wonderland";
console.log(myTag`Hello ${name} from ${place}!`); // "HELLO ALICE FROM WONDERLAND!"
```

这个标签模板函数会把字符串和插值内容拼接起来并全部转换成大写。标签模板可以处理复杂的模板场景，如格式化字符串、国际化等，非常灵活。

## 8. 数组展开运算符 ...：数组处理的万能钥匙

`...` 操作符不仅可以用来合并数组，还能快速展开数组元素：

```js
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]
```

展开运算符还能将数组传递为函数参数：

```js
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6
```

不管是合并数组还是传参，`...` 都能让代码更清晰简洁。