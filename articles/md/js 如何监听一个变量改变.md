---
title: "js 如何监听一个变量改变"
tag: "JavaScript"
time: 2024-09-01 15:21:24
---

## 需求和背景

在业务中，由于项目采用微前端架构，需要通过 A 应用的某个值的变化对 B 应用中的 DOM 进行改变（如弹出一个 Modal），第一个想到的可能是发布订阅模式，其实不如将问题缩小化，采用原生的能力去解决。

下面给出两种解决方案，同时也是尤大写`Vue`时的思路

- ES5 的 `Object.defineProperty`
- ES6 的 `Proxy`

## Object.defineProperty

> `Object.defineProperty()`  方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象
>
> ——MDN

### 用法如下：

```javascript
Object.defineProperty(obj, prop, option);
```

### 入参用法：

- obj：代理对象;
- prop：代理对象中的 key;
- option：配置对象，`get`、`set`都在其中配置;

### 例子：

```javascript
var obj = {
  name: "sorryhc",
};
var rocordName = "sorryhc";

Object.defineProperty(obj, "name", {
  enumerable: true,
  configurable: true,
  set: function (newVal) {
    rocordName = newVal;
    console.log("set: " + rocordName);
  },
  get: function () {
    console.log("get: " + rocordName);
    return rocordName;
  },
});

obj.name = "sorrycc"; // set: sorrycc
console.log(obj.name); // get: sorrycc
```

- 对一个对象进行整体响应式监听：

```javascript
// 监视对象
function observe(obj) {
  // 遍历对象，使用 get/set 重新定义对象的每个属性值
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
  });
}

function defineReactive(obj, k, v) {
  // 递归子属性
  if (typeof v === "object") observe(v);

  // 重定义 get/set
  Object.defineProperty(obj, k, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log("get: " + v);
      return v;
    },
    // 重新设置值时，触发收集器的通知机制
    set: function reactiveSetter(newV) {
      console.log("set: " + newV);
      v = newV;
    },
  });
}

let data = { a: 1 };
// 监视对象
observe(data);
data.a; // get: 1
data.a = 2; // set: 2
```

整体思路就是遇到子对象就递归，和深拷贝一样的读参顺序。

### 缺陷

如果学习过`Vue2`源码的同学可能比较熟，基于下面的缺陷，也是出现了`$set`、`$get`的用法。

- IE8 及更低版本 IE 是不支持的
- 无法检测到对象属性的新增或删除
- 如果修改数组的  `length` （ `Object.defineProperty`  不能监听数组的长度），以及数组的  `push`  等变异方法是无法触发  `setter`  的

## Proxy

> **Proxy**  对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）
>
> — MDN

```javascript
const obj = new Proxy(target, handler);
```

其中：

- `target` ：要使用  `Proxy`  包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
- `handler` ：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理  `obj`  的行为

### 例子

```javascript
const handler = {
  get: function (target, name) {
    return name in target ? target[name] : "no prop!";
  },
  set: function (target, prop, value, receiver) {
    target[prop] = value;
    console.log("property set: " + prop + " = " + value);
    return true;
  },
};

var user = new Proxy({}, handler);
user.name = "sorryhc"; // property set: name = sorryhc

console.log(user.name); // sorryhc
console.log(user.age); // no prop!
```

并且`Proxy`提供了更丰富的代理能力：

- `getPrototypeOf` / `setPrototypeOf`
- `isExtensible` / `preventExtensions`
- `ownKeys` / `getOwnPropertyDescriptor`
- `defineProperty` / `deleteProperty`
- `get` / `set` / `has`
- `apply` / `construct`

感兴趣的可以查看  [MDN](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy) ，一一尝试一下，这里不再赘述

## 在 React 中的实践

这里展示两段伪代码，大概业务流程是，当点击页面某个按钮（打开/关闭弹窗），触发`window.obj.showModal`的切换，从而被监听到全局变量的变化，从而改变`React`中的`state`状态，最终触发`Modal`的弹窗。

### Object.defineProperty

```javascript
window.obj = {
  showModal: false,
};

const [visible, setVisible] = useState(false);

useEffect(() => {
  visible &&
    Modal.show({
      // ...
    });
}, [visible]);

Object.defineProperty(window.obj, "showModal", {
  enumerable: true,
  configurable: true,
  set: function (newVal) {
    setVisible(newVal);
    console.log("set: " + newVal);
  },
  get: function () {
    console.log("get: " + visible);
    return visible;
  },
});

window.obj.showModal = !window.obj.showModal; // set: true
console.log(window.obj.showModal); // get: true
```

### Proxy

```javascript
const [visible, setVisible] = useState(false);

useEffect(() => {
  visible &&
    Modal.show({
      // ...
    });
}, [visible]);

const handler = {
  get: function (target, name) {
    return name in target ? target[name] : "no prop!";
  },
  set: function (target, prop, value, receiver) {
    target[prop] = value;
    setVisible(value);
    console.log("property set: " + prop + " = " + value);
    return true;
  },
};

window.obj = new Proxy({ showModal: false }, handler);
window.obj.showModal = !window.obj.showModal; // property set: showModal = true

console.log(window.obj.showModal); // true
```

## 总结

`Proxy` 相比于 `defineProperty` 的优势：

- 基于 `Proxy` 和 `Reflect` ，可以原生监听数组，可以监听对象属性的添加和删除
- 不需要深度遍历监听：判断当前 `Reflect.get` 的返回值是否为 `Object` ，如果是则再通过 `reactive` 方法做代理， 这样就实现了深度观测
- 只在 `getter` 时才对对象的下一层进行劫持(优化了性能)

而`Proxy`除了兼容性不足以外，其他方面的表示都优于`Object.defineProperty`。

所以，建议使用 `Proxy` 监测变量变化
