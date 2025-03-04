// 将网格大小从 30*30 增加到 100*100

const gridSize = 100; // 增加网格大小到 100*100
let grid = [];
let intervalId;
let lastFrameTime = 0;
const frameRate = 30; // 每秒更新次数

// Initialize the game grid
function initGame() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    renderGame();
}

// Update the game state based on the rules of Conway's Game of Life
function updateGame(timestamp) {
    // 限制帧率以提高性能
    if (timestamp - lastFrameTime < 1000 / frameRate) {
        if (intervalId) {
            requestAnimationFrame(updateGame);
        }
        return;
    }
    lastFrameTime = timestamp;
    
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
    
    grid = newGrid;
    renderGame();
    
    if (intervalId) {
        requestAnimationFrame(updateGame);
    }
}

// Count alive neighbors for a given cell
function countAliveNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Skip the cell itself
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
                count += grid[newX][newY];
            }
        }
    }
    return count;
}

// 优化渲染函数，使用 DocumentFragment 来减少重排和重绘
function renderGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // 清空容器
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            if (grid[i][j] === 1) {
                cellDiv.classList.add('alive');
            }
            cellDiv.dataset.row = i;
            cellDiv.dataset.col = j;
            cellDiv.addEventListener('click', toggleCell);
            fragment.appendChild(cellDiv);
        }
    }
    
    container.appendChild(fragment);
}

// Toggle the state of a cell
function toggleCell(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    grid[row][col] = grid[row][col] === 1 ? 0 : 1;
    
    // 局部更新，不重新渲染整个网格
    event.target.classList.toggle('alive');
}

// Start the game loop
function startGame() {
    if (!intervalId) {
        intervalId = true;
        document.getElementById('start-button').disabled = true;
        document.getElementById('stop-button').disabled = false;
        requestAnimationFrame(updateGame);
    }
}

// Stop the game loop
function stopGame() {
    intervalId = null;
    document.getElementById('start-button').disabled = false;
    document.getElementById('stop-button').disabled = true;
}

// Initialize the game on page load and register button events
window.onload = () => {
    initGame();
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('stop-button').addEventListener('click', stopGame);
    
    // 添加随机初始化功能
    document.getElementById('random-button').addEventListener('click', randomizeGrid);
    document.getElementById('reset-button').addEventListener('click', resetGrid);
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case ' ': // 空格键开始/停止
                if (intervalId) {
                    stopGame();
                } else {
                    startGame();
                }
                break;
            case 'r': // r键随机初始化
                randomizeGrid();
                break;
            case 'c': // c键重置
                resetGrid();
                break;
        }
    });
    
    // 添加图案预设按钮事件监听
    document.getElementById('glider-button').addEventListener('click', addGlider);
    document.getElementById('pulsar-button').addEventListener('click', addPulsar);
};

// 随机初始化网格 - 调整密度以适应更大的网格
function randomizeGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = Math.random() > 0.85 ? 1 : 0; // 降低大网格的活细胞密度
        }
    }
    renderGame();
}

// 重置网格
function resetGrid() {
    stopGame();
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    renderGame();
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
    
    renderGame();
}

// 添加脉冲星图案
function addPulsar() {
    resetGrid();
    const centerX = Math.floor(gridSize / 2) - 6;
    const centerY = Math.floor(gridSize / 2) - 6;
    
    // 脉冲星图案 (一个13周期的振荡器)
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
    
    renderGame();
}