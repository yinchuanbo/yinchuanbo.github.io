---
title: "前端 reduce 函数100 种使用方法整理"
tag: "JavaScript"
time: 2025-01-08 09:37:11
---

## reduce 函数概述

`reduce` 是 JavaScript 数组的一个高阶函数，它对数组中的每个元素执行一个由你提供的“reducer”回调函数，将其结果汇总为单个返回值。`reduce` 函数的核心思想是将数组中的多个值“归约”为一个值。

## reduce 函数的语法

```js
array.reduce(reducerFunction, initialValue);
```

- `reducerFunction`: 一个回调函数，它接收四个参数：

  - `accumulator`: 累加器，它会累积回调函数的返回值。它是上一次回调函数返回的值，或者是 `initialValue`（如果提供了）。
  - `currentValue`: 当前正在处理的数组元素。
  - `currentIndex`: 当前正在处理的数组元素的索引。
  - `array`: 调用 `reduce` 的数组本身。

- `initialValue`: 可选参数，作为第一次调用 `reducerFunction` 时 `accumulator` 的初始值。如果未提供，则使用数组的第一个元素作为初始值，并且会跳过第一个元素。

## reduce 函数的工作原理

1. **初始化:**
   - 如果提供了 `initialValue`，则 `accumulator` 初始化为 `initialValue`，并且 `reducerFunction` 从数组的第一个元素开始执行。
   - 如果没有提供 `initialValue`，则 `accumulator` 初始化为数组的第一个元素，并且 `reducerFunction` 从数组的第二个元素开始执行。
2. **迭代:**
   - `reducerFunction` 会遍历数组中的每个元素（或从第二个元素开始，如果没有 `initialValue`）。
   - 在每次迭代中，`reducerFunction` 会被调用，并接收 `accumulator`、`currentValue`、`currentIndex` 和 `array` 作为参数。
   - `reducerFunction` 的返回值会成为下一次迭代的 `accumulator`。
3. **返回结果:**
   - 当数组中的所有元素都被处理完毕后，`reduce` 函数会返回最终的 `accumulator` 的值。

## reduce 函数的常见用途

1. **求和:** 计算数组中所有元素的总和。
2. **求积:** 计算数组中所有元素的乘积。
3. **查找最大值/最小值:** 找出数组中的最大值或最小值。
4. **数组扁平化:** 将多维数组转换为一维数组。
5. **对象属性计数:** 统计数组中对象属性的出现次数。
6. **分组数据:** 根据特定条件将数组中的元素分组。
7. **管道操作:** 将多个函数串联起来处理数据。

## 代码示例

涵盖了 `reduce` 函数的各种用途，并附有详细的注释。

