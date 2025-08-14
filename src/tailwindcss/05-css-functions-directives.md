---
title: Tailwind CSS 函数和指令
category: tailwindcss
date: 2025-08-14 17:47:14
---

## CSS 指令概述

Tailwind CSS 提供了几个特殊的 CSS 指令，用于在样式表中集成 Tailwind 的功能。这些指令在构建时被处理并替换为实际的 CSS 代码。

## @tailwind 指令

`@tailwind` 指令用于插入 Tailwind 的基础样式、组件样式和工具类样式。

### 基本用法

```css
/* 在你的主 CSS 文件中 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 各层的作用

#### @tailwind base
包含 Tailwind 的基础样式，如：
- CSS 重置样式
- HTML 元素的默认样式
- 基础的字体和颜色设置

```css
/* 生成的基础样式示例 */
*,
::before,
::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: theme('borderColor.DEFAULT', currentColor);
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
}
```

#### @tailwind components
包含组件层的样式，通常是：
- 通过 `@layer components` 添加的自定义组件
- 插件提供的组件样式

#### @tailwind utilities
包含所有的工具类样式：
- 所有的 Tailwind 工具类
- 通过 `@layer utilities` 添加的自定义工具类
- 响应式和状态变体

## @layer 指令

`@layer` 指令用于将自定义样式添加到 Tailwind 的特定层中，确保正确的样式优先级。

### 基本语法

```css
@layer base {
  /* 基础层样式 */
}

@layer components {
  /* 组件层样式 */
}

