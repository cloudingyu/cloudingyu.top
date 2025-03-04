// This file contains the core logic for Conway's Game of Life.

const gridSize = 30; // Size of the grid (与 CSS 的30×30保持一致)
let grid = [];
let intervalId;

// Initialize the game grid
function initGame() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    renderGame();
}

// Update the game state based on the rules of Conway's Game of Life
function updateGame() {
    const newGrid = grid.map(arr => [...arr]);
    
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

// Render the game grid to the webpage
function renderGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    
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
            container.appendChild(cellDiv);
        }
    }
}

// Toggle the state of a cell
function toggleCell(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    grid[row][col] = grid[row][col] === 1 ? 0 : 1;
    renderGame();
}

// Start the game loop
function startGame() {
    if (!intervalId) {
        intervalId = setInterval(updateGame, 300); // 减慢速度便于观察
        document.getElementById('start-button').disabled = true;
        document.getElementById('stop-button').disabled = false;
    }
}

// Stop the game loop
function stopGame() {
    clearInterval(intervalId);
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
};

// 随机初始化网格
function randomizeGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = Math.random() > 0.7 ? 1 : 0;
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