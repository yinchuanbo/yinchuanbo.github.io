---
title: "node环境变量及在项目中的使用"
tag: "NodeJS"
time: 2024-09-15 16:44:28
---

## 零、前言

### 0.0 需求

公司有个项目是单页面应用（SPA），它与其他单页面应用一样，使用的是前端路由，来判断现在应该呈现哪个页面或组件。所以前端代码中会编写一个路由表，来表示哪个 url 对应哪个组件。

而现在需要将这套前端代码部署到两个（以后甚至会是多个）网站上，并且它们都需要有自己专属的前缀。比如一个 home 页面，正常的路由是 `/home`，但是现在需要为不同的网站添加不同的前缀。如网站 A 的 url 是 `websiteA/home`，网站 B 的 url 是 `websiteB/home`。

### 0.1 实现方案

正常情况下，我们只会编写一个路由表，所以我们想到了使用变量 `prefix`来代表打包或运行时，前缀应是什么。如`` let url = `${prefix}/home` ``，我们只需将 prefix 替换成像 websiteA 之类的前缀就行。

一个常规的做法就是在路由表文件中定义这个 prefix 变量，每次在运行或者打包时，就修改成想要的字符串。这在大部分项目中是适用的，但如果某个项目需要配置的变量较多（如端口，前缀，甚至是一些其他配置项），那么在每次运行项目或者打包前，就需要在多个文件中各自修改，这样就显得比较繁琐了。

而我们的目标是：使用某个方案，能统一管理这些变量，只需在一个地方配置，能在多个文件中使用。而使用 node 环境变量似乎是个不错的选择。

### 0.2 方案分析

众所周知，现代前端项目在编码、打包时，其实是一个 node 项目（无论开发环境还是打包时，都是通过如 webpack、vite 等运行在 NodeJS 环境的构建工具，帮我们将项目代码转化为浏览器认识的，如 html，js，css 等资源）。

node 项目在启动时，可以设置环境变量，这些环境变量可以在运行在 node 中的文件中读取。而像 react 等被打包的代码，运行环境不是 node，所以无法读取这些环境变量。

但是我们可以通过其他运行在 node 中的工具，在对代码进行打包时，作为一个中介，读取 node 的环境变量，并且“写入”到打包后的代码中。这样即使是运行在浏览器中的代码，也能使用打包时设置的 node 环境变量了。

## 一、node 环境变量

首先聊一下 node 环境变量的原生用法：当我们在命令行窗口中运行 nodejs 代码时，就可以设置环境变量。

值得注意的是，当前设置的环境变量仅在当前命令行会话窗口中有效，且当代码运行完毕后，它们就会失去作用。

### 1.1 原生设置方式

不同系统设置 node 环境变量的方式是不一样的，具体如下所示：

```sh
# windows
set var1=value1 && set var2=value2 && node app.js

# Linux / macOS
var1=value1 var2=value2 node app.js
```

### 1.2 读取环境变量

如上方式设置了环境变量之后，就可以在 `process.env`对象中读取了（process 对象可以理解为 node 环境中的全局变量，无需引入即可访问）。

```js
console.log(process.env.var1);
```

值得注意的是：上述访问 process 对象的行为，只有在运行在 node 环境中的脚本才能执行。

### 1.3 使用 cross-env 抹平差异

上文提到不同操作系统设置环境变量的语法不同，所以可以借助 `cross-env`库来帮我们抹平它们之间的差异。只需按照 cross-env 的语法编写，它在运行时，会判断当前操作系统，并使用正确的语法来帮助我们设置环境变量。

当然，它只能帮助我们抹平环境变量设置的差异，而系统的命令行语法则无法消除差异（如 windows 中连接多条命令的话，需要使用 `&&`）

```sh
npm install cross-env --save-dev
```

```json
{
  "scripts": {
    "start:windows": "cross-env var1=value1 var2=value2  && node app.js",
    "start:linux": "cross-env var1=value1 var2=value2 node app.js"
  }
}
```

## 二、在 webpack 构建的项目中使用 node 环境变量

上面提到了，设置了 node 环境变量后，只能在运行在 node 环境中的脚本中可以访问。而像使用 webpack **打包后**的代码，它们的运行环境一般是浏览器，对于这种情况，是无法读取到打包时设置的环境变量。

### 2.1 webpack.DefinePlugin

