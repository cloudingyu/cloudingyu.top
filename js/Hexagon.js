/**
 * 六边形类 - 负责渲染由三个菱形组成的正六边形
 */
export class Hexagon {
    /**
     * 创建一个六边形
     * @param {number} x - 六边形中心的 x 坐标
     * @param {number} y - 六边形中心的 y 坐标
     * @param {number} size - 六边形的大小（从中心到顶点的距离）
     */
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        
        // 三个面的颜色
        this.topFaceColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        this.leftFaceColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
        this.rightFaceColor = getComputedStyle(document.documentElement).getPropertyValue('--tertiary-color').trim();
        this.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
    }

    /**
     * 绘制六边形
     * @param {CanvasRenderingContext2D} ctx - Canvas 绘图上下文
     */
    draw(ctx) {
        // 计算六边形的六个顶点
        const points = this._calculatePoints();
        
        // 绘制三个菱形面
        this._drawTopFace(ctx, points);
        this._drawLeftFace(ctx, points);
        this._drawRightFace(ctx, points);
        
        // 绘制边框
        this._drawBorders(ctx, points);
    }

    /**
     * 计算六边形的六个顶点坐标
     * @returns {Array} 包含六个顶点坐标的数组
     * 顶点顺序: 上, 右上, 右下, 下, 左下, 左上
     */
    _calculatePoints() {
        const s = this.size;
        return [
            { x: this.x, y: this.y - s },           // 上顶点
            { x: this.x + s * 0.866, y: this.y - s * 0.5 },  // 右上顶点
            { x: this.x + s * 0.866, y: this.y + s * 0.5 },  // 右下顶点
            { x: this.x, y: this.y + s },           // 下顶点
            { x: this.x - s * 0.866, y: this.y + s * 0.5 },  // 左下顶点
            { x: this.x - s * 0.866, y: this.y - s * 0.5 }   // 左上顶点
        ];
    }

    /**
     * 绘制上表面（顶面菱形）
     */
    _drawTopFace(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y); // 上顶点
        ctx.lineTo(points[1].x, points[1].y); // 右上顶点
        ctx.lineTo(this.x, this.y);           // 中心点
        ctx.lineTo(points[5].x, points[5].y); // 左上顶点
        ctx.closePath();
        
        ctx.fillStyle = this.topFaceColor;
        ctx.fill();
    }

    /**
     * 绘制左表面（左侧菱形）
     */
    _drawLeftFace(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[5].x, points[5].y); // 左上顶点
        ctx.lineTo(this.x, this.y);           // 中心点
        ctx.lineTo(points[4].x, points[4].y); // 左下顶点
        ctx.lineTo(points[3].x, points[3].y); // 下顶点
        ctx.closePath();
        
        ctx.fillStyle = this.leftFaceColor;
        ctx.fill();
    }

    /**
     * 绘制右表面（右侧菱形）
     */
    _drawRightFace(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[1].x, points[1].y); // 右上顶点
        ctx.lineTo(points[2].x, points[2].y); // 右下顶点
        ctx.lineTo(points[3].x, points[3].y); // 下顶点
        ctx.lineTo(this.x, this.y);           // 中心点
        ctx.closePath();
        
        ctx.fillStyle = this.rightFaceColor;
        ctx.fill();
    }

    /**
     * 绘制六边形的边框
     */
    _drawBorders(ctx, points) {
        ctx.beginPath();
        
        // 绘制外边框
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        
        // 绘制内部边（将六边形分为三个菱形）
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(points[3].x, points[3].y);
        
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}