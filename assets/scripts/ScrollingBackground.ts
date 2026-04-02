import { _decorator, Component, Node, Vec3, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 背景滚动脚本：通过两个背景图交替循环，实现无限滚动的视觉效果
 */
@ccclass('ScrollingBackground')
export class ScrollingBackground extends Component {
    // 第一张背景图片节点
    @property(Node)
    public bg1: Node = null!;

    // 第二张背景图片节点（放在第一张上面）
    @property(Node)
    public bg2: Node = null!;

    // 滚动速度（每秒移动的像素）
    @property
    public speed: number = 100;

    // 记录背景图片的显示高度
    private _height: number = 0;

    start() {
        // ===== 核心修复：将背景图拉伸到铺满整个屏幕 =====
        const winSize = view.getVisibleSize();
        
        // 设置 BG1 的大小等于屏幕大小
        const transform1 = this.bg1.getComponent(UITransform);
        if (transform1) {
            transform1.setContentSize(winSize.width, winSize.height);
        }

        // 设置 BG2 的大小等于屏幕大小
        const transform2 = this.bg2.getComponent(UITransform);
        if (transform2) {
            transform2.setContentSize(winSize.width, winSize.height);
        }

        // 使用屏幕高度作为循环高度
        this._height = winSize.height;

        // 初始化背景位置：bg1 在中心，bg2 紧贴在 bg1 的正上方
        this.bg1.setPosition(0, 0);
        this.bg2.setPosition(0, this._height);
    }

    update(dt: number) {
        // 计算两张图向下移动后的新坐标
        const y1 = this.bg1.position.y - this.speed * dt;
        const y2 = this.bg2.position.y - this.speed * dt;

        this.bg1.setPosition(0, y1);
        this.bg2.setPosition(0, y2);

        // 循环逻辑：背景图完全飞出屏幕下边缘时，移到另一张图的上方
        if (this.bg1.position.y <= -this._height) {
            this.bg1.setPosition(0, this.bg2.position.y + this._height);
        }
        if (this.bg2.position.y <= -this._height) {
            this.bg2.setPosition(0, this.bg1.position.y + this._height);
        }
    }
}
