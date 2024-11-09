---
title: "重新学习 TypeScript 类型系统"
tag: "TypeScript"
time: 2024-11-09 13:03:12
---

很多开发者已经将 Typescript 加入到自己的项目里进行开发，初衷是为了项目在开发时拥有**类型检查能力**。 TypeScript 通过易上手且功能强大的类型系统，为 JavaScript 提供了强大的类型检查能力。在类型的帮助下，我们无需实际运行代码，就能通过类型的流转观察到变量的值是如何改变的。

但往往现实的情况是，随着增加的类型越来越多，类型报错越来越多，不得已改为 any 类型，或者增加 // @ts-ignore 注释，改各种类型报错的成本也超过其带来的收益。

在系统学习之后，才发现可能之前我们大多数人的学习思路限制了学习 Typescript 的进阶之路。

大家都听过一句话，**TS 是 JS 的超集**，所以自然而然会产生一种思维惯性，以 JS 为起点开始逐步学习 TS 的知识。但这样我们会忽略**TS 本身就是一门语言**这一事实。作为一门语言，`TS`有自己的语法规范，与`JS`相比：

- `TS`作为语言，操作的单位是**类型**，语法规范定义的是**类型之间的操作逻辑**，工作在编译时
- `JS`作为语言，操作的单位是**变量**，语法规范定义的是**变量之间的操作逻辑**，工作在运行时

如果我们只从`JS`出发，是可以理解`TS`与`JS`兼容的部分（类型部分）。但不兼容的部分（`TS`作为语言本身的语法规则）会成为我们进阶路上的绊脚石。

本文面向对 TypeScript 有一定基础语法知识认知的开发者，聚焦于其类型系统，将 Typescript 的强大类型编程功能进行介绍。

## 类型工具

在很多使用 TS 开发的项目里有时候能看到很多非常复杂的类型定义，这些类型往往没有那么浅显易懂，但再复杂的类型也是由所有基础的 ts 内置类型组成（本文不对 ts 的基础内置类型等进行介绍），这些内置类型实际上是最基础的“积木”，而想定义较为复杂实用的类型，就需要使用这些“积木”，再加上一些实用的类型工具。

### 类型别名

类型别名允许我们通过`type`关键字声明一个新的类型，是类型编程中最重要的一个功能，但使用起来并不复杂：

```ts
type Phone = number;
```

我们通过  `type`  关键字声明了类型别名 Phone，这个类型等价于 number 类型。类型别名的作用主要是对一组类型或一个特定类型结构进行封装，以便于在其它地方进行复用。

比如抽离一个函数类型：

```ts
type Handler = (e: Event) => void;

const clickHandler: Handler = (e) => {};
const moveHandler: Handler = (e) => {};
const dragHandler: Handler = (e) => {};
```

或者声明一个对象类型，就像`interface`

```ts
interface IObj = {
  name: string;
  age: number;
}
```

> 业界规范有一种写法是，在业务开发过程中，接口的命名可以以 I 开头，类型别名的命名可以使用 T 开头，以做区分（匈牙利命名法），当然现在很多是直接推崇都直接使用大驼峰命名法，具体看开发团队的规范喜好。

类型别名还能作为工具类型。工具类同样基于类型别名，只是多了个**泛型**。泛型将会在后边进行介绍。一旦接受了泛型，我们就叫它工具类型。

```ts
type Factory<T> = T | number | string;
```

现在类型别名摇身一变成了工具类型，但它的基本功能仍然是创建类型，只不过工具类型能够接受泛型参数，实现**更灵活的类型创建功能**。从这个角度看，工具类型就像一个函数一样，泛型是入参，内部逻辑基于入参进行某些操作，再返回一个新的类型。比如在上面这个工具类型中，我们就简单接受了一个泛型，然后把它作为联合类型的一个成员，返回了这个联合类型。

### 联合类型和交叉类型

