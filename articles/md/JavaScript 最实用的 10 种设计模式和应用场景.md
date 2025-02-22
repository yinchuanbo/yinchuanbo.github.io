---
title: "JavaScript 最实用的 10 种设计模式和应用场景"
tag: "JavaScript"
time: 2025-02-22 10:18:47
---

## 1. 单例模式（Singleton Pattern）

单例模式确保一个类只有一个实例，并提供一个全局访问点，一般应用场景表现在：

- 全局状态管理（如 Redux 中的 Store）。
- 数据库连接池。
- 日志记录器。

```js
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = this;
    }
    return Singleton.instance;
  }
  log(message) {
    console.log(message);
  }
}
const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

## 2. 工厂模式（Factory Pattern）

工厂模式提供了一种创建对象的方式，而无需指定具体的类，一般应用场景表现在：

- 创建复杂的对象。
- 根据条件动态创建对象。
- 解耦对象的创建和使用。

```js
class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }
}

class CarFactory {
  createCar(type) {
    switch (type) {
      case "sedan":
        return new Car("Toyota", "Camry");
      case "suv":
        return new Car("Ford", "Explorer");
      default:
        throw new Error("Unknown car type");
    }
  }
}

const factory = new CarFactory();
const sedan = factory.createCar("sedan");
console.log(sedan); // Car { make: 'Toyota', model: 'Camry' }
```

## 3. 观察者模式（Observer Pattern）

观察者模式定义了对象之间的一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会收到通知，一般应用场景表现在：

- 事件处理系统。
- 数据绑定（如 Vue.js 的响应式系统）。
- 发布-订阅系统。

```js
class Subject {
  constructor() {
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log(`Received data: ${data}`);
  }
}

const subject = new Subject();
const observer = new Observer();

subject.addObserver(observer);
subject.notiy("Hello Observers"); // Received data: Hello Observers
```

## 4. 策略模式（Strategy Pattern）

策略模式定义了一系列算法，并将它们封装起来，使它们可以互相替换，一般应用场景表现在：

- 动态选择算法（如排序算法）。
- 表单验证规则。
- 支付方式选择。

```js
class PaymentStrategy {
  pay(amount) {
    throw new Error("pay method must be implemented");
  }
}

class CreditCardStrategy extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid ${amount} via Credit Card`);
  }
}

class PayPalStrategy extends PaymentStrategy {
  pay(mount) {
    console.log(`Paid ${amount} via PayPal`);
  }
}

class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  executePayment(amount) {
    this.strategy.pay(amount);
  }
}

const context = new PaymentContext(new CreditCardStrategy());
context.executePayment(100); // Paid 100 via Credit Card
```

## 5\. 装饰器模式（Decorator Pattern）

装饰器模式动态地为对象添加额外的行为，而不改变其结构，一般应用场景表现在：

- 扩展对象功能（如添加日志、缓存）。
- 动态添加属性或方法。

```js
class Coffee {
  cost() {
    return 5;
  }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() {
    return this.coffee.cost() + 2;
  }
}

const coffee = new Coffee();
const milkCoffee = new MilkDecorator(coffee);
console.log(milkCoffee.cost()); // 7
```

## 6\. 代理模式（Proxy Pattern）

代理模式为另一个对象提供一个代理或占位符，以控制对它的访问，一般应用场景表现在：

- 延迟加载（如图片懒加载）。
- 访问控制（如权限验证）。
- 缓存代理。

```js
class Image {
  constructor(url) {
    this.url = url;
    this.loadImage();
  }
  loadImage() {
    console.log(`Loading image from ${this.url}`);
  }
}

class ProxyImage {
  constructor(url) {
    this.url = url;
    this.image = null;
  }
  loadImage() {
    if (!this.image) {
      this.image = new Image(this.url);
    }
    return this.image;
  }
}

const proxy = new ProxyImage("example.jpg");
proxy.loadImage(); // Loading image from example.jpg
```

## 7\. 适配器模式（Adapter Pattern）

适配器模式将一个类的接口转换成客户端期望的另一个接口，一般应用场景表现在：

- 兼容旧代码。
- 集成第三方库。

```js
class OldAPI {
  request() {
    return "Old API response";
  }
}

class Adapter {
  constructor(oldAPI) {
    this.oldAPI = oldAPI;
  }
  newRequest() {
    const result = this.oldAPI.request();
    return `Adapted: ${result}`;
  }
}

const oldAPI = new OldAPI();
const adapter = new Adapter(oldAPI);
console.log(adapter.newRequest());
```

## 8\. 命令模式（Command Pattern）

命令模式将请求封装为对象，从而支持参数化、队列化和日志化操作，一般应用场景表现在：

- 撤销/重做功能。
- 任务队列。
- 宏命令。

```js
class Command {
  execute() {
    throw new Error("execute method must be implemented");
  }
}
class LightOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }
  execute() {
    this.light.turnOn();
  }
}
class Light {
  turnOn() {
    console.log("Light is on");
  }
}
const light = new Light();
const command = new LightOnCommand();
command.execute(); // Light is on
```

## 9\. 模板方法模式（Template Method Pattern）

模板方法模式定义了一个算法的骨架，允许子类在不改变结构的情况下重写某些步骤，一般应用场景表现在：

- 框架设计。
- 算法复用。

```js
class Game {
  play() {
    this.initialize();
    this.start();
    this.end();
  }
  initialize() {
    throw new Error("initialize method must be implemented");
  }
  start() {
    console.log("Game started");
  }
  end() {
    console.log("Game ended");
  }
}

class Chess extends Game {
  initialize() {
    console.log("Chess initialized");
  }
}

const chess = new Chess();
chess.play(); // Chess initalized, Game started, Game ended
```

## 10\. 状态模式（State Pattern）

状态模式允许对象在其内部状态改变时改变其行为，一般应用场景表现在：

- 状态机（如订单状态）。
- 游戏角色状态。

```js
class State {
  handle(context) {
    throw new Error("handle method must be implemented");
  }
}

class StartState extends State {
  handle(context) {
    console.log("Starting...");
    context.setState(this);
  }
}

class Context {
  constructor() {
    this.state = null;
  }
  setState(state) {
    this.state = state;
  }
  request() {
    this.state.handle(this);
  }
}

const context = new Context();
const startState = new StartState();
context.setState(startState);
context.request();
```
