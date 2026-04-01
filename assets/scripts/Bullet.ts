import { _decorator, Component, Node, Vec3, view, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 子弹脚本：处理子弹的飞行逻辑、碰撞反馈和自动销毁
 * 这是一个通用的子弹类，通过 isPlayerBullet 区分敌我
 */
@ccclass('Bullet')
export class Bullet extends Component {
    // 子弹飞行速度
    @property
    public speed: number = 800;

    // 标记是否为玩家子弹，决定飞行方向和伤害判定
    @property
    public isPlayerBullet: boolean = true;

    // 内部飞行的方向向量
    private _direction: Vec3 = new Vec3(0, 1, 0);

    onLoad() {
        // 获取当前节点上的碰撞组件
        const collider = this.getComponent(Collider2D);
        if (collider) {
            // 注册碰撞开始事件。注意：需要在编辑器里勾选 Sensor 传感器模式
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    start() {
        // 根据身份初始化飞行方向：1 为向上，-1 为向下
        this._direction.y = this.isPlayerBullet ? 1 : -1;
    }

    /**
     * 每帧更新 (dt 是上一帧到这一帧的时间间隔)
     */
    update(dt: number) {
        const pos = this.node.position;
        // 计算新位置：当前坐标 + 方向 * 速度 * 时间
        this.node.setPosition(pos.x + this._direction.x * this.speed * dt, pos.y + this._direction.y * this.speed * dt);

        // 性能优化：当子弹飞出屏幕可视范围（上下各加100像素缓冲区）时，销毁自身释放内存
        const screenSize = view.getVisibleSize();
        if (Math.abs(this.node.position.y) > screenSize.height / 2 + 100) {
            this.node.destroy();
        }
    }

    /**
     * 碰撞触发时的回调
     * @param selfCollider 自己的碰撞体
     * @param otherCollider 撞到的那个物体的碰撞体
     */
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 判定逻辑：
        // 1. 玩家子弹撞到带有 "Enemy" 名称的节点 -> 消失
        // 2. 敌机子弹撞到带有 "Player" 名称的节点 -> 消失
        if (this.isPlayerBullet && otherCollider.node.name.includes('Enemy')) {
            this.node.destroy();
        } else if (!this.isPlayerBullet && otherCollider.node.name.includes('Player')) {
            this.node.destroy();
        }
    }

    /**
     * 外部调用接口，用于手动设置特殊的子弹轨迹（如散弹）
     */
    public setDirection(dir: Vec3) {
        this._direction.set(dir);
        this._direction.normalize(); // 归一化，确保速度保持恒定
    }
}
