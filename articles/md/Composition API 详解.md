---
title: "Composition API 详解"
tag: "Vue"
time: 2025-01-17 21:41:48
---

随着项目规模的扩大，组件数量也会逐渐增多，这时需要考虑复用组件逻辑。

在 Vue3 中，有两种主要的组件逻辑复用方式：Mixin 和 Composition API。

## Options API 代码的复用

### Mixin 混入

组件与组件之间有时会存在相同的代码逻辑，这时我们希望对相同的代码逻辑进行抽取。与 Vue2 一样，Vue3 也支持使用 Mixin 完成代码的复用。

Mixin 具有如下特点：

(1) Mixin 提供了一种非常灵活的方式来分发 Vue3 组件中可复用的功能

(2) 一个 Mixin 对象可以包含任何组件的选项（Options API）

(3) 当组件使用 Mixin 对象时，所有 Mixin 对象的选项都将被混入该组件本身的选项中

**1. Mixin 的基本使用**

```js
// demoMixin.js
// 定义一个 Mixin 混合对象，将组件公用的代码逻辑抽取到 demoMixin 中
export const demoMixin = {
  data() {
    return {
      message: "Hello DemoMixin",
    };
  },
  methods: {
    foo() {
      console.log("demo mixin foo");
    },
  },
  created() {
    console.log("执行了 demo mixin created");
  },
};
```

- App.vue 组件，代码如下：

```html
<template>
  <div>
    <h2>{{ message }}</h2>
    <button @click="foo">单击调用 demoMixin 定义的 foo 方法</button>
  </div>
</template>
<script>
  import { demoMixin } from "./mixins/demoMixin.js";
  export default {
    // 将 demoMixin 定义的 data、methods、created 选项混入该组件中，也支持混入其他组件
    mixins: [demoMixin],
  };
</script>
```

**2. Mixin 的合并规则**

如果 Mixin 对象中的选项和组件对象中的选项发生了冲突，那么 Vue3 会分成三种情况来处理。

(1) 处理 data 函数返回值对象。

默认情况下，Mixin 对象中 data 选项的返回值和组件对象中 data 选项的返回值会进行合并。

如果它们的 data 选项返回值对象的属性发生了冲突，那么会保留组件对象自身的数据，

(2) 处理生命周期钩子函数。

Mixin 对象和组件对象中的生命周期钩子函数会被合并到数组中，都会调用。

(3) 处理值为对象的选项。

如 methods、components、directives 选项，将被合并为同一个对象。

例如，Mixin 对象和组件对象中都有 methods 选项，并且都定义了方法，那么它们都会生效。但是如果对象的 key 相同，那么会取组件对象的键值对。

下面演示一下 Mixin 的合并规则：

```html
<template>
  <div>
    <h2>{{ message }}</h2>
    <button @click="foo">单击调用 demoMixin 定义的 foo 方法</button>
  </div>
</template>
<script>
  import { demoMixin } from "./mixins/demoMixin.js";
  export default {
    mixins: [demoMixin],
    data() {
      return {
        // 1. message 变量和 demoMixin 对象中定义的 message 冲突，那么会使用该组件的 message
        message: "Hello App",
        title: "Hello World",
      };
    },
    methods: {
      // 2. foo 方法和 demoMixin 对象中定义的 foo 方法冲突，那么会使用该组件的 foo 方法
      foo() {
        console.log("app foo");
      },
      bar() {
        console.log("bar function");
      },
    },
    computed: {},
    watch: {},
    // 3. 生命周期的钩子函数和 demoMixin 对象中的重复，那么它们会被合并到数组中，都会被调用
    created() {
      console.log("App created 执行");
    },
  };
</script>
```

**3. 全局混入 Mixin**

如果所有组件都需要某些选项，那么可以使用全局 Mixin，全局 Mixin 可以使用 `app.mixin` 方法进行注册。

一旦注册，全局混入的选项将被混入每个组件中。

- 修改 main.js

```js
import { createApp } from "vue";
import App from "./01_Mixin/App.vue";

let app = createApp(App);

// 注册全局混入
app.mixin({
  created() {
    console.log("global mixin created");
  },
});

app.mount("#app");
```

尽管 Mixin 可以对组件代码逻辑进行抽取和复用，但他存在如下缺陷：

(1) Mixin 容易发生冲突。

(2) Mixin 的可复用性是有限的。

### extends 继承

除了 Mixin，Vue 3 还提供了另一种代码逻辑复用的方式，即使用 extends 属性，

使用 extends 属性可以扩展另一个组件，类似于 Mixin，但使用较少，了解即可。

```html
<!-- BasePage.vue -->
<!-- extends 属性只能复用 script 标签中的逻辑，不能复用 template 和 style -->
<script>
  export default {
    data() {
      return {
        title: "Hello BasePage",
      };
    },
    methods: {
      bar() {
        console.log("base page bar");
      },
    },
  };
</script>
```

上面代码用于复用 data 和 methods 选项中公共的代码逻辑。

```html
<!-- Home.vue -->
<template>
  <div class="home" style="border: 1px solid #ddd; margin: 10px">
    <h4>{{ title }}</h4>
    <button @click="bar">单击调用 BasePage 组件定义的 bar 方法</button>
  </div>
</template>
<script>
  import BasePage from "./BasePage.vue";
  export default {
    exends: BasePage,
  };
</script>
```

## 认识 Composition API

在 Vue2 中，我们使用 Options API 的方式编写组件，Options API 最大的特点就是在对应的属性中编写对应的功能模块，比如在 data 中定义数据，在 methods 中定义方法，在 computed 中定义计算属性，在 watch 中监听属性改变，以及在组件中定义生命周期函数等。但是，使用 Options API 这种方式编写代码会带来一些弊端。

(1) 代码逻辑会被拆分，在实现某个功能时，对应的代码逻辑会被拆分到各个属性中。

(2) 当组件变得更大、更复杂时，逻辑关注点的列表就会变长，同一个功能的逻辑会被拆分得非常分撒。

(3) 对维护这些复杂组件的开发者来说，过于分散的逻辑代码难以阅读和理解。

> 在代码的可读性和可维护性上，Composition API 优于 Options API

**如果想要使用 Composition API 这种方式来编写代码，需要在 setup 函数中编写或使用 `<script setup>` 语法糖**

## setup 函数的基本使用

### setup 函数的参数

setup 函数的参数有两个，分别是 props 和 context。

**props 作为第一个参数，父组件传递过来的属性会被放到 props 对象中。因此，我们可以直接通过该参数获取父组件传递过来的属性。**

```html
<template>
  <div class="setup-props">
    <h4>{{ message }}</h4>
  </div>
</template>
<script>
  export default {
    props: {
      message: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      console.log(props);
      console.log(props.message);
    },
  };
</script>
```

[231]
