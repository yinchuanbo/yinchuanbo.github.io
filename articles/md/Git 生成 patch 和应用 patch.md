---
title: "Git 生成 patch 和应用 patch"
tag: "Git"
time: 2024-09-01 15:21:24
---

我们进行开发工作经常需要给代码制作补丁，并且将补丁应用到其它版本的代码当中。在 Git 出来之前我们通过使用 diff 和 patch 命令制作和应用补丁。那么，Git 下是否有更为方便的命令呢？下面带领大家了解一下如何使用 Git 命令制作和应用补丁。

## 制作补丁

**1\. 最后一次提交**

我们经常修复 Bug，然后将该 Bug 的代码合并到某个分支中，如果每个分支都通过手动修改就会非常麻烦，这是可以将修改的代码制作称一个补丁，然后应用到其它分支即可。当我们修改并提交代码后，这个代码通常是最后一次提交，因此可以用下面命令非常方便的制作一个补丁。其中，-1 表示最后一次提交，-o 表示补丁文件输出的目录。

```sh
git format-patch -1 -o /root/patch/
```

有的时候这个 Bug 非常复杂，我们可能进行了多次提交，这个时候可以将命令调整为如下格式。示例中-5 表示将最近 5 次提交制作成补丁。当然可以用下面介绍的第 2 中方式。

```sh
git format-patch -5 -o /root/patch/
```

**2\. 从某 commit 以来的修改**

有的时候这个 Bug 非常复杂，我们可能进行了多次提交，而且可能数起来都非常麻烦，这个时候可以将命令调整为如下格式，这个命令格式将某次提交（不包含该次提交）之前的所有提交做成补丁。

```sh
git format-patch de85add54522b7ca3b7ad99c7c5ea24525d39ba0 -o /root/patch/
```

如果我们只想将该次提交制作称补丁，那么应该怎么办呢？可以使用如下命令：

```sh
git format-patch -1 de85add54522b7ca3b7ad99c7c5ea24525d39ba0 -o /root/patch/
```

如果想将该次提交之前的若干个提交一起制作成补丁呢？可以使用如下命令，将该次提交之前的 3 个提交（含本次提交）制作成 bud

```sh
git format-patch -3 de85add54522b7ca3b7ad99c7c5ea24525d39ba0 -o /root/patch/
```

**3\. 两个 commit 间的修改**

有的时候可能需要将新版本中解决 Bug 的代码移到老版本中，而代码提交的又多，又很久远。这是可以将两次提交之间的内容（包含两个 commit）全部做成补丁。需要注意的是两次 commit id 之前是三个点（...）。

```sh
git format-patch 7f581e5fabbed21ad8c8ccd3398513d626f01ecf...de85add54522b7ca3b7ad99c7c5ea24525d39ba0e919cd7a -o /root/patch/
```

其实这个 commit id 不需要全量，可以只截取一部分。

```sh
git format-patch 7f581e5fabbed...de85add54522b7 -o /root/patch/
```

## 应用补丁

制作的补丁最终肯定是要用的，下面我们介绍一下如何使用 git 补丁。首先需要把生成的 patch 文件拷贝到某个目录下。比如本文假设生成在/root/patch/下。

**1\. 检查 patch（补丁）文件**

这个命令用于检查补丁文件，确保文件没有问题。

```sh
git apply --stat /root/patch/0001-test-fix.patch
```

**2\. 查看是否可以应用成功**

这个命令用于检查如果应用到本代码树是否会有问题，相当于一个演练。这样可以避免合并的时候才出现问题。

```sh
git apply --check /root/patch/0001-test-fix.patch
```

**3\. 实际应用补丁**

这个命令是进行实际的应用，此时补丁代码会合并到代码树中。

```sh
git am -s /root/patch/0001-test-fix.patch
```
