---
title: "reduce 的高级用法"
tag: "JavaScript"
time: 2024-09-01 15:21:24
---

## 用例 1：对数字求和

reduce() 最直接的用例之一是对一堆数字求和。假设您有一个整数数组，并且您想要找到总和。

```ts
const numbers: number[] = [1, 2, 3, 4, 5];
const sum: number = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // Output: 15
```

只需一行代码，您就可以计算出数组中所有元素的总和。累加器的初始值设置为 0，并且在每次迭代中，我们将当前元素添加到累加器中。

## 用例 2：展平数组

您是否曾经发现自己有一个数组数组并想：“我希望我可以将其扁平化为一个数组”？

```ts
const nestedArray: number[][] = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const flattenedArray: number[] = nestedArray.reduce(
  (acc, curr) => acc.concat(curr),
  []
);
console.log(flattenedArray); // Output: [1, 2, 3, 4, 5, 6]
```

我知道您也可以使用 Array.flat() 来做到这一点。然而，了解如何使用 reduce 很重要，以防您想对每个项目执行额外的操作。

## 用例 3：对对象进行分组

假设您有一个对象数组，并且您希望根据特定属性对它们进行分组。 reduce() 是完成这项工作的完美工具。

```ts
interface Person {
  name: string;
  age: number;
}
const people: Person[] = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
  { name: "Dave", age: 30 },
];
const groupedByAge: { [key: number]: Person[] } = people.reduce((acc, curr) => {
  if (!acc[curr.age]) {
    acc[curr.age] = [];
  }
  acc[curr.age].push(curr);
  return acc;
}, {});
console.log(groupedByAge);
/*
Output:
{
 '25': [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
 '30': [{ name: 'Bob', age: 30 }, { name: 'Dave', age: 30 }]
}
*/
```

## 用例 4：创建查找映射

我个人最喜欢的是使用 reduce()从数组创建查找映射。在性能和代码可读性方面，它改变了游戏规则。停止使用那些缓慢的 find() 或 filter() 调用。

做了映射之后时间复杂度为 O(1)。

```ts
interface Product {
  id: number;
  name: string;
  price: number;
}
const products: Product[] = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Phone", price: 699 },
  { id: 3, name: "Tablet", price: 499 },
];
const productMap: { [key: number]: Product } = products.reduce((acc, curr) => {
  acc[curr.id] = curr;
  return acc;
}, {});
console.log(productMap);
/*
Output:
{
 '1': { id: 1, name: 'Laptop', price: 999 },
 '2': { id: 2, name: 'Phone', price: 699 },
 '3': { id: 3, name: 'Tablet', price: 499 }
}
*/
// Accessing a product by ID
const laptop: Product = productMap[1];
console.log(laptop); // Output: { id: 1, name: 'Laptop', price: 999 }
```

## 用例 5：计数出现次数

曾经需要计算数组中元素的出现次数吗？ reduce() 已经帮你解决了。

```ts
const fruits: string[] = [
  "apple",
  "banana",
  "apple",
  "orange",
  "banana",
  "apple",
];
const fruitCounts: { [key: string]: number } = fruits.reduce((acc, curr) => {
  acc[curr] = (acc[curr] || 0) + 1;
  return acc;
}, {});
console.log(fruitCounts);
/*
Output:
{
 'apple': 3,
 'banana': 2,
 'orange': 1
}
*/
```

## 用例 6：组合函数

函数式编程爱好者一定会喜欢这个。 reduce() 是一个强大的函数组合工具。您可以使用它来创建逐步转换数据的函数管道。

```ts
const add5 = (x: number): number => x + 5;
const multiply3 = (x: number): number => x * 3;
const subtract2 = (x: number): number => x - 2;
const composedFunctions: ((x: number) => number)[] = [
  add5,
  multiply3,
  subtract2,
];
const result: number = composedFunctions.reduce((acc, curr) => curr(acc), 10);
console.log(result); // Output: 43
```

## 用例 7：实现简单的类似 Redux 的状态管理

如果您使用过 Redux，您就会知道它在管理应用程序中的状态方面有多么强大。你猜怎么了？你可以使用 reduce()来实现一个简单的类似 Redux 的状态管理系统。

```ts
interface State {
  count: number;
  todos: string[];
}
interface Action {
  type: string;
  payload?: any;
}
const initialState: State = {
  count: 0,
  todos: [],
};
const actions: Action[] = [
  { type: "INCREMENT_COUNT" },
  { type: "ADD_TODO", payload: "Learn Array.reduce()" },
  { type: "INCREMENT_COUNT" },
  { type: "ADD_TODO", payload: "Master TypeScript" },
];
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "INCREMENT_COUNT":
      return { ...state, count: state.count + 1 };
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    default:
      return state;
  }
};
const finalState: State = actions.reduce(reducer, initialState);
console.log(finalState);
/*
Output:
{
 count: 2,
 todos: ['Learn Array.reduce()', 'Master TypeScript']
}
*/
```

## 用例 8：生成唯一值

有时，您可能有一个包含重复值的数组，并且您需要仅提取唯一的值。 reduce() 可以帮助您轻松实现这一点。

```ts
const numbers: number[] = [1, 2, 3, 2, 4, 3, 5, 1, 6];
const uniqueNumbers: number[] = numbers.reduce((acc, curr) => {
  if (!acc.includes(curr)) {
    acc.push(curr);
  }
  return acc;
}, []);
console.log(uniqueNumbers); // Output: [1, 2, 3, 4, 5, 6]
```

## 用例 9：计算平均值

```ts
const grades: number[] = [85, 90, 92, 88, 95];
const average: number = grades.reduce((acc, curr, index, array) => {
  acc += curr;
  if (index === array.length - 1) {
    return acc / array.length;
  }
  return acc;
}, 0);
console.log(average); // Output: 90
```

## 性能考虑

虽然 Array.reduce() 非常强大且用途广泛，但了解潜在的性能缺陷非常重要，尤其是在处理大型数组或复杂操作时。一个常见的陷阱是在每次 reduce()迭代中创建新的对象或数组，这可能导致过多的内存分配并影响性能。 例如，考虑以下代码：

```ts
const numbers: number[] = [1, 2, 3, 4, 5];
const doubledNumbers: number[] = numbers.reduce((acc, curr) => {
  return [...acc, curr * 2];
}, []);
console.log(doubledNumbers); // Output: [2, 4, 6, 8, 10]
```

在本例中，我们使用展开运算符 (...) 在每次迭代中创建一个新数组，这可能效率低下。相反，我们可以通过直接改变累加器数组来优化代码：

```ts
const numbers: number[] = [1, 2, 3, 4, 5];
const doubledNumbers: number[] = numbers.reduce((acc, curr) => {
  acc.push(curr * 2);
  return acc;
}, []);
console.log(doubledNumbers); // Output: [2, 4, 6, 8, 10]
```
