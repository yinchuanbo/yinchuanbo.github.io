---
title: Tailwind CSS 自定义样式
category: tailwindcss
date: 2025-08-14 17:48:05
---

## 添加自定义样式的方法

Tailwind CSS 提供了多种方式来添加自定义样式，每种方法都有其适用场景和最佳实践。

## 1. 直接在 CSS 文件中添加

### 基本方法

```css
/* styles/custom.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义样式 */
.custom-button {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}
```

### 结合 Tailwind 工具类

```css
.hero-section {
  @apply relative bg-gradient-to-r from-blue-600 to-purple-600 text-white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  @apply text-center max-w-4xl mx-auto px-4;
}

.hero-title {
  @apply text-4xl md:text-6xl font-bold mb-6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
```

## 2. 使用 @layer 指令

### 组织自定义样式

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* 基础样式重置和默认样式 */
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply font-sans text-gray-900 bg-white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
  }
  
  h1 { @apply text-4xl; }
  h2 { @apply text-3xl; }
  h3 { @apply text-2xl; }
  h4 { @apply text-xl; }
  h5 { @apply text-lg; }
  h6 { @apply text-base; }
}

@layer components {
  /* 可复用的组件样式 */
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }
  
  .btn-secondary {
    @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }
  
  .card-header {
    @apply px-6 py-4 bg-gray-50 border-b border-gray-200;
  }
  
  .card-body {
    @apply px-6 py-4;
  }
  
  .form-input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500;
  }
}

