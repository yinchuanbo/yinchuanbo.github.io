---
title: "proxy 和 Object.defineProperty()"
tag: "JavaScript"
time: 2025-01-05 16:01:01
---

## 前言

在 JavaScript 的世界里，数据的流动和交互是至关重要的。然而，直接操作数据可能会带来一系列的问题，例如数据污染、安全隐患等。于是，JavaScript 中的"绑匪"——Proxy 出场了。Proxy，顾名思义，就是一个代理人，它可以站在目标对象的前面，拦截和修改对该对象的访问和操作。通过 Proxy，我们可以实现数据绑定、权限控制、性能优化等一系列的功能。那么，Proxy 究竟是如何工作的？它又能带来什么样的便利和安全性？现在让我们抓住这个劫匪来对他严刑逼供一下。

### 1\. 数据劫持

在我们对 proxy 进行审讯之前，先来了解一下它犯了什么事以及它的前身是什么。接下来我们先来看看它的前身，我们看到文章的题目就知道 proxy 的作用呢就是进行数据劫持，在 proxy 出现之前就有一个函数可以进行数据劫持，它就是`Object.defineProperty()`。在了解它之前我们先来看看什么是数据劫持？

**数据劫持**：

1. 劫持对象中的某一个属性，可以控制该属性是否可读可写可枚举可配置， 还可以指定该属性的值，以及当该属性值被读取时会触发 get 方法，当该 属性值被修改时会触发 set 方法。
2. 只能接收对象，不能劫持数组

**1.1 Object.defineProperty()**

在了解了数据劫持的一些基本概念之后，我们来看看如何使用`Object.defineProperty()`来实现数据劫持。

首先我们先定义一个对象`obj`，其中有个属性`a`并且将其赋值成 1，接下来我们要对 obj 中的 a 进行数据劫持，这时候就要使用`Object.defineProperty()`了，这个函数的参数我们可以传入三个分别是**想要劫持的对象**、**劫持对象的属性**和一个**对象**，下面我们来看代码展示：

```js
let obj = {
  a: 1,
};

// 数据劫持
Object.defineProperty(obj, "a", {
  value: 100, // 让a的值变成100
});

obj.a = 2;
console.log(obj.a);

// 输出：
// 2
```

这时候的输出结果是 2，这里可能就有同学疑惑了，这明明还能给 a 修改数值，劫持又算怎么一回事呢？先别急，在`Object.defineProperty()`中的第三个参数对象中我们可以为其配置属性，而其中的`writable`就可以控制被劫持的属性是否可写，接下来我们在其中加入`writable: false`来看看效果：

```js
let obj = {
  a: 1,
};

// 数据劫持
Object.defineProperty(obj, "a", {
  value: 100, // 让 a 的值变成 100
  writable: false, // obj 中的 a 是否可写
});

obj.a = 2;
console.log(obj.a);

// 输出：
// 100
```

当我们添加了这个属性时候我们可以发现被劫持的 obj 中的 a 属性不能进行修改，只能由 Object.defineProperty()中的`value`属性来修改劫持的数据，这就是我们所说的数据劫持。

简单理解呢就是我们可以使用`Object.defineProperty()`来绑架某一个数据，这时候只能由我们绑匪说了算，别人想被劫持的数据干啥也没用，因为人在我们手里，想撕票就撕票。

除了这两个属性之外，还有很多属性可以让我们对这个人质上点手段，比如`configurable`，这个属性可以让对象上面的属性不被移除，下面我们来看看代码展示：

```js
let obj = {
  a: 1,
};

// 数据劫持
Object.defineProperty(obj, "a", {
  configurable: true, // 是否可配置 === 是否可移除
});

delete obj.a;
console.log(obj.a);

// 输出：
// undefined
```

当我们将`configurable`设置成 true 时就代表该属性可以被移除，但是设置成 false 的话就代表这个属性不可以被移除，接下来我们将其设置成 false 看看效果：

```js
let obj = {
  a: 1,
};

// 数据劫持
Object.defineProperty(obj, "a", {
  configurable: false, // 是否可配置 === 是否可移除
});

delete obj.a;
console.log(obj.a);

// 输出：
// 1
```

