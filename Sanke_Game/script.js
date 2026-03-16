// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const currentLevelElement = document.getElementById('currentLevel');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const changeLevelBtn = document.getElementById('changeLevelBtn');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const levelSelectionDiv = document.getElementById('levelSelection');
const levelButtons = document.querySelectorAll('.level-btn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Theme management
let currentTheme = localStorage.getItem('snakeTheme') || 'light';

// Initialize theme
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

// Update theme icon based on current theme
function updateThemeIcon() {
    if (currentTheme === 'dark') {
        themeIcon.textContent = '☀️';
        themeToggle.title = 'Switch to Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeToggle.title = 'Switch to Dark Mode';
    }
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('snakeTheme', currentTheme);
    updateThemeIcon();
    
    // Redraw game if canvas is visible
    if (canvas.width > 0) {
        drawGame();
    }
}

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Initialize theme on page load
initTheme();

// Difficulty levels with speeds (in milliseconds)
const difficultyLevels = {
    easy: {
        speed: 300,
        name: 'Easy',
        icon: '🐌'
    },
    intermediate: {
        speed: 200,
        name: 'Intermediate',
        icon: '🚶'
    },
    hard: {
        speed: 120,
        name: 'Hard',
        icon: '⚡'
    }
};

let currentDifficulty = localStorage.getItem('snakeDifficulty') || 'intermediate';
let gameSpeed = difficultyLevels[currentDifficulty].speed;

// Set canvas size based on viewport
function setCanvasSize() {
    const maxWidth = Math.min(window.innerWidth - 40, 600);
    const maxHeight = window.innerHeight - 400;
    const size = Math.min(maxWidth, maxHeight > 0 ? maxHeight : 400, 600);
    
    // Round to nearest multiple of 20 for clean grid
    const roundedSize = Math.floor(size / 20) * 20;
    
    canvas.width = roundedSize;
    canvas.height = roundedSize;
    gridSize = 20; // Always 20x20 grid
    cellSize = roundedSize / 20;
}

let gridSize = 20;
let cellSize = 20;
let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = 0;
let gameLoop;
let foodEaten = false; // For visual feedback

// Load high score for current difficulty
function loadHighScore(difficulty) {
    const key = `snakeHighScore_${difficulty}`;
    return parseInt(localStorage.getItem(key) || '0');
}

// Save high score for current difficulty
function saveHighScore(difficulty, score) {
    const key = `snakeHighScore_${difficulty}`;
    localStorage.setItem(key, score.toString());
}

// Snake
let snake = [
    { x: 10, y: 10 }
];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };

// Food
let food = { x: 15, y: 15 };

// Initialize canvas size
setCanvasSize();
window.addEventListener('resize', () => {
    if (!gameRunning) {
        setCanvasSize();
        drawGame();
    }
});

// Load and display high score for current difficulty
highScore = loadHighScore(currentDifficulty);
highScoreElement.textContent = highScore;

// Initialize level selection
function initializeLevelSelection() {
    // Set selected level
    levelButtons.forEach(btn => {
        if (btn.dataset.level === currentDifficulty) {
            btn.classList.add('selected');
        }
        btn.addEventListener('click', () => selectLevel(btn.dataset.level));
    });
    
    // Show level selection initially
    if (!gameRunning) {
        levelSelectionDiv.style.display = 'block';
        startBtn.style.display = 'none';
    }
}

function selectLevel(level) {
    currentDifficulty = level;
    gameSpeed = difficultyLevels[level].speed;
    localStorage.setItem('snakeDifficulty', level);
    
    // Load high score for selected level
    highScore = loadHighScore(level);
    highScoreElement.textContent = highScore;
    
    // Update UI
    levelButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.level === level) {
            btn.classList.add('selected');
        }
    });
    
    currentLevelElement.textContent = difficultyLevels[level].name;
    
    // Show start button
    startBtn.style.display = 'inline-block';
    levelSelectionDiv.style.display = 'none';
}

// Initialize on page load
initializeLevelSelection();

// Generate random food position
function generateFood() {
    food.x = Math.floor(Math.random() * gridSize);
    food.y = Math.floor(Math.random() * gridSize);
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Draw functions
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head - bright neon cyan with glow
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 18;
            drawCell(segment.x, segment.y, '#00f5ff');
            ctx.shadowBlur = 0;
        } else {
            // Body - fade from cyan to purple along length
            const t = Math.min(index / Math.max(snake.length - 1, 1), 1);
            const r = Math.round(0   + t * 191);
            const g = Math.round(245 - t * 245);
            const b = Math.round(255 + t * 0);
            const alpha = Math.max(1 - index * 0.018, 0.35);
            ctx.shadowColor = `rgba(${r},${g},${b},0.8)`;
            ctx.shadowBlur = 8;
            drawCell(segment.x, segment.y, `rgba(${r},${g},${b},${alpha})`);
            ctx.shadowBlur = 0;
        }
    });
}

