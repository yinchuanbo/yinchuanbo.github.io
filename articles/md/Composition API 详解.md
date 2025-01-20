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

> 需要注意的是，setup 函数可以直接通过参数来接收 props 对象，不可以通过 this 获取，因为 setup 函数没有绑定 this

**setup 函数第二个参数是 context，该参数对象包含以下三个属性：**

- attrs: 所有非 prop 的属性

- slots: 父组件传递过来的插槽

- emit: 组件内部发送事件时用到的 emit 函数 (setup 中不能访问 this，因此不可使用 this.$emit)

```html
<!-- SetupContext.vue -->
<template>
  <div class="setup-context" style="border: 1px solid #ddd; margin: 10px">
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
    setup(props, context) {
      console.log(props); // 1. 所有的 props 属性
      console.log(props.message); // 2. 父组件传递过来的 message
      console.log(context.attrs.id, context.attrs.class); // 3. 所有非 prop 的属性
      console.log(context.slots); // 4. 父组件传递过来的插槽
      console.log(context.emit); // 5. 用于触发事件，如 context.emit("name", value)
    },
  };
</script>
```

```html
<!-- App.vue -->
<template>
  <div class="app" style="border: 1px solid #ddd; margin: 4px">
    <SetupContext
      message="Hello SetupContext"
      id="setup-context"
      class="setup-context"
    >
      <p>Hello World</p>
    </SetupContext>
  </div></template
>
<script>
  import SetupContext from "./components/SetupContext.vue";
  export default {
    name: "App",
    components: {
      SetupContext,
    },
  };
</script>
```

### setup 函数的返回值

在 Vue3 中，setup 函数不仅可以接收 props 和 context 参数，还可以像普通函数一样有返回值。

具体而言，setup 函数可以返回一个对象类型的值，该值可以直接在模板（template）中使用。这意味着，**我们可以使用 setup 函数的返回值代替 data 选项的返回值**。

```html
<!-- SetupReturn.vue -->
<template>
  <div class="setup-return" style="border: 1px solid #ddd; margin: 10px">
    <h4>当前计数：{{ counter }}</h4>
    <button @click="increment">+1</button>
  </div>
</template>
<script>
  export default {
    setup(props, context) {
      let counter = 100;
      const increment = () => {
        counter++;
      };
      return {
        // 提供给 template 使用
        counter: counter,
        increment: increment,
      };
    },
  };
</script>
```

> 可以看到，counter 的值显示出来了，当单击 “+1” 按钮时，会调用 increment 函数来修改 counter 的值，但是页面的数组并没有响应式更新，因为 counter 是一个普通的变量。

### setup 函数的 this

在 setup 函数中，this 并**没有**指向当前组件实例。此外，在调用 setup 函数之前，**data、computed、methods** 等都**没有**被解析，Vue3 框架也没有为 setup 函数绑定 this，因此**无法**在 setup 中获取 this。

## 数据响应式 API

若要使用 Options API 编写代码，可以在 data 选项中定义响应式数据，如果在 setup 函数中也需要定义响应式数据，那么可以使用 Vue3 提供的响应式 API: `reactive`、`ref`。

### reactive

该函数可以将数据转换为响应式数据，并且响应式`深层`的 - 它影响所有的嵌套属性。

其底层原理基于 ES2015 的 Proxy 实现，所以 reactive 函数的返回值是一个对象的响应式代理。

```html
<!-- reactiveAPI.vue -->
<template>
  <div class="setup-return" style="border: 1px solid #ddd; margin: 10px">
    <h4>当前计数：{{ state.counter }}</h4>
    <button @click="increment">+1</button>
  </div>
</template>
<script>
  export default {
    setup(props, context) {
      let state = reactive({
        counter: 100,
      });
      const increment = () => {
        state.counter++;
      };
      return {
        state,
        increment,
      };
    },
  };
</script>
```

事实上，data 选项返回的对象在 Vue3 内部也交给了 reactive 函数，将其变成响应式对象。

