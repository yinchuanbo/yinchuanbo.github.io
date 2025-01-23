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

**4. mapGetters 辅助函数**

Vuex 同样提供了 mapGetters 辅助函数，用于简化获取 getters 的操作，其语法与 mapState 函数类似。

(1) computed 属性中使用 mapGetters 函数

```html
<template>
  <div>
    <h4>{{ $store.getters.totalPrice }}</h4>
    <h4>{{ $store.getters.totalPriceByName('Java') }}</h4>

    <h4>{{ totalPrice }}</h4>
    <h4>{{ discount }}</h4>
  </div>
</template>
<script>
  import { mapGetters } from "vuex";
  export default {
    name: "Home",
    computed: {
      ...mapGetters(["totalPrice"]), // 数组语法
      ...mapGetters({
        discount: "currentDiscount", // 对象语法
      }),
    },
  };
</script>
```

(2) setup 函数中使用 mapGetters 函数

与 mapState 类似，mapGetters 函数返回对象中的属性并不是计算属性，因此不能直接在页面中展示。下面封装一个 useGetters 函数来统一处理，

```sh
|--src
  |--hooks
    |--useGetters.js
    |--index.js
```

```js
// useGetters.js
import { mapGetters, useStore } from "vuex";
import { computed } from "vue";

export function useGetters(mapper) {
  const store = useStore();
  const storeGettersFns = mapGetters(mapper);
  const storeGetters = {};
  Object.keys(storeGettersFns).forEach((fnKey) => {
    const fn = storeGettersFns[fnKey].bind({ $store: store });
    storeGetters[fnKey] = computed(fn);
  });
  return storeGetters;
}
```

```js
// hooks/index.js
import { useGetters } from "./useGetters";
export { useGetters };
```

```html
<template>
  <div>
    <h4>{{ totalPriceByName("Java") }}</h4>
  </div>
</template>
<script>
  import { useGetters } from "../hooks";
  export default {
    setup() {
      const storeGetters = useGetters(["totalPriceByName"]);
      return {
        ...storeGetters,
      };
    },
  };
</script>
```

### mutations

在 Vuex 状态管理模式中，mutations 是一个重要的概念，用于更改 store 中的状态。需要注意的是，mutations 必须是同步的，因为它是直接更改 store 中状态的唯一方法。

**1. mutations 的基本使用**

```js
// src/store/index.js`
const Store = createStore({
  state() {
    return {
      counter: 0,
    };
  },
  mutations: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
  },
});
export default Store;
```

可以看到，在 mutations 中，我们定义了两个函数，分别是 `increment` 和 `decrement`。这两个函数不能直接调用，因为在 mutations 中定义的选项更像事件注册。需要调用 `$store.commit` 方法提交一个类型为 increment 的 mutation 函数，才能调用 increment 函数。

```html
<template>
  <div>
    <h4>当前计数: {{ $store.state.counter }}</h4>
    <button @click="$store.commit('increment')">+1</button>
    <button @click="$store.commit('decrement')">-1</button>
  </div>
</template>
```

**2. mutations 接收参数**

在 mutations 中定义的方法可以接收两个参数，分别为 state 对象和 payload 对象。payload 对象是一个对象

其中 payload 用于接收提交 (commit) 时传递过来的参数，

```js
// src/store/index.js`
const Store = createStore({
  state() {
    return {
      counter: 0,
    };
  },
  mutations: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    incrementN(state, payload) {
      state.counter += payload.num;
    },
  },
});
export default Store;
```

```js
export default {
  methods: {
    addTen() {
      this.$store.commit("incrementN", {
        num: 10,
        name: "why"
        age: 18
      });
    },
  },
};
```

另外，`$store.commit` 还支持对象的方式

```js
this.$store.commit({
	type: "incrementN",
	// 将下面的属性都传递给 payload 参数
	num: 10,
	name: "why"
	age: 18
});
```

**3. mutations 常量类型**

从上面的案例中可以看出，为了触发 mutations 中的回调函数，`$store.commit` 提交的 type 值必须与 mutations 中定义的函数名称相同。

为了确保 type 值与函数名称一一对应，我们通会将 type 值提取为一个常量，这样可以避免在工作中出现不必要的错误。

```sh
|--src
  |--store
		|--mutation-types.js
