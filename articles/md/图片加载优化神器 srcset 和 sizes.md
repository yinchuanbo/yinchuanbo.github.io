---
title: "图片加载优化神器 srcset 和 sizes"
tag: "性能优化"
time: 2025-02-07 09:07:39
---

## 一. 为什么需要 srcset 和 sizes？

随着移动设备的普及，用户访问网页的设备屏幕尺寸千差万别。为了在不同设备上都能展示最合适的图片，我们需要根据屏幕宽度、设备像素比等因素，动态加载不同尺寸的图片。

传统的标签只能加载一张图片，无法满足响应式网页的需求。而 srcset 和 sizes 属性的出现，完美解决了这个问题！

## 二. srcset 和 sizes 是什么？

srcset: 用于指定一系列不同尺寸的图片资源，以及对应的像素密度描述符 (例如 1x, 2x) 或宽度描述符 (例如 480w, 800w)。

sizes: 用于指定图片在不同屏幕宽度下的显示尺寸。

## 三. 如何使用 srcset 和 sizes？

```html
<img
  src="image-default.jpg"
  srcset="image-small.jpg 480w, image-medium.jpg 800w, image-large.jpg 1200w"
  sizes="(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px"
  alt="示例图片"
/>
```

**代码解析：**

srcset 属性指定了三个图片资源：

- image-small.jpg 对应 480px 宽度

- image-medium.jpg 对应 800px 宽度

- image-large.jpg 对应 1200px 宽度

sizes 属性指定了图片在不同屏幕宽度下的显示尺寸：

- 当屏幕宽度小于等于 600px 时，图片显示宽度为 480px

- 当屏幕宽度大于 600px 且小于等于 1000px 时，图片显示宽度为 800px

- 当屏幕宽度大于 1000px 时，图片显示宽度为 1200px

## 四. srcset 和 sizes 的优势

提升网页加载速度： 浏览器会根据设备屏幕宽度和像素密度，自动加载最合适的图片，避免加载过大图片，提升网页加载速度。

优化用户体验： 在不同设备上都能展示最合适的图片，提升用户体验。

减少流量消耗： 避免加载过大图片，减少用户流量消耗。
