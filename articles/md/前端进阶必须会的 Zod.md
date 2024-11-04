---
title: "前端进阶必须会的 Zod"
tag: "TypeScript"
time: 2024-11-04 21:51:20
---

我最近在使用的 TypeScript 库 —— Zod。简单来说,Zod 是一个用于数据验证的库,它可以让你的 TypeScript 代码更加安全和可靠。

最近几个月我一直在使用 Zod,发现它不仅解决了我长期以来的一些痛点,还大大提高了我的开发效率。我相信,这个库也能帮助到许多和我有同样困扰的 TypeScript 开发者们。

## 1\. 为什么需要 Zod?

作为一个热爱 TypeScript 的程序员,我一直在寻找能够增强类型安全性的方法。

最近几年,我主要使用 TypeScript 进行开发。原因很简单:TypeScript 提供了优秀的静态类型检查,特别是对于大型项目来说,它的类型系统可以帮助我们避免许多潜在的运行时错误。

然而,尽管 TypeScript 的类型系统非常强大,但它仍然存在一些局限性。特别是在处理运行时数据时,TypeScript 的静态类型检查无法完全保证数据的正确性。这就是我开始寻找额外的数据验证解决方案的原因。

在这个过程中,我尝试了多种数据验证库,如 Joi、Yup 等。但它们要么缺乏与 TypeScript 的良好集成,要么使用起来过于复杂。直到我发现了 Zod,它完美地解决了我的需求。

## 2\. Zod 是什么?

Zod 是一个 TypeScript 优先的模式声明和验证库。它允许你创建复杂的类型安全验证模式,并在运行时执行这些验证。Zod 的设计理念是"以 TypeScript 类型为先",这意味着你定义的每个 Zod 模式不仅可以在运行时进行验证,还可以被 TypeScript 编译器用来推断类型。

使用 Zod 的主要优势包括:

1. **类型安全**: Zod 提供了从运行时验证到静态类型推断的端到端类型安全。
2. **零依赖**: Zod 没有任何依赖项,这意味着它不会给你的项目增加额外的包袱。
3. **灵活性**: Zod 支持复杂的嵌套对象和数组模式,可以处理几乎任何数据结构。
4. **可扩展性**: 你可以轻松地创建自定义验证器和转换器。
5. **性能**: Zod 经过优化,可以处理大型和复杂的数据结构,而不会影响性能。

## 3\. 如何使用 Zod?

让我们通过一些实际的例子来看看如何使用 Zod。

### 3.1 基本类型验证

```js
import { z } from "zod";
// 定义一个简单的字符串模式
const stringSchema = z.string();
// 验证
console.log(stringSchema.parse("hello")); // 输出: "hello"
console.log(stringSchema.parse(123)); // 抛出 ZodError
```

### 3.2 对象验证

```js
const userSchema = z.object({
  name: z.string(),
  age: z.number().min(0).max(120),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>; // 自动推断类型
const user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};

console.log(userSchema.parse(user)); // 验证通过
```

### 3.3 数组验证

```js
const numberArraySchema = z.array(z.number());
console.log(numberArraySchema.parse([1, 2, 3])); // 验证通过
console.log(numberArraySchema.parse([1, "2", 3])); // 抛出 ZodError
```

## 4. Zod 的高级用法

Zod 不仅可以处理基本的类型验证,还可以处理更复杂的场景。

### 4.1 条件验证

```js
const personSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    drivingLicense: z.union([z.string(), z.null()]).nullable(),
  })
  .refine(
    (data) => {
      if (data.age < 18 && data.drivingLicense !== null) {
        return false;
      }
      return true;
    },
    {
      message: "未成年人不能持有驾照",
    }
  );
```

### 4.2 递归模式

```js
const categorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    subcategories: z.array(categorySchema).optional(),
  })
);

type Category = z.infer<typeof categorySchema>;
```

### 4.3 自定义验证器

```js
const passwordSchema = z.string().refine(
  (password) => {
    // 至少8个字符,包含大小写字母和数字
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  },
  {
    message: "密码必须至少8个字符,包含大小写字母和数字",
  }
);
```

## 5. Zod 与前端框架的集成

Zod 可以很好地与各种前端框架集成。

这里我们以 React 为例,看看如何在 React 应用中使用 Zod 进行表单验证。

```jsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm <
  FormData >
  {
    resolver: zodResolver(schema),
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} placeholder="Username" />
      {errors.username && <span>{errors.username.message}</span>}  
      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}  
      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## 6. Zod 与数据库的结合

Zod 不仅可以用于前端验证,还可以与后端数据库模式定义完美结合。以下是一个使用 Prisma 和 Zod 的例子:

```js
import { z } from "zod";
import { Prisma } from "@prisma/client";

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(18),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

type User = z.infer<typeof userSchema>;

// 使用Zod模式来定义Prisma模型
const userModel: Prisma.UserCreateInput = userSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .parse({
    name: "John Doe",
    email: "john@example.com",
    age: 30,
  });

// 现在可以安全地将这个对象传递给Prisma的create方法
// prisma.user.create({ data: userModel });
```

## 7. Zod 的性能优化

虽然 Zod 非常强大,但在处理大型数据结构时,可能会遇到性能问题。以下是一些优化建议:

1. **延迟验证**: 对于大型对象,考虑使用`z.lazy()`来延迟验证。
2. **部分验证**: 使用`z.pick()`或`z.omit()`来只验证需要的字段。
3. **缓存模式**: 如果你频繁使用相同的模式,考虑缓存它们。
4. **异步验证**: 对于复杂的验证逻辑,考虑使用异步验证器。

## 8\. Zod vs 其他验证库

Zod 并不是市场上唯一的验证库。让我们简单比较一下 Zod 与其他流行的验证库:

1. **Joi**: Joi 是一个功能强大的验证库,但它不是 TypeScript 优先的,这意味着你需要额外的工作来获得类型推断。
2. **Yup**: Yup 与 Zod 非常相似,但 Zod 的 API 设计更加直观,而且性能通常更好。
3. **Ajv**: Ajv 是一个高性能的 JSON Schema 验证器,但它的 API 相对复杂,学习曲线较陡。
4. **class-validator**: 这是一个基于装饰器的验证库,非常适合与 TypeORM 等 ORM 一起使用,但它需要使用实验性的装饰器特性。

相比之下,Zod 提供了一个平衡的解决方案:它是 TypeScript 优先的,性能优秀,API 直观,并且不需要任何实验性特性。

总而言之，通过使用 Zod,你可以:

1. 减少运行时错误
2. 提高代码的可读性和可维护性
3. 自动生成 TypeScript 类型
4. 简化前后端之间的数据验证逻辑

开始使用 Zod 吧,让你的 TypeScript 代码更安全、更强大!
