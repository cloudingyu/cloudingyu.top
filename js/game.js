// 改进大型网格 (100*100) 的渲染和性能

const gridSize = 100;
let grid = [];
let intervalId;
let lastFrameTime = 0;
const frameRate = 10; // 限制帧率以提高性能
let fpsCounter = 0;
let lastFpsUpdate = 0;
let currentFps = 0;

// 优化初始化函数
function initGame() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    
    // 使用更高效的方式创建网格
    const container = document.getElementById('game-container');
    
    // 清空并设置网格尺寸
    container.innerHTML = '';
    const gridStyle = window.getComputedStyle(container);
    const cellSize = parseInt(gridStyle.width) / gridSize;
    
    // 使用单个文档片段优化DOM操作
    const fragment = document.createDocumentFragment();
    
    // 创建所有单元格
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.dataset.row = i;
            cellDiv.dataset.col = j;
            cellDiv.addEventListener('click', toggleCell);
            fragment.appendChild(cellDiv);
        }
    }
    
    container.appendChild(fragment);
    
    // 保存所有单元格的引用以提高更新性能
    cells = Array.from(container.querySelectorAll('.cell'));
    
    // 显示初始FPS
    updatePerformanceInfo(0);
}

// 优化更新函数，使用更高效的方法
function updateGame(timestamp) {
    // 帧率控制
    if (timestamp - lastFrameTime < 1000 / frameRate) {
        if (intervalId) {
            requestAnimationFrame(updateGame);
        }
        return;
    }
    
    // 帧率计算
    fpsCounter++;
    if (timestamp - lastFpsUpdate >= 1000) {
        currentFps = fpsCounter;
        fpsCounter = 0;
        lastFpsUpdate = timestamp;
        updatePerformanceInfo(currentFps);
    }
    
    lastFrameTime = timestamp;
    
    // 计算新状态
    const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const aliveNeighbors = countAliveNeighbors(i, j);
            if (grid[i][j] === 1) {
                newGrid[i][j] = aliveNeighbors === 2 || aliveNeighbors === 3 ? 1 : 0;
            } else {
                newGrid[i][j] = aliveNeighbors === 3 ? 1 : 0;
            }
        }
    }
    
    // 更新网格并只更新变化的单元格
    updateGridDisplay(newGrid);
    grid = newGrid;
    
    if (intervalId) {
        requestAnimationFrame(updateGame);
    }
}

// 计算邻居函数保持不变
function countAliveNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
                count += grid[newX][newY];
            }
        }
    }
    return count;
}

// 优化网格更新，只更新改变状态的单元格
function updateGridDisplay(newGrid) {
    const container = document.getElementById('game-container');
    const cells = container.children;
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = i * gridSize + j;
            const cell = cells[index];
            
            // 仅当状态发生变化时才更新DOM
            if (grid[i][j] !== newGrid[i][j]) {
                if (newGrid[i][j] === 1) {
                    cell.classList.add('alive');
                } else {
                    cell.classList.remove('alive');
                }
            }
        }
    }
}

// 切换单元格状态 - 优化为直接修改当前状态
function toggleCell(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    grid[row][col] = grid[row][col] === 1 ? 0 : 1;
    event.target.classList.toggle('alive');
}

// 开始游戏 - 使用requestAnimationFrame
function startGame() {
    if (!intervalId) {
        intervalId = true;
        document.getElementById('start-button').disabled = true;
        document.getElementById('stop-button').disabled = false;
        lastFpsUpdate = performance.now();
        fpsCounter = 0;
        requestAnimationFrame(updateGame);
    }
}

// 停止游戏
function stopGame() {
    intervalId = null;
    document.getElementById('start-button').disabled = false;
    document.getElementById('stop-button').disabled = true;
    updatePerformanceInfo(0); // 游戏停止时显示FPS为0
}

// 更新性能信息显示
function updatePerformanceInfo(fps) {
    const perfInfo = document.getElementById('performance-info');
    if (perfInfo) {
        perfInfo.textContent = `FPS: ${fps} | 网格大小: ${gridSize}x${gridSize}`;
    }
}

// 随机初始化网格 - 调整细胞密度
function randomizeGrid() {
    stopGame();
    
    // 更低的活细胞密度以获得更好的模式
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = Math.random() > 0.85 ? 1 : 0; 
        }
    }
    
    // 直接更新显示
    updateFullDisplay();
}

// 完全刷新显示
function updateFullDisplay() {
    const container = document.getElementById('game-container');
    const cells = container.children;
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = i * gridSize + j;
            if (grid[i][j] === 1) {
                cells[index].classList.add('alive');
            } else {
                cells[index].classList.remove('alive');
            }
        }
    }
}

// 重置网格
function resetGrid() {
    stopGame();
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    updateFullDisplay();
}

// 添加滑翔机图案
function addGlider() {
    resetGrid();
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    
    // 滑翔机图案
    grid[centerX][centerY] = 1;
    grid[centerX + 1][centerY + 1] = 1;
    grid[centerX + 1][centerY + 2] = 1;
    grid[centerX][centerY + 2] = 1;
    grid[centerX - 1][centerY + 2] = 1;
    
    updateFullDisplay();
}

// 添加脉冲星图案
function addPulsar() {
    resetGrid();
    const centerX = Math.floor(gridSize / 2) - 6;
    const centerY = Math.floor(gridSize / 2) - 6;
    
    // 脉冲星图案
    const pulsar = [
        [2, 4, 5, 6, 10, 11, 12],
        [4, 6, 10, 12],
        [2, 7, 9, 14],
        [0, 7, 9, 14, 16],
        [0, 7, 9, 14, 16],
        [0, 7, 9, 14, 16],
        [2, 7, 9, 14],
        [4, 6, 10, 12],
        [2, 4, 5, 6, 10, 11, 12]
    ];
    
    // 填充脉冲星图案
    for (let i = 0; i < pulsar.length; i++) {
        for (let j = 0; j < pulsar[i].length; j++) {
            grid[centerX + i][centerY + pulsar[i][j]] = 1;
            grid[centerX + pulsar[i][j]][centerY + i] = 1;
        }
    }
    
    updateFullDisplay();
}

// 添加随机行走器图案
function addRandomWalker() {
    resetGrid();
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    
    // 添加随机行走器
    grid[centerX][centerY] = 1;
    grid[centerX + 1][centerY] = 1;
    grid[centerX + 2][centerY] = 1;
    grid[centerX + 2][centerY - 1] = 1;
    grid[centerX + 1][centerY - 2] = 1;
    
    updateFullDisplay();
}

// 初始化游戏
window.onload = () => {
    initGame();
    
    // 注册按钮事件
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('stop-button').addEventListener('click', stopGame);
    document.getElementById('random-button').addEventListener('click', randomizeGrid);
    document.getElementById('reset-button').addEventListener('click', resetGrid);
    document.getElementById('glider-button').addEventListener('click', addGlider);
    document.getElementById('pulsar-button').addEventListener('click', addPulsar);
    document.getElementById('walker-button').addEventListener('click', addRandomWalker);
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case ' ':
                if (intervalId) {
                    stopGame();
                } else {
                    startGame();
                }
                break;
            case 'r':
                randomizeGrid();
                break;
            case 'c':
                resetGrid();
                break;
            case 'g':
                addGlider();
                break;
            case 'p':
                addPulsar();
                break;
            case 'w':
                addRandomWalker();
                break;
        }
    });
};