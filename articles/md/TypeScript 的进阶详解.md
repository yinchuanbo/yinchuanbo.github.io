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
  constructor(name: string, friend?: FriendType) {
    this.name = name;
    this.friend = friend;
  }
}

const p = new Person("why", { name: "kobe" });
// p.name = "kobe"; // error 直接修改只读的 name 会报错
p.friend = { name: "evan" }; // 直接修改只读的 friend 会报错
if (p.friend) {
  p.friend.name = "evan"; // ok 可以修改对象中的属性
}
```

> 可以看到，只读属性在外界是不能被修改的，但是可以在构造器中赋值，赋值之后也不可以修改。

> 另外，如果只读属性是对象类型，那么对象中的属性是可以修改的。

### getter/setter

对于一些私有属性，我们不能直接访问，或者对于某些属性，我们想要监听其获取和设置的过程。这时，可以使用 getter 和 setter 访问器。

```ts
class Person {
  private _name: string; // 私有属性一般习惯以下画线开头命名
  constructor(name: string) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
  set name(newName) {
    this._name = newName;
  }
}
const p = new Person("why");
p.name = "kobe"; // ok 调用 setter 访问器为 name 设置值
console.log(p.name); // ok 调用 getter 访问器获取 name 的值
```

### 静态成员

在类中定义的属性和方法都属于对象级别的。但在开发中，有时也需要定义类级别的属性和方法，也就是类的静态成员。在 TypeScript 中，可以使用关键字 static 来定义类的静态成员

```ts
class Person {
  static time: string = "2022-01-01";
  static print() {
    console.log("print");
  }
}
Person.time; // ok 访问静态属性
Person.print(); // ok 调用静态方法
```

### 抽象类

在面向对象编程中，继承和多态是密切相关的。为了定义通用的调用接口，我们通常会让调用者传入父类，通过多态实现要加灵活的调用方式。父类本身可能不需要对某些方法进行具体实现，这时可以将这些方法定义为抽象方法。

抽象方法是指没有具体实现的方法，即没有方法体。

在 TypeScript 中，抽象方法必须存在于抽象类中。抽象类使用 abstract 关键字声明，包含抽象方法的类就称为抽象类。

```ts
// 抽象类 Shape
abstract class Shape {
  abstract getArea(): number; // 抽象方法，没有具体实现
}

// 继承抽象类 Shape
class Rectangle extends Shape {
  private width: number;
  private height: number;
  constructor(width: number, height: number) {
    super(); // 在类的继承中，构造器必须调用 super 函数
    this.width = width;
    this.height = height;
  }
  // 实现抽象类中的 getarea 抽象方法
  getArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  private radius: number;
  constructor(radius: number) {
    super();
    this.radius = radius;
  }
  // 实现抽象类中的 getArea 抽象方法
  getArea() {
    return this.radius * this.radius * Math.PI;
  }
}

function makeArea(shape: Shape) {
  return shape.getArea(); // 多态的应用
}

const r = new Rectangle(10, 20);
const c = new Circle(5);
console.log(makeArea(r)); // 200
console.log(makeArea(c)); // 78.53981633974483
```

可以看到，抽象类 Shape 具有以下特点:

- Shape 抽象类不能被实例化，也就是说，无法通过 new 关键字创建对象。

- Shape 中的 getArea 抽象方法必须由子类 Rectangle 和 Circle 实现，否则该类必须也是一个抽象类。

### 类作为数据类型使用

类不仅可以用于创建对象，还可以用作一种数据类型。

```ts
class Person {
  name: string = "coder";
  eating() {}
}

const p = new Person();

// 类作为一种数据类型使用
const p1: Person = {
  name: "why",
  eating() {},
};

// 类作为数据类型使用
function printPerson(p: Person) {
  console.log(p.name);
}

printPerson(new Person());
printPerson({
  name: "kobe",
  eating() {},
});
```

## TypeScript 接口的使用

面向对象编程具有封装、继承、多态三大特性，而接口是封装实现的最重要的概念之一。

- 接口是在应用程序中定义一种约定的结构，在定义时要遵循类的语法。

- 从接口派生的类必须遵循其接口提供的结构，并且 TypeScript 编译器不会将接口转换为 JavaScript。

- 接口是用关键字 interface 定义的，并将 class 改成 interface；格式为 `interface 接口名 { .... }`

- 接口中的功能没有具体实现，接口不能实例化，也不能使用 new 关键字创建对象

### 接口的声明

```ts
// 方式一：通过类型别名 type 声明对象类型
type IInfoType = {
  readonly name: string;
  age?: number;
  height: number;
};