[webpack.DefinePlugin](https://www.webpackjs.com/plugins/define-plugin/) 是一个 webpack 自带的一个 plugin，帮我们在代码编译时，将 node 环境变量“写入”到打包后的代码中。

如下 webpack.config.js 配置：

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      // webpack.config.js运行在node环境中，可直接读取环境变量
      "process.env.var1": JSON.stringify(process.env.var1),
      "process.env.var2": JSON.stringify(process.env.var2),
    }),
  ],
};
```

值得注意的是，node 中的 process.env 对象中，除了有我们设置的属性外，还有许多 node 默认属性。

而 DefinePlugin 不会帮我们将其中的所有属性进行“写入”，所以需要我们如上述代码一样，将需要用到的环境变量逐个列出来。

然后我们就可以在打包后的代码中（无论是 react 组件代码中，还是普通的 js 代码中）就能直接读取上面配置了的“环境变量”了，如 `process.env.var1`。

### 2.2 结合使用

综上所述，我们在启动项目或打包时，使用 cross-env（当然也可以直接使用原生语法） 设置 node 环境变量，再配合 DefinePlugin，就可以将特定的变量“传递”至打包后的代码中，从而实现动态设置前缀、url 等配置。而无需每次都在代码中修改。

```json
{
  "scripts": {
    "start:windows": "cross-env var=value && node app.js",
    "start:linux": "cross-env var=value node app.js"
  }
}
```

至此，我们已经可以正常地在 webpack 项目中使用 node 环境变量了。

### 2.3 注意点

**2.3.1 DefinePlugin 的工作是替换**

使用 DefinePlugin 后，如果尝试在打包后的代码中读取 process 或者 process.env 对象，就会发现报错了，显示它们 `is not defined`。

这是因为 DefinePlugin 并不是真的帮我们在打包后的代码中创建一个 process 对象，并在其中添加一个 env 属性。

实际上 DefinePlugin 是在构建过程中发挥作用的，本质上做的是 `字符串替换`，将上面配置的 process.env.var1 和 process.env.var2 替换为它的值。如下为 webpak 文档对 DefinePlugin 的描述：

DefinePlugin 允许在 **编译时** 将你代码中的变量**替换**为其他值或表达式。

**2.3.2 命名冲突**

值得注意的是，如果在配置 DefinePlugin 时的字符串与打包后文件中的变量名有冲突的话，DefinePlugin 将不会进行替换。即文件中的变量优先级最高（所以在配置 DefinePlugin 时，尽量用一些平时不会使用到的变量名）。

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.var1": JSON.stringify(process.env.var1),
      "process.env.var2": JSON.stringify(process.env.var2),
    }),
  ],
};
```

如果 DefinePlugin 配置如上，而在其他文件中声明了 process 对象，那么 DefinePlugin 将不会在该文件中对形如 `process.xx.xx`的字符串进行替换。

**2.3.3 键名选择**

当然，DefinePlugin 配置的键名其实是可以随便定义的，我们通常定义为 process.env.xx 只是因为保持与 node 环境变量的读取方式（看起来）一致而已。

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      myVar1: JSON.stringify(process.env.var1),
      myVar2: JSON.stringify(process.env.var2),
    }),
  ],
};
```

## 三、使用 dotenv 管理环境变量

如果我们的项目需要用到多个环境变量，或者需要根据不同环境（如开发环境，测试环境，生产环境等）设置不同环境变量的话。使用上述在命令行窗口中手动设置环境变量的方式，就会变得繁琐。

为了解决上述问题，我们可以使用 dotenv 库帮我们管理及自动设置环境变量。

dotenv 简单理解：我们在指定文件中编写要设置的 node 环境变量，detenv 库可以自动地帮我们将它们设置到 node 环境变量中。

### 3.1 简单使用

一、在项目中安装 dotenv 库

```sh
npm install dotenv --save
```

二、在项目根目录创建 .env 文件

```sh
var1=value1
var2=value2
```

三、在入口文件中添加代码

如在 webpack.config.js 中

```js
// dotenv会自动读取项目根目录下的.env文件，并设置node环境变量。
require("dotenv").config();
```

到此就已经实现了 dotenv 库的基本功能，再配合上前面提到的 DefinePlugin 就可以方便地在打包后的代码中“访问”环境变量了。

### 3.2 进阶使用

前面提到了，我们可能会根据不同环境配置不同的环境变量，但是 3.1 中提到的用法，无法区分环境。

这时我们可以创建如下三个文件：

- .env（管理公共环境变量）
- .env.development（管理开发环境变量）
- .env.production（管理生产环境变量）

然后修改入口文件的配置：

```js
// 加载通用的 .env 文件
require("dotenv").config();

// 根据环境变量 NODE_ENV 加载相应的环境文件
const envFile = `.env.${process.env.NODE_ENV}`;
require("dotenv").config({ path: envFile });
```

如上述代码所示，除了默认加载的.env 文件，还可以通过 path 配置项，指定需要读取的其他文件。

所以做法就是，启动项目时，手动设置环境变量 `NODE_ENV`，然后依赖这个环境变量去决定加载哪个文件。

```json
{
  "scripts": {
    "start:dev": "cross-env NODE_ENV=development && node app.js",
    "start:prod": "cross-env NODE_ENV=production && node app.js"
  }
}
```

## 四、在 create-react-app 项目中使用环境变量

在 create-react-app 创建的项目中，已经帮我们配置好使用 node 环境变量该有的配置了（如 DefinePlugin、detenv 等）

其中 detenv 的配置，默认支持.env、.env.development、.env.production 这三个文件，分别对应默认变量、开发环境变量和生产环境变量。我们在项目根目录直接新建文件就可使用了。

但是为了能使 react-scripts 自动帮我们配置这些环境变量，它们的命名需要遵守前缀为 `REACT_APP_`的规范（如 REACT_APP_BASE_URL）。

然后在 js 文件中，就直接可以使用 `process.env.REACT_APP_XX`来使用了。
