const canvas = document.getElementById('CanvasJS');
const ctx = canvas.getContext("2d");

let width, height;
let mouse = { x: 0, y: 0 };
let time = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / width) - 0.5;
    mouse.y = (e.clientY / height) - 0.5;
});

resize();

class Cloud {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.4;
        this.speed = 0.2 + Math.random() * 0.5;
        this.size = 20 + Math.random() * 40;
    }
    update() {
        this.x += this.speed;
        if (this.x - this.size * 2 > width) this.x = -this.size * 2;
    }
    draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.6, this.y - this.size * 0.3, this.size * 0.7, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 1.2, this.y, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Firefly {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = height * 0.6 + Math.random() * (height * 0.4);
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = 1 + Math.random() * 2;
        this.life = Math.random();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life += 0.01;
        if (this.x < 0 || this.x > width || this.y < height * 0.6 || this.y > height) this.reset();
    }
    draw() {
        const opacity = Math.abs(Math.sin(this.life));
        ctx.fillStyle = `rgba(250, 240, 100, ${opacity * 0.8})`;
        ctx.shadowBlur = 10 * opacity;
        ctx.shadowColor = "yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

const clouds = Array.from({ length: 8 }, () => new Cloud());
const fireflies = Array.from({ length: 25 }, () => new Firefly());

function drawMountain(x, y, w, h, color, SnowLayer = true, flip = false) {
    const parallaxX = x + mouse.x * (h / 10);
    const direction = flip ? 1 : -1;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(parallaxX, y);
    ctx.lineTo(parallaxX + w / 2, y + (h * direction));
    ctx.lineTo(parallaxX + w, y);
    ctx.fill();

    if (SnowLayer) {
        ctx.beginPath();
        ctx.fillStyle = flip ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.9)";
        ctx.moveTo(parallaxX + w / 2 - w * 0.1, y + (h * 0.8 * direction));
        ctx.lineTo(parallaxX + w / 2, y + (h * direction));
        ctx.lineTo(parallaxX + w / 2 + w * 0.1, y + (h * 0.8 * direction));
        ctx.lineTo(parallaxX + w / 2, y + (h * 0.7 * direction));
        ctx.fill();
    }
}

function drawTree(x, y, scale = 1, flip = false) {
    const px = x + mouse.x * (40 * scale);
    const py = y + mouse.y * (10);
    const direction = flip ? -1 : 1;
    
    // Trunk
    ctx.fillStyle = flip ? "rgba(69, 26, 3, 0.3)" : "#451a03";
    ctx.fillRect(px - 5 * scale, py, 10 * scale, 20 * scale * direction);

    // Leaves
    ctx.fillStyle = flip ? "rgba(6, 78, 59, 0.3)" : "#064e3b";
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(px - 20 * scale, py - (10 * i) * scale * direction);
        ctx.lineTo(px + 20 * scale, py - (10 * i) * scale * direction);
        ctx.lineTo(px, py - (25 + 15 * i) * scale * direction);
        ctx.fill();
    }
}

function drawLandscape(isReflection = false) {
    const yBase = height * 0.75;
    
    if (!isReflection) {
        // Distant Mountains
        drawMountain(width * -0.1, yBase, width * 0.5, height * 0.4, "#312e81", true);
        drawMountain(width * 0.6, yBase, width * 0.6, height * 0.5, "#1e1b4b", true);
        drawMountain(width * 0.2, yBase, width * 0.6, height * 0.6, "#3730a3", true);
    } else {
        // Mirrored Mountains
        ctx.save();
        ctx.globalAlpha = 0.4;
        drawMountain(width * -0.1, yBase, width * 0.5, height * 0.4, "#312e81", true, true);
        drawMountain(width * 0.6, yBase, width * 0.6, height * 0.5, "#1e1b4b", true, true);
        drawMountain(width * 0.2, yBase, width * 0.6, height * 0.6, "#3730a3", true, true);
        ctx.restore();
    }
}

function drawLake() {
    const lakeTop = height * 0.75;
    
    // Draw Reflection
    drawLandscape(true);
    
    // Water Overlay
    const gradient = ctx.createLinearGradient(0, lakeTop, 0, height);
    gradient.addColorStop(0, "rgba(14, 165, 233, 0.6)");
    gradient.addColorStop(1, "rgba(2, 132, 199, 0.8)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, lakeTop);
    
    for (let x = 0; x <= width; x += 10) {
        const wave = Math.sin(x * 0.05 + time * 2) * 2;
        ctx.lineTo(x, lakeTop + wave);
    }
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    // Specular Highlights
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yPos = lakeTop + 20 + i * 40;
        ctx.moveTo(0, yPos);
        for (let x = 0; x <= width; x += 40) {
            const wave = Math.sin(x * 0.02 + time + i) * 10;
            ctx.lineTo(x, yPos + wave);
        }
        ctx.stroke();
    }
}

function animate() {
    time += 0.016;
    ctx.clearRect(0, 0, width, height);

    // Sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, "#0f172a");
    skyGradient.addColorStop(0.5, "#1e1b4b");
    skyGradient.addColorStop(1, "#312e81");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Moon
    ctx.fillStyle = "#fef08a";
    ctx.shadowBlur = 80;
    ctx.shadowColor = "rgba(254, 240, 138, 0.4)";
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    clouds.forEach(c => {
        c.update();
        c.draw();
    });

    drawLandscape(false);
    drawLake();

    // Fireflies
    fireflies.forEach(f => {
        f.update();
        f.draw();
    });

    // Trees
    drawTree(width * 0.1, height * 0.82, 1.2);
    drawTree(width * 0.9, height * 0.78, 0.8);
    drawTree(width * 0.75, height * 0.92, 1.8);

    requestAnimationFrame(animate);
}

animate();
