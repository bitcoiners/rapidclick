// Global variables
let canvas;
let ctx;
let score = 0;
let timeLeft = 30;
let gameActive = false;
let highScore = 0;
let target = {
    x: 0,
    y: 0,
    radius: 30
};
let gameInterval = null;
let timerInterval = null;

// Initialize game on page load
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    fetchHighScore();
    
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    canvas.addEventListener('click', handleCanvasClick);
}

// Fetch high score from backend
function fetchHighScore() {
    fetch('/api/highscore')
        .then(response => response.json())
        .then(data => {
            highScore = data.score || 0;
            document.getElementById('highscore').textContent = highScore;
        })
        .catch(error => {
            console.error('Error fetching high score:', error);
            document.getElementById('highscore').textContent = 'Error';
        });
}

// Submit score to backend
function submitScore(finalScore) {
    fetch('/api/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: finalScore })
    })
        .then(response => response.json())
        .then(data => {
            if (data.isNewHighScore) {
                document.getElementById('highScoreMessage').style.display = 'block';
                highScore = data.highScore;
                document.getElementById('highscore').textContent = highScore;
            } else {
                document.getElementById('highScoreMessage').style.display = 'none';
            }
            document.getElementById('finalHighScore').textContent = highScore;
        })
        .catch(error => {
            console.error('Error submitting score:', error);
        });
}

// Start the game
function startGame() {
    score = 0;
    timeLeft = 30;
    gameActive = true;
    
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timeLeft;
    
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    
    canvas.classList.add('active');
    
    spawnTarget();
    
    gameInterval = setInterval(updateGame, 16);
    timerInterval = setInterval(updateTimer, 1000);
}

// Spawn target at random position
function spawnTarget() {
    const padding = target.radius;
    target.x = Math.random() * (canvas.width - padding * 2) + padding;
    target.y = Math.random() * (canvas.height - padding * 2) + padding;
}

// Draw target on canvas
function drawTarget() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#CC0000';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    
    // Draw inner circle for bullseye effect
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.closePath();
}

// Main game loop
function updateGame() {
    if (!gameActive) return;
    
    drawTarget();
    
    if (timeLeft <= 0) {
        endGame();
    }
}

// Handle canvas click
function handleCanvasClick(event) {
    if (!gameActive) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const distance = Math.sqrt(
        Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)
    );
    
    if (distance <= target.radius) {
        score++;
        document.getElementById('score').textContent = score;
        spawnTarget();
    }
}


// Update timer
function updateTimer() {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

// End the game
function endGame() {
    gameActive = false;
    
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.classList.remove('active');
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').style.display = 'block';
    
    submitScore(score);
}

// Restart the game
function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    startGame();
}

// Initialize on page load
window.addEventListener('load', initGame);
