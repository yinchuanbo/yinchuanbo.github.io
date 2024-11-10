---
title: "使用 PNPM workspace 创建 monorepo"
tag: "Monorepo"
time: 2024-11-10 10:29:33
---

## 使用的技术/功能

我们将要构建的 mono repo 将包含以下功能。这是我选择的工具集，欢迎根据你的偏好进行更改。

| 功能                      | 使用的技术  |
| ------------------------- | ----------- |
| Package manager           | PNPM        |
| Programming language      | Typescript  |
| Basic linting             | ESLint      |
| Code formatting           | Prettier    |
| Pre-commit hook validator | Husky       |
| Linting only staged files | lint-staged |
| Lint git commit subject   | commitlint  |

## PNPM 安装

- 如果你在系统中安装了最新的 v16.x 或更高版本的 Node.js，请使用以下命令启用 pnpm。

```sh
corepack enable
corepack prepare pnpm@latest --activate
```

- 如果你在本地系统中使用的是较低版本的 Node.js，请查看此页面以获取其他安装方法：[https://pnpm.io/installation](https://pnpm.io/installation)

## 仓库基本设置

- 如果需要，可以初始化 Git，并在 `README.md` 中添加一些信息以强制使用特定的 Node.js 版本。

```sh
mkdir pnpm-monorepo
cd pnpm-monorepo
pnpm init
git init
echo -e "node_modules" > .gitignore
npm pkg set engines.node=">=22.11.0" # 设置该项目使用的最低 node 版本
npm pkg set type="module"
echo "#PNPM monorepo" > README.md
```

- 通过在 `package.json` 文件中设置 `packageManager` 属性，指定此项目使用的最新 PNPM [版本](https://www.npmjs.com/package/pnpm)。

```sh
npm pkg set packageManager="pnpm@9.12.3"
pnpm -v
```

- 运行 `pnpm -v` 来检查是否正确安装了所需版本的 PNPM。如果系统中没有该版本，它将自动提示你从网络下载，直接输入 `y` 即可下载。

```sh
! Corepack is about to download https://registry.npmjs.org/pnpm/-/pnpm-9.12.3.tgz
? Do you want to continue? [Y/n]
```

## 代码格式化工具

我选择使用 [Prettier](https://prettier.io/) 来格式化代码。格式化有助于保持每个开发人员的代码风格一致。

### 安装步骤

让我们安装插件并设置一些默认配置。这里我将 `singleQuote` 设置为 `true`，你可以根据自己的偏好进行更新。

```sh
pnpm add -D prettier
echo '{\n  "singleQuote": true\n}' > .prettierrc.json
echo -e "coverage\npublic\ndist\npnpm-lock.yaml\npnpm-workspace.yaml" > .prettierignore
```

### VS Code 插件

- 如果你使用的是 VS Code，请导航到 `扩展` 并搜索 `Prettier - Code formatter`，然后安装该扩展。

Extension link: [https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

- 让我们更新工作区，设置 Prettier 为默认格式化工具，并在保存文件时自动格式化。

- 创建 VS Code 工作区设置的 JSON 文件，并更新以下内容。

```sh
mkdir .vscode && touch .vscode/settings.json
```

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Linting

Linter 静态分析你的代码，以快速发现问题。ESLint 是最常用的 JavaScript 代码 lint 工具。

### ESLint

```sh
pnpm create @eslint/config@latest
```

- ESLint 会根据你的需求询问一系列问题，以设置 linter，这是我为该项目选择的配置。

```sh
? How would you like to use ESLint? …
  To check syntax only
❯ To check syntax and find problems

? What type of modules does your project use? …
❯ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these

? Which framework does your project use? …
  React
  Vue.js
❯ None of these

Does your project use TypeScript? › No / Yes
- Yes

Where does your code run?
✔ Browser
  Node

The config that you`ve selected requires the following dependencies:
eslint, globals, @eslint/js, typescript-eslint

? Would you like to install them now? › No / Yes
- Yes

? Which package manager do you want to use? …
  npm
  yarn
❯ pnpm
  bun
```

更新 ESLint 配置，添加忽略列表，以便让 ESLint 知道哪些文件不需要格式化。

```js
/** @type {import('eslint').Linter.Config[]} */
export default [
  ...
  {
    // Note: there should be no other properties in this object
    ignores: ['coverage', '**/public', '**/dist', 'pnpm-lock.yaml', 'pnpm-workspace.yaml'],
  },
  ...
]
```

### 将 Prettier 与 ESLint 集成

Linter 通常不仅包含代码质量规则，还包括样式规则。在使用 Prettier 时，大多数样式规则是不必要的，而且更糟的是，它们可能与 Prettier 冲突！

我们将使用 Prettier 来处理代码格式化问题，使用 Linter 来处理代码质量问题。因此，接下来我们将让 Linter 运行 Prettier 的样式规则。

- 安装必要的插件

```sh
pnpm add -D eslint-config-prettier eslint-plugin-prettier
```

- 添加`eslintPluginPrettierRecommended`作为数组中的**最后一个元素**。

```js
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  //  ...,
  eslintPluginPrettierRecommended,
];
```

有关更多信息，请参阅：[https://prettier.io/docs/en/integrating\-with\-linters.html](https://prettier.io/docs/en/integrating-with-linters.html)

- 让我们在 `package.json` 文件中创建运行 linter 和 prettier 的脚本。

```sh
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.format="prettier --write ."
```

- 运行 `pnpm lint` 命令以运行 ESLint，运行 `pnpm format` 命令以格式化文件。

## Pre-commit hook 提交验证

即使我们添加了所有这些 linter 和格式化机制来维护代码质量，我们也不能指望所有开发人员使用相同的编辑器，并在推送代码时每次都执行 `lint` 和 `format` 命令。

为了实现自动化，我们需要某种提交前钩子验证。这时，[husky](https://typicode.github.io/husky/) 和 [lint\-staged](https://www.npmjs.com/package/lint-staged) 插件就派上用场了，让我们安装并配置它们。

- 安装 `husky`、`commitlint` 和 `lint-staged` NPM 包，并按如下方式初始化它们：

```sh
pnpm add -D @commitlint/cli @commitlint/config-conventional
echo -e "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.mjs
pnpm add -D husky lint-staged
pnpm exec husky init
echo "pnpm lint-staged" > .husky/pre-commit
echo "npx --no -- commitlint --edit \${1}" > .husky/commit-msg
```

- 更新 `package.json` 文件，并包含以下属性。这将对所有脚本文件运行 ESLint，对其他文件运行 Prettier。

```sh
"lint-staged": {
  "**/*.{js,ts,tsx}": [
    "eslint --fix"
  ],
  "**/*": "prettier --write --ignore-unknown"
},
```

## Workspace 配置

- 创建 `pnpm-workspace.yaml` 文件并添加以下内容配置：

```sh
touch pnpm-workspace.yaml
```

```sh
packages:
  - 'apps/*'
  - 'packages/*'
```

- 在根目录下创建 `apps` 和 `packages` 目录。

```sh
mkdir apps packages
```

### 示例包 - Common

- 创建一个示例包，可以在工作区的应用程序中使用。

```sh
cd packages
pnpm create vite common --template vanilla-ts
cd ../
pnpm install
npm pkg set scripts.common="pnpm --filter common"
```

- 更新 `main.ts` 文件，添加以下内容以创建一个简单的 `isBlank` 工具函数。

```js
/* eslint-disable @typescript-eslint/no-explicit-any */
export const isEmpty = (data: any) => data === null || data === undefined;

export const isObject = (data: any) => data && typeof data === "object";

export const isBlank = (data: any) =>
  isEmpty(data) ||
  (Array.isArray(data) && data.length === 0) ||
  (isObject(data) && Object.keys(data).length === 0) ||
  (typeof data === "string" && data.trim().length === 0);
```

- 删除示例文件

```sh
cd packages/common
rm -rf src/style.css src/counter.ts .gitignore
cd ../../
```

### 库模式

Vite 默认在应用模式下构建资产，以 `index.html` 作为入口文件。但我们希望我们的应用将 `main.ts` 文件作为入口文件，因此我们需要更新 Vite 配置以支持这一点。

- 在此之前，让我们安装 Vite 包，以便从库自动生成类型定义。

```sh
pnpm common add -D vite-plugin-dts
```

- 创建 `vite.config.ts` 文件，并按如下方式更新：

```sh
touch packages/common/vite.config.ts
```

```ts
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: { lib: { entry: resolve(__dirname, "src/main.ts"), formats: ["es"] } },
  resolve: { alias: { src: resolve("src/") } },
  plugins: [dts()],
});
```

`resolve` 属性帮助我们使用绝对导入路径而不是相对路径。例如：

```sh
import { add } from 'src/utils/arithmetic'
```

- 更新 `common` 包的 `package.json` 文件，添加我们脚本的入口文件以及类型定义。

```js
{
 ...
 "main": "./dist/common.js",
 "types": "./dist/main.d.ts",
}
```

### 示例应用 - Web app

- 创建一个示例应用，能够使用工作区中的 `common` 包

```sh
cd apps
pnpm create vite web-app --template react-ts
cd ../
pnpm install
npm pkg set scripts.app="pnpm --filter web-app"
```

- 通过更新 `web-app` 的 `package.json` 文件，将 `common` 包安装为依赖。

```js
"dependencies": {
 "common": "workspace:*",
 ...
}
```

- 再次运行 `pnpm install`，以便 `web-app` 可以创建指向工作区中 `common` 包的符号链接。
- 运行 `pnpm common build`，以便 `web-app` 服务器可以找到 `common` 包。
- 如下所示更新 `App.tsx`：

```tsx
import { isBlank } from "common";

const App = () => {
  return (
    <>
      <p>undefined isBlank - {isBlank(undefined) ? "true" : "false"}</p>
      <p>false isBlank - {isBlank(false) ? "true" : "false"}</p>
      <p>true isBlank - {isBlank(true) ? "true" : "false"}</p>
      <p>Empty object isBlank - {isBlank({}) ? "true" : "false"}</p>
    </>
  );
};

export default App;
```

- 运行 `pnpm app dev` 并检查 `common` 包的工具是否成功链接到应用程序。

就是这样，我们已经成功从头开始创建了一个支持 TypeScript 的 PNPM 单体仓库。

## 开发模式

大多数情况下，只需要构建一次公共包，并在仓库的应用程序中使用它即可。但如果你在公共包中进行频繁修改，并希望在 `web-app` 中立即看到这些更改，那么你不可能每次修改都重新构建公共包。

为避免这种情况，我们可以让公共包以监视模式运行，这样代码中的任何更改都会自动重建，并实时反映在 `web-app` 中

- 在不同的终端中运行这些命令

```sh
pnpm common build --watch
pnpm web-app dev
```

### Linter 更新

- 现在我们的 mono-repo 中有一个 TypeScript 工具库和一个 React 应用程序。在 ESLint v9.x 版本中，ESLint 团队建议为所有包保留一个统一的 linter 配置文件，但这与 monorepo 架构并不兼容，详见[讨论](https://github.com/eslint/eslint/discussions/16960)以获取更多信息。ESLint 团队已意识到这一点，并构建了一个实验性功能来支持多个配置文件，该功能将在 v10.x 中变为稳定版本。你可以启用该[功能](https://eslint.org/docs/latest/use/configure/configuration-files#experimental-configuration-file-resolution)并试用，但对于生产应用程序，不推荐这样做。

- 因此，目前我们将尝试将使用 Vite 启动模板创建的 Web 应用程序 lint 配置合并到根配置文件中，方法是将 Web 应用程序中的 lint 依赖移动到根目录，并更新配置文件。

```bash
pnpm add -D -w eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-react
pnpm app remove eslint-plugin-react-hooks eslint-plugin-react-refresh eslint @eslint/js globals typescript-eslint
```

- 这就是最终的 eslint 配置的样子

```jsx
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
  },
  {
    // Note: there should be no other properties in this object
    ignores: ['coverage', '**/public', '**/dist', 'pnpm-lock.yaml', 'pnpm-workspace.yaml'],
  },
  {
    files: ['apps/web-app/**/*.{ts,tsx}'],
    settings: { react: { version: '18.3' } },
    languageOptions: {
      // other options...
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: './apps/web-app',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
]
```

- 可以随意删除 web-app 包中的 `eslint.config.js`，因为它不再需要了，或者可以将其注释掉并保留以供参考。

- 查看 Vite 创建的 Web 应用程序中的 Readme.md 文件，并根据需要遵循其中的建议。


github: https://github.com/vinomanick/pnpm-monorepo-v2

youtube: https://www.youtube.com/watch?v=pz4f9Q6VYZA