```

```js
// mutation-types.js
export const INCREMENT_N = "incrementN";
```

```js
// src/store/index.js`
import { INCREMENT_N } from "./mutation-types";
const Store = createStore({
  state() {
    return {
      counter: 0,
    };
  },
  mutations: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    // 使用一个常量作为函数名字
    [INCREMENT_N](state, payload) {
      state.counter += payload.num;
    },
  },
});
export default Store;
```

```js
import { INCREMENT_N } from "../store/mutation-types";
export default {
	methods: {
		addTen() {
			this.$store.commit(INCREMENT_N, {
				num: 10,
				name: "why"
				age: 18
			});
		},
	},
};
```

**4. mapMutations 辅助函数**

```html
<template>
  <button @click="increment">+1</button>
  <button @click="decrement">-1</button>
  <button @click="incrementN({num: 20})">+20</button>
</template>
<script>
  import { mapMutations } from "vuex";
  import { INCREMENT_N } from "../store/mutation-types";
  export default {
    methods: {
      ...mapMutations(["increment"]),
      ...mapMutations({
        incrementN: INCREMENT_N,
      }),
    },
    setup() {
      const storeMutations = mapMutations(["decrement"]);
      return {
        ...storeMutations,
      };
    },
  };
</script>
```

> 在 Vuex 中，mutations 必须是同步的。这是因为 Vue.js devtools 工具会记录 mutations 函数的日志，每条 mutation 被记录时，Vue.js devtools 都需要捕捉到前一次状态和后一次状态的快照。如果在 mutation 中执行异步操作，就无法追踪到数据的变化。

### actions

在 Vuex 状态管理模式中，actions 是一个重要的概念。与 mutations 不同，actions 用于异步更改 Store 中的状态。它类似于 mutations,但是负责提交 mutation 函数，而不是直接变更状态，可以用于执行异步操作。

**1. actions 的基本使用**

```js
// src/store/index.js
const Store = createStore({
  // ...
  actions: {
    incrementAction(context) {
      // 模拟异步
      setTimeout(() => {
        context.commit("increment"); // 提交一个 type 为 increment 的 mutation 函数
      }, 1000);
    },
    decrementAction(context) {
      // 解构
      const { commit, dispatch, state, rootState, getters, rootGetters } =
        context;
      commit("decrement");
    },
  },
});
```

> context 是一个与 store 实例具有相同方法和属性的上下文对象。

context 参数也支持 ES6 解构写法：

```js
// ...
actions: {
	incrementAction({ commit, dispatch, state, rootState, getters, rootGetters }) {
		// 也可以提交多个
		commit("increment")
		commit("increment")
	},
}
//...
```

调用 actions 中的方法要使用 `$store.dispatch`

```html
<template>
  <div>
    <h4>当前计数: {{ $store.state.counter }}</h4>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>
<script>
  import { useStore } from "vuex";
  export default {
    methods: {
      increment() {
        this.$store.dispatch("incrementAction"); // 分发 action
      },
    },
    setup() {
      const store = useStore();
      const decrement = () => {
        store.dispatch("decrementAction"); // 分发 action
      };
      return {
        decrement,
      };
    },
  };
</script>
```

> mutation 必须是同步函数，action 函数不受这种约束。因此可以在 action 函数中执行异步操作。

**2. actions 接收参数**

与 mutations 类，在 actions 中定义的 action 函数也可以接收两个参数，分别为 context 对象和 payload 对象。

其中，context 是一个与 store 实例具有相同方法和属性的对象。payload 用于接收分发 action 时传递过来的参数。

```html
<template>
	<div></div>
		<!-- ... -->
		<button @click="addTen">+10</button>
	</div>
