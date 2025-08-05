const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.5;
let jumpStrength = -15;
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

function drawBackground() {
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
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
platforms = [];

// Platforma startowa - zawsze pod żabą
const centerX = canvas.width / 2 - platformWidth / 2;
const centerY = canvas.height / 2 + 50;
platforms.push(createPlatform(centerX, centerY, false));

// Grunt (na dole ekranu)
platforms.push(createPlatform(0, canvas.height - 20, true));

// Pozostałe platformy
for (let i = 1; i <= 10; i++) {
const randomX = Math.random() * (canvas.width - platformWidth);
const randomY = canvas.height - i * 100;
platforms.push(createPlatform(randomX, randomY));
}
}

function drawPlatforms() {
ctx.fillStyle = "#8B4513";
platforms.forEach(p => {
ctx.fillRect(p.x, p.y, p.width, p.height);
});
}

function updateFrog() {
// Jeśli nie sterujemy pochylaniem ani dotykiem – wtedy klawiatura
if (!('ontouchstart' in window)) {
if (keys.left) {
frog.vx = -5;
} else if (keys.right) {
frog.vx = 5;
} else {
frog.vx = 0;
}
}


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

if (frog.y > window.innerHeight + 100) {
frog.vx = 0;
frog.vy = 0;
frog.x = window.innerWidth / 2;
frog.y = window.innerHeight / 2;

// Zresetuj platformy
generateInitialPlatforms();

// Nie resetujemy punktów – można grać dalej
}

// Usuń platformy, które wypadły poza ekran
platforms = platforms.filter(p => p.y < canvas.height + 100);

// Dodawaj nowe platformy powyżej, jeśli potrzeba
while (platforms.length < 20) {
const highestPlatformY = platforms.reduce((minY, p) => Math.min(minY, p.y), canvas.height);
const newPlatformY = highestPlatformY - 100;
const newPlatformX = Math.random() * (canvas.width - platformWidth);
platforms.push(createPlatform(newPlatformX, newPlatformY));
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

// Dotyk – działa na telefonie
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

// Klawiatura – dla komputera
window.addEventListener("keydown", (e) => {
if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
keys.left = true;
}
if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
keys.right = true;
}
if ((e.key === "w" || e.key === "W" || e.key === " " || e.key === "ArrowUp") && frog.onPlatform) {
frog.vy = jumpStrength;
}
});

window.addEventListener("keyup", (e) => {
if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
keys.left = false;
}
if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
keys.right = false;
}
});

// Akcelerometr – sterowanie pochylaniem telefonu
if (window.DeviceOrientationEvent) {
window.addEventListener("deviceorientation", (e) => {
// Gamma: przechylenie w lewo/prawo (-90 do 90)
const tilt = e.gamma;

if (tilt < -5) {
frog.vx = -5;
} else if (tilt > 5) {
frog.vx = 5;
} else {
frog.vx = 0;
}
});
}


generateInitialPlatforms();
gameLoop();
