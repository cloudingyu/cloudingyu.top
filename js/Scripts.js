import { Hexagon } from './Hexagon.js';

// 当文档加载完成时初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

/**
 * 初始化游戏
 */
function initGame() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    canvas.width = 600;
    canvas.height = 400;
    
    // 创建并绘制一个六边形作为示例
    const hexagon = new Hexagon(canvas.width / 2, canvas.height / 2, 80);
    
    // 渲染游戏
    function render() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制六边形
        hexagon.draw(ctx);
        
        // 请求下一帧动画
        requestAnimationFrame(render);
    }
    
    // 开始渲染循环
    render();
}