</template>
<script>
export default {
	setup() {
		//...
		const addTen = () => {
			this.$store.dispatch("incrementNAction", {
				num: 10
			});
		};
		return {
			addTen
		}
	}
}
</script>
```

需要注意的是，`store.dispatch` 也支持对象的方式

```js
const addTen = () => {
  this.$store.dispatch({
    type: "incrementNAction",
    num: 10,
  });
};
```

```js
// src/store/index.js
import { INCREMENT_N } from "./mutation-types";
const Store = createStore({
  //...
  actions: {
    //...
    incrementNAction(context, payload) {
      // 在 actions 中执行 mutations 中的函数，
      // 直接修改 state 中的数据，只有通过 mutations 中函数才行
      context.commit(INCREMENT_N, payload);
    },
  },
});

export default Store;
```

**3. mapActions 辅助函数**

```html
<template>
  <div>
    <h4>当前计数: {{ $store.state.counter }}</h4>
    <button @click="incrementAction">+1</button>
    <button @click="decrement">-1</button>
    <button @click="addTen({ num: 20 })">+20</button>
  </div>
</template>
<script>
  import { mapActions } from "vuex";
  import { INCREMENT_N } from "../store/mutation-types";
  export default {
    methods: {
      ...mapActions(["incrementAction"]), // 数组形式
    },
    setup() {
      // 对象形式
      const actionsFuncs = mapActions({
        decrement: "decrementAction",
        addTen: "incrementNAction",
      });
      return {
        ...actionsFuncs,
      };
    },
  };