```js
// 1. 求和
function sumArray(arr) {
  return arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

const numbers = [1, 2, 3, 4, 5];
console.log("1. 求和:", sumArray(numbers)); // 输出: 15

// 2. 求积
function productArray(arr) {
  return arr.reduce(
    (accumulator, currentValue) => accumulator * currentValue,
    1
  );
}

console.log("2. 求积:", productArray(numbers)); // 输出: 120

// 3. 查找最大值
function findMax(arr) {
  return arr.reduce((accumulator, currentValue) =>
    Math.max(accumulator, currentValue)
  );
}

console.log("3. 查找最大值:", findMax(numbers)); // 输出: 5

// 4. 查找最小值
function findMin(arr) {
  return arr.reduce((accumulator, currentValue) =>
    Math.min(accumulator, currentValue)
  );
}

console.log("4. 查找最小值:", findMin(numbers)); // 输出: 1

// 5. 数组扁平化
function flattenArray(arr) {
  return arr.reduce((accumulator, currentValue) => {
    return accumulator.concat(
      Array.isArray(currentValue) ? flattenArray(currentValue) : currentValue
    );
  }, []);
}

const nestedArray = [1, [2, 3], [4, [5, 6]]];
console.log("5. 数组扁平化:", flattenArray(nestedArray)); // 输出: [1, 2, 3, 4, 5, 6]

// 6. 对象属性计数
function countProperties(arr, property) {
  return arr.reduce((accumulator, currentValue) => {
    if (currentValue.hasOwnProperty(property)) {
      accumulator[currentValue[property]] =
        (accumulator[currentValue[property]] || 0) + 1;
    }
    return accumulator;
  }, {});
}

const users = [
  { name: "Alice", city: "New York" },
  { name: "Bob", city: "London" },
  { name: "Charlie", city: "New York" },
  { name: "David", city: "Paris" },
  { name: "Eve", city: "London" },
];

console.log("6. 对象属性计数:", countProperties(users, "city")); // 输出: { 'New York': 2, London: 2, Paris: 1 }

// 7. 分组数据
function groupBy(arr, key) {
  return arr.reduce((accumulator, currentValue) => {
    const groupKey = currentValue[key];
    if (!accumulator[groupKey]) {
      accumulator[groupKey] = [];
    }
    accumulator[groupKey].push(currentValue);
    return accumulator;
  }, {});
}

console.log("7. 分组数据:", groupBy(users, "city"));
// 输出:
// {
//   'New York': [
//     { name: 'Alice', city: 'New York' },
//     { name: 'Charlie', city: 'New York' }
//   ],
//   London: [
//     { name: 'Bob', city: 'London' },
//     { name: 'Eve', city: 'London' }
//   ],
//   Paris: [ { name: 'David', city: 'Paris' } ]
// }

// 8. 管道操作
function pipe(...fns) {
  return (initialValue) =>
    fns.reduce((accumulator, fn) => fn(accumulator), initialValue);
}

function add(x) {
  return x + 2;
}

function multiply(x) {
  return x * 3;
}

function subtract(x) {
  return x - 1;
}

const pipeline = pipe(add, multiply, subtract);
console.log("8. 管道操作:", pipeline(5)); // 输出: 20 ( (5 + 2) * 3 - 1 )

// 9. 字符串反转
function reverseString(str) {
  return str
    .split("")
    .reduce((accumulator, currentValue) => currentValue + accumulator, "");
}

console.log("9. 字符串反转:", reverseString("hello")); // 输出: olleh

// 10. 数组去重
function uniqueArray(arr) {
  return arr.reduce((accumulator, currentValue) => {
    if (!accumulator.includes(currentValue)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

const duplicateArray = [1, 2, 2, 3, 4, 4, 5];
console.log("10. 数组去重:", uniqueArray(duplicateArray)); // 输出: [1, 2, 3, 4, 5]

// 11. 处理异步操作 (Promise 串行执行)
async function asyncOperation(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value * 2);
    }, 500);
  });
}

async function processAsyncOperations(arr) {
  return arr.reduce(async (accumulatorPromise, currentValue) => {
    const accumulator = await accumulatorPromise;
    const result = await asyncOperation(currentValue);
    return accumulator.concat(result);
  }, Promise.resolve([]));
}

async function runAsyncExample() {
  const asyncNumbers = [1, 2, 3];
  const results = await processAsyncOperations(asyncNumbers);
  console.log("11. 处理异步操作:", results); // 输出: [2, 4, 6] (大约 1.5 秒后)
}

runAsyncExample();

// 12. 构建复杂的对象
function buildComplexObject(arr) {
  return arr.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue;
    const keys = key.split(".");
    let current = accumulator;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) {
        current[k] = {};
      }
      current = current[k];
    }
    current[keys[keys.length - 1]] = value;
    return accumulator;
  }, {});
}

const data = [
  ["a.b.c", 1],
  ["a.b.d", 2],
  ["a.e", 3],
  ["f", 4],
];

console.log("12. 构建复杂的对象:", buildComplexObject(data));
// 输出:
// {
//   a: { b: { c: 1, d: 2 }, e: 3 },
//   f: 4
// }

// 13. 实现函数组合 (更灵活的 pipe)
function compose(...fns) {
  return (initialValue) =>
    fns.reduceRight((accumulator, fn) => fn(accumulator), initialValue);
}

const composedPipeline = compose(subtract, multiply, add);
console.log("13. 函数组合:", composedPipeline(5)); // 输出: 18 ( (5 + 2) * 3 - 1 )

// 14. 数据转换
function transformData(arr) {
  return arr.reduce((accumulator, currentValue) => {
    const { id, name, details } = currentValue;
    const transformedDetails = details.map((detail) => ({
      ...detail,
      full_name: `${name} - ${detail.description}`,
    }));
    accumulator[id] = {
      name,
      details: transformedDetails,
    };
    return accumulator;
  }, {});
}

const rawData = [
  {
    id: 1,
    name: "Product A",
    details: [
      { description: "Detail 1", price: 10 },
      { description: "Detail 2", price: 20 },
    ],
  },
  {
    id: 2,
    name: "Product B",
    details: [
      { description: "Detail 3", price: 30 },
      { description: "Detail 4", price: 40 },
    ],
  },
];

console.log("14. 数据转换:", transformData(rawData));
// 输出:
// {
//   '1': {
//     name: 'Product A',
//     details: [
//       { description: 'Detail 1', price: 10, full_name: 'Product A - Detail 1' },
//       { description: 'Detail 2', price: 20, full_name: 'Product A - Detail 2' }
//     ]
//   },
//   '2': {
//     name: 'Product B',
//     details: [
//       { description: 'Detail 3', price: 30, full_name: 'Product B - Detail 3' },
//       { description: 'Detail 4', price: 40, full_name: 'Product B - Detail 4' }
//     ]
//   }
// }

// 15. 自定义累加器 (使用对象)
function customAccumulator(arr) {
  return arr.reduce(
    (accumulator, currentValue) => {
      if (currentValue > 0) {
        accumulator.positive.push(currentValue);
      } else if (currentValue < 0) {
        accumulator.negative.push(currentValue);
      } else {
        accumulator.zero.push(currentValue);
      }
      return accumulator;
    },
    { positive: [], negative: [], zero: [] }
  );
}

const mixedNumbers = [-2, 1, 0, 3, -1, 0, 5];
console.log("15. 自定义累加器:", customAccumulator(mixedNumbers));
// 输出:
// { positive: [ 1, 3, 5 ], negative: [ -2, -1 ], zero: [ 0, 0 ] }

// 16. 使用 reduce 实现 map
function customMap(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    accumulator.push(callback(currentValue, index, array));
    return accumulator;
  }, []);
}

const mapNumbers = [1, 2, 3, 4];
const mappedNumbers = customMap(mapNumbers, (num) => num * 2);
console.log("16. 使用 reduce 实现 map:", mappedNumbers); // 输出: [2, 4, 6, 8]

// 17. 使用 reduce 实现 filter
function customFilter(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    if (callback(currentValue, index, array)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

const filterNumbers = [1, 2, 3, 4, 5, 6];
const filteredNumbers = customFilter(filterNumbers, (num) => num % 2 === 0);
console.log("17. 使用 reduce 实现 filter:", filteredNumbers); // 输出: [2, 4, 6]

// 18. 使用 reduce 实现 find
function customFind(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    if (accumulator !== undefined) {
      return accumulator;
    }
    if (callback(currentValue, index, array)) {
      return currentValue;
    }
    return undefined;
  }, undefined);
}

const findNumbers = [1, 2, 3, 4, 5];
const foundNumber = customFind(findNumbers, (num) => num > 3);
console.log("18. 使用 reduce 实现 find:", foundNumber); // 输出: 4

// 19. 使用 reduce 实现 findIndex
function customFindIndex(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    if (accumulator !== -1) {
      return accumulator;
    }
    if (callback(currentValue, index, array)) {
      return index;
    }
    return -1;
  }, -1);
}

const findIndexNumbers = [1, 2, 3, 4, 5];
const foundIndex = customFindIndex(findIndexNumbers, (num) => num > 3);
console.log("19. 使用 reduce 实现 findIndex:", foundIndex); // 输出: 3

// 20. 使用 reduce 实现 every
function customEvery(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return accumulator && callback(currentValue, index, array);
  }, true);
}

const everyNumbers = [2, 4, 6, 8];
const allEven = customEvery(everyNumbers, (num) => num % 2 === 0);
console.log("20. 使用 reduce 实现 every:", allEven); // 输出: true

const notAllEvenNumbers = [2, 4, 5, 8];
const notAllEven = customEvery(notAllEvenNumbers, (num) => num % 2 === 0);
console.log("20. 使用 reduce 实现 every:", notAllEven); // 输出: false

// 21. 使用 reduce 实现 some
function customSome(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return accumulator || callback(currentValue, index, array);
  }, false);
}

const someNumbers = [1, 3, 5, 8];
const hasEven = customSome(someNumbers, (num) => num % 2 === 0);
console.log("21. 使用 reduce 实现 some:", hasEven); // 输出: true

const noEvenNumbers = [1, 3, 5, 7];
const noEven = customSome(noEvenNumbers, (num) => num % 2 === 0);
console.log("21. 使用 reduce 实现 some:", noEven); // 输出: false

// 22. 使用 reduce 实现 flatMap
function customFlatMap(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return accumulator.concat(callback(currentValue, index, array));
  }, []);
}

const flatMapNumbers = [1, 2, 3];
const flatMappedNumbers = customFlatMap(flatMapNumbers, (num) => [
  num,
  num * 2,
]);
console.log("22. 使用 reduce 实现 flatMap:", flatMappedNumbers); // 输出: [1, 2, 2, 4, 3, 6]

// 23. 使用 reduce 实现 reduceRight
function customReduceRight(arr, callback, initialValue) {
  const reversedArr = [...arr].reverse();
  return reversedArr.reduce(callback, initialValue);
}

const reduceRightNumbers = [1, 2, 3, 4];
const reducedRightResult = customReduceRight(
  reduceRightNumbers,
  (acc, curr) => acc - curr,
  10
);
console.log("23. 使用 reduce 实现 reduceRight:", reducedRightResult); // 输出: 0 (10 - 4 - 3 - 2 - 1)

// 24. 使用 reduce 实现 groupBy with custom key function
function customGroupBy(arr, keyFunction) {
  return arr.reduce((accumulator, currentValue) => {
    const key = keyFunction(currentValue);
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(currentValue);
    return accumulator;
  }, {});
}

const customGroupUsers = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 35 },
];

const groupedByAge = customGroupBy(customGroupUsers, (user) => user.age);
console.log(
  "24. 使用 reduce 实现 groupBy with custom key function:",
  groupedByAge
);
// 输出:
// {
//   '25': [ { name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 } ],
//   '30': [ { name: 'Bob', age: 30 } ],
//   '35': [ { name: 'David', age: 35 } ]
// }

// 25. 使用 reduce 实现 partition
function customPartition(arr, callback) {
  return arr.reduce(
    (accumulator, currentValue, index, array) => {
      if (callback(currentValue, index, array)) {
        accumulator[0].push(currentValue);
      } else {
        accumulator[1].push(currentValue);
      }
      return accumulator;
    },
    [[], []]
  );
}

const partitionNumbers = [1, 2, 3, 4, 5, 6];
const [evenNumbers, oddNumbers] = customPartition(
  partitionNumbers,
  (num) => num % 2 === 0
);
console.log("25. 使用 reduce 实现 partition:", evenNumbers, oddNumbers); // 输出: [2, 4, 6] [1, 3, 5]

// 26. 使用 reduce 实现 chunk
function customChunk(arr, size) {
  return arr.reduce((accumulator, currentValue, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!accumulator[chunkIndex]) {
      accumulator[chunkIndex] = [];
    }
    accumulator[chunkIndex].push(currentValue);
    return accumulator;
  }, []);
}

const chunkNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
const chunkedNumbers = customChunk(chunkNumbers, 3);
console.log("26. 使用 reduce 实现 chunk:", chunkedNumbers); // 输出: [[1, 2, 3], [4, 5, 6], [7, 8]]

// 27. 使用 reduce 实现 zip
function customZip(...arrays) {
  return arrays[0].reduce((accumulator, _, index) => {
    const zipped = arrays.map((arr) => arr[index]);
    accumulator.push(zipped);
    return accumulator;
  }, []);
}

const zipArrays1 = [1, 2, 3];
const zipArrays2 = ["a", "b", "c"];
const zipArrays3 = [true, false, true];
const zippedArrays = customZip(zipArrays1, zipArrays2, zipArrays3);
console.log("27. 使用 reduce 实现 zip:", zippedArrays); // 输出: [[1, 'a', true], [2, 'b', false], [3, 'c', true]]

// 28. 使用 reduce 实现 unzip
function customUnzip(arr) {
  if (!arr || arr.length === 0) {
    return [];
  }
  const numArrays = arr[0].length;
  return arr.reduce(
    (accumulator, current) => {
      current.forEach((value, index) => {
        if (!accumulator[index]) {
          accumulator[index] = [];
        }
        accumulator[index].push(value);
      });
      return accumulator;
    },
    Array.from({ length: numArrays }, () => [])
  );
}

const unzipArrays = [
  [1, "a", true],
  [2, "b", false],
  [3, "c", true],
];
const unzippedArrays = customUnzip(unzipArrays);
console.log("28. 使用 reduce 实现 unzip:", unzippedArrays); // 输出: [[1, 2, 3], ['a', 'b', 'c'], [true, false, true]]

// 29. 使用 reduce 实现 countBy
function customCountBy(arr, keyFunction) {
  return arr.reduce((accumulator, currentValue) => {
    const key = keyFunction(currentValue);
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

const countByUsers = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 35 },
];

const countedByAge = customCountBy(countByUsers, (user) => user.age);
console.log("29. 使用 reduce 实现 countBy:", countedByAge); // 输出: { '25': 2, '30': 1, '35': 1 }

// 30. 使用 reduce 实现 sumBy
function customSumBy(arr, keyFunction) {
  return arr.reduce((accumulator, currentValue) => {
    const value = keyFunction(currentValue);
    return accumulator + value;
  }, 0);
}

const sumByUsers = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 35 },
];

const sumOfAges = customSumBy(sumByUsers, (user) => user.age);
console.log("30. 使用 reduce 实现 sumBy:", sumOfAges); // 输出: 115

// 31. 使用 reduce 实现 minBy
function customMinBy(arr, keyFunction) {
  return arr.reduce((accumulator, currentValue) => {
    const currentKey = keyFunction(currentValue);
    if (accumulator === undefined || currentKey < keyFunction(accumulator)) {
      return currentValue;
    }
    return accumulator;
  }, undefined);
}

const minByUsers = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 20 },
  { name: "David", age: 35 },
];

const minAgeUser = customMinBy(minByUsers, (user) => user.age);
console.log("31. 使用 reduce 实现 minBy:", minAgeUser); // 输出: { name: 'Charlie', age: 20 }

// 32. 使用 reduce 实现 maxBy
function customMaxBy(arr, keyFunction) {
  return arr.reduce((accumulator, currentValue) => {
    const currentKey = keyFunction(currentValue);
    if (accumulator === undefined || currentKey > keyFunction(accumulator)) {
      return currentValue;
    }
    return accumulator;
  }, undefined);
}

const maxByUsers = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 20 },
  { name: "David", age: 35 },
];

const maxAgeUser = customMaxBy(maxByUsers, (user) => user.age);
console.log("32. 使用 reduce 实现 maxBy:", maxAgeUser); // 输出: { name: 'David', age: 35 }

// 33. 使用 reduce 实现 keyBy
function customKeyBy(arr, keyFunction) {
  return arr.reduce((accumulator, currentValue) => {
    const key = keyFunction(currentValue);
    accumulator[key] = currentValue;
    return accumulator;
  }, {});
}

const keyByUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const keyedById = customKeyBy(keyByUsers, (user) => user.id);
console.log("33. 使用 reduce 实现 keyBy:", keyedById);
// 输出:
// {
//   '1': { id: 1, name: 'Alice' },
//   '2': { id: 2, name: 'Bob' },
//   '3': { id: 3, name: 'Charlie' }
// }

// 34. 使用 reduce 实现 flat
function customFlat(arr, depth = 1) {
  return arr.reduce((accumulator, currentValue) => {
    if (Array.isArray(currentValue) && depth > 0) {
      return accumulator.concat(customFlat(currentValue, depth - 1));
    }
    return accumulator.concat(currentValue);
  }, []);
}

const flatArray = [1, [2, [3, [4]], 5], 6];
const flattenedArray = customFlat(flatArray, 2);
console.log("34. 使用 reduce 实现 flat:", flattenedArray); // 输出: [1, 2, 3, [4], 5, 6]

const deeplyFlattenedArray = customFlat(flatArray, Infinity);
console.log("34. 使用 reduce 实现 flat (deep):", deeplyFlattenedArray); // 输出: [1, 2, 3, 4, 5, 6]

// 35. 使用 reduce 实现 intersection
function customIntersection(arr1, arr2) {
  return arr1.reduce((accumulator, currentValue) => {
    if (arr2.includes(currentValue)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

const intersectionArray1 = [1, 2, 3, 4, 5];
const intersectionArray2 = [3, 4, 5, 6, 7];
const intersectionResult = customIntersection(
  intersectionArray1,
  intersectionArray2
);
console.log("35. 使用 reduce 实现 intersection:", intersectionResult); // 输出: [3, 4, 5]

// 36. 使用 reduce 实现 difference
function customDifference(arr1, arr2) {
  return arr1.reduce((accumulator, currentValue) => {
    if (!arr2.includes(currentValue)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

const differenceArray1 = [1, 2, 3, 4, 5];
const differenceArray2 = [3, 4, 5, 6, 7];
const differenceResult = customDifference(differenceArray1, differenceArray2);
console.log("36. 使用 reduce 实现 difference:", differenceResult); // 输出: [1, 2]

// 37. 使用 reduce 实现 union
function customUnion(arr1, arr2) {
  return arr1.concat(arr2).reduce((accumulator, currentValue) => {
    if (!accumulator.includes(currentValue)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

const unionArray1 = [1, 2, 3];
const unionArray2 = [3, 4, 5];
const unionResult = customUnion(unionArray1, unionArray2);
console.log("37. 使用 reduce 实现 union:", unionResult); // 输出: [1, 2, 3, 4, 5]

// 38. 使用 reduce 实现 symmetricDifference
function customSymmetricDifference(arr1, arr2) {
  const diff1 = customDifference(arr1, arr2);
  const diff2 = customDifference(arr2, arr1);
  return customUnion(diff1, diff2);
}

const symmetricDifferenceArray1 = [1, 2, 3, 4];
const symmetricDifferenceArray2 = [3, 4, 5, 6];
const symmetricDifferenceResult = customSymmetricDifference(
  symmetricDifferenceArray1,
  symmetricDifferenceArray2
);
console.log(
  "38. 使用 reduce 实现 symmetricDifference:",
  symmetricDifferenceResult
); // 输出: [1, 2, 5, 6]

// 39. 使用 reduce 实现 shuffle
function customShuffle(arr) {
  return arr.reduce(
    (accumulator, _, index) => {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [accumulator[index], accumulator[randomIndex]] = [
        accumulator[randomIndex],
        accumulator[index],
      ];
      return accumulator;
    },
    [...arr]
  );
}

const shuffleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const shuffledArray = customShuffle(shuffleArray);
console.log("39. 使用 reduce 实现 shuffle:", shuffledArray); // 输出: 随机排序的数组

// 40. 使用 reduce 实现 range
function customRange(start, end, step = 1) {
  const length = Math.max(Math.ceil((end - start) / step), 0);
  return Array.from({ length }, (_, index) => start + index * step);
}

const rangeArray = customRange(1, 10, 2);
console.log("40. 使用 reduce 实现 range:", rangeArray); // 输出: [1, 3, 5, 7, 9]

const rangeArray2 = customRange(10, 1, -2);
console.log("40. 使用 reduce 实现 range (reverse):", rangeArray2); // 输出: [10, 8, 6, 4, 2]

// 41. 使用 reduce 实现 fill
function customFill(arr, value, start = 0, end = arr.length) {
  return arr.reduce(
    (accumulator, currentValue, index) => {
      if (index >= start && index < end) {
        accumulator[index] = value;
      }
      return accumulator;
    },
    [...arr]
  );
}

const fillArray = [1, 2, 3, 4, 5];
const filledArray = customFill(fillArray, 0, 1, 4);
console.log("41. 使用 reduce 实现 fill:", filledArray); // 输出: [1, 0, 0, 0, 5]

// 42. 使用 reduce 实现 padStart
function customPadStart(str, targetLength, padString = " ") {
  if (str.length >= targetLength) {
    return str;
  }
  const paddingLength = targetLength - str.length;
  const padding = Array.from({ length: paddingLength }, () => padString).join(
    ""
  );
  return padding + str;
}

const padStartString = "123";
const paddedStartString = customPadStart(padStartString, 5, "0");
console.log("42. 使用 reduce 实现 padStart:", paddedStartString); // 输出: "00123"

// 43. 使用 reduce 实现 padEnd
function customPadEnd(str, targetLength, padString = " ") {
  if (str.length >= targetLength) {
    return str;
  }
  const paddingLength = targetLength - str.length;
  const padding = Array.from({ length: paddingLength }, () => padString).join(
    ""
  );
  return str + padding;
}

const padEndString = "123";
const paddedEndString = customPadEnd(padEndString, 5, "0");
console.log("43. 使用 reduce 实现 padEnd:", paddedEndString); // 输出: "12300"

// 44. 使用 reduce 实现 repeat
function customRepeat(str, count) {
  return Array.from({ length: count }, () => str).join("");
}

const repeatString = "abc";
const repeatedString = customRepeat(repeatString, 3);
console.log("44. 使用 reduce 实现 repeat:", repeatedString); // 输出: "abcabcabc"

// 45. 使用 reduce 实现 trim
function customTrim(str) {
  return str
    .reduce((accumulator, currentValue) => {
      if (currentValue !== " ") {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, [])
    .join("");
}

const trimString = "   hello world   ";
const trimmedString = customTrim(trimString.split(""));
console.log("45. 使用 reduce 实现 trim:", trimmedString); // 输出: "helloworld"

// 46. 使用 reduce 实现 trimStart
function customTrimStart(str) {
  let trimmed = false;
  return str
    .reduce((accumulator, currentValue) => {
      if (!trimmed && currentValue === " ") {
        return accumulator;
      }
      trimmed = true;
      accumulator.push(currentValue);
      return accumulator;
    }, [])
    .join("");
}

const trimStartString = "   hello world   ";
const trimmedStartString = customTrimStart(trimStartString.split(""));
console.log("46. 使用 reduce 实现 trimStart:", trimmedStartString); // 输出: "hello world   "

// 47. 使用 reduce 实现 trimEnd
function customTrimEnd(str) {
  let trimmed = false;
  return str
    .reduceRight((accumulator, currentValue) => {
      if (!trimmed && currentValue === " ") {
        return accumulator;
      }
      trimmed = true;
      accumulator.unshift(currentValue);
      return accumulator;
    }, [])
    .join("");
}

const trimEndString = "   hello world   ";
const trimmedEndString = customTrimEnd(trimEndString.split(""));
console.log("47. 使用 reduce 实现 trimEnd:", trimmedEndString); // 输出: "   hello world"

// 48. 使用 reduce 实现 startsWith
function customStartsWith(str, searchString, position = 0) {
  return str
    .slice(position, position + searchString.length)
    .reduce((accumulator, currentValue, index) => {
      return accumulator && currentValue === searchString[index];
    }, true);
}

const startsWithString = "hello world";
const startsWithResult = customStartsWith(startsWithString.split(""), "hello");
console.log("48. 使用 reduce 实现 startsWith:", startsWithResult); // 输出: true

const startsWithResult2 = customStartsWith(startsWithString.split(""), "world");
console.log("48. 使用 reduce 实现 startsWith (false):", startsWithResult2); // 输出: false

// 49. 使用 reduce 实现 endsWith
function customEndsWith(str, searchString, position = str.length) {
  const start = Math.max(0, position - searchString.length);
  return str
    .slice(start, position)
    .reduce((accumulator, currentValue, index) => {
      return accumulator && currentValue === searchString[index];
    }, true);
}

const endsWithString = "hello world";
const endsWithResult = customEndsWith(endsWithString.split(""), "world");
console.log("49. 使用 reduce 实现 endsWith:", endsWithResult); // 输出: true

const endsWithResult2 = customEndsWith(endsWithString.split(""), "hello");
console.log("49. 使用 reduce 实现 endsWith (false):", endsWithResult2); // 输出: false

// 50. 使用 reduce 实现 includes
function customIncludes(arr, searchElement, fromIndex = 0) {
  return arr.slice(fromIndex).reduce((accumulator, currentValue) => {
    return accumulator || currentValue === searchElement;
  }, false);
}

const includesArray = [1, 2, 3, 4, 5];
const includesResult = customIncludes(includesArray, 3);
console.log("50. 使用 reduce 实现 includes:", includesResult); // 输出: true

const includesResult2 = customIncludes(includesArray, 6);
console.log("50. 使用 reduce 实现 includes (false):", includesResult2); // 输出: false

// 51. 使用 reduce 实现 indexOf
function customIndexOf(arr, searchElement, fromIndex = 0) {
  return arr.slice(fromIndex).reduce((accumulator, currentValue, index) => {
    if (accumulator !== -1) {
      return accumulator;
    }
    if (currentValue === searchElement) {
      return index + fromIndex;
    }
    return -1;
  }, -1);
}

const indexOfArray = [1, 2, 3, 4, 5, 3];
const indexOfResult = customIndexOf(indexOfArray, 3);
console.log("51. 使用 reduce 实现 indexOf:", indexOfResult); // 输出: 2

const indexOfResult2 = customIndexOf(indexOfArray, 6);
console.log("51. 使用 reduce 实现 indexOf (not found):", indexOfResult2); // 输出: -1

// 52. 使用 reduce 实现 lastIndexOf
function customLastIndexOf(arr, searchElement, fromIndex = arr.length - 1) {
  return arr
    .slice(0, fromIndex + 1)
    .reduceRight((accumulator, currentValue, index) => {
      if (accumulator !== -1) {
        return accumulator;
      }
      if (currentValue === searchElement) {
        return index;
      }
      return -1;
    }, -1);
}

const lastIndexOfArray = [1, 2, 3, 4, 5, 3];
const lastIndexOfResult = customLastIndexOf(lastIndexOfArray, 3);
console.log("52. 使用 reduce 实现 lastIndexOf:", lastIndexOfResult); // 输出: 5

const lastIndexOfResult2 = customLastIndexOf(lastIndexOfArray, 6);
console.log(
  "52. 使用 reduce 实现 lastIndexOf (not found):",
  lastIndexOfResult2
); // 输出: -1

// 53. 使用 reduce 实现 join
function customJoin(arr, separator = ",") {
  return arr.reduce((accumulator, currentValue, index) => {
    if (index === 0) {
      return String(currentValue);
    }
    return accumulator + separator + String(currentValue);
  }, "");
}

const joinArray = [1, 2, 3, 4, 5];
const joinedString = customJoin(joinArray, "-");
console.log("53. 使用 reduce 实现 join:", joinedString); // 输出: "1-2-3-4-5"

const joinedString2 = customJoin(joinArray);
console.log("53. 使用 reduce 实现 join (default separator):", joinedString2); // 输出: "1,2,3,4,5"

// 54. 使用 reduce 实现 reverse
function customReverse(arr) {
  return arr.reduceRight((accumulator, currentValue) => {
    accumulator.push(currentValue);
    return accumulator;
  }, []);
}

const reverseArray = [1, 2, 3, 4, 5];
const reversedArray = customReverse(reverseArray);
console.log("54. 使用 reduce 实现 reverse:", reversedArray); // 输出: [5, 4, 3, 2, 1]

// 55. 使用 reduce 实现 slice
function customSlice(arr, start = 0, end = arr.length) {
  return arr.reduce((accumulator, currentValue, index) => {
    if (index >= start && index < end) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

const sliceArray = [1, 2, 3, 4, 5];
const slicedArray = customSlice(sliceArray, 1, 4);
console.log("55. 使用 reduce 实现 slice:", slicedArray); // 输出: [2, 3, 4]

const slicedArray2 = customSlice(sliceArray, 2);
console.log("55. 使用 reduce 实现 slice (from start):", slicedArray2); // 输出: [3, 4, 5]

// 56. 使用 reduce 实现 splice
function customSplice(arr, start, deleteCount, ...items) {
  const deleted = [];
  const result = arr.reduce((accumulator, currentValue, index) => {
    if (index < start || index >= start + deleteCount) {
      accumulator.push(currentValue);
    } else {
      deleted.push(currentValue);
    }
    return accumulator;
  }, []);
  result.splice(start, 0, ...items);
  return { result, deleted };
}

const spliceArray = [1, 2, 3, 4, 5];
const { result: splicedResult, deleted: splicedDeleted } = customSplice(
  spliceArray,
  1,
  2,
  6,
  7
);
console.log("56. 使用 reduce 实现 splice:", splicedResult, splicedDeleted); // 输出: [1, 6, 7, 4, 5] [2, 3]

const spliceArray2 = [1, 2, 3, 4, 5];
const { result: splicedResult2, deleted: splicedDeleted2 } = customSplice(
  spliceArray2,
  2,
  0,
  6,
  7
);
console.log(
  "56. 使用 reduce 实现 splice (insert):",
  splicedResult2,
  splicedDeleted2
); // 输出: [1, 2, 6, 7, 3, 4, 5] []

// 57. 使用 reduce 实现 toReversed
function customToReversed(arr) {
  return arr.reduceRight((accumulator, currentValue) => {
    accumulator.push(currentValue);
    return accumulator;
  }, []);
}

const toReversedArray = [1, 2, 3, 4, 5];
const reversedArray2 = customToReversed(toReversedArray);
console.log("57. 使用 reduce 实现 toReversed:", reversedArray2); // 输出: [5, 4, 3, 2, 1]

// 58. 使用 reduce 实现 toSorted
function customToSorted(arr, compareFn) {
  return [...arr].reduce((accumulator, currentValue) => {
    let i = 0;
    while (
      i < accumulator.length &&
      (compareFn
        ? compareFn(currentValue, accumulator[i]) > 0
        : String(currentValue) > String(accumulator[i]))
    ) {
      i++;
    }
    accumulator.splice(i, 0, currentValue);
    return accumulator;
  }, []);
}

const toSortedArray = [3, 1, 4, 2, 5];
const sortedArray = customToSorted(toSortedArray);
console.log("58. 使用 reduce 实现 toSorted:", sortedArray); // 输出: [1, 2, 3, 4, 5]

const toSortedArray2 = [3, 1, 4, 2, 5];
const sortedArray2 = customToSorted(toSortedArray2, (a, b) => b - a);
console.log("58. 使用 reduce 实现 toSorted (descending):", sortedArray2); // 输出: [5, 4, 3, 2, 1]

// 59. 使用 reduce 实现 toSpliced
function customToSpliced(arr, start, deleteCount, ...items) {
  const result = [...arr].reduce((accumulator, currentValue, index) => {
    if (index < start || index >= start + deleteCount) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
  result.splice(start, 0, ...items);
  return result;
}

const toSplicedArray = [1, 2, 3, 4, 5];
const splicedArray3 = customToSpliced(toSplicedArray, 1, 2, 6, 7);
console.log("59. 使用 reduce 实现 toSpliced:", splicedArray3); // 输出: [1, 6, 7, 4, 5]

const toSplicedArray2 = [1, 2, 3, 4, 5];
const splicedArray4 = customToSpliced(toSplicedArray2, 2, 0, 6, 7);
console.log("59. 使用 reduce 实现 toSpliced (insert):", splicedArray4); // 输出: [1, 2, 6, 7, 3, 4, 5]

// 60. 使用 reduce 实现 with
function customWith(arr, index, value) {
  return arr.reduce((accumulator, currentValue, currentIndex) => {
    if (currentIndex === index) {
      accumulator.push(value);
    } else {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

const withArray = [1, 2, 3, 4, 5];
const withResult = customWith(withArray, 2, 6);
console.log("60. 使用 reduce 实现 with:", withResult); // 输出: [1, 2, 6, 4, 5]

// 61. 使用 reduce 实现 findLast
function customFindLast(arr, callback) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    if (accumulator !== undefined) {
      return accumulator;
    }
    if (callback(currentValue, index, array)) {
      return currentValue;
    }
    return undefined;
  }, undefined);
}

const findLastArray = [1, 2, 3, 4, 5, 3];
const findLastResult = customFindLast(findLastArray, (num) => num === 3);
console.log("61. 使用 reduce 实现 findLast:", findLastResult); // 输出: 3

const findLastResult2 = customFindLast(findLastArray, (num) => num > 5);
console.log("61. 使用 reduce 实现 findLast (not found):", findLastResult2); // 输出: undefined

// 62. 使用 reduce 实现 findLastIndex
function customFindLastIndex(arr, callback) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    if (accumulator !== -1) {
      return accumulator;
    }
    if (callback(currentValue, index, array)) {
      return index;
    }
    return -1;
  }, -1);
}

const findLastIndexArray = [1, 2, 3, 4, 5, 3];
const findLastIndexResult = customFindLastIndex(
  findLastIndexArray,
  (num) => num === 3
);
console.log("62. 使用 reduce 实现 findLastIndex:", findLastIndexResult); // 输出: 5

const findLastIndexResult2 = customFindLastIndex(
  findLastIndexArray,
  (num) => num > 5
);
console.log(
  "62. 使用 reduce 实现 findLastIndex (not found):",
  findLastIndexResult2
); // 输出: -1

// 63. 使用 reduce 实现 flatMap with depth
function customFlatMapWithDepth(arr, callback, depth = 1) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    const mappedValue = callback(currentValue, index, array);
    if (Array.isArray(mappedValue) && depth > 0) {
      return accumulator.concat(
        customFlatMapWithDepth(mappedValue, (x) => x, depth - 1)
      );
    }
    return accumulator.concat(mappedValue);
  }, []);
}

const flatMapWithDepthArray = [1, 2, 3];
const flatMapWithDepthResult = customFlatMapWithDepth(
  flatMapWithDepthArray,
  (num) => [num, [num * 2]],
  2
);
console.log("63. 使用 reduce 实现 flatMap with depth:", flatMapWithDepthResult); // 输出: [1, [2], 2, [4], 3, [6]]

const flatMapWithDepthResult2 = customFlatMapWithDepth(
  flatMapWithDepthArray,
  (num) => [num, [num * 2]],
  1
);
console.log(
  "63. 使用 reduce 实现 flatMap with depth (depth 1):",
  flatMapWithDepthResult2
); // 输出: [1, [2], 2, [4], 3, [6]]

// 64. 使用 reduce 实现 reduce with index
function customReduceWithIndex(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceWithIndexArray = [1, 2, 3, 4, 5];
const reduceWithIndexResult = customReduceWithIndex(
  reduceWithIndexArray,
  (acc, curr, index) => acc + curr + index,
  0
);
console.log("64. 使用 reduce 实现 reduce with index:", reduceWithIndexResult); // 输出: 20 (1+0 + 2+1 + 3+2 + 4+3 + 5+4)

// 65. 使用 reduce 实现 reduceRight with index
function customReduceRightWithIndex(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceRightWithIndexArray = [1, 2, 3, 4, 5];
const reduceRightWithIndexResult = customReduceRightWithIndex(
  reduceRightWithIndexArray,
  (acc, curr, index) => acc + curr + index,
  0
);
console.log(
  "65. 使用 reduce 实现 reduceRight with index:",
  reduceRightWithIndexResult
); // 输出: 20 (5+4 + 4+3 + 3+2 + 2+1 + 1+0)

// 66. 使用 reduce 实现 forEach
function customForEach(arr, callback) {
  arr.reduce((_, currentValue, index, array) => {
    callback(currentValue, index, array);
    return undefined;
  }, undefined);
}

const forEachArray = [1, 2, 3];
customForEach(forEachArray, (num, index) =>
  console.log(`forEach: index ${index}, value ${num}`)
);
// 输出:
// forEach: index 0, value 1
// forEach: index 1, value 2
// forEach: index 2, value 3

// 67. 使用 reduce 实现 some with index
function customSomeWithIndex(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return accumulator || callback(currentValue, index, array);
  }, false);
}

const someWithIndexArray = [1, 3, 5, 8];
const hasEvenWithIndex = customSomeWithIndex(
  someWithIndexArray,
  (num, index) => num % 2 === 0 && index > 0
);
console.log("67. 使用 reduce 实现 some with index:", hasEvenWithIndex); // 输出: true

const noEvenWithIndexArray = [1, 3, 5, 7];
const noEvenWithIndex = customSomeWithIndex(
  noEvenWithIndexArray,
  (num, index) => num % 2 === 0 && index > 0
);
console.log("67. 使用 reduce 实现 some with index (false):", noEvenWithIndex); // 输出: false

// 68. 使用 reduce 实现 every with index
function customEveryWithIndex(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return accumulator && callback(currentValue, index, array);
  }, true);
}

const everyWithIndexArray = [2, 4, 6, 8];
const allEvenWithIndex = customEveryWithIndex(
  everyWithIndexArray,
  (num, index) => num % 2 === 0 && index > 0
);
console.log("68. 使用 reduce 实现 every with index:", allEvenWithIndex); // 输出: true

const notAllEvenWithIndexArray = [2, 4, 5, 8];
const notAllEvenWithIndex = customEveryWithIndex(
  notAllEvenWithIndexArray,
  (num, index) => num % 2 === 0 && index > 0
);
console.log(
  "68. 使用 reduce 实现 every with index (false):",
  notAllEvenWithIndex
); // 输出: false

// 69. 使用 reduce 实现 map with index
function customMapWithIndex(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    accumulator.push(callback(currentValue, index, array));
    return accumulator;
  }, []);
}

const mapWithIndexArray = [1, 2, 3, 4];
const mappedWithIndex = customMapWithIndex(
  mapWithIndexArray,
  (num, index) => num * 2 + index
);
console.log("69. 使用 reduce 实现 map with index:", mappedWithIndex); // 输出: [2, 5, 8, 11]

// 70. 使用 reduce 实现 filter with index
function customFilterWithIndex(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    if (callback(currentValue, index, array)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

const filterWithIndexArray = [1, 2, 3, 4, 5, 6];
const filteredWithIndex = customFilterWithIndex(
  filterWithIndexArray,
  (num, index) => num % 2 === 0 && index > 0
);
console.log("70. 使用 reduce 实现 filter with index:", filteredWithIndex); // 输出: [2, 4, 6]

// 71. 使用 reduce 实现 find with index
function customFindWithIndex(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    if (accumulator !== undefined) {
      return accumulator;
    }
    if (callback(currentValue, index, array)) {
      return currentValue;
    }
    return undefined;
  }, undefined);
}

const findWithIndexArray = [1, 2, 3, 4, 5];
const foundWithIndex = customFindWithIndex(
  findWithIndexArray,
  (num, index) => num > 3 && index > 0
);
console.log("71. 使用 reduce 实现 find with index:", foundWithIndex); // 输出: 4

const findWithIndexResult2 = customFindWithIndex(
  findWithIndexArray,
  (num, index) => num > 5 && index > 0
);
console.log(
  "71. 使用 reduce 实现 find with index (not found):",
  findWithIndexResult2
); // 输出: undefined

// 72. 使用 reduce 实现 findIndex with index
function customFindIndexWithIndex(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    if (accumulator !== -1) {
      return accumulator;
    }
    if (callback(currentValue, index, array)) {
      return index;
    }
    return -1;
  }, -1);
}

const findIndexWithIndexArray = [1, 2, 3, 4, 5];
const foundIndexWithIndex = customFindIndexWithIndex(
  findIndexWithIndexArray,
  (num, index) => num > 3 && index > 0
);
console.log("72. 使用 reduce 实现 findIndex with index:", foundIndexWithIndex); // 输出: 3

const findIndexWithIndexResult2 = customFindIndexWithIndex(
  findIndexWithIndexArray,
  (num, index) => num > 5 && index > 0
);
console.log(
  "72. 使用 reduce 实现 findIndex with index (not found):",
  findIndexWithIndexResult2
); // 输出: -1

// 73. 使用 reduce 实现 findLast with index
function customFindLastWithIndex(arr, callback) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    if (accumulator !== undefined) {
      return accumulator;
    }
    if (callback(currentValue, index, array)) {
      return currentValue;
    }
    return undefined;
  }, undefined);
}

const findLastWithIndexArray = [1, 2, 3, 4, 5, 3];
const findLastWithIndexResult = customFindLastWithIndex(
  findLastWithIndexArray,
  (num, index) => num === 3 && index < 5
);
console.log(
  "73. 使用 reduce 实现 findLast with index:",
  findLastWithIndexResult
); // 输出: 3

const findLastWithIndexResult2 = customFindLastWithIndex(
  findLastWithIndexArray,
  (num, index) => num > 5 && index < 5
);
console.log(
  "73. 使用 reduce 实现 findLast with index (not found):",
  findLastWithIndexResult2
); // 输出: undefined

// 74. 使用 reduce 实现 findLastIndex with index
function customFindLastIndexWithIndex(arr, callback) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    if (accumulator !== -1) {
      return accumulator;
    }
    if (callback(currentValue, index, array)) {
      return index;
    }
    return -1;
  }, -1);
}

const findLastIndexWithIndexArray = [1, 2, 3, 4, 5, 3];
const findLastIndexWithIndexResult = customFindLastIndexWithIndex(
  findLastIndexWithIndexArray,
  (num, index) => num === 3 && index < 5
);
console.log(
  "74. 使用 reduce 实现 findLastIndex with index:",
  findLastIndexWithIndexResult
); // 输出: 2

const findLastIndexWithIndexResult2 = customFindLastIndexWithIndex(
  findLastIndexWithIndexArray,
  (num, index) => num > 5 && index < 5
);
console.log(
  "74. 使用 reduce 实现 findLastIndex with index (not found):",
  findLastIndexWithIndexResult2
); // 输出: -1

// 75. 使用 reduce 实现 flatMap with index
function customFlatMapWithIndex(arr, callback) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return accumulator.concat(callback(currentValue, index, array));
  }, []);
}

const flatMapWithIndexArray = [1, 2, 3];
const flatMappedWithIndex = customFlatMapWithIndex(
  flatMapWithIndexArray,
  (num, index) => [num, num * 2 + index]
);
console.log("75. 使用 reduce 实现 flatMap with index:", flatMappedWithIndex); // 输出: [1, 2, 2, 5, 3, 8]

// 76. 使用 reduce 实现 flatMap with index and depth
function customFlatMapWithIndexAndDepth(arr, callback, depth = 1) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    const mappedValue = callback(currentValue, index, array);
    if (Array.isArray(mappedValue) && depth > 0) {
      return accumulator.concat(
        customFlatMapWithIndexAndDepth(mappedValue, (x, i) => x, depth - 1)
      );
    }
    return accumulator.concat(mappedValue);
  }, []);
}

const flatMapWithIndexAndDepthArray = [1, 2, 3];
const flatMappedWithIndexAndDepth = customFlatMapWithIndexAndDepth(
  flatMapWithIndexAndDepthArray,
  (num, index) => [num, [num * 2 + index]],
  2
);
console.log(
  "76. 使用 reduce 实现 flatMap with index and depth:",
  flatMappedWithIndexAndDepth
); // 输出: [1, [2], 2, [5], 3, [8]]

const flatMappedWithIndexAndDepth2 = customFlatMapWithIndexAndDepth(
  flatMapWithIndexAndDepthArray,
  (num, index) => [num, [num * 2 + index]],
  1
);
console.log(
  "76. 使用 reduce 实现 flatMap with index and depth (depth 1):",
  flatMappedWithIndexAndDepth2
); // 输出: [1, [2], 2, [5], 3, [8]]

// 77. 使用 reduce 实现 reduce with initial value as object
function customReduceWithObjectInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceWithObjectInitialValueArray = [1, 2, 3];
const reduceWithObjectInitialValueResult = customReduceWithObjectInitialValue(
  reduceWithObjectInitialValueArray,
  (acc, curr, index) => {
    acc.sum += curr;
    acc.count++;
    return acc;
  },
  { sum: 0, count: 0 }
);
console.log(
  "77. 使用 reduce 实现 reduce with initial value as object:",
  reduceWithObjectInitialValueResult
); // 输出: { sum: 6, count: 3 }

// 78. 使用 reduce 实现 reduceRight with initial value as object
function customReduceRightWithObjectInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceRightWithObjectInitialValueArray = [1, 2, 3];
const reduceRightWithObjectInitialValueResult =
  customReduceRightWithObjectInitialValue(
    reduceRightWithObjectInitialValueArray,
    (acc, curr, index) => {
      acc.sum += curr;
      acc.count++;
      return acc;
    },
    { sum: 0, count: 0 }
  );
console.log(
  "78. 使用 reduce 实现 reduceRight with initial value as object:",
  reduceRightWithObjectInitialValueResult
); // 输出: { sum: 6, count: 3 }

// 79. 使用 reduce 实现 reduce with initial value as array
function customReduceWithArrayInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceWithArrayInitialValueArray = [1, 2, 3];
const reduceWithArrayInitialValueResult = customReduceWithArrayInitialValue(
  reduceWithArrayInitialValueArray,
  (acc, curr, index) => {
    acc.push(curr * 2);
    return acc;
  },
  []
);
console.log(
  "79. 使用 reduce 实现 reduce with initial value as array:",
  reduceWithArrayInitialValueResult
); // 输出: [2, 4, 6]

// 80. 使用 reduce 实现 reduceRight with initial value as array
function customReduceRightWithArrayInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceRightWithArrayInitialValueArray = [1, 2, 3];
const reduceRightWithArrayInitialValueResult =
  customReduceRightWithArrayInitialValue(
    reduceRightWithArrayInitialValueArray,
    (acc, curr, index) => {
      acc.push(curr * 2);
      return acc;
    },
    []
  );
console.log(
  "80. 使用 reduce 实现 reduceRight with initial value as array:",
  reduceRightWithArrayInitialValueResult
); // 输出: [6, 4, 2]

// 81. 使用 reduce 实现 reduce with initial value as string
function customReduceWithStringInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceWithStringInitialValueArray = ["a", "b", "c"];
const reduceWithStringInitialValueResult = customReduceWithStringInitialValue(
  reduceWithStringInitialValueArray,
  (acc, curr) => acc + curr,
  ""
);
console.log(
  "81. 使用 reduce 实现 reduce with initial value as string:",
  reduceWithStringInitialValueResult
); // 输出: "abc"

// 82. 使用 reduce 实现 reduceRight with initial value as string
function customReduceRightWithStringInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceRightWithStringInitialValueArray = ["a", "b", "c"];
const reduceRightWithStringInitialValueResult =
  customReduceRightWithStringInitialValue(
    reduceRightWithStringInitialValueArray,
    (acc, curr) => acc + curr,
    ""
  );
console.log(
  "82. 使用 reduce 实现 reduceRight with initial value as string:",
  reduceRightWithStringInitialValueResult
); // 输出: "cba"

// 83. 使用 reduce 实现 reduce with initial value as number
function customReduceWithNumberInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceWithNumberInitialValueArray = [1, 2, 3];
const reduceWithNumberInitialValueResult = customReduceWithNumberInitialValue(
  reduceWithNumberInitialValueArray,
  (acc, curr) => acc + curr,
  0
);
console.log(
  "83. 使用 reduce 实现 reduce with initial value as number:",
  reduceWithNumberInitialValueResult
); // 输出: 6

// 84. 使用 reduce 实现 reduceRight with initial value as number
function customReduceRightWithNumberInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceRightWithNumberInitialValueArray = [1, 2, 3];
const reduceRightWithNumberInitialValueResult =
  customReduceRightWithNumberInitialValue(
    reduceRightWithNumberInitialValueArray,
    (acc, curr) => acc + curr,
    0
  );
console.log(
  "84. 使用 reduce 实现 reduceRight with initial value as number:",
  reduceRightWithNumberInitialValueResult
); // 输出: 6

// 85. 使用 reduce 实现 reduce with initial value as boolean
function customReduceWithBooleanInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceWithBooleanInitialValueArray = [true, true, false];
const reduceWithBooleanInitialValueResult = customReduceWithBooleanInitialValue(
  reduceWithBooleanInitialValueArray,
  (acc, curr) => acc && curr,
  true
);
console.log(
  "85. 使用 reduce 实现 reduce with initial value as boolean:",
  reduceWithBooleanInitialValueResult
); // 输出: false

const reduceWithBooleanInitialValueResult2 =
  customReduceWithBooleanInitialValue(
    [true, true, true],
    (acc, curr) => acc && curr,
    true
  );
console.log(
  "85. 使用 reduce 实现 reduce with initial value as boolean (true):",
  reduceWithBooleanInitialValueResult2
); // 输出: true

// 86. 使用 reduce 实现 reduceRight with initial value as boolean
function customReduceRightWithBooleanInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceRightWithBooleanInitialValueArray = [true, true, false];
const reduceRightWithBooleanInitialValueResult =
  customReduceRightWithBooleanInitialValue(
    reduceRightWithBooleanInitialValueArray,
    (acc, curr) => acc && curr,
    true
  );
console.log(
  "86. 使用 reduce 实现 reduceRight with initial value as boolean:",
  reduceRightWithBooleanInitialValueResult
); // 输出: false

const reduceRightWithBooleanInitialValueResult2 =
  customReduceRightWithBooleanInitialValue(
    [true, true, true],
    (acc, curr) => acc && curr,
    true
  );
console.log(
  "86. 使用 reduce 实现 reduceRight with initial value as boolean (true):",
  reduceRightWithBooleanInitialValueResult2
); // 输出: true

// 87. 使用 reduce 实现 reduce with initial value as null
function customReduceWithNullInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceWithNullInitialValueArray = [1, 2, 3];
const reduceWithNullInitialValueResult = customReduceWithNullInitialValue(
  reduceWithNullInitialValueArray,
  (acc, curr) => (acc === null ? curr : acc + curr),
  null
);
console.log(
  "87. 使用 reduce 实现 reduce with initial value as null:",
  reduceWithNullInitialValueResult
); // 输出: 6

// 88. 使用 reduce 实现 reduceRight with initial value as null
function customReduceRightWithNullInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceRightWithNullInitialValueArray = [1, 2, 3];
const reduceRightWithNullInitialValueResult =
  customReduceRightWithNullInitialValue(
    reduceRightWithNullInitialValueArray,
    (acc, curr) => (acc === null ? curr : acc + curr),
    null
  );
console.log(
  "88. 使用 reduce 实现 reduceRight with initial value as null:",
  reduceRightWithNullInitialValueResult
); // 输出: 6

// 89. 使用 reduce 实现 reduce with initial value as undefined
function customReduceWithUndefinedInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceWithUndefinedInitialValueArray = [1, 2, 3];
const reduceWithUndefinedInitialValueResult =
  customReduceWithUndefinedInitialValue(
    reduceWithUndefinedInitialValueArray,
    (acc, curr) => (acc === undefined ? curr : acc + curr),
    undefined
  );
console.log(
  "89. 使用 reduce 实现 reduce with initial value as undefined:",
  reduceWithUndefinedInitialValueResult
); // 输出: 6

// 90. 使用 reduce 实现 reduceRight with initial value as undefined
function customReduceRightWithUndefinedInitialValue(
  arr,
  callback,
  initialValue
) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const reduceRightWithUndefinedInitialValueArray = [1, 2, 3];
const reduceRightWithUndefinedInitialValueResult =
  customReduceRightWithUndefinedInitialValue(
    reduceRightWithUndefinedInitialValueArray,
    (acc, curr) => (acc === undefined ? curr : acc + curr),
    undefined
  );
console.log(
  "90. 使用 reduce 实现 reduceRight with initial value as undefined:",
  reduceRightWithUndefinedInitialValueResult
); // 输出: 6

// 91. 使用 reduce 实现 reduce with initial value as symbol
function customReduceWithSymbolInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const symbol1 = Symbol("test");
const symbol2 = Symbol("test2");
const reduceWithSymbolInitialValueArray = [symbol1, symbol2];
const reduceWithSymbolInitialValueResult = customReduceWithSymbolInitialValue(
  reduceWithSymbolInitialValueArray,
  (acc, curr) => (acc === null ? curr : acc),
  null
);
console.log(
  "91. 使用 reduce 实现 reduce with initial value as symbol:",
  reduceWithSymbolInitialValueResult
); // 输出: Symbol(test)

// 92. 使用 reduce 实现 reduceRight with initial value as symbol
function customReduceRightWithSymbolInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const symbol3 = Symbol("test3");
const symbol4 = Symbol("test4");
const reduceRightWithSymbolInitialValueArray = [symbol3, symbol4];
const reduceRightWithSymbolInitialValueResult =
  customReduceRightWithSymbolInitialValue(
    reduceRightWithSymbolInitialValueArray,
    (acc, curr) => (acc === null ? curr : acc),
    null
  );
console.log(
  "92. 使用 reduce 实现 reduceRight with initial value as symbol:",
  reduceRightWithSymbolInitialValueResult
); // 输出: Symbol(test3)

// 93. 使用 reduce 实现 reduce with initial value as function
function customReduceWithFunctionInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const func1 = () => 1;
const func2 = () => 2;
const reduceWithFunctionInitialValueArray = [func1, func2];
const reduceWithFunctionInitialValueResult =
  customReduceWithFunctionInitialValue(
    reduceWithFunctionInitialValueArray,
    (acc, curr) => (acc === null ? curr : () => acc() + curr()),
    null
  );
console.log(
  "93. 使用 reduce 实现 reduce with initial value as function:",
  reduceWithFunctionInitialValueResult()
); // 输出: 3

// 94. 使用 reduce 实现 reduceRight with initial value as function
function customReduceRightWithFunctionInitialValue(
  arr,
  callback,
  initialValue
) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const func3 = () => 3;
const func4 = () => 4;
const reduceRightWithFunctionInitialValueArray = [func3, func4];
const reduceRightWithFunctionInitialValueResult =
  customReduceRightWithFunctionInitialValue(
    reduceRightWithFunctionInitialValueArray,
    (acc, curr) => (acc === null ? curr : () => acc() + curr()),
    null
  );
console.log(
  "94. 使用 reduce 实现 reduceRight with initial value as function:",
  reduceRightWithFunctionInitialValueResult()
); // 输出: 7

// 95. 使用 reduce 实现 reduce with initial value as date
function customReduceWithDateInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const reduceWithDateInitialValueArray = [date1, date2];
const reduceWithDateInitialValueResult = customReduceWithDateInitialValue(
  reduceWithDateInitialValueArray,
  (acc, curr) =>
    acc === null ? curr : new Date(acc.getTime() + curr.getTime()),
  null
);
console.log(
  "95. 使用 reduce 实现 reduce with initial value as date:",
  reduceWithDateInitialValueResult
); // 输出: 2024-01-03T00:00:00.000Z

// 96. 使用 reduce 实现 reduceRight with initial value as date
function customReduceRightWithDateInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const date3 = new Date("2024-01-03");
const date4 = new Date("2024-01-04");
const reduceRightWithDateInitialValueArray = [date3, date4];
const reduceRightWithDateInitialValueResult =
  customReduceRightWithDateInitialValue(
    reduceRightWithDateInitialValueArray,
    (acc, curr) =>
      acc === null ? curr : new Date(acc.getTime() + curr.getTime()),
    null
  );
console.log(
  "96. 使用 reduce 实现 reduceRight with initial value as date:",
  reduceRightWithDateInitialValueResult
); // 输出: 2024-01-07T00:00:00.000Z

// 97. 使用 reduce 实现 reduce with initial value as regex
function customReduceWithRegexInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const regex1 = /a/g;
const regex2 = /b/g;
const reduceWithRegexInitialValueArray = [regex1, regex2];
const reduceWithRegexInitialValueResult = customReduceWithRegexInitialValue(
  reduceWithRegexInitialValueArray,
  (acc, curr) =>
    acc === null ? curr : new RegExp(acc.source + curr.source, "g"),
  null
);
console.log(
  "97. 使用 reduce 实现 reduce with initial value as regex:",
  reduceWithRegexInitialValueResult
); // 输出: /ab/g

// 98. 使用 reduce 实现 reduceRight with initial value as regex
function customReduceRightWithRegexInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const regex3 = /c/g;
const regex4 = /d/g;
const reduceRightWithRegexInitialValueArray = [regex3, regex4];
const reduceRightWithRegexInitialValueResult =
  customReduceRightWithRegexInitialValue(
    reduceRightWithRegexInitialValueArray,
    (acc, curr) =>
      acc === null ? curr : new RegExp(acc.source + curr.source, "g"),
    null
  );
console.log(
  "98. 使用 reduce 实现 reduceRight with initial value as regex:",
  reduceRightWithRegexInitialValueResult
); // 输出: /dc/g

// 99. 使用 reduce 实现 reduce with initial value as set
function customReduceWithSetInitialValue(arr, callback, initialValue) {
  return arr.reduce((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const set1 = new Set([1, 2]);
const set2 = new Set([3, 4]);
const reduceWithSetInitialValueArray = [set1, set2];
const reduceWithSetInitialValueResult = customReduceWithSetInitialValue(
  reduceWithSetInitialValueArray,
  (acc, curr) => {
    if (acc === null) return curr;
    curr.forEach((item) => acc.add(item));
    return acc;
  },
  null
);
console.log(
  "99. 使用 reduce 实现 reduce with initial value as set:",
  reduceWithSetInitialValueResult
); // 输出: Set(4) {1, 2, 3, 4}

// 100. 使用 reduce 实现 reduceRight with initial value as set
function customReduceRightWithSetInitialValue(arr, callback, initialValue) {
  return arr.reduceRight((accumulator, currentValue, index, array) => {
    return callback(accumulator, currentValue, index, array);
  }, initialValue);
}

const set3 = new Set([5, 6]);
const set4 = new Set([7, 8]);
const reduceRightWithSetInitialValueArray = [set3, set4];
const reduceRightWithSetInitialValueResult =
  customReduceRightWithSetInitialValue(
    reduceRightWithSetInitialValueArray,
    (acc, curr) => {
      if (acc === null) return curr;
      curr.forEach((item) => acc.add(item));
      return acc;
    },
    null
  );
console.log(
  "100. 使用 reduce 实现 reduceRight with initial value as set:",
  reduceRightWithSetInitialValueResult
); // 输出: Set(4) {5, 6, 7, 8}
```
