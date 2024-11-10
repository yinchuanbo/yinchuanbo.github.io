---
title: "Bit 简介"
tag: "Bit"
time: 2024-11-09 19:39:44
---

## 开始使用

1. 运行以下命令来安装 Bit

```sh
npx @teambit/bvm install
```

2. 通过运行以下命令在新文件夹或现有项目中初始化 Bit

```sh
bit init --default-scope my-org.my-project
```

确保在 Bit 平台上创建您的范围并使用正确的组织和项目名称。运行命令后，Bit 将在所选目录中初始化，并准备好通过 Bit 命令、编辑器或 Bit UI 使用！

## 创建组件

启动工作区后，您可以开始创建组件。运行以下命令从我们的默认模板之一生成组件：

```sh
bit templates
```

以下命令使用 React UI 组件模板创建一个新的可重用 React 组件：

```sh
bit create react hello-world
```

您可以在我们的创建组件页面上找到创建 NodeJS 模块、UI 组件和应用程序、后端服务等的简单指南。使用以下命令运行 Bit UI 以预览组件：

```sh
bit start
```

在开发过程中使用 `bit run` 预览应用程序

## 发布组件

使用 Bit 平台进行认证：

```sh
bit login
```

使用语义版本控制来对组件进行版本控制：

```sh
bit tag --message "my first release" --major
```

默认情况下，Bit 使用 Ripple CI 来构建组件。您可以使用--build 标志在本地计算机上构建组件。从您选择的 CI 中进行标记和导出以自动化发布过程或使用我们的官方 CI 脚本。

版本控制后，您可以继续发布组件：

```sh
bit export
```

您的第一个组件现已发布！您现在可以查看您的组件，准备在 [Bit 平台](https://bit.cloud/) 上使用。

开始在您的所有项目中使用这些组件：

```sh
npm install @my-org/my-project.hello-world
```
