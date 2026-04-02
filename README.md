# 🛩️ 雷霆战机 — Cocos Creator 3.8 纵向射击游戏

基于 **Cocos Creator v3.8.8** 开发的经典纵向卷轴射击游戏（Shoot 'em Up）。
玩家通过鼠标/触摸控制战机移动，自动射击消灭敌机，击杀指定数量即可通关。

---

## 📁 项目结构

```
hello/
├── assets/
│   ├── scripts/              # 核心脚本
│   │   ├── PlayerController.ts   # 玩家控制：鼠标/触摸跟随 + 自动射击
│   │   ├── Enemy.ts              # 敌机 AI：匀速下落 + 自动反击
│   │   ├── Bullet.ts             # 子弹飞行 + 出界自动回收
│   │   ├── GameManager.ts        # 游戏调度：刷怪、碰撞检测、计分、胜负判定、重开
│   │   └── ScrollingBackground.ts # 双图无限滚动背景
│   └── textures/             # 美术素材（透明背景 PNG）
│       ├── player.png            # 玩家战机
│       ├── enemy.png             # 敌方战机
│       ├── bullet.png            # 子弹
│       └── bg.png                # 滚动背景
└── README.md
```

---

## 🎮 游戏机制

| 功能 | 说明 |
|------|------|
| **玩家移动** | 鼠标拖拽 / 触屏滑动控制战机位置，自动限制在屏幕范围内 |
| **自动射击** | 玩家每 0.2 秒向上发射一颗子弹 |
| **敌机生成** | 每 1 秒从屏幕顶部随机位置刷出一架敌机 |
| **敌机 AI** | 匀速下落 + 每 1.5 秒向下发射子弹反击 |
| **敌机血量** | 50% 概率 1HP（脆皮），50% 概率 2HP（硬壳） |
| **碰撞检测** | 手动 AABB 矩形重叠检测，碰撞框缩至 70% 提升手感 |
| **通关条件** | 击杀 100 架敌机（可在 Inspector 调整 `winKillCount`） |
| **游戏失败** | 玩家被敌方子弹击中即阵亡 |
| **重新开始** | 失败/胜利后显示「重新开始」按钮，点击或按 `R` 键重载场景 |
| **暂停** | 按 `Esc` 键暂停/恢复 |
| **背景滚动** | 两张背景图交替循环，营造无限飞行的视觉效果 |

---

## 🔧 编辑器组装步骤

### 1. 子弹预制体 (Bullet Prefab)

1. 层级管理器 → 新建 Sprite 节点 → 重命名为 `Bullet`
2. 拖入 `assets/textures/bullet.png` 到 Sprite 组件的 SpriteFrame
3. 挂载 `Bullet.ts` 脚本
4. 拖入 `assets/resources/prefabs` 文件夹生成预制体，删除场景中的节点

### 2. 敌机预制体 (Enemy Prefab)

1. 新建 Sprite 节点 → 重命名为 `Enemy`
2. 拖入 `assets/textures/enemy.png`
3. 挂载 `Enemy.ts` 脚本
4. 将 `Bullet` 预制体拖入脚本的 **Bullet Prefab** 槽位
5. 拖入 prefabs 文件夹生成预制体

### 3. 玩家 (Player)

1. 新建 Sprite 节点 → 重命名为 `Player`
2. 拖入 `assets/textures/player.png`
3. 挂载 `PlayerController.ts` 脚本
4. 将 `Bullet` 预制体拖入 **Bullet Prefab** 槽位

### 4. 滚动背景 (Background)

1. 新建空节点 `BackgroundRoot`，挂载 `ScrollingBackground.ts`
2. 在其下创建两个子节点 `BG1` 和 `BG2`，均挂载 Sprite 并拖入 `bg.png`
3. 分别拖入脚本的 `BG1`、`BG2` 槽位

### 5. 游戏管理器 (GameManager)

1. 新建空节点 `GameManager`，挂载 `GameManager.ts`
2. 将 `Enemy` 预制体拖入 **Enemy Prefab** 槽位
3. 可调属性：
   - `Spawn Interval`：敌机刷新间隔（秒）
   - `Win Kill Count`：通关击杀数

---

## ⌨️ 操作按键

| 按键 | 功能 |
|------|------|
| 鼠标移动 / 触屏滑动 | 控制战机位置 |
| `Esc` | 暂停 / 恢复游戏 |
| `R` | 游戏结束后重新开始 |

---

## 📝 脚本 API 速查

### PlayerController

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `bulletPrefab` | Prefab | — | 子弹预制体 |
| `shootInterval` | number | 0.2 | 射击间隔（秒） |
| `displayWidth` | number | 80 | 显示宽度 |
| `displayHeight` | number | 80 | 显示高度 |
| `hp` | number | 1 | 生命值 |

### Enemy

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `speed` | number | 200 | 下落速度 |
| `bulletPrefab` | Prefab | — | 子弹预制体 |
| `shootInterval` | number | 1.5 | 射击间隔（秒） |
| `displayWidth` | number | 60 | 显示宽度 |
| `displayHeight` | number | 60 | 显示高度 |
| `hp` | number | 2 | 血量（start 中随机 1 或 2） |

### Bullet

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `speed` | number | 800 | 飞行速度 |
| `isPlayerBullet` | boolean | true | 是否为玩家子弹 |
| `displayWidth` | number | 16 | 显示宽度 |
| `displayHeight` | number | 32 | 显示高度 |

### GameManager

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enemyPrefab` | Prefab | — | 敌机预制体 |
| `spawnInterval` | number | 1.0 | 刷怪间隔（秒） |
| `winKillCount` | number | 100 | 通关击杀数 |

### ScrollingBackground

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `bg1` | Node | — | 第一张背景 |
| `bg2` | Node | — | 第二张背景 |
| `speed` | number | 100 | 滚动速度 |

---

## 🖼️ 图片资源说明

所有精灵图片均为 **1024×1024 透明背景 PNG**，在 `.meta` 文件中已配置：
- `hasAlpha: true` — 启用透明通道渲染
- `fixAlphaTransparencyArtifacts: true` — 修复 alpha 边缘伪影
- 自动裁剪 (`trimType: auto`) — 去除多余透明区域，优化渲染性能

---

## 🚀 运行

1. 用 **Cocos Creator 3.8.x** 打开本项目
2. 按照上述步骤完成预制体组装和场景搭建
3. 点击编辑器顶部 ▶️ 按钮即可运行

祝哥哥玩得开心！🎮
