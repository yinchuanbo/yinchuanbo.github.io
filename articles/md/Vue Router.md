---
title: "Vue Router"
tag: "Vue"
time: 2025-01-22 09:08:46
---

## Vue Router 的基本使用

使用 Vue Router 可以分为以下 6 个步骤:

1. 在项目根目录执行 `npm install vue-router@4`，安装 Vue Router 插件

2. 创建路由组件，也可以理解为创建页面组件

3. 配置路由映射，在 routes 数组中配置路由组件和路径之间的映射关系。

4. 通过 createRouter 创建路由对象，并传入 routes 和 history 模式(或 hash 模式)

5. 使用 app.use 函数将路由插件安装到 Vue3 框架中

6. 通过 Vue Router 内置的`<router-link>`和`<router-view>`组件使用路由。

### 路由的基本使用

**第一步:安装 Vue Router**

```sh
npm install vue-router@4.0.14
```

**第二步:创建路由组件**

```sh
|-- src
   |-- pages
      |- Home.vue
      |- About.vue
```

```html
<!-- Home.vue -->
<template>
  <div class="home">Home Page</div>
</template>
```

```html
<!-- About.vue -->
<template>
  <div class="about">About Page</div>
</template>
```

**第三步和第四步: 配置路由映射和创建路由对象**

```sh
|-- src
   |-- router
      |- index.js
```

```js
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";

const routes = [
  { path: "/home", component: Home },
  { path: "/about", component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

**第五步: 将路由插件安装到 Vue3 框架中**

src/main.js

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
const app = createApp(App);
app.use(router); // 安装路由插件
app.mount("#app");
```

**第六步: 通过 router-link 和 router-view 使用路由**

```html
<template>
  <div class="nav">
    <!-- 切换路由，即切换页面 -->
    <router-link class="tab" to="/home">首页</router-link>
    <router-link class="tab" to="/about">关于</router-link>
  </div>
  <!-- 路由组件的占位 -->
  <router-view></router-view>
</template>
```

需要注意的是，如果在浏览器中直接输入 `http://locahost:8080/`，并按 Enter 键，会发现页面中的 `<router-view>` 组件处并没有显示任何内容。此时，如果按 F12 键打开调试工具查看控台，提示未匹配到路由的默认路径。为了解决这个问题,下介绍路由配置的细节。

### 路由配置的细节

**1. 路由的默认路径**

默认情况下，当进入网站首页时，我们希望 `<router-view>` 组件处默认渲染首页 (Home.vue) 的内容。然而，在上述案例中，默认情况下并没有显示首页组件，而是需要单击 “首页” 按才显示。

为了让访问根路径时默认跳转到首页，我们需要在路由配置中设置默认路径 (/)，

```js
// src/router/index.js
// ...
const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  { path: "/about", component: About },
];
// ...
```

**2. 路由的 history 模式**

**3. 路由的 router-link 组件**

`<router-link>` 是 Vue Router 的内置组件，我们可以使用它来创建链接并切换 URL，从而使 Vue Router 可以在不重新加载页面的情况下更改 URL。该组件还可以对以下属性进行配置。

(1) to 属性

表示目标路由的链接。当 `<router-link>` 组件被单击后，内部会立刻把 to 的值传给 `router.push() API`，以实现页面跳转，因此这个值可以是一个字符串或一个对象，代码如下所示:

```html
<router-link class="tab" to="/home">首页</router-link>
<router-link class="tab" :to="{ path: '/home' }">首页</router-link>
```

(2) replace 属性

设置 replace 属性后，当 `<router-link>` 组件被单击后，会调用 `router.replace() API` 实现页面跳转。

这次页面跳转是直接替换当前页面，页面不会被压入浏览器的历史栈中。因此，页面跳转后，浏览器无法使用返回功能，代码如下所示:

```html
<router-link class="tab" to="/home" replace>首页</router-link>
<router-link class="tab" to="/about" replace>关于</router-link>
```

(3) active-class 属性

设置 `<a>` 元素激活后应用的 class，默认的 class 是 `router-link-active`

更改 class 的默认值：

```html
<router-link :to="{ path: '/home' }" active-class="why">首页</router-link>
```

(4) exact-active-class 属性

链接精准激活（即 URL 和 to 上配置的路径需完全一样），用于设置 `<a>` 元素被激活的 class，默认是 router-link-exact-active。该属性的用法和 active-class 属性类似，

```html
<router-link :to="{ path: '/home' }" exact-active-class="coderwhy"
  >首页</router-link
>
```

**4. 路由的懒加载**

