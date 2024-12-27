---
title: "前端 Money 类"
tag: "JavaScript"
time: 2024-12-27 15:18:18
---

请知晓前端金额处理的风险，前端计算结果只用于展示，最终以服务端为准，即服务端仍然会做计算和校验，当计算与前端不一致将会明确提示用户。

适用：小程序 / H5 / PC / Node.js。

## 背景

- 计算的需求：从用户体验出发不可否认存在前端实时计算、比较或格式化的诉求，我们不能做鸵鸟置迫在眉睫正在发生的现实不顾。
- 不统一的风险：有使用社区  [numeral](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fnumeral)、[decimal.js](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMikeMcl%2Fdecimal.js)、[bignumber.js](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMikeMcl%2Fbignumber.js)，有业务自研的，各种包质量、体积、API 风格不一。通过统一来规避选包等不确定性风险，底层使用久经考验的充分调研的 [big.js](https://www.npmjs.com/package/big.js)（计算）、[currency.js]("https://www.npmjs.com/package/currency.js)（格式化）。

> currency.js 虽具备计算能力但因其计算有本质缺陷故仅取其格式化能力。

## 哪些场景算前端金额计算

| **分类**       | **示例**                                        | **场景**                      |
| -------------- | ----------------------------------------------- | ----------------------------- |
| **计算**       |                                                 |                               |
| 加减乘除幂运算 | `0.1+0.2` `0.3-0.1` `0.1*0.7` `0.35/100` `2**3` | AA 分摊、总价、单位换算...... |
| 四舍五入       | `1.235 => 1.24`                                 |                               |
| 比较           | `===` `>` `>=` `<` `<=`                         | 表单校验                      |
| **展示**       |                                                 |                               |
| 格式化         | `1000` => `1,000.00`                            | 金额页面展示                  |

## 特色

- 相比 decimal.js 体积更小，适合移动端（使用  [big.js](https://www.npmjs.com/package/big.js)）。
- 能力对齐的基础上添加更多常用计算场景 API。
- 鲁棒性：保证运行时安全。
- 其他：
  - 更先进的 API 设计：支持 rust 风格的错误处理，保证错误不遗漏一定被处理。
  - 更符合『人体工程学』的 API 设计。
  - 从 API 层面强调前端计算风险意识。

## 设计思路

### API 角度强制开发者签署风险申明

因为前端金额计算是红线，调用前必须『签署』前端金额计算风险协议方可使用。即 API 设计必须主动赋值 `Money.oath = I_KNOWN_THE_RISK`。

### 简单可用

- 尽量使用专业名词。如加减乘除  `add` / `subtract` / `multiply` / `divide`  而非  `plus / minus / times / div`；
- 尽量用全称，约定俗成除外。如  `comparesTo`而非  `cmp`，`equals`而非  `eq`。约定俗成采用 `lt` `lte` `gt` `gte`。
- 封装常用场景 API。比如 AA（[splitBill](https://link.juejin.cn/?target=todo "todo")）、累加（[sum](https://link.juejin.cn/?target=todo "todo")）、购物车计算总价（[sumTotalPrice](https://link.juejin.cn/?target=todo "todo")）。

### 健壮性之运行时安全

- 默认不抛错，返回 null 。null 表示一个预期的终值，undefined 表示还未赋值，故选择  `null`；

  - 统一 format 和计算逻辑的异常处理，即非法数字返回 null 而非 "0.00"；

- immutable：后端 money 类为了性能考虑实现了 mutable 版本 API，但会导致很多隐蔽的 bug。
- 兼容性考虑。big.js 语法采用 ES3，currency.js 使用了 Android 4.4 不支持的  `Object.assign`方法，若 webview 降级到 4.4 版本以下的原生浏览器，则可能无法使用。
- 保证单测覆盖率 +99%

### 选择最可靠的依赖包

- big.js 周下载 2000W，是 bignumer.js 和 decimal.js 作者

### 代码包体积足够小

- 移动端考虑选择 big.js 而非 bignumber.js 或 decimal.js，因为前者体积最小 7KB；
- 依赖的 big.js 和 format 库 currency.js 都是 0 依赖；
- format 单独文件。如果只是做格式化可按需引入，只会增大 1KB。

## 注意

在性能和稳定性我们选择实现 immutable 而非 mutable 的 API（`mutiply`：immutable, `multiplyBy`：mutable），因为会导致很多隐蔽的 bug，比如：

```js
const total = Money.from("0.3");
const part = total.subtract("0.1");
const remaining = total.subtract(part);

// 预期计算完毕：total = 0.3, part = 0.2, remaining = 0.1
// 实际：total = 0, part 0, remaining = 0

// 实际执行过程分析。因为三个变量其实是一个实例 total === part === remaining
const total = Money.from("0.3"); // 0.3
const part = total.subtract("0.1"); // 0.3 - 0.1 = 0.2 (total和part)
const remaining = total.subtract(part); // 0.2 - 0.2 = 0 (total和part和remaining)
```

## 使用

```js
import { Money } from "money.js"; // 尚未发布
```

### 计算

加减乘除幂运算。

**加法**

```js
// result 类型 `null | string`
const result = Money.from("0.1").add("0.2").toString();

// 计算失败则返回 null，比如传入非法数字
if (result !== null) {
  setSum(result);
}
```

**支持级联**

js

```js
const result = Money.from("0.1").add("0.2").multiply("10").toString();
// => '3'
```

### 比较

`compareTo, equals, lt, lte, gt, gte`

```js
Money.from("10.5").equals(Money.from("10.50")); // true
// equals, lt, lte, gt, gte
```

### 格式化

```js
import { format } from 'money.js/format';

// 单独 format docs.antfin-inc.com limo-core ~ format - 1KB
format('3500') // => '3,500.00'
format('3500', { precision: 0 }) => '3,500'
format('3,500.149', { separator: '' }) => '3500.15'

// 或
Money.from('3500').format() // => '3,500.00'

```

详见 [Money ~ format](https://link.juejin.cn/?target=todo "todo")。

### 高阶用法

**throwsException**

应用场景：需要捕获错误，比如计算失败需要上报监控。

```js
Money.setThrowsException(true);

let result: string;

try {
  result = Money.from(resp.number1).add(resp.number2).toString();
} catch (error) {
  // 上报监控
  monitor.error(`计算失败`, { error, resp });

  return;
}
```

**常用场景计算方法**

静态方法  `sum` `sumTotalPrice`和 AA 付款：`splitBill`。

```js
Money.sum(["0.1", "0.2", "0.3"]).toString();
// => '0.6'
```

```js
Money.sumTotalPrice([
  { price: 0.1, count: 1 },
  { price: 0.2, count: 1 },
]).toString();
// => '0.3'
```