### ref

reactive 函数对传入的数据的类型是有限制的，必须是一个对象或数据组类型，如果传入一个基本类型（String、Number、Boolean），那么会报错。那么，为了适配这种情况，Vue3 提供了 ref 函数，可以将基本类型的数据转换为响应式数据。

(1) ref 函数接收一个值，返回一个响应式、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`。

(2) ref 对象的内部值是通过该对象的 `.value` 属性维护的，比如可以通过 `.value` 为该 ref 对象赋新值。

```html
<!-- RefAPI.vue -->
<template>
  <div class="ref-api" style="border: 1px solid #ddd; margin: 10px">
    <h4>当前计数：{{ counter }}</h4>
    <button @click="increment">+1</button>
  </div>
</template>
<script>
  import { ref } from "vue";
  export default {
    setup(props, context) {
      let counter = ref(100);
      const increment = () => {
        counter.value++;
      };
      return {
        counter,
        increment,
      };
    },
  };
</script>
```

> 注意：在模板中使用 ref 对象时，Vue3 会自动进行解包操作，不需要通过 `.value` 的方式访问内部值。但是，在 setup 函数内部不会自动解包，因此仍需要使用 `.value` 的方式访问内部值。

**另外，需要注意的是:**

〇 如果普通对象包含 ref 对象，那么在模板中引用普通对象中的 ref 对象时，会自动解包。

〇 如果 reactive 响应式对象包含 ref 对象，那么在模板中引用 reactive 响应式对象中 ref 对象时，也会自动解包。

```html
<!-- RefAPIOther.vue -->
<template>
  <div class="ref-api-other" style="border: 1px solid #ddd; margin: 10px">
    <h4>当前计数：{{ counter }}</h4>
    <h2>当前计算：{{ info.counter }}</h2>
    <h2>当前计算：{{ reactiveInfo.agcountere }}</h2>
    <button @click="increment">+1</button>
  </div></template
>
<script>
  import { ref, reactive } from "vue";
  export default {
    setup(props, context) {
      let counter = ref(100);
      let info = {
        counter,
      };
      let reactiveInfo = reactive({
        counter,
      });
      const increment = () => {
        counter.value++;
      };
      return {
        counter,
        info,
        reactiveInfo,
        increment,
      };
    },
  };
</script>
```

## 响应式工具 reactive

### readonly

通过 reactive 或 ref 函数可以获取一个响应式对象。这些响应式对象都是可以被更改的，但是在某些情况下，我们希望响应式对象只读且不能更改。比如，当我们在向其他组件传递数据时，希望其他子组件在使用该内容时不允许修改。

这时可以使用 Vue3 提供的 readonly 函数。该函数会返回原生对象的只读代理对象，该对象的 setter 方法被劫持了，不允许对其进行修改。readonly 函数通常可接收以下三种类型的参数。

(1) 普通对象

(2) reactive 函数返回的响应式对象

(3) ref 函数返回的响应式对象

**readonly 函数在使用时，有如下规则:**

- readonly 返回的对象都是不允许被修改的。但是，经过 readonly 处理的原来的对象是允许被修改的。比如，在 `const info = readonly(obj)` 中，info 对象是不允许被修改的，obj 是可以被修改的。当 obj 被修改时，readonly 返回的 info 对象也会被修改。但是，我们不能修改 readonly 返回的 info 对象，否则会报错。

- readonly 函数的本质是该函数返回代理对象的 setter 方法被劫持了，不允许对其进行修改。

```html
<!-- ReadonlyAPI.vue -->
<template>
  <div>
    <button @click="updateState">修改状态</button>
  </div>
