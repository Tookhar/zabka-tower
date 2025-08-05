
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.5;
let jumpStrength = -10;
let platformWidth = 80;
let platformHeight = 10;

let score = 0;
let platforms = [];
let keys = { left: false, right: false };

let frog = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 40,
    height: 40,
    color: "green",
    vx: 0,
    vy: 0,
    onPlatform: false
};

const background = new Image();
background.src = "https://i.imgur.com/fkR9HM8.jpg"; // błękitne niebo z chmurkami

function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawFrog() {
    ctx.fillStyle = frog.color;
    ctx.beginPath();
    ctx.ellipse(frog.x + frog.width / 2, frog.y + frog.height / 2, 20, 20, 0, 0, Math.PI * 2);
    ctx.fill();
}

function createPlatform(x, y, isGround = false) {
    return { x, y, width: platformWidth, height: platformHeight, isGround };
}

function generateInitialPlatforms() {
    platforms.push(createPlatform(0, canvas.height - 20, true)); // GRUNT
    for (let i = 1; i <= 10; i++) {
        platforms.push(createPlatform(Math.random() * (canvas.width - platformWidth), canvas.height - i * 100));
    }
}

function drawPlatforms() {
    ctx.fillStyle = "#8B4513";
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

function updateFrog() {
    frog.vy += gravity;
    frog.y += frog.vy;
    frog.x += frog.vx;

    if (frog.x < 0) frog.x = 0;
    if (frog.x + frog.width > canvas.width) frog.x = canvas.width - frog.width;

    frog.onPlatform = false;
    platforms.forEach(p => {
        if (
            frog.vy > 0 &&
            frog.x + frog.width > p.x &&
            frog.x < p.x + p.width &&
            frog.y + frog.height > p.y &&
            frog.y + frog.height < p.y + p.height + 5
        ) {
            frog.vy = jumpStrength;
            frog.onPlatform = true;
            if (!p.isGround) score += 10;
        }
    });

    if (frog.y < canvas.height / 2) {
        let dy = canvas.height / 2 - frog.y;
        frog.y = canvas.height / 2;
        platforms.forEach(p => p.y += dy);
        score += Math.floor(dy / 10);
    }

    if (frog.y > canvas.height + 100) {
        alert("Koniec gry! Twój wynik: " + score);
        document.location.reload();
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText("Wynik: " + score, 20, 40);
    ctx.fillText("Wynik: " + score, 20, 40);
}

function gameLoop() {
    drawBackground();
    drawPlatforms();
    updateFrog();
    drawFrog();
    drawScore();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener("touchstart", (e) => {
    const x = e.touches[0].clientX;
    if (x < canvas.width / 2) {
        frog.vx = -5;
    } else {
        frog.vx = 5;
    }
    if (frog.onPlatform) {
        frog.vy = jumpStrength;
    }
});

canvas.addEventListener("touchend", () => {
    frog.vx = 0;
});

generateInitialPlatforms();
gameLoop();
