import { _decorator, Component, Node, Vec3, EventTouch, EventMouse, Input, input, Prefab, instantiate, UITransform } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

/**
 * 玩家控制脚本：处理鼠标/触摸跟随，以及自动射击逻辑
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    // 在编辑器中关联子弹的预制体 (Prefab)
    @property(Prefab)
    public bulletPrefab: Prefab = null!;

    // 射击频率：射击一次的时间间隔（秒）
    @property
    public shootInterval: number = 0.2;

    // 内部计时器，用于控制射击节奏
    private _timer: number = 0;

    onLoad() {
        // 在全局 input 对象上注册触摸和鼠标移动事件
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onDestroy() {
        // 记得在脚本销毁时取消注册，这是严谨开发的良好习惯
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    /**
     * 手机触摸移动回调
     */
    private onTouchMove(event: EventTouch) {
        // 获取手指移动的增量 (Delta)
        const delta = event.getUIDelta();
        const pos = this.node.position;
        // 将增量直接叠加到当前位置，实现战机跟随手指
        this.node.setPosition(pos.x + delta.x, pos.y + delta.y);
    }

    /**
     * 电脑鼠标移动回调
     */
    private onMouseMove(event: EventMouse) {
        // getUIDelta 同样适用于鼠标，这样可以保证不同输入设备体验一致
        const delta = event.getUIDelta();
        const pos = this.node.position;
        this.node.setPosition(pos.x + delta.x, pos.y + delta.y);
    }

    update(dt: number) {
        // 累加时间，计算是否到了下一次开火的时间
        this._timer += dt;
        if (this._timer >= this.shootInterval) {
            this.shoot();
            this._timer = 0; // 重置计时器
        }
    }

    /**
     * 核心射击函数
     */
    private shoot() {
        if (!this.bulletPrefab) return;

        // 1. 克隆一个子弹实例
        const bulletNode = instantiate(this.bulletPrefab);
        
        // 2. 将子弹添加到场景中（挂载到玩家所在的父节点下，通常是 Canvas 或者战机层）
        this.node.parent?.addChild(bulletNode);
        
        // 3. 设置子弹初始位置（放在战机头顶稍高处）
        bulletNode.setPosition(this.node.position.x, this.node.position.y + 50);

        // 4. 重点：获取子弹身上的脚本并标记其为玩家子弹
        const bulletComp = bulletNode.getComponent(Bullet);
        if (bulletComp) {
            bulletComp.isPlayerBullet = true;
        }
    }
}
