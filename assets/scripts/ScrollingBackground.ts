import { _decorator, Component, Node, Vec3, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 背景滚动脚本：通过两个背景图交替循环，实现无限滚动的视觉效果（像坦克大战或雷霆战机那样）
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

    // 记录背景图片的单张高度，用于计算循环点
    private _height: number = 0;

    start() {
        // 获取图片的宽高度属性（Cocos 3.x 使用 UITransform 组件管理 UI 尺寸）
        const transform = this.bg1.getComponent(UITransform);
        if (transform) {
            this._height = transform.contentSize.height;
        } else {
            // 如果没拿到，就用窗口高度兜底
            this._height = view.getVisibleSize().height;
        }
        
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

        // 循环逻辑：
        // 当某张背景图完全飞出屏幕下边缘（y <= -高度）时，将其瞬间挪到另一张图的顶部，实现无缝衔接
        if (this.bg1.position.y <= -this._height) {
            this.bg1.setPosition(0, this.bg2.position.y + this._height);
        }
        if (this.bg2.position.y <= -this._height) {
            this.bg2.setPosition(0, this.bg1.position.y + this._height);
        }
    }
}
