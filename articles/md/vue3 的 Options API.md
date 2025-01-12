---
title: "vue3 的 Options API"
tag: "Vue"
time: 2025-01-11 20:02:35
---

## 计算属性

### 计算属性的实现

```html
<div id="app"></div>
<template id="my-app">
  <h4>{{ fullName }}</h4>
  <h4>{{ result }}</h4>
  <h4>{{ reverseMessage }}</h4>
</template>
<script>
  const App = {
    template: "#my-app",
    data() {
      return {
        firstName: "Kobe",
        lastName: "Bryant",
        score: 80,
        message: "Hello, World",
      };
    },
    computed: {
      fullName() {
        return this.firstName + " " + this.lastName;
      },
      result() {
        return this.score >= 60 ? "及格" : "不及格";
      },
      reverseMessage() {
        return this.message.split(" ").reverse().join(" ");
      },
    },
  };
  Vue.createApp(App).mount("#app");
</script>
```

### 计算属性和 methods 的区别

计算属性和 methods 的实现差别不大，只是计算属性会有缓存。

```html
<div id="app"></div>
<template id="my-app">
  <!-- 第一种：methods 的实现 -->
  <h4>{{ getFullName() }}</h4>
  <h4>{{ getFullName() }}</h4>
  <h4>{{ getFullName() }}</h4>

  <!-- 第二种：计算属性 computed 的实现 -->
  <h4>{{ fullName }}</h4>
  <h4>{{ fullName }}</h4>
  <h4>{{ fullName }}</h4>

  <button @click="changeFirstName">修改 firstName</button>
</template>
<script>
  const App = {
    template: "#my-app",
    data() {
      return {
        firstName: "Kobe",
        lastName: "Bryant",
      };
    },
    // 计算属性是有缓存的，当多次使用计算属性时，只会执行一次，当依赖的 firstName 改变了，才会重新计算
    computed: {
      fullName() {
        return this.firstName + " " + this.lastName;
      },
    },
    methods: {
      getFullName() {
        return this.firstName + " " + this.lastName;
      },
      changeFirstName() {
        this.firstName = "LeBron";
      },
    },
  };
  Vue.createApp(App).mount("#app");
</script>
```

> 可以发现，methods 中的 getFullName 方法会被调用多次，而计算属性中的 fullName 只会被调用一次。

- 计算属性会基于它的依赖关系对计算属性结果进行缓存

- 当计算属性依赖的数据不变化时，就无须重新计算，但是一旦发生变化，计算属性依然会重新计算

### 计算属性的 setter 和 getter

在多数情况下，计算属性只需要一个 getter 方法，

```html
<div id="app"></div>
<template id="my-app">
  <button @click="changeFullName">修改 fullName</button>
  <h4>{{ fullName }}</h4>
</template>
<script>
  const App = {
    template: "#my-app",
    data() {
      return {
        firstName: "Kobe",
        lastName: "Bryant",
      };
    },
    computed: {
      fullName: {
        get: function () {
          return this.firstName + " " + this.lastName;
        },
        set: function (newValue) {
          const names = newValue.split(" ");
          this.firstName = names[0];
          this.lastName = names[1];
        },
      },
    },
    methods: {
      changeFullName() {
        this.fullName = "Coder why";
      },
    },
  };
  Vue.createApp(App).mount("#app");
</script>
```

## 监听器 watch

在 data 属性中可以定义响应式数据，并在模板中使用。当响应式数据变化时，模板中对应的内容也会自动更新。

在某些情况下，需要监听某个响应式数据的变化，这是就需要使用监听器 watch 来实现。

### watch 的基本使用

```html
<div id="app"></div>
<template id="my-app">
  请输入问题：<input type="text" v-model="question" />
  <div>{{ anwser }}</div>
</template>
<script>
  const App = {
    template: "#my-app",
    data() {
      return {
        question: "",
        anwser: "",
      };
    },
    watch: {
      question: function (newValue, oldValue) {
        this.queryAnswer();
      },
    },
    methods: {
      queryAnswer() {
        this.anwser = `你的问题是：${this.question} ? 答案 : 哈哈哈哈`;
      },
    },
  };
  Vue.createApp(App).mount("#app");
</script>
```

另外，需要注意的是，在 watch 属性中监听 question 的变化有如下两种常用的语法：

1. function 语法

```js
watch: {
	// 简写方式
	question(newValue, oldValue) {
		this.queryAnswer()
	}
}
```

2. 对象语法

```js
watch: {
	question: {
		handler(newValue, oldValue) {
			this.queryAnswer()
		}
	}
}
```

> 需要注意的是：在 Vue3 官网中，说明了不应该使用箭头函数定义 watch 属性中的函数，因为箭头函数会导致 this 不会按照期望指向 Vue 实例。

### watch 配置选项

