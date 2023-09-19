const basket = document.getElementById("basket");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");

let score = 0;

function updateScore() {
    scoreDisplay.textContent = "Счет: " + score;
}

updateScore();

function moveBasket(event) {
    const x = event.clientX;
    const containerLeft = gameContainer.getBoundingClientRect().left;
    basket.style.left = x - containerLeft - basket.clientWidth / 2 + "px";
}

function createFruit() {
    const newFruit = document.createElement("div");
    newFruit.classList.add("fruit");
    newFruit.style.left = Math.random() * (400 - 20) + "px";
    gameContainer.appendChild(newFruit);

    const fallInterval = setInterval(() => {
        const top = newFruit.offsetTop;
        if (top >= 400) {
            clearInterval(fallInterval);
            gameContainer.removeChild(newFruit);
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

setInterval(createFruit, 1500); 

document.addEventListener("mousemove", moveBasket);