- 联合类型：符号是  `|` ，代表了按位或，即只需要符合联合类型中的一个类型，可以认为实现了这个联合类型，如  `A | B` ，只需要实现 A 或 B 即可。
- 交叉类型：符号是  `&` ，代表了按位或，需要符合这里的所有类型，才可以说实现了这个交叉类型，即  `A & B` ，**需要同时满足 A 与 B 两个类型**才行。

交叉类型的例子如下：

```ts
interface NameStruct {
  name: string;
}

interface AgeStruct {
  age: number;
}

type ProfileStruct = NameStruct & AgeStruct;

const profile: ProfileStruct = {
  name: "xxxx",
  age: 18,
};

type StrAndNum = string & number; // never
```

而对于对象类型的交叉类型，其内部的同名属性类型同样会按照交叉类型进行合并：

```ts
type Struct1 = {
  primitiveProp: string;
  objectProp: {
    name: string;
  };
};

type Struct2 = {
  primitiveProp: number;
  objectProp: {
    age: number;
  };
};

type Composed = Struct1 & Struct2;

type PrimitivePropType = Composed["+primitiveProp"]; // never
type ObjectPropType = Composed["objectProp"]; // { name: string; age: number; }
```

### 索引类型

**索引签名类型**

索引签名类型主要指的是在接口或类型别名中，通过以下语法来**快速声明一个键值类型一致的类型结构**：

```ts
interface AllStringTypes {
  [key: string]: string;
}

type AllStringTypes = {
  [key: string]: string;
};

// 这时，即使你还没声明具体的属性，对于这些类型结构的属性访问也将全部被视为 string 类型
type PropType1 = AllStringTypes["666"]; // string
type PropType1 = AllStringTypes[333]; // string
```

在这个例子中我们声明的键的类型为 string ，这也意味着在实现这个类型结构的变量中**只能声明字符串类型的键。**

但由于 JavaScript 中，对于  `obj[prop]`  形式的访问会将**数字索引访问转换为字符串索引访问**，也就是说， `obj[100]`  和  `obj['100']`  的效果是一致的。因此，在字符串索引签名类型中我们仍然可以声明数字类型的键。类似的，symbol 类型也是如此：

```ts
const foo: AllStringTypes = {
  666: "777",
  333: "xxx",
  [Symbol("ddd")]: "symbol",
};
```

索引签名类型也可以和具体的键值对类型声明并存，但这时这些**具体的键值类型也需要符合索引签名类型的声明**。这里的符合即指子类型，自然包括了联合类型：

```ts
interface StringOrBooleanTypes {
  propA: number;
  propB: boolean;
  [key: string]: number | boolean;
}
```

索引签名类型的一个常见场景是在重构 JavaScript 代码时，为内部属性较多的对象声明一个 any 的索引签名类型，以此来暂时支持**对类型未明确属性的访问**，并在后续一点点补全类型：

```ts
interface AnyTypeHere {
  [key: string]: any;
}

const foo: AnyTypeHere["linbudu"] = "any value";
```

**索引类型查询**

索引类型查询使用到的是  `keyof`  操作符，它可以将对象中的所有键转换为对应字面量类型，然后再组合成联合类型。**这里并不会将数字类型的键名转换为字符串类型字面量，而是仍然保持为数字类型字面量**。

```ts
interface Foo {
  storm: 1;
  666: 2;
}

type FooKeys = keyof Foo; // "storm" | 666
// 在 VS Code 中悬浮鼠标只能看到 'keyof Foo'
// 看不到其中的实际值，你可以这么做：
type FooKeys = keyof Foo & {}; // "storm" | 666
```

<img src="../imgs/101/05.webp" />

除了应用在已知的对象类型结构上以外，你还可以直接  `keyof any`  来生产一个联合类型，它会由所有可用作对象键值的类型组成：`string | number | symbol`。也就是说，它是由无数字面量类型组成的，由此我们可以知道， **keyof 的产物必定是一个联合类型**。

**索引类型访问**

