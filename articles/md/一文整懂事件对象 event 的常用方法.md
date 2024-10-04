---
title: "一文整懂事件对象 event 的常用方法"
tag: "Js"
---

补充一下事件注册和删除需要注意的事项：

`addEventListener`方法来注册事件处理函数，`removeEventListener`方法来移除事件处理函数，这样可以灵活控制事件的监听与响应。

```js
function myFunction() {...}
// 注册事件处理函数
document.getElementById("myButton").addEventListener("click", myFunction);
// 移除事件处理函数
document.getElementById("myButton").removeEventListener("click", myFunction);
```

但千万不要写成如下形式，否则删除不掉注册的函数的哈：

```js
// 注册事件处理函数
document.getElementById("myButton").addEventListener("click", function () {
  // ...
});
// 移除事件处理函数
document.getElementById("myButton").removeEventListener("click", function () {
  // ...
});
```

也就是不要用匿名函数，这样删除不掉，因为这两个匿名函数属于不同的函数。

## 事件对象 event 常用方法

**event.stopPropagation() - 停止事件传播**

通过调用事件对象的 stopPropagation 方法，在任何阶段（捕获阶段或者冒泡阶段）中断事件的传播；

此后，事件不会在后面传播过程中的经过的节点上调用任何的监听函数；

HTML：

```html
<ul id="myList">
  <li>项目 1 <button>删除</button></li>
  <li>项目 2 <button>删除</button></li>
</ul>
```

JavaScript:

```js
document.getElementById("myList").addEventListener("click", function (event) {
  // 这个事件处理程序不会被调用，因为按钮的事件会阻止冒泡
  console.log("列表项被点击");
});
// 为所有按钮添加事件监听器
document.querySelectorAll("#myList button").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    // 阻止事件冒泡到列表项
    console.log("按钮被点击");
  });
});
```

列表和按钮都注册了点击事件，当点击了其中一个按钮后，列表上的点击事件不会被触发。因为在按钮的内部使用了 `event.stopPropagation();`

阻止了向父级的冒泡行为。

但 `event.stopPropagation()` 不会阻止当前节点上此事件其他的监听函数被调用。我们再来举个例子：

我们再来举个例子：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      #outer {
        width: 300px;
        height: 300px;
        text-align: center;
        background-color: yellowgreen;
        border-radius: 50%;
      }
      #center {
        width: 200px;
        height: 200px;
        text-align: center;
        background-color: firebrick;
        border-radius: 50%;
      }
      #inner {
        width: 100px;
        height: 100px;

        background-color: goldenrod;
        border-radius: 50%;
      }
    </style>
    <script>
      window.onload = function () {
        var outer = document.getElementById("outer");
        var center = document.getElementById("center");
        var inner = document.getElementById("inner");
        outer.addEventListener("click", function (event) {
          console.log("父元素的监听器");
        });
        inner.addEventListener("click", function (event) {
          console.log("子元素的第一个监听器");
          event.stopPropagation(); // 阻止事件冒泡到父元素
        });
        inner.addEventListener("click", function (event) {
          console.log("子元素的第二个监听器");
        });
      };
    </script>
  </head>
  <body>
    <div id="outer">
      <div id="center">
        <div id="inner">inner</div>
        center
      </div>
      outer
    </div>
  </body>
</html>
```

<img src="../imgs/77/01.png" />

inner 注册了两个监听事件，当点击了 inner 后，因为 inner 里阻止了冒泡，所以 outer 的事件不会被触发，这是都明了的。但是 inner 的第二个监听器会被触发。也就是 `event.stopPropagation();`并不会阻止当前节点上的其它事件的触发。

如果我们想连同此节点上的其它事件一起阻止，如何做呢？当当当·〜就是下面这位更加激进的朋友啦！

**event.stopImmediatePropagation()**

这个方法不仅会阻止事件继续向上冒泡，还会阻止在同一元素上注册的其他事件监听器被调用。

我们还沿用上个例子，只是把 `event.stopPropagation();`  改成 `event.stopImmediatePropagation();`看结果就会有不同：

<img src="../imgs/77/02.png" />

当点击了 inner 后，inner 的第二个监听器已不再调用，同时也不会冒泡到父元素。

**event.preventDefault() -  阻止浏览器的默认行为**

阻止特定事件的默认动作。比如，链接的默认行为就是在被单击时导航到 href 属性指定的 URL 或是修改表单提交的默认事件。如果想阻止这些行为，可以在 onclick 事件处理程序中取消，如下面的例子所示：

```html
<body>
  <a href="https://www.baidu.com">百度一下，你就知道</a>
  <!-- 表单提交 -->
  <form action="test.php">
    <input type="submit" value="提交" id="inp1" />
  </form>
  <script>
    // 阻止a标签的默认事件发生
    var a = document.getElementsByTagName("a")[0];
    a.onclick = function () {
      event.preventDefault();
      console.log("a被点击了");
    };
    // 阻止表单事件的默认行为
    var inp1 = document.getElementById("inp1");
    inp1.onclick = function () {
      event.preventDefault();
      console.log("表单提交了");
    };
  </script>
</body>
```
