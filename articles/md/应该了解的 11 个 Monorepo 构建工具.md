---
title: "应该了解的多个 Monorepo 构建工具"
tag: "单仓库"
time: 2024-11-09 20:17:01
---

在不断发展的软件开发领域，单一存储库越来越流行用于管理单个存储库中的多个包或项目。就我个人而言，我不鼓励这种方法，从长远来看，这种方法会带来更多的痛苦，而不是收益，但对于某些人来说，这种方法简化了依赖管理、跨应用程序的更改控制和代码共享。但是，它也将构建变成了一场漫长而缓慢的噩梦。所以，这里是 2024 年有用的 monorepo 构建工具。我希望它能有所帮助。

## 1. Bit

[Bit](https://bit.cloud/)是软件开发领域中的一个独特工具，不仅因其可组合架构而闻名，还因其跨不同存储库架构的灵活性而闻名。这种多功能性使 Bit 能够在单一存储库和多存储库设置中完美运行，使其成为在工作流程中寻求效率和模块化的开发人员的强大资产。

在 monorepo 环境中，Bit 的亮点在于允许独立开发、版本控制、管理、构建、测试和发布众多包。它确保 monorepo 中的每个组件都是解耦的，从而促进独立的开发流程，从而简化整个开发生命周期。

Bit 也是 monorepos 的一个非常强大的构建工具，因为它定义和管理项目中软件组件的依赖关系图，并且只构建受影响的组件。它还具有目前任何其他工具所不具备的一些额外优势：

### Bit 作为构建工具的主要特点：

- 解耦开发：Bit 允许开发人员专注于各个组件，从而降低了通常与管理单一存储库中的大型代码库相关的复杂性。这种方法通过支持并行开发而没有交叉依赖问题，从而加快了开发周期。

- 使用 `Ripple CI/CD` 增强 CI/CD：利用 Bit 的 `Ripple CI/CD`，团队可以通过智能地仅针对已更改的组件来有效地处理 monorepo 构建。这种优化极大地减少了构建时间和资源消耗，为可能不必要地重建项目中未更改部分的传统 `CI/CD` 流程提供了更有效的替代方案。

Ripple CI/CD 提供了一些独特的杀手级优势：

**可组合的 CI/CD** ：构建组件，而不是项目，默认情况下将集成和部署过程加快 80-90%。

**跨应用程序更新**：在单个进程中跨多个应用程序更新组件，忽略存储库边界。

**可恢复和部分**：如果某些组件通过构建而某些组件失败，您可以修复失败的组件并从中断处恢复，同时仅重建失败的组件。通过的可以在生产中更新！不再有“全有或全无”的构建过程。

**更短的反馈循环**：仅构建修改和受影响的组件，从而显着减少构建结果的等待时间。

**简化的配置**：使用预定义的构建管道进行操作，无需额外设置。基本上，配置是自动化的。

**并行处理**：根据组件依赖关系图自动管理 CI 运行程序，以加快构建速度。

**变更模拟**：可视化组件变更的影响，允许开发人员在受变更影响的每个页面和应用程序的可视上下文中部署之前预览和解决潜在问题。从字面上看，看到未来。

- 可组合架构：Bit 的核心是推广可组合架构，鼓励跨项目重用和共享组件。此功能利用 monorepos 的结构优势，显着提高了开发实践的一致性和效率。

### 为什么以及何时选择 Bit：

对于旨在最大限度地提高生产力并培育模块化开发环境的团队和项目来说，Bit 是一个理想的选择。在以下情况下特别有效：

- 在单一存储库中管理复杂的项目，独立开发和维护组件的能力可以大大减少瓶颈。

- 通过采用专门设计的工具来解决单一存储库设置中构建和测试的独特挑战，寻求提高 CI/CD 效率。

- 强调跨多个项目或服务的组件重用，从而确保一致性并减少重复工作。

### 使用示例:

要开始使用 Bit 进行组件管理，您可以在项目中初始化 Bit，然后创建并导出组件：

```sh
# init Bit
$ bit init

# create a new workspace for react
$ bit new react my-workspace --env teambit.react/react-env

# create a component
$ bit create react pages/welcome

# check all components in your workspace
$ bit status

# tag a version for all new or modified components...
# bit will pompt you to bump their dependants as well!
$ bit tag --message "my release message"

# Login to your bit account (optional, free and reccomended)
$ bit login

# upload components to your account + publish them as packages
# you don't need to config packages or define dependencies - it's automated
$ bit export
```

您的导出将运行 Ripple CI/CD，以仅对代码库中的依赖关系图中受影响的组件进行更改。

这些组件也可以作为软件包安装。

并在更改后在 monorepo 中仅在本地构建和测试受影响的组件：

```sh
bit build --changed
```

这些命令展示了 Bit 如何通过关注变更来简化开发流程，确保您的工作流程尽可能高效。

### 了解更多：

对于希望将 Bit 集成到其开发工作流程中或寻求优化其 monorepo 设置的开发人员，可以从以下位置获取全面的资源：

对于希望将 Bit 集成到其开发工作流程中或寻求优化其 monorepo 设置的开发人员，可以从以下位置获取全面的资源：

- Bit 官网： [https://bit.dev/](https://bit.dev/)
- Bit Cloud（和 Ripple CI/CD）： [https://bit.cloud/](https://bit.dev/) （免费供个人使用）
- Pnpm 作者使用 Bit 在 monorepo 中进行依赖管理：

<iframe width="680" height="382" src="https://www.youtube.com/embed/vpVIw5QTlps" title="Better dependency management in a monorepo with Bit" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

和：

<iframe width="680" height="382" src="https://www.youtube.com/embed/Z2kPUlLynzU" title="Advanced dependency management in Bit" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 2. pnpm 工作区

> 注意：官方 [pnpm monorepo 文档](https://pnpm.io/workspaces) 建议将 pnpm 工作区与 Bit 结合起来，以获得最佳的端到端终极体验。

pnpm Workspaces 是 pnpm 包管理器的一项功能，旨在优化单一存储库（也称为多包存储库、多项目存储库或整体存储库）的管理。通过允许创建将多个项目联合到一个存储库中的工作空间，pnpm Workspaces 促进了高效的依赖关系管理、简化的包链接和统一的版本控制，使其成为在复杂项目环境中工作的开发人员的必备工具。

### pnpm 工作区的主要特点：

- 统一依赖关系管理：pnpm Workspaces 允许在根级别一次性安装工作空间内所有项目的共享依赖关系，从而减少重复并节省磁盘空间。

- 符号链接的本地包：工作区中的项目可以通过本地路径轻松地相互引用，并使用 pnpm 处理符号链接，确保本地更改在整个工作区中立即可用，而无需重新发布。

- 高效快速：利用 pnpm 独特的 node_modules 方法，工作区确保安装速度快，并且磁盘空间使用量最小化，即使在大型 monorepos 中也是如此。

- 一致的工具：提供一组一致的工具和命令来管理工作区中所有项目的构建、测试等，从而简化开发工作流程。

- 选择性命令执行：允许跨工作区包选择性地执行命令，从而根据项目的需求启用有针对性的构建、测试或自定义脚本执行。

### 为何以及何时选择 pnpm 工作区：

对于需要可扩展且高效的解决方案来管理 monorepos 的开发团队来说，pnpm Workspaces 是完美的选择。在以下情况下特别有益：

- 使用包含多个相互依赖的项目的大型代码库，并且需要简化依赖关系管理。

- 通过最大限度地减少磁盘使用并确保本地包更改立即反映在项目中，寻求提高构建和部署效率。

- 需要一种统一的方法在单一存储库中进行版本控制和发布包，以确保所有项目的一致性。

### pnpm 工作区的使用示例：

要开始使用 pnpm Workspaces，您首先需要在存储库的根目录下创建一个`pnpm-workspace.yaml`文件：

```sh
packages:
  - 'packages/*'
```

此配置指定`packages`目录中的每个子目录都是一个单独的工作区包。要安装所有工作区包的依赖项，只需运行：

```sh
pnpm install
```

要在包含该脚本的所有包中运行脚本，请使用：

```sh
pnpm exec -- <command>
```

这些示例演示了 pnpm Workspaces 如何简化在单一存储库中管理多个项目的过程，从依赖项安装到跨包执行命令。

### 了解更多：

对于有兴趣进一步探索 pnpm Workspaces 或将其集成到他们的 monorepo 项目中的开发人员，可以在以下位置获取其他资源和详细文档：

- pnpm 工作空间文档： [https://pnpm.io/workspaces](https://pnpm.io/workspaces)

## 3. Nx

Nx 是一个可扩展的构建框架，旨在增强现代 Web 应用程序的开发体验，特别是那些使用 Angular、React 和其他流行框架的应用程序。 Nx 专为 monorepo 设置而定制，简化了在单个存储库中管理多个项目的过程，利用先进的工具和自动化来简化构建、测试等。 Nx 专注于优化开发人员工作流程，是寻求提高生产力和维护高质量代码库的团队的综合解决方案。

### Nx 的主要特点：

- 对现代 Web 框架的内置支持：Nx 为 Angular、React 和 Node.js 等流行框架提供开箱即用的配置，减少新项目的设置时间并确保遵循最佳实践。

- 智能依赖图分析：通过分析 monorepo 内项目的依赖图，Nx 可以精确确定哪些项目受到更改的影响。这允许有针对性的构建和测试，显着减少 CI/CD 时间。

- 受影响的命令：Nx 的“受影响”命令仅针对已更改的项目及其依赖项智能地识别和执行任务。这种选择性的构建和测试方法提高了 CI/CD 管道的效率。

- 全面的工具：除了构建和测试之外，Nx 还提供了一套用于代码生成、linting、格式化等的工具和原理图，从而促进整个代码库的一致性和质量。

- 插件生态系统：Nx 支持广泛的插件，将其功能扩展到其他语言和技术，使其成为适用于不同开发环境的多功能工具。

### 为什么以及何时选择 Nx：

Nx 非常适合从事大型 Web 应用程序的开发团队，特别是那些采用 monorepo 方法进行项目结构的开发团队。它的功能在以下情况下特别有用：

- 在单个存储库中管理多个 Web 项目，需要有效协调和优化构建和测试。

- 使用现代 JavaScript 框架并寻求利用项目配置和开发工作流程的最佳实践。

- 旨在通过智能分析项目依赖性来最大限度地减少构建和测试时间，从而提高 CI/CD 管道性能。

### Nx 的使用示例：

可以使用以下命令来使用 Nx 创建带有 Angular 应用程序的新工作区：

```sh
npx create-nx-workspace@latest myworkspace
cd myworkspace
nx generate @nrwl/angular:application myapp
```

要仅构建和测试受更改影响的项目，您可以使用：

```sh
nx affected:build
nx affected:test
```

这些命令展示了 Nx 管理项目依赖关系并有针对性地执行任务的能力，从而增强了 monorepo 中的开发工作流程。

### 了解更多:

对于有兴趣在项目中采用 Nx 或希望优化 monorepo 设置的开发人员和团队，以下资源提供了广泛的信息：

- Nx 官方文档： [https://nx.dev/](https://nx.dev/)

## 4. Yarn 工作区

Yarn Workspaces 是 Yarn 包管理器的一项功能，可以更轻松地管理 monorepo 中的包的依赖关系和链接。

Yarn 工作区的优点：

- 简化了跨多个项目的 npm 包的安装和链接。

- 减少软件包安装的重复，节省空间并提高构建性能。

## 5. Bazel

Bazel 是 Google 开发的高级构建工具，旨在支持多语言项目环境，特别是在 monorepos 中。它强调速度、可扩展性和可重复性，使其成为小型项目和大型企业级应用程序的理想选择。 Bazel 通过采用先进的依赖项跟踪和缓存机制来优化构建过程，确保仅重建和测试代码库的必要部分，从而显着减少构建和测试时间。

### Bazel 的主要特点：

- 多语言支持：Bazel 用途广泛，为各种编程语言提供内置支持，包括 Java、C++、Python 等。这使得团队可以在项目的不同部分使用 Bazel，而无需单独的构建工具。

- 细粒度的依赖跟踪：Bazel 的依赖跟踪是精确的，这意味着它只重建项目中已更改的部分。这种增量构建方法可以节省时间和资源。

- 可扩展性：Bazel 在设计时就考虑了可扩展性，可以有效地处理大型代码库和复杂的依赖关系图，使其适合企业级项目。

- 可重复的构建：Bazel 确保构建在不同环境中可重复且一致，这对于调试和持续集成/持续部署 (CI/CD) 流程至关重要。

- 并行执行：它利用并行执行来加速构建和测试过程，进一步优化开发工作流程。

- 可扩展性：Bazel 可以通过自定义构建规则进行扩展，允许团队根据其特定需求定制构建过程。

### 为什么以及何时选择 Bazel：

对于在 monorepo 结构中处理多语言项目的团队来说，Bazel 是一个令人信服的选择，特别是当项目规模和构建速度是主要考虑因素时。其可扩展性和对增量构建的支持使其特别适合：

- 大型企业项目需要有效管理复杂的依赖关系和快速构建时间。

- 寻求跨各种开发环境的构建过程的一致性和可重复性的组织。

- 跨越多种编程语言和平台的项目，需要一个能够处理不同构建任务的统一构建工具。

### Bazel 的使用示例：

在 Bazel 中创建一个简单的 Java 库需要在项目目录中定义一个 BUILD 文件，如下所示：

```java
java_library(
    name = "mylibrary",
    srcs = glob(["src/main/java/**/*.java"]),
    deps = [
        "@com_google_guava//guava",
    ],
)
```

此 Bazel 构建规则指定一个名为 mylibrary 的 Java 库目标，包括其源文件和依赖项。要构建这个库，您将运行：

```sh
bazel build //path/to/mylibrary
```

Bazel 计算依赖关系并仅重建必要的部分，展示了其管理构建的效率。

### 了解更多:

对于那些希望将 Bazel 集成到其开发工作流程中或旨在提高 monorepo 环境中项目构建效率的人，可以在以下位置获取更多详细信息：

- Bazel 官方网站： [https://bazel.build/](https://bazel.build/)

## 6. Turborepo

turborepo 现在是 Vercel 的一部分，是专为以 monorepo 格式组织的 JavaScript 和 TypeScript NextJS 项目量身定制的构建系统。它旨在通过实施智能缓存和任务并行化技术来优化开发工作流程。这种对性能的关注使得 Turborepo 成为寻求最小化构建时间并提高具有多个相互依赖的包的大型代码库的生产力的团队的绝佳选择。

### Turborepo 的主要特点:

- 高级缓存机制：Turborepo 利用强大的缓存策略来存储先前构建任务的结果。通过重用这些结果而不是再次执行相同的任务，Turborepo 显着缩短了构建时间。

- 增量构建：此功能可确保在构建过程中仅执行受代码更改影响的任务。增量构建通过避免不必要的工作、仅关注需要更新的内容来进一步加快开发速度。

- 任务并行化：Turborepo 旨在并行执行构建任务，更有效地利用可用的 CPU 资源。这种方法最大限度地提高了效率，减少了构建和测试所需的总时间。

- Monorepo 友好：Turborepo 专为 monorepo 环境而设计，简化了具有多个包的项目的管理，简化了工作流程并增强了它们之间的协调。

- 灵活的配置：尽管 Turborepo 注重性能，但它仍然具有高度可配置性，允许开发人员根据项目的特定需求定制构建过程。

### 为什么以及何时选择 Turborepo：

Turborepo 特别适合在 monorepo 结构中处理 JavaScript 或 TypeScript 项目并希望提高构建效率的开发团队。其强大的性能优化使其成为以下方面令人信服的选择：

- 由于单一仓库的复杂性和规模，团队的构建和测试时间很慢。

- 经常重建或重新测试代码的项目，力求最大限度地减少这些操作对开发速度的影响。

- 旨在通过专门设计用于高效处理 JavaScript 和 TypeScript 项目的工具来简化单一存储库管理的组织。

### Turborepo 的使用示例:

将 Turborepo 集成到您的 monorepo 设置中需要配置它来管理您的构建任务。 `turbo.json` 配置示例可能如下所示：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

此配置定义了其他任务所依赖的构建任务，并指定了构建过程的输出。它还设置一个依赖于正在完成的构建任务的测试任务。 Turborepo 将使用此信息来缓存输出并增量并行执行任务。

### 了解更多:

有关如何在 monorepo 项目中实施 Turborepo 并利用其功能来优化开发工作流程的更多详细信息，请访问：

- Turborepo 官方网站： [https://turbo.build/](https://turborepo.org/)

## 7. Rush

Rush 是一个强大的 monorepo 管理器，专注于优化 monorepo 设置中 Web 应用程序的开发工作流程。它因其有效管理包含包之间复杂的相互依赖关系的大型项目的能力而脱颖而出。 Rush 的设计考虑到了企业级项目的需求，简化了包管理、构建、测试和发布流程，使团队能够更轻松地在大型代码库中保持高水平的生产力和代码质量。

### Rush 主要特点:

- 全面的包管理：Rush 简化了在单一存储库中处理多个包的复杂性，提供依赖项、版本控制和发布的无缝管理。

- 可扩展的构建系统：它具有高度可扩展的构建系统，支持增量构建，通过根据更改智能确定项目的哪些部分需要重建来减少构建时间。

- 集成测试框架：Rush 与流行的测试框架集成，允许跨多个包进行自动化测试，确保更改不会引入回归。

- 灵活的工具集成：Rush 旨在与各种包管理器（例如 npm、pnpm 和 Yarn）和构建工具良好配合，使团队能够灵活地选择最适合其项目要求的工具。

- 发布工作流程：提供简化的发布包工作流程，包括变更文件管理、版本升级和变更日志生成，从而促进一致的发布流程。

### 为什么以及何时选择 Rush：

对于需要在单一存储库中跨多个包管理复杂 Web 应用程序的开发团队来说，Rush 是理想的选择。其全面的功能集和对可扩展性的关注使其特别适合：

- 企业项目寻求提高构建效率并更有效地管理大量包的依赖关系。

- 寻求与现有工具和工作流程良好集成的 monorepo 解决方案的团队，提供适应项目特定需求的灵活性。

- 需要可靠的方式来自动化测试和发布流程的项目，以确保版本的一致性和质量。

### Rush 用法示例：

要使用 Rush 启动新项目，您首先需要在 monorepo 中初始化 Rush 环境：

```sh
rush init
```

此命令设置使用 Rush 管理 monorepo 所需的基本结构和配置文件。为了管理依赖项和添加新包，您可以使用：

```sh
rush add -p your-package-name
```

并构建 monorepo 中自上次成功构建以来已更改的所有项目：

```sh
rush build
```

这些示例说明了 Rush 在管理 monorepo 工作流程（从初始化到依赖管理和构建）方面的简单性和强大功能。

### 了解更多：

对于有兴趣利用 Rush 进行单一存储库管理或寻求增强其开发工作流程的开发人员，可以在以下位置找到更多信息：

- Rush 官网： [https://rushjs.io/](https://rushjs.io/)