在 JavaScript 中我们可以通过  `obj[expression]`  的方式来动态访问一个对象属性（即计算属性），expression 表达式会先被执行，然后使用返回值来访问属性。而 TypeScript 中我们也可以通过类似的方式，只不过这里的 expression 要换成类型

```ts
interface NumberRecord {
  [key: string]: number;
}

type PropType = NumberRecord[string]; // number
```

这里跟 JavaScript 的区别是这里的访问方式与返回值均是**类型**。更直观的例子是通过字面量类型来进行索引类型访问：

```ts
interface Foo {
  propA: number;
  propB: boolean;
}

type PropAType = Foo["propA"]; // number
type PropBType = Foo["propB"]; // boolean
```

看到这肯定会想到，上面的 keyof 操作符能一次性获取这个对象所有的键的字面量类型，是否能用在这里？当然，这可是 TypeScript 啊。

```ts
interface Foo {
  propA: number;
  propB: boolean;
  propC: string;
}

type PropTypeUnion = Foo[keyof Foo]; // string | number | boolean
```

**索引类型示例**

如果想要获取一个对象给定属性名的值，为此，我们需要确保我们不会获取 obj 上不存在的属性。所以我们在两个类型之间建立一个约束

```ts
function getProp<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const person = {
  name: "张三",
  age: 18,
};

getProp(person, "name"); // 张三
getProp(person, "phone"); // TS 编译时会报错，因为 phone 不是person 的属性。
```

### 映射类型

与上边的索引类型包含好几个部分不同的是，映射类型指的是一个确切的类型工具——`in`关键字。比如定义一个工具类型，作用是一个接口的所有属性类型映射到 string：

```ts
type Stringify<T> = {
  [K in keyof T]: string;
};
```

这个工具类型会在接收一个对象的时候使用 keyof 获得这个对象类型的键名 组成字面量联合类型，然后通过映射类型（即这里的 in 关键字）将这个联合类型的每一个成员映射 出来，并将其键值类型设置为 string。

### 类型查询

TypeScript 提供了可以用于查询某个变量类型的关键字  `typeof`，与 JavaScript 返回一个类型字符串不同，它将返回的是具体类型：

```ts
const func = (input: string) => {
  return input.length > 10;
};

type Func = typeof func; // (input: string) => boolean
```

在逻辑代码中使用的 typeof 一定会是 JavaScript 中的 typeof，而类型代码（如类型标注、类型别名中等）中的一定是类型查询的 typeof 。同时，为了更好地避免这种情况，也就是**隔离类型层和逻辑层**，类型查询操作符后是不允许使用表达式的：

```ts
const isInputValid = (input: string) => {
  return input.length > 10;
}

// 不允许表达式
let isValid: typeof isInputValid("xxxx");
```

## 泛型

泛型是开发者在使用 TypeScript 过程中经常会用到的工具，声明了泛型坑位的类型别名就像一个接受参数的函数，为类型的声明提供了更多的可能：

```ts
type Factory<T> = T | number | string;
```

### 类型别名的泛型

1. 默认值：与声明一个参数的默认值相同，泛型也同样有着**默认值**的设定，比如：

```ts
type Factory<T = boolean> = T | number | string;
// 这样在你调用时就可以不带任何参数了，默认会使用我们声明的默认值来填充。
const foo: Factory = false;
```

2. 约束：在泛型中，我们可以使用  `extends`  关键字来**约束**传入的泛型参数必须符合要求。关于 extends，`A extends B`  意味着  **A 是 B 的子类型**，这里我们暂时只需要了解非常简单的判断逻辑，也就是说 A 比 B 的类型更精确，或者说更复杂。具体来说，可以分为以下几类。

- 更精确，如**字面量类型是对应原始类型的子类型**，即  `'storm' extends string`，`666 extends number`  成立。类似的，**联合类型子集均为联合类型的子类型**，即  `1`、 `1 | 2`  是  `1 | 2 | 3 | 4`  的子类型。
- 更复杂，如  `{ name: string }`  是  `{}`  的子类型，因为在  `{}`  的基础上增加了额外的类型，基类与派生类（父类与子类）同理。

