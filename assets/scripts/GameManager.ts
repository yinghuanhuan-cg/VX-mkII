import {
    _decorator, Component, Node, Prefab, instantiate, view, math,
    Label, Color, director, input, Input, EventKeyboard, KeyCode,
    UITransform, Graphics
} from 'cc';
import { Bullet } from './Bullet';
import { Enemy } from './Enemy';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

/**
 * 游戏管理器：调度中心，负责刷怪、碰撞检测、计分、暂停、重开
 */
@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    public enemyPrefab: Prefab = null!;

    @property
    public spawnInterval: number = 1.0;

    /** 击杀多少架敌机即可过关 */
    @property
    public winKillCount: number = 100;

    private _timer: number = 0;
    private _killCount: number = 0;
    private _isGameRunning: boolean = true;
    private _isPaused: boolean = false;

    private _killLabel: Label | null = null;
    private _statusLabel: Label | null = null;
    private _restartBtnNode: Node | null = null;

    // --- 单例 ---
    private static _instance: GameManager | null = null;
    public static get instance(): GameManager | null { return this._instance; }
    public get isGameRunning(): boolean { return this._isGameRunning; }

    onLoad() {
        GameManager._instance = this;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.createUI();
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        if (GameManager._instance === this) GameManager._instance = null;
    }

    // ==================== UI ====================
    private createUI() {
        const winSize = view.getVisibleSize();

        // 击杀计数（顶部居中）
        const killNode = new Node('KillLabel');
        this._killLabel = killNode.addComponent(Label);
        this._killLabel.string = `击杀: 0 / ${this.winKillCount}`;
        this._killLabel.fontSize = 28;
        this._killLabel.lineHeight = 36;
        this._killLabel.color = new Color(255, 255, 0, 255);
        this.node.parent?.addChild(killNode);
        killNode.setPosition(0, winSize.height / 2 - 40);
        killNode.setSiblingIndex(999);

        // 状态提示（屏幕中央，默认隐藏）
        const statusNode = new Node('StatusLabel');
        this._statusLabel = statusNode.addComponent(Label);
        this._statusLabel.string = '';
        this._statusLabel.fontSize = 48;
        this._statusLabel.lineHeight = 60;
        this._statusLabel.color = new Color(255, 255, 255, 255);
        this.node.parent?.addChild(statusNode);
        statusNode.setPosition(0, 60);
        statusNode.setSiblingIndex(999);
        statusNode.active = false;

        // 重新开始按钮（游戏结束/胜利时显示）
        this._restartBtnNode = this.createRestartButton();
        this._restartBtnNode.active = false;
    }

    /** 用代码绘制一个简单的重新开始按钮 */
    private createRestartButton(): Node {
        const winSize = view.getVisibleSize();

        // 外层容器
        const btnNode = new Node('RestartButton');
        this.node.parent?.addChild(btnNode);
        btnNode.setPosition(0, -40);
        btnNode.setSiblingIndex(1000);

        // UITransform 让按钮有可点击区域
        const uiT = btnNode.addComponent(UITransform);
        uiT.setContentSize(220, 60);

        // 用 Graphics 画圆角矩形背景
        const bg = btnNode.addComponent(Graphics);
        bg.fillColor = new Color(50, 200, 100, 230);
        this.drawRoundRect(bg, 220, 60, 12);

        // 按钮文字
        const labelNode = new Node('BtnLabel');
        btnNode.addChild(labelNode);
        labelNode.setPosition(0, 0);
        const label = labelNode.addComponent(Label);
        label.string = '重新开始';
        label.fontSize = 26;
        label.lineHeight = 32;
        label.color = new Color(255, 255, 255, 255);

        // 注册点击事件
        btnNode.on(Node.EventType.TOUCH_END, this.onRestartClick, this);

        // 鼠标悬停效果
        btnNode.on(Node.EventType.MOUSE_ENTER, () => {
            bg.clear();
            bg.fillColor = new Color(80, 230, 130, 255);
            this.drawRoundRect(bg, 220, 60, 12);
        }, this);
        btnNode.on(Node.EventType.MOUSE_LEAVE, () => {
            bg.clear();
            bg.fillColor = new Color(50, 200, 100, 230);
            this.drawRoundRect(bg, 220, 60, 12);
        }, this);

        return btnNode;
    }

    /** 绘制填充圆角矩形（Cocos 3.x Graphics 兼容写法） */
    private drawRoundRect(g: Graphics, w: number, h: number, r: number) {
        // roundRect 在 Cocos 3.x 中已支持
        (g as any).roundRect(-w / 2, -h / 2, w, h, r);
        g.fill();
    }

    private onRestartClick() {
        // 重载当前场景
        director.loadScene(director.getScene()!.name);
    }

    // ==================== 主循环 ====================
    update(dt: number) {
        if (!this._isGameRunning) return;

        this._timer += dt;
        if (this._timer >= this.spawnInterval) {
            this.spawnEnemy();
            this._timer = 0;
        }

        this.checkCollisions();
    }

    private spawnEnemy() {
        if (!this.enemyPrefab) return;
        const enemyNode = instantiate(this.enemyPrefab);
        this.node.parent?.addChild(enemyNode);

        const winSize = view.getVisibleSize();
        const x = math.randomRange(-winSize.width / 2 + 50, winSize.width / 2 - 50);
        enemyNode.setPosition(x, winSize.height / 2 + 50);
    }

    // ==================== 手动 AABB 碰撞检测 ====================
    private checkCollisions() {
        const canvas = this.node.parent;
        if (!canvas) return;

        const bullets: Node[] = [];
        const enemies: Node[] = [];
        let player: Node | null = null;

        for (const child of canvas.children) {
            if (!child.isValid) continue;
            if (child.getComponent(Bullet)) bullets.push(child);
            else if (child.getComponent(Enemy)) enemies.push(child);
            else if (child.getComponent(PlayerController)) player = child;
        }

        // 1. 玩家子弹 vs 敌机
        for (const bNode of bullets) {
            if (!bNode.isValid) continue;
            const bc = bNode.getComponent(Bullet)!;
            if (!bc.isPlayerBullet) continue;

            for (const eNode of enemies) {
                if (!eNode.isValid) continue;
                if (this.isOverlap(bNode, eNode)) {
                    const ec = eNode.getComponent(Enemy)!;
                    ec.hp -= 1;
                    bNode.destroy();
                    if (ec.hp <= 0) {
                        eNode.destroy();
                        this.addKill();
                    }
                    break;
                }
            }
        }

        // 2. 敌方子弹 vs 玩家
        if (player && player.isValid) {
            for (const bNode of bullets) {
                if (!bNode.isValid) continue;
                const bc = bNode.getComponent(Bullet);
                if (!bc || bc.isPlayerBullet) continue;

                if (this.isOverlap(bNode, player)) {
                    const pc = player.getComponent(PlayerController)!;
                    pc.hp -= 1;
                    bNode.destroy();
                    if (pc.hp <= 0) {
                        player.destroy();
                        this.gameOver();
                        return;
                    }
                }
            }
        }
    }

    /** AABB 矩形重叠检测，碰撞框缩至 70% 让手感更舒服 */
    private isOverlap(a: Node, b: Node): boolean {
        const at = a.getComponent(UITransform);
        const bt = b.getComponent(UITransform);
        if (!at || !bt) return false;

        const f = 0.7;
        const ahw = at.contentSize.width / 2 * f;
        const ahh = at.contentSize.height / 2 * f;
        const bhw = bt.contentSize.width / 2 * f;
        const bhh = bt.contentSize.height / 2 * f;

        return Math.abs(a.position.x - b.position.x) < ahw + bhw &&
               Math.abs(a.position.y - b.position.y) < ahh + bhh;
    }

    // ==================== 计分与胜负 ====================
    private addKill() {
        this._killCount++;
        if (this._killLabel) {
            this._killLabel.string = `击杀: ${this._killCount} / ${this.winKillCount}`;
        }
        if (this._killCount >= this.winKillCount) {
            this.victory();
        }
    }

    private victory() {
        this._isGameRunning = false;
        this.showStatus('🎉 胜利！击落全部敌机！', new Color(50, 255, 50, 255));
        this.showRestartButton();
    }

    public gameOver() {
        this._isGameRunning = false;
        this.showStatus('💥 游戏结束', new Color(255, 80, 80, 255));
        this.showRestartButton();
    }

    private showStatus(text: string, color: Color) {
        if (this._statusLabel) {
            this._statusLabel.node.active = true;
            this._statusLabel.string = text;
            this._statusLabel.color = color;
        }
    }

    private showRestartButton() {
        if (this._restartBtnNode) {
            this._restartBtnNode.active = true;
        }
    }

    // ==================== 暂停 ====================
    private onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.ESCAPE) {
            this.togglePause();
        }
        // R 键也可以重新开始（游戏结束后）
        if (event.keyCode === KeyCode.KEY_R && !this._isGameRunning) {
            this.onRestartClick();
        }
    }

    private togglePause() {
        if (!this._isGameRunning) return;

        this._isPaused = !this._isPaused;
        if (this._isPaused) {
            director.pause();
            this.showStatus('游戏暂停\n按 Esc 继续', new Color(255, 255, 255, 255));
        } else {
            director.resume();
            if (this._statusLabel) this._statusLabel.node.active = false;
        }
    }
}
