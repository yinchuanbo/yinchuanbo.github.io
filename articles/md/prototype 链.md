---
title: "prototype 链"
tag: "面向对象"
---

在 JavaScript 的世界里,原型(prototype)系统是一个常被讨论但不易掌握的概念。作为 JavaScript 继承模型的基石,理解原型对于构建大型应用或进行对象操作至关重要。让我们一起探索这个迷人的话题,揭开原型系统的神秘面纱。

## 什么是原型?

在 JavaScript 中,每个对象都有一个内部属性`[[Prototype]]`。这个属性指向另一个对象,我们称之为原型。原型就像一个模板,对象从中继承属性和方法。

当我们尝试访问一个对象的属性或方法时,JavaScript 首先在对象本身查找。如果没有找到,它会沿着原型链向上查找,直到找到该属性或达到原型链的顶端(null)。

我们通过一个简单的例子来理解这个过程:

```js
const animal = {
  makeSound: function () {
    console.log("Some generic animal sound");
  },
};

const dog = Object.create(animal);
dog.bark = function () {
  console.log("Woof!");
};

dog.makeSound(); // 输出: "Some generic animal sound"
dog.bark(); // 输出: "Woof!"
```

在这个例子中,`dog`对象继承了`animal`的`makeSound`方法,同时拥有自己的`bark`方法。

## 创建对象与原型

我们深入了解对象创建时原型是如何链接的:

```js
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}`);
};

const alice = new Person("Alice");
alice.greet(); // 输出: "Hello, I'm Alice"
```

这里发生了什么?

1. `Person`是一个构造函数。
2. 当我们使用`new`关键字创建`Person`的实例时,JavaScript 创建了一个新对象(`alice`),并将其\[\[Prototype\]\]链接到`Person.prototype`。
3. 当调用`alice.greet()`时,JavaScript 首先在`alice`对象上查找`greet`方法。没有找到,所以它沿着原型链查找,在`Person.prototype`上找到并执行了这个方法。

## 原型链与继承

JavaScript 通过原型实现继承。与传统的类继承不同,JavaScript 对象直接从其他对象继承。这被称为"原型继承"。让我们扩展前面的例子来演示继承:

```js
function Developer(name, language) {
  Person.call(this, name);
  this.language = language;
}

Developer.prototype = Object.create(Person.prototype);
Developer.prototype.constructor = Developer;

Developer.prototype.code = function () {
  console.log(`${this.name} is coding in ${this.language}`);
};

const bob = new Developer("Bob", "JavaScript");
bob.greet(); // 输出: "Hello, I'm Bob"
bob.code(); // 输出: "Bob is coding in JavaScript"
```

在这个例子中:

1. 我们使用`Object.create(Person.prototype)`创建了`Developer.prototype`,确保`Developer`实例继承自`Person.prototype`。
2. 我们重置了`Developer.prototype.constructor`,使其指向`Developer`函数。
3. `bob`现在可以访问从`Person.prototype`继承的`greet`方法和定义在`Developer.prototype`上的`code`方法。

## 原型方法与属性遮蔽

当直接在对象上添加一个属性或方法时,它会遮蔽原型链中同名的属性或方法:

```js
bob.greet = function () {
  console.log("Hi, I'm a developer!");
};

bob.greet(); // 输出: "Hi, I'm a developer!"
```

在这个例子中,直接定义在`bob`上的`greet`方法覆盖了从`Person.prototype`继承的方法。

## 修改原型的风险

虽然可以修改内置原型如`Array.prototype`或`Object.prototype`,但这通常是不推荐的做法。这可能导致不可预知的行为和与其他代码的冲突。