```ts
type ResStatus<ResCode extends number> = ResCode extends 10000 | 10001 | 10002
  ? "success"
  : "failure";

// 这个例子会根据传入的请求码判断请求是否成功，这意味着它只能处理数字字面量类型的参数，因此这里我们通过 extends number 来标明其类型约束，如果传入一个不合法的值，就会出现类型错误：

type Res1 = ResStatus<10000>; // "success"
type Res2 = ResStatus<20000>; // "failure"

type Res3 = ResStatus<"10000">; // 类型“string”不满足约束“number”。
```

### 对象类型与函数中的泛型

基于泛型提供的对类型结构的复用能力，对象类型结构也经常出现泛型的使用，比如响应类型结构的泛型处理：

```ts
interface IRes<TData = unknown> {
  code: number;
  error?: string;
  data: TData;
}

// 这个接口描述了一个通用的响应类型结构，
// 预留出了实际响应数据的泛型坑位，然后在你的请求函数中就可以传入特定的响应类型了：

interface IUserProfileRes {
  name: string;
  homepage: string;
  avatar: string;
}

function fetchUserProfile(): Promise<IRes<IUserProfileRes>> {}

type StatusSucceed = boolean;
function handleOperation(): Promise<IRes<StatusSucceed>> {}
```

而在函数中，有时候我们会有一个处理数据的函数，他可以接收多个类型的参数进行对应不同的处理，比如：

- 对于字符串，返回部分截取；
- 对于数字，返回它的 10 倍；
- 对于对象，修改它的属性并返回。免翻官方 ChatGPT 4.0 和 Claude Pro，稳定有售后

如果用联合类型来包括所有可能类型去声明：

```ts
function handle(input: string | number | {}): string | number | {} {}
```

这里虽然我们约束了入参的类型，但返回值的类型并没有像我们预期的那样和入参关联起来，上面三个调用结果的类型仍然是一个宽泛的联合类型  `string | number | {}`。

这个时候，使用泛型就可以很好的进行入参与返回值的类型关联了：

```ts
function handle<T>(input: T): T {}
```

这里函数在接收到参数时，T 会自动地被填充为这个实参的类型，也就意味着我们不用预先确定参数的可能类型了。

## 结构化类型系统

```ts
class Cat {
  eat() {}
}

class Dog {
  eat() {}
}

function feedCat(cat: Cat) {}

feedCat(new Dog());
```

以上的代码乍一看不对，但在 TypeScript 中其实是可以正常运行的。这就是 TypeScript 的类型系统特性：**结构化类型系统**。TypeScript 比较两个类型并非通过类型的名称（即  `feedCat`  函数只能通过 Cat 类型调用），而是比较这两个类型上实际拥有的属性与方法。也就是说，这里实际上是**比较 Cat 类型上的属性是否都存在于 Dog 类型上**。如果这里的 Cat 类存在着 Dog 类上没有的独特方法或者属性，则会在接收 Dog 实例对象的时候报错。

你可能听过结构类型的别称**鸭子类型（Duck Typing）**，这个名字来源于**鸭子测试（Duck Test）**。其核心理念是，**如果你看到一只鸟走起来像鸭子，游泳像鸭子，叫得也像鸭子，那么这只鸟就是鸭子**。

如果为 Dog 加一个独特方法：

```ts
class Cat {
  eat() {}
}

class Dog {
  bark() {} // 独特方法
  eat() {}
}

function feedCat(cat: Cat) {}

feedCat(new Dog());
```

这个时候不会发生报错这是因为，结构化类型系统认为 Dog 类型完全实现了 Cat 类型。至于额外的方法  `bark`，可以认为是 Dog 类型继承 Cat 类型后添加的新方法，即此时 Dog 类可以被认为是 Cat 类的子类。同样的，面向对象编程中的里氏替换原则也提到了鸭子测试：_**如果它看起来像鸭子，叫起来也像鸭子，但是却需要电池才能工作，那么你的抽象很可能出错了。**_

