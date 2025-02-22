---
title: "Set 和 WeakSet 的用法和区别"
tag: "JavaScript"
time: 2024-09-01 15:21:24
---

Set 和 WeakSet 是 ES6 中新增的两种数据结构，它们都用于存储一组不重复的值。但是它们之间有一些区别，下面我会简要介绍它们的用法和区别，以及相应的应用场景。

## Set 的用法和特点：

Set 是一个类似数组的数据结构，它的成员值都是唯一的，不会重复。 你可以向 Set 中添加值，并且它会自动去重。 Set 中的值可以是任何类型的数据，包括原始类型和对象引用。

下面是 Set 常见的操作方法：

- add(value) : 向 Set 中添加一个新的值。
- delete(value) : 从 Set 中删除一个值。
- has(value) : 判断 Set 中是否包含某个值。
- size : 返回 Set 中值的数量。
- clear() : 清空 Set 中的所有值。

示例代码：

```js
const set = new Set();
set.add(1);
set.add(2);
set.add(2); // 这个值不会被重复添加
set.has(1); // true
set.size; // 2
set.delete(2);
set.clear();
```

下面是一些常见的  Set  的应用场景：

1.  数组去重：

Set  的去重功能非常有用，可以方便地从数组中去除重复的值。可以通过将数组转换为  Set，然后将 Set  转回数组来实现去重。

```js
const arr = [1, 2, 2, 3, 3, 4, 5];
//展开解构，将 Set 转回数组
const res = [...new Set(arr)];
//或者也可以使用Array.from()方法将类数组Set转回数组
const res2 = Array.from(new Set(arr));
console.log(res); //[ 1, 2, 3, 4, 5 ]
console.log(res2); //[ 1, 2, 3, 4, 5 ]
```

2.  数据统计和计数：

Set  可以用来快速统计某个数据集合中不同元素的个数。

```js
const arr = [1, 2, 2, 3, 3, 4, 5];
const res = new Set(arr);
console.log(res.size); // 5
```

3.  数据交集和并集：

Set  也可以通过配合数组的方法，用来求两个数据集合的交集、并集和差集。 （注：如果对 filter 方法还不熟悉的小伙伴可以看我之前的文章，有常用数组方法汇总）

```js
const set1 = new Set([1, 2, 3]);
const set2 = new Set([2, 3, 4]);

// 求交集
const res = new Set([...set1].filter((item) => set2.has(item))); //返回共有的元素
console.log([...res]); // [2, 3]

// 求并集
const res2 = new Set([...set1, ...set2]);
console.log([...res2]); // [1, 2, 3, 4]

// 求差集
const res3 = new Set([...set1].filter((item) => !set2.has(item)));
console.log([...res3]); // [1]
```

4.  去除文本中的重复单词：

Set  可以用来去除文本中的重复单词，可以将文本按照单词分割，然后将单词添加到  Set  中，最后将  Set  转回文本。

```js
const text = "I have have a dog. My dog's name name is Lucky.";
const words = text.split(" "); //将文本以空格作为分隔符，即将每个单词切割出来
const arrWords = [...new Set(words)]; //将 Set 转回数组
const res = arrWords.join(" "); //重新将单词进行拼接成句子
console.log(res); // I have a dog. My dog's name is Lucky.
```

## WeakSet 的用法和特点：

WeakSet 是一种弱引用的集合（只能存储对象引用），它持有的对象都是被弱引用的，不会阻止垃圾回收器对这些对象的回收。也就是说，一个对象被 weakSet 所引用，在垃圾回收机制的眼中，该对象是没有被引用的，那么只要垃圾回收机制一生效，该对象所占据的内存空间会被销毁。

WeakSet 中的对象是无序且不可迭代的，因此没有提供类似于 size 和 forEach 等方法。 WeakSet 中的值不能被枚举，也不能被遍历。

WeakSet 的主要用途是存储临时对象的引用，在某些场景下非常有用，比如需要在对象被销毁时执行一些特定的操作或者需要跟踪对象的存活状态，这些对象在不再需要时会被自动回收。可以帮助我们避免内存泄漏的问题，并且使垃圾回收更加高效。下面是一些使用 WeakSet 的示例代码来展示其应用场景以及和 Set 的区别：

```js
// 1. 使用 WeakSet 跟踪对象的存活状态
const weakset = new WeakSet();

const obj1 = { name: "小米" };
const obj2 = { name: "小露" };

weakset.add(obj1); //添加对象1
weakset.add(obj2); //添加对象2

console.log(weakset.has(obj1)); // true
weakset.delete(obj1); // 执行一些清理操作
console.log(weakset.has(obj1)); // false

//使用Set 与 WeakSet进行结果对比
const set = new Set();
set.add(obj1); //添加对象1
set.add(obj2); //添加对象2
console.log(set.has(obj1)); // true
weakset.delete(obj1); // 执行一些清理操作
console.log(set.has(obj1)); // true
```

```html
<!-- 2. 需要在对象被销毁时执行一些特定的操作，避免内存泄漏 -->
<body>
  <div id="wrap">
    <button id="btn">确认</button>
  </div>
</body>
<script>
  const wrap = document.getElementById("wrap");
  const btn = document.getElementById("btn");
  //给btn打上标签
  const disableElements = new weakSet(); //若使用new Set(),会造成内存泄漏
  disableElements.add(btn);
  btn.addEventListener("click", () => {
    //给按钮添加点击事件
    wrap.removeChild(btn); //按钮点击完成后将其销毁
    console.log(disableElements); //理论上认为为{}
  });
</script>
```

在第一个示例中，我们使用 WeakSet 跟踪对象的存活状态。通过调用 WeakSet 的 add 方法将对象添加到 weakset 实例中，然后可以使用 has 方法来检查对象是否仍然存活。在调用 WeakSet 的 delete 方法时，我们从 weakset 实例中删除对象，并执行了一些清理操作。会发现当使用 WeakSet 存储对象时，如果一个对象被清除了，再调用 has 方法去查找该对象结果会返回 false，而当使用 Set 存储对象时，对象被清除了再查找结果还是 true。所以我们可以使用 WeakSet 来跟踪对象的存活状态。

在第二个示例中，我们展示了使用 WeakSet 来避免内存泄漏。我们在 body 里面创建了一个 button 按钮元素，并且向 button 按钮绑定了一个点击监听事件，然后用了一个弱引用容器 disableElements 存放按钮标签，在我们点击 button 按钮时，会触发监听事件，将 button 按钮从页面中移除。由于  disableElements  中存储的是弱引用，所以当 button 按钮被移除页面后，垃圾回收器会自动回收内存，避免了内存泄漏的问题。而如果我们的 disableElements 是用 Set 创建的容器，那么当执行按钮点击事件后，按钮被移除页面后，则会因为 button 对象被 disableElements 所引用依旧保留在内存中，不会被垃圾回收器自动回收内存，造成内存泄漏。所以，在这种应用场景下使用 WeakSet 容器，就解决了内存泄漏的问题。

## 总结：

Set 和 WeakSet 都是用于存储一组不重复的值，但它们的用法和特点有所不同。Set 可以存储任何类型的值且自动去重，适用于数据去重和快速查找。WeakSet 是一种弱引用的集合，只能存储对象引用，并且不会阻止对象被垃圾回收器回收，适用于需要跟踪对象存活状态或执行一些特定操作的场景。 上面两个示例展示了 WeakSet 的使用场景，即跟踪对象的存活状态和避免内存泄漏。使用 WeakSet 可以更加高效和安全地管理对象引用，确保对象的生命周期和内存资源的正确管理。
