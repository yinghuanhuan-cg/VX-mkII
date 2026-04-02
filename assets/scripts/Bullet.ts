import { _decorator, Component, Node, Vec3, view, UITransform } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 子弹脚本：只负责飞行和出界自动销毁
 * 碰撞检测由 GameManager 统一处理
 */
@ccclass('Bullet')
export class Bullet extends Component {
    @property
    public speed: number = 800;

    @property
    public isPlayerBullet: boolean = true;

    @property
    public displayWidth: number = 16;

    @property
    public displayHeight: number = 32;

    private _direction: Vec3 = new Vec3(0, 1, 0);

    onLoad() {
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(this.displayWidth, this.displayHeight);
        }
    }

    start() {
        this._direction.y = this.isPlayerBullet ? 1 : -1;
    }

    update(dt: number) {
        const pos = this.node.position;
        this.node.setPosition(
            pos.x + this._direction.x * this.speed * dt,
            pos.y + this._direction.y * this.speed * dt
        );

        const screenSize = view.getVisibleSize();
        if (Math.abs(this.node.position.y) > screenSize.height / 2 + 100) {
            this.node.destroy();
        }
    }

    public setDirection(dir: Vec3) {
        this._direction.set(dir);
        this._direction.normalize();
    }
}
