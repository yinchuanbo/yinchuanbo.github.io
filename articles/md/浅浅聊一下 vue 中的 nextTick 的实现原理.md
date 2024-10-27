---
title: "浅浅聊一下 vue 中的 nextTick 的实现原理"
tag: "Vue"
time: 2024-09-15 12:50:54
---

## 前言

在 vue 中,`nextTick`是一个非常有用的方法，可以帮助我们解决一些异步更新队列相关的问题。由于 vue 中的数据响应系统是基于异步更新机制的，当我们修改完数据后，视图不会立即更新，而是会等待下一个 DOM 更新周期才会开始渲染。为此我们需要`nextTick`帮助我们等待下一次 DOM 更新。

## 正文

### 场景实例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      h2 {
        display: inline-block;
      }
    </style>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  </head>
  <body>
    <div id="app">
      <h2 ref="h2Ref">{{ message }}</h2>
      <button @click="updateMessage">更新</button>
    </div>
    <script>
      const { createApp, ref, onMounted } = Vue;

      createApp({
        setup() {
          const message = ref("Hello vue!");
          const h2Ref = ref(null);
          onMounted(() => {
            console.log(h2Ref.value.clientWidth);
          });
          const updateMessage = () => {
            message.value = "Goodbye Vue!";
            console.log(h2Ref.value.clientWidth);
          };
          return {
            message,
            h2Ref,
            updateMessage,
          };
        },
      }).mount("#app");
    </script>
  </body>
</html>
```

在上述代码中我们在页面挂载完毕时打印了`message`的宽度，获取宽度需要之一的一个常见问题就是区别`clientWidth`和`offsetWidth`，前者是不会计算边框的宽度，后者是会计算边框的宽度的.所以这里我们使用的是`clinetWidth`。这里我们的流程是点击`button`按钮，然后`message`的信息会更新然后再打印出更新后的`message`的宽度。我们需要思考的一个问题，这样子真的能打印出更新后的宽度吗？

<img src="../imgs/69/01.webp" />

答案是不能的。点击第一次更新时获取到的宽度依旧是未更新之前的宽度？那么我们思考一下，当我们点击更新按钮，代码的执行顺序是什么，DOM 结构中的`h2`是什么时候渲染的第一时间是先执行的是`message.value = 'Goodbye Vue!'`， 第二时间执行的是`console.log(h2Ref.value.clientWidth);`最后才是修改 DOM 结构中的的`message`。这样我们第一次点击更新，打印的内容依旧是未更新之前的宽度。那么如果我们让这个打印的顺序在最后呢？让`message`DOJM 结构先行。此时我们就需要使用定时器来等待执行了。

```js
const updateMessage = () => {
  message.value = "Goodbye Vue!";
  setTimeout(() => {
    console.log(h2Ref.value.clientWidth);
  });
};
```

将打印添加到定时器中执行，打印的结果如何呢？

<img src="../imgs/69/02.webp" />

打印结果是更新之后的宽度，这也就是说明了使用定时器是可行的。但是问题就是使用定时器需要的等待时间,而且等待的时间不是精确的,如果项目比较大，这就会导致需要等待的时间也会比较长。所以这终究不是一个合适的的方法。

那么我们使用`nextTick`可以很好的解决这种问题。

```js
const updateMessage = () => {
  message.value = "Goodbye Vue!";
  nextTick(() => {
    console.log(h2Ref.value.clientWidth);
  });
};
```

`nextTick`它会保证内部代码会在页面渲染完成之后执行，也就可以理解为某些需要等待 DOM 结构更新完毕的操作放在`nextTick`。

我们看 vue 的官方文档中，有提到`nectTick`会返回一个`Promise`的对象。也就是说`nextTick`的返回值可以接`.then()`。我们看看`nextTick`的返回值是什么。

```js
const updateMessage = () => {
  message.value = "Goodbye Vue!";
  let res = nextTick(() => {
    console.log(h2Ref.value.clientWidth);
  });
  res.then(() => {
    console.log(res);
  });
};
```

<img src="../imgs/69/03.webp" />

返回值是一个`Promise`对象且状态是`fullfilled`也就是说在 vue 源码执行中调用了`resolve()`。

### 实现 nextTick

我们创建一个 js 文件,我们知道的`nextTick`会返回一个`Promise`对象，且`nextTick`接受一个回调函数。 那么我们就可以先把模版写好。

```js
function nextTick(fn) {
  return new Promise((resolve, reject) => {});
}
```

然后我们就需要梳理一下我们需要干什么了？首先我们必须检查 DOM 结构是否发生了更新，如果更新了就需要调用`nextTick`的回调函数以及`resolve()`。

我们如何知道 DOM 结构发生了更新呢？那么这个时候就需要一个辅助 API 了`MutationObserver`

<img src="../imgs/69/04.webp" />

[MutationObserver]("https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver")可以帮助监听 DOM 结构。使用这个我们上首先需要判断浏览器是否支持。

```js
if (typeof MutationObserver !== "undefined") {
  //判断浏览器支不支持
  const observer = new MutationObserver(() => {
    let res = fn();
    if (res instanceof Promise) {
      res.then(resolve);
    } else {
      resolve();
    }
  });

  observer.observe(document.getElementById("app"), {
    childList: true, // 观察目标子节点的变化，是否有添加或者删除
    attributes: true, // 观察属性变动
    subtree: true, // 观察后代节点，默认为 false
  });
}
```

我们将回调函数`fn`赋值给`res`判断返回值是否一个`Promise`对象如果是则在`fn`执行完毕后调用`resolve()`否则直接调用`resolve()`。

`observer.observe()`第一个参数是指我们需要监听的 DOM 节点，第二个对象参数是一些配置。

我们将该代码引入实例中是否也能实现效果呢？

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      h2 {
        display: inline-block;
      }
    </style>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  </head>
  <body>
    <div id="app">
      <h2 ref="h2Ref">{{ message }}</h2>
      <button @click="updateMessage">更新</button>
    </div>
    <script src="nextTick.js"></script>
    <script>
      const { createApp, ref, onMounted } = Vue;

      createApp({
        setup() {
          const message = ref("Hello vue!");
          const h2Ref = ref(null);
          onMounted(() => {
            console.log(h2Ref.value.clientWidth);
          });

          const updateMessage = () => {
            message.value = "Goodbye Vue!";
            let res = nextTick(() => {
              console.log(h2Ref.value.clientWidth);
            });
            res.then(() => {
              console.log(res);
              console.log("nextTick 执行完毕");
            });
          };

          return {
            message,
            h2Ref,
            updateMessage,
          };
        },
      }).mount("#app");
    </script>
  </body>
</html>
```

<img src="../imgs/69/05.webp" />