在真实开发过程中，一个项目可能会包含大量页面组件。如果这些组件都没有使用异步加载，那么在打包构建生产项目时，JavaScript 包会变得非常大，从而影响页面的首屏加载速度

为了解决这个问题，可以将不同路由对应的组件分割成不同的代码块，然后在访问路由时才加载对应的组件。这种做法不仅更加高效，还可以提高首屏加载速度。实际上，Vue Router 默认就支持异步加载组件，也就是所谓的路由懒加载。

- 修改 src/router/index.js

```js
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
// import Home from "../pages/Home.vue";
// import About from "../pages/About.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: () => import("../pages/Home.vue") },
  { path: "/about", component: () => import("../pages/About.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

> 需要注意的是: component 属性既可以接收一个组件，也可以接收一个函数。当接收函数时，该函数需返回 Promise 对象。

可以发现，配置了路由懒加载会进行分包，但分出来的包的名称都是随机生成的。实际上，自 webpack3.x 起，就支持对分包进行命名(chunk name)。在 import 函数的参数中添加魔法注释，例如 `/* webpackChunkName: "自定义分包名" */`，即可对分包进行命名、

```js
const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: () =>
      import(/* webpackChunkName: "home-chunk" */ "../pages/Home.vue"),
  },
  {
    path: "/about",
    component: () =>
      import(/* webpackChunkName: "about-chunk" */ "../pages/About.vue"),
  },
];
```

**5. 路由的其他属性**

在配置路由映射时，除了可以配置 path 和 component 属性，实际上路由还支持配置其他属性，举例如下:

(1) name 属性: 为路由添加一个独一无二的名称

(2) meta 属性: 为路由附加自定义数据

```js
const routes = [
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about-chunk" */ "../pages/About.vue"),
    meta: {
      name: "why",
      age: 18,
    },
  },
];
```

接下来，可以在 About.vue 页面的 setup 函数中调用 useRoute 函数，以获取对应的路由配置信息，

```js
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    console.log(route.name); // about
    console.log(route.meta); // { name: 'why', age: 18 }
  },
};
```

## Vue Router 进阶知识

### 动态路由的匹配

通常，我们需要将符合特定匹配规则的路由映射到同一个组件中，例如，我们有一个 User.vue 页面，它应该对所有用户进行渲染

- 当访问 http://localhost:8080/user/why 时，应该渲染 why 用户的信息

- 当访问 http://localhost:8080/user/kobe 时，应该渲染 kobe 用户的信息

为了实现该功能，可以使用 VueRouter 的动态路由，即在路径中使用一个动态路径参数，也称路径参数或路由参数。

**第一步: 基本匹配规则**

```sh
|-- src
   |-- pages
      |- User.vue
```

```html
<template>
  <div class="user">User Page</div>
</template>
```

接着，在 `src/router/index.js` 文件中添加 User.vue 页面的路由配置

```js
const routes = [
  //...
  {
    path: "/user/:username",
    component: () => import("../pages/User.vue"),
  },
];
```

然后，在 `src/app.vue` 中添加一个切换到用户页面的按钮链接

```html
<router-link class="tab" to="/about">关于</router-link>
<router-link class="tab" to="/user/why">用户</router-link>
```

路径参数使用冒号标记，比如 `:userame`。当匹配到一个路由时，路径参数值会被设置到 `this.$route.params` 中。因此，我们可以通过以下方法在 User.vue 组件中获取该路径参数值。

(1) 在 template 中直接通过 `$route.params` 获取值

(2) 在 created 等生命周期中通过 `this.$route.params` 获取值

(3) 在 setup 中使用 vue-router 提供的 useRoute 函数，该函数会返回一个存放当前路由信息的 Route 对象

- 修改 User.vue 组件

```html
<template>
  <div class="user">User Page: {{ $route.params.username }}</div>
</template>
<script>
  export default {
    created() {
      console.log(this.$route.params.username);
    },
    setup() {
      const route = useRoute();
      console.log(route.params.username);
    },
  };
</script>
```

**第二步: 匹配多个参数值**

动态路由支持匹配多个参数，因此可以在路径中配置两个动态路径参数。例如，首先在 User.vue 页面的路由配置信息的 path 属性上，添加一个新的动态路径参数:id，

```js
const routes = [
  //...
  // 定义 :username 和 :id 两个动态路径参数
  {
    path: "/user/:username/id/:id",
    component: () => import("../pages/User.vue"),
  },
];
```

接着，将 `src/app.vue` 中 `<router-link>` 组件 to 属性的值改为 `/user/why/id/0001`

```html
<router-link class="tab" to="/user/why/id/0001">用户</router-link>
```

- 修改 User.vue 组件

```html
<template>
  <div class="user">
    User Page: {{ $route.params.username }} - {{ $route.params.id }}
  </div>