// 方式二：通过接口 interface 声明对象类型
interface IInfo {
  readonly name: string;
  age?: number;
  height: number;
}

// 指定对象类型
const info: IInfo = {
  name: "why",
  age: 18,
  height: 1.88,
};

// info.name = "123"; // 只读属性不能修改
info.age = 19; // 可选属性可以修改
```

> 以看到，这里使用两种方式声明对象类型，这两种方式只是语法不一样，但动能相同

### 索引类型

使用 interface 定义对象类型时，要求对象的属性名、方法以及类型都是确定的。

但有时会遇到一些特殊情况，例如所有的 key 或者 value 的类型都是相同的，这时可以使用索引类型。

```ts
const frontLanguage = {
  0: "HTML",
  1: "CSS",
  2: "JavaScript",
  3: "TypeScript",
};

const languageYear = {
  C: 1972,
  "C++": 1983,
  Java: 1995,
  Python: 1991,
};
```

上面的对象有一个共同点 key 的类型或者 value 的类型是相同的。在这种情况下，需要使用索引签名来约束对象中属性和值的结构及类型，

```ts
// 用interface 定义索引类型
interface IndexLanguage {
  [index: number]: string;
}

const frontLanguage: IndexLanguage = {
  // ...
};

// 用 interface 定义索引类型
interface ILanguageYear {
  [name: string]: number;
}
const languageYear: ILanguageYear = {
  //...
};
```

> 计算属性中的 index 是支持任意命名的。另一个索引类型同理。

**具体的属性可以和索引签名混合在一起使用，但是属性的类型必须是索引值的子集**

```ts
interface LanguageBirth {
  [name: string]: number;
  Java: number; // Java 属性的类型必须是索引值的子集(与顺序无关)
}

const language: LanguageBirth = {
  Java: 1995,
  JavaScript: 1995,
  TypeScript: 2014,
};
```

### 函数类型

interface 不仅可以定义对象中的属性和方法，实际上 interface 还可以用于定义函数类型

```ts
// 方式一: 用 type 定义函数类型
type CalcFn = (num1: number, num2: number) => number;

// 方式二: 用 interface 定义函数类型
interface CalcFn {
  (num1: number, num2: number): number;
}

const add: CalcFn = (n1, n2) => {
  return n1 + n2;
};

function calc(num1: number, num2: number, calcFn: CalcFn) {
  return calcFn(num1, num2);
}

calc(10, 20, add);
```

可以看到，定义函数的类型有两种方案: 一种是使用类型别名，另一种是使用接口。

如果只是定义一个普通的函数，推荐使用类型别名，这样可以提高代码的可读性。但是，如果需要更强的扩展性，就需要函数具有使用接口来定义函数的类型，

```ts
// 方式三: 用 interface 定义函数的类型，该函数还有 get 和 post 属性
interface FakeAxiosType {
  (config: any): Promise<any>;
  get(url: string): string;
  post(url: string): string;
}

const FakeAxios: FakeAxiosType = function (config: any) {
  return Promise.resolve(config);
};

FakeAxios.get = function (url: string): string {
  return "get";
};

FakeAxios.post = function (url: string): string {
  return "post";
};
```

### 接口的继承

在 TypeScript 中，接口和类一样可以实现继承，接口的继承同样使用 extends 关键字，接口支持多继承，而类不支持多继承。

```ts
interface ISwim {
  swimming: () => void;
}

interface IFly {
  flying: () => void;
}

// 接口的多继承
interface IAction extends ISwim, IFly {}

const action: IAction = {
  // 必须实现接口中的方法
  swimming() {},
  flying() {},
};
```

### 交叉类型

前面我们已经了解了联合类型，它表示满足多个类型中的任意一个，代码如下所示:

```ts
type Alignment = "left" | "right" | "center";
```

其实，还有一种类型合并方式 - 交叉类型 Intersection Type，它表示需要同时满足多个类型的条件，使用符号 & 连接。

例如，下面的交叉类型 MyIype 表示需要同时满足 number 和 string 类型。然而，实际种类型是不存在的，因此 MyType 实际上是一个 never 类型。

```ts
type MyType = number & string;
```

在开发中，交叉类型通常用于合并对象类型。

```ts
interface ISwim {
  swimming: () => void;
}

interface IFly {
  flying: () => void;
}

type MyType1 = ISwim | IFly;
type MyType2 = ISwim & IFly;

