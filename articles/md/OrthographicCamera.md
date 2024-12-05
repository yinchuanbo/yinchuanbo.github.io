---
title: "OrthographicCamera"
tag: "ThreeJS"
time: 2024-12-05 11:18:27
---

`THREE.OrthographicCamera` 是 Three.js 中的一种相机类型，用于创建正交投影的视图。与透视相机不同，正交相机不会根据物体与相机的距离来改变物体的大小，这使得它在某些应用场景中非常有用。

### 介绍

- **正交投影**：在正交投影中，物体的大小不随距离的变化而变化。这意味着在场景中，所有物体的比例保持一致，适合于需要精确测量和对齐的场景。
- **视口设置**：`THREE.OrthographicCamera` 需要定义视口的宽度和高度，这些参数决定了相机的可视范围。

### 作用

- **2D 游戏和应用**：正交相机常用于 2D 游戏和应用程序，因为它可以保持物体的比例，避免透视失真。
- **工程和建筑可视化**：在建筑和工程可视化中，正交相机可以提供准确的视图，便于测量和设计。
- **图形设计和数据可视化**：在图形设计和数据可视化中，正交相机可以帮助用户更清晰地查看数据和图形。

### 用法

使用 `THREE.OrthographicCamera` 的基本步骤如下：

1. **创建相机**：定义相机的视口大小和近远裁剪面。
2. **设置相机位置**：将相机放置在场景中的适当位置。
3. **渲染场景**：使用相机渲染场景。

### 示例代码

以下是一个使用 `THREE.OrthographicCamera` 的简单示例：

```javascript
// 创建场景
const scene = new THREE.Scene();

// 定义相机的可视范围
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10; // 表示相机查看范围的高度，已知高度可以按 aspect 比例计算出宽度

// 创建正交相机
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2, // left
  (frustumSize * aspect) / 2, // right
  frustumSize / 2, // top
  frustumSize / -2, // bottom
  0.1, // near
  100 // far
);

// 设置相机位置
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0); // 让相机朝向场景中心

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 渲染场景
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

### 总结

`THREE.OrthographicCamera` 是一个强大的工具，适用于需要精确视图的场景。它的使用非常简单，适合各种应用场景，包括 2D 游戏、建筑可视化和数据展示等。如果你有更多问题或需要更详细的示例，请随时问我！
