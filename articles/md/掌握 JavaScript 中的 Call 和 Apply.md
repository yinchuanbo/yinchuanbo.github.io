---
title: "掌握 JavaScript 中的 Call 和 Apply"
tag: "JavaScript"
---

在学习 JavaScript 时，你可能会遇到 call 和 apply 这两个方法。它们的作用其实很相似，都是用来调用函数并设置函数内部的 this 值，但它们的使用方式稍有不同。

想象一下，你和朋友们一起拍照。call 就像是你一一叫朋友们的名字，让他们各自摆好姿势然后拍照，而 apply 则像是你一次性告诉大家一个姿势，让所有人一起摆好再拍照。虽然最终目的是一样的，但方式有些差别。

## Function.prototype.call()

`call`方法接受的第一个参数是要作为`this`值的对象，其余参数是传递给函数的参数。语法如下：

```js
function.call(thisArg, arg1, arg2, …)
```

假设你正在开发一个线上购物网站，用户可以在不同商品上添加评论。你有一个函数`addComment`，它会打印出用户的名字和评论内容：

```js
function addComment(comment) {
  console.log(`${this.username} commented: ${comment}`);
}

const user = { username: "Alice" };
addComment.call(user, "This is a great product!"); // 输出：Alice commented: This is a great product!
```

在这个例子中，我们用`call`方法调用`addComment`函数，并将`user`对象作为`this`的值。附加参数`'This is a great product!'`作为评论内容传递给`addComment`函数。

## Function.prototype.apply()

`apply`方法与`call`类似，但它接受一个数组（或类数组对象）作为第二个参数，数组中包含的是要传递给函数的参数。语法如下：

```js
function.apply(thisArg, [argsArray])
```

假设你正在开发一个线上购物网站，用户可以在不同商品上添加评论。你有一个函数`addComment`，它会打印出用户的名字和评论内容：

```js
function addComment(rating, comment) {
  console.log(
    `${this.username} rated: ${rating} stars and commented: ${comment}`
  );
}

const user = { username: "Alice" };
addComment.apply(user, [5, "This is a fantastic product!"]); // 输出：Alice rated: 5 stars and commented: This is a fantastic product!
```

在这个例子中，我们用`apply`方法调用`addComment`函数，并将`user`对象作为`this`的值。附加参数数组`[5, 'This is a fantastic product!']`分别作为评分和评论内容传递给`addComment`函数。

## 何时使用 call 和 apply

在 JavaScript 中，`call`和`apply`方法都能调用函数并设置函数内部的`this`值。那么，什么时候该用`call`，什么时候该用`apply`呢？让我们通过生活中的比喻来理解它们的不同之处。

### 选择 call 的情况

想象你在组织一个聚会，需要邀请几位朋友。你直接给每个朋友打电话，告诉他们聚会的时间和地点。这种方式就像`call`方法，你逐个传递参数，而不用准备额外的东西。

```js
function inviteFriend(time, place) {
  console.log(
    `${this.name}, you are invited to the party at ${place} on ${time}.`
  );
}

const friend = { name: "Alice" };
inviteFriend.call(friend, "7 PM", "Central Park"); // 输出：Alice, you are invited to the party at Central Park on 7 PM.
```

在这个例子中，我们用`call`方法直接传递了时间和地点两个参数，就像逐个打电话通知朋友一样。

### 选择`apply`的情况

现在，想象你要邀请一群朋友，你准备了一份邀请函，把所有信息都写在上面，然后把邀请函发给每个人。这就像`apply`方法，你准备了一个包含所有参数的数组，一次性传递给函数。

```js
function addNumbers() {
  const numbers = Array.from(arguments);
  return numbers.reduce((sum, num) => sum + num, 0);
}

const sum = addNumbers.apply(null, [1, 2, 3, 4, 5]); // 输出：15
```

在这个例子中，我们用`apply`方法传递了一个包含所有数字的数组，就像发出一份邀请函，让所有人一起收到。

总的来说，选择 call 还是 apply，主要取决于你如何传递参数。如果参数是分开的，使用 call；如果参数已经在一个数组中，使用 apply。

## 性能考虑

虽然在大多数情况下，`call`和`apply`的性能差异可以忽略不计，但在传递大量参数时，`call`稍微有一些优势。因为使用`apply`时，JavaScript 引擎需要将参数转换成类数组对象，这会引入一些开销，而`call`则直接传递参数，没有这个额外步骤。

然而，要记住在编程中过早优化通常是不可取的。除非你正在处理一个性能关键的应用程序，并且已经确定函数调用是瓶颈，否则`call`和`apply`之间的性能差异不太可能成为重大问题。

## 应用实例

### 1、借用方法

在编写 JavaScript 代码时，有时候你会遇到需要在不同对象之间复用方法的情况。这时，`call`和`apply`方法可以派上用场。它们允许你在不同的上下文中重用现有方法，而不需要继承或编写复杂的代码。

**使用 call 的例子**

