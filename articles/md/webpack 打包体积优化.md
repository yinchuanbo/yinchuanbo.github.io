---
title: "webpack 打包体积优化，app.js 文件从 9.2MB 优化至 2.7MB"
tag: "前端工程化"
---

## 未优化前 app.js 文件大小

未优化前 app.js 文件大小为 9.2MB

## 写一个 webpack 插件，找出 size 比较大的 module

```js
class WebpackCustomPlugin {
    compiler.hooks.done.tap('', (stats) => {
        const chunks = stats.compilation.chunks
        chunks.forEach(chunk => {
            consone.log(chunk.id, chunk.files)
            const newModules = []
            // 遍历组合成chunk的modules，将一些需要的数据放入到数组中
            for(const module of chunk._modules) {
                newModules.push({
                    id: module.id,
                    resource: module.resource,
                    _sourceSize: module._sourceSize,
                    reasons: module.reason[0]?.module?.id
                })
            }
            // 对newModules数组按大小排序
            newModules.sort((a, b) => b._sourceSize - a._sourceSize)
            if (chunk?.id.toString().indexOf('app') > -1) {
                console.log(newModules.slice(0, 20))
            }
        })
    })
}
```

## 优化 1

`src/theme/index.less` 文件大小 706977，定位到该文件，发现语句`@import '~ant-design-vue/dist/antd.less'`，项目已经按需加载 `ant-design-vue`，所以只需要删除该语句。删除后 app.js 大小为`7.5MB`。

## 优化 2

一个大小为 26943 的 `TableSetting.vue` 组件全局引入了，但没有地方使用，所以删除。删除后 app.js 大小为`7.4MB`

## 优化 3

将个别页面使用到的组件，从 main.js 文件移除注册，优化后，app.js 文件大小为`6.8MB`。

## 优化 4

发现很多大的图片，都被打包到了 app.js 中

设置 url-loader 的阀值为 8KB，即超过 8K 大小的图片文件不会转换为 DataURL。

优化后 app.js 文件大小为`2.7MB`

原来 app.js 文件里面大部分都是图片的大小！！！
