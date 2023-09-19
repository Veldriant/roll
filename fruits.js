const basket = document.getElementById("basket");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const lifeElements = [document.getElementById("life1"), document.getElementById("life2"), document.getElementById("life3")];
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");

const fruitTypes = [
    { name: "skovoroda.svg", isGood: true, width: 50, height: 50 },
    { name: "telephone.svg", isGood: true, width: 60, height: 60 },
    { name: "t-shirt.svg", isGood: true, width: 60, height: 60 },
    { name: "virus.svg", isGood: false, width: 60, height: 60 }
];
const basketWidth = 100;
const basketHeight = 40;

let score = 0;
let lives = 3;
let gameInterval;
let isGameOver = false;
let isGameStarted = true;
let isWindowBlurred = false;

const basketSpeed = 10;
let basketPositionX = gameContainer.clientWidth / 2 - basketWidth / 2;

let leftPressed = false;
let rightPressed = false;

function moveBasket() {
    if (isGameOver || !isGameStarted) return;

    if (leftPressed && basketPositionX > 0) {
        basketPositionX -= basketSpeed;
        basket.style.backgroundImage = "url(./left.svg)";
        basket.style.left = basketPositionX + "px";
        requestAnimationFrame(moveBasket);
    } else if (rightPressed && basketPositionX + basketWidth < gameContainer.clientWidth) {
        basketPositionX += basketSpeed;
        basket.style.backgroundImage = "url(./right.svg)";
        basket.style.left = basketPositionX + "px";
        requestAnimationFrame(moveBasket);
    }
}

function stopBasket() {
    if (!leftPressed && !rightPressed) {
        basket.style.backgroundImage = "url(./left.svg)";
    }
}

function updateScore() {
    scoreDisplay.textContent = "Счет: " + score;
}

function updateLives() {
    for (let i = 0; i < 3; i++) {
        lifeElements[i].src = lives > i ? "life.svg" : "lost-life.svg";
    }
}

function gameOver() {
    isGameOver = true;
    finalScoreDisplay.textContent = score;
    gameOverDisplay.style.display = "block";
    clearInterval(gameInterval);
    document.querySelectorAll(".fruit").forEach(fruit => gameContainer.removeChild(fruit));
    if (lives <= 0) {
        finalScoreDisplay.textContent = score;
    }
}

function createFruit() {
    if (isGameOver || !isGameStarted || isWindowBlurred) return;

    const fruitImage = document.createElement("img");
    const randomFruitTypeIndex = Math.floor(Math.random() * fruitTypes.length);
    const fruitType = fruitTypes[randomFruitTypeIndex];
    fruitImage.src = fruitType.name;
    fruitImage.alt = "Фрукт";
    fruitImage.classList.add("fruit");

    const leftPosition = Math.random() * (gameContainer.clientWidth - fruitType.width);
    fruitImage.style.left = leftPosition + "px";
    fruitImage.style.width = fruitType.width + "px";
    fruitImage.style.height = fruitType.height + "px";
    gameContainer.appendChild(fruitImage);

    const fallInterval = setInterval(() => {
        if (isWindowBlurred) return;
        const top = fruitImage.offsetTop;
        if (top >= gameContainer.clientHeight) {
            clearInterval(fallInterval);
            gameContainer.removeChild(fruitImage);
            if (fruitType.isGood) {
                lives--;
                updateLives();
                if (lives <= 0) {
                    gameOver();
                }
            }
        } else {
            fruitImage.style.top = top + 2 + "px";
            const fruitRect = fruitImage.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();
            if (
                fruitRect.bottom >= basketRect.top &&
                fruitRect.right >= basketRect.left &&
                fruitRect.left <= basketRect.right
            ) {
                gameContainer.removeChild(fruitImage);
                if (fruitType.isGood) {
                    score++;
                    updateScore();
                } else {
                    lives--;
                    updateLives();
                    if (lives <= 0) {
                        gameOver();
                    }
                }
            }
        }
    }, 10);
}

updateScore();
updateLives();

gameInterval = setInterval(createFruit, 1500);

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && !rightPressed) {
        leftPressed = true;
        rightPressed = false;
        moveBasket();
    } else if (event.key === "ArrowRight" && !leftPressed) {
        rightPressed = true;
        leftPressed = false;
        moveBasket();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
        stopBasket();
    } else if (event.key === "ArrowRight") {
        rightPressed = false;
        stopBasket();
    }
});

window.addEventListener("blur", () => {
    isWindowBlurred = true;
    if (!isGameOver && isGameStarted) {
        clearInterval(gameInterval);
    }
});

window.addEventListener("focus", () => {
    if (isWindowBlurred && isGameStarted) {
        isWindowBlurred = false;
        gameInterval = setInterval(createFruit, 1500);
    }
});

