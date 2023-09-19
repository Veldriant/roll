const basket = document.getElementById("basket");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const life1 = document.getElementById("life1");
const life2 = document.getElementById("life2");
const life3 = document.getElementById("life3");
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const pauseOverlay = document.getElementById("pause-overlay");
const resumeButton = document.getElementById("resume-button");
const countdownDisplay = document.getElementById("countdown");

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
let countdownTimer;
let isGameOver = false;
let isPaused = false;
let isResuming = false; // Флаг для отслеживания продолжения игры после паузы

function updateScore() {
    scoreDisplay.textContent = "Счет: " + score;
}

function updateLives() {
    life1.src = lives >= 1 ? "life.svg" : "lost-life.svg";
    life2.src = lives >= 2 ? "life.svg" : "lost-life.svg";
    life3.src = lives >= 3 ? "life.svg" : "lost-life.svg";
}

function gameOver() {
    isGameOver = true;
    finalScoreDisplay.textContent = score; // Показываем счет после окончания игры
    gameOverDisplay.style.display = "block";
    clearInterval(gameInterval);
    clearInterval(countdownTimer);
    document.removeEventListener("mousemove", moveBasket); // Удаляем обработчик событий после завершения игры

    // Удаляем все фрукты из контейнера
    const fruits = document.querySelectorAll(".fruit");
    fruits.forEach(fruit => {
        gameContainer.removeChild(fruit);
    });

    if (lives <= 0) {
        finalScoreDisplay.textContent =  score;
    }
}


function pauseGame() {
    isPaused = true;
    clearInterval(gameInterval);

    // Отображаем окно паузы
    pauseOverlay.style.display = "flex";

    let countdown = 3; // Обратный отсчет перед продолжением игры

    countdownDisplay.style.display = "block";
    countdownDisplay.textContent = countdown;

    countdownTimer = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownTimer);
            countdownDisplay.style.display = "none";
            resumeButton.focus(); // Установка фокуса на кнопку "Продолжить"
        }
    }, 1000);
}

function resumeGame() {
    if (isPaused) {
        pauseOverlay.style.display = "none";
        isPaused = false;
        if (!isResuming) {
            // Если игра не в процессе возобновления, запустить игровой интервал
            gameInterval = setInterval(createFruit, 1500);
            document.addEventListener("mousemove", moveBasket);
        }
        isResuming = false;
    }
}

updateScore();
updateLives();

function moveBasket(event) {
    if (isGameOver || isPaused) return; // Если игра окончена или на паузе, не перемещать корзину

    const x = event.clientX;
    const containerLeft = gameContainer.getBoundingClientRect().left;
    basket.style.left = x - containerLeft - basketWidth / 2 + "px";
}

function createFruit() {
    if (isGameOver || isPaused) return; // Если игра окончена или на паузе, не создавать новые фрукты

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

resumeButton.addEventListener("click", () => {
    if (isPaused) {
        isResuming = true;
        resumeGame();
    }
});

gameInterval = setInterval(createFruit, 1500);
document.addEventListener("mousemove", moveBasket);
