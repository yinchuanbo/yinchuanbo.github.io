---
title: "一起聊聊 Symbols 在前端的几个妙用"
tag: "JavaScript"
time: 2025-02-07 09:17:27
---

## 1. JavaScript 的 Symbols 有什么用

Symbols 与其他 JavaScript 原语不同，其保证唯一性。

当开发者使用 `Symbol('description')` 创建 Symbols 时，其值永远不会与任何其他 Symbols 相同，即使是使用相同描述创建的 Symbols，这种独特性使其在特定用例中非常强大。

```js
const symbol1 = Symbol("description");
const symbol2 = Symbol("description");
console.log(symbol1 === symbol2);
// 输出 false
```

Symbols 的真正魅力在于对象处理，与字符串或数字不同，Symbols 可以用作属性键，而不会与现有属性发生冲突。这使其在向对象添加功能而不影响现有代码方面非常有用。

```js
const metadata = Symbol("elementMetadata");
function attachMetadata(element, data) {
  element[metadata] = data;
  return element;
}
const div = document.createElement("div");
const divWithMetadata = attachMetadata(div, { lastUpdated: Date.now() });
console.log(divWithMetadata[metadata]);
// {lastUpdated: 1684244400000}
```

同时，当使用 Symbol 作为属性键时，其不会显示在 `Object.keys()` 或普通 for...in 循环中。但是，开发者仍可以通过 `Object.getOwnPropertySymbols()` 访问这些属性。

```js
const nameKey = Symbol("name");
const person = {
  [nameKey]: "Alex",
  city: "London",
};
console.log(Object.getOwnPropertySymbols(person));
// [Symbol(name)]
console.log(person[nameKey]);
// 输出'Alex'
```

## 2. Symbol.for 创建全局 Symbol 注册表

全局 Symbol 注册表为 Symbol 的使用增加了另一个维度。虽然普通的 Symbol 始终是唯一的，但有时开发者确实需要在代码的不同部分之间共享 Symbol，此时就是 `Symbol.for()` 的用武之地。

```js
// 使用 Symbol.for() 在不同模块之间共享 Symbol
const PRIORITY_LEVEL = Symbol.for("priority");
const PROCESS_MESSAGE = Symbol.for("processMessage");
function createMessage(content, priority = 1) {
  const message = {
    content,
    [PRIORITY_LEVEL]: priority,
    [PROCESS_MESSAGE]() {
      return `Processing: ${this.content} (Priority: ${this[PRIORITY_LEVEL]})`;
    },
  };
  return message;
}
function processMessage(message) {
  if (message[PROCESS_MESSAGE]) {
    return message[PROCESS_MESSAGE]();
  }
  throw new Error("Invalid message format");
}
const msg = createMessage("Hello World", 2);
console.log(processMessage(msg));
// 输出 "Processing: Hello World (Priority: 2)"
console.log(Symbol.for("processMessage") === PROCESS_MESSAGE);
// 输出 true
// 常规 Symbols 永远不相等
console.log(Symbol("processMessage") === Symbol("processMessage")); // false
```

`Symbol.for` 可以保证多次调用返回的值完全相同，因此也经常用于多个模块之间的内容共享。

```js
// 模块 A 的内容
const SHARED_KEY = Symbol.for("app.sharedKey");
const moduleA = {
  [SHARED_KEY]: "secret value",
};
// 模块 B 的内容，且在不同的文件中
const sameKey = Symbol.for("app.sharedKey");
console.log(SHARED_KEY === sameKey);
// 输出 true
console.log(moduleA[sameKey]);
// 输出'secret value'
// 常规 Symbols 多次调用永远不同‘
const regularSymbol = Symbol("regular");
const anotherRegular = Symbol("regular");
console.log(regularSymbol === anotherRegular); // false
```

`Symbol.for()` 创建的 Symbol 的作用类似于共享密钥，应用程序可以通过相同的名称共享。而常规 Symbol 始终唯一，即使具有相同的名称。

## 3. 使用 Symbols 修改 JavaScript 内置行为

JavaScript 提供了众多内置 Symbol 让开发者修改对象在不同情况下的行为方式，相当于语言功能的各种钩子。

一个常见的用例是使用 `Symbol.iterator` 使对象可迭代，从而可以对对象使用 `for...of` 循环：

