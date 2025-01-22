---
title: "Vuex 状态管理"
tag: "Vue"
time: 2025-01-22 13:27:30
---

## 认识 Vuex 状态管理

### 认识状态管理

在开发中，应用程序需要处理各种各样的数据，这些数据需要保存在应用程序中的某一个位置。对这些数据的管理，我们就称为**状态管理**。

实际上，Vue3 组件内部的数据以单向数据流的形式进行管理。具体来说，Vue3 组件的数据定义在 State(即 data 或 setup)中，在 View 层(即 template)使用 State 中的数据，View 层中会产生一些 Actions (比如单击事件)，而这些 Actions 可能会修改 State 的数据。

这就是以单向数据流的形式进行状态管理

如今 JavaScript 开发的应用程序变得越来越复杂，需要管理的状态也越来越多。比如，服务器返回的数据、缓存数据、用户操作产生的数据等；还有一些 UI 状态，比如元素是否被选中、是否显示加载动效等。通常，这些状态也需要在多个组件之间共享。

<img src="../imgs/139/02.png" />

然而，如果还是通过 Props 传递或 Provide 等方式来共享这些复杂且需要在多个组件中共享的数据，状态就会变得非常难以控制和追踪，也难以实现在兄弟组件之间共享数据。比如，状态之间相互存在依赖、一个状态的变化会引起另一个状态的变化、状态需要在多个组件之间共享等。

因此，我们可以考虑将组件内部状态抽离出来，以一个全局单例的方式进行管理。这样，我们可以通过插件的形式将该单例挂载到 Vue3 实例上，任何组件都能从该单例上获取状态或触发行为。这种方式能够更好地控制和追踪状态的变化，同时能够更好地实现兄弟组件之间共享数据。这就是 Vuex 背后的基本思想。

**下面来看看 Vuex 状态管理流程：**

(1) 在 State 中定义全局状态(变量)。

(2) 在 Vue Components 组件树中使用 State 定义的状态

(3) Vue Components 组件树通过 Dispatch 分发 Actions (也可直接通过 Commit 提交到 Mutations)

(4) Actions 支持编写异步逻辑，可将异步请求的数据提交到 Mutations 中

(5) Mutations 以同步的方式修改 State 状态，并且 State 的状态只能在 Mutations 中修改。

<img src="../imgs/139/03.png" />

### Vuex 的基本使用

**第一步: 安装 Vuex 库**

```sh
npm i vuex@4.0.2 --save
# 或者
npm i vuex@next --save
```

**第二步: 创建 Store**

在 Vue3 中，Vuex 的核心是 Store(仓库)。仓库本质上是一个容器，用于存储应用程序大部分的状态。仓库中存储的状态具有以下特点

1. 状态是响应式的。当组件从仓库中读取状态时，如果仓库中的状态发生变化，那么相应的组件也会更新

2. 不能直接改变仓库中的状态。改变仓库中的状态的唯一途径是显式提交 mutation。这样可以方便地跟踪每个状态的变化，从而让我们能够通过一些工具(如 Vue.js devtools) 更好地管理应用状态。

```sh
|--src
  |--store
    |--index.js
```

```js
import { createStore } from "vuex";
const store = createStore({
  state() {
    return {
      counter: 0,
    };
  },
});
export default store;
```

**第三步: 将 Vuex 插件安装到 Vue3 框架中**

- src/main.js

```js
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
const app = createApp(App);
app.use(store);
app.mount("#app");
```

**第四步: 使用 store**

```html
<!-- App.vue -->
<template>
  <div>当前计数: {{ $store.state.counter }}</div>
</template>
```

下面继续演示修改 store 中的 counter 变量 `注意: 修改 store 中的变量必须在 mutations 中进行`

- src/store/index.js

```js
import { createStore } from "vuex";
const store = createStore({
  state() {
    return {
      counter: 0,
    };
  },
  // 在 mutations 中修改全局状态
  mutations: {
    increment(state) {
      state.counter++; // 修改全局的 counter
    },
    decrement(state) {
      state.counter--; // 修改全局的 counter
    },
  },
});
export default store;
```

> 需要注意的是: 在 mutations 中定义的函数，第一个参数默认会获取 `state()` 函数中返回的对象 slate

```html
<!-- App.vue -->
<template>
  <div>当前计数: {{ $store.state.counter }}</div>
  <button @click="increment">+1</button>
  <button @click="decrement">-1</button>
</template>
<script>
  import { useStore } from "vuex";
  export default {
    name: "App",
    methods: {
      increment() {
        this.$store.commit("increment");
      },
    },
    setup() {
      const store = useStore();
      const decrement = () => {
        store.commit("decrement");
      };
      return {
        decrement,
      };
    },
  };
</script>
```