</template>
<script>
  import { ref, reactive, readonly } from "vue";
  export default {
    setup(props, context) {
      const info1 = { name: "why" };
      const readonlyInfo1 = readonly(info1);

      const info2 = reactive({
        name: "why",
      });
      const readonlyInfo2 = readonly(info2);

      const info3 = ref("why");
      const readonlyInfo3 = readonly(info3);

      const updateState = () => {
        readonlyInfo1.name = "coderwhy"; // 只读，控制台报错
        // info1.name = "coderwhy"; // 允许修改

        readonlyInfo2.name = "coderwhy"; // 只读，控制台报错
        // info2.name = "coderwhy"; // 允许修改

        readonlyInfo3.value = "coderwhy"; // 只读，控制台报错
        // info3.value = "coderwhy"; // 允许修改
      };
    },
  };
</script>
```

### isProxy

isProxy 函数可以检査对象是否为由 Vue3 中的 reactive 或 readonly 创建的 Proxy 对象。

需要注意的是，ref 创建的是 RefImpl 对象，因此 isProxy 函数不能用于检查对象是否为 ref 对象。

### isReactive

isReactive 函数可以检查对象是否为由 reactive 创建的响应式代理对象

```js
import { reactive, isReactive, isProxy } from "vue";
export default {
  setup(props, context) {
    const info = reactive({
      name: "why",
    });
    console.log(isReactive(info)); // true
    console.log(isProxy(info)); // true
  },
};
```

如果代理对象是由 readonly 函数创建的，并且参数为 reactive 创建的响应式对象，那么也会返回 true，

```js
import { reactive, isReactive, readonly } from "vue";
export default {
  setup(props, context) {
    const state = reactive({
      name: "why",
    });
    const plain = readonly({
      name: "Mary",
    });

    console.log(isReactive(plain)); // false

    const stateCopy = readonly(state);
    console.log(isReactive(stateCopy)); // true
  },
};
```

### isReadonly

isReadonly 函数可以用于检查一个对象是否为由 readonly 创建的只读代理对象。

### toRaw

toRaw 函数可以返回 reactive 或 readonly 代理对象的原始对象。

```js
const info = { name: "why" };
const reactiveInfo = reactive(info);
console.log(toRaw(reactiveInfo) === info); // true

const readonlyInfo = readonly(info);
console.log(toRaw(readonlyInfo) === info); // true
```

### shallowReactive

shallowReactive 函数可以创建一个浅层响应式代理对象，该对象只有根级别的属性是响应式的，

由于没有进行深层级的转换，该对象深层嵌套的属性仍然是普通对象。

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2,
  },
});
state.foo++;
isReactive(state.nested); // false
state.nested.bar++; // 非响应式
```

### shallowReadonly

shallowReadonly 函数可以创建一个浅层只读代理对象，该对象只有根级别的属性变为只读。因为没有进行深层级的转换，该对象深层嵌套的属性依然是可读可写的，

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2,
  },
});
state.foo++;
isReadonly(state.nested); // false
state.nested.bar++; // 深层嵌套的属性依然是可读可写
```

### 响应式工具 ref

### toRefs

toRefs 函数用于将一个 reactive 定义的响应式对象转换为一个普通对象。转换后的普通对象的每个属性都是指向源对象相应属性的 ref 对象。

每个单独的 ref 对象都是使用 toRefs 函创建的

```html
<!-- ToRefsAPI.vue -->
<template>
  <div>
    <h4>{{name}} - {{ age }}</h4>
    <button @click="changeAge">修改 age++</button>
  </div>
</template>
<script>
  import { reactive } from "vue";
  export default {
    setup() {
      const info = reactive({
        name: "why",
        age: 18,
      });
      // 1. ES6 语法直接解构 info 对象，会失去响应式
      let { name. age } = info;
      const changeAge = () => {
        info.age++;
      };
      return {
        name,
        age,
        changeAge
      }
    },
  };
