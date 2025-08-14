---
title: Tailwind CSS 动画系统
category: tailwindcss
date: 2025-08-14 17:48:20
---

## 动画系统概述

Tailwind CSS 提供了一套完整的动画系统，包括预定义的动画、过渡效果和自定义动画的能力。动画在现代 Web 开发中扮演着重要角色，能够提升用户体验和界面的交互性。

## 默认动画

### 内置动画类

Tailwind 提供了几个常用的动画工具类：

```html
<!-- 旋转动画 -->
<div class="animate-spin">
  <svg class="w-5 h-5" viewBox="0 0 24 24">
    <!-- 加载图标 -->
  </svg>
</div>

<!-- 脉冲动画 -->
<div class="animate-pulse bg-gray-300 h-4 rounded"></div>

<!-- 弹跳动画 -->
<div class="animate-bounce">
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <!-- 箭头图标 -->
  </svg>
</div>

<!-- 乒乓动画 -->
<div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>

<!-- 停止动画 -->
<div class="animate-none">静态元素</div>
```

### 默认动画配置

```javascript
// tailwind.config.js 中的默认动画配置
module.exports = {
  theme: {
    animation: {
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite',
    },
    keyframes: {
      spin: {
        to: { transform: 'rotate(360deg)' },
      },
      ping: {
        '75%, 100%': {
          transform: 'scale(2)',
          opacity: '0',
        },
      },
      pulse: {
        '50%': {
          opacity: '.5',
        },
      },
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-25%)',
          animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
        },
        '50%': {
          transform: 'none',
          animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
        },
      },
    },
  },
}
```

## 自定义动画

### 在配置文件中添加动画

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        // 自定义动画名称和属性
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'rotate-in': 'rotateIn 0.5s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        },
        slideDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        },
        slideLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)' 
          },
        },
        slideRight: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)' 
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.9)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)' 
          },
        },
        scaleOut: {
          '0%': { 
            opacity: '1',
            transform: 'scale(1)' 
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.9)' 
          },
        },
        rotateIn: {
          '0%': { 
            opacity: '0',
            transform: 'rotate(-180deg) scale(0.5)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'rotate(0deg) scale(1)' 
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' 
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' 
          },
        },
      },
    },
  },
}
```

### 使用自定义动画

```html
<!-- 淡入效果 -->
<div class="animate-fade-in">
  淡入内容
</div>

<!-- 滑动效果 -->
<div class="animate-slide-up">
  从下方滑入
</div>

<!-- 缩放效果 -->
<div class="animate-scale-in">
  缩放进入
</div>

<!-- 摆动效果 -->
<div class="animate-wiggle">
  摆动元素
</div>

<!-- 浮动效果 -->
<div class="animate-float">
  浮动元素
</div>

<!-- 发光效果 -->
<div class="animate-glow bg-blue-500 p-4 rounded">
  发光按钮
</div>
```

## 过渡效果

### 过渡属性

```html
<!-- 所有属性过渡 -->
<div class="transition-all duration-300 ease-in-out hover:scale-105">
  全属性过渡
</div>

<!-- 特定属性过渡 -->
<div class="transition-colors duration-200 hover:bg-blue-500">
  颜色过渡
</div>

<div class="transition-transform duration-300 hover:rotate-12">
  变换过渡
</div>

<div class="transition-opacity duration-500 hover:opacity-50">
  透明度过渡
</div>

<!-- 阴影过渡 -->
<div class="transition-shadow duration-300 hover:shadow-lg">
  阴影过渡
</div>
```

### 过渡持续时间

```html
<!-- 不同持续时间 -->
<div class="transition duration-75">75ms</div>
<div class="transition duration-100">100ms</div>
<div class="transition duration-150">150ms</div>
<div class="transition duration-200">200ms</div>
<div class="transition duration-300">300ms</div>
<div class="transition duration-500">500ms</div>
<div class="transition duration-700">700ms</div>
<div class="transition duration-1000">1000ms</div>
```

### 过渡缓动函数

```html
<!-- 不同缓动效果 -->
<div class="transition ease-linear">线性</div>
<div class="transition ease-in">缓入</div>
<div class="transition ease-out">缓出</div>
<div class="transition ease-in-out">缓入缓出</div>
```

### 过渡延迟

```html
<!-- 延迟过渡 -->
<div class="transition delay-75">75ms 延迟</div>
<div class="transition delay-100">100ms 延迟</div>
<div class="transition delay-150">150ms 延迟</div>
<div class="transition delay-200">200ms 延迟</div>
<div class="transition delay-300">300ms 延迟</div>
<div class="transition delay-500">500ms 延迟</div>
<div class="transition delay-700">700ms 延迟</div>
<div class="transition delay-1000">1000ms 延迟</div>
```

## 复杂动画示例

### 加载动画

```html
<!-- 旋转加载器 -->
<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>

<!-- 脉冲加载器 -->
<div class="flex space-x-1">
  <div class="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
  <div class="h-2 w-2 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 0.1s;"></div>
  <div class="h-2 w-2 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
</div>

<!-- 弹跳加载器 -->
<div class="flex space-x-1">
  <div class="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
  <div class="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
  <div class="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
</div>
```

### 按钮动画

```html
<!-- 悬停缩放按钮 -->
<button class="bg-blue-500 text-white px-6 py-3 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95">
  缩放按钮
</button>

<!-- 悬停发光按钮 -->
<button class="bg-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-1">
  发光按钮
</button>

