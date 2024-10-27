---
title: "sass 优化响应式布局代码"
tag: "Css"
time: 2024-09-15 16:44:28
---

## 例子

```html
<div class="testBox"></div>
```

```css
.testBox {
  display: block;
  width: 300px;
  height: 300px;
  border: 1px solid #ddd;
}
@media (min-width: 768px) {
  .testBox {
    background-color: red;
  }
}
@media (min-width: 1024px) {
  .testBox {
    background-color: blue;
  }
}
```

不同宽屏不同效果

## 缺点

1. 需要重复定义 media 声明
2. 代码变分散了，跟 testBox 定义割裂了。
3. 断点的配置没有统一管理，min-width: 1024px 等容易写错

<img src="../imgs/72/01.webp" />

## sass 优化

`@mixin + @include`

```scss
@mixin setColor($devicename) {
  @if $devicename == "iphone" {
    @media (min-width: 768px) {
      background-color: red;
    }
  } @else if $devicename == "ipad" {
    @media (min-width: 1024px) {
      background-color: blue;
    }
  }
}

.testBox {
  display: block;
  width: 300px;
  height: 300px;
  @include setColor("iphone");
  @include setColor("ipad");
}
```

注意 `include` 如果是 `@media` 媒体查询会提取到顶部。

## 完善多端版本

```scss
$deviceMap: (
  "iphone": (
    320px,
    480px,
  ),
  "ipad": (
    481px,
    768px,
  ),
  "notebook": (
    769px,
    1024px,
  ),
  "desktop": (
    1025px,
    1200px,
  ),
  "bigscreen": 1201px,
);

@mixin setMedia($devicename) {
  $list: map-get($deviceMap, $devicename);
  @if type-of($list) == "list" {
    $min: nth($list, 1);
    $max: nth($list, 2);
    @media (min-width: $min) and (max-width: $max) {
      @content;
    }
  } @else {
    @media (min-width: $list) {
      @content;
    }
  }
}

.testBox {
  display: block;
  width: 300px;
  height: 300px;
  @include setMedia("iphone") {
    background-color: red;
  }
  @include setMedia("ipad") {
    background-color: blue;
  }
  @include setMedia("notebook") {
    background-color: yellow;
  }
  @include setMedia("desktop") {
    background-color: gray;
  }
  @include setMedia("bigscreen") {
    background-color: green;
  }
}
```

对应编译后的代码

```css
.testBox {
  display: block;
  width: 300px;
  height: 300px;
}

@media (min-width: 320px) and (max-width: 480px) {
  .testBox {
    background-color: red;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .testBox {
    background-color: blue;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .testBox {
    background-color: yellow;
  }
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .testBox {
    background-color: gray;
  }
}

@media (min-width: 1201px) {
  .testBox {
    background-color: green;
  }
}
```

<img src="../imgs/72/02.webp" />