严格来说，鸭子类型系统和结构化类型系统并不完全一致，结构化类型系统意味着**基于完全的类型结构来判断类型兼容性**，而鸭子类型则只基于**运行时访问的部分**来决定。也就是说，如果我们调用了走、游泳、叫这三个方法，那么传入的类型只需要存在这几个方法即可（而不需要类型结构完全一致）。但由于 TypeScript 本身并不是在运行时进行类型检查（也做不到），同时官方文档中同样认为这两个概念是一致的，因此我们可以直接认为两者是同一概念。

## 类型系统层级

本文前边的内容多多少少有涉及到 TypeScript 的类型兼容性问题，这里边涉及到子类型  `subtype`、父类型  `supertype`  的概念。那么 TypeScript 的类型系统层级是怎么样定义的呢？这个问题将在本节进行分析。

在代码中判断类型兼容性主要使用条件类型判断，比如：

```ts
type Result = "xxx" extends string ? 1 : 2;
```

也可以通过赋值来进行兼容性检查：

```ts
declare let source: string;
declare let anyType: any;
declare let neverType: never;

anyType = source;

// 不能将类型“string”分配给类型“never”。
neverType = source;
```

可赋值性  `assignable`  是类型系统中很重要的一个概念，当你把一个变量赋值给另一个变量时，就要检查这两个变量的类型之间是否可以相互赋值。

如果 a = b 成立，即意味着  `<变量 b 的类型> extends <变量 a 的类型>`  成立，这个赋值是安全的，即 b 类型是 a 类型的子类型

### 最底层类型

从下至上，在 TypeScript 中最底层的类型是  `never`，它代表了一个根本不存在的类型，对于这个类型他是任何类型的子类型，也包括了各种字面量类型：

```ts
type Rusult = never extends "xxx" ? 1 : 2; // 1
```

对于不存在的类型，我们可能会想到一些特殊的类型，比如 null、undefined、void，但在 TypeScript 中，void、undefined、null 都是**切实存在、有实际意义的类型**，它们和 string、number、object 并没有什么本质区别。

```ts
type Result1 = undefined extends "xxx" ? 1 : 2; // 2
type Result2 = null extends "xxx" ? 1 : 2; // 2
type Result3 = void extends "xxx" ? 1 : 2; // 2
```

### 原始类型与联合类型

最底层类型往上就是我们经常接触的原始类型了，一个基础类型和它们对应的字面量类型必定存在父子类型关系，同时对于类型 object，它代表着所有非原始类型的类型，即数组、对象与函数类型。

```ts
type Result1 = "xxx" extends string ? 1 : 2; // 1
type Result2 = 1 extends number ? 1 : 2; // 1
type Result3 = true extends boolean ? 1 : 2; // 1
type Result4 = { name: string } extends object ? 1 : 2; // 1
type Result5 = { name: "xxx" } extends object ? 1 : 2; // 1
type Result6 = [] extends object ? 1 : 2; // 1
```

联合类型的定义是只要实现其中一个类型，就可以认为实现了这个联合类型，同样对于原始类型和联合类型的比较也是一样的：

```ts
type Result1 = string extends string | false | number ? 1 : 2; // 1
```

如果一个联合类型由同一个基础类型的类型字面量组成，那与该原始类型也存在父子关系：

```ts
type Result1 = "aa" | "bb" | "cc" extends string ? 1 : 2; // 1
type Result2 = {} | (() => void) | [] extends object ? 1 : 2; // 1
```

**结论：**

1. 字面量类型 < 包含此字面量类型的联合类型，原始类型 < 包含此原始类型的联合类型
2. 同一基础类型的字面量联合类型 < 此基础类型。

### 装箱类型

这个类型层级关系也比较易懂，原始类型是其装箱类型的子类型，比如 string 类型会是 String 类型的子类型，同时 String 类型会是 Object 类型的子类型。

我们看个比较特殊的例子 ：

