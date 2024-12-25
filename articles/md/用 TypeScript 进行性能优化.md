---
title: "用 TypeScript 进行性能优化"
tag: "TypeScript"
time: 2024-12-25 21:58:24
---

在 TypeScript 的领域中，性能优化并非仅仅局限于让代码执行得更快 —— 而是关乎于编写稳固、具备扩展性以及易于维护的解决方案，这些方案要能够经得起时间的检验。本文全方位深入地剖析了 TypeScript 性能优化的诸多层面，为您提供了诸多技巧、技术以及示例，旨在保证您的应用程序既具备高效性又富有成效。

## 1.对 TypeScript 编译的优化

**「增量编译」**

TypeScript 是支持增量编译的，只有那些发生更改的文件才会被重新编译。这在极大程度上缩减了大型项目的构建时间。

**「如何启用」**：

在您的`tsconfig.json`文件中添加`"incremental": true`

```json
{
  "compilerOptions": {
    "incremental": true
  }
}
```

- **「好处」**：能够显著加快构建速度，尤其是在 CI/CD 管道当中。

**「使用`--skipLibCheck`」**

倘若您未曾对外部库进行修改，那么可以跳过对它们的类型检查：

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

- **「原因」**：通过规避对外部包的冗余类型检查，从而减少编译时间。

## 2\. 高级类型推断

TypeScript 的类型推断既有利也有弊。过度运用显式类型，可能会拖慢编译器的速度，并且让您的代码变得杂乱无章。

**「示例」**

```ts
const numbers = [1, 2, 3, 4]; // TypeScript 推断为 `number[]`
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 推断为 `number`
```

- 技巧：除非确实有必要，否则相信编译器去推断类型。

**「避免过度复杂的类型」**

尽量将类型进行简化，以此来降低认知负担并提升编译性能：

```ts
// 过于复杂
type NestedArray<T> = T | NestedArray<T>[];

// 针对特定情况简化
type NestedNumberArray = number | NestedNumberArray[];
```

## 3\. 利用实用类型

TypeScript 提供了内建的实用类型，像是`Pick`、`Omit`、`Partial` 以及`Required`。这些实用类型能够精简您的代码，同时增强可维护性。

**「示例」**：使用`Omit` 而非手动排除属性：

```ts
type User = {
  id: number;
  name: string;
  email: string;
};
type UserWithoutEmail = Omit<User, "email">;
```

**「性能提升」**：减少冗余代码，并借助 TypeScript 的优化实用工具。

## 4\. 使用 TypeScript 进行 Tree Shaking

Tree Shaking 在打包的过程中会去除未被使用的代码。采用 TypeScript 的 ES 模块输出（`"module": "ESNext"`），以保证与 Webpack 或者 Rollup 等打包器的兼容性。

**「配置：」**

```ts
{
  "compilerOptions": {
    "module": "ESNext"
  }
}
```

**「原因」**：确保打包器能够识别并移除无用代码，减小包的大小。

## 5\. 针对运行时性能优化

尽管 TypeScript 属于一个编译时工具，但其特性能够间接对运行时性能产生影响。

**「避免过度使用类型断言」**

类型断言（`as` 或`<Type>`）倘若过度使用或者使用不当，有可能会引发运行时错误：

```ts
// 有风险
const someValue: any = "hello";
const stringLength = (someValue as string).length; // 不安全
```

- **「技巧」**：使用类型守卫来确保安全：

```ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

**「优先使用 Readonly 以实现不可变性」**

使用`Readonly` 来强制不可变性，这有助于防止意外的副作用：

```ts
const config: Readonly<{ port: number; debug: boolean }> = {
  port: 3000,
  debug: true,
};

// config.port = 4000; // 错误
```

## 6\. 内存优化

大型的 TypeScript 项目或许会面临高内存使用的难题。通过以下的实践方式来缓解这一问题：

- **「限制类型范围」**：避免使用过于宽泛或者通用的类型，因为这类类型需要进行深度的推断。
- **「模块化」**：把大型文件分割成规模更小、更具专注性的模块。

## 7\. 调试和性能分析

高效的调试能够节省数小时的开发时间：

运用 TypeScript 的`sourceMap` 选项，在调试的过程中清晰地映射 TS 和 JS：

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

## 8\. 高级 TypeScript 特性

**「条件类型」**根据条件优化逻辑：

```ts
type Result<T> = T extends string ? string[] : number[];
const example: Result<string> = ["a", "b"]; // 推断为 string[]
```

**「模板字面量类型」**通过动态字符串模式增强类型安全性：

```ts
type EventName = `on${Capitalize<string>}`;
```

## 9\. 技巧和窍门

- **「尽可能优先运用接口而非类型」** 来对对象进行定义，原因在于接口在性能和可扩展性方面表现更为出色。
- **「使用懒加载」**：将类型划分到单独的文件里，并仅仅在有需要的时候进行加载。
- **「工具」**：采用 TypeScript 专属的工具，例如`ts-prune`，用以识别未被使用的导出，从而保持代码的整洁。

> 原文地址：https://dev.to/shafayeat/performance-optimization-with-typescript-dcj