</script>
```

> 需要注意的是，无论是修改解构后的 name 和 age 变量，还是修改 reactive 返回的 info 对象，数据都不再是响应式的。

如果想让解构出来的属性依然是响应式的，可以使用 Vue3 提供的 toRefs 函数。该函数会将 reactive 函数返回对象中的属性都转换成 ref 对象。这时解构出来的 name 和 age 就是 ref 响应式对象了。

```html
<script>
  import { reactive, toRefs } from "vue";
  export default {
    setup() {
      const info = reactive({
        name: "why",
        age: 18,
      });
      // let { name. age } = info;
      // 1. 保持响应式特性
      let { name, age } = toRefs(info);
      const changeAge = () => {
        info.age++;
      };
      return {
        name,
        age,
        changeAge,
      };
    },
  };
</script>
```

### toRef

在上面的案例中，如果只想将 reactive 函数返回对象中的某个属性转换为 ref 对象，我们可以使用 toRef 的数。

```html
<!-- ToRefsAPI.vue -->
<script>
  import { reactive, toRef } from "vue";
  export default {
    setup() {
      const info = reactive({
        name: "why",
        age: 18,
      });

      // 单个属性，局部转化
      let name = toRef(info, "name");
      let age = toRef(info, "age");

      const changeAge = () => {
        info.age++;
      };

      return {
        name,
        age,
        changeAge,
      };
    },
  };
</script>
```

### isRef

isRef 函数可以判断某个值是否为一个 ref 对象。

### unref

unref 函数的参数如果是 ref，则返回内部值 value，否则返回参数本身。该函数是 `val = isRef(val) ? val.value : val` 计算的一个语法糖。

```js
import { ref, unref } from "vue";
const name = ref("why");
const unwrappedName = unref(name);
console.log(unwrappedName); // "why"，不是响应式对象
```

### customRef

customRef 函数可以创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行控制。该函数接收一个工厂函数作为参数，该工厂函数接收 track 和 trigger 两个函数作为参数，并返回一个带有 get 和 set 方法的对象。

```js
// useDebouncedRef.js
import { customRef } from "vue";
export default function (value, delay = 300) {
  let timer = null;
  // 自定义 ref
  return customRef((track, trigger) => {
    // 工厂函数接收 track 和 trigger 两个函数作为参数
    return {
      get() {
        track(); // 获取时收集依赖
        return value;
      },
      set(newValue) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = newValue; // 更新值
          trigger(); // 赋值时，触发更新
        }, delay);
      },
    };
  });
}
```

```html
<!-- CustomRefAPI.vue -->
<template>
  <div>
    <input v-model="message" />
    <h4>{{ message }}</h4>
  </div>
</template>
<script>
  import useDebouncedRef from "./utils/useDebouncedRef";
  export default {
    setup() {
      let message = useDebouncedRef("hello world"); // 带有防抖功能的响应式对象
      return {
        message,
      };
    },
  };
```

> 效果：当在 input 输入框中依次输入值时，并不会触发页面的刷新，只有当输入间隔超过 300ms 时，页面才会刷新。

### shallowRef

shallowRef 函数可以创建一个浅层的 ref 对象。

```js
const info = shallowRef({ name: "why" });
// 当修改 info.value 时，不会触发页面的更新
info.value.name = "coderwhy";
```

### triggerRef

triggerRef 函数可以手动强制触发依赖于一个浅层 ref 的副作用，它通常在对浅引用内部值进行深度变更后使用。

```js
const info = shallowRef({ name: "why" });
const changeInfo = () => {
  info.value.name = "coderwhy";
  // 手动触发依赖
  triggerRef(info);
};
```

## computed 计算属性

当某些属性依赖于其他状态时，可以使用计算属性来处理，举例如下：

- 在 Options API 中，可以使用 computed 选项编写计算属性。

- 在 Composition API 中，可以在 setup 函数中使用 computed 函数编写计算属性。

**下面我们来看看 computed 函数的两种使用方式：**

1. computed 函数的基本使用: computed 数接收一个 getter 函数，并根据 getter 函数的返回值返回一个不可变的响应式 ref 对象。

2. computed 函数的 get 和 set 方法: computed 函数接收一个具有 get 和 set 方法的对象并返回一个可变(可读写)的 ref 对象。

### computed 函数的基本使用

```html
<!-- ComputedAPI.vue -->
<template>
  <div>
    <h4>{{ fullName }}</h4>
    <button @click="changeName">修改 firstName</button>`
  </div>
</template>
<script>
  import { ref, computed } from "vue";
  export default {
    setup(props, context) {
      const firstName = ref("Kobe");
      const lastName = ref("Bryant");
      const fullName = computed(() => {
        return firstName.value + " " + lastName.value;
      });
      const changeName = () => {
        firstName.value = "James";
      };
      return {
        fullName,
        changeName,
      };
    },
  };
</script>
```

