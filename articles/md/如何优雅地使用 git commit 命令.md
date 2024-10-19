---
title: "如何优雅地使用 git commit 命令"
tag: "Git"
---

## 01 git commit 的基础

在 Git 中，"提交"是一个指代对文件更改进行记录的操作。每次提交都为当前项目的状态创建一个新的快照。提交的主要目的是让开发者可以在需要时查看、恢复或比较项目的历史版本。

Git 将每次提交视为项目在某一时刻的完整快照，而不是差异。每次提交保存的是当前项目的所有文件的状态，当你查看历史提交时，你可以看到当时的文件内容。快照使 Git 能够高效地管理各个版本的文件。

版本控制是管理文件变更的一种系统。在软件开发中，版本控制允许团队协作，追踪和记录每一次的更改。使用 Git 进行版本控制，可以实现以下目标：

- 协作：多位开发者可以同时对代码进行更改，并通过合并提交来整合这些更改。
- 历史记录：可以随时查看项目的变更历史，了解每次提交的内容、时间和作者。
- 恢复：在出现问题时，可以快速恢复到先前的某个版本。
- 分支管理：Git 允许创建分支并在不同的分支上进行开发，后续再将更改合并回主干。

通过这些特性，Git commit 成为代码管理和版本控制中不可或缺的一部分。每次提交都带有唯一的标识符（SHA-1 哈希值），可以确保每个快照的唯一性和可追踪性。

### 1.1 git commit 命令详解

```sh
git commit file1.name file2.name file3.name .. –m "commit messages"
```

`commit`指提交修改到本地的仓库里，`file*.name`指的是带`commit`的文件`–m`后面的内容指提交的信息，即备注。

```sh
git commit –a –m "commit messeages"
```

添加的`-a`参数会把当前暂存区里所有的修改（包括删除操作）都提交，但是那些尚未添加到暂存区的内容是不会提交的，网上有很多人说`-a`参数会把尚未`add`的文件也提交了，这个说法是错误的。

```sh
git commit
```

可能有时候手抖忘记输入`-m`参数，直接输入了`git commit`，于是出现了下面这个界面，即打开了一个`vim`编辑界面，敲入`i`键后保存，输入要添加的`message`后，输入“`ESC`”按键退出编辑界面，然后再敲入“`:wqa`”后会保存`message`内容，并且提交此次修改，如果敲入“`:q`”会取消这次提交。

<img src="../imgs/95/01.webp" />

```sh
git commit --amend
```

这也是我们经常用的命令，他会把此次提交追加到上一次的`commit`内容里。

### 1.2 git commit 的格式

参考 Angular 团队的规范。

`message`的格式：

```sh
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

标题行: 必填, 描述主要修改类型和内容。

主题内容: 描述为什么修改, 做了什么样的修改, 以及开发的思路等等。

页脚注释: 放 Breaking Changes 或 Closed Issues。

`type`是指：

- `feat`: 新特性。
- `fix`: 修改问题。
- `refactor`: 代码重构。
- `docs`: 文档修改。
- `style`: 代码格式修改，注意不是 css 修改。
- `test`: 测试用例修改。
- `chore`: 其他修改，比如构建流程，依赖管理。

`scope`：`commit`  影响的范围，即影响的模块或者组件，比如: `route, component, utils, build...` 。  
`subject`：`commit`  的概述, 建议符合 50/72 formatting。  
`body`：`commit`  具体修改内容, 可以分为多行, 建议符合 50/72 formatting 。  
`footer`: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接，或者 feature 等等其余的信息.

**使用 git commit 模板来规范提交：**

1. 在 `~/.gitconfig` 文件里添加：

```sh
[commit]
    template=~/.gitmessage
```

2. 添加 `~/.gitmessage` 文件。

### 1.3 git 的 commitizen

1. 下载对应版本的 nodejs 包（`https://nodejs.org/en/download/`），并安装。

2. 使用 npm 工具进行全局安装：

```sh
npm install commitizen -g
```

3. 然后在项目目录里，运行下面命令，使其支持 Angular 的 Commit message 格式：

```sh
commitizen init cz-conventional-changelog --save --save-exact
```

以后，凡是用到 `git commit`  命令，一律改用 `git cz`，这时候就会出现选项，来生成符合规范的  `commit message` 。

4. 如果希望每个使用 git 的项目都遵循这个标准，可以使用下面命令进行全局设置安装 `cz-conventional-changelog`：

```sh
npm install -g cz-conventional-changelog
```

5. 创建一个 `.czrc` 文件在你的 home 目录，并将 path 指向上面所安装的 commitizen 适配器，

