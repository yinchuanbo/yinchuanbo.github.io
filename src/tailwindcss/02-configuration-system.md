---
title: Tailwind CSS 配置系统
category: tailwindcss
date: 2025-08-14 17:46:22
---

## 基础配置文件

Tailwind CSS 通过 `tailwind.config.js` 文件进行配置，这是整个框架的核心配置文件。

### 基本配置结构

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### ESM 格式配置

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### TypeScript 配置

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

## 内容配置 (Content)

内容配置告诉 Tailwind 在哪些文件中查找类名，这对于 CSS 的生成至关重要。

### 基本配置

```javascript
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./pages/**/*.{html,js,ts,jsx,tsx}",
    "./components/**/*.{html,js,ts,jsx,tsx}",
  ],
  // ...
}
```

### Glob 模式示例

```javascript
module.exports = {
  content: [
    // 包含所有 HTML 文件
    "./**/*.html",
    
    // 包含 src 目录下的所有 JS/TS 文件
    "./src/**/*.{js,ts,jsx,tsx}",
    
    // 包含特定目录
    "./components/**/*.vue",
    "./pages/**/*.php",
    
    // 排除 node_modules
    "!./node_modules/**/*",
  ],
}
```

### 动态内容配置

```javascript
module.exports = {
  content: [
    {
      files: ['./src/**/*.{html,js}'],
      // 提取动态类名
      extract: {
        // 自定义提取器
        js: (content) => {
          return content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
        }
      }
    }
  ],
}
```

## 主题配置 (Theme)

主题配置是 Tailwind 最强大的功能之一，允许您完全自定义设计系统。

### 完全替换默认主题

```javascript
module.exports = {
  theme: {
    // 完全替换默认配置
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      // 扩展默认主题
    }
  }
}
```

### 扩展默认主题

```javascript
module.exports = {
  theme: {
    extend: {
      // 添加新的颜色
      colors: {
        'brand-blue': '#1fb6ff',
        'brand-purple': '#7e5bef',
      },
      
      // 添加新的间距
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      
      // 添加新的字体大小
      fontSize: {
        'xxs': '.625rem',
      },
      
      // 添加新的断点
      screens: {
        '3xl': '1600px',
      },
      
      // 添加新的动画
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      
      // 添加新的关键帧
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    }
  }
}
```

### 主题配置选项详解

#### 颜色配置

```javascript
module.exports = {
  theme: {
    colors: {
      // 简单颜色
      white: '#ffffff',
      black: '#000000',
      
      // 颜色调色板
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      
      // 使用 CSS 变量
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
    }
  }
}
```

#### 间距配置

```javascript
module.exports = {
  theme: {
    spacing: {
      px: '1px',
      0: '0px',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      // ... 更多间距值
    }
  }
}
```

#### 字体配置

```javascript
module.exports = {
  theme: {
    fontFamily: {
      sans: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
      ],
      serif: [
        'ui-serif',
        'Georgia',
        'Cambria',
        '"Times New Roman"',
        'Times',
        'serif',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        '"SF Mono"',
        'Consolas',
        '"Liberation Mono"',
        'Menlo',
        'monospace',
      ],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    }
  }
}
```

## 其他重要配置选项

### 深色模式配置

```javascript
module.exports = {
  darkMode: 'class', // 'media' | 'class' | false
  // ...
}
```

### 前缀配置

```javascript
module.exports = {
  prefix: 'tw-',
  // 生成的类名将是 tw-bg-blue-500, tw-text-white 等
}
```

### 重要性配置

```javascript
module.exports = {
  important: true, // 或者 '#app'
  // 所有工具类都会添加 !important
}
```

### 分隔符配置

```javascript
module.exports = {
  separator: '_',
  // 修饰符分隔符从 : 改为 _
  // hover:bg-blue-500 变成 hover_bg-blue-500
}
```

## 配置文件最佳实践

1. **模块化配置**：将大型配置拆分为多个文件
2. **使用 TypeScript**：获得更好的类型提示和错误检查
3. **版本控制**：将配置文件纳入版本控制
4. **文档化**：为自定义配置添加注释说明
5. **测试配置**：确保配置更改不会破坏现有样式

## 配置验证

Tailwind 会在构建时验证配置文件，常见错误包括：

- 无效的颜色值
- 重复的键名
- 错误的文件路径
- 语法错误

确保配置文件语法正确，并使用适当的值类型。