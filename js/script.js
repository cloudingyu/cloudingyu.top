document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸 - 使用clientWidth和clientHeight确保准确大小
    function resizeCanvas() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
    }
    
    resizeCanvas();
    
    // 定义固定的游戏逻辑大小
    const gameWidth = 5000;
    const gameHeight = 5000;
    
    // 定义方格大小和数组
    const cellSize = 10;
    const cols = Math.ceil(gameWidth / cellSize);
    const rows = Math.ceil(gameHeight / cellSize);
    
    // 初始视图位置（居中）
    let viewOffsetX = (gameWidth - canvas.width) / 2;
    let viewOffsetY = (gameHeight - canvas.height) / 2;
    
    // 确保偏移量不会超出边界
    function clampOffset() {
        viewOffsetX = Math.max(0, Math.min(gameWidth - canvas.width, viewOffsetX));
        viewOffsetY = Math.max(0, Math.min(gameHeight - canvas.height, viewOffsetY));
    }
    
    // 定义变量
    let grid = createRandomGrid();
    let animationFrameId;
    let lastTime = 0;
    const frameRate = 10; // 每秒更新次数
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    
    // 创建随机网格
    function createRandomGrid() {
        return Array(rows).fill().map(() => 
            Array(cols).fill().map(() => Math.random() > 0.7 ? 1 : 0)
        );
    }
    
    // 更新状态
    function update() {
        const next = Array(rows).fill().map(() => Array(cols).fill(0));
        
        // 应用康威生命游戏规则
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const neighbors = countNeighbors(grid, i, j);
                
                if (grid[i][j] === 1) {
                    // 存活细胞规则
                    next[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    // 死亡细胞规则
                    next[i][j] = (neighbors === 3) ? 1 : 0;
                }
            }
        }
        
        grid = next;
    }
    
    // 计算邻居细胞数量
    function countNeighbors(grid, x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const row = (x + i + rows) % rows;
                const col = (y + j + cols) % cols;
                count += grid[row][col];
            }
        }
        return count;
    }
    
    // 渲染可视区域内的网格
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 计算可见区域中的单元格范围
        const startCol = Math.floor(viewOffsetX / cellSize);
        const endCol = Math.ceil((viewOffsetX + canvas.width) / cellSize);
        const startRow = Math.floor(viewOffsetY / cellSize);
        const endRow = Math.ceil((viewOffsetY + canvas.height) / cellSize);
        
        // 只绘制可见区域内的单元格
        for (let i = startRow; i < endRow && i < rows; i++) {
            for (let j = startCol; j < endCol && j < cols; j++) {
                if (grid[i][j] === 1) {
                    const x = j * cellSize - viewOffsetX;
                    const y = i * cellSize - viewOffsetY;
                    ctx.fillStyle = '#5F9EA0';
                    ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
                }
            }
        }
    }
    
    // 游戏循环
    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;
        
        if (elapsed > 1000 / frameRate) {
            update();
            render();
            lastTime = timestamp;
        }
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // 添加鼠标拖动事件以移动视图
    canvas.addEventListener('mousedown', (event) => {
        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const dx = event.clientX - dragStartX;
            const dy = event.clientY - dragStartY;
            
            viewOffsetX -= dx;
            viewOffsetY -= dy;
            clampOffset();
            
            dragStartX = event.clientX;
            dragStartY = event.clientY;
            
            render();
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // 窗口大小改变事件 - 改进视图处理
    window.addEventListener('resize', () => {
        // 保存视图的当前中心点
        const viewCenterX = viewOffsetX + (canvas.width / 2);
        const viewCenterY = viewOffsetY + (canvas.height / 2);
        
        // 调整画布大小
        resizeCanvas();
        
        // 重新计算视图偏移，以保持视图中心不变
        viewOffsetX = viewCenterX - (canvas.width / 2);
        viewOffsetY = viewCenterY - (canvas.height / 2);
        
        // 确保不会超出游戏边界
        clampOffset();
        
        // 立即重新渲染以避免闪烁
        render();
    });
    
    // 更完善的触控阻止
    function preventDefault(e) {
        e.preventDefault();
    }
    
    // 阻止整个文档的默认触摸行为
    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    
    // 阻止文档上的默认鼠标滚轮行为
    document.addEventListener('wheel', preventDefault, { passive: false });
    
    // 替换掉旧的触摸事件处理代码，使用更简洁的代码
    canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        isDragging = true;
        dragStartX = event.touches[0].clientX;
        dragStartY = event.touches[0].clientY;
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        if (isDragging) {
            const dx = event.touches[0].clientX - dragStartX;
            const dy = event.touches[0].clientY - dragStartY;
            
            viewOffsetX -= dx;
            viewOffsetY -= dy;
            clampOffset();
            
            dragStartX = event.touches[0].clientX;
            dragStartY = event.touches[0].clientY;
            
            render();
        }
    }, { passive: false });
    
    canvas.addEventListener('touchend', (event) => {
        event.preventDefault();
        isDragging = false;
    }, { passive: false });
    
    // 开始游戏
    render();
    animationFrameId = requestAnimationFrame(gameLoop);
});