我们可以看到此时 obj 中的 a 并没有被移除，那么它身上的第三个参数只能这样配置属性了吗？作为一名合格的绑匪应该有很多种对待人质的方法来充分展现它的价值，它身上除了能配置属性之外，还能配置两个方法分别是`get`和`set`

1.1.1 `get()`

**get()**: 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入 this 对象（由于继承关系，这里的 this 并不一定是定义该属性的对象）。默认为 undefined。

接下来呢我们先来聊聊 `Object.defineProperty()` 中的 `get()`，当我们使用这个方法的时候得注意一点：

`Object.defineProperty(object, propertyName, descriptor) `定义新属性时，descriptor 中不能同时有 访问器(`getter/setter`) 与 `value/writable` 属性。

这时候有同学就会疑惑了，既然不能跟 value 和 writable 同时使用，那这个方法有什么用呢？这个方法不同于我们平常的方法需要我们手动进行调用，当我们想要访问它劫持的那个属性时，这个方法会自动调用并且返回你想要获取的那个属性，接下来我们来看看代码展示：

```js
let obj = {
  a: 1,
};

// 数据劫持
Object.defineProperty(obj, "a", {
  get() {
    return obj.a;
  },
});

console.log(obj.a);
```

<img src="../imgs/133/12.webp" />

当我们运行的时候会发现，怎么爆栈了呢？我们前面明明说了获取 a 的时候会自动调用`get()`然后 return 一个我们想要拿到的`obj.a`，咋就爆了呢？

这里有一个小坑得注意一下，我们思路是没错的，但是当我们返回`obj.a`时，是不是又要去获取被劫持的`a`属性，然后就又要调用一次`get()`，当调用它的时候，然后又要重新获取`obj.a`。这样的话不就进入了无限套娃死循环吗，这时候就会出现爆栈这个问题了。

那么我们如何才能从绑匪手中拿到 obj.a 呢？这时候我们可以在绑匪绑架之前先来个偷梁换柱，设置一个变量`value`用来储存 obj.a 的值，然后在调用 get 方法的时候`return value`，接下来我们修改一下代码来试试效果：

```js
let obj = {
  a: 1,
};
let value = obj.a;

// 数据劫持
Object.defineProperty(obj, "a", {
  get() {
    return value;
  },
});

console.log(obj.a);

// 输出：
// 1
```

这时候我们发现可以正常输出了，但是有没有想过一个问题，我们如果在外面修改 obj.a 的话，那打印出来的 obj.a 是修改后的还是原来的值呢？下面我们来看看结果：

```js
let obj = {
  a: 1,
};
let value = obj.a;

// 数据劫持
Object.defineProperty(obj, "a", {
  get() {
    return value;
  },
});

obj.a = 2;
console.log(obj.a);

// 输出：
// 1
```

这时候我们发现输出结果还是 1，因为我们返回的还是那个 value 并没有改变过 value 的值，那这时候我们就会发现好像修改不了 obj.a 的值了，那咋办呢？这时候就需要 set 登场了。

1.1.2 `set()`

**set()**：一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。默认为 undefined。

`set()`这个函数可以传入一个参数 val，用来接收我们对劫持的数据修改后的数据，接下来我们来用一段代码展示一下：

```js
let obj = {
  a: 1,
};
let value = obj.a;

// 数据劫持
Object.defineProperty(obj, "a", {
  get() {
    return value;
  },
  set(val) {
    console.log("获取到了val", val);
  },
});

obj.a = 2;
console.log(obj.a);
```

<img src="../imgs/133/13.webp" />

我们根据控制台的打印结果可以得知，当我们对劫持的数据进行修改的时候，`set()`就会被触发，并且传入其中的参数就是修改后的那个值。但是此时我们发现 obj.a 的值并没有随之修改，这个时候我们可以根据**set 每次修改被劫持数据就会自动触发一次时的特性从而修改 value 的值**，进而改变我们想要拿到的 obj.a 的值，接下来我们来看代码：

```js
let obj = {
  a: 1,
};
let value = obj.a;

// 数据劫持
Object.defineProperty(obj, "a", {
  get() {
    return value;
  },
  set(val) {
    value = val;
    console.log("获取到了val", val);
  },
});

obj.a = 2;
console.log(obj.a);
```

<img src="../imgs/133/14.webp" />