## Vuex 的核心概念

Vue 3 的响应式系统和双向数据绑定是 Vuex 底层原理的基础。Vuex 的核心概念包括以下内容。

(1) state: 即存储数据的地方，所有组件都可以访问和使用 store 中的状态。

(2) getters: 可以理解为 store 中的计算属性，用于从 store 中的 state 中派生一些状态

(3) mutations: 用于同步修改 store 中的状态，必须是同步函数。

(4) actions: 用于异步提交 mutations，可以包含任意异步操作。

(5) modules: 用于将 store 分割成多个模块，每个模块可以维护自己的 state、getter、mutation、action 。

### state

state 表示应用的状态，即存储数据的地方。Vuex 通过 “单一状态树” 来管理应用层级的全部状态，将应用的所有状态存储在一个单独的 store 中，而不是分散在多个 store 对象或各个组件的 data 属性中。

这种设计模式可以方便地对数据进行全局状态的管理，避免组件间状态共享带来的复杂性，也更容易追踪状态的变化等。

**1. 使用计算属性读取状态**

对于存储在 store 中的状态，除了可以在模板中使用 `$store.state` 来读取，也可以使用计算属性来读取。

```html
<template>
  <div>
    <h4>Home: {{ $store.state.counter }}</h4>
    <h4>Home: {{ counter }}</h4>
  </div>
</template>
<script>
  import { computed } from "vue";
  export default {
    name: "Home",
    computed: {
      counter() {
        return this.$store.state.counter; // 使用计算属性来读取状态
      },
    },
  };
```

在计算属性中，尽管可以读取状态，但是一旦读取的状态过多，代码就会变得烦琐。为了简化状态的获取过程，Vuex 提供了 mapState 辅助函数。

mapState 辅助函数有两种使用方式:

- mapState 函数，接收对象类型参数

- mapState 函数，接收数组类型参数

(1) mapState 函数，接收对象类型参数

```js
// src/store/index.js
import { createStore } from "vuex";
const store = createStore({
  state() {
    return {
      counter: 0,
      name: "why",
      age: 18,
    };
  },
  //...
});

export default store;
```

```html
<template>
  <div>
    <h4>Home: {{ $store.state.counter }}</h4>
    <h4>Home: {{ counter }}</h4>
    <h4>Home: {{ name }}</h4>
    <h4>Home: {{ HyAge }}</h4>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  export default {
    name: "Home",
    data() {
      return {
        firstName: "coder",
      };
    },
    computed: {
      // mapState 函数，接收对象类型参数
      ...mapState({
        // 箭头函数，不绑定 this
        counter: (state) => state.counter,
        name(state) {
          return this.firstName + state.name;
        },
        HyAge: "age",
      }),
    },
  };
</script>
```

(2) mapState 函数，接收数组类型参数

mapState 函数还可以接收数组类型参数，并返回一个对象。

```html
<template>
  <div>
    <h4>Home: {{ $store.state.counter }}</h4>
    <h4>Home: {{ counter }}</h4>
    <h4>Home: {{ name }}</h4>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  export default {
    name: "Home",
    computed: {
      // mapState 函数，接收数组类型参数
      ...mapState(["counter", "name"]),
    },
  };
```

**2. 在 setup 函数中读取状态**

```html
<template>
  <div>
    <h4>Home: {{ $store.state.counter }}</h4>
    <h4>Home: {{ counter }}</h4>
    <h4>Home: {{ name }}</h4>
    <h4>Home: {{ age }}</h4>
  </div>
</template>
<script>
  import { mapState, useStore } from "vuex";
  import { computed } from "vue";
  export default {
    name: "Home",
    setup() {
      const store = useStore();
      // 在 computed 中通过 store 来获取状态
      const counter = computed(() => store.state.counter);
      const name = computed(() => store.state.name);
      const age = computed(() => store.state.age);
      return {
        counter,
        name,
        age,
      };
    },
  };
</script>
```

下面看看如何在 setup 函数中使用 mapState 函数

```html
<template>
  <div>
    <h4>Home: {{ $store.state.counter }}</h4>
    <h4>Home: {{ counter }}</h4>
    <h4>Home: {{ name }}</h4>
    <h4>Home: {{ age }}</h4>
  </div>
</template>
<script>
  import { mapState, useStore } from "vuex";
  import { computed } from "vue";
  export default {
    name: "Home",
    setup() {
      const store = useStore();
      const storeStateFns = mapState(["counter", "name", "age"]);
      // storeStateFns 打印为：{ name: function, age: function, counter: function  }
      const storeState = {};
      Object.keys(storeStateFns).forEach((fnKey) => {
        const fn = storeStateFns[fnKey].bind({ $store: store }); // 绑定 this 为 { $store: store }
        storeState[fnKey] = computed(fn);
      });
      // storeState 打印为：{name: ref, age: ref, counter: ref}
      return {
        ...storeState,
      };
    },
  };
</script>
```

