---
title: "哪个 css 格式化工具是你的首选"
tag: "Css"
time: 2025-01-02 10:51:24
---

## PurifyCSS

PurifyCSS 是一个轻量级的 CSS 清理工具，可以帮助您从代码库中删除未使用的 CSS，减少文件大小并提高网站性能。它扫描 HTML、JavaScript 和模板文件，保留项目正在使用的样式。

### 优点：

**轻量级和快速**：生成优化的 CSS 文件，并显着减少大小。

**可定制**：通过可定制的配置，轻松适应特定的项目要求。

**与构建工具集成**：与 Grunt、Gulp 和 Webpack 等工具无缝协作，使其适合现代开发工作流。

### 局限性：

**设置复杂性**：这对初学者来说可能是一个挑战。

**动态内容处理**：处理动态添加的样式，类似于 UnCSS 等其他工具。您可能需要手动指定要保留的样式。

这里有一个关于如何使用它的快速教程：

### 步骤 1：设置环境

创建一个新的项目文件夹，并在其中创建两个文件：`index.html`和`style.css`。

### 步骤 2：安装 PureCSS

将以下`<link>`标记添加到`index.html`文件的`<head>中`：

```html
<link rel="stylesheet" href="purecss@3.0.0/build/pure-min.css" />
<!-- https://unpkg.com/purecss@3.0.0/build/pure-min.css -->
```

或者，如果你使用的是 Node.js，可以通过 npm 安装：

```sh
npm install purecss
```

### 第 3 步：向 HTML 和 CSS 文件添加内容

将以下代码添加到`index.html`文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>PureCSS Example</title>
  </head>
  <body>
    <h1>Welcome to PureCSS!</h1>
    <p>This is a simple PureCSS demonstration.</p>
    <button class="pure-button pure-button-primary">Click Me</button>
  </body>
</html>
```

将以下代码添加到`style.css`文件：

```css
body {
  font-family: Verdana, sans-serif;
  background-color: lavenderblush;
  margin: 20px;
}

h1 {
  color: darkslateblue;
  text-align: center;
}

p {
  color: dimgray;
  text-align: center;
  font-size: 18px;
}

button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
}
```

### 步骤 4：实现 PurifyCSS 功能

在项目的根目录下创建一个`cssPurifier.js`文件，并添加以下代码：

```js
const purify = require("purify-css");

const content = ["*.html"];
const css = ["*.css"];

const options = {
  output: "cleanedStyles.css",
  minify: true,
  info: true,
};

purify(content, css, options, function (result) {
  console.log("Purified and Minified CSS:\n", result);
});
```

此脚本识别未使用的 CSS 类，并生成一个新文件`cleanedStyles.css`，其中包含优化的样式。

### 第 5 步：运行 PurifyCSS

要执行 PurifyCSS 脚本，请在项目终端运行：

```sh
node cssPurifier
```

运行此命令后，将创建一个名为`cleanedStyles.css的`新文件，其中包含优化后的 CSS。

## UnCSS

UnCSS 是一个强大的工具，删除未使用的 CSS，减少文件大小和提高网站性能。它会扫描您的 HTML 文件或网页，以识别和消除不必要的样式，确保您的项目保持高效和轻量级。

### 优势：

**多功能性**：可与本地文件和实时 URL 一起使用。

**工作流集成**：与 Gulp、Grunt 和 Broccoli 等构建工具无缝集成。

**自定义**：允许使用`ignore`选项保留动态添加的特定样式。

### 局限性：

**动态样式**：与 JavaScript 注入的样式发生冲突，需要手动干预才能保留它们。

**非 HTML 页面**：模板或脚本（如 PHP）需要静态 HTML 表示，因为它不能直接处理它们。

这里有一个如何使用 UnCSS 的快速教程：

### 步骤 1：安装

可以使用 npm 或 yarn 轻松安装 UnCSS：

```sh
npm install uncss --save-dev
# or
yarn add uncss --dev
```

### 第二步：使用

我们现在可以使用 UnCSS 来清理我们在前面的例子中创建的 CSS 文件。

```js
const unCss = require("uncss");

const files = ["index.html"];

const options = {
  stylesheets: ["style.css"],
};