```ts
type Result = String extends {} ? 1 : 2; // 1
```

看起来是比较奇怪的，`{}`  是 object 的字面量类型，为什么 String 会是他的子类型？那在 TypeScript 中我们可以把 String 看作一个普通的对象（继承了  `{}`  这个空对象），同时有着一些独特的方法，那么在结构化类型系统的比较下，**String 会被认为是** **`{}`** **的子类型**。

需要注意的一点是 ⚠️：`{}`  是 object 的字面量类型，从前文我们可知  `{}`  是 objcet 的子类型，看起来这就构建起了`string < {} < object`  这个类型链，但实际上  `string extends object`  并不成立：

```ts
type Result = string extends object ? 1 : 2; // 2
```

由于结构化类型系统的存在，TypeScript 中存在着一些看着不符合直觉的类型关系：

```ts
type Result1 = {} extends object ? 1 : 2; // 1
type Result2 = object extends {} ? 1 : 2; // 1

type Result3 = object extends Object ? 1 : 2; // 1
type Result4 = Object extends object ? 1 : 2; // 1

type Result5 = Object extends {} ? 1 : 2; // 1
type Result6 = {} extends Object ? 1 : 2; // 1
```

- `{} extends object`  和  `{} extends Object`  意味着， `{}`  是 object 和 Object 的字面量类型，是从**类型信息的层面**出发的，即**字面量类型在基础类型之上提供了更详细的类型信息**。
- `object extends {}`  和  `Object extends {}`  则是从**结构化类型系统的比较**出发的，即  `{}`  作为一个一无所有的空对象，几乎可以被视作是所有类型的基类，万物的起源。
- 而  `object extends Object`  和  `Object extends object`  这两者的情况就要特殊一些，它们是因为“系统设定”的问题，Object 包含了所有除 Top Type 以外的类型（基础类型、函数类型等），object 包含了所有非原始类型的类型，即数组、对象与函数类型，这就导致了你中有我、我中有你的神奇现象。

结论：只关注从类型信息层面出发部分的话，即  **原始类型 < 原始类型对应的装箱类型 < Object 类型**

### 顶层类型

再往上就到了类型层级的顶端，在这里只有 any 和 unknow ，这两个类型是系统中设定为 Top Type 的两个类型，所有的类型都会是这两个类型的子类型。那么如果他们和其他类型进行比较呢：

```ts
type Result1 = any extends Object ? 1 : 2; // 1 | 2
type Result2 = unknown extends Object ? 1 : 2; // 2
```

可以看到 any 的比较结果是不太一样的，和其他类型的比较也是：

```ts
type Result3 = any extends "xxx" ? 1 : 2; // 1 | 2
type Result4 = any extends string ? 1 : 2; // 1 | 2
type Result5 = any extends {} ? 1 : 2; // 1 | 2
type Result6 = any extends never ? 1 : 2; // 1 | 2
```

any 代表了任何可能的类型，当我们使用  `any extends`  时，它包含了“**让条件成立的一部分**”，以及“**让条件不成立的一部分**”。而从实现上说，在 TypeScript 内部代码的条件类型处理中，如果接受判断的是 any，那么会直接**返回条件类型结果组成的联合类型**。

any 类型和 unknown 类型的比较也是互相成立的：

```ts
type Result31 = any extends unknown ? 1 : 2; // 1
type Result32 = unknown extends any ? 1 : 2; // 1
```

## 函数类型：协变与逆变

协变与逆变是一个计算机科学中的概念，先看下维基百科的定义：

> 协变与逆变（Covariance and contravariance）是在计算机科学中，描述具有父/子型别关系的多个型别通过型别构造器、构造出的多个复杂型别之间是否有父/子型别关系的用语。

光看概念还是非常晦涩难懂的，我们还是得结合实际场景分析后去理解具体的含义。但这个时候就会有疑问？我们不是在了解 TypeScript 类型系统吗，为什么会涉及到协变与逆变的概念呢？