### computed 函数的 get 和 set 方法

```html
<script>
  import { ref, computed } from "vue";
  export default {
    setup(props, context) {
      const firstName = ref("Kobe");
      const lastName = ref("Bryant");
      // 方式 1
      // const fullName = computed(() => {
      //   return firstName.value + " " + lastName.value;
      // });

      // 方式 2
      const fullName = computed({
        get() {
          return firstName.value + " " + lastName.value;
        },
        set(value) {
          const names = value.split(" ");
          firstName.value = names[0];
          lastName.value = names[1];
        },
      });
      const changeName = () => {
        // firstName.value = "James";
        // 修改计算属性
        fullName.value = "James Lee";
      };
      return {
        fullName,
        changeName,
      };
    },
  };
</script>
```

## watchEffect 监听

在 Vue3 中，我们可以使用 OptionsAPI 监听 data、props 或 computed 数据的变化，比如当数据变化时执行某些操作。而在 CompositionAPI 中，我们可以使用 watchEffect 和 watch 函数完成响应式数据的监听。其中，watchEffect 函数用于自动收集响应式数据的依赖，而 watch 函数需要手动指定监听的数据源。

### watchEffect 的基本使用

如果我们需要在某些响应式数据变化时执行某些操作，就可以使用 watchEffect 函数。

该函数具有以下特点：

- watchEffect 函数的参数需要接收一个函数。该函数会被立即执行一次，并且在执行的过程中会收集依赖。

- 当收集的依赖发生变化时，watchEffect 函数的参数传入的函数（即副作用函数）才会再次执行

- watchEffect 函数的参数传入的函数不会接收到新值和旧值。

```html
<!-- WatchEffectAPI.vue -->
<template>
  <div>
    <h4>{{ age }}</h4>
    <button @click="changeAge">修改 age</button>
  </div>
</template>
<script>
  import { ref, watchEffect } from "vue";
  export default {
    setup(props, context) {
      const age = ref(18);
      // watchEffect 会自动收集响应式依赖，默认先执行一次
      watchEffect(() => {
        // 监听 age 的变化，age 变化后再次执行该回调函数
        console.log("age 的值是：", age.value);
      });
      const changeAge = () => {
        age.value++;
      };
      return {
        age,
        changeAge,
      };
    },
  };
</script>
```

### 停止 watchEffect 监听

在某些情况下，我们希望停止监听某个变量的变化。这时可以使用 watchEtect 函数，并接收其返回值的函数，调用该函数即可停止监听。比如在上面的案例中，当 age 达到 20 时，我们希望停止监听其变化。

```html
<script>
  import { ref, watchEffect } from "vue";
  export default {
    setup(props, context) {
      const age = ref(18);
      // 1. stop 是 watchEffect 函数返回的函数，专门用于停止监听
      const stop = watchEffect(() => {
        console.log("age 的值是：", age.value);
      });
      const changeAge = () => {
        age.value++;
        if (age.value >= 20) {
          stop(); // 停止监听 age 的变化
        }
      };
      return {
        age,
        changeAge,
      };
    },
  };
</script>
```

### watchEffect 清除副作用

