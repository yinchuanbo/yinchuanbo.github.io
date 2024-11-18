---
title: "学 TypeScript 必然要了解 declare"
tag: "TypeScript"
time: 2024-11-18 13:14:15
---

## 背景

declare 关键字是为了服务 TypeScript 的。TypeScript 是什么在这里就不多介绍了，但是我们要知道 ts 文件是需要 TypeScript 编译器转换为 js 文件才可以执行，并且在编译阶段就会进行类型检查。但是在 TypeScript 中并不支持 js 可识别的所有类型，例如我们使用第三方库 JQuery，我们通过一下方法获取一个 id 为‘foo’的标签元素。

```js
$("#foo");
// or
jQuery("#foo");
```

然而在 ts 文件中，使用语法，语法，语法，底下就会爆出一条红线提示到：`Cannot find name '$'`

<img src="../imgs/103/21.webp" />

因此，需要 declare 来声明，告诉 TypeScript 编译器该标识符已存在，通过编译时的检查并在开发时提供类型提示。

## 定义

在 TypeScript 中，declare 关键字告诉编译器存在一个对象（并且可以在代码中引用）。它向 TypeScript 编译器声明该对象。简而言之，它允许开发人员使用在其他地方声明的对象。

注：编译器不会将 declare 语句编译为 JavaScript。对比下面两段代码：

```ts
// declare声明了一个名为 myGlobal 的全局变量，并指定其类型为 any。
// 该声明并不会生成真正的 JavaScript 代码，而只是告诉 TypeScript 编译器该变量存在。
declare var myGlobal: any;

// 给 myGlobal 赋值为 42。
myGlobal = 42;
console.log(myGlobal); // 42
```

```ts
// 直接声明了一个名为 myGlobal 的全局变量，并指定其类型为 any。这会生成真正的 JavaScript 代码。
var myGlobal: any;

// 给 myGlobal 赋值为 42。
myGlobal = 42;
console.log(myGlobal); // 42
```

## 使用

- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明（含有子属性的）全局对象
- declare global 扩展全局变量
- declare module 扩展模块

## 声明文件

通常，在使用第三方库或模块时，有两种方式引入声明文件：

- 全局声明：如果第三方库或模块是全局可访问的，你可以在整个项目的任何地方直接使用它们，而无需显式导入。此时，你只需要确保在 TypeScript 项目中正确引入了相应的声明文件。一般情况下，TypeScript 会自动查找并加载全局声明文件。如果没有自动加载，你可以使用 `///` 的方式在具体的源文件中将声明文件引入。

- 模块导入：如果第三方库或模块是通过模块化方式提供的，你需要使用 import 语句将其导入到你的代码中，同时也需要确保相应的声明文件被正确引入。在这种情况下，你可以使用 import 或 require 来引入库，并且不需要显式地引入声明文件，因为 TypeScript 编译器会根据模块的导入语句自动查找和加载相应的声明文件。

有很多第三方库提供了声明文件，可以在 packages.json 文件中查看。types 表示类型声明文件是哪一个。

<img src="../imgs/103/22.webp" />

可以使用 @types 统一管理第三方库的声明文件。@types 的使用方式很简单，直接用 npm 安装对应的声明模块即可，以 jQuery 举例：

```sh
npm install @types/jquery --save-dev
```
