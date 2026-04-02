import { _decorator, Component, Node, Vec3, Prefab, instantiate, view, UITransform } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

/**
 * 敌机脚本：下落 AI、自动射击、HP 系统
 */
@ccclass('Enemy')
export class Enemy extends Component {
    @property
    public speed: number = 200;

    @property(Prefab)
    public bulletPrefab: Prefab = null!;

    @property
    public shootInterval: number = 1.5;

    @property
    public displayWidth: number = 60;

    @property
    public displayHeight: number = 60;

    /** 血量：start 中随机设为 1 或 2 */
    public hp: number = 2;

    private _timer: number = 0;

    onLoad() {
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(this.displayWidth, this.displayHeight);
        }
    }

    start() {
        // 50% 概率 1HP（脆皮），50% 概率 2HP（硬壳）
        this.hp = Math.random() < 0.5 ? 1 : 2;
    }

    update(dt: number) {
        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * dt);

        this._timer += dt;
        if (this._timer >= this.shootInterval) {
            this.shoot();
            this._timer = 0;
        }

        if (this.node.position.y < -view.getVisibleSize().height / 2 - 100) {
            this.node.destroy();
        }
    }

    private shoot() {
        if (!this.bulletPrefab) return;

        const bulletNode = instantiate(this.bulletPrefab);
        this.node.parent?.addChild(bulletNode);
        bulletNode.setPosition(this.node.position.x, this.node.position.y - this.displayHeight / 2 - 10);

        const bulletComp = bulletNode.getComponent(Bullet);
        if (bulletComp) {
            bulletComp.isPlayerBullet = false;
        }
    }
}
