import { _decorator, Component, Node, Prefab, instantiate, view, math } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏管理器：整个游戏关卡的调度中心，负责敌机的生成波次
 */
@ccclass('GameManager')
export class GameManager extends Component {
    // 敌机的预制体，必须在编辑器中拖入
    @property(Prefab)
    public enemyPrefab: Prefab = null!;

    // 刷新敌机的时间间隔（秒），可以动态调整来增加难度
    @property
    public spawnInterval: number = 1.0;

    private _timer: number = 0;

    update(dt: number) {
        // 控制生成敌机的计时器
        this._timer += dt;
        if (this._timer >= this.spawnInterval) {
            this.spawnEnemy();
            this._timer = 0;
        }
    }

    /**
     * 生成敌机的逻辑
     */
    private spawnEnemy() {
        if (!this.enemyPrefab) return;

        // 1. 根据预制体生成一个敌机实例
        const enemyNode = instantiate(this.enemyPrefab);
        
        // 2. 将其添加到 GameManager 所在的节点（通常是世界容器节点）
        this.node.addChild(enemyNode);

        // 3. 计算随机生成的位置
        const winSize = view.getVisibleSize();
        // 随机 X 坐标：在屏幕宽度范围内随机，预留 50 像素边距防止刷在最边缘
        const x = math.randomRange(-winSize.width / 2 + 50, winSize.width / 2 - 50);
        // 固定 Y 坐标：生成在屏幕顶端外一点
        const y = winSize.height / 2 + 100;

        enemyNode.setPosition(x, y);
    }
}
