---
title: "FileReader"
tag: "JavaScript"
time: 2024-09-01 15:21:24
---

### 读取文件

```js
if (typeof FileReader === "undefined") {
  alert("当前浏览器不支持 FileReader 对象");
} else {
  var reader = new FileReader();
}
```

FileReader 对象包含 5 个方法，其中前 4 个用以读取文件，另一个用来中断读取操作。

1. readAsText(Blob, type): 将 Blob 对象或文件中的数据读取为文本数据。该方法包含两个参数，其中第二个参数是文本的编码方式，默认为 UTF-8。
2. readAsBinaryString(Blob): 将 Blob 对象或文件中的数据读取为二进制字符串，通常用该方法将文件提交到服务器端，服务器端可以通过这段字符串存储文件。
3. readAsDataURL(Blob): 将 Blob 对象或文件中的数据读取为 DataURL 字符串，该方法就是将数据以一种特殊格式的 URL 地址形式直接读入页面。
4. readAsArrayBuffer(Blob): 将 Blob 对象或文件中的数据读取为一个 ArrayBuffer 对象。
5. abort(): 不包含参数，中断读取操作。

**下面演示如何在网页中读取并显示图像文件、文本文件和二进制代码文件**

```html
<input type="file" id="file" />
<input type="button" value="读取图像" onclick="readAsDataURL()" />
<input type="button" value="读取二进制数据" onclick="readAsBinaryString()" />
<input type="button" value="读取文本文件" onclick="readAsText()" />
<div name="result" id="result"></div>

<script>
  window.onload = function () {
    var result = document.getElementById("result");
    var file = document.getElementById("file");
    if (typeof FileReader === "undefined") {
      result.innerHTML = "<h1>当前浏览器不支持 FileReader 对象</h1>";
      file.setAttribute("disabled", "disabled");
    }
  };
  function readAsDataURL() {
    var file = document.getElementById("file").files[0];
    if(!image\/\w+/.test(file.type)) {
        alert("提交文件不是图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      result.innerHTML = `<img src="${this.result}" />`;
    }
  }
  function readAsBinaryString() {
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(e) {
      result.innerHTML = this.result;
    }
  }
  function readAsText() {
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      result.innerHTML = this.result;
    }
  }
</script>
```

### 事件检测

FileReader 对象提供 6 个事件，用于监测文件读取状态，

1. onabort: 数据读取中断时触发
2. onprogress: 数据读取中触发
3. onerror: 数据读取出错时触发
4. onload: 数据读取成功时触发
5. onloadstart: 数据开始读取时触发
6. onloadend: 数据读取完成时触发，无论成功或失败

**使用 FileReader 对象读取文件时会发生一些列事件，在控制台跟踪读取状态的先后顺序**

```html
<input type="file" id="file" />
<input type="button" value="读取图像" onclick="readAsDataURL()" />
<div name="result" id="result"></div>

<script>
  window.onload = function () {
    var result = document.getElementById("result");
    var file = document.getElementById("file");
    if (typeof FileReader === "undefined") {
      result.innerHTML = "<h1>当前浏览器不支持 FileReader 对象</h1>";
      file.setAttribute("disabled", "disabled");
    }
  };
  function readAsDataURL() {
    var file = document.getElementById("file").files[0];
    if(!image\/\w+/.test(file.type)) {
        alert("提交文件不是图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      result.innerHTML = `<img src="${this.result}" />`;
    }
    // 事件
    reader.onprogress = function(e) {
      console.log("progress")
    }
    reader.onabort = function(e) {
      console.log("abort")
    }
    reader.onerror = function(e) {
      console.log("error")
    }
    reader.onloadstart = function(e) {
      console.log("loadstart")
    }
    reader.onloadend = function(e) {
      console.log("loadend")
    }
    reader.readAsDataURL(file);
  }

  /*
    执行结果：
      loadstart
      progress
      load
      loadend
  */
</script>
```
