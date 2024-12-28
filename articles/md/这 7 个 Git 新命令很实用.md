---
title: "这 7 个 Git 新命令很实用"
tag: "Git"
time: 2024-12-28 20:29:58
---

自 Git 在 2005 年诞生以来，诸如 `clone`、`pull`、`push`、`merge`、`checkout` 和 `commit` 等核心命令便已存在，支撑着日常的开发工作。随着版本控制需求的演变，Git 持续迭代更新，引入了诸多增强功能和新命令。本文将聚焦于近年来新增的七个 Git 命令，探索它们如何进一步提升工作效率！

## git switch：安全切换分支

`git switch` 命令是在 Git 2.23.0 版本中引入的，以解决 `git checkout` 命令职责过重的问题，并使得 Git 的命令更加直观和易于理解。

在 Git 2.23 之前，`git checkout` 既用于切换分支，也用于还原文件内容，很容易引起混淆。通过将 `git checkout` 的功能拆分，Git 团队创建了两个新的、更专业的命令：

- `git switch`：专门用于在分支之间进行切换。
- `git restore`：专门用于还原文件内容。

使用 `git switch` 切换分支非常简单，以下是基本用法：

```sh
# 切换到已存在的分支
$ git switch <branch-name>

# 创建并切换到新分支
$ git switch -c <new-branch-name>

# 从远程仓库创建并跟踪一个本地分支
$ git switch -c <new-branch-name> --track <remote>/<branch-name>

# 返回到上一个分支
$ git switch -
```

> 注意：如果遇到错误信息 `'switch' is not a git command`，那么可能是因为 Git 版本低于 2.23.0。可以通过运行 `git --version` 来检查 Git 版本，并升级到最新版本以使用这些新特性。

## git restore：安全撤销更改

`git restore` 命令同样是在 Git 2.23.0 版本中引入的，专门用于恢复工作目录中的文件内容。

`git restore` 主要用来撤销工作目录中的更改，可以用来丢弃未提交的工作树修改、还原删除的文件，或者将文件重置为之前的某个提交状态。以下是 `git restore` 的基本用法：

```sh
# 恢复工作目录中的文件到最近一次提交的状态
$ git restore <file>

# 从指定的提交中恢复文件到工作目录
$ git restore --source=<commit> <file>

# 取消暂存区的更改（类似于 git reset HEAD <file>）
$ git restore --staged <file>

# 恢复所有文件到指定的提交状态
$ git restore --source=<commit> .

# 恢复所有已删除的文件
$ git restore -w -- *

# 丢弃暂存区和工作目录中的更改（即恢复到指定的提交状态）
$ git restore --staged --worktree <file>
```

使用 `git restore` 时，可以选择性地指定 `--staged` 来影响暂存区，或者 `--worktree` 来影响工作目录。如果同时指定了这两个选项，则会同时影响暂存区和工作目录。

`git restore` 是一个相对安全的操作，因为它不会改变分支的历史记录，它只会影响工作目录和/或暂存区。

## git worktree：同时在多个分支工作

`git worktree` 命令是在 Git 2.5 版本中引入的，它允许在同一个仓库中创建多个工作目录（worktrees），每个工作目录可以检出不同的分支或提交。这为开发者提供了同时处理多个任务的能力，比如在不同的分支上进行开发、测试，而不需要来回切换分支。

以下是 `git worktree` 的基本用法：

```sh
# 添加一个新的工作目录，并检出指定分支
$ git worktree add <path> [<branch>]

# 列出所有的工作目录
$ git worktree list

# 移除一个工作目录（必须先确保该目录没有未提交的更改）
$ git worktree remove <path>

# 移动一个工作目录到新的位置
$ git worktree move <current-path> <new-path>
```

例如，如果想要添加一个新的工作目录来检出名为 `feature-branch` 的分支，可以这样做：

```sh
$ git worktree add ../my-feature-worktree feature-branch
```

这将在 `../my-feature-worktree` 目录下创建一个新的工作目录，并检出 `feature-branch` 分支。

## git sparse-checkout：高效处理大型仓库

`git sparse-checkout` 是在 Git 2.25.0 版本中引入的，个功能是对之前存在的稀疏检出机制的一个重大改进。通过 `git sparse-checkout`，开发者可以更高效地克隆大型仓库，只检出部分文件或目录，而不是整个项目。

要启用 `sparse-checkout`，首先需要设置仓库以使用稀疏检出模式：