```sh
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

6. 现在可以在每个 git 项目中使用 `git cz` 提交我们的 commit message 了，当然我们还可以配置`Commitlint` 做自动检测，检查不通过的可以拒绝提交，比较绝吧。

7. 如果所有的 commit 信息都是按照这个格式填写的，在发布版本时就可以使用以下命令生成 changelog 了。

```sh
conventional-changelog -p angular -i CHANGELOG.md -s
```

### 1.4 推送到远程分支

`git push` 命令用于将本地分支的更新，推送到远程主机。它的格式与 `git pull` 命令相仿。

```sh
git push <远程主机名> <本地分支名>:<远程分支名>
```

注意，分支推送顺序的写法是`<来源地>:<目的地>`，所以`git pull`是`<远程分支>:<本地分支>`，而`git push`是`<本地分支>:<远程分支>`。例如：

```sh
git push origin master：refs/for/master
```

如果省略远程分支名，则表示将本地分支推送与之存在”追踪关系”的远程分支(通常两者同名)，如果该远程分支不存在，则会被新建。

```sh
git push origin master
```

上面命令表示，将本地的`master`分支推送到`origin`主机的`master`分支。如果后者不存在，则会被新建。

如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支。

```sh
git push origin :master   # 等同于 git push origin --delete master
```

上面命令表示删除`origin`主机的`master`分支。

如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。

```sh
git push origin
```

上面命令表示，将当前分支推送到`origin`主机的对应分支。

如果当前分支只有一个追踪分支，那么主机名都可以省略。

```sh
git push
```

### 1.5 git push 和冲突解决

`git push`的时候如果有冲突，会显示如下，此时必须去修复这个冲突。

<img src="../imgs/95/02.webp" />

首先调用`git pull`去拉取分支下来，然后会在冲突的文件里记录冲突的内容，手动去解决冲突，然后  
再`git commit`和`git push`。

<img src="../imgs/95/03.webp" />

## 02 git commit 合并

在使用 git 的时候，可能针对同一个任务由多次提交，比如针对同一个`feature`可能由多个同事修改了不同部分，但是多个提交让我们的版本管理显得比较凌乱，此时我们可以合并多个`commit`为一个。

首先假设我们有三个`commit`，如左下所示：我们想把最近的三个`commit`合并为一个`commit`，那么此时我们可以使用`git rebase`命令了，即`git rebase –i 4cbeb4248f7`，`-i`后面的参数表示不要合并的`commit`的`hash`值。

<img src="../imgs/95/04.webp" />

可以看到其中分为两个部分，上方未注释的部分是填写要执行的指令，而下方注释的部分则是指令的提示说明。指令部分中由前方的命令名称、`commit hash`  和  `commit message`  组成。

`pick`和 `squash`的意思如下：

- `pick`  的意思是要会执行这个  `commit`。
- `squash`  的意思是这个  `commit`  会被合并到前一个`commit`。

将`ad777ea`和`a271901`这两个`commit`前方的命令改成`squash`或`s`，然后输入`:wq`以保存并退出。

<img src="../imgs/95/05.webp" />

退出后会弹出如下界面，即需要重新编辑合并后的`commit`信息，未注释掉的是会包含在`commit message`里的，按”`wqa`”保存后即完成了此次`commit`的合并。

<img src="../imgs/95/06.webp" />

## 03 修改 commit 的内容

### 3.1 修改自己的提交

有时候，提交一个`commit`后，发现有些部分漏掉了，尤其是有的内容忘记添加到暂存区了，导致这些内容没有`commit`，那如果我们把这些“漏掉”内容作为一个新的`commit`提交总不太好，其实我们可以把“漏掉”的内容提交到上一个`commit`里。

还有时候，我们刚刚最近的一次提交的`commit message`写的内容不够严谨，需要重新整理下。

那上面的两种场景，我们怎么处理呢？ 答案是`git commit –amend`。比如最近的一次提交的内容少提交了一个`README.md`文件了，而且“`Merge branch ‘master’ of 47.106.79.26:/srv /nginx-docs`”的内容也不够严谨，需要规范化提交内容。此时我们可以先调用`git add README.md`文件到暂存区，然后调用`git commit –-amend`把当前暂存区里的内容合并到上一次`commit`里，而且还可以修改上一次提交的`message`信息。

```sh
git commit --amend
```

跳出一个 VIM 编辑框（如左下图），此时我们可以修改提交内容格式（如右图）。

<img src="../imgs/95/07.webp" />

### 3.2 修改任意提交的 message

如果我们想要修改比较久远的`commit message`的格式不太符合规范，怎么去修改呢？比如我想修改从`bed58d54e`之后所有的`commit message`的内容？

```sh
# 打算从bed58d54e（不包含bed58d54e）之后所有的commit的message
git rebase –i bed58d54e
```

输入上面一条命令后，会弹出下文这个窗口，上半部分是一些`pick`命令，下半部分是一些提示内容，不过有意思的是此时的`commit`内容的排列和`git log`里的排列是反的，也就是倒序的。如果我们仅仅修改`commit message`，需要把打算修改的`commit`的对应`pick`命令修改为`reword`，然后保存。

之后会弹出编辑`commit message`的内容，如果我们有多处`commit`需要被修改的话会多次弹出`vim`编辑窗口。如果在修改前所有的`commit`都已经`push`到远程仓库的话，我们需要使用`git push --force`强制推送到远程仓库。

<img src="../imgs/95/08.webp" />

上文仅仅说明了修改历史提交的`message`，但是如果在某个历史提交中少提交内容，比如上文某个源码文件里的内容修改不完整，提交很多天经过严格测试才发现，那么我们就可以使用`git rebase`的`edit`命令修改提交内容了。
