---
title: "Symbol 类型"
tag: "高级程序设计"
---

Symbol（符号） 是原始值，且符号实例是唯一的、不可改变的。

符号的用途是确保对象属性使用唯一标识符，不会发生属性冲突的危险。

## 1. 符号的基本用法

```js
let sym = Symbol();
console.log(typeof sym); // "symbol"
```

调用 `Symbol()` 函数时，也可以传入一个字符串参数作为符号的描述。将来可以通过这个字符串来调试代码，但是，这个字符串参数与符号定义或标识完全无关。

```js
let genercSymbol = Symbol();
let otherGenercSymbol = Symbol();

let fooSymbol = Symbol("foo");
let otherFooSymbol = Symbol("foo");

console.log(genercSymbol == otherGenercSymbol); // false
console.log(fooSymbol == otherFooSymbol); // false
```

`Symbol()` 函数不能作为构造函数，与 new 关键字一起使用。

```js
let myBoolean = new Boolean();
console.log(typeof myBoolean); // "object"

let myString = new String();
console.log(typeof myString); // "object"

let myNumber = new Number();
console.log(typeof myNumber); // "object"

let mySymbol = new Symbol(); // TypeError: Symbol is not a constructor
```

如果你确定想使用符号包装对象，可以借用 `Object()` 函数：

```js
let mySymbol = Symbol();
let myWrappedSymbol = Object(mySymbol);
console.log(typeof myWrappedSymbol); // "object"
```

## 2. 使用全局符合注册表

如果运行时的不同部分需要共享和重用符合实例，那么可以用一个字符串作为键，在全局符号注册表中创建并重用符号。

为此，需要使用 `Symbol.for()` 方法

```js
let fooGlobalSymbol = Symbol.for("foo");
console.log(typeof fooGlobalSymbol); // symbol
```

`Symbol.for()` 对每个字符串键都执行幂等操作，第一次使用某个字符串调用时，它会检查全局运行时注册表，发现不存在对应的符号，于是就会生成一个新符号实例并添加到注册表中。

后续使用相同字符串的调用同样会检查注册表，发现存在与该字符串对应的符号，然后就会返回该字符串实例。

```js
let fooGlobalSymbol = Symbol.for("foo");
let otherFooGlobalSymbol = Symbol.for("foo");
console.log(fooGlobalSymbol === otherFooGlobalSymbol); // true
```

即使采用相同的符号描述，在全局注册表中定义的符号跟使用 `Symbol()` 定义的符号也并不等同：

```js
let localSymbol = Symbol("foo");
let globalSymbol = Symbol.for("foo");
console.log(localSymbol === globalSymbol); // false
```

全局注册表中的符号必须使用字符串键来创建，因此作为参数传给 `Symbol.for()` 的任何值都会被转换为字符串，此外，注册表中使用的键同时也会被用作符号描述。

```js
let emptyGlobalSymbol = Symbol.for();
console.log(emptyGlobalSymbol); // Symbol(undefined)
```
