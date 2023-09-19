const basket = document.getElementById("basket");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const life1 = document.getElementById("life1");
const life2 = document.getElementById("life2");
const life3 = document.getElementById("life3");
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
let isGameStarted = true; // Начало игры
let isWindowBlurred = false; // Фокус у страницы


let prevX = 0;




// Обработчик события ухода фокуса со страницы
window.addEventListener("blur", () => {
    isWindowBlurred = true;
    if (!isGameOver && isGameStarted) {
        clearInterval(gameInterval);
    }
});

// Обработчик события возврата фокуса на страницу
window.addEventListener("focus", () => {
    if (isWindowBlurred && isGameStarted) {
        isWindowBlurred = false;
        gameInterval = setInterval(createFruit, 1500);
    }
});


document.addEventListener("mousemove", (event) => {
  const currentX = event.clientX;

  if (currentX > prevX) {
    // Мышь движется вправо
    basket.style.backgroundImage = "url(./right.svg)";
  } else if (currentX < prevX) {
    // Мышь движется влево
    basket.style.backgroundImage = "url(./left.svg)";
  }

  prevX = currentX;
});











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
    finalScoreDisplay.textContent = score;
    gameOverDisplay.style.display = "block";
    clearInterval(gameInterval);

    const fruits = document.querySelectorAll(".fruit");
    fruits.forEach(fruit => {
        gameContainer.removeChild(fruit);
    });

    if (lives <= 0) {
        finalScoreDisplay.textContent = score;
    }
}

function moveBasket(event) {
    if (isGameOver || !isGameStarted) return;

    const x = event.clientX;
    const containerLeft = gameContainer.getBoundingClientRect().left;
    basket.style.left = x - containerLeft - basketWidth / 2 + "px";
}

function createFruit() {
    if (isGameOver || !isGameStarted) return;

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
document.addEventListener("mousemove", moveBasket);
