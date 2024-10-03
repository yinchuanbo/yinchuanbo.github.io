---
title: "UpSnap 搭建一款开源且精美的网络唤醒服务"
tag: "Tools"
---

## 项目介绍

`UpSnap`是在 Github 中开源的一个局域网唤醒工具，它使用 SvelteKit、Go、PocketBase 和 nmap 编写，可以通过网络唤醒局域网内的设备。UpSnap 的主要作用是允许用户通过网络发送特定的数据包（称为“魔法包”）来启动处于休眠或关机状态的计算机或其他设备，这项技术通常被用于系统管理、远程访问和各种自动化场景中。

<img src="../imgs/83/02.webp" />

## 主要功能

- **一键设备唤醒仪表盘**：用户可以通过简单的界面唤醒设备。
- **定时事件自动化**：支持通过 Cron 任务设置自动化操作。
- **端口扫描**：可以选择性扫描网络端口。
- **设备发现**：支持网络扫描（需要 nmap）。
- **用户管理**：提供安全的用户管理功能。
- **国际化支持**：支持多语言。
- **丰富的主题**：提供 29 种主题选择。
- **Docker 支持**：提供适用于多种架构的 Docker 镜像，包括 amd64、arm64、arm/v7、arm/v6。
- **自托管**：支持自行托管部署。

## 项目地址

> Github: https://github.com/seriousm4x/UpSnap

<img src="../imgs/83/03.webp" />

## 搭建教程

### 二进制部署

根据自身的系统架构，可前往 Github 中的开源仓库 releases 中下载对应架构的软件包：

> https://github.com/seriousm4x/UpSnap/releases

<img src="../imgs/83/04.webp" />

Linux 用户可参考以下命令运行：

```sh
# 在 8090 端口启动web服务
sudo ./upsnap serve --http=0.0.0.0:8090
```

Windows 用户则需要打开终端，并在软件根目录下执行命令启动：

```sh
upsnap.exe serve --http=0.0.0.0:8090
```

<img src="../imgs/83/05.webp" />

## 使用 Docker 部署

使用 docker 运行服务的服务能够脱离平台的限制，可以快速运行在群晖、极空间等各种 NAS 服务之间：

```sh
docker run -d \
--restart unless-stopped \
--network host \
--name upsnap \
-v /path/to/your/data:/app/pb_data \
ghcr.io/seriousm4x/upsnap:latest
```

在 NAS 中运行，例如群晖上更推荐使用 docker compose 的方式：

```sh
services:
  upsnap:
    container_name: upsnap
    image: ghcr.io/seriousm4x/upsnap:4 # images are also available on docker hub: seriousm4x/upsnap:4
    network_mode: host
    restart: unless-stopped
    volumes:
      - ./data:/app/pb_data
```

## 访问配置

搭建完成后，通过访问 IP+8090 端口访问网络唤醒服务，并根据提示进行配置：

<img src="../imgs/83/06.webp" />

初始化完成后，在首页添加我们需要远程唤醒的局域网内的设备：

<img src="../imgs/83/07.webp" />

除了手动配置，还支持扫码内网指定网段内的设备进行快速添加：

<img src="../imgs/83/08.webp" />