</template>
<script>
  export default {
    created() {
      console.log(this.$route.params.username, this.$route.params.id);
    },
    setup() {
      const route = useRoute();
      console.log(route.params.username, route.params.id);
    },
  };
</script>
```

**第三步: 跳转到 NotFound 页面**

对于未匹配到的路由，我们通常会让其跳转到一个固定的页面，比如 NotFound (404) 页面、为了实现 404 页面，我们可以编写一个专门用于匹配所有页面的路由，将其指向 404 页面

```js
// src/router/index.js
const routes = [
  //...
  {
    // 使用通配符 * 来匹配任意路径，通配符路由应放在最后
    path: "/:pathMatch(.*)",
    component: () => import("../pages/NotFound.vue"),
  },
];
```

```html
<!-- NotFound.vue -->
<template>
  <div class="not-found">404 Not Found</div>
  <!-- 获取路径参数值 -->
  <h4>{{ $route.params.pathMatch }}</h4>
</template>
```

匹配所有页面的规则还有另一种写法，

```js
// src/router/index.js
const routes = [
  //...
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../pages/NotFound.vue"),
  },
];
```

如果省略了最后的 `*`，那么在解析或跳转时，参数中的 / 字符将被编码。

如果打算直接使用未匹配的路径名称导航到该路径，那么这个 `*` 是必需的。

如果多加了一个 `*`，那么路由参数会被解析为数组格式。

### 嵌套路由的使用

目前我们匹配的 Home.vue、About.vue 和 User.vue 页面等都属于底层路由(即一级路由)，可以在它们之间任意切换。

大部分情况下，像 Home.vue 页面本身也会存在多个组件来回切换例如，Home.vue 页面中又包括 Product.vue 和 Message.vue 页面，它们可以在 Home.vue 页面内部来回切换。

为了实现该功能，需要用到**嵌套路由**，我们可以在 Home.vue 页面中也使用 `<router-view>` 组件对需要渲染的组件进行占位。下面演示嵌套路由使用。

```sh
|-- src
   |-- pages
      |- Home.vue
      |- HomeMessage.vue
      |- HomeShops.vue
```

```html
<!-- HomeMessage.vue -->
<template>
  <div class="home-message">
    <h4>Home Message 组件</h4>
    <div>消息通知...</div>
  </div>
</template>
```

```html
<!-- HomeShops.vue -->
<template>
  <div class="home-shops">
    <h4>Home Shops 组件</h4>
    <div>商品信息...</div>
  </div>
</template>
```

路由配置：

```js
// src/router/index.js
const routes = [
  //...
  {
    path: "/home",
    component: () => import("../pages/Home.vue"),
    children: [
      // 在 Home 页面下注册二级路由
      {
        // 二级路由 path 不支持 /message 或 /home/message，直接填 message 即可
        path: "message",
        component: () => import("../pages/HomeMessage.vue"),
      },
      {
        path: "shops",
        component: () => import("../pages/HomeShops.vue"),
      },
    ],
  },
];
```

修改 sre/pages/Home.vue 页面

```html
<!-- Home.vue -->
<template>
  <div class="home">
    <router-link to="/home/message">消息</router-link>
    <router-link to="/home/shops">商品</router-link>
    <!-- 路由占位 -->
    <router-view></router-view>
  </div>
</template>
```

下面进一步完善该案例，例如，当用户单击 “首页” 按钮时，默认显示消息页面的内容。实际上，只需要在刚才 Home.vue 页面的路由配置的 children 属性中添加路由重定向的配置，即可实现该功能

```js
// src/router/index.js
const routes = [
  //...
  {
    path: "/home",
    component: () => import("../pages/Home.vue"),
    children: [
      // 在 Home 页面下注册二级路由
      {
        // 路由重定向
        path: "",
        redirect: "/home/message",
      },
      {
        // 二级路由 path 不支持 /message 或 /home/message，直接填 message 即可
        path: "message",
        component: () => import("../pages/HomeMessage.vue"),
      },
      {
        path: "shops",
        component: () => import("../pages/HomeShops.vue"),
      },
    ],
  },
];
```

### 编程式导航的使用

除了使用`<router-link>` 组件实现页面导航，Vue Router 的实例还提供一些与导航相关的方比如 `router.push` 方法。我们可以通过调用方法实现页面导航，这种方式称为**编程式导航**。

**1. 代码实现页面跳转**

```html
<template>
  <button @click="jumpToAbout">关于</button>