@layer utilities {
  /* 工具层样式 */
}
```

### 添加基础样式

```css
@layer base {
  h1 {
    @apply text-2xl font-bold;
  }
  
  h2 {
    @apply text-xl font-semibold;
  }
  
  a {
    @apply text-blue-600 underline;
  }
  
  /* 自定义 CSS 变量 */
  :root {
    --color-primary: 59 130 246;
    --color-secondary: 16 185 129;
  }
}
```

### 添加组件样式

```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded font-medium focus:outline-none focus:ring-2;
  }
  
  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }
  
  .card-header {
    @apply px-6 py-4 border-b border-gray-200;
  }
  
  .card-body {
    @apply px-6 py-4;
  }
}
```

### 添加工具类样式

```css
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .text-shadow-lg {
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## @apply 指令

`@apply` 指令用于在自定义 CSS 中应用 Tailwind 的工具类。

### 基本用法

```css
.custom-button {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}
```

### 复杂组件示例

```css
.navigation {
  @apply bg-white shadow-lg;
}

.navigation-list {
  @apply flex space-x-8;
}

.navigation-item {
  @apply relative;
}

.navigation-link {
  @apply block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200;
}

.navigation-link.active {
  @apply text-blue-600 font-medium;
}

.navigation-link.active::after {
  @apply absolute bottom-0 left-0 w-full h-0.5 bg-blue-600;
  content: '';
}
```

### 响应式 @apply

```css
.responsive-grid {
  @apply grid grid-cols-1;
  @apply md:grid-cols-2;
  @apply lg:grid-cols-3;
  @apply gap-4;
}
```

## theme() 函数

`theme()` 函数用于访问 Tailwind 配置文件中的主题值。

### 基本语法

```css
.custom-element {
  color: theme('colors.blue.500');
  padding: theme('spacing.4');
  border-radius: theme('borderRadius.lg');
}
```

### 访问嵌套值

```css
.header {
  /* 访问颜色调色板 */
  background-color: theme('colors.gray.100');
  border-bottom: 1px solid theme('colors.gray.300');
  
  /* 访问间距值 */
  padding: theme('spacing.4') theme('spacing.6');
  
  /* 访问字体配置 */
  font-family: theme('fontFamily.sans');
  font-size: theme('fontSize.lg');
  line-height: theme('lineHeight.relaxed');
}
```

### 使用点记法访问复杂值

```css
.content-area {
  /* 计算高度 */
  height: calc(100vh - theme('spacing.16'));
  
  /* 使用断点值 */
  max-width: theme('screens.lg');
  
  /* 访问阴影值 */
  box-shadow: theme('boxShadow.xl');
}
```

### 访问包含点的值

对于包含点的键名（如 `2.5`），使用方括号记法：

```css
.custom-spacing {
  margin: theme('spacing[2.5]');
  padding: theme('spacing[1.5]') theme('spacing[2.5]');
}
```

### 默认值

```css
.fallback-color {
  /* 如果主题中没有该值，使用默认值 */
  color: theme('colors.brand.primary', #3b82f6);
  background: theme('colors.custom.bg', white);
}
```

## @config 指令

`@config` 指令用于指定 Tailwind 应该使用哪个配置文件。

### 基本用法

```css
@config "./tailwind.admin.config.js";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 多配置文件场景

```css
/* admin.css */
@config "./configs/admin.config.js";
@tailwind base;
@tailwind components;
@tailwind utilities;

/* public.css */
@config "./configs/public.config.js";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 实际应用示例

### 创建设计系统组件

```css
@layer base {
  /* 设置 CSS 变量 */
  :root {
    --color-primary: theme('colors.blue.600');
    --color-primary-hover: theme('colors.blue.700');
    --color-secondary: theme('colors.gray.600');
    --spacing-component: theme('spacing.4');
  }
}

@layer components {
  /* 按钮组件系统 */
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200;
  }
  
  .btn-sm {
    @apply px-3 py-1.5 text-xs;
  }
  
  .btn-lg {
    @apply px-6 py-3 text-base;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }
  
  .btn-secondary {
    @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
  }
  
  .btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
  }
  
  /* 卡片组件 */
  .card {
    @apply bg-white rounded-lg shadow border border-gray-200 overflow-hidden;
  }
  
  .card-header {
    @apply px-6 py-4 bg-gray-50 border-b border-gray-200;
  }
  
  .card-title {
    @apply text-lg font-medium text-gray-900;
  }
  
  .card-body {
    @apply px-6 py-4;
  }
  
  .card-footer {
    @apply px-6 py-4 bg-gray-50 border-t border-gray-200;
  }
}

@layer utilities {
  /* 自定义工具类 */
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thumb-gray {
    scrollbar-color: theme('colors.gray.400') transparent;
  }
}
```

### 响应式组件

```css
@layer components {
  .hero-section {
    @apply relative bg-gray-900 text-white;
    @apply py-16 px-4;
    @apply md:py-24 md:px-6;
    @apply lg:py-32 lg:px-8;
  }
  
  .hero-title {
    @apply text-3xl font-bold tracking-tight;
    @apply sm:text-4xl;
    @apply md:text-5xl;
    @apply lg:text-6xl;
  }
  
  .hero-subtitle {
    @apply mt-4 text-lg text-gray-300;
    @apply sm:text-xl;
    @apply md:mt-6 md:text-2xl;
  }
}
```

## 最佳实践

### 1. 合理使用层级

```css
/* 好的做法：按功能分层 */
@layer base {
  /* 只放基础样式重置和默认样式 */
}

@layer components {
  /* 可复用的组件样式 */
}

@layer utilities {
  /* 单一用途的工具类 */
}
```

### 2. 避免过度使用 @apply

```css
/* 好的做法：简单的组件使用 @apply */
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}

/* 避免：复杂的样式直接写 CSS */
.complex-component {
  /* 直接写 CSS 而不是强行使用 @apply */
  background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
  transform: perspective(1000px) rotateX(15deg);
}
```

### 3. 利用 theme() 函数保持一致性

```css
.custom-component {
  /* 使用主题值保持一致性 */
  color: theme('colors.gray.700');
  font-size: theme('fontSize.base');
  line-height: theme('lineHeight.relaxed');
  
  /* 而不是硬编码值 */
  /* color: #374151; */
  /* font-size: 1rem; */
  /* line-height: 1.625; */
}
```

通过合理使用这些 CSS 函数和指令，您可以创建出既保持 Tailwind 设计系统一致性，又满足特定需求的自定义样式。