# 🛩️ 雷霆战机 — Cocos Creator 3.8 纵向射击游戏

基于 **Cocos Creator v3.8.8** 开发的经典纵向卷轴射击游戏（Shoot 'em Up）。
玩家通过鼠标/触摸控制战机移动，自动射击消灭敌机，击杀指定数量即可通关。

---

## 📁 项目结构

```
hello/
├── assets/
│   ├── resources/
│   │   └── prefabs/             # 预制体存放目录
│   │       ├── Bullet.prefab       # 子弹预制体
│   │       └── Enemy.prefab        # 敌机预制体
│   ├── scenes/
│   │   └── game.scene              # 主场景文件
│   ├── scripts/                 # 核心脚本
│   │   ├── PlayerController.ts     # 玩家控制：鼠标/触摸跟随 + 自动射击
│   │   ├── Enemy.ts                # 敌机 AI：匀速下落 + 自动反击
│   │   ├── Bullet.ts               # 子弹飞行 + 出界自动回收
│   │   ├── GameManager.ts          # 游戏调度：刷怪、碰撞检测、计分、胜负判定、重开
│   │   └── ScrollingBackground.ts  # 双图无限滚动背景
│   └── textures/                # 美术素材（透明背景 PNG）
│       ├── player.png              # 玩家战机
│       ├── enemy.png               # 敌方战机
│       ├── bullet.png              # 子弹
│       └── bg.png                  # 滚动背景
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

## ⌨️ 操作按键

| 按键 | 功能 |
|------|------|
| 鼠标移动 / 触屏滑动 | 控制战机位置 |
| `Esc` | 暂停 / 恢复游戏 |
| `R` | 游戏结束后重新开始 |

---

## 🔧 编辑器完整组装步骤（从零开始）

> **⚠️ 重要前提：**
> - 使用 **Cocos Creator 3.8.x** 打开本项目
> - 打开项目后，双击 `assets/scenes/game.scene` 进入主场景编辑
> - 确保场景中已有一个 **Canvas** 节点（Cocos 默认会创建）
> - 下面所有节点**都必须创建在 Canvas 下面**

---

### 第一步：创建 prefabs 文件夹（如果还没有）

1. 在 **资源管理器（Assets）** 面板中，右键点击 `assets` 文件夹
2. 选择 **新建 → 文件夹**，命名为 `resources`
3. 右键点击刚创建的 `resources` 文件夹，选择 **新建 → 文件夹**，命名为 `prefabs`
4. 最终路径为：`assets/resources/prefabs/`

> 💡 项目中已自带此文件夹和预制体，如果你能看到 `assets/resources/prefabs/Bullet.prefab` 和 `Enemy.prefab`，可跳过第二、三步直接到第四步。

---

### 第二步：制作子弹预制体（Bullet Prefab）

**2.1 在场景中创建子弹节点**

1. 在 **层级管理器（Hierarchy）** 面板中，右键点击 **Canvas** 节点
2. 选择 **创建 → 2D 对象 → Sprite（精灵）**
3. 一个新的 `Sprite` 节点会出现在 Canvas 下面
4. **单击** 该节点，按 **F2** 重命名为 `Bullet`

**2.2 设置子弹图片**

1. 在 **资源管理器** 中找到 `assets/textures/bullet.png`
2. **展开** `bullet.png` 左边的小三角，会看到里面有一个子图片（SpriteFrame）
3. 在 **层级管理器** 中选中 `Bullet` 节点
4. 在右侧 **属性检查器（Inspector）** 中找到 **Sprite** 组件
5. 将 `bullet.png` 下面的 **SpriteFrame** 拖拽到 Sprite 组件的 **SpriteFrame** 属性槽位上

**2.3 挂载子弹脚本**

1. 保持选中 `Bullet` 节点
2. 在 **属性检查器** 最下方，点击 **添加组件（Add Component）** 按钮
3. 选择 **自定义脚本 → Bullet**（或在搜索框输入 `Bullet`）
4. 脚本挂载成功后，你会在 Inspector 中看到以下属性：
   | 属性名 | 默认值 | 说明 |
   |--------|--------|------|
   | Speed | 800 | 飞行速度，保持默认即可 |
   | Is Player Bullet | ✅ (勾选) | 保持默认即可 |
   | Display Width | 16 | 保持默认即可 |
   | Display Height | 32 | 保持默认即可 |

**2.4 生成预制体**

1. 从 **层级管理器** 中将 `Bullet` 节点**直接拖拽**到 **资源管理器** 的 `assets/resources/prefabs/` 文件夹中
2. 资源管理器中会出现一个蓝色图标的 `Bullet.prefab` 文件
3. ✅ 确认预制体生成成功
4. **回到层级管理器，右键 `Bullet` 节点 → 删除**（场景中不需要保留这个节点了）

---

### 第三步：制作敌机预制体（Enemy Prefab）

**3.1 在场景中创建敌机节点**

1. 在 **层级管理器** 中，右键点击 **Canvas** 节点
2. 选择 **创建 → 2D 对象 → Sprite（精灵）**
3. 重命名新节点为 `Enemy`

**3.2 设置敌机图片**

1. 在 **资源管理器** 中找到 `assets/textures/enemy.png`
2. 展开 `enemy.png`，将里面的 **SpriteFrame** 拖拽到 Enemy 节点的 **Sprite → SpriteFrame** 属性槽位

**3.3 挂载敌机脚本**

1. 选中 `Enemy` 节点
2. 点击 **添加组件 → 自定义脚本 → Enemy**
3. 脚本挂载后你会看到以下属性：
   | 属性名 | 默认值 | 说明 |
   |--------|--------|------|
   | Speed | 200 | 下落速度，保持默认 |
   | **Bullet Prefab** | **None** | ⚠️ **必须手动拖入！** |
   | Shoot Interval | 1.5 | 射击间隔，保持默认 |
   | Display Width | 60 | 保持默认 |
   | Display Height | 60 | 保持默认 |

**3.4 ⚠️ 关键步骤：绑定子弹预制体**

1. 在 **资源管理器** 中找到 `assets/resources/prefabs/Bullet.prefab`
2. 将 `Bullet.prefab` **拖拽** 到 Enemy 脚本 Inspector 中 **Bullet Prefab** 属性的槽位上
3. 槽位应该从 `None` 变成显示 `Bullet`
4. ❌ **如果忘记这一步，敌机将无法发射子弹！**

**3.5 生成预制体**

1. 将 `Enemy` 节点从 **层级管理器** 拖拽到 `assets/resources/prefabs/` 文件夹
2. 确认出现 `Enemy.prefab`
3. **删除场景中的 `Enemy` 节点**

---

### 第四步：创建玩家（Player）

**4.1 创建玩家节点**

1. 在 **层级管理器** 中，右键点击 **Canvas** 节点
2. 选择 **创建 → 2D 对象 → Sprite（精灵）**
3. 重命名为 `Player`

**4.2 设置玩家图片**

1. 找到 `assets/textures/player.png`，展开小三角
2. 将 **SpriteFrame** 拖拽到 Player 节点的 **Sprite → SpriteFrame** 属性

**4.3 挂载玩家脚本**

1. 选中 `Player` 节点
2. 点击 **添加组件 → 自定义脚本 → PlayerController**
3. 你会看到以下属性：
   | 属性名 | 默认值 | 说明 |
   |--------|--------|------|
   | **Bullet Prefab** | **None** | ⚠️ **必须手动拖入！** |
   | Shoot Interval | 0.2 | 射击间隔 |
   | Display Width | 80 | 保持默认 |
   | Display Height | 80 | 保持默认 |

**4.4 ⚠️ 关键步骤：绑定子弹预制体**

1. 在 **资源管理器** 中找到 `assets/resources/prefabs/Bullet.prefab`
2. 将 `Bullet.prefab` **拖拽** 到 PlayerController 脚本的 **Bullet Prefab** 槽位上
3. ❌ **如果忘记这一步，玩家将无法射击！**

**4.5 设置玩家位置（可选）**

- 脚本会在游戏运行时自动把玩家放到屏幕底部中央
- 你不需要手动调位置

---

### 第五步：创建滚动背景（ScrollingBackground）

**5.1 创建容器节点**

1. 在 **层级管理器** 中，右键点击 **Canvas** 节点
2. 选择 **创建 → 空节点**
3. 重命名为 `BackgroundRoot`

**5.2 创建两个背景子节点**

1. 右键点击 `BackgroundRoot` 节点 → **创建 → 2D 对象 → Sprite（精灵）**
2. 重命名为 `BG1`
3. 再次右键 `BackgroundRoot` → **创建 → 2D 对象 → Sprite（精灵）**
4. 重命名为 `BG2`

最终层级结构应如下：
```
Canvas
  └── BackgroundRoot        ← 空节点
        ├── BG1             ← Sprite
        └── BG2             ← Sprite