// 联合类型
const obj1: MyType1 = {
  flying() {},
};

// 交叉类型：MyType2 类型是 ISwim 和 IFly 类型的合并
const obj2: MyType2 = {
  swimming() {},
  flying() {},
};
```

### 接口的实现

接口除了可以被继承，还可以被类实现。如果一个类实现了该接口，那么在需要传入该接口的地方，都可以传入该类对应的对象，这就是面向接口编程的思想。

```ts
interface ISwim {
  swimming: () => void;
}

interface IEat {
  eating: () => void;
}

class Animal {}

// 维承 (extends) 只能实现单继承
// 实现接口 (implements) 类可以实现多个接口
class Fish extends Animal implements ISwim, IEat {
  swimming() {}
  eating() {}
}

class Person implements ISwim {
  swimming() {}
}

// 编写一些公共的API。下面是面向接口编程，即 swimAction 函数接收的是 ISwim 接口
function swimAction(swimable: ISwim) {
  swimable.swimming();
}

// 只要实现了 ISwim 接口的类对应的对象，都可以传给 swimAction 函数
swimAction(new Fish());
swimAction(new Person());
```

### interface 和 type 的区别

在实际开发中，interface 和 type 都可以用于定义对象类型，主要有以下选择方式。

- 在定义非对象类型时，通常推荐使用 type。比如 Direction、Alignment 以及一些 Function。

- 定义对象类型时，interface 和 type 有如下区别：

  - interface: 可以重复地对某个接口定义属性和方法

  - type: 定义的是别名，别名不能重复

```ts
interface IFoo {
  name: string;
}

interface IFoo {
  age: number;
}

// IFoo 类型是上面两个 IFoo 接口的合并
const foo: IFoo = {
  name: "why",
  age: 18,
};
```

可以看到，interface 可以重复对某个接口进行定义，比如，当我们想为 window 扩展额外的属性时，可以重复定义 window 的类型。

### 字面量赋值

接口可以为对象声明类型。

```ts
interface IPerson {
  name: string;
}

const info: IPerson = {
  name: "why",
  age: 18, // 报错
};
```

可以看到，这里使用 interface 定义一个 IPerson 对象的类型，接着将该类型指定给 info 对象。由于 info 对象中多出一个 age 属性，而该属性没有在 IPerson 中声明过，因此会提示报错

针对这个报错有多种解决方案，比如: 增加 IPerson 中的 age 属性、使用索引类型或交叉类型等。

这里介绍另一种方案：使用字面量赋值。

```ts
interface IPerson {
  name: string;
}

const info = {
  name: "why",
  age: 18,
};

// 字面量赋值。Typescript 会擦除 (freshness) IPerson 类型之外的类型检查
const p: IPerson = info;
```

可以看到，这里将 info 字面量对象赋值给类型为 IPerson 的 p 变量。在字面量赋值的过程中，TypeScript 在类型检查时会保留 IPerson 类型，同时擦除 (freshness) 其他类型。如果将面量对象直接赋值给函数的参数，也是同样的道理，

```ts
// ...
function printInfo(info: IPerson) {
  console.log(info.name);
}

// 将字面量对象直接传给函数的参数
printInfo({
  name: "why",
  age: 18, // 报错
});

// 对字面量对象的引用，传递给函数参数
printInfo(info); // ok
```

## TypeScript 枚举类型

枚举不是 JavaScript 中的类型，而是 TypeScript 的少数功能之一。

- 枚举是指将一组可能出现的值逐个列举出来并定义在一个类型中，这个类型就是枚举类型。

- 开发者可以使用枚举定义一组命名常量，这些常量可以是数字或字符串类型

- 枚举类型使用 enum 关键字来定义。

```ts
enum Direction {
  LEFF,
  RIGHT,
}

function turnDirection(direction: Direction) {
  switch (direction) {
    case Direction.LEFF:
      console.log("向左");
      break;
    case Direction.RIGHT:
      console.log("向右");
      break;
  }
}

turnDirection(Direction.LEFF);
turnDirection(Direction.RIGHT);
```

### 枚举的值

枚举类型的成员默认是有值的，

```ts
enum Direction {
  LEFF, // 默认值是 0
  RIGHT, // 默认值为 1
}
console.log(Direction.LEFF); // 0
console.log(Direction.RIGHT); // 1
```

可以看到，如果没有指定校举成员的值，则默认从零开始自增长。我们也可以为枚举成员重新赋其他的值

```ts
enum Direction {
  LEFF = 100,
  RIGHT, // 自增长
}