```sh
# 启用 sparse-checkout 模式
$ git sparse-checkout init

# 设置你想要包括的模式或路径
$ git sparse-checkout set <pattern>...
```

例如，如果只想检出 `src` 目录及其子目录中的文件，可以这样做：

```sh
$ git sparse-checkout set src/
```

如果想添加多个模式或路径，可以在 `set` 命令后列出所有路径，或者分多次调用该命令。

除了 `set` 命令，还可以使用 `add` 和 `list` 来管理稀疏检出模式：

```sh
# 添加额外的路径到稀疏检出模式
$ git sparse-checkout add <pattern>...

# 列出现有的稀疏检出模式
$ git sparse-checkout list
```

如果不再需要稀疏检出模式，可以通过以下命令禁用它，并恢复完整的检出状态：

```sh
# 禁用 sparse-checkout 模式并恢复完整检出
$ git sparse-checkout disable
```

## git range-diff：比较提交范围之间的更改

`git range-diff` 是在 Git 2.19.0 版本中引入的，用于比较两个提交范围之间的差异。它可以帮助开发者理解在一次变基（rebase）、合并（merge）或历史改写操作后，一系列提交发生了哪些变化。

`git range-diff` 的基本用法如下：

```sh
# 比较两个分支上的最近 n 个提交
$ git range-diff A~n..A B~n..B

# 或者更常见的用法是直接指定两个范围
$ git range-diff A..B C..D
```

这里的 `A..B` 和 `C..D` 分别表示两个不同的提交范围。例如，如果想比较 `feature` 分支在变基前后的差异，可以这样做：

```sh
# 假设 origin/feature 是变基之前的远程分支状态
# 而 feature 是变基之后的本地分支状态
$ git range-diff origin/feature..feature~n feature~n..feature
```

`git range-diff` 会输出每个提交的摘要信息，包括提交消息、作者、日期等，并高亮显示两个范围内的提交之间的差异。如果提交的内容完全相同，它将只显示提交消息并指出它们是相同的；如果有差异，则会详细列出差异之处。

## git maintenance：自动化仓库健康

`git maintenance`是在 Git 2.30.0 版本中引入的，用于管理和自动化各种维护任务的命令。这个命令旨在简化和优化仓库的维护工作，通过提供一组预定义的任务来帮助保持仓库的健康状态和高效性能。

`git maintenance` 提供了几种子命令来管理不同的维护任务：

- **启用和禁用自动维护：**

```sh
# 启用自动维护
$ git maintenance start

# 禁用自动维护
$ git maintenance stop
```

- **执行一次性维护任务**：手动触发一次性的维护任务，这对于在特定时间点（如大型提交之后）优化仓库非常有用。

```sh
# 执行所有配置的维护任务
$ git maintenance run

# 执行特定类型的维护任务
$ git maintenance run --task=<task>
```

常见的维护任务包括：

- `gc`：运行完整的垃圾收集，包括压缩对象数据库。
- `commit-graph`：构建或更新提交图文件以加速提交历史查询。
- `loose-objects`：清理松散对象并将其打包。
- `incremental-repack`：逐步重新打包对象以优化存储。
- `prefetch`：预先获取远程分支的新数据，以加速未来的克隆和拉取操作。

- **配置自动维护计划**：可以通过配置文件设置哪些任务应该被定期执行以及它们的执行频率。例如，在 `.git/config` 文件中添加如下内容：

```sh
[maintenance "daily"]
    task = prefetch
    task = loose-objects
[maintenance "hourly"]
    task = commit-graph
[maintenance "weekly"]
    task = incremental-repack
[maintenance "monthly"]
    task = gc
```

然后启用这些计划：

```sh
$ git maintenance start --schedule=daily
$ git maintenance start --schedule=hourly
$ git maintenance start --schedule=weekly
$ git maintenance start --schedule=monthly
```

## git log --remerge-diff：更好地理解合并

从 Git 2.35 版本开始，可以使用 `git log --remerge-diff`  命令来更好地理解合并提交。通常情况下，合并提交会显示哪些分支被合并了，但并不总是能清晰地解释合并过程中引入的具体更改，特别是在解决合并冲突时所做的改动。

`git log --remerge-diff`  通过重播记录的合并策略来重建合并提交，并展示该合并引入的确切更改。这对于调试合并冲突或审查复杂的合并历史非常有用。