```

**5.3 设置背景图片**

1. 找到 `assets/textures/bg.png`，展开小三角
2. 将 **SpriteFrame** 分别拖到 `BG1` 和 `BG2` 的 **Sprite → SpriteFrame** 属性

**5.4 挂载背景滚动脚本**

1. 选中 `BackgroundRoot` 节点（注意：脚本挂在父节点上，不是 BG1/BG2 上）
2. 点击 **添加组件 → 自定义脚本 → ScrollingBackground**
3. 你会看到以下属性：
   | 属性名 | 默认值 | 说明 |
   |--------|--------|------|
   | **Bg1** | **None** | ⚠️ 必须拖入 |
   | **Bg2** | **None** | ⚠️ 必须拖入 |
   | Speed | 100 | 背景滚动速度 |

**5.5 ⚠️ 关键步骤：绑定背景节点**

1. 从 **层级管理器** 中将 `BG1` 节点拖到 ScrollingBackground 脚本的 **Bg1** 槽位
2. 将 `BG2` 节点拖到 **Bg2** 槽位

**5.6 ⚠️ 调整层级顺序（确保背景在最底层）**

1. 在 **层级管理器** 中，将 `BackgroundRoot` 节点拖到 **Canvas 的第一个子节点位置**（最上面）
2. 这样背景就会渲染在最底层，不会遮挡玩家和敌机

最终 Canvas 下的节点顺序应该是：
```
Canvas
  ├── BackgroundRoot    ← 第 1 个（最底层渲染）
  ├── Player            ← 第 2 个
  └── GameManager       ← 第 3 个
