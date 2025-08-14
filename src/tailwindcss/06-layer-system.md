---
title: Tailwind CSS 层系统
category: tailwindcss
date: 2025-08-14 17:47:30
---

## 什么是层系统

Tailwind CSS 使用层（Layers）系统来组织和管理 CSS 样式的优先级。这个概念来源于 ITCSS（Inverted Triangle CSS）架构，通过将样式分为不同的层级来解决 CSS 特异性和样式覆盖的问题。

## 为什么需要层系统

### CSS 特异性问题

在传统 CSS 中，样式的优先级由特异性和源码顺序决定：

```css
/* 问题示例 */
.btn {
  background: blue;
  /* ... */
}

.bg-black {
  background: black;
}
```

```html
<!-- 两个按钮都会是黑色背景，因为 .bg-black 在 CSS 中出现得更晚 -->
<button class="btn bg-black">按钮 1</button>
<button class="bg-black btn">按钮 2</button>
```

### Tailwind 的解决方案

Tailwind 通过层系统确保工具类始终能够覆盖组件样式，无论 HTML 中类名的顺序如何。

## 三个核心层

### 1. Base 层

Base 层包含基础样式，如重置样式和 HTML 元素的默认样式。

#### 默认 Base 样式

```css
/* Tailwind 自动生成的 base 样式示例 */
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

body {
  margin: 0;
  line-height: inherit;
}
```

#### 自定义 Base 样式

```css
@layer base {
  /* HTML 元素的默认样式 */
  h1 {
    @apply text-2xl font-bold;
  }
  
  h2 {
    @apply text-xl font-semibold;
  }
  
  h3 {
    @apply text-lg font-medium;
  }
  
  a {
    @apply text-blue-600 underline hover:text-blue-800;
  }
  
  /* 表单元素样式 */
  input[type="text"],
  input[type="email"],
  textarea {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
  }
  
  /* 自定义 CSS 变量 */
  :root {
    --color-primary: 59 130 246;
    --color-secondary: 16 185 129;
    --color-danger: 239 68 68;
    --color-warning: 245 158 11;
    --color-success: 34 197 94;
  }
  
  /* 深色模式变量 */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-primary: 96 165 250;
      --color-secondary: 52 211 153;
    }
  }
}
```

### 2. Components 层

Components 层用于定义可复用的组件样式，这些样式可以被工具类覆盖。

#### 按钮组件系统

```css
@layer components {
  /* 基础按钮样式 */
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 cursor-pointer;
  }
  
  /* 按钮尺寸变体 */
  .btn-xs {
    @apply px-2 py-1 text-xs;
  }
  
  .btn-sm {
    @apply px-3 py-1.5 text-xs;
  }
  
  .btn-lg {
    @apply px-6 py-3 text-base;
  }
  
  .btn-xl {
    @apply px-8 py-4 text-lg;
  }
  
  /* 按钮颜色变体 */
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }
  
  .btn-secondary {
    @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
  }
  
  .btn-success {
    @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
  }
  
  .btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
  }
  
  .btn-warning {
    @apply bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500;
  }
  
  /* 按钮状态 */
  .btn:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  
  .btn-loading {
    @apply relative text-transparent;
  }
  
  .btn-loading::after {
    @apply absolute inset-0 flex items-center justify-center;
    content: '';
    background-image: url("data:image/svg+xml,%3csvg class='animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3ccircle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'%3e%3c/circle%3e%3cpath class='opacity-75' fill='currentColor' d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'%3e%3c/path%3e%3c/svg%3e");
    background-size: 1rem 1rem;
    background-repeat: no-repeat;
    background-position: center;
  }
}
```

#### 卡片组件系统

```css
@layer components {
  /* 基础卡片 */
  .card {
    @apply bg-white rounded-lg shadow border border-gray-200 overflow-hidden;
  }
  
  .card-header {
    @apply px-6 py-4 bg-gray-50 border-b border-gray-200;
  }
  
  .card-title {
    @apply text-lg font-medium text-gray-900 m-0;
  }
  
  .card-subtitle {
    @apply text-sm text-gray-600 mt-1;
  }
  
  .card-body {
    @apply px-6 py-4;
  }
  
  .card-footer {
    @apply px-6 py-4 bg-gray-50 border-t border-gray-200;
  }
  
  /* 卡片变体 */
  .card-elevated {
    @apply shadow-lg;
  }
  
  .card-bordered {
    @apply border-2;
  }
  
  .card-compact .card-body {
    @apply px-4 py-3;
  }
  
  .card-compact .card-header,
  .card-compact .card-footer {
    @apply px-4 py-3;
  }
}
```

#### 表单组件

