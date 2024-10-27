---
title: "ES6 yield 关键字原来还可以这样用"
tag: "生成器与迭代器"
time: 2024-10-03 21:49:11
---

你是否曾经感到 JavaScript 中的异步编程让人头疼?或者想要创建一个可以按需生成值的函数?如果是,那么 ES6 中的`yield`关键字可能正是你需要的！让我们深入探讨 yield 的用法,并通过与普通函数的对比来突出它的优势。

## 什么是 yield?

简单来说,`yield`是一个特殊的关键字,用在生成器函数中。它的作用是暂停函数的执行,并返回一个值。当函数被再次调用时,它会从上次暂停的地方继续执行。

## 示例 1. 创建一个简单的计数器

### 使用 yield 的生成器函数:

```js
function* counterWithYield() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const genCounter = counterWithYield();
console.log(genCounter.next().value); // 输出: 0
console.log(genCounter.next().value); // 输出: 1
console.log(genCounter.next().value); // 输出: 2
```

### 对比：普通函数实现

```js
function counterWithoutYield() {
  let count = 0;
  return function () {
    return count++;
  };
}

const normalCounter = counterWithoutYield();
console.log(normalCounter()); // 输出: 0
console.log(normalCounter()); // 输出: 1
console.log(normalCounter()); // 输出: 2
```

「优势对比」

1. 使用 yield 的版本可以直接作为迭代器使用,更加灵活。
2. 生成器函数的状态管理更加直观,不需要闭包。

## 示例 2. 实现斐波那契数列

### 使用 yield 的生成器函数:

```js
function* fibonacciWithYield() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}
const fib = fibonacciWithYield();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value);
}
// 输出: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55
```

### 对比：普通函数实现

```js
function fibonacciWithoutYield(n) {
  const result = [1, 1];
  for (let i = 2; i < n; i++) {
    result[i] = result[i - 1] + result[i - 2];
  }
  return result;
}

console.log(fibonacciWithoutYield(10));
// 输出: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```

「优势对比」

1. 使用 yield 的版本可以生成无限序列,而不会耗尽内存。
2. 只在需要时才计算下一个值,实现了惰性计算。
3. 可以轻松地获取任意数量的斐波那契数,而不需要预先指定。

## 示例 3. 异步流程控制

### 使用 yield 的生成器函数:

```js
function* fetchUserDataWithYield(userId) {
  const user = yield fetch(`https://api.example.com/users/${userId}`).then(
    (r) => r.json()
  );
  const posts = yield fetch(
    `https://api.example.com/posts?userId=${user.id}`
  ).then((r) => r.json());
  return { user, posts };
}

function runGenerator(gen) {
  const g = gen();
  function next(data) {
    const result = g.next(data);
    if (result.done) return result.value;
    return result.value.then(next);
  }
  return next();
}

runGenerator(fetchUserDataWithYield).then((data) => console.log(data));
```

### 对比：普通函数实现（使用 Promise）

```js
function fetchUserDataWithoutYield(userId) {
  return fetch(`https://api.example.com/users/${userId}`)
    .then((r) => r.json())
    .then((user) => {
      return fetch(`https://api.example.com/posts?userId=${user.id}`)
        .then((r) => r.json())
        .then((posts) => {
          return { user, posts };
        });
    });
}

fetchUserDataWithoutYield(1).then((data) => console.log(data));
```

「优势对比」

1. 使用 yield 的版本看起来更像同步代码,更容易理解和维护。
2. 避免了"回调地狱"或深层嵌套的 Promise。
3. 错误处理更直观,可以使用 try/catch。

## 示例 4. 实现可中断的遍历

### 使用 yield 的生成器函数:

```js
function* traverseWithYield(tree) {
  yield tree.value;
  for (let child of tree.children) {
    yield* traverseWithYield(child);
  }
}

const tree = {
  value: "root",
  children: [
    { value: "child1", children: [] },
    { value: "child2", children: [{ value: "grandchild", children: [] }] },
  ],
};

const gen = traverseWithYield(tree);
console.log(gen.next().value); // 'root'
console.log(gen.next().value); // 'child1'
console.log(gen.next().value); // 'child2'
console.log(gen.next().value); // 'grandchild'
```

### 对比：普通函数实现

```js
function traverseWithoutYield(tree) {
  const result = [];
  function traverse(node) {
    result.push(node.value);
    for (let child of node.children) {
      traverse(child);
    }
  }
  traverse(tree);
  return result;
}

console.log(traverseWithoutYield(tree)); // ['root', 'child1', 'child2', 'grandchild']
```

「优势对比」

1. 使用 yield 的版本可以随时暂停和恢复遍历过程。
2. 内存效率更高,特别是对于大型数据结构。
3. 可以轻松实现"懒加载" 式的遍历。

## yield 的优势总结

1. 「简化异步编程」: 使复杂的异步操作看起来像同步代码。
2. 「惰性计算」: 只在需要时才生成值,节省内存。
3. 「无限序列」: 可以表示理论上无限的序列,而不会耗尽内存。
4. 「双向通信」: 生成器函数可以暂停执行并等待外部输入。
5. 「状态管理」: 生成器函数可以更容易地管理复杂的状态。
6. 「可中断性」: 可以在任意点暂停和恢复执行。
7. 「代码组织」: 使得某些算法的实现更加直观和易于理解。
