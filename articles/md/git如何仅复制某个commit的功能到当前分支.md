---
title: "git 如何仅复制某个 commit 的功能到当前分支"
tag: "Git"
time: 2025-01-04 08:42:04
---

## git cherry-pick 功能介绍

开发中有时需要将某个 commit 的功能应用到当前分支。例如订单系统中先后开发了创建订单、提交订单、支付订单的功能并提交到主分支。此时基于主分支创建了 simple-order 分支，具备订单系统的简易功能作为一个免费版的系统，主分支定位为付费版系统。后续主分支上先后又提交了订单统计、性能优化功能。现在需要将性能优化的功能应用到免费版。如果使用 git merge 或 git rebase 会将主分支上的所有功能（包括订单统计和性能优化）都应用过来，显然这不是我们想要的。git 中提供了 cherry-pick 命令可实现仅复制某个 commit 的更新到当前分支。因为主分支上的订单统计和性能优化是两个 commit 提交的，所以这里可以实现仅复制性能优化部分的代码到免费版。

`git cherry-pick` 会产生一个新的 commit。

## 案例演示

1. 初始化项目，开发基本功能

```sh
git init
touch 订单系统.txt
touch 创建订单.txt
touch 提交订单.txt
touch 支付订单.txt
git add .
git commit -m "订单系统"
```

2. 基于主分支创建免费版系统的分支

```sh
git checkout -b simple-order
```

3. 主分支(付费版)开发订单统计功能

```sh
git checkout master
touch 订单统计.txt
git add .
git commit -m "订单统计"
```

4. 主分支(付费版)开发性能优化功能

```sh
touch 性能优化.txt
git add .
git commit -m "性能优化"
```

5. 主分支(付费版)上的全部功能

<img src="../imgs/133/05.webp" />

6. 查看并记下主分支(付费版)性能优化所在的 commit

```sh
git log
```

7. 切换到免费版分支

```sh
git checkout simple-order
```

8. 将性能优化所在 commit 功能应用到当前分支

```sh
git cherry-pick 8d72d27166
```

9. git cherry-pick 以后产生的新的 commit

<img src="../imgs/133/06.webp" />

10. 免费版分支上复制过来的特定 commit 功能(性能优化)

<img src="../imgs/133/07.webp" />
