---
title: "前端实现直接粘贴图片到 html 页面"
tag: "Js"
time: 2024-11-10 10:12:44
---

近期有客户反馈有粘贴图片的功能吗, 确实有些情况下,  粘贴图片会比上传效率要高一点, 所以回来我们研究一下

在 MDN 中, 有一个关于 paste 事件的介绍

介绍说当用户通过浏览器的用户界面发起粘贴动作时, 就会触发 paste 事件

我们先写一个简单的 html 页面, 随后我们再写实现逻辑

<img src="../imgs/101/06.webp" />

页面我们算是写好了

<img src="../imgs/101/07.webp" />

写好之后, 我们注册一下粘贴事件

```js
area.addEventListener("paste", (e) => {
  console.log("触发了粘贴", e);
});
```

我们打印看一下结果

<img src="../imgs/101/08.webp" />

当触发这个事件的时候, 事件处理器会通过调用事件 clipboardData 属性的 getData 方法来访问剪切板内容, 这样,我们就可以在 clipboardData 的 items 中拿到我们的 DataTransferItem 组成的列表

在开始写逻辑之前, 需要阻止一下默认行为

```js
e.preventDefault();
```

我们粘贴一张图片, 看看 items 是什么数据

<img src="../imgs/101/09.webp" />

查看 MDN,  我们可以看到 DataTransferItem 是有两个属性的, 分别是 kind 和 type

kind 表示种类, string 或者是 file

type 表示类型, 一般是一个 MIME 类型

我们可以对 items 数组进行遍历,  拿到每一项的 type 进行判断,  如果是 image 则渲染到页面

<img src="../imgs/101/10.webp" />

遍历完, 我们可以拿到每一个 DataTransferItem, 随后需要我们调用它的 getAsFile 实例方法, 如果, 拖拽项是一个文件, 调用该方法就可以获取到 file 对象, 如果不是, 则返回 null

<img src="../imgs/101/11.webp" />

获取 file 对象之后, 读取文件内容, 在 load 中可以拿到读取到的结果, 我们将结果进行赋值即可

<img src="../imgs/101/12.webp" />

我们看一下大致效果

<img src="../imgs/101/13.webp" />

这样, 我们粘贴图片的功能大致就实现了

但是,  粘贴图片发送消息, 大致说一下思路

上传图片之后, 我们可以拿到 file 对象, 当用户点击发送的时候, 将图片上传到 oss, 将图片消息传给后端, 随后调用消息列表就可以了
