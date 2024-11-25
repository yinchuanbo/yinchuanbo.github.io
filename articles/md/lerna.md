---
title: "lerna"
tag: "Lerna"
time: 2024-11-25 22:21:48
---

## 前言

`lerna`是一个著名的包管理器，虽然现在`pnpm`的`monorepo`火的一塌糊涂，但是我认为`lerna`还是相对成熟一些，毕竟`@vue/cli`、`create-react-app`、`babel`等都是使用`lerna`进行管理。同时`lerna`有完整的社区，至今也已经发展到`8.x`的版本，2024 年，还是很有必要学习和掌握这门技术的！

## 开始

### lerna init 初始化项目

创建一个项目

```sh
cd Desktop && mkdir lerna-demo
```

进入项目后，使用`npm`项目初始化项目

```sh
cd lerna-demo
npm init -y
```

全局安装`lerna`

```sh
npm install lerna -g
```

使用`vscode`打开项目后，使用`lerna`初始化

```sh
lerna init
```

这个时候你会发现控制台报错了

<img src="../imgs/105/01.awebp" />

网上大部分资料都是直接使用`lerna init`就可以初始化项目，但是新版的`lerna`（`8.0`版本）脚手架需要加上`--packages`的`option`，详情可以看[官方文档](https://lerna.js.org/docs/getting-started#adding-lerna-to-an-existing-repo)

<img src="../imgs/105/02.awebp" />

按照文档，我们再次初始化项目

```sh
lerna init --packages="packages/*"
```

我们会发现，`lerna`自动被安装到了`devDependencies`，同时使用`git`进行版本管理和创建了`lerna.json`配置文件

<img src="../imgs/105/03.awebp" />

手动修改`lerna.json`中的版本号为`1.0.0`

<img src="../imgs/105/04.awebp" />

### lerna create 创建子项目

初始化项目后，使用`lerna create`命令来创建子项目，这里我创建一个名为`core`的子项目

```sh
lerna create core
```

需要注意的是输入`package name`时，不能直接输入`core`，因为这个包会被作为单独的`npm`包发布，`core`同名的包肯定会存在的。我们可以群组的形式创建，最终包名就是`@lerna-demo/core`，类似`@vue/cli`、`@vue/composition-api`

> 发布的前提是需要在 npm 官方中创建群组（例如：@learn-demo），这个后面会讲

<img src="../imgs/105/05.awebp" />

上面的创建步骤完成后，子项目`core`的`package.json`就会显示完整的包名

<img src="../imgs/105/06.awebp" />

紧接着我们可以继续创建一个`util`子项目

```sh
lerna create util
```

最终的目录结构如图

<img src="../imgs/105/07.awebp" />

### lerna list 查看子项目

使用`list`命令可以查看被`lerna`管理的子项目

```sh
lerna list
or
lerna ls
```

<img src="../imgs/105/08.awebp" />

### 废弃的 lerna add

`v7`版本之前，是可以使用这个命令可以为项目安装依赖

```sh
lerna add lodash #为所有子项目安装lodash
#or
lerna add lodash --scope @lerna-demo/core #给core项目安装lodash
#or
lerna add lodash --scope @lerna-demo/core --scope @lerna-demo/util #给core和util安装lodash
```

但是从`v7`之后，这个命令就被废弃了，详情见[官方文档](https://lerna.js.org/docs/legacy-package-management)

<img src="../imgs/105/09.awebp" />

由于我们安装的是最新版本的`v8.x`，所以无法继续使用这个命令

<img src="../imgs/105/10.awebp" />

我们如果想给项目安装依赖，使用原来的`npm/yarn/pnpm`即可

<img src="../imgs/105/11.awebp" />

根据文档，我们只需要加上`-w`标识即可

```sh
npm install lodash -w packages/core
#or
npm install lodash -w packages/core -w packages/util
```

细心的同学发现，安装后虽然显示了安装成功，但是`core`或者`util`目录下都没有`node_modules`，它是否有正确安装了呢？

<img src="../imgs/105/12.awebp" />

我们在`core`的项目中尝试使用`lodash`

<img src="../imgs/105/13.awebp" />

代码正常运行，说明`lodash`已经安装成功了，但实际是被安装到了最外层的`node_modules`中。这实际也是`v8`版本后的改动，所有依赖都放在最外层，避免`node_modules`的巨型体积问题。

### lerna clean 清空依赖

除了安装依赖之外，必然少不了清空依赖。

```sh
lerna clean #清空所有项目的依赖
#or
lerna clean --scope @lerna-demo/core #清空core的依赖
#or
lerna clean --scope @lerna-demo/core --scope @lerna-demo/util #清空core和util的依赖
```

我们先看一下`core`和`util`项目的`dependencies`

<img src="../imgs/105/14.awebp" />

执行命令后，显示成功了，但是发现`dependencies`中依然存在。这样设计可能是因为`lerna`可能考虑到用户需要重新安装依赖，所以没有删除。

<img src="../imgs/105/15.awebp" />

### 废弃的 lerna bootstrap

上面提到可能需要重新安装依赖，没错`lerna`在`v7`之前确实是通过`bootstrap`命令实现的

```sh
lerna bootstrap #重新安装所有项目的依赖
#or
lerna bootstrap --scope @lerna-demo/core #重新安装core的依赖
#or
lerna bootstrap --scope @lerna-demo/core --scope @lerna-demo/util #重新安装core和util的依赖
```

但是和`add`命令一样，这个命令也被废除了

<img src="../imgs/105/16.awebp" />

如果需要重新安装依赖，直接使用`npm/yarn/pnpm`即可, 因为`dependencies`中依然存在被`clean`掉的信息，所以我们随时可以重新安装这些依赖。

### 废弃的 lerna link

`link`命令在`v7`版本之前被用来将子项目中相互依赖的包都在本地 link 方便本地调试，例如`core`中依赖了`util`，所以我们可以执行：

```sh
lerna link
```

但是这条指令在`v8`已经被废弃了

<img src="../imgs/105/17.awebp" />

解决这个问题，我们直接安装对应的包名即可，`lerna`会为我们创建对应的软链

```sh
npm install @lerna-demo/util -w packages/core
```

<img src="../imgs/105/18.awebp" />

同时，会安装到`core`项目的`node_modules`目录下

<img src="../imgs/105/19.awebp" />

我们尝试在`core`项目中引入`util`

<img src="../imgs/105/20.awebp" />

没有任何问题，在`core`中可以顺利调用`util`

### @lerna/legacy-package-management

如果你确实很需要`add`、`boostrap`、`link`，或者旧版的`lerna`升级到了最新为了适配，可以安装`@lerna/legacy-package-management`来解决，这个包保留了这三个命令的使用

<img src="../imgs/105/21.awebp" />

我们安装一下这个包：

```sh
npm install @lerna/legacy-package-management -D
```

试一下`lerna add`

```sh
lerna add axios #同时安装 axios 到 core 和 util
```

<img src="../imgs/105/22.awebp" />

此时，`core`和`util`都安装了`axios`依赖，说明这个包又兼容了废弃的指令，这对那些升级`lerna`需要兼容的同学是比较友好的。另外两个命令我就不试了，感兴趣的同学可以自己尝试一下。

### lerna exec 执行终端命令

使用过`node`的`child_process`命令的同学对`exec`这个方法应该都不陌生，`lerna exec`也是用来代替做同样的事情，而这个上下文正是`packages`目录下管理的子项目，并非是根目录，这一点需要注意

```sh
lerna exec ls #查看core和util所有文件
```

<img src="../imgs/105/23.awebp" />

```sh
lerna exec --scope @lerna-demo/core -- rm -rf node_modules #删除core的node_modules
```

> 其格式是：lerna exec --scope [pkgName] -- [stream]

<img src="../imgs/105/24.awebp" />

### lerna run 执行 npm script

`run`命令和`exec`命令很像，一般使用`run`命令大都是执行子项目中`script`脚本的命令，例如一键启动项目，或者一键打包等等

```sh
lerna run dev #一键启动所有项目
#or
lerna run build --scope @lerna-demo/core #打包 core 项目
```

<img src="../imgs/105/25.awebp" />

如果有指定`npm/yarn/pnpm`的需求，也是可以做到的，通过`--npm-client`即可，可选值有：`npm/yarn/pnpm`

```sh
lerna run test -- npm-client yarn #使用 yarn 来执行 test 脚本
```

## 发布

上述一系列操作基本都是在开发阶段时使用的，现在来讲一下发布阶段如何使用`lerna`进行管理。**但是在使用`lerna`为我们发布管理之前，前提是需要将项目管理`git`仓库，这个是前提！**

### lerna diff 查看版本差异

使用这个命令的前提是需要有`commit`记录，拿当前改动与`commit`进行比较，功能和`git diff`一致

将之前的代码提交后，随意修改一个文件

<img src="../imgs/105/26.awebp" />

<img src="../imgs/105/27.awebp" />

只有有文件改动，就可以使用`diff`查看

### lerna version 更新项目版本号

使用`version`命令可以更新项目版本号，目前`core`和`util`都是`1.0.0`版本，执行这条命令的前提是不能有文件改动（所有改动已被提交）

```sh
lerna version
```

<img src="../imgs/105/28.awebp" />

此时版本号已经更新了，但是控制台报错了，原因是因为我之前把`packag-lock.json`加入到了`.gitignore`中

<img src="../imgs/105/29.awebp" />

我们去掉`packag-lock.json`，同时加入`lerna-debug.log`，并且撤销`package.json`和`lerna.json`的修改，同时生成一条新的`commit`记录。

<img src="../imgs/105/30.awebp" />

再次执行`lerna version`，更新版本号

<img src="../imgs/105/31.awebp" />

命令执行成功，并且向远程仓库推送了`tag`版本号：`1.0.1`

<img src="../imgs/105/32.awebp" />

### lerna publish 发布

`publish`命令会将项目发布到[npm](https://www.npmjs.com/)中，执行这个命令，首先会执行一遍`lerna version`的操作，由于我们用的是`@lerna-demo/xxx`这种群组的形式，前提是需要在`npm`中创建这个群组

<img src="../imgs/105/33.awebp" />

但是很不幸，`@lerna-demo`这个群组已经被创建了！（狗头），所以后面的流程就没办法演示下去了（懒得换个名字了，哈哈）。只要创建完群组之后，执行`lerna publish`即可，会同向远程仓库推送新的`tag`标签，并且会发布到`npm`仓库中。

## 其它

除了上述常见用法之外，还有一些冷门的指令，我们可以通过`lerna -h`查看

<img src="../imgs/105/34.awebp" />

- `lerna info` 打印本地环境的调试信息
- `lerna add-caching` 生成任务运行器配置的交互式提示符
- `lerna changed` 列出自上一个带标签的版本以来已更改的本地包
- `lerna repair` 运行自动迁移以修复知识库的状态
- `lerna watch` 每当包或其依赖项更改时，运行命令
- `lerna import` 将包导入到带有提交历史记录的`monorepo`中

这几个命令平时不怎么用，根据自己需要的使用即可。