先抛开具体概念，在上节对类型系统层级进行了解后，我们其实遗漏了函数类型的层级对比，这背后的理论——协变与逆变，将会在我们的具体比较中体现。

### 函数类型比较

我们定义三个具有层级关系的类，分别代表动物、狗、柯基：

```ts
class Animal {
  asPet() {}
}

class Dog extends Animal {
  bark() {}
}

class Corgi extends Dog {
  cute() {}
}
```

对于以下一个接受 Dog 类型参数并返回 Dog 类型的函数，我们表示为 `Dog -> Dog`

```ts
type DogFactory = (args: Dog) => Dog;
```

为了更好的去比较函数类型层级，我们引入一个辅助函数，这个辅助函数收一个 `Dog -> Dog` 类型的参数：

```ts
function transformDogAndBark(dogFactory: DogFactory) {
  const dog = dogFactory(new Dog());
  dog.bark();
}
```

在上一节类型系统层级中我们提到可以通过赋值来比较两个类型的层级关系，**如果一个值能够被赋值给某个类型的变量，那么可以认为这个值的类型为此变量类型的子类型**，以此类推我们来进行函数类型的层级对比。

这个辅助函数会接收一个 Dog -> Dog 类型的参数方法 ，通过这个方法实例化一只狗狗，并传入 Factory（可以理解为给宠物美容一下），然后让它叫唤两声。这个函数的定义很好的同时约束了此类型的参数与返回值。那么我们针对这两个约束进行检查，考量将 Animal、Dog、Corgi 这三个类进行排列组合得到的九种函数签名类型：

- `Animal -> Animal`
- `Animal -> Dog`
- `Animal -> Corgi`
- `Dog -> Dog`
- `Dog -> Animal`
- `Dog -> Corgi`
- `Corgi -> Animal`
- `Corgi -> Dog`
- `Corgi -> Corgi`

这里不包括  `Dog -> Dog`，因为我们要用它作为基础来被比较，对于这两条约束依次进行检查：

- 对于  `Animal/Dog/Corgi -> Animal`  类型，无论它的参数类型是什么，它的返回值类型都是不满足条件的。因为它返回的不一定是**合法的狗**狗，即我们说它不是  `Dog -> Dog`  的子类型。
- 对于  `Corgi -> Corgi`  与  `Corgi -> Dog`，其返回值满足了条件，但是参数类型又不满足了。这两个类型**需要接受 Corgi 类型**，可能内部需要它**腿短**的这个特性。但我们可没说一定会传入柯基，如果我们传个德牧，程序可能就崩溃了。
- 对于  `Dog -> Corgi`、`Animal -> Corgi`、`Animal -> Dog`，首先它们的参数类型正确的满足了约束，能**接受一只狗狗**。其次，它们的返回值类型也一定会能**汪汪汪（狗狗类的方法）**。

而实际上，如果我们去掉了包含  `Dog`  类型的例子，会发现只剩下  `Animal -> Corgi`  了，也即是说，`(Animal → Corgi) ≼ (Dog → Dog)`  成立（`A ≼ B`  意为 A 为 B 的子类型）。

可以这样简单理解：

- 想要在使用这个函数的时候传入  `Dog`，那么对于型参类型更宽泛的  `Animal`  来说，他可以接受传入一个范围更为精准的  `Dog`
- 在需要返回  `Dog`  类型的情况下，允许返回基于  `Dog`  的子类型  `Corgi`，他也具备  `Dog`  类型拥有的一切

观察以上对比过程后的结论是：

- 参数类型**允许**为 Dog 的父类型，**不允许**为 Dog 的子类型。
- 返回值类型**允许**为 Dog 的子类型，**不允许**为 Dog 的父类型。

### 协变与逆变