</template>
<script>
  import { useRouter } from "vue-router";
  export default {
    setup() {
      const router = useRouter();
      const jumpToAbout = () => {
        router.push("/about"); // 跳转到 “关于” 页面
      };
      return {
        jumpToAbout,
      };
    },
  };
</script>
```

push 方法不仅可以接收一个字符串类型的参数，还支持接收一个对象类型的参数

```html
<template>
  <button @click="jumpToAbout">关于</button>
</template>
<script>
  import { useRouter } from "vue-router";
  export default {
    setup() {
      const router = useRouter();
      const jumpToAbout = () => {
        router.push({
          path: "/about",
        }); // 跳转到 “关于” 页面
      };
      return {
        jumpToAbout,
      };
    },
  };
</script>
```

最后，再看一下 OptionsAPI 的实现（更推荐 setup 语法）

```html
<template></template>
<script>
  export default {
    methods: {
      jumpToAbout() {
        // this.$router.push("/about");
        this.$router.push({
          path: "/about",
        });
      },
    },
  };
</script>
```

**2. query 参数**

当单击 “关于” 按钮跳转到 “关于” 页面时，实际上可以通过查询字符串 (query) 的方式向目标页面传递参数。

以下是使用 setup 和 OptionsAPI 两种方式，通过 query 参数向目标页面传递参数的示例。

(1) setup 方式(推荐)

```js
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const jumpToAbout = () => {
      // route.push("/about?name=coder&age=20");
      router.push({
        path: "/about",
        query: {
          name: "coder",
          age: 20,
        },
      });
    };
    return {
      jumpToAbout,
    };
  },
};
```

(2) OptionsAPI 方式

```js
export default {
  methods: {
    jumpToAbout() {
      // this.$router.push("/about?name=coder&age=20");
      this.$router.push({
        path: "/about",
        query: {
          name: "coder",
          age: 20,
        },
      });
    },
  },
};
```

接着，我们可以在 “关于” 页面使用 route 对象获取 query 参数。

```html
<template>
  <div class="about">
    <p>{{ $route.query.name }} - {{ $route.query.age }}</p>
  </div>
</template>
<script>
  import { useRoute } from "vue-router";
  export default {
    name: "About",
    setup() {
      const route = useRoute();
      console.log(route.query.name, route.query.age);
    },
  };
</script>
```

**3. 替换当前的位置**

使用 push 方法进行页面跳转时，默认会进行压栈操作。当用户单击页面上的返回箭头时，可以回退到上一个页面。但是，如果希望在当前页面进行替换操作，不具备回退功能，可以使用 router 对象的 replace 方法。

```js
const jumpToAbout = () => {
  router.replace("/about"); // 替换当前的位置
};
```

**4. 页面的前进和后退**

若要实现页面的前进和后退功能，可以使用 `router.go` 方法

```js
router.go(1); // 前进一页，与 router.forward 相同
router.go(-1); // 后退一页，与 router.back 相同

// 或者
router.go(3); // 前进3条记录(记录可理解为页面，即前进3个页面)

// 如果没有那么多条记录，则默认失败
router.go(-100);
router.go(100);
```

另外，router 对象还提供了 back 和 forward 方法。

- back 方法: 通过调用 history.back 方法回溯历史，相当于 `router.go(-1)`。
- forward 方法: 通过调用 history.forward 方法前进历史，相当于 `router.go(1)`。

### 路由内置组件的插槽

**1. router-link 组件的作用域插槽**

`<router-link>` 组件通过一个作用域插槽暴露底层的定制能力。这是一个更高阶的 API，主要面向库作者，也可以为开发者提供便利。在 vue-router 3.x 中，`<router-link>` 有一个 tag 属性，可以决定 `<router-link>` 到底渲染什么元素。但是从 vue-router 4.x 开始，该属性被移除了，却提供了更具灵活性的 `v-slot` 的方式，用于定制渲染的内容

v-slot 的使用主要分为两个步骤：

(1) 添加 custom 属性，表示整个元素要自定义。如果不添加该属性，那么自定义的内容会被包裹在一个 `<a>` 元素中。

(2) 使用 v-slot 作用域插槽获取内部传递的值，具体如下:

- href: 解析后的 URL

- route: 解析后规范化的 route 对象

- navigate: 触发导航的函数

- isActive: 匹配状态

- isExactActive: 精准匹配状态

```html
<!-- App.vue -->
<template>
  <div class="nav">
    <!--
      custom: 表示要自定义
    -->
    <router-link class="tab" to="/home" custom v-slot="props">
      <strong @click="props.navigate">首页</strong>
      <span>{{ props.href }}</span>
      <span>{{ props.isActive }}</span>
      <!-- todo: 处理以上的元素，还支持插入自定义的组件 -->
    </router-link>
  </div>
