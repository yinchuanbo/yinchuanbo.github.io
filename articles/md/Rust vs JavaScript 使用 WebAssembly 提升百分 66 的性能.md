---
title: "Rust vs JavaScript 使用 WebAssembly 提升 66% 的性能"
tag: "性能优化"
time: 2025-01-04 18:23:17
---

在现代 Web 开发中，性能优化始终是开发者关注的重点。你是否曾经在浏览器中体验过页面卡顿，甚至 UI 元素的“死机”现象？尤其是在进行复杂计算时，JavaScript 通常会将所有工作集中在单线程上，导致页面的响应延迟，影响用户体验。有没有可能既保持计算的高效，又避免界面冻结？答案是肯定的——WebWorkers 和 WebAssembly，特别是 Rust，提供了非常有效的解决方案。

## 问题：JavaScript 阻塞主线程

JavaScript 默认运行在浏览器的单线程环境中，这意味着它一次只能做一件事。当执行一个复杂的计算（比如计算斐波那契数列）时，它会占用所有的 CPU 资源，直到任务完成。这时，用户界面的渲染、交互，甚至页面的动画，都将被阻塞，造成明显的卡顿。你可能已经遇到过这种情况，当你点击一个按钮执行计算时，UI 上的其他元素（如加载动画）无法正常显示，页面变得“死板”。

为了展示这种问题的严重性，我们使用经典的斐波那契算法，时间复杂度为 O(2^n)，用来模拟这种阻塞情况：

```js
const calculateFibonacci = (n) => {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
};
```

在单线程模式下，我们直接在主线程中执行斐波那契算法。当点击“计算斐波那契”按钮时，计算开始进行。然而，由于计算量大，主线程被完全占用，导致 UI 无法更新。你会发现加载动画（spinner）根本没有显示出来，而是等计算完成后才显示结果。通过 Chrome DevTools 的性能工具，我们可以看到，主线程在进行斐波那契计算时被阻塞了约 2.06 秒，整个界面无法响应，影响了用户体验。

```js
"use client";
import { useState } from "react";

/**
 * simulate loading animation
 */
function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}

export default function Home() {
  const [result, setResult] = (useState < number) | (null > null);
  const [isLoading, setIsLoading] = useState < boolean > false;

  const calculateFibonacci = (n: number): number => {
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
  };

  const handleCalculate = () => {
    setIsLoading(true);
    /**
     * simulate a long-running calculation
     */
    const result = calculateFibonacci(42);
    setResult(result);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <button
        onClick={handleCalculate}
        className="mb-8 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Calculate Fibonacci
      </button>
      {isLoading ? <Spinner /> : <p className="text-xl">Result: {result}</p>}
    </div>
  );
}
```

## 第一种优化：Web Workers

为了避免主线程阻塞，可以通过 Web Workers 将计算任务移到一个单独的线程执行。Web Worker 能够在后台线程中运行代码，这样主线程可以继续处理 UI 更新和用户交互，确保页面不会冻结。使用 Web Worker，我们可以把斐波那契计算放到一个单独的线程中，不再阻塞主线程。

```js
self.addEventListener("message", function (e) {
  const n = e.data;

  const fibonacci = (n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };

  const result = fibonacci(n);
  self.postMessage(result);
});
```

通过这种方式，计算仍然需要大约 2 秒钟，但由于计算已经移到 Web Worker 线程，主线程得以继续运行，UI 更新不再被阻塞，用户能够看到加载动画。虽然 UI 变得流畅，但性能提升有限。

## 第二种优化：WebAssembly — AssemblyScript

WebAssembly（Wasm）是一种在浏览器中运行的二进制格式，它能够将 C、C++、Rust 等语言编译成浏览器能理解的代码，并在浏览器中以接近原生的速度运行。对于大多数前端开发者来说，AssemblyScript（一个类似 TypeScript 的 WebAssembly 语言）是一个理想的选择。它的开发体验与 TypeScript 非常相似，容易上手。

```js
export function fibonacci(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

通过 WebAssembly，尽管计算仍然是在主线程中执行，但性能大幅提升。斐波那契计算的时间减少到大约 950ms，比纯 JavaScript 快了 53%。

## 第三种优化：WebAssembly — Rust

如果你对性能有更高的要求，Rust 是目前在 WebAssembly 中最受欢迎的语言之一。Rust 的设计目标是高性能，并且它提供了强大的内存安全保障。我们将斐波那契算法用 Rust 编写，并通过 WebAssembly 编译成 .wasm 文件：

```bash
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
```

通过这种方式，尽管计算依然是在主线程中进行，但斐波那契算法的执行时间缩短到了 684ms，比 JavaScript 快了 66%。

## 总结：性能大提升

JavaScript 的单线程特性在处理复杂计算时显得力不从心，容易导致页面卡顿。Web Workers 通过将计算任务移到后台线程缓解了这个问题，但性能提升有限。而 WebAssembly，尤其是 Rust 编写的 WebAssembly，能够提供极为显著的性能提升，极大改善了计算效率和用户体验。如果你希望你的 Web 应用更快、更流畅，WebAssembly 和 Rust 无疑是值得尝试的技术方案！
