const basket = document.getElementById("basket");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");

let score = 0;
let lives = 3;
let gameInterval;
let isGameOver = false;

function updateScore() {
    scoreDisplay.textContent = "Счет: " + score;
}

function updateLives() {
    livesDisplay.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heartImg = document.createElement('img');
        heartImg.src = 'heart.png';
        heartImg.alt = 'Жизнь';
        livesDisplay.appendChild(heartImg);
    }
}

function gameOver() {
    isGameOver = true;
    gameOverDisplay.style.display = "block";
    finalScoreDisplay.textContent = score;
    clearInterval(gameInterval);
    document.removeEventListener("mousemove", moveBasket); // Удаляем обработчик событий после завершения игры

    // Удаляем все фрукты из контейнера
    const fruits = document.querySelectorAll(".fruit");
    fruits.forEach(fruit => {
        gameContainer.removeChild(fruit);
    });
}

updateScore();
updateLives();

function moveBasket(event) {
    if (isGameOver) return; // Если игра окончена, не перемещать корзину

    const x = event.clientX;
    const containerLeft = gameContainer.getBoundingClientRect().left;
    basket.style.left = x - containerLeft - basket.clientWidth / 2 + "px";
}

function createFruit() {
    if (isGameOver) return; // Если игра окончена, не создавать новые фрукты

    const newFruit = document.createElement("div");
    newFruit.classList.add("fruit");
    newFruit.style.left = Math.random() * (gameContainer.clientWidth - 20) + "px";
    gameContainer.appendChild(newFruit);

    const fallInterval = setInterval(() => {
        const top = newFruit.offsetTop;
        if (top >= gameContainer.clientHeight) {
            clearInterval(fallInterval);
            gameContainer.removeChild(newFruit);
            if (lives > 0) {
                lives--;
                updateLives();
                const heartImages = livesDisplay.getElementsByTagName('img');
                if (heartImages[lives]) {
                    heartImages[lives].classList.add('lost-life');
                }
            } else {
                gameOver();
            }
        } else {
            newFruit.style.top = top + 2 + "px";
            const fruitRect = newFruit.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();
            if (
                fruitRect.bottom >= basketRect.top &&
                fruitRect.right >= basketRect.left &&
                fruitRect.left <= basketRect.right
            ) {
                gameContainer.removeChild(newFruit);
                score++;
                updateScore();
            }
        }
    }, 10);
}

gameInterval = setInterval(createFruit, 1000);

document.addEventListener("mousemove", moveBasket);
