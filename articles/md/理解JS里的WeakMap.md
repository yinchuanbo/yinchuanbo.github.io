---
title: "理解 JS 里的 WeakMap"
tag: "JavaScript"
time: 2024-12-25 21:49:27
---

WeakMap 是 javascript 里面的一种集合类型，它的键是对象的弱引用。

**那什么是弱引用呢？** 弱引用是一种引用类型，它指向一个对象，但不会增加该对象的引用计数。

弱引用的存在给垃圾回收器提供了这样的一种行为：即便一个对象存在着弱引用，垃圾回收器仍然会回收该对象所占用的内存。在处理大对象的时候，弱引用对防止内存泄露很有帮助。

WeakMap 是 javascript 里面的一种弱引用集合。它具有以下特点：

- 键必须是对象
- 无法枚举
- 没有 size 属性
- 只提供 get(key), set(key, value), has(key), delete(key) 方法

```js
const weakMap = new WeakMap();

const obj = {};
weakMap.set(obj, "some value");

console.log(weakMap.get(obj)); // output: 'some value'

// 当 obj 被回收后，WeakMap 中的键也会被自动移除
obj = null;
console.log(weakMap.has(obj)); // output: false
```

在前面的一篇文章里 [如何在 JS 里进行深拷贝](https://mp.weixin.qq.com/s?__biz=MzkwNTc0MjU0NQ==&mid=2247484082&idx=1&sn=19e04a5653388507b77f03dde3471d68&scene=21#wechat_redirect) 我们介绍了使用递归算法进行深拷贝。下面我们使用 WeakMap 进行一下优化：

```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return null;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== "object") return obj;
  if (hash.has(obj)) return hash.get(obj);

  let cloneObj = new obj.constructor();
  hash.set(obj, cloneObj);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```

相比之前的代码，增加了第 6 行：

```js
if (hash.has(obj)) return hash.get(obj);
```

以及第 9 行：

```js
hash.set(obj, cloneObj);
```

在这个改进的方法里面，我们引入了一个 WeakMap 的参数，用于存储原对象和其对应的拷贝对象，以避免循环引用的问题，防止无限递归。
