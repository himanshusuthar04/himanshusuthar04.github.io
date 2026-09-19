const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const gameStatus = document.getElementById("gameStatus");

const GRID_SIZE = 30;
const CELL_SIZE = canvas.width / GRID_SIZE;

let snake;
let food;
let direction;
let score;
let highScore = 0;

let gameTimer;


// -----------------------------
// INITIALIZE GAME
// -----------------------------

function initializeGame() {

    snake = [
        { x: 15, y: 15 },
        { x: 14, y: 15 },
        { x: 13, y: 15 },
        { x: 12, y: 15 }
    ];

    direction = {
        x: 1,
        y: 0
    };

    score = 0;

    createFood();

    updateScore();

    gameStatus.textContent = "PLAYING";
}


// -----------------------------
// CREATE FOOD
// -----------------------------

function createFood() {

    let position;

    do {

        position = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

    } while (
        snake.some(
            segment =>
                segment.x === position.x &&
                segment.y === position.y
        )
    );

    food = position;
}


// -----------------------------
// DRAW GRID
// -----------------------------

function drawGrid() {

    ctx.strokeStyle = "rgba(255,255,255,0.025)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID_SIZE; i++) {

        const position = i * CELL_SIZE;

        ctx.beginPath();

        ctx.moveTo(position, 0);
        ctx.lineTo(position, canvas.height);

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(0, position);
        ctx.lineTo(canvas.width, position);

        ctx.stroke();
    }
}


// -----------------------------
// DRAW SNAKE
// -----------------------------

function drawSnake() {

    snake.forEach((segment, index) => {

        ctx.fillStyle =
            index === 0
                ? "#ffffff"
                : "#7cffc4";

        ctx.beginPath();

        ctx.roundRect(
            segment.x * CELL_SIZE + 2,
            segment.y * CELL_SIZE + 2,
            CELL_SIZE - 4,
            CELL_SIZE - 4,
            5
        );

        ctx.fill();
    });
}


// -----------------------------
// DRAW FOOD
// -----------------------------

function drawFood() {

    const centerX =
        food.x * CELL_SIZE +
        CELL_SIZE / 2;

    const centerY =
        food.y * CELL_SIZE +
        CELL_SIZE / 2;

    ctx.fillStyle = "#ff5c8a";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        CELL_SIZE * 0.25,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// -----------------------------
// DRAW EVERYTHING
// -----------------------------

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#060a10";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawGrid();

    drawFood();

    drawSnake();
}


// -----------------------------
// FIND BEST DIRECTION
// -----------------------------

function findBestDirection() {

    const head = snake[0];

    const possibleDirections = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];


    let bestDirection = direction;

    let bestDistance = Infinity;


    for (const newDirection of possibleDirections) {

        // Don't reverse directly into the body
        if (
            newDirection.x === -direction.x &&
            newDirection.y === -direction.y
        ) {
            continue;
        }


        const nextX =
            head.x + newDirection.x;

        const nextY =
            head.y + newDirection.y;


        // Wall collision
        if (
            nextX < 0 ||
            nextX >= GRID_SIZE ||
            nextY < 0 ||
            nextY >= GRID_SIZE
        ) {
            continue;
        }


        // Body collision
        const collision =
            snake.some(
                segment =>
                    segment.x === nextX &&
                    segment.y === nextY
            );

        if (collision) {
            continue;
        }


        const distance =
            Math.abs(food.x - nextX) +
            Math.abs(food.y - nextY);


        if (distance < bestDistance) {

            bestDistance = distance;

            bestDirection = newDirection;
        }
    }


    direction = bestDirection;
}


// -----------------------------
// MOVE SNAKE
// -----------------------------

function moveSnake() {

    findBestDirection();

    const head = snake[0];


    const newHead = {

        x: head.x + direction.x,

        y: head.y + direction.y

    };


    // Wall collision
    if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
    ) {

        restartGame();

        return;
    }


    // Body collision
    const hitBody =
        snake.some(
            segment =>
                segment.x === newHead.x &&
                segment.y === newHead.y
        );


    if (hitBody) {

        restartGame();

        return;
    }


    snake.unshift(newHead);


    // Food eaten
    if (
        newHead.x === food.x &&
        newHead.y === food.y
    ) {

        score++;

        if (score > highScore) {

            highScore = score;
        }

        createFood();

        updateScore();

    } else {

        snake.pop();
    }


    draw();
}


// -----------------------------
// SCORE
// -----------------------------

function updateScore() {

    scoreElement.textContent = score;

    highScoreElement.textContent = highScore;
}


// -----------------------------
// RESTART
// -----------------------------

function restartGame() {

    gameStatus.textContent = "RESTARTING...";

    clearInterval(gameTimer);


    setTimeout(() => {

        initializeGame();

        draw();

        startGame();

    }, 500);
}


// -----------------------------
// START
// -----------------------------

function startGame() {

    gameStatus.textContent = "PLAYING";

    gameTimer = setInterval(
        moveSnake,
        110
    );
}


// -----------------------------
// START AUTOMATICALLY
// -----------------------------

initializeGame();

draw();

startGame();