可以看到，这里使用 mapState 辅助函数对 state 中的 counter、name 和 age 变量进行映射。由于这里使用的是 setup 语法，mapState 函数返回的对象赋值给了 storeStateFns 变量，而不是 computed 选项。

因此，我们需要将 storeStateFns 对象里的函数转换成计算属性，以便在 template 中使用，接着，遍历 storeStateFns 对象，取出对象中的每个函数,并为函数绑定 this (即绑定 `{$store:store}` 对象)。然后，将这些函数转换成计算属性函数，并赋值给 storeState 对象。最后，在 return 语
句中将 storeState 对象解构并返回。

**3. mapState 的封装**

```sh
|--src
  |--hooks
    |--useState.js
    |--index.js
```

```js
// useState.js
import { mapState, useStore } from "vuex";
import { computed } from "vue";

export function useState(mapper) {
  const store = useStore();
  const storeStateFns = mapState(mapper);
  const storeState = {};
  Object.keys(storeStateFns).forEach((fnKey) => {
    const fn = storeStateFns[fnKey].bind({ $store: store });
    storeState[fnKey] = computed(fn);
  });
  return storeState;
}
```

```js
// index.js
import { useState } from "./useState";
export { useState };
```

```html
<template>
  <div>
    <h4>Home: {{ $store.state.counter }}</h4>
    <h4>Home: {{ counter }}</h4>
    <h4>Home: {{ name }}</h4>
    <h4>Home: {{ age }}</h4>
  </div>
</template>
<script>
  import { useState } from "../hooks";
  export default {
    name: "Home",
    setup() {
      // 数组形式
      const storeState = useState(["counter"]);
      // 对象形式
      const storeState2 = useState({
        name: (state) => state.name,
        age: (state) => state.age,
      });
      return {
        ...storeState,
        ...storeState2,
      };
    },
  };
</script>
```

### getters

Vuex 允许我们在 store 中定义 getters。geters 可以理解为 Vuex 的计算属性，可以从 store 中的 state 中派生出一些状态。这样，我们就可以在任意组件中直接使用 getters 中定义的方法了。

**1. getters 的基本使用**

```js
// src/store/index.js
const Store = createStore({
  state() {
    return {
      books: [
        {
          name: "Vue.js",
          count: 10,
          price: 10,
        },
        {
          name: "Java",
          count: 20,
          price: 20,
        },
        {
          name: "Python",
          count: 30,
          price: 30,
        },
      ],
      discount: 0.8,
    };
  },
  getters: {
    totalPrice(state) {
      let totalPrice = 0;
      state.books.forEach((book) => {
        totalPrice += book.count * book.price;
      });
      return totalPrice;
    },
  },
});
export default Store;
```

使用 getters

```html
<template>
  <div>
    <h4>书籍总价: {{ $store.getters.totalPrice }}</h4>
  </div></template
>
```

**2. getters 中方法的参数**

在 getters 中定义的方法可以接收两个参数，分别为 state 对象和 getters 对象

```js
// src/store/index.js
const Store = createStore({
  state() {
    return {
      //...
      discount: 0.8,
    };
  },
  getters: {
    totalPrice(state, getters) {
      let totalPrice = 0;
      state.books.forEach((book) => {
        totalPrice += book.count * book.price;
      });
      return totalPrice * getters.currentDiscount;
    },
    currentDiscount(state) {
      return state.discount;
    },
  },
});
export default Store;
```

**3. getters 中定义的方法返回函数类型**

在 getters 中定义的方法不仅可以返回值，还支持返回一个函数。如果返回的是函数，那么在使用时相当于调用这个函数。同时，我们可以向该函数传递参数，以实现数据的传递。

```js
// src/store/index.js
const Store = createStore({
  state() {
    return {
      //...
      discount: 0.8,
    };
  },
  getters: {
    totalPrice(state, getters) {
      let totalPrice = 0;
      state.books.forEach((book) => {
        totalPrice += book.count * book.price;
      });
      return totalPrice * getters.currentDiscount;
    },
    currentDiscount(state) {
      return state.discount;
    },
    totalPriceByName(state) {
      return function (name) {
        let totalPrice = 0;
        state.books.forEach((book) => {
          if (book.name === name) {
            totalPrice += book.count * book.price;
          }
        });
        return totalPrice;
      };
    },
  },
});
export default Store;
```

```html
<template>
  <div>
    <h4>书籍总价: {{ $store.getters.totalPrice }}</h4>
    <h4>书籍总价: {{ $store.getters.totalPriceByName('Java') }}</h4>
  </div></template
>
```

[未完待续]