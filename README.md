# 雷霆战机 Cocos Creator 项目指南 (v3.8.8)

哥哥，我已为你准备好了所有的美术素材和核心脚本。由于 Cocos Creator 的场景和预制体（Prefab）需要在编辑器中通过可视化界面操作，请按照以下步骤完成最终组合：

## 1. 资产确认
- **图片**：位于 `assets/textures/`，包含 `player.png`, `enemy.png`, `bullet.png`, `bg.png`。
- **脚本**：位于 `assets/scripts/`，包含 `PlayerController.ts`, `Enemy.ts`, `Bullet.ts`, `GameManager.ts`, `ScrollingBackground.ts`。

## 2. 组装预制体 (Prefabs)

### 子弹 (Bullet Prefab)
1. 在层级管理器创建一个 Sprite 节点，重命名为 `Bullet`。
2. 将 `assets/textures/bullet.png` 拖入其 Sprite 组件。
3. 挂载 `Bullet.ts` 脚本。
4. **新增碰撞配置**：添加 `BoxCollider2D` 组件，勾选 **`Sensor` (传感器)** 选项。
5. 将该节点拖入 `assets/resources/prefabs` 文件夹，然后删除场景中的节点。

### 敌机 (Enemy Prefab)
1. 创建一个 Sprite 节点，重命名为 `Enemy`。
2. 将 `assets/textures/enemy.png` 拖入其 Sprite 组件。
3. 挂载 `Enemy.ts` 脚本。
4. **新增碰撞配置**：添加 `BoxCollider2D` 组件，勾选 **`Sensor`**。
5. 在脚本组件的 `Bullet Prefab` 槽位中，拖入上面制作的 `Bullet` 预制体。
6. 将该节点拖入 `assets/resources/prefabs` 文件夹。

### 玩家 (Player)
1. 在场景中创建一个 Sprite 节点，重命名为 `Player`。
2. 将 `assets/textures/player.png` 拖入。
3. 挂载 `PlayerController.ts` 脚本。
4. **新增碰撞配置**：添加 `BoxCollider2D` 组件，勾选 **`Sensor`**。
5. 在脚本组件的 `Bullet Prefab` 槽位中，拖入 `Bullet` 预制体。

## 3. 背景滚动 (Background)
1. 创建一个空节点 `BackgroundRoot`，挂载 `ScrollingBackground.ts`。
2. 在该节点下创建两个子节点 `BG1` 和 `BG2`，均挂载 Sprite 组件并拖入 `bg.png`。
3. 将 `BG1` 和 `BG2` 分别拖入 `ScrollingBackground` 脚本组件的对应槽位。

## 4. 游戏管理 (GameManager)
1. 在场景中创建一个空节点 `GameManager`，挂载 `GameManager.ts`。
2. 将 `Enemy` 预制体拖入脚本组件的 `Enemy Prefab` 槽位。

## 5. 运行游戏
点击 Cocos Creator 顶部的“运行”按钮，你就可以通过鼠标控制战机飞行并击落不断出现的敌机了！

祝哥哥玩得开心！
