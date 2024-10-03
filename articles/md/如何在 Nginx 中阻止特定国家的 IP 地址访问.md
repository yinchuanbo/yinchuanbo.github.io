---
title: "如何在 Nginx 中阻止特定国家的 IP 地址访问"
tag: "Nginx"
---

**一、为什么要阻止特定国家的 IP 访问？**

在实际应用中，可能会有以下几种情况需要阻止特定国家的 IP 访问：

1. 安全考虑：防止来自某些高风险国家的恶意攻击。
2. 版权保护：限制特定地区的用户访问受版权保护的内容。
3. 合规要求：满足某些法律法规或业务规定。

**二、如何在 Nginx 中阻止特定国家的 IP 地址访问？**

**第 1 步：安装 GeoIP 模块**

Nginx 需要借助 GeoIP 模块来识别客户端的地理位置信息。如果你使用的是 Nginx 主分支，可以通过以下命令安装该模块：

```sh
sudo apt-get install nginx-module-geoip # 对于基于Debian的系统
sudo yum install nginx-mod-http-geoip # 对于RPM-based系统
```

**第 2 步：下载 GeoIP 数据库**

GeoIP 模块需要数据库文件来映射 IP 地址到国家。你可以从 MaxMind 的官方网站 (`https://dev.maxmind.com/geoip/geoip2/geolite2/`) 免费下载 GeoIP.dat 和 GeoLiteCity.dat 两个文件

下载后，将文件放置到 Nginx 配置文件指定的路径，如\`/etc/nginx/geoip/

**第 3 步：配置 Nginx**在/etc/nginx/conf.d/下，编写 geoip.conf 文件如下：

```nginx
map $geoip_country_code $allowed_country {
    default yes;
    US no; # 禁止从美国的访问，这里只是示例，可以根据需要修改国家代码
}

server {
    listen 80;
    server_name example.com;

    if ($allowed_country = no) {
        return 403;
    }

    # 其他配置...
}
```

在上述配置中，我们使用了`geoip_country`指令指定了 GeoIP 数据库的路径。然后，通过`map`指令创建了一个变量`$allowed_country`，根据国家代码判断是否允许访问。如果`$allowed_country`的值为`no`，则返回 403 禁止访问。

**第 4 步：测试并重启 Nginx**

配置完成后，使用`nginx -t`命令测试配置是否正确，然后使用`systemctl restart nginx`或`service nginx restart`命令重启 Nginx 使更改生效。
