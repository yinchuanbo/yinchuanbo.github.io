---
title: "ES6 类"
tag: "Class 类"
---

```js
class Student extends Person {
  //这里的Student是子类，Person是父类，extends是实现类之间的继承，它可以自动设置原型
  university = "家里蹲大学"; //公共字段(类似于属性，在创建对象上可用)
  #studyHours = 0; //私有字段（类外无法访问）
  #course; //私有字段（类外无法访问）
  static numSubjects = 10; //静态公共字段（仅在类中可用）
  constructor(fullName, birthYear, startYear, course) {
    //构造函数方法，在普通类中必须使用，在子类中可以省略。
    super(fullName, birthYear); //调用父(super)类(扩展时必须如此)。需要在访问此类之前执行
    this.startYear = startYear; //实例属性（可用于创建的对象）
    this.#course = course; //重新定义私有字段
  }
  introduce() {
    //公共方法
    console.log(`我在${this.university}上学，学习的专业是${this.#course}`);
  }
  study(h) {
    this.#makeCoffe(); //重新定义私有字段和方法
    this.#studyHours += h; //重新定义私有字段和方法
  }
  #makeCoffe() {
    //私有方法（可能还不能在浏览器中使用。伪造替代：_代替 #)
    return "这是给你的一杯咖啡";
  }
  get testScore() {
    //Getter方法
    return this._testScore;
  }
  set testScore(score) {
    //setter方法(使用_来设置与方法相同名称的属性并添加getter)
    this._testScore = score <= 20 ? score : 0;
  }
  static printCurriculum() {
    //静态方法(仅在类上可用。不能访问实例属性或方法，只能访问静态属性
    console.log(`There are ${this.numSubjects} subjects`);
  }
}

const ITshare = new Student("ITshare", 2020, 2024, "计算机科学与技术");
//使用new操作符创建新的对象
```

## 注意事项

- 类只是构造函数的 “语法糖”；
- 类不会被提升；
- 类是一等公民；
- 类主体始终在严格模式下执行