```css
@layer components {
  /* 表单组 */
  .form-group {
    @apply mb-4;
  }
  
  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  
  .form-input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500;
  }
  
  .form-textarea {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical;
  }
  
  .form-select {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
  }
  
  .form-checkbox,
  .form-radio {
    @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded;
  }
  
  .form-error {
    @apply text-red-600 text-sm mt-1;
  }
  
  .form-help {
    @apply text-gray-500 text-sm mt-1;
  }
  
  /* 表单状态 */
  .form-input.error {
    @apply border-red-300 focus:border-red-500 focus:ring-red-500;
  }
  
  .form-input.success {
    @apply border-green-300 focus:border-green-500 focus:ring-green-500;
  }
}
```

### 3. Utilities 层

Utilities 层包含所有的工具类，具有最高的优先级。

#### 自定义工具类

```css
@layer utilities {
  /* 文本相关工具类 */
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .text-shadow-md {
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .text-shadow-lg {
    text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.2);
  }
  
  .text-shadow-none {
    text-shadow: none;
  }
  
  /* 滚动条样式 */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thumb-gray::-webkit-scrollbar-thumb {
    background-color: theme('colors.gray.400');
    border-radius: theme('borderRadius.full');
  }
  
  .scrollbar-track-gray::-webkit-scrollbar-track {
    background-color: theme('colors.gray.100');
  }
  
  /* 布局工具类 */
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .safe-left {
    padding-left: env(safe-area-inset-left);
  }
  
  .safe-right {
    padding-right: env(safe-area-inset-right);
  }
  
  /* 动画工具类 */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
  
  .animate-bounce-in {
    animation: bounceIn 0.6s ease-out;
  }
  
  /* 关键帧定义 */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
}
```

## 层的优先级和工作原理

### CSS 生成顺序

Tailwind 按以下顺序生成 CSS：

```css
/* 1. Base 层 - 最低优先级 */
@layer base {
  /* 基础样式 */
}

/* 2. Components 层 - 中等优先级 */
@layer components {
  /* 组件样式 */
}

/* 3. Utilities 层 - 最高优先级 */
@layer utilities {
  /* 工具类样式 */
}
```

### 实际应用示例

```html
<!-- 组件样式会被工具类覆盖 -->
<button class="btn btn-primary bg-green-500">
  <!-- 最终背景色是绿色，因为 bg-green-500 在 utilities 层 -->
  绿色按钮
</button>

<div class="card p-8">
  <!-- p-8 会覆盖 card 组件中定义的 padding -->
  自定义内边距的卡片
</div>
```

## 使用插件扩展层系统

### 创建自定义插件

```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addBase, addComponents, addUtilities, theme }) {
      // 添加基础样式
      addBase({
        'h1': {
          fontSize: theme('fontSize.2xl'),
          fontWeight: theme('fontWeight.bold'),
        },
        'h2': {
          fontSize: theme('fontSize.xl'),
          fontWeight: theme('fontWeight.semibold'),
        },
      })
      
      // 添加组件样式
      addComponents({
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.btn-blue': {
          backgroundColor: theme('colors.blue.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.blue.600'),
          },
        },
      })
      
      // 添加工具类
      addUtilities({
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.content-hidden': {
          'content-visibility': 'hidden',
        },
      })
    })
  ]
}
```

## 最佳实践

### 1. 合理分层

```css
/* 好的做法：按功能分层 */
@layer base {
  /* 只放全局基础样式 */
  html { font-family: 'Inter', sans-serif; }
  body { @apply text-gray-900 bg-white; }
}

@layer components {
  /* 可复用的 UI 组件 */
  .btn { @apply px-4 py-2 rounded; }
}

@layer utilities {
  /* 单一用途的工具类 */
  .text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
}
```

### 2. 避免层级混乱

```css
/* 避免：在错误的层中放置样式 */
@layer utilities {
  /* 不要在 utilities 层放复杂组件 */
  .complex-card {
    @apply bg-white p-6 rounded-lg shadow-md;
    /* 复杂的自定义样式... */
  }
}

/* 正确：复杂组件应该在 components 层 */
@layer components {
  .complex-card {
    @apply bg-white p-6 rounded-lg shadow-md;
    /* 复杂的自定义样式... */
  }
}
```

### 3. 利用层系统的优势

```html
<!-- 工具类可以轻松覆盖组件样式 -->
<button class="btn btn-primary text-green-500">
  <!-- 文字颜色会是绿色，覆盖了 btn-primary 的白色文字 -->
  自定义颜色按钮
</button>
```

### 4. 保持一致性

```css
@layer components {
  /* 使用主题值保持一致性 */
  .custom-component {
    color: theme('colors.gray.700');
    padding: theme('spacing.4');
    border-radius: theme('borderRadius.md');
  }
}
```

层系统是 Tailwind CSS 的核心特性之一，正确理解和使用层系统可以帮助您构建更加可维护和可预测的样式架构。