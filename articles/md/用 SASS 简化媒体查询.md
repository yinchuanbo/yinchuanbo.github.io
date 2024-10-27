---
title: "用 SASS 简化媒体查询"
tag: "Css"
time: 2024-09-21 17:21:17
---

## 媒体查询的常见问题

在不使用预处理器的情况下，媒体查询通常是这样书写的：

```css
.container {
  width: 100%;
  padding: 20px;
}

@media (max-width: 600px) {
  .container {
    background-color: lightblue;
  }
}

@media (max-width: 900px) {
  .container {
    background-color: lightgreen;
  }
}

@media (max-width: 1200px) {
  .container {
    background-color: lightcoral;
  }
}
```

以上代码中，我们可以看到相同的选择器 .container 被重复多次，这不仅使代码冗长，而且在需要更改样式时也会增加维护成本。

## 使用 SASS 混合宏简化媒体查询

为了避免这种重复，我们可以定义一个媒体查询混合宏。下面是如何做到这一点的示例：

### 步骤一：定义混合宏

首先，我们定义一个 `respond-to` 的混合宏，以便根据不同的屏幕尺寸轻松地创建媒体查询：

```scss
@mixin respond-to($media) {
  @if $media == phone {
    @media (max-width: 600px) {
      @content;
    }
  } @else if $media == tablet {
    @media (max-width: 900px) {
      @content;
    }
  } @else if $media == desktop {
    @media (max-width: 1200px) {
      @content;
    }
  }
}
```

### 步骤二：使用混合宏

现在我们可以在样式规则中使用这个混合宏，来针对不同的设备屏幕进行调整：

```scss
.container {
  width: 100%;
  padding: 20px;

  @include respond-to(phone) {
    background-color: lightblue;
  }

  @include respond-to(tablet) {
    background-color: lightgreen;
  }

  @include respond-to(desktop) {
    background-color: lightcoral;
  }
}
```

结合上述内容，我们的完整 SASS 文件如下：

```scss
@mixin respond-to($media) {
  @if $media == phone {
    @media (max-width: 600px) {
      @content;
    }
  } @else if $media == tablet {
    @media (max-width: 900px) {
      @content;
    }
  } @else if $media == desktop {
    @media (max-width: 1200px) {
      @content;
    }
  }
}

.container {
  width: 100%;
  padding: 20px;

  @include respond-to(phone) {
    background-color: lightblue;
  }

  @include respond-to(tablet) {
    background-color: lightgreen;
  }

  @include respond-to(desktop) {
    background-color: lightcoral;
  }
}
```
