import { _decorator, Component, Node, Vec3, Prefab, instantiate, view, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

/**
 * 敌机脚本：简单的 AI 下落逻辑、自动射击和被击落判定
 */
@ccclass('Enemy')
export class Enemy extends Component {
    // 敌机向下飞行的速度
    @property
    public speed: number = 200;

    // 敌机携带的子弹预制体
    @property(Prefab)
    public bulletPrefab: Prefab = null!;

    // 敌机的射击频率
    @property
    public shootInterval: number = 1.5;

    private _timer: number = 0;

    onLoad() {
        // 注册碰撞监听，用于判断是否被玩家子弹击中
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(dt: number) {
        // 1. 简单的直线下降逻辑
        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * dt);

        // 2. 自动射击节奏控制
        this._timer += dt;
        if (this._timer >= this.shootInterval) {
            this.shoot();
            this._timer = 0;
        }

        // 3. 性能优化：飞出屏幕底端自动清理
        if (this.node.position.y < -view.getVisibleSize().height / 2 - 100) {
            this.node.destroy();
        }
    }

    /**
     * 发射子弹逻辑
     */
    private shoot() {
        if (!this.bulletPrefab) return;
        
        const bulletNode = instantiate(this.bulletPrefab);
        this.node.parent?.addChild(bulletNode);
        
        // 子弹从敌机下方飞出
        bulletNode.setPosition(this.node.position.x, this.node.position.y - 50);

        // 核心特技：将子弹标记为敌方子弹（它会自动向下飞）
        const bulletComp = bulletNode.getComponent(Bullet);
        if (bulletComp) {
            bulletComp.isPlayerBullet = false;
        }
    }

    /**
     * 被撞到的回调处理
     */
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 获取撞到我们的那个物体的 Bullet 脚本
        const bullet = otherCollider.getComponent(Bullet);
        
        // 判定条件：如果这是一个属于玩家的子弹，那么敌机牺牲
        if (bullet && bullet.isPlayerBullet) {
            this.die();
        }
    }

    /**
     * 销毁逻辑
     */
    private die() {
        // 这里可以进行：加分、播放特效（如爆炸）、播放音效等操作
        this.node.destroy();
    }
}