这时候我们可以看到已经成功修改了 obj.a 的属性并且能够获取到。

在了解完了`get`和`set`这两个函数的作用和用法之后，下面我们来实现一个小功能：现在我有一个对象 obj，里面有三个属性分别是 a、b、c 并且都是 Number 类型，每次我对里面的任何一条数据进行修改时，都要给我打印修改后这三个属性的和，接下来我们来实现一下这个功能。

首先我们如果想要每次修改之后都计算一下总和，那么肯定要一个计算总和的函数，并且在每次修改之后都会执行一次，这里就得用到我们的`set`了，它就相当于一个监听器一样，每次修改劫持的数据时都会触发，有了这个思路之后，下面我们来看一下代码实现：

```js
let obj = {
  a: 1,
  b: 2,
  c: 3,
};

for (let key in obj) {
  let value = obj[key];
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(val) {
      value = val;
      log();
    },
  });
}

obj.a = 10;
obj.b = 20;
obj.c = 30;

function log() {
  console.log(obj.a + obj.b + obj.c);
}
```

<img src="../imgs/133/15.webp" />

在上面代码中我们使用了一个`for in`来对 obj 中每个属性都进行数据劫持，并且各自都有一个 value 所以不会爆栈，根据`set()`的特性，我们只需要将每次修改的属性对应 key 然后将 value 赋值成新的值即可。这样每次进行修改的时候，obj 中的对应属性值会被更新，并且函数`log()`也会执行一次。

1.1.3 手写 watch

我们都知道 vue 中有几个可以进行监听的函数，常用的就有 computed 和 watch，这类函数可以监听我们页面的数据变化，当数据变换的时候可以执行相应的操作。这里大家有没有联想到我们前面所讲的`set()`，它同样也有这个特性，每当劫持的数据发生变更时，就自动执行一次，利用这个特性我们可以手写一个 watch，接下来我们来实现一下。

官方定义的 watch 是能传入几个参数的，在这里我们就按照`Object.defineProperty()`的特性给我们自定义的 wwatch 传入三个参数，分别是**对象**、**想要劫持的数据**、**回调函数**，然后我们对传入的数据进行劫持，并且在 watch 中设置一个 value 用来储存这个数据防止爆栈，接下来我们来看 html 和 js 代码以及页面展示：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      <h1 id="count">1</h1>
      <button id="btn">add</button>
    </div>

    <script>
      const btn = document.getElementById("btn");
      const h1 = document.getElementById("count");

      let obj = {
        count: 1,
      };

      watch(obj, "count", (newVal, oldVal) => {
        console.log(newVal);
      });

      // 手写 watch
      function watch(obj, key, cb) {
        let value = obj[key];
        Object.defineProperty(obj, key, {
          get() {
            return value;
          },
          set(newValue) {
            cb(newValue, value);
            value = newValue;
          },
        });
      }

      btn.addEventListener("click", () => {
        obj.count++;
      });
    </script>
  </body>
</html>
```

<img src="../imgs/133/16.webp" />

### 2\. proxy

在我们了解完了 Object.defineProperty()也就是 proxy 的前身之后，会不会觉得这个东西写起来有点复杂还得注意 value 爆栈的问题，官方呢为了方便我们在新版本的 es6 中推出了 proxy 这个方法，毕竟时代变了咱得文明一点不能老是劫匪劫匪的，现在改名叫代理了。

**proxy**：

1. 直接代理整个对象，对象上的读取值、修改值、添加属性、删除属性等 13 个操作， 都会被代理到某个函数上
2. 可以代理数组

接下来我们来看看 proxy 的使用方法，其实跟它的前身是差不多的，一样有 get 和 set，就是把它们变成了属性，后面接收一个函数，下面我们来看代码示例：

```js
let obj = {
  a: 1,
  b: 2,
  c: 3,
};

// 代理是整个对象都被绑架，简单来说就是对象上的种种行为都有一个代理函数
let proxy = new Proxy(obj, {
  get: function (target, key) {
    return target[key];
  },
  set: function (target, key, value) {
    target[key] = value;
  },
  // xxx 包括set get 一共13个函数
});

proxy.a = 10; // 会触发 set
console.log(proxy.a); // 会走proxy中的get方法

// 输出：
// 10
```