假设你有一个类数组对象`arrayLike`，但它没有内置的数组方法。我们可以通过`call`方法从`Array.prototype`借用`slice`方法：

```js
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const letters = Array.prototype.slice.call(arrayLike, 1);
console.log(letters); // 输出：['b', 'c']
```

在这个例子中，我们用`call`方法调用了`Array.prototype.slice`方法，并将`arrayLike`作为`this`的值。这使我们可以像对待数组一样对待`arrayLike`对象，并使用`slice`方法创建一个新数组，其中包含它的一部分元素。

想象你在厨房里做饭，你有一把非常好用的厨师刀（`slice`方法），但你的朋友只有一把普通的水果刀（`arrayLike`对象）。你把你的厨师刀借给朋友，让他也能享受切菜的便利。这就像是用`call`方法借用数组的方法来处理类数组对象。

**使用 apply 的例子**

同样的，我们也可以用`apply`方法来实现类似的功能，假设我们需要传递一个参数数组：

```js
const max = Math.max.apply(null, [1, 2, 3, 4, 5]);
console.log(max); // 输出：5
```

在这个例子中，我们用`apply`方法调用了`Math.max`，并传递了一个数字数组。这里我们不需要设置`this`的特定值，所以传递了`null`。

### 2、使用 apply 展开数组

在 JavaScript 中，展开嵌套数组是一个常见的需求。虽然可以使用`concat`方法来实现，但这需要将每个嵌套数组作为单独的参数传递。这时，`apply`方法就非常有用了。为了更好地理解，我们来打个比方。

想象你有几个装满礼物的小盒子（嵌套数组），而你想把所有礼物放到一个大盒子里（展平成一个数组）。通常情况下，你需要一个一个地把小盒子里的礼物取出来，放到大盒子里。这就像用`concat`方法，需要逐个传递每个小盒子。

而使用`apply`方法，就像你有一个助手，他可以一口气把所有小盒子里的礼物都倒进大盒子里。这样不仅省时省力，还避免了逐个处理的麻烦。

```js
const nestedArray = [1, 2, [3, 4], [5, 6]];
const flattenedArray = [].concat.apply([], nestedArray);
console.log(flattenedArray); // 输出：[1, 2, 3, 4, 5, 6]
```

在这个例子中，我们用`apply`方法调用了`concat`方法，将一个空数组`[]`作为`this`值，并传递`nestedArray`作为参数。这样，`nestedArray`中的所有元素，包括子数组中的元素，都被展开并连接到空数组中，最终形成一个平铺的数组。

通过这种方式，你可以轻松地将嵌套数组展开为一个单一的数组，就像让助手一次性处理所有小盒子里的礼物一样，不仅简化了代码，还提高了效率。这种方法在处理复杂数据结构时非常有用，也让你的代码更简洁、更易读。

### 3、用 call 和 apply 创建可复用的函数装饰器

在 JavaScript 中，`call`和`apply`不仅可以用来调用函数，还可以用来创建可复用的函数装饰器。函数装饰器是一种高级函数，它可以修改其他函数的行为。为了让你更容易理解，我们用一个日常生活中的比喻来说明。

想象一下，你在准备礼物（原始函数），但为了让礼物看起来更特别，你决定先给它们包装一下（装饰器）。这个包装过程就是装饰器在做的事情。你可以选择在礼物外面加一层精美的包装纸，然后再递给朋友。包装纸不仅让礼物更有吸引力，还增加了额外的惊喜。这就是装饰器为函数所做的事情——它们在函数执行前后添加额外的行为。

下面是一个使用`apply`创建函数装饰器的例子，它会在执行原始函数之前，先打印出传递给函数的参数：

```js
function logArgs(func) {
  return function () {
    console.log("Arguments:", arguments);
    return func.apply(this, arguments);
  };
}

function multiply(a, b) {
  return a * b;
}

const loggedMultiply = logArgs(multiply);
console.log(loggedMultiply(3, 4)); // 输出：Arguments: [3, 4], 12
```

- **原始礼物（原始函数）：**`multiply`函数，它只是简单地将两个数字相乘。
- **包装纸（装饰器）：**`logArgs`函数，它在执行原始函数之前先打印出所有的参数，就像在礼物上先包上一层漂亮的纸。
- **打包后的礼物（装饰后的函数）：**`loggedMultiply`函数，它不仅完成了乘法运算，还在此之前打印了传递的参数，就像朋友收到礼物时，看到包装纸后更期待里面的内容。

通过这种方式，你可以为任何函数添加额外的功能，而不需要修改原始函数本身。这就像为礼物包上精美的包装纸一样，使得原本普通的礼物变得更加特别和有趣。`call`和`apply`在这里扮演着将装饰器与原始函数结合的角色，让你可以灵活地在不同的场合下为函数添加不同的“包装”。

## 结束

在日常开发中，如果你有固定数量的参数，或者需要逐个处理参数，`call`通常是更直接的选择。而当你需要传递数组或类数组对象作为参数时，`apply`则更为方便。