@layer utilities {
  /* 自定义工具类 */
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
  
  .gradient-text {
    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

## 3. 使用插件系统

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
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
          },
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

### 高级插件示例

```javascript
// plugins/custom-components.js
const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addComponents, theme }) {
  const components = {
    // 按钮组件系统
    '.btn': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      lineHeight: theme('lineHeight.5'),
      borderRadius: theme('borderRadius.md'),
      border: `1px solid transparent`,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:focus': {
        outline: '2px solid transparent',
        outlineOffset: '2px',
      },
      '&:disabled': {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
    
    // 按钮尺寸
    '.btn-sm': {
      padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
      fontSize: theme('fontSize.xs'),
    },
    '.btn-lg': {
      padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
      fontSize: theme('fontSize.base'),
    },
    
    // 按钮变体
    '.btn-primary': {
      backgroundColor: theme('colors.blue.600'),
      color: theme('colors.white'),
      '&:hover:not(:disabled)': {
        backgroundColor: theme('colors.blue.700'),
      },
      '&:focus': {
        boxShadow: `0 0 0 3px ${theme('colors.blue.200')}`,
      },
    },
    
    '.btn-secondary': {
      backgroundColor: theme('colors.white'),
      color: theme('colors.gray.700'),
      borderColor: theme('colors.gray.300'),
      '&:hover:not(:disabled)': {
        backgroundColor: theme('colors.gray.50'),
      },
      '&:focus': {
        boxShadow: `0 0 0 3px ${theme('colors.blue.200')}`,
      },
    },
    
    // 卡片组件
    '.card': {
      backgroundColor: theme('colors.white'),
      borderRadius: theme('borderRadius.lg'),
      boxShadow: theme('boxShadow.md'),
      border: `1px solid ${theme('colors.gray.200')}`,
      overflow: 'hidden',
    },
    
    '.card-header': {
      padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
      backgroundColor: theme('colors.gray.50'),
      borderBottom: `1px solid ${theme('colors.gray.200')}`,
    },
    
    '.card-body': {
      padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
    },
    
    '.card-footer': {
      padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
      backgroundColor: theme('colors.gray.50'),
      borderTop: `1px solid ${theme('colors.gray.200')}`,
    },
  }
  
  addComponents(components)
})
```

## 4. CSS 变量集成

### 定义 CSS 变量

```css
@layer base {
  :root {
    /* 颜色变量 */
    --color-primary: 59 130 246;
    --color-primary-hover: 37 99 235;
    --color-secondary: 107 114 128;
    --color-success: 34 197 94;
    --color-warning: 245 158 11;
    --color-danger: 239 68 68;
    
    /* 间距变量 */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
    
    /* 字体变量 */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    
    /* 阴影变量 */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  /* 深色模式变量 */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-primary: 96 165 250;
      --color-primary-hover: 59 130 246;
      --color-secondary: 156 163 175;
    }
  }
  
  [data-theme="dark"] {
    --color-primary: 96 165 250;
    --color-primary-hover: 59 130 246;
    --color-secondary: 156 163 175;
  }
}
```

### 在 Tailwind 配置中使用 CSS 变量

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
    },
  },
}
```

## 5. 复杂组件样式

### 导航组件

```css
@layer components {
  .navbar {
    @apply bg-white shadow-lg border-b border-gray-200;
  }
  
  .navbar-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .navbar-content {
    @apply flex justify-between items-center h-16;
  }
  
  .navbar-brand {
    @apply flex items-center space-x-2;
  }
  
  .navbar-logo {
    @apply h-8 w-8;
  }
  
  .navbar-title {
    @apply text-xl font-bold text-gray-900;
  }
  
  .navbar-nav {
    @apply hidden md:flex space-x-8;
  }
  
  .navbar-link {
    @apply text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200;
  }
  
  .navbar-link.active {
    @apply text-blue-600 bg-blue-50;
  }
  
  .navbar-mobile-button {
    @apply md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500;
  }
  
  .navbar-mobile-menu {
    @apply md:hidden;
  }
  
  .navbar-mobile-nav {
    @apply px-2 pt-2 pb-3 space-y-1 sm:px-3;
  }
  
  .navbar-mobile-link {
    @apply text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium;
  }
}
```

### 表单组件

```css
@layer components {
  .form {
    @apply space-y-6;
  }
  
  .form-group {
    @apply space-y-1;
  }
  
  .form-label {
    @apply block text-sm font-medium text-gray-700;
  }
  
  .form-label.required::after {
    content: ' *';
    @apply text-red-500;
  }
  
  .form-input {
    @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
  }
  
  .form-input:invalid {
    @apply border-red-300 focus:border-red-500 focus:ring-red-500;
  }
  
  .form-input:valid {
    @apply border-green-300 focus:border-green-500 focus:ring-green-500;
  }
  
  .form-textarea {
    @apply form-input resize-vertical;
    min-height: 100px;
  }
  
  .form-select {
    @apply form-input pr-10 bg-white;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
  }
  
  .form-checkbox,
  .form-radio {
    @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded;
  }
  
  .form-error {
    @apply text-red-600 text-sm;
  }
  
  .form-help {
    @apply text-gray-500 text-sm;
  }
  
  .form-actions {
    @apply flex justify-end space-x-3 pt-4;
  }
}
```

## 6. 动画和过渡效果

### 自定义动画

```css
@layer utilities {
  /* 关键帧定义 */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  /* 动画工具类 */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  
  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
  
  .animate-slide-down {
    animation: slideDown 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }
  
  .animate-pulse-slow {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  /* 过渡效果 */
  .transition-all-300 {
    transition: all 0.3s ease;
  }
  
  .transition-colors-200 {
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
  }
  
  .transition-transform-200 {
    transition: transform 0.2s ease;
  }
}
```

## 7. 响应式自定义样式

### 响应式组件

```css
@layer components {
  .hero {
    @apply relative bg-gradient-to-r from-blue-600 to-purple-600 text-white;
    @apply py-12 px-4;
    @apply sm:py-16 sm:px-6;
    @apply md:py-20 md:px-8;
    @apply lg:py-24 lg:px-12;
    @apply xl:py-32 xl:px-16;
  }
  
  .hero-content {
    @apply max-w-3xl mx-auto text-center;
  }
  
  .hero-title {
    @apply text-3xl font-bold mb-4;
    @apply sm:text-4xl sm:mb-6;
    @apply md:text-5xl md:mb-8;
    @apply lg:text-6xl;
  }
  
  .hero-subtitle {
    @apply text-lg opacity-90 mb-8;
    @apply sm:text-xl sm:mb-10;
    @apply md:text-2xl md:mb-12;
  }
  
  .hero-cta {
    @apply flex flex-col space-y-4;
    @apply sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center;
  }
}
```

## 最佳实践

### 1. 组织结构

```css
/* styles/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 导入自定义样式文件 */
@import './base.css';
@import './components.css';
@import './utilities.css';
```

### 2. 命名约定

```css
/* 使用 BEM 命名约定 */
.card { /* 块 */ }
.card__header { /* 元素 */ }
.card--featured { /* 修饰符 */ }

/* 或使用语义化命名 */
.primary-button { }
.secondary-button { }
.danger-button { }
```

### 3. 性能优化

```css
/* 避免过度嵌套 */
.card .header .title { /* 不推荐 */ }
.card-title { /* 推荐 */ }

/* 使用高效的选择器 */
.btn:hover { /* 推荐 */ }
.btn:hover:not(:disabled) { /* 更具体但性能稍差 */ }
```

### 4. 可维护性

```css
/* 使用注释说明复杂样式 */
.complex-animation {
  /* 创建一个复杂的 3D 翻转效果 */
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.complex-animation:hover {
  transform: rotateY(180deg);
}
```

通过合理使用这些自定义样式的方法，您可以在保持 Tailwind CSS 优势的同时，满足项目的特殊需求和设计要求。