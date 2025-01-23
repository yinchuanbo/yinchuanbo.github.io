---
title: "TypeScript 的进阶详解"
tag: "Vue"
time: 2025-01-23 16:19:23
---

## TypeScript 类的使用

TypeScript 同样支持使用 class 关键字，并且可以对类的属性和方法等进行静态类型检测。然而，在 JavaScript 开发中，更倾向于使用函数式编程。

### 类的定义

在面向对象编程中，类是描述一切事物的基础，包括特有的属性和方法。

具体的类定义方式如下：

- 通常使用 class 关键字来定义类

- 类内部可以声明各种属性，包括类型声明和初始值设定。

  - 如果没有类型声明，则默认为 any 类型

  - 属性可以有初始化值

  - 在默认的 strictPropertyInitialization 模式下，属性必须初始化，否则编译时会报制

- 类可以有自己的构造函数 constuctor，当使用 new 关键字创建实例时，构造函数会被调用。另外，构造函数不需要返回任何值，它默认返回当前创建的实例。

- 类可以有自己的函数，这些函数称为方法

```ts
class Person {
  name: string = "coder";
  age: number = 18;
  eating() {
    console.log(this.name + " eating");
  }
}

const p = new Person();
p.eating();
```

> 需要注意的是: 在 TypeScript 中定义类的属性没有初始化值会报错。

其实，上述代码是存在缺陷的，比如创建了多个 Person 对象，每个对象的 name 和 age 初始值都一样。这样显然不符合我们的需求，这时可以将属性初始化的过程放到构造器中，

```ts
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  eating() {
    console.log(this.name + " eating");
  }
}

const p = new Person("why", 18);
p.eating();
```

### 类的继承

继承不仅可以减少代码量，而且是多态的使用前提。

在 Javascript 中，使用 extends 关键字实现继承，然后在子类中使用 super 访问父类。

```ts
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  eating(): void {
    console.log(this.name + " eating");
  }
}

class Student extends Person {
  sno: number;
  constructor(name: string, age: number, sno: number) {
    super(name, age); // super 调用父类的构造器
    this.sno = sno;
  }
}

const stu = new Student("why", 18, 10100);
console.log(stu.name, stu.age);
stu.eating();
```

可以看到，在定义 Student 类时，使用 extends 关键字继承 Person 类，这样 Student 类可以拥有自己的属性和方法，也会继承 Person 的属性和方法。在 Student 构造器中，可以使用 super 关键字调用父类的构造方法，对父类中的属性进行初始化。

在实现类的继承时，也可以在子类中对父类的方法进行重写。比如，Student 类可以重写 Person 类中的 eating 方法，

```ts
class Student extends Person {
  sno: number;
  constructor(name: string, age: number, sno: number) {
    super(name, age); // super 调用父类的构造器
    this.sno = sno;
  }
  eating() {
    console.log("student eating");
    super.eating(); // super 调用父类的 eating 方法
  }
}
```

### 类的多态

面向对象编程中的三大特性是：封装、继承和多态。

作者对多态的理解是：**不同的数据类型在进行同一个操作时表现出不同的行为，这就是多态的体现**。

```ts
class Animal {
  action() {
    console.log("animal action");
  }
}

// 继承是多态的前提
class Dog extends Animal {
  // 子类重写父类的 action 方法
  action() {
    console.log("dog running!!!");
  }
}

class Fish extends Animal {
  action() {
    console.log("fish running!!!");
  }
}

// 多态是为了写出更具通用性的代码
function makeActions(animals: Animal[]) {
  animals.forEach((animal) => {
    animal.action(); // 调用子类的 action 方法
  });
}

makeActions(new Dog(), new Fish());
```

当调用 animal.action 方法时，实际上调用的是子类的 action 方法。这就是多态的体现，**对不同的数据类型进行同一个操作时，表现出不同的行为**。

### 成员修饰符

在 TypeScript 中，可以使用三种修饰符来控制类的属性和方法的可见性，分别是 public、private 和 protected.

- public: 默认的修饰符，它表示属性或方法是公有的，可以在类的内部和外部被访问。

- private: 表示属性或方法是私有的，只能在类的内部被访问，外部无法访问。

- protected: 表示属性或方法是受保护的，只能在类的内部及其子类中被访问，外部无法访问。

> 使用 private 和 protected 修饰符可以增强类的封装性，避免属性和方法被外部访问和修改。

**1. private 修饰符**

```ts
class Person {
  private name: string = "";
  getName() {
    return this.name;
  }
  setName(newName) {
    this.name = newName;
  }
}

const p = new Person();
// console.log(p.name); // 直接访问私有属性 name 会报错
console.log(p.getName()); // ok
p.setName("why"); // ok
```

**2. protected 修饰符**

```ts
class Person {
  protected name: string = "123"; // protected 的属性，在类内部和子类中可以访问
}

class Student extends Person {
  getName() {
    return this.name; // 子类可以访问父类的 protected 属性
  }
}

const stu = new Student();
console.log(stu.name); // 直接访问受保护的 name 属性会报错
console.log(stu.getName()); // ok
```

### 只读属性

如果我们不希望外部随意修改某一个属性，而是希望在确定值后直接使用，那么可以使用 readonly 。

```ts
type FriendType = {
  name: string;
};

class Person {
  // 只读属性可以在构造器中赋值，赋值之后就不可以修改
  readonly name: string;
  // 属性本身不能进行修改，但如果它是对象类型的，则对象中的属性可以修改
  readonly friend?: FriendType;
}
```

[未完大修]