function drawFood() {
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time) * 0.2 + 0.8;

    const cx = food.x * cellSize + cellSize / 2;
    const cy = food.y * cellSize + cellSize / 2;

    // Outer glow ring - neon pink
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 20;
    ctx.fillStyle = `rgba(255, 0, 127, ${0.18 * pulse})`;
    ctx.beginPath();
    ctx.arc(cx, cy, (cellSize / 2) * (1 + pulse * 0.25), 0, Math.PI * 2);
    ctx.fill();

    // Main food - neon pink/magenta
    ctx.fillStyle = `rgba(255, 0, 127, ${0.9 * pulse})`;
    ctx.beginPath();
    ctx.arc(cx, cy, (cellSize / 2 - 1) * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core - white-pink
    ctx.shadowBlur = 10;
    ctx.fillStyle = `rgba(255, 160, 210, ${pulse})`;
    ctx.beginPath();
    ctx.arc(cx, cy, (cellSize / 3.5) * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
}

function drawGame() {
    // Deep dark cyberpunk background
    ctx.fillStyle = '#02020f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle neon cyan grid
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    drawFood();
    drawSnake();
}

// Update game state
function updateGame() {
    if (gamePaused || !gameRunning) return;
    
    // Update direction
    direction = { ...nextDirection };
    
    // Move snake
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Wraparound walls - snake goes through walls and appears on opposite side
    if (head.x < 0) {
        head.x = gridSize - 1;
    } else if (head.x >= gridSize) {
        head.x = 0;
    }
    if (head.y < 0) {
        head.y = gridSize - 1;
    } else if (head.y >= gridSize) {
        head.y = 0;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        
        // Update high score for current difficulty level
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            saveHighScore(currentDifficulty, highScore);
        }
        
        generateFood();
    } else {
        snake.pop();
    }
    
    drawGame();
}

// Game control functions
function startGame() {
    // Make sure a level is selected
    if (!currentDifficulty) {
        levelSelectionDiv.style.display = 'block';
        return;
    }
    
    // Reset game state
    snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    
    // Load high score for current difficulty
    highScore = loadHighScore(currentDifficulty);
    highScoreElement.textContent = highScore;
    
    // Update level display
    currentLevelElement.textContent = difficultyLevels[currentDifficulty].name;
    gameSpeed = difficultyLevels[currentDifficulty].speed;
    
    generateFood();
    gameRunning = true;
    gamePaused = false;
    
    // Update UI
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    pauseBtn.textContent = '⏸️ Pause';
    changeLevelBtn.style.display = 'none'; // Hide change level button after game starts
    gameOverDiv.style.display = 'none';
    levelSelectionDiv.style.display = 'none';
    
    drawGame();
    
    // Start game loop with selected difficulty speed
    if (gameLoop) clearInterval(gameLoop);
    startGameLoop();
}

function startGameLoop() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, gameSpeed);
}

function pauseGame() {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? '▶️ Resume' : '⏸️ Pause';
    
    if (!gamePaused) {
        drawGame();
    } else {
        // Visual feedback when paused
        canvas.style.opacity = '0.7';
        canvas.style.filter = 'blur(2px)';
    }
    
    if (!gamePaused) {
        canvas.style.opacity = '1';
        canvas.style.filter = 'none';
    }
}

function gameOver() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoop);
    
    // Reset canvas style
    canvas.style.opacity = '1';
    canvas.style.filter = 'none';
    
    // Update UI
    pauseBtn.style.display = 'none';
    changeLevelBtn.style.display = 'none';
    startBtn.style.display = 'none';
    finalScoreElement.textContent = score;
    gameOverDiv.style.display = 'block';
    
    // Show level selection again after game over
    setTimeout(() => {
        levelSelectionDiv.style.display = 'block';
    }, 1000);
}

function restartGame() {
    gameOverDiv.style.display = 'none';
    levelSelectionDiv.style.display = 'block';
    startBtn.style.display = 'inline-block';
}

function changeLevel() {
    if (gameRunning && !gamePaused) {
        pauseGame();
    }
    levelSelectionDiv.style.display = 'block';
    startBtn.style.display = 'inline-block';
    changeLevelBtn.style.display = 'none';
    
    // Highlight current selected level
    levelButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.level === currentDifficulty) {
            btn.classList.add('selected');
        }
    });
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    const key = e.key;
    
    // Prevent default behavior for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
    }
    
    // Update direction (prevent opposite direction)
    if (key === 'ArrowUp' && direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        nextDirection = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        nextDirection = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        nextDirection = { x: 1, y: 0 };
    } else if (key === ' ') {
        // Space bar to pause
        pauseGame();
    }
});

// Button controls
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', restartGame);
changeLevelBtn.addEventListener('click', changeLevel);

// Touch controls
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

upBtn.addEventListener('click', () => {
    if (gameRunning && direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
    }
});

downBtn.addEventListener('click', () => {
    if (gameRunning && direction.y === 0) {
        nextDirection = { x: 0, y: 1 };
    }
});

leftBtn.addEventListener('click', () => {
    if (gameRunning && direction.x === 0) {
        nextDirection = { x: -1, y: 0 };
    }
});

rightBtn.addEventListener('click', () => {
    if (gameRunning && direction.x === 0) {
        nextDirection = { x: 1, y: 0 };
    }
});

// Touch swipe controls for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: false });

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0 && direction.x === 0) {
                // Swipe right
                nextDirection = { x: 1, y: 0 };
            } else if (deltaX < 0 && direction.x === 0) {
                // Swipe left
                nextDirection = { x: -1, y: 0 };
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0 && direction.y === 0) {
                // Swipe down
                nextDirection = { x: 0, y: 1 };
            } else if (deltaY < 0 && direction.y === 0) {
                // Swipe up
                nextDirection = { x: 0, y: -1 };
            }
        }
    }
}

// Set initial level display and load high score
highScore = loadHighScore(currentDifficulty);
highScoreElement.textContent = highScore;
currentLevelElement.textContent = difficultyLevels[currentDifficulty].name;

// Initial draw
drawGame();