</script>
```

**4. action 返回 Promise 对象**

Action 通常用于处理异步操作。如果想在分发时知道 action 何时结束，可以让 action 函数返回一个 Promise 对象，并在 then 中监听 action 的结束

```js
// src/store/index.js
const store = createStore({
  state() {
    return {
      uuid: null,
    };
  },
  mutations: {
    addUUID(state, payload) {
      state.uuid = payload;
    },
  },
  actions: {
    getUUIDAction({ commit }) {
      return new Promise((resolve, reject) => {
        fetch("https://httpbin.org/uuid")
          .then((res) => res.json())
          .then((data) => {
            commit("addUUID", data.uuid);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
```

使用

```js
import { onMounted } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("getUUIDAction").then((res) => {
        console.log(res);
      });
    });
  },
};
```

### modules

Vuex 通过“单一状态树”来管理应用层级的全部状态。然而，当 store 中的状态数据变得越来越多时，会难以维护和管理。

为了解决这个问题，我们可以使用 modules 将状态数据模块化，将 store 分割成多个模块 (module)。每个模块都拥有自己的 state、mutation、action、getter，甚至嵌套子模块。这样就可以更好地组织和管理状态数据，使代码更加清晰和易于维护。

```js
// 模块 A
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

// 模块 B
const moduleB = {
  state: () => ({... }),
  mutations: {... },
  actions: {... }
}

const store = createStore({
	state: () => ({ ... }),
	mutations: {... },
	actions: {... },
	modules: {
		a: moduleA,
		b: moduleB
	}
})

// 访问模块 A 的状态
store.state.a
// 访问模块 B 的状态
store.state.b
```

**1. modules 的基本使用**

```sh
|--src
  |--store
		|--modules
			|--home.js
			|--user.js
```

```js
// src/store/modules/home.js
const homeModule = {
  state() {
    return {
      homeCounter: 100,
    };
  },
  getters: {},
  mutations: {},
  actions: {},
};
export default homeModule;
```

```js
// src/store/modules/user.js
const userModule = {
  state() {
    return {
      userCounter: 1000,
    };
  },
  getters: {},
  mutations: {},
  actions: {},
};
export default userModule;
```

引入根模块：

```js
// src/store/index.js
import { createStore } from "vuex";
import home from "./modules/home";
import user from "./modules/user";
const Store = createStore({
  state() {
    return {
      counter: 0,
    };
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    home: home,
    user,
  },
});
export default Store;
```

在组件中使用：

```html
<template>
  <div>
    <h4>Home: {{ $store.state.home.homeCounter }}</h4>
    <h4>User: {{ $store.state.user.userCounter }}</h4>
  </div>
</template>
```

**2. modules 的局部状态**

子模块会拥有自己的状态，包括 state、mutation、action、getter，以及嵌套的子模块。以下是子模块的一些特点：

- 模块定义的 state 属于子模块的状态，称为局部状态。

- 在子模块内部，mutation 和 getter 函数接收的第一个参数 state 也是局部状态

- 在子模块内部，对于 action 函数，局部状态可以通过 context.state 暴露出来，而根节点状态则通过 context.rootState 暴露出来

- 在子模块内部，getter 函数的根节点状态 (rootState) 会作为第三个参数暴露出来。

```js
// src/store/modules/user.js
const userModule = {
  state() {
    return {
      userCounter: 1000,
    };
  },
  // user 模块的 mutation 和 getter 函数接收的第一个参数是局部状态 state
  getters: {
    doubleUserCount(state) {
      return state.userCounter * 2;
    },
    // 根节点状态 (rootState) 会作为第三个参数暴露出来
    userCountAddRootCount(state, getters, rootState) {
      return state.userCounter + rootState.counter;
    },
  },
  mutations: {
    increment(state) {
      state.userCounter++;
    },
  },
  actions: {
    incrementAction({ commit, state, rootState }) {
      commit("increment");
    },
  },
};
export default userModule;
```

组件中应用：

```html
<template>
  <div>
    <h4>root state 根模块的状态: {{ $store.state.counter }}</h4>
    <h4>
      root state 根模块 currentDiscount: {{ $store.getters.currentDiscount }}
    </h4>
    <h4>User 子模块: {{ $store.state.user.userCounter }}</h4>
    <h4>User: {{ $store.getters["doubleUserCount"] }}</h4>
    <h4>User: {{ $store.getters.userCountAddRootCount }}</h4>
    <button @click="incrementAction">+1</button>
  </div></template
>
<script>
  import { useStore } from "vuex";
  export default {
    setup() {
      const store = useStore();
      const incrementAction = () => {
        // store.dispatch("user/incrementAction");
        // 会触发 root 模块的 incrementAction 函数和 user 子模块的 incrementAction 函数
        store.dispatch("incrementAction");
      };
      return {
        incrementAction,
      };
    },
  };
</script>
```

> 过 `$store.getters` 可以获取所有模块的 getters 对象

**3. modules 命名空间**

上述案例存在一个问题，多个模块可以对同一个 action 作出响应。例如，当单击“+1”按钮，分发 type 为 incrementAction 的 action 时，会触发根模块和 user 子模块的 incrementAction 函数回调。这是因为在默认情况下，子模块内部的 action、getter 和 mutation 仍然注册在全局的命名空间中，使得多个模块可以对同一个 action 或 mutation 作出响应。

为了解决这个问题，我们希望子模块具有更高的封装度和复用性，因此可以添加 `namespaced: true` 使其成为带有命名空间的模块。这样当子模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

```js
// src/store/modules/home.js
const homeModule = {
  namespaced: true,
  state() {
    return {
      homeCounter: 20,
    };
  },
  getters: {
    doubleHomeCount(state) {
      return state.homeCounter * 2;
    },
    homeCountAddRootCount(state, getters, rootState) {
      return state.homeCounter + rootState.counter;
    },
  },
  mutations: {
    increment(state) {
      state.homeCounter++;
    },
  },
  actions: {
    incrementAction({ commit, state, rootState }) {
      commit("increment");
    },
  },
};
export default homeModule;
```

```html
<template>
  <div>
    <h4>Home: {{ $store.state.home.homeCounter }}</h4>
    <h4>Home: {{ $store.getters["home/doubleHomeCount"] }}</h4>
    <h4>Home: {{ $store.getters["home/homeCountAddRootCount"] }}</h4>
    <button @click="incrementAction">+1</button>
  </div>
</template>
<script>
  import { useStore } from "vuex";
  export default {
    setup() {
      const store = useStore();
      const incrementAction = () => {
        store.dispatch("home/incrementAction");
      };
      return {
        incrementAction,
      };
    },
  };
</script>
```

**4. 带命名空间的子模块访问根模块**

如果希望在子模块中使用根 state 和 getter，那么可以将 rootState 和 rootGetters 作为 getter 函数的第三个和第四个参数传入，也可以通过 context 对象的属性进行访问。

在子模块中，如果想要分发全局命名空间内的 action 或提交 mutation，只需将 `{ root: true }` 作为第三个参数传递给 dispatch 或 commit

```js
// src/store/modules/home.js
const homeModule = {
  namespaced: true,
  state() {
    return {
      homeCounter: 20,
    };
  },
  getters: {
    doubleHomeCount(state) {
      return state.homeCounter * 2;
    },
    homeCountAddRootCount(state, getters, rootState, rootGetters) {
      return state.homeCounter + rootState.counter;
    },
  },
  mutations: {
    increment(state) {
      state.homeCounter++;
    },
  },
  actions: {
    incrementAction({
      commit,
      state,
      rootState,
      dispatch,
      rootGetters,
      rootState,
    }) {
      commit("increment"); // 提交到当前模块的 mutation
      commit("increment", null, { root: true }); // 提交到根模块的 mutation

      dispatch("incrementAction"); // 分发到当前模块的 action
      dispatch("incrementAction", null, { root: true }); // 分发到根模块的 action
    },
  },
};
export default homeModule;
```

**5. modules 辅助函数**

方式一：映射时指定模块名前缀

```html
<template>
  <div>
    <h4>Home: {{ homeCounter }}</h4>
    <h4>Home: {{ doubleHomeCount }}</h4>
    <button @click="homeIncrementCommit">+1</button>
    <button @click="incrementAction">+1</button>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
  export default {
    computed: {
      ...mapState({
        homeCounter: (state) => state.home.homeCounter,
      }),
      ...mapGetters({
        doubleHomeCount: "home/doubleHomeCount",
      }),
    },
    methods: {
      ...mapMutations({
        homeIncrementCommit: "home/increment",
      }),
      ...mapActions({
        incrementAction: "home/incrementAction",
      }),
    },
  };
</script>
```

方式二：辅助函数第一个参数作为模块名前缀

```html
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
  export default {
    computed: {
      ...mapState("home", ["homeCounter"]),
      ...mapGetters("home", ["doubleHomeCount"]),
    },
    methods: {
      ...mapMutations("home", {
        homeIncrementCommit: "increment",
      }),
      ...mapActions("home", ["incrementAction"]),
    },
  };
</script>
```

方式三：借助辅助函数统一添加模块名前缀（推荐）

```html
<script>
  import { createNamespacedHelpers } from "vuex";
  const { mapState, mapGetters, mapMutations, mapActions } =
    createNamespacedHelpers("home");
  export default {
    computed: {
      ...mapState(["homeCounter"]),
      ...mapGetters(["doubleHomeCount"]),
    },
    methods: {
      ...mapMutations({
        homeIncrementCommit: "increment",
      }),
      ...mapActions(["incrementAction"]),
    },
  };
</script>
```

方式四：在 setup 中统一添加模块名前缀（推荐）

```html
<script>
  import { createNamespacedHelpers } from "vuex";
  import { computed } from "vue";
  import { useMapper } from "../hooks/index";
  const { mapState, mapGetters, mapMutations, mapActions } =
    createNamespacedHelpers("home");
  export default {
    setup() {
      const stateFunc = useMapper(mapState, ["homeCounter"]);
      const gettersFunc = useMapper(mapGetters, ["doubleHomeCount"]);
      const mutationsFunc = mapMutations({
        homeIncrementCommit: "increment",
      });
      const actionsFunc = mapActions(["incrementAction"]);
      return {
        ...stateFunc,
        ...gettersFunc,
        ...mutationsFunc,
        ...actionsFunc,
      };
    },
  };
</script>
```

```js
// src/hooks/useMapper.js
import { computed } from "vue";
import { useStore } from "vuex";
export function useMapper(mapFn, mapper) {
  const store = useStore();
  const storeStateFns = mapFn(mapper);
  const storeState = {};
  Object.keys(storeStateFns).forEach((fnKey) => {
    const fn = storeStateFns[fnKey];
    storeState[fnKey] = computed(fn.bind({ $store: store }));
  });
  return storeState;
}
```
