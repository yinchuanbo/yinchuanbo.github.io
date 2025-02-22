---
title: "分享一个最新最好用的免费项目部署方案 EdgeOne Pages"
tag: "部署"
time: 2025-02-22 10:08:01
---

<img src="../imgs/144/01.webp" />

今天有个意想不到的收获，就是意外发现了 EdgeOne Pages：一个**免费的、方便的、直接支持自动化部署、自动全球加速、自动预热、支持边缘 serverless 的全栈项目部署方案**

这是一个超级新的项目，新到连搜索引擎都搜不到它。

我看了一下他的产品动态，发现他在去年十月底才支持全球加速，十二月才支持全栈项目。

<img src="../imgs/144/02.webp" />

今天鬼使神差的，在逛腾讯云后台的时候，不小心点到了，简单看了一下介绍，这不就是我最想要的东西吗

1. 直接支持自动部署，代码提交就构建
2. 配置域名之后就直接支持静态加速，不需要任何额外的配置
3. 还直接支持 边缘 Serverless
4. 先阶段、**全免费**

**这简直太适合开发个人项目了**。

按照腾讯过往微信小程序和腾讯会议等产品的节奏，估计免费周期可以长达两年。况且这个产品现在还处于 beta 版本，可能免费的时间还会更长。用起来真的超级方便。

github pages 直接一点都不香了。vercel 也见鬼去吧 ... 国内项目还是用国产的香啊

我尝试部署了一个刚创建的 next.js 项目模板，跟大家分享一下部署过程。

### 1. 绑定 github 仓库并部署

目前仅支持代码仓库放在 github 上，预计未来会扩展。

<img src="../imgs/144/03.webp" />

按照流程点击授权之后，选择你的代码仓库安装 `EdgeOne pages`。选中之后就可以在下面看到项目。

<img src="../imgs/144/04.webp" />

点击该项目即可开始创建部署。

配置非常简单，按照流程和提示直接走就行了。

<img src="../imgs/144/05.webp" />

这里需要注意的是，架构预设最好选择你的项目技术栈，然后输出目标选择你 `build` 之后的目录。自动部署时，后台会在服务端依次执行如下执行

```sh
npm install
npm run build
```

这里的输出目录有的时候默认为 dist，但是你也可以在自己的脚手架里配置，保持一致即可。我这里统一配置为了 `docs`

在项目中的 `next.config.ts` 中修改了一下

这里的输出目录有的时候默认为 dist，但是你也可以在自己的脚手架里配置，保持一致即可。我这里统一配置为了 `docs`

在项目中的 `next.config.ts` 中修改了一下

```js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "docs",
};

export default nextConfig;
```

由于目前针对 next.js 并没有提供完整的支持，因此我们要把输出配置稍作调整以输出 SSG 内容。相关的配置可以在官方文档有特殊说明

```js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "docs",
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

配置好之后，点击部署按钮，就可以正常部署了。

部署成功之后会弹出一个提示框

<img src="../imgs/144/06.webp" />

### 2. 配置域名

你首先需要有一个备案了的域名。

部署成功之后，点击 i 添加自定义域名

<img src="../imgs/144/07.webp" />

此时，我们可以先不要对域名做任何设置，你可以先输入没有解析的次级域名点击下一步

然后就可以看到会出现记录值。

<img src="../imgs/144/08.webp" />

有了这个记录值之后，再去域名解析的后台里，解析对应的主机记录 CNAME 到该记录值即可。

解析成功之后点击验证，稍等几分钟之后就可以验证成功。

此时我们还不能直接通过`c.usehook.cn` 访问项目，因为还没有生成证书。切换到域名管理的 tab 这一项，我们可以看到此时证书正在生成中。

证书生成成功之后，状态如下。此时就可以直接访问了。

<img src="../imgs/144/09.webp" />

访问成功如下所示，大家也可以手动输入 `a.usehook.cn` 访问一下我部署的这个 demo.

<img src="../imgs/144/10.webp" />

### 3. 总结

EdgeOne Pages 还处于 beta 阶段，经过验证，他已经基本可以用，跟我之前用过的 github pages，vercel 等方案相比，这是我认为最简单的一种方案。

<img src="../imgs/144/11.webp" />

并且，目前这个阶段，啥都是免费的，免费的证书，免费的 CDN 加速，免费的边缘计算，免费的数据库... 对于个人项目来说，简直不要太爽...