```

---

### 第六步：创建游戏管理器（GameManager）⭐ 最重要

> **⚠️ 这一步关系到重新开始、暂停、R 键等功能是否正常！**

**6.1 创建 GameManager 节点**

1. 在 **层级管理器** 中，右键点击 **Canvas** 节点
2. 选择 **创建 → 空节点**
3. 重命名为 `GameManager`

> **❗ 注意：GameManager 必须是 Canvas 的直接子节点！**
> 如果放错位置（如放到场景根节点而不是 Canvas 下），游戏的 UI（击杀计数、重新开始按钮）
> 都无法正常显示，按 R 键重开也会失效。

**6.2 挂载 GameManager 脚本**

1. 选中 `GameManager` 节点
2. 点击 **添加组件 → 自定义脚本 → GameManager**
3. 你会看到以下属性：
   | 属性名 | 默认值 | 说明 |
   |--------|--------|------|
   | **Enemy Prefab** | **None** | ⚠️ **必须手动拖入！** |
   | Spawn Interval | 1.0 | 敌机刷新间隔（秒） |
   | Win Kill Count | 100 | 通关击杀数 |

**6.3 ⚠️ 关键步骤：绑定敌机预制体**

1. 在 **资源管理器** 中找到 `assets/resources/prefabs/Enemy.prefab`
2. 将 `Enemy.prefab` **拖拽** 到 GameManager 脚本的 **Enemy Prefab** 槽位上
3. ❌ **如果忘记这一步，游戏不会刷出任何敌机！**

**6.4 确认节点是激活状态**

1. 选中 `GameManager` 节点
2. 在 **属性检查器** 顶部，节点名称左边有一个 **复选框 ☑️**
3. **确保它是勾选的（激活状态）**
4. ❌ 如果未勾选，`onLoad()` 不会执行，键盘监听不会注册，R 键和 Esc 键都会失效

---

### 第七步：最终检查清单 ✅

在点击运行之前，务必逐项确认：

| 检查项 | 如何确认 | 未通过的后果 |
|--------|----------|-------------|
| ① `GameManager` 节点在 **Canvas 下** | 层级管理器中查看 | UI 不显示，R 键无反应 |
| ② `GameManager` 节点 **已激活**（勾选） | Inspector 顶部复选框 | 所有键盘功能失效 |
| ③ `GameManager` 的 **Enemy Prefab 已绑定** | Inspector 中不是 None | 不刷怪 |
| ④ `Player` 节点在 **Canvas 下** | 层级管理器中查看 | 碰撞检测找不到玩家 |
| ⑤ `Player` 的 **Bullet Prefab 已绑定** | Inspector 中不是 None | 玩家不射击 |
| ⑥ `Enemy.prefab` 的 **Bullet Prefab 已绑定** | 双击 prefab 进入编辑，查看 Inspector | 敌机不发射子弹 |
| ⑦ `BackgroundRoot` 在 Canvas **最顶部** | 层级管理器中排第一个 | 背景遮挡游戏画面 |
| ⑧ `BG1` 和 `BG2` 已拖入脚本槽位 | Inspector 中不是 None | 背景不滚动 |
| ⑨ 场景中**没有**多余的 Bullet / Enemy 节点 | 层级管理器检查 | 游戏运行异常 |

---

### 第八步：运行游戏 🚀

1. 按 **Ctrl + S** 保存场景
2. 点击编辑器顶部的 **▶️ 按钮** 运行游戏
3. **用鼠标在游戏画面中点击一下**（让浏览器窗口获取键盘焦点）
4. 鼠标移动控制战机，自动射击

**如果游戏结束后按 R 没反应：**
1. 先用鼠标 **点击一下游戏画面**（确保焦点在游戏窗口上）
2. 确保 **输入法已切换为英文模式**（中文输入法会拦截按键）
3. 然后按 `R` 键
4. 或者直接点击屏幕上的 **「重新开始」** 绿色按钮

---

## ⚠️ 常见问题排查

### Q: 按 R 键没有反应？
**原因排查优先级：**
1. ✅ **鼠标点击游戏画面了吗？** — 浏览器预览必须先点击一下画布，才能接收键盘事件
2. ✅ **输入法是英文模式吗？** — 中文输入法会拦截键盘输入
3. ✅ **GameManager 节点在 Canvas 下吗？** — 如果不在 Canvas 下，`onLoad()` 可能异常
4. ✅ **GameManager 节点是激活的吗？** — Inspector 顶部复选框必须勾选
5. ✅ **控制台有报错吗？** — 按 F12 打开浏览器控制台查看

### Q: 没有敌机出现？
- 检查 GameManager 的 `Enemy Prefab` 是否绑定了 `Enemy.prefab`

### Q: 玩家不发射子弹？
- 检查 Player 节点上 PlayerController 的 `Bullet Prefab` 是否绑定了 `Bullet.prefab`

### Q: 敌机不发射子弹？
- 双击 `assets/resources/prefabs/Enemy.prefab` 进入预制体编辑模式
- 检查 Enemy 脚本的 `Bullet Prefab` 是否绑定了 `Bullet.prefab`

### Q: 背景是黑色的 / 遮挡了游戏画面？
- 确保 `BackgroundRoot` 在 Canvas 子节点列表**最上面**（第一个子节点 = 最先渲染 = 最底层）
- 确保 BG1 和 BG2 的 Sprite 都绑定了 `bg.png` 的 SpriteFrame

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

## 🚀 快速开始（TL;DR）

1. 用 **Cocos Creator 3.8.x** 打开本项目
2. 双击 `assets/scenes/game.scene` 打开场景
3. 按照上面 **第一步到第六步** 在 Canvas 下组装所有节点
4. 用 **第七步的检查清单** 逐项确认
5. **Ctrl+S** 保存，点击 ▶️ 运行
6. 在游戏画面上 **点击一下** 获取焦点，开始游戏！

祝哥哥玩得开心！🎮