unCss(files, options, (error, output) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(output);
});
```

## Stylelint

Stylelint 是一个多功能的 CSS linter，它确保在你的样式表中保持一致的编码约定，同时捕捉 CSS、SCSS 潜在错误。通过保持干净和标准化的样式，它提高了代码质量，减少了错误，并最大限度地减少了冗余。

### 优点：

**全面的**：排除 CSS 中可能导致错误或效率低下的问题。

**可定制的规则**：允许您根据项目的要求定制规则，确保灵活性。

**插件支持**：通过各种插件扩展特定用例的功能。

**现代 CSS 支持**：与现代 CSS 功能以及 SCSS 等预处理器完全兼容。

**无缝集成**：与编辑器、构建工具和版本控制系统无缝集成，以简化工作流程。

### 局限性：

**初始设置**：需要配置以满足特定的项目需求，这对于新用户来说可能需要时间。

**学习曲线**：在大型项目中，掌握高级规则和插件可能很复杂。

按照以下步骤将 Stylelint 集成到您的项目中：

### 步骤 1：安装 Stylelint

开始，使用 npm 或 yarn 将 Stylelint 添加到项目中：

```sh
npm install stylelint --save-dev
# or
yarn add stylelint --dev
```

### 步骤 2：设置配置

在项目根目录中创建`. stylelintrc.json`文件以定义 linting 规则。下面是一个示例配置：

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "declaration-colon-space-after": "always",
    "indentation": 2,
    "max-empty-lines": 2,
    "unit-whitelist": ["em", "rem", "%", "s"]
  }
}
```

- `extends`字段表示一组标准规则。
- `rules`部分允许定制以满足项目的需要。

### 第三步：压缩 CSS

对 CSS 文件运行 Stylelint 以分析和修复问题。对于`src`目录中的文件:

```sh
npx stylelint "src/**/*.css"
```

如果您的项目没有`src`文件夹，请调整命令：

```sh
npx stylelint "**/*.css"
```

检查 linting 输出并根据需要调整`. stylelintrc.json`文件中的规则，以满足项目的要求。您还可以使用`--fix`标志自动修复常见问题：

```sh
npx stylelint "src/**/*.css" --fix
```

## 在线 CSS 清理工具

如果你正在寻找快速修复的轻量级解决方案，在线 CSS 清理工具，如 CleanCSS，Tabifier 和 W3C CSS Validator 提供了方便的支持。

### CleanCSS

CleanCSS 是一个轻量级的，基于浏览器的工具。格式化压缩和清理 CSS 代码。非常适合小型项目。

#### 优点：

**用途**：直接在浏览器中运行，无需安装。

**自定义**：允许您配置压缩级别并指定要删除的内容，如注释或冗余属性。

**即时结果**：快速处理您的 CSS，使其成为快速优化的理想选择。

#### 局限性：

**缺乏高级功能**：不提供 linting，错误检测或与构建工作流的集成，使其不太适合更大，更复杂的项目。

**手动工作流程**：每次优化都需要重复手动输入，非常繁琐。

### Tabifier

Tabifier 是一个直观的在线工具，用于优化和格式化代码，支持 CSS，HTML 和 C 风格语言。通过提供一致的缩进和结构，它提高了代码的可读性，使其更容易使用。

#### 优点：

**多语言支持**：适用于 CSS、HTML 和 C 风格语言。

**使用简单**：粘贴代码，点击“Tabify”，立即获得格式良好的输出。

**专注于可读性**：非常适合重新格式化压缩或无组织的代码，以便于编辑和调试。

#### 局限性：

**缺乏高级功能**：不包括 linting，错误检测或代码验证。

**有限的自动化**：不太适合重复性或大规模的任务。

### W3C 的 CSS Validator

W3C CSS Validator 是一个广泛使用的在线工具，根据官方标准验证 CSS 代码。它通过检测 CSS 中的错误、不推荐使用的属性和潜在问题，帮助维护干净和符合标准的样式表。

#### 优点：

**符合标准**：确保您的 CSS 符合 W3C 规范，促进最佳实践。

**错误检测**：检测无效属性、拼写错误和可能影响布局功能的问题。

**详细反馈**：提供全面的报告，以帮助优化代码。

**灵活的输入**：允许文件上传，代码粘贴或实时网站的 URL 进行验证。

#### 局限性：

**专注于验证**：Priority 检查代码质量，但不提供格式化或清理功能。

**无自动化**：需要手动输入，因此不太适合持续集成工作流。

原文：[dev.to/codeparrot/…](https://dev.to/codeparrot/css-cleanup-tools-top-picks-for-cleaner-faster-code-34p6)
