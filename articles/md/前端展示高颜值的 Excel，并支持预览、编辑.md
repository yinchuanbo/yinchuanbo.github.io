---
title: "前端展示高颜值的 Excel，并支持预览、编辑"
tag: "工具集"
time: 2024-10-05 21:24:15
---

大家平时在做业务的时候，可能会遇到  **在线预览、编辑 Excel**  的功能，这几天发现了一个前端库，它叫  **Univer**，挺实用的，推荐给大家吧~

<img src="../imgs/88/03.webp" />

这是基本的页面效果

<img src="../imgs/88/04.webp" />

官网有非常多的例子，供你复制

<img src="../imgs/88/02.gif" />

> 文档地址：https://github.com/dream-num/univer/blob/dev/README-zh.md

## Univer 有哪些亮点呢？

- 多文档类型支持：Univer 目前支持电子表格和富文本文档，并计划未来添加幻灯片的支持。
- 无缝集成：Univer 可以轻松地与你的应用程序集成，提供流畅的用户体验。
- 强大的功能：Univer 提供多种功能，涵盖公式计算、条件格式、数据验证、筛选、协同编辑、打印、导入导出等，未来将继续推出更多新功能。
- 灵活的扩展性：凭借插件化架构和 Facade API，Univer 的功能扩展变得简单，你可以根据自己的需求在其基础上构建定制化的解决方案。
- 高度个性化：用户可以通过主题选项定制 Univer 的外观，同时支持多语言国际化。
- 卓越的性能：Univer 采用先进技术，提供高效的性能表现。
- 基于 Canvas 的渲染引擎：Univer 拥有高效的渲染引擎，能够快速渲染各种文档类型，并支持如标点挤压、盘古之白、图文混排和滚动贴图等高级特性。
- 自主研发的公式引擎：该引擎具有极快的计算能力，并能在 Web Worker 中运行，未来还将支持服务端计算。
- 高度互操作性：文档、电子表格和幻灯片之间可以相互操作，甚至可以在同一画布上渲染，实现信息和数据的自由流动。

## 基本使用

使用  **Univer**  去实现一个基本的在线 Excel 页面，是很简单的

<img src="../imgs/88/05.webp" />

```sh
pnpm add @univerjs/facade
```

```js
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";

import { LocaleType, Tools, Univer } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";

import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";

import { UniverUIPlugin } from "@univerjs/ui";

import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";

import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";

import DesignEnUS from "@univerjs/design/locale/en-US";
import UIEnUS from "@univerjs/ui/locale/en-US";
import DocsUIEnUS from "@univerjs/docs-ui/locale/en-US";
import SheetsEnUS from "@univerjs/sheets/locale/en-US";
import SheetsUIEnUS from "@univerjs/sheets-ui/locale/en-US";
import SheetsFormulaEnUS from "@univerjs/sheets-formula/locale/en-US";
```

```js
const univer = new Univer({
  theme: defaultTheme,
  locale: LocaleType.EN_US,
  locales: {
    [LocaleType.EN_US]: Tools.deepMerge(
      SheetsEnUS,
      DocsUIEnUS,
      SheetsUIEnUS,
      SheetsFormulaEnUS,
      UIEnUS,
      DesignEnUS
    ),
  },
});

univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);

univer.registerPlugin(UniverUIPlugin, {
  container: "app",
});

univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin);

univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverSheetsFormulaPlugin);

univer.createUnit(UniverInstanceType.UNIVER_SHEET, {});
```

## Univer 有哪些特点呢？

- **核心功能：** Univer 提供电子表格的基本构成，包括单元格、行、列、工作表和工作簿。
- **公式支持：**  可以使用多种类型的公式，涵盖数学、统计、逻辑、文本处理、日期与时间、查找与引用、工程、金融和信息处理等领域。
- **权限管理：**  用户可对特定元素的访问进行限制，确保数据安全。
- **数字格式化：**  支持根据预设条件对数字进行格式化处理。
- **超链接功能：**  可以在电子表格中插入链接，指向外部网站、电子邮件地址及其他文档位置。
- **浮动图片：**  用户可以将图片插入电子表格，并自由放置在任何位置。
- **查找与替换：**  提供在电子表格中搜索特定文本并用其他文本替换的功能。
- **数据筛选：**  允许用户根据指定条件对数据进行筛选。
- **数据排序：**  支持根据特定条件对数据进行排序操作。
- **数据验证：**  能够限制单元格中输入的数据类型，以确保数据的有效性。
- **条件格式化：**  可以根据特定条件对单元格应用不同的格式样式。
- **添加评论：**  允许用户在单元格中添加评论，以便提供额外的信息和说明。
- **数据透视表：**  支持创建数据透视表，使用户能够对数据进行汇总和深入分析。
- **协同编辑：**  多个用户可以同时对同一电子表格进行编辑，实现实时协作。
- **打印与导出：**  支持将电子表格打印或导出为 PDF 格式。
- **导入与导出：**  允许导入和导出 XLSX 格式的数据文件。
- **图表支持：**  通过 VChart 支持第三方图表，增强数据可视化能力。

## Univer 未来将实现的功能？

- **核心功能：** Univer 支持文档的核心功能，包括段落、标题、列表、上标、下标等。
- **列表：**  支持有序列表、无序列表和任务列表。
- **超链接：**  支持在文档中插入外部网站、电子邮件地址的链接。
- **浮动图片：**  允许将图片插入到文档中，并支持图文混合排版。
- **页眉 & 页脚：**  允许向文档添加页眉和页脚。
- **评论：**  允许向文档添加评论以提供额外信息。
- **导入：**  支持导入 DOCX 格式的数据。
- **协同编辑：**  支持多个用户同时编辑文档。