</template>
```

**2. router-view 组件的 v-slot**

`<router-view>` 组件也提供了一个 v-slot，可以使用 `<transition>` 和 `<keep-alive>` 组件包裹路由组件。

下面使用 `<router-view>` 作用域插槽为页面添加过渡动画和缓存的功能。

```html
<template>
  <div class="nav">...</div>
  <router-view v-slot="props">
    <transition name="why">
      <component :is="props.Component" />
    </transition>
  </router-view>
</template>
```

1. 在 `<router-view>` 组件上添加 v-slot 指令，通过 props 接收内部提供的插槽参数

2. 在 `<router-view>` 组件的默认插槽中插入 `<transition>` 组件。`<transition>` 组件用于为页面组件添加过渡动画，指定的过渡动画类名为 why，并在 style 标签中编写相应的动面样式，着，将插槽提供的 `props.Component` 属性动态绑定到 `<component>` 组件的 is 属性上。

在浏览器中运行后，再次切换页面就会有过渡效果。

除了添加过渡效果，还可以使用 `<keep-alive>` 组件为页面添加缓存功能，

```html
<template>
  <router-view v-slot="props">
    <keep-alive>
      <component :is="props.Component" />
    </keep-alive>
  </router-view>
</template>
```

### 动态添加路由

前面都是在 routes 选项中提前配置好路由，但是在某些情况下，我们需要在应用程序运行后再动态添加或删除路由。例如，根据登录用户的权限，动态注册不同的路由。这时可以使用 `addRoute` 方法。

**1. addRoute**

addRoute 方法可以动态添加一条新的路由规则。如果该路由规则有 name 属性，并且己经存在一个与之相同的名字，则会覆盖原有的规则。

- 修改 `src/router/index.is` 文件，

```js
// ...
const categoryRoute = {
  path: "/category",
  component: () => import("../pages/Category.vue"),
};

// 动态添加顶级路由对象
router.addRoute(categoryRoute);
//...
export default router;
// ...
```

addRoute 方法不仅可以添加顶级路由，还支持添加二级路由

```js
const routes = [
  {
    path: "/home",
    name: "home",
  },
  // ...
];
// ...
router.addRoute("home", {
  path: "comment",
  component: () => import("../pages/HomeComment.vue"),
});
//...
export default router;
// ...
```

> 注意: router.addRoute 方法在接收一个参数时添加的是一级路由，在接收两个参数时添加的是二级路由。

**2. 动态路由补充**

Vue Router 还提供了三种动态删除路由的方式

(1) 方式一: 添加一个相同名字 (name) 的路由，会覆盖之前同一名字的路由。

```js
router.addRoute({
  path: "/about",
  name: "about",
  component: About,
});
```

(2) 方式二: 使用 removeRoute 方法，传入路由的名称

```js
router.removeRoute("about");
```

(3) 调用 router.addRoute 返回的回调函数

```js
const removeAbout = router.addRoute({
  path: "/about",
  name: "about",
  component: About,
});
removeAbout(); // 删除添加的路由
```

除此之外，Vue Router 的实例还提供很多常用的方法，列举如下:

- router.hasRoute: 检查路由是否存在

- router.getRoutes: 获取一个包含所有路由记录的数组

### 路由守卫

在某些情况下，我们希望能拦截路由导航。比如在进入某个路由之前，先判断用户是否已登录，如登录则放行，否则导航到登录页面。

其实，Vue Router 已经为我们提供了该功能，并将拦截路由称为 “导航守卫” (也称为“路由守卫”)。导航守卫，顾名思义就是专门用于守卫导航，可以灵活控制路由的跳转或取消等。导航守卫通常有三种实现方式：全局路由守卫、单个路由独享的守卫、组件内的守卫。在开发中用得最多的是全局路由守卫中的全局前置守卫。

**1. 全局前置守卫**

我们可以用 `router.beforeEach` 方法注册一个路由的全局前置守卫

```js
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log("全局前置守卫");
  next();
});

export default router;
```

可以看到，beforeEach 函数需要接收一个回调函数，该回调函数有两个参数:

- to: 将进入的路由 Route 对象

- from: 将离开的路由 Route 对象

另外，beforeEach 回调函数支持返回值的类型如下:

- false: 取消当前导航

- undefined 或不返回: 进行默认导航

- 字符串:一个路由路径，如"/about"

- 对象: 如 `{ path: "/login", query: {}, params: {} }` 对象

```js
// src/router/index.js
//...
router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    const token = window.sessionStorage.getItem("token");
    if (!token) {
      next("/login");
    }
  }
});
//...
```
