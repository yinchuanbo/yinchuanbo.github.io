---
title: "Jenkins and Docker 实现一键自动化部署项目"
tag: "部署"
time: 2024-11-04 21:29:53
---

**环境要求**：CentOS 7 + Git (Gitee)

**实现步骤概述**：在 Docker 中安装 Jenkins，配置基本信息，利用 Dockerfile 和 Shell 脚本实现项目的自动拉取、打包和运行。

## 安装 Docker

1. 更新 yum 包：

```sh
yum update
```

2. 卸载旧版本（如果存在）：

```sh
yum remove docker docker-common docker-selinux docker-engine
```

3. 安装所需软件包：

```sh
yum install -y yum-utils device-mapper-persistent-data lvm2
```

4. 设置 yum 源：

```sh
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

5. 安装 Docker：

```sh
yum install docker-ce
```

6. 启动 Docker 并设置开机自启：

```sh
systemctl start dockersystemctl enable docker
```

7. 验证安装：

```sh
docker version
```

## 安装 Jenkins

1. 使用 Docker 安装 Jenkins：

```sh
docker run --name jenkins -u root --rm -d -p 8080:8080 -p 50000:50000 -v /var/jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkinsci/blueocean
```

2. 访问 Jenkins：

打开浏览器，访问 `http://{Jenkins服务器IP}:8080`，并等待几分钟。

## 初始化 Jenkins

1. 安装 Jenkins

```sh
docker pull jenkins/jenkins:<version>-<jdk>
```

2. 解锁 Jenkins：

```sh
docker exec -it jenkins bash
# 查看密码：cat /var/lib/jenkins/secrets/initialAdminPassword
```

<img src="../imgs/100/07.webp" />

3. 安装推荐插件和创建管理员用户。

<img src="../imgs/100/08.webp" />

## 配置 Maven

1. 进入系统管理，安装所需插件，如 Maven Integration 和 Gitee 插件。

<img src="../imgs/100/09.webp" />

<img src="../imgs/100/10.webp" />

## 创建构建任务

1. 新建任务，选择“自由风格的软件项目”。

<img src="../imgs/100/11.webp" />

2. 源码管理：输入 Gitee 仓库地址并添加凭证。

<img src="../imgs/100/12.webp" />

3.

<img src="../imgs/100/13.webp" />

4. 构建触发器：

设置构建步骤，填写 Maven 命令（如 `clean install -Dmaven.test.skip=true`）。

<img src="../imgs/100/14.webp" />

<img src="../imgs/100/15.webp" />

5. 保存设置

## 测试与运行项目

1. 构建任务，查看控制台输出确认是否成功打包。

<img src="../imgs/100/16.webp" />

<img src="../imgs/100/17.webp" />

2. 查看项目位置：

```sh
cd /var/jenkins_home/workspace
```

3. Dockerfile 示例：

```sh
FROM jdk:8
VOLUME /tmp
ADD target/zx-order-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8888ENTRYPOINT ["java","-jar","/app.jar","--spring.profiles.active=prd"]
```

4. 修改 Jenkins 任务配置，确保镜像构建和运行命令正确。

5.

<img src="../imgs/100/18.webp" />

<img src="../imgs/100/19.webp" />

```sh
-t：指定新镜像名
.：表示Dockfile在当前路径
cd /var/jenkins_home/workspace/zx-order-api
docker stop zx-order || true
docker rm zx-order || true
docker rmi zx-order || true
docker build -t zx-order .
docker run -d -p 8888:8888 --name zx-order zx-order:latest
```

上图用了 `docker logs -f` 是为了方便看日志，生产环境不需要加，因为会一直等待日志，构建任务会失败

## 验证

1. 查看 Docker 容器状态：

```sh
docker ps
```

2. 检查日志：

```sh
docker logs {容器名}
```

3. 通过浏览器访问项目。

这就是在 Jenkins 和 Docker 上实现项目自动化部署的完整步骤！