- 考虑  `Corgi ≼ Dog`, 根据上面的比较结果对**返回值**类型进行替换，有  `(T → Corgi) ≼ (T → Dog)`，也即是说，在我需要狗狗的地方，柯基都是可用的。即不考虑参数类型的情况，在包装为函数签名的返回值类型后，其子类型层级**关系保持一致**。我们称之为**协变**。
- 考虑  `Dog ≼ Animal`，根据上面的比较结果对**参数**类型进行替换，则有  `(Animal -> T) ≼ (Dog -> T)`，也即是说，在我需要条件满足是动物时，狗狗都是可用的。即不考虑返回值类型的情况，在包装为函数签名的参数类型后，其子类型**层级关系发生了逆转**。我们称为**逆变**。

这就是 TypeScript 中的**协变（ covariance）**  与**逆变（ contravariance ）**  在函数签名类型中的表现形式。使用几何学领域的定义去理解就十分形象：**随着某一个量的变化，随之变化一致的即称为协变，而变化相反的即称为逆变。**

用 TypeScript 的思路进行转换，即如果有  `A ≼ B` ，协变意味着  `Wrapper ≼ Wrapper`，而逆变意味着  `Wrapper ≼ Wrapper`。而在这里的示例中，**变化（Wrapper）即指从单个类型到函数类型的包装过程**、

在 TypeScript 中，由于灵活性等权衡，对于函数参数默认的处理是  `双向协变`  的。也就是同时允许以下两种情况。

- `(Dog -> T) ≼ (Corgi -> T)`
- `(Dog -> T) ≼ (Animal -> T)`

在开启了  `tsconfig`  中的  `strictFunctionType`  后才会严格按照  `逆变`  来约束赋值关系。

strictFunctionTypes  这一项配置，在文档中的描述相对简略：**在比较两个函数类型是否兼容时，将对函数参数进行更严格的检查**（_When enabled, this flag causes functions parameters to be checked more correctly_），而实际上，这里的更严格指的即是  **对函数参数类型启用逆变检查**

### 各类型的逆变协变

在 TypeScript 中，协变和逆变主要应用于泛型类型（如数组、Promise、Set、Map、Record 等）以及函数类型。下面是这些类型的协变和逆变特性的概述：

1. 数组 (`Array`)

   协变：TypeScript 中的数组默认是协变的。如果类型  `A`  是类型  `B`  的子类型，那么  `Array<A>`  也可以视为  `Array<B>`  的子类型。

2. Promise (`Promise`)

   协变：Promise 同样是协变的。如果类型  `A`  是类型  `B`  的子类型，那么  `Promise<A>`  可以被赋值给  `Promise<B>`  的引用。

3. Set (`Set`)

   协变：Set 在 TypeScript 中也是协变的。如果类型  `A`  是类型  `B`  的子类型，那么  `Set<A>`  可以被视为  `Set<B>`  的子类型。

4. Map (`Map`)

   协变：Map 的值 (`V`) 是协变的，如果类型  `V1`  是类型  `V2`  的子类型，那么  `Map V1`  可以被视为  `Map V2`  的子类型。

   键 (`K`) 不是协变也不是逆变的。键必须保持精确匹配，不能以子类型或超类型替代。

5. Record (`Record`)

   协变：Record 的值 (`T`) 是协变的。如果类型  `A`  是类型  `B`  的子类型，那么  `Record<T,A>`  可以被视为  `Record<T,B>`  的子类型。

6. 函数 (`Function`)

   参数类型（逆变）：在启用  `--strictFunctionTypes`  标志时，函数参数是逆变的。如果类型  `A`  是类型  `B`  的子类型，那么  `(b: B) => void`  可以视为  `(a: A) => void`  的子类型。这是因为一个接受更通用类型  `B`  的函数可以安全地处理类型  `A`  的实例。

   返回类型（协变）：函数的返回类型是协变的。如果类型  `A`  是类型  `B`  的子类型，那么  `() => A`  可以视为  `() => B`  的子类型。

特别地，对于函数类型，参数位置是逆变的而返回值位置是协变的。这意味着在参数位置上，我们可以使用更通用的（父类型）来替代，而在返回值位置上，我们可以使用更具体的（子类型）来替代。
