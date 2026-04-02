import { _decorator, Component, Node, Vec3, EventTouch, EventMouse, Input, input, Prefab, instantiate, UITransform, view } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

/**
 * 玩家控制脚本：鼠标/触摸跟随 + 自动射击 + HP
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Prefab)
    public bulletPrefab: Prefab = null!;

    @property
    public shootInterval: number = 0.2;

    @property
    public displayWidth: number = 80;

    @property
    public displayHeight: number = 80;

    /** 玩家血量：1HP，被击中即亡 */
    public hp: number = 1;

    private _timer: number = 0;

    onLoad() {
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(this.displayWidth, this.displayHeight);
        }

        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    start() {
        const winSize = view.getVisibleSize();
        this.node.setPosition(0, -winSize.height / 2 + 120);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    private onTouchMove(event: EventTouch) {
        const delta = event.getUIDelta();
        const pos = this.node.position;
        this.clampPosition(pos.x + delta.x, pos.y + delta.y);
    }

    private onMouseMove(event: EventMouse) {
        const delta = event.getUIDelta();
        const pos = this.node.position;
        this.clampPosition(pos.x + delta.x, pos.y + delta.y);
    }

    private clampPosition(x: number, y: number) {
        const winSize = view.getVisibleSize();
        const halfW = winSize.width / 2 - this.displayWidth / 2;
        const halfH = winSize.height / 2 - this.displayHeight / 2;
        x = Math.max(-halfW, Math.min(halfW, x));
        y = Math.max(-halfH, Math.min(halfH, y));
        this.node.setPosition(x, y);
    }

    update(dt: number) {
        this._timer += dt;
        if (this._timer >= this.shootInterval) {
            this.shoot();
            this._timer = 0;
        }
    }

    private shoot() {
        if (!this.bulletPrefab) return;

        const bulletNode = instantiate(this.bulletPrefab);
        this.node.parent?.addChild(bulletNode);
        bulletNode.setPosition(this.node.position.x, this.node.position.y + this.displayHeight / 2 + 10);

        const bulletComp = bulletNode.getComponent(Bullet);
        if (bulletComp) {
            bulletComp.isPlayerBullet = true;
        }
    }
}
