---
title: "TS常用工具类型"
tag: "TypeScript"
time: 2025-01-05 15:00:22
---

TypeScript 提供了许多内置的工具类型（Utility Types），这些工具类型可以帮助我们更方便地操作和转换类型。

### 1\. `Partial<T>`

`Partial<T>` 将类型 `T` 的所有属性设置为可选的。

```ts
interface User {
  id: number;
  name: string;
  age: number;
}

type PartialUser = Partial<User>;

const user: PartialUser = {
  id: 1,
  name: "John",
  // age is optional
};
```

### 2\. `Required<T>`

`Required<T>` 将类型 `T` 的所有属性设置为必需的。

```ts
interface User {
  id?: number;
  name?: string;
  age?: number;
}

type RequiredUser = Required<User>;

const user: RequiredUser = {
  id: 1,
  name: "John",
  age: 30,
};
```

### 3\. `Readonly<T>`

`Readonly<T>` 将类型 `T` 的所有属性设置为只读的。

```ts
interface User {
  id: number;
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = {
  id: 1,
  name: "John",
  age: 30,
};

// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property.
```

### 4\. `Record<K, T>`

`Record<K, T>` 创建一个对象类型，其属性键为 `K`，属性值为 `T`。

```ts
type UserRole = "admin" | "user" | "guest";

type UserRoles = Record<UserRole, string>;

const roles: UserRoles = {
  admin: "Administrator",
  user: "User",
  guest: "Guest",
};
```

### 5\. `Pick<T, K>`

`Pick<T, K>` 从类型 `T` 中选择一组属性 `K` 来创建新类型。

```ts
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

type UserBasicInfo = Pick<User, "id" | "name">;

const user: UserBasicInfo = {
  id: 1,
  name: "John",
};
```

### 6\. `Omit<T, K>`

`Omit<T, K>` 从类型 `T` 中排除一组属性 `K` 来创建新类型。

```ts
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

type UserWithoutEmail = Omit<User, "email">;

const user: UserWithoutEmail = {
  id: 1,
  name: "John",
  age: 30,
};
```

### 7\. `Exclude<T, U>`

`Exclude<T, U>` 从类型 `T` 中排除可以赋值给 `U` 的类型。

```ts
type T = string | number | boolean;
type U = string | number;

type Result = Exclude<T, U>; // boolean
```

### 8\. `Extract<T, U>`

`Extract<T, U>` 从类型 `T` 中提取可以赋值给 `U` 的类型。

```ts
type T = string | number | boolean;
type U = string | number;

type Result = Extract<T, U>; // string | number
```

### 9\. `NonNullable<T>`

`NonNullable<T>` 从类型 `T` 中排除 `null` 和 `undefined`。

```ts
type T = string | number | null | undefined;

type Result = NonNullable<T>; // string | number
```

### 10\. `ReturnType<T>`

`ReturnType<T>` 获取函数类型 `T` 的返回类型。

```ts
function getUser() {
  return { id: 1, name: "John" };
}

type User = ReturnType<typeof getUser>; // { id: number; name: string }
```

### 11\. `InstanceType<T>`

`InstanceType<T>` 获取构造函数类型 `T` 的实例类型。

```ts
class User {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

type UserInstance = InstanceType<typeof User>; // User
```

### 12\. `ThisType<T>`

`ThisType<T>` 用于指定上下文类型 `T`。

```ts
interface User {
  id: number;
  name: string;
}

const user: User & ThisType<User> = {
  id: 1,
  name: "John",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

user.greet(); // Hello, John
```

### 13\. `Parameters<T>`

`Parameters<T>` 获取函数类型 `T` 的参数类型。

```ts
function getUser(id: number, name: string) {
  return { id, name };
}

type UserParams = Parameters<typeof getUser>; // [number, string]
```

### 14\. `ConstructorParameters<T>`

`ConstructorParameters<T>` 获取构造函数类型 `T` 的参数类型。

```ts
class User {
  constructor(public id: number, public name: string) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>; // [number, string]
```

### 15\. `Awaited<T>`

`Awaited<T>` 获取 `Promise` 类型 `T` 的解析类型。

```ts
type T = Promise<string>;

type Result = Awaited<T>; // string
```

### 16\. `Uppercase<T>`

`Uppercase<T>` 将字符串类型 `T` 转换为大写。

```ts
type T = "hello";

type Result = Uppercase<T>; // 'HELLO'
```

### 17\. `Lowercase<T>`

`Lowercase<T>` 将字符串类型 `T` 转换为小写。

```ts
type T = "HELLO";

type Result = Lowercase<T>; // 'hello'
```

### 18\. `Capitalize<T>`

`Capitalize<T>` 将字符串类型 `T` 的首字母转换为大写。

```ts
type T = "hello";

type Result = Capitalize<T>; // 'Hello'
```

### 19\. `Uncapitalize<T>`

`Uncapitalize<T>` 将字符串类型 `T` 的首字母转换为小写。

```ts
type T = "Hello";

type Result = Uncapitalize<T>; // 'hello'
```

### 20\. `ReadonlyArray<T>`

`ReadonlyArray<T>` 创建一个只读数组类型。

```ts
const numbers: ReadonlyArray<number> = [1, 2, 3];

// numbers.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'.
```

### 21\. `ReadonlyMap<K, V>`

`ReadonlyMap<K, V>` 创建一个只读的 `Map` 类型。

```ts
const map: ReadonlyMap<string, number> = new Map([
  ["one", 1],
  ["two", 2],
]);

// map.set('three', 3); // Error: Property 'set' does not exist on type 'ReadonlyMap<string, number>'.
```

### 22\. `ReadonlySet<T>`

`ReadonlySet<T>` 创建一个只读的 `Set` 类型。

```ts
const set: ReadonlySet<number> = new Set([1, 2, 3]);

// set.add(4); // Error: Property 'add' does not exist on type 'ReadonlySet<number>'.
```

### 23\. `ThisParameterType<T>`

`ThisParameterType<T>` 获取函数类型 `T` 的 `this` 参数类型。

```ts
function getUser(this: { id: number; name: string }) {
  return { id: this.id, name: this.name };
}

type ThisType = ThisParameterType<typeof getUser>; // { id: number, name: string }
```

### 24\. `OmitThisParameter<T>`

`OmitThisParameter<T>` 从函数类型 `T` 中移除 `this` 参数。

```ts
function getUser(this: { id: number; name: string }) {
  return { id: this.id, name: this.name };
}

type FunctionType = OmitThisParameter<typeof getUser>; // () => { id: number; name: string }
```

### 25\. `ThisType<T>`

`ThisType<T>` 用于指定上下文类型 `T`。

```ts
interface User {
  id: number;
  name: string;
}

const user: User & ThisType<User> = {
  id: 1,
  name: "John",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

user.greet(); // Hello, John
```