---
title: "v-model和表单输入"
tag: "Vue"
time: 2025-01-12 10:34:31
---

## v-model 的基本使用

获取用户提交的表单数据，通常要用到双向绑定。

1. v-model 指令可以在表单 `<input>`、`<textarea>`、`<select>` 元素上创建数据的双向绑定

2. v-model 会根据控件类型自动选取正确的方法来更新元素

3. v-model 是一种语法糖，它底层实现的原理是：

   - 使用 v-bind 为 value 属性绑定变量
   - 使用 v-on 绑定 input 事件，并在事件回调中重新为 value 属性绑定的变量赋值

```html
<div id="app"></div>
<template id="my-app">
  <input type="text" v-model="message" />
  <h2>{{ message }}</h2>
</template>
<script>
  const App = {
    template: "#my-app",
    data() {
      return {
        message: "Hello World",
      };
    },
  };
  Vue.createApp(App).mount("#app");
</script>
```

## v-model 的实现原理

vue3 官方给出的 v-model 指令的底层实现原理：

```html
<input v-model="searchText" />
```

等价于：

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

## v-model 绑定其他表单

v-model 指令不仅适用于 input 表单元素的双向绑定，还可以用于其他表单类型的元素。例如：textarea、checkbox、radio、select 等。

```html
<div id="app"></div>
<template id="my-app">
  <textarea v-model="intro"></textarea>
  <p>{{ intro }}</p>

  <label for="agree">
    <input id="agree" type="checkbox" v-model="isAgree" />
    同意协议
  </label>

  <!-- checkbox 多选框 -->
  <label for="basketball">
    <input
      id="basketball"
      type="checkbox"
      v-model="hobbies"
      value="basketball"
    />
    篮球
  </label>
  <label for="football">
    <input id="football" type="checkbox" v-model="hobbies" value="football" />
    足球
  </label>
  <label for="tennis">
    <input id="tennis" type="checkbox" v-model="hobbies" value="tennis" />
    网球
  </label>
  <p>{{ hobbies }}</p>

  <!-- radio 单选按钮 -->
  <label for="male">
    <input id="male" type="radio" v-model="gender" value="male" />
    男
  </label>
  <label for="female">
    <input id="female" type="radio" v-model="gender" value="female" />
    女
  </label>
  <p>{{ gender }}</p>

  <!-- select 下拉选框 -->
  <select v-model="fruit" multiple size="2">
    <option value="apple">苹果</option>
    <option value="orange">橘子</option>
    <option value="banana">香蕉</option>
  </select>
  <p>{{ fruit }}</p>
</template>
<script>
  const App = {
    template: "#my-app",
    data() {
      return {
        intro: "Hello World",
        isAgree: false,
        hobbies: ["basketball"],
        gender: "",
        fruit: ["orange"],
      };
    },
    computed: {},
    methods: {},
  };
  Vue.createApp(App).mount("#app");
</script>
```

## v-model 的修饰符

在使用 v-on 指令时，可以通过修饰符完成一些特殊的操作，

- 例如使用 .stop 修饰符阻止事件的冒泡

- v-model 指令也支持使用修饰符完成一些特殊操作，

- `.lazy`: 将输入内容的更新延迟到 change 事件触发时再进行，而不是每次输入内容都进行更新

- `.number`: 自动将输入内容转换为数字类型

- `.trim`: 去除输入内容的首位空格

### .lazy 修饰符

```html
<template id="my-app">
  <input type="text" v-model.lazy="message" />
  <p>{{ message }}</p>
</template>
```

### .number 修饰符

```html
<template id="my-app">
  <input type="text" v-model.number="score" />
  <p>{{ score }} -> {{ typeof score }}</p>
</template>
```

### .trim 修饰符

```html
<template id="my-app">
  <input type="text" v-model.trim="message" />
  <p>{{ message }}</p>
</template>
```