在 Vue3 watchEffect 函数的参数传入的回调函数可以接收一个 onInvalidate 函数类型的参数。onInvalidate 函数的参数也需要接收一个回调函数。当副作用函数再次执行或监听器被停止时，会执行 onInvalidate 函数传入的回调函数。因此，我们可以在 onlnvalidate 函数传入
的回调函数中执行一些清除副作用的工作。

举个例子，在实际开发中，我们需要在监听函数中执行网络请求。但是在网络请求还没有完成时，我们就停止了监听器或监听器对应的监听函数被再次执行了。这时，上一次的网络请求应该被取消，即清除该副作用。因此，我们可以借助 onInvalidate 函数清除该副作用。

```html
<!-- WatchEffectAPIClear.vue -->
<script>
  import { ref, watchEffect } from "vue";
  export default {
    setup() {
      const age = ref(18);
      watchEffect((onInvalidate) => {
        const timer = setTimeout(() => {
          console.log("模拟网络请求，网路请求成功");
        }, 2000);
        onInvalidate(() => {
          // 监听到 age 变化或监听停止时，会执行这里的代码
          // 这里清除副作用
          clearTimeout(timer);
          console.log("清除副作用");
        });
      });
      const changeAge = () => {
        age.value++;
      };
      return {
        age,
        changeAge,
      };
    },
  };
</script>
```

### watchEffect 的执行时机

先讲一下如何使用 CompositionAPI 获取元素或组件的对象。这个过程非常简单，只需要定义一个前文提到的 ref 对象，然后将该对象绑定到元素或组件的 ref 属性上。

```html
<template>
  <div>
    <h4 ref="titleRef">哈哈哈</h4>
  </div>
</template>
<script>
  import { ref, watchEffect } from "vue";
  export default {
    setup() {
      // 1. 定义一个 titleRef 对象，用于存储 h4 元素的 DOM 对象
      const titleRef = ref(null);
      // 2. 监听titleRef的变化，即赋值操作
      watchEffect(() => {
        // 3. 打印 h4 元素的 DOM 对象
        console.log(titleRef.value);
      });
      return {
        titleRef,
      };
    },
  };
</script>
```

在浏览器中刷新页面，控制台会打印两次。这是因为 setup 函数在执行时就会立即执行 watchEffect 传入的副作用函数，即 watchEffect 的回调函数。此时 DOM 并没有挂载，因此打印 null。而当 DOM 挂载时，会为 titleRef 变量赋新的内部值，副作用函数会再次被执行，打印出`<h4>` 元素；使用 ref 获取元素的对象，

这时，如果希望在第一次执行时就打印出对应的元素，那么可以向 watchEffect 函数传递第二个参数，改变副作用函数的执行时机。

例如，向 watchEffect 函数的第二个参数传递一个对象 `{ flush: "pre" }`，flush 属性的默认值是 pre，意思是 watchEffect 函数会在元素挂载或更新之前执行，这就解释了前面的例子中，为什么会先打印出一个空元素 null，当依赖的 titleRef 发生改变时，会再次执行一次 watchEffect 函数，打印出对应的元素。

```html
<script>
  import { ref, watchEffect } from "vue";
  export default {
    setup() {
      const titleRef = ref(null);
      watchEffect(
        () => {
          console.log(titleRef.value);
        },
        {
          flush: "post", // 修改副作用函数的执行时机，支持pre、post、sync 值
        }
      );
      return {
        titleRef,
      };
    },
  };
</script>
```

可以看到，watchEffect 函数第二个参数需要接收一个对象，该对象的 flush 属性用于修改副作用函数的执行时机。设置 `flush: "post"` 的意思是，副作用函数会延迟到组件渲染之后再执行。

> 注意：当设置 flush: "sync" 时，意思是依赖变化时同步执行副作用函数，这种执行是低效的，谨慎使用。

> 提示:在 Vue3.2 以后的版本中，watchPostEffect 是 watchEfect 带有 `flush:"post"` 选项的别名，watchSyncEffect 是 watchEffect 带有 `flush"sync"` 选项的别名

### watch 监听

【254】