<!-- 摆动按钮 -->
<button class="bg-green-500 text-white px-6 py-3 rounded-lg hover:animate-wiggle">
  摆动按钮
</button>
```

### 卡片动画

```html
<!-- 悬停翻转卡片 -->
<div class="group perspective-1000">
  <div class="relative w-64 h-40 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
    <!-- 正面 -->
    <div class="absolute inset-0 bg-blue-500 text-white p-6 rounded-lg backface-hidden">
      <h3 class="text-xl font-bold">正面</h3>
      <p>悬停查看背面</p>
    </div>
    <!-- 背面 -->
    <div class="absolute inset-0 bg-green-500 text-white p-6 rounded-lg backface-hidden rotate-y-180">
      <h3 class="text-xl font-bold">背面</h3>
      <p>这是背面内容</p>
    </div>
  </div>
</div>

<!-- 悬停上浮卡片 -->
<div class="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
  <h3 class="text-xl font-bold mb-2">卡片标题</h3>
  <p class="text-gray-600">卡片内容</p>
</div>
```

### 列表动画

```html
<!-- 交错动画列表 -->
<div class="space-y-2">
  <div class="animate-slide-up bg-white p-4 rounded shadow" style="animation-delay: 0s;">项目 1</div>
  <div class="animate-slide-up bg-white p-4 rounded shadow" style="animation-delay: 0.1s;">项目 2</div>
  <div class="animate-slide-up bg-white p-4 rounded shadow" style="animation-delay: 0.2s;">项目 3</div>
  <div class="animate-slide-up bg-white p-4 rounded shadow" style="animation-delay: 0.3s;">项目 4</div>
</div>
```

## 任意值动画

### 使用任意值创建动画

```html
<!-- 自定义动画持续时间 -->
<div class="animate-[wiggle_1s_ease-in-out_infinite]">
  自定义摆动动画
</div>

<!-- 自定义过渡 -->
<div class="transition-[height] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
  自定义过渡效果
</div>

<!-- 自定义变换 -->
<div class="hover:animate-[spin_2s_linear_infinite]">
  自定义旋转速度
</div>
```

## 响应式动画

### 响应式动画控制

```html
<!-- 不同屏幕尺寸的动画 -->
<div class="animate-pulse md:animate-bounce lg:animate-spin">
  响应式动画
</div>

<!-- 移动端禁用动画 -->
<div class="md:animate-fade-in md:transition-all md:duration-300">
  桌面端动画
</div>

<!-- 基于用户偏好的动画 -->
<div class="motion-safe:animate-bounce motion-reduce:animate-none">
  尊重用户动画偏好
</div>
```

## 性能优化

### 动画性能最佳实践

```css
/* 在 CSS 中优化动画性能 */
@layer utilities {
  .animate-optimized {
    /* 启用硬件加速 */
    transform: translateZ(0);
    will-change: transform;
  }
  
  .animate-gpu {
    /* 强制 GPU 加速 */
    transform: translate3d(0, 0, 0);
  }
  
  /* 减少重绘的动画 */
  .animate-efficient {
    /* 只动画 transform 和 opacity */
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}
```

### JavaScript 集成

```javascript
// 动画事件监听
const element = document.querySelector('.animate-fade-in')

element.addEventListener('animationstart', () => {
  console.log('动画开始')
})

element.addEventListener('animationend', () => {
  console.log('动画结束')
  // 清理或执行后续操作
})

// 动态添加动画类
function triggerAnimation(element, animationClass) {
  element.classList.add(animationClass)
  
  element.addEventListener('animationend', function handler() {
    element.classList.remove(animationClass)
    element.removeEventListener('animationend', handler)
  })
}

// 使用 Intersection Observer 触发动画
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-slide-up')
    }
  })
})

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el)
})
```

## 动画库集成

### 与第三方动画库结合

```javascript
// 与 Framer Motion 结合使用
import { motion } from 'framer-motion'

const AnimatedComponent = () => (
  <motion.div
    className="bg-blue-500 p-4 rounded"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Framer Motion + Tailwind
  </motion.div>
)

// 与 GSAP 结合使用
import { gsap } from 'gsap'

gsap.to('.gsap-element', {
  duration: 2,
  x: 100,
  rotation: 360,
  ease: 'bounce.out',
  className: '+=bg-green-500' // 动态添加 Tailwind 类
})
```

## 最佳实践

### 1. 性能考虑

```html
<!-- 好的做法：使用 transform 和 opacity -->
<div class="transition-transform duration-300 hover:scale-105">
  高性能动画
</div>

<!-- 避免：动画会触发重排的属性 -->
<div class="transition-all duration-300 hover:w-64">
  可能影响性能
</div>
```

### 2. 用户体验

```html
<!-- 尊重用户的动画偏好 -->
<div class="motion-safe:animate-bounce motion-reduce:animate-none">
  可访问的动画
</div>

<!-- 提供动画控制 -->
<button class="toggle-animation">
  切换动画
</button>
```

### 3. 语义化动画

```html
<!-- 为动画提供意义 -->
<div class="animate-pulse" aria-label="加载中">
  加载指示器
</div>

<div class="animate-bounce" role="alert">
  重要通知
</div>
```

### 4. 渐进增强

```html
<!-- 基础样式 + 动画增强 -->
<div class="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 transition-colors">
  <!-- 即使动画不支持，基础交互仍然可用 -->
  按钮
</div>
```

Tailwind CSS 的动画系统为现代 Web 应用提供了强大而灵活的动画解决方案，通过合理使用这些工具，您可以创建出既美观又高性能的用户界面动画效果。