```js
// 添加 Symbol.iterator 让对象可迭代
const tasks = {
  items: ["write code", "review PR", "fix bugs"],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.items.length) {
          return { value: this.items[index++], done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};
for (let task of tasks) {
  console.log(task);
  // 输出值'write code', 'review PR', 'fix bugs'
}
```

另一个强大的功能是 `Symbol.toPrimitive`，其用于控制对象如何转换为数字或字符串等原始值。

```js
const user = {
  name: "Alex",
  score: 42,
  [Symbol.toPrimitive](hint) {
    // JavaScript 引擎使用 hint 参数表示类型
    // hint 可以是'number', 'string', or 'default'
    switch (hint) {
      case "number":
        return this.score;
      case "string":
        return this.name;
      default:
        return `${this.name} (${this.score})`;
      // 其他例如  user + ''
    }
  },
};
console.log(+user);
// + 操作符表示想要数字，输出 42
console.log(`${user}`);
// 模板字符串表示需要字符串, 输出 "Alex"
console.log(user + "");
// `+ 字符串 ` 表示 "Alex (42)"
```

当然，开发者还可以通过 `Symbol.hasInstance` 修改 instanceof 的默认行为，比如下面的 JSONArray 对象：

```js
class JSONArray {
  constructor() {
    this.items = [];
  }
  // 自定义 instanceof 行为
  static [Symbol.hasInstance](instance) {
    return instance && typeof instance === "object" && "items" in instance;
  }
}
```

此时，下面代码的 instanceof 将直接输出 true:

```js
const a = { items: [] };
a instanceof JSONArray; // 输出 true
```

## 4. 使用 Symbol.species 进行继承控制

在 JavaScript 中使用数组时有时需要限制可以保存的值类型，这时就需要使用专用数组，不过值得注意的是其可能导致 `map()` 和 `filter()` 等方法出现意外行为。

```js
const createNumberArray = (...numbers) => {
  const array = [...numbers];
  array.push = function (item) {
    if (typeof item !== "number") {
      throw new Error("Only numbers allowed");
    }
    return Array.prototype.push.call(this, item);
  };
  // 告诉 JavaScript 引擎使用常规数组方法，例如：map
  // 此时 map 派生数组不受影响
  Object.defineProperty(array.constructor, Symbol.species, {
    get: function () {
      return Array;
    },
  });
  return array;
};
const nums = createNumberArray(1, 2, 3);
nums.push(4);
// Works ✅
nums.push("5");
// Error! ❌ (as expected for nums)
const doubled = nums.map((x) => x * 2);
doubled.push("6");
// Works! ✅ (doubled is a regular array)
```

## 5. Symbol 限制和陷阱

在 JSON 中使用 Symbol 需要特别注意，例如：Symbol 属性在 JSON 序列化过程中将完全消失，这一点与 React 利用 Symbol 防止服务器端 JSON 漏洞非常类似。

```js
const API_KEY = Symbol("apiKey");
// 将 Symbol 用于属性 Key
const userData = {
  [API_KEY]: "abc123xyz",
  //  Symbol 用于隐藏的 API key
  username: "alex",
  // 常规属性
};
console.log(userData[API_KEY]);
// 输出值: 'abc123xyz'
// 序列化后 Symbol 完全丢失
const savedData = JSON.stringify(userData);
console.log(savedData);
// 打印: {"username":"alex"}
```

同时，Symbols 的字符串强制转换会导致另一个常见的陷阱。虽然开发者可能期望 Symbols 像其他基本类型一样工作，但它们对类型转换有严格的规则：

```js
const label = Symbol("myLabel");
// 抛出类型错误
console.log(label + "is my label");
// 开发者必须显式转化为 String
console.log(String(label) + "is my label");
// 输出值 "Symbol(myLabel) is my label"
```

使用 Symbol 进行内存管理比较棘手，尤其是在使用全局 Symbol 注册表时。当没有引用时，常规 Symbol 可以被垃圾收集，但注册表 Symbol 会保留下来：

```js
// 常规 Symbol 可以垃圾回收
let regularSymbol = Symbol("temp");
regularSymbol = null;
// 注册表 Registry Symbol 保留
Symbol.for("permanent");
// 即使没用引用也会保留
console.log(Symbol.for("permanent") === Symbol.for("permanent"));
// 输出 true
```
