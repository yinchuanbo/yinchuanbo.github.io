---
title: "ESLint 忽略检查行和文件总结"
tag: "前端工程化"
time: 2024-09-01 15:21:24
---

## eslint 忽略某一行代码校验

如果你想让 ESLint 忽略特定行代码的校验，你可以使用行内注释来实现。

### 有以下两种方式：

**单行忽略：**

在你想要忽略的特定行代码之前，添加 `// eslint-disable-line rule-name` 注释。

如果你只想临时禁用所有规则，可以省略 `rule-name`。

```js
// 这一行将会被 ESLint 忽略校验
someCode(); // eslint-disable-line no-unused-expressions
```

或者，如果要忽略所有规则：

```js
// 这一行将会被 ESLint 完全忽略校验
someCode(); // eslint-disable-line
```

**下一行忽略**

如果你想忽略紧接在注释后面的那一行代码，可以使用 `// eslint-disable-next-line rule-name`。

```js
// eslint-disable-next-line no-unused-expressions
someCode(); // 这一行将不会被 no-unused-expressions 规则检查
```

同样，如果要忽略所有规则：

```js
// eslint-disable-next-line
someCode(); // 这一行将不会被任何规则检查
```

请注意，这些注释只会影响它们直接指定的行。

如果你需要在一个代码块或多行上禁用规则，可以使用区块级别的禁用注释：

```js
/* eslint-disable rule-name */
// 这里的一段代码都将不受 rule-name 规则的约束
someCode();
moreCode();
/* eslint-enable rule-name */
```

或者，禁用所有规则：

```js
/* eslint-disable */
// 这里的一段代码都将不受任何规则的约束
var ignoredVar = "This variable declaration won't be checked.";
/* eslint-enable */
```

使用这些注释时，请确保你有充分的理由忽略特定规则的检查，因为这可能隐藏潜在的问题。

## 注释方式

- 注释忽略 —— 块注释

```js
/* eslint-disable */
console.log("test");
/* eslint-enable */
```

- 注释忽略 —— 忽略指定规则项

```js
/* eslint-disable no-alert, no-console */
alert("test");
console.log("test");
/* eslint-enable no-alert, no-console */
```

- 注释忽略 —— 忽略整个文件

```js
/* eslint-disable */
alert("test");
alert("test");
alert("test");
alert("test");
```

- 注释忽略 —— 忽略整个文件中指定规则项

```js
/* eslint-disable no-alert */
// Disables no-alert for the rest of the file
alert("test");
```

- 注释忽略 —— 忽略当前行

```js
alert("test"); // eslint-disable-line
alert("test"); /* eslint-disable-line */
```

- 注释忽略 —— 忽略当前行中指定规则项（多个规则项用逗号隔开）

```js
alert("test"); // eslint-disable-line no-alert, quotes
alert("test"); /* eslint-disable-line no-alert */
```

- 注释忽略 —— 忽略当前行中指定规则项（多个规则项用逗号隔开）

```js
alert("test"); // eslint-disable-line no-alert, quotes
alert("test"); /* eslint-disable-line no-alert */
```

- 注释忽略 —— 忽略下一行

```js
// eslint-disable-next-line
alert("test");
/* eslint-disable-next-line */
alert("test");
```

- 注释忽略 —— 忽略下一行中指定规则项（多个规则项用逗号隔开）

```js
// eslint-disable-next-line no-alert, quotes
alert("test");
/* eslint-disable-next-line no-alert */
alert("test");
```

## eslintignore 方式（推荐）

在根目录新建 `.eslintignore` 文件

- 忽略单个文件

```bash
test.js
```

- 忽略以 `.test.js` 结尾的文件

```js
*.test.js
```

- 忽略某路径下所有的文件

```js
test/*
```

## vue eslint 语法检查报错忽略

在 Vue 项目中，如果你遇到了 ESLint 语法检查报错，并且希望忽略某些特定的规则或文件，你可以采取以下几种方式来配置 ESLint 以忽略这些报错：

- 使用 `.eslintignore` 文件

全局忽略文件或文件夹：在项目的根目录下创建或修改.eslintignore 文件，然后添加你希望忽略的文件或文件夹路径。例如，要忽略整个 `build` 文件夹和 `src/assets` 文件夹下的所有文件，可以这样写：

```bash
build
src/assets
```

忽略特定类型的文件：如果你想忽略特定文件夹内的特定类型文件，可以使用通配符，例如：

```bash
build/*.js
```

- 在代码中临时禁用 ESLint 检查

禁用整个文件：在文件的顶部添加注释来禁用整个文件的 ESLint 检查：

```js
/* eslint-disable */
// ...你的代码...
```

禁用特定行：在需要忽略的代码行上方添加单行注释来禁用该行的检查：

```js
// eslint-disable-next-line
console.log("这条语句将不会被 ESLint 检查");
```

禁用特定规则：如果你只想针对某个特定规则进行禁用，可以在注释中指定规则名：

```js
// eslint-disable-next-line no-console
console.log("这条console.log语句将不会因no-console规则而报错");
```

恢复 ESLint 检查：如果你在某个范围内禁用了 ESLint，可以用以下注释来恢复检查：

```js
/* eslint-enable */
```

- 修改 `.eslintrc` 配置

在项目的 .eslintrc.js 或 .eslintrc.json 配置文件中，你可以通过修改 rules 属性来改变特定规则的错误等级，甚至关闭它。例如，关闭 no-console 规则：

```json
{
  "rules": {
    "no-console": "off"
  }
}
```

你还可以在配置文件中添加 ignorePatterns 属性来忽略特定的文件或目录：

```json
{
  "ignorePatterns": ["dist/*", "*.test.js"]
}
```

请根据你的具体需求选择合适的方法来忽略 ESLint 报错。在进行配置时，务必谨慎，避免过度放宽规则，从而保持代码的一致性和高质量。