在 Vue3 中，watch 对象语法的常见配置选项有以下几种：

- handler: 要监听的回调函数，当监听属性发生变化时会调用该函数

- deep: 是否深度监听对象或数组中每个属性的变化，默认值是 false

- immediate: 是否立即执行回调函数，默认值为 false

1. handler 选项

```html
<div id="app"></div>
<template id="my-app">
  <h2>{{ info.name }}</h2>
  <h2>{{ info.book.name }}</h2>

  <button @click="changeInfo">改变 info</button>
  <button @click="changeInfoName">改变 info.name</button>
  <button @click="changeInfoBookName">改变 info.book.name</button>
</template>
<script>
  const App = {
    template: "#my-app",
    data() {
      return {
        info: {
          name: "coderwhy",
          age: 18,
          book: {
            name: "Vue.js 3+Ts",
          },
        },
      };
    },
    watch: {
      info: {
        handler: function (newInfo, oldInfo) {
          console.log("newValue:", newInfo, "oldValue:", oldInfo);
        },
      },
    },
    methods: {
      changeInfo() {
        this.info = {
          name: "kobe",
          age: 18,
          book: {
            name: "Vue.js 3+Ts",
          },
        };
      },
      changeInfoName() {
        this.info.name = "rose";
      },
      changeInfoBookName() {
        this.info.book.name = "React+TS";
      },
    },
  };
  Vue.createApp(App).mount("#app");
</script>
```

- 单击 “改变 info” 按钮，watch 能够监听到 info 变量的更新

- 单击 “改变 info.name” 按钮，发现页面上显示的 name 已经更新，但是 watch 却没有检测到 info 对象的修改，

这是因为默认情况下，watch 仅监听对 info 对象引用的变化，而不会监听其内部属性的变化，为了让 watch 监听 info 对象属性的变化，应该使用 deep 选项进行深度监听

2. deep 选项

deep 选项用于配置是否深度监听对象中属性的变化

```js
watch: {
	info: {
		handler: function (newInfo, oldInfo) {
			console.log("newValue:", newInfo, "oldValue:", oldInfo);
		},
		// 深度监听 info 对象的更新，info 内部属性发生的改变都可以被监听到
		deep: true
	},
}
```

3. immediate 选项

immediate 选项可以让 handler 中定义的函数立即执行一次，在默认情况下，该函数只在监听的数据发生变化时才会回调

```js
watch: {
	info: {
		handler: function (newInfo, oldInfo) {
			console.log("newValue:", newInfo, "oldValue:", oldInfo);
		},
		// 深度监听 info 对象的更新，info 内部属性发生的改变都可以被监听到
		deep: true,
		immediate: true // 让 handler 中定义的函数立即执行一次
	},
}
```

### watch 字符串、数组和 API 语法

在 Vue3 中，watch 不仅支持常用的 Function 和对象语法，还支持字符串、数组和 API 语法。

1. 字符串和数组

```js
const app = Vue.createApp({
  data() {
    return {
      b: 2,
      f: 5,
    };
  },
  watch: {
    // 1. 字符串方法名，当 b 发生变化时，会触发 someMethod 方法
    b: "someMethod",
    // 2. 可传入回调数组，它会被逐一调用 (handle1、handle2、handle3 函数)
    f: [
      "handle1",
      function handle2(val, oldVal) {
        console.log("handle2 triggered");
      },
      {
        handler: function handle3(val, oldVal) {
          console.log("handle3 triggered");
        },
      },
    ],
  },
  methods: {
    someMethod() {
      console.log("b changed");
    },
    handle1() {
      console.log("handle1 triggered");
    },
  },
});
```

2. $watch 的 API 语法

除了字符串和数组语法，Vue3 还提供了 watchAPI 进行监听，例如，可以在 created 生命周期中使用 this.watch 进行监听。

```js
created() {
	this.$watch('info', (newValue, oldValue) => {
		console.log(newValue, oldValue)
	}, { deep: true, immediate: true })
}
```

### watch 深度监听

1. 仅监听对象中的某个属性

```js
watch: {
	"info.name": function(newName, oldName) {
		console.log(newName, oldName)
	}
}
```

2. 监听函数的新值和旧值

使用深度监听时，监听函数的新值和旧值都指向同一个引用

```js
watch: {
	info: function(newInfo, oldInfo) {
		console.log(newInfo === oldInfo)
	},
	deep: true // 深度监听
}
```

3. 监听数组内部属性的变化

深度监听除了可以监听对象，还可以监听数组内部属性的变化，例如，深度监听 data 属性中定义的 friends 数组的变化

```js
data() {
	return {
		friends: [{name: "why"}, {name: "kobe"}]
	}
},
watch: {
	friends: {
		handler(newFriends, oldFriends) {
			console.log(newFriends, oldFriends)
		},
		deep: true
	}
}
```