console.log(Direction.LEFF); // 100
console.log(Direction.RIGHT); // 101
```

我们还可以将枚举成员赋值为字符串类型

```ts
enum Direction {
  LEFF,
  RIGHT = "right",
}
console.log(Direction.LEFF); // 0
console.log(Direction.RIGHT); // right
```

## TypeScript 泛型的使用

### 认识泛型

在软件工程中，构建明确和一致的 API，且 API 具有可复用性是非常重要的。为了实现这一点，可以使用函数来封装 API。通过传入不同的函数参数，函数可以帮助我们完成不同的操作

但是，是否可以将参数的类型也进行参数化呢？答案是肯定的。将参数的类型也进行参数化，这就是通常所说的类型参数化，也称为泛型。

为了更好地理解类型参数化，下面来看一个需求: 封装一个函数，传入一个参数，并且返回这个参数。

```ts
function foo(arg: number): number {
  return arg;
}
```

可以看到，foo 函数的参数和返回值类型应该一致，都为 number 类型。虽然该代码实现功能，但是不适用于其他类型，如 srting、boolean 等。有人可能会建议将 number 类型改为 any 类型，但这样会丢失类型信息。

例如传入的是一个 number，我们希望返回的不是 any 类型,是 number 类型。因此，在函数中需要捕获参数的类型为 number，并将其用作返回值的类型

```ts
function foo<T>(arg: T): T {
  return arg;
}

// 调用方式一：向类型变量 T 传递具体的类型
foo<number>(20);
foo<string>("abc");

// 调用方式二：使用类型推断
foo(20);
foo("abc");

// 需要注意的是，foo 函数上可以定义多个类型变量，
function foo<T, K>(arg1: T, arg2: K): T {
  return arg1;
}
```

### 泛型接口

泛型的应用非常广泛，不仅可以在函数中使用，还可以在定义接口时使用。

```ts
// 1. 定义接口，在接口中定义 T1 和 T2 两个类型变量，并且都有默认值
interface IPerson<T1 = string, T2 = number> {
  name: T1;
  age: T2;
}

