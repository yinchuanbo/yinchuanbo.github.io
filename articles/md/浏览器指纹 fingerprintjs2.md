---
title: "浏览器指纹 fingerprintjs2.md"
tag: "工具"
---

### 1.fingerprintjs2 是什么？

Fingerprintjs2 是一个流行的开源 JavaScript 库，用于生成浏览器指纹。

### 2.fingerprintjs2 功能和应用场景？

01 功能

- 收集用户浏览器的各种信息，如硬件特性、浏览器设置、插件、字体、屏幕分辨率等。
- 通过加密哈希处理这些信息，生成一个独特的浏览器指纹。

02 应用场景

- 在线支付平台和电商网站可使用 Fingerprintjs2 来检测异常活动和防止欺诈。
- 当同一个账户在短时间内从不同的浏览器指纹登录时，系统可标记为可疑活动，触发安全警报。
- 通过指纹 id 来做部分阅读统计

### 3.fingerprintjs2 技术特点？

- 浏览器特性检测：获取用户浏览器类型、版本、是否支持特定 API 等。
- 硬件特征检测：包括屏幕尺寸、颜色深度等。
- 字体检测：通过渲染并测量随机字符串宽度来识别已安装字体。
- 使用 SHA-1 哈希函数处理收集的数据，生成唯一指纹。

### 4.fingerprintjs2 兼容性和易用性？

- 该库具有良好的兼容性，可在多种现代浏览器中运行。
- 提供了简单易用的 API，便于集成到任何项目中。

### 5.fingerprintjs2 使用事例？

```html
<script setup>
  import Fingerprint2 from "fingerprintjs2"; //
  const initBrowserFinger = () => {
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        createBrowserFinger();
      });
    } else {
      setTimeout(() => {
        createBrowserFinger();
      }, 500);
    }
  };
  const createBrowserFinger = () => {
    // 11820cab96d08ce81c8dc97258bd03a5
    const fingerprint = Fingerprint2.get((components) => {
      // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
      const values = components.map((component) => component.value); // 配置的值的数组
      const murmur = Fingerprint2.x64hash128(values.join(""), 31); // 生成浏览器指纹
      console.log(components);
      console.log(values);
      console.log(murmur);
      localStorage.setItem("browserId", murmur); // 存储浏览器指纹，在项目中用于校验用户身份和埋点
    });
  };
  initBrowserFinger();
</script>
```
