---
title: "Nginx 如何防止 DDoS 攻击"
tag: "Nginx"
time: 2024-10-03 21:49:11
---

DDoS（分布式拒绝服务攻击）是一个让很多网站和服务头疼的问题。DDoS 攻击就像是一群不怀好意的人一起堵塞了你的店门，让正常的顾客无法进入。那我们该如何利用 Nginx 来防止这种攻击呢？

**一、DDoS 攻击的特点**

DDoS 攻击通常有以下几个特点：

1. 攻击流量来源于一些固定的 IP 地址，而且每一个 IP 地址会创建比真实用户多得多的连接和请求。
2. 攻击流量全部由机器产生，速率比人类用户高得多。
3. 进行攻击的机器其 User-Agent 头不是标准的值，Referer 头有时也会被设置成能够与攻击关联起来的值。

**二、Nginx 防止 DDoS 攻击的方法**

1. **限制请求率** 将 Nginx 可接受的入站请求率限制为适合真实用户的值。比如，通过配置让一个真正的用户每两秒钟才能访问一次登录页面。

```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=30r/m;
server {
  ...
  location /loginUser.html {
      limit_req zone=one;
      ...
  }
}
```

2. **限制连接的数量** 将某个客户端 IP 地址所能打开的连接数限制为真实用户的合理值。例如，限制每一个 IP 对网站/product 部分打开的连接数不超过 10 个。

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;
server {
  ...
  location /product/ {
      limit_conn addr 10;
      ...
  }
}
```

3. **关闭慢连接** 关闭那些一直保持打开同时写数据又特别频繁的连接，因为它们会降低服务器接受新连接的能力。可以通过 `client_body_timeout` 和 `client_header_timeout` 指令控制请求体或者请求头的超时时间。

```nginx
server {
  client_body_timeout 5s;
  client_header_timeout 5s;
  ...
}
```

4. **设置 IP 黑名单** 如果能识别攻击者所使用的客户端 IP 地址，那么通过 deny 指令将其屏蔽，让 Nginx 拒绝来自这些地址的连接或请求。

```nginx
location / {
  deny 124.123.121.3;
  deny 124.123.121.5;
  deny 124.123.121.7;
  ...
}
```

5. **设置 IP 白名单** 如果允许访问的 IP 地址比较固定，那么通过 allow 和 deny 指令让网站或者应用程序只接受来自于某个 IP 地址或者某个 IP 地址段的请求。

```nginx
location / {
  allow 192.168.122.0/24;
  deny all;
  ...
}
```

6. **通过缓存削减流量峰值** 通过启用缓存并设置某些缓存参数让 Nginx 吸收攻击所产生的大部分流量峰值。同时，要注意 `proxy_cache_key` 指令定义的键中不要包含容易被攻击者利用的变量。
7. **阻塞请求** 配置 Nginx 阻塞以下类型的请求**：**

- 以某个特定 URL 为目标的请求。
- User-Agent 头中的值不在正常客户端范围之内的请求。
- Referer 头中的值能够与攻击关联起来的请求。
- 其他头中存在能够与攻击关联在一起的值的请求。

8. **限制对后端服务器的连接数** 通常 Nginx 实例能够处理比后端服务器多得多的连接数，因此可以通过 Nginx 限制到每一个后端服务器的连接数。