// 2. 将 p1 和 p2 指定为 IPerson 类型
const p1: IPerson = {
  name: "why",
  age: 18,
};
const p2: IPerson<string, number> = {
  name: "why",
  age: 18,
};
```

### 泛型类

定义类时也可以使用泛型。

```ts
class point<T> {
  x: T;
  y: T;
  z: T;
  constructor(x: T, y: T, z: T) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// TS 会自动推导 T 类型变量的具体类型
const p1 = new point("10", "20", "30");

// 向 Point 类的 T 类型变量传递具体的 string 类型
const p2 = new point<string>("10", "20", "30");

const p3: Point<string> = new point("10", "20", "30");
```

可以看到，在 Point 类中定义了一个 T 类型变量:

- 在创建 p1 对象时，TypeScript 会自动推导出 T 类型变量的具体类型。

- 在创建 p2 对象时，向 T 类型变量传递了具体的 string 类型。

- 在声明 p3 对象类型时，也向 T 类型变量传递了具体的 string 类型。

### 泛型约束

有时我们希望传入的类型有某些共性，但是这些共性可能不在同一种类型中。

例如，string 和 array 都有 length 属性，或者某些对象也会有 length 属性。这意味着只要拥有 length 属性的类型，都可以作为参数类型。这时，需要使用泛型约束来定义类型。

```ts
// 1. 接口定义对象类型
interface ILength {
  length: number;
}

// 2. 在 getLength 函数中定义 T 类型变量，并添加类型的约束
// T 类型必须包含 ILength 接口中定义的 length 属性
function getLength<T extends ILength>(arg: T): number {
  return arg.length;
}

// 3. 泛型约束的使用
getLength("abc"); // TypeScript 会自动推导出 string 类型 (string 有 length 属性)

// 向类型变量传递 string[] 类型(该类型有 length 属性)
getLength<string[]>(["abc", "def"]);

// 向 T 类型变量传递 (length:number) 对象类型 (有 length 属性)
getLength<{ length: number }>({
  length: 100,
});

// getLength<number>(100); // 报错
```

可以看到，在 getLength 函数中定义了 T 类型变量，并且通过 **extends** 关键字为该类型添加了约束，约束 T 类型必须包含 length 接口中定义的 length 属性。

在调用 getLength 函数时，传入的参数类型必须包含 length 属性，这就是泛型约束的用法

## 模块和命名空间

TS 支持以下两种组织方式来编写代码：

- 模块化开发：每个文件可以是一个独立的模块，既支持 ES Module，也支持 CommonsJS

- 命名空间：将代码包裹在一个命名空间中，通过命名空间来组织代码

### 模块化开发

模块化开发是一种将代码分割成独立模块的方式，每个模块可以是一个独立的文件。

下面封装一个 math.ts 模块为例：

```ts
// utils/math.ts
export function add(x: number, y: number): number {
  return x + y;
}
export function sub(x: number, y: number): number {
  return x - y;
}
```

接着在 main.ts 中使用该模块

```ts
// utils/main.ts
import { add, sub } from "./math";
console.log(add(10, 20));
console.log(sub(10, 20));
```

### 命名空间

在 TypeScript 早期，命名空间被称为内部模块，主要用于在一个模块内部进行作用域的划分，防止一些命名冲突的问题。

```ts
// utils/format.ts
// 声明一个命名空间: Time
export namespace Time {
  export function format(time: string[]) {
    return time.join("-");
  }
  export let name: string = "coder";
}

// 声明一个命名空间: Price
export namespace Price {
  export function format(price: number) {
    return price.toFixed(2);
  }
}
```

在 utils/main.ts 中使用该命名空间

```ts
// utils/main.ts
import { Time, Price } from "./format";
console.log(Time.format(["2022", "01", "01"]));
console.log(Time.name);
console.log(Price.format(100));
```

## 类型的声明

### 类型的查找

前面介绍的 TypeScript 类型几乎都是我们自己编写的，但是也使用了一些其他的类型

```ts
const imageEl = document.getElementById("image") as HTMLImageElement;
```

为什么在 TypeScript 中可以使用 HTMLImageElement 类型？这其中就涉及了 TypeScript 类型管理和查找规则。

为了更好地管理类型，TypeScript 提供了另一种文件类型，即 `.d.ts` 文件(d 是 declame 的写)。

`.d.ts` 文件用于声明 (declare)类型。它仅用于做类型检测，告知 TypeScript 有哪些类型

**在 TypeScript 中，有三种声明类型的位置:**

1. 内置类型声明(如 lib.dom.d.ts)

2. 外部定义类型声明 (如 @types/xxx、axios/index.d.ts)

3. 自定义类型声明(如 src/shims-vue.d.ts、global.d.ts)。

**1. 内置类型声明**

在 TypeScript,中，内置类型声明是 TypeScript 自带的，它内置了 JavaScript 运行时的一些标准化 API 的声明文件，其中包括 Math、Date 等内置类型，以及 DOM API，如 Window、Document 等。

通常情况下，在安装 TypeScript 时，TypeScipt 的环境中会自带内置类型声明文件(如 lib.dom.d.ts 文件)。此外，我们也可以在链接 15-1 的 GitHub 地址中查看内置类型声明文件。

**2. 外部定义类型声明**

外部类型声明通常在使用一些库(如第三方库)时会用到。

这些第三方库通常有两种类型声明方式：

(1) 在自己的库中进行类型声明，比如 axios 的 index.d.ts 文件

(2) 使用社区的公有库 DefinitelyTyped 来进行类型声明，DefinitelyTyped 的 Github 地址见链接 15-2。当我们需要某个库类型文件时，可以执行 `npm i @types/xxxx --save-dev` 对其进行安装

如，当需要安装 React 类型声明时，可以在终端执行如下命令：

```sh
npm i @types/react --save-dev
```

**3. 自定义类型声明**

在开发中，有两种情况需要自定义声明文件:

(1) 使用的第三方库是一个纯 JavaScript 库，没有对应的声明文件，比如 Vue3 中常用 lodash

(2) 我们需要在自己的代码中声明一些类型，以便在其他地方直接使用。另外，需要注意的是: 自定义的声明文件命名可以随便起，该文件一般放在 src 目录下也可以放到其他目录下，但必须是`.d.ts` 文件，例如 `shims-vue.d.ts`、`hy-type.d.ts`、`global.d.ts` 等

### 创建 Vue3 + TS 项目

**创建**

```sh
vue create vue3-ts
```

选择：Vue.js3、Babel、TypeScript

**最终目录**

```sh
vue3-ts
├── public
  ├── index.html
├── src
  ├── App.vue
  ├── hy-type.d.ts # 将以前的 shims-vue.d.ts文件改成 hy-type.d.ts文件，可以随意命名
  ├── main.ts
├── package.json
├── package-lock.json
├── babel.config.js
└── tsconfig.json
```

tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true, // 让ES Module 和 commonjs 相瓦调用
    "skipLibCheck": true, // 跳过整个库进行类型检查，只检查用到的类型
    "forceConsistentCasingInFileNames": true // 强制使用大小写一致的文件名
  }
}
```

### declare 声明变量

在 TypeScript 中，为了声明全局变量，需要使用 declare 关键字。

```html
<!-- public/index.html -->
<div id="app"></div>
<script>
  // 定义全局变量
  const appName = "Vue.js 3+TS";
  const appVersion = "1.0.0";
</script>
```

接着在 src/main.ts 中使用 appName 和 appVersion 变量

```ts
//...
console.log(appName); // 报错：Cannot find name 'appName'
console.log(appVersion); // 报错：Cannot find name 'appVersion'
//...
```

可以看到，在 main.ts 中直接使用 appName 和 appVersion 两个全局变量会提示报错，因为这两个变量并没有全局声明类型。

为了让这两个全局变量能够全局使用而不报错，我们需要对这两个变量进行全局声明。

```ts
// src/hy-type.d.ts
declare const appName: string;
declare const appVersion: string;
```

这时，之前 src/main.ts 文件中报错的代码不会再报错了。

### declare 声明函数

在 TypeScript 中，声明全局函数也需要用到 declare 关键字

```html
<!-- public/index.html -->
<div id="app"></div>
<script>
  // 定义全局变量
  const appName = "Vue.js 3+TS";
  const appVersion = "1.0.0";
  // 定义全局函数
  function getAppName() {
    return appName;
  }
</script>
```

接着，修改 `src/hy-type.d.ts` 文件，对 getAppName 函数进行全局声明，

```ts
// src/hy-type.d.ts
declare const getAppName(): string;
```

### declare 声明类

在 TypeScipt 中，声明全局类也需要使用到 declare 关键字。在 public/index.html 文件中定义全局类，

```html
<!-- public/index.html -->
<div id="app"></div>
<script>
  // 定义全局变量
  const appName = "Vue.js 3+TS";
  const appVersion = "1.0.0";
  // 定义全局函数
  function getAppName() {
    return appName;
  }
  // 定义全局类
  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
</script>
```

接着，修改 `src/hy-type.d.ts` 文件，对 Person 类进行全局声明，

```ts
// src/hy-type.d.ts
declare class Person {
  name: string;
  age: number;
  constructor(name: string, age: number);
}
```

### declare 声明文件

在前端开发中，需要导入各种文件，例如图片、Vue3 文件等。为了正确地声明导入的文件，需要用到 declare 关键字。

在 `src/img` 文件夹中添加一张 nhIt.jpg 图片，接着修改 `src/hy-ype.d.ts` 文件，对需要导入的 `.jpg、jpeg、.png` 等文件进行全局声明，

```ts
// 声明导入 .jpg、jpeg、.png
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";
declare module "*.svg";
declare module "*.gif";
```

然后，在 src/main.ts 中导入 nhIt.jpg 文件，

```ts
import nhIt from "./img/nhIt.jpg";
```

### declare 声明模块

TypeScript 支持通过模块化和命名空间这两种方式来组织代码。在使用模块化时，需要用 declare 关键字声明导入的模块。

```ts
import lodash from "lodash"; // 报错：Cannot find a declaration file for module 'lodash'
```

这是因为安装 lodash 模块并没有对应的声明文件，此时可以执行 `npm i @types/lodash --save-dev` 命令，安装它的声明文件，或手动编写该模块的声明文件。

下面讲解如何手动编写 lodash 模块的声明：

```ts
declare module "模块名" { export xxxx }
```

意思是用 declare module 声明一个模块。在模块内部，需要使用 export 导出对应库的类、函数等。

接着，修改 `src/hy-type.d.ts` 文件，添加对 lodash 模块的全局声明、

```ts
declare module "lodash" {
  export function join(args: any[]): any;
}
```

### declare 声明命名空间

在 TypeScript 中声明命名空间和声明模块的方式与 TypeScript 类似，也需要使用 declare 关键字。

```html
<!-- public/index.html -->
<div id="app"></div>
<script src="https://xxx/jquery.js"></script>
```

接着，为了在全局中直接使用 $ 函数，可以对 $ 函数进行命名空间的声明。

```ts
// 声明 $ 命名空间
declare namespace $ {
  function ajax(settings: any): void;
}
```

这样就可以在 main.ts 中直接使用 $ 全局函数了。
