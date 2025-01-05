---
title: "Zustand 让 React 状态变得太简单"
tag: "React"
time: 2025-01-04 21:51:41
---

## 为什么选择 Zustand?

Zustand 是一个为 React 打造的现代化状态管理库,它以其简洁的 API 和强大的功能正在改变前端开发的方式。相比 Redux 繁琐的样板代码(action types、dispatch、Provider 等),Zustand 提供了更加优雅且直观的解决方案。

## 核心特性

### 1\. 基于 Hook 的简洁 API

```jsx
import { create } from "zustand";

// 创建 store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 在组件中使用
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  return <button onClick={increment}>{count}</button>;
}
```

### 2\. 灵活的状态订阅

Zustand 允许组件只订阅它们需要的状态片段,从而优化性能:

```jsx
// 只订阅特定字段
const userName = useStore((state) => state.user.name);
const userAge = useStore((state) => state.user.age);
```

### 3\. 去中心化的状态管理

不同于 Redux 的单一状态树理念,Zustand 支持创建多个独立的 store,更符合组件化开发的思想:

```jsx
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
}));
```

### 4\. 派生状态与浅比较

通过 `useShallow()` 可以轻松创建派生状态:

```jsx
import { useShallow } from "zustand/shallow";

// 当任意原始状态变化时更新
const { name, age } = useStore(
  useShallow((state) => ({
    name: state.user.name,
    age: state.user.age,
  }))
);
```

### 5\. 异步操作支持

内置支持异步 action,无需额外的中间件:

```jsx
const useStore = create((set, get) => ({
  users: [],
  fetchUsers: async () => {
    const response = await fetch("/api/users");
    const users = await response.json();
    set({ users });
  },
}));
```

### 6\. 状态更新控制

支持细粒度的状态更新控制:

```jsx
// 部分更新(默认行为)
set({ user: { ...get().user, name: "John" } });
// 完全替换
set({ user: { name: "John" } }, true);
```

### 7\. 直接访问状态

除了 hooks,还支持直接订阅状态变化:

```jsx
const store = create(...)
const unsubscribe = store.subscribe(state => {
  console.log('State changed:', state)
})
```

## 实战示例

下面是一个购物车功能的完整示例:

```jsx
const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (item) =>
    set((state) => {
      const newItems = [...state.items, item];
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price, 0),
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price, 0),
      };
    }),

  clearCart: () => set({ items: [], total: 0 }),
}));
```

## 总结

Zustand 凭借其简洁的 API、灵活的状态管理方式以及出色的性能,正在成为 React 应用状态管理的首选方案。它既保留了 Redux 的核心优势(不可变性、状态与 UI 解耦等),又极大地简化了开发流程。如果正在寻找一个现代化的状态管理方案,Zustand 绝对值得一试。
