---
title: "并不是所有的 mp4 视频都能被 video 标签播放"
tag: "疑难问题"
time: 2024-09-01 15:21:24
---

今天遇到个奇怪的 bug，好好一个 mp4 视频在本地所有设备均可正常播放，但是上传至 cos 之后插入富文本，发现 video 标签只能识别出音频，并无视频。

## 原因

首先 video 标签并不能解析所有视频编码格式，它只支持 `MPEG4，Ogg，WebM` 三种视频格式。支持的视频格式及编码格式如下：

![](../imgs/20/01.awebp)

**但是，video 标签对这三种视频格式是有具体要求的**

- Ogg = 带有 Theora 视频编码 + Vorbis 音频编码
- MPEG4 = 带有 H.264 视频编码 + AAC 音频编码
- WebM = 带有 VP8 视频编码 + Vorbis 音频编码

## MP4 格式中 H264 和 MPEG 编码格式的区别

**MPEG-4 编码技术**

MPEG－4：MPEG－4 是一个适用于低传输速率应用的方案，MPEG-4 是在 MPEG-1、MPEG-2 基础上发展而来，是为了播放流式媒体的高质量视频而专门设计的，它可利用很窄的带度，通过帧重建技术，压缩和传输数据，以求使用最少的数据获得最佳的图像质量。

MPEG-4 标准则是基于对象和内容的编码方式，和传统的图像帧编码方式不同，它只处理图像帧与帧之间的差异元素，抛弃相同图像元素，因此大大减少了合成多媒体文件的体积，从而以较小的文件体积同样可得到高清晰的还原图像。换句话说，相同的原始图像，MPEG-4 编码标准具有更高的压缩比。

**H.264 编码技术**

H.264 是 ITU-T 国际电联与 ISO 国际标准化组织联合制定的视频编解码技术标准，h.264 是一种高性能的视频编解码技术。

H.264 最大的优势是具有很高的数据压缩比率，在同等图像质量的条件下，H.264 的压缩比是 MPEG-2 的 2 倍以上，是 MPEG-4 的 1.5 ～ 2 倍。

一个原始文件是 102G 大小的视频，经过 H.264 编码后变成了 1 个 G，压缩比竟达到了 102:1。因此 H.264 的低码率技术起到了至关重要的作用， 在用户获得高质量流畅图像的同时，大大节省了下载时间和数据流量，也大大减少了图像存储空间。

H.264 是在 MPEG-4 技术的基础之上建立起来的，其编解码流程主要包括 5 个部分：帧间和帧内预测(Estimation)、变换(Transform)和反变换、量化(Quantization)和反量化、环路滤波(Loop Filter)、熵编码(Entropy Coding)。

视频监控技术经过多年的发展，并且由于 H.264 的高压缩性能，目前市场上主流的视频基本采用的是 H.264 标准。

## 排查过程

发现视频无法解析，只能解析音频，如下：

![](../imgs/20/02.awebp)

怀疑是视频编码导致视频无法解析，百度搜索关键词：video 标签+视频编码

查找到 video 标签支持的视频编码格式如上

使用 `QQ 影音播放器` 查看出问题视频的编码信息：

![](../imgs/20/03.awebp)

编码格式为 mpeg，而非 h264，真相大白！

正常的视频应该是如下这样的：

![](../imgs/20/04.awebp)
