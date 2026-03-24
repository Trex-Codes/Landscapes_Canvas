const canvas = document.getElementById('MainCanvas');
const ctx = canvas.getContext('2d');
let w, h;
let time = 0;

// Smooth Mouse Tracking Physics
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
});

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    w = canvas.width;
    h = canvas.height;
    initParticles();
}
window.addEventListener('resize', resize);

// ==========================================
// PARTICLE SYSTEM (Magical Fireflies)
// ==========================================
let particles = [];
function initParticles() {
    particles = [];
    for(let i=0; i<100; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 1,
            speedY: Math.random() * -2 - 0.5,
            life: Math.random() * 100,
            color: `hsla(${Math.random()*60 + 40}, 100%, 70%, ` // Yellow to greenish glows
        });
    }
}

function drawParticles() {
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life += 1;

        // Gentle wave motion
        p.x += Math.sin(p.life * 0.05) * 0.5;

        // Wrap around
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        let alpha = (Math.sin(p.life * 0.05) * 0.5 + 0.5) * 0.8;
        
        ctx.beginPath();
        ctx.fillStyle = p.color + alpha + ')';
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color + '1)';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    });
}

// ==========================================
// USER'S EXACT SHAPE VECTORS
// ==========================================
function drawSkyBg(ctx) {
    let gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0,"rgba(94, 156, 202, 1)");
    gradient.addColorStop(1,"rgba(82, 161, 220, 1)");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 300, 150);
}
function drawSeaBg(ctx) {
    let gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0,"rgba(82, 161, 220, 1)");
    gradient.addColorStop(1,"rgba(16, 60, 101, 1)");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 300, 150);
}

function pathMountain1(ctx) { ctx.moveTo(15, 125); ctx.bezierCurveTo(45, 70, 105, 165, 130, 100); ctx.bezierCurveTo(225, 25, 115, 165, 250, 65); ctx.lineTo(300, 45); ctx.lineTo(300, 150); ctx.lineTo(0, 150); ctx.lineTo(15, 125); }
function pathMountain2(ctx) { ctx.moveTo(0, 45); ctx.bezierCurveTo(40, 130, 75, 0, 145, 75); ctx.bezierCurveTo(195, 115, 215, -5, 300, 95); ctx.lineTo(300, 150); ctx.lineTo(0, 150); ctx.lineTo(0, 45); }
function pathMountain3(ctx) { ctx.moveTo(0, 95); ctx.bezierCurveTo(55, 85, 70, 145, 95, 65); ctx.bezierCurveTo(225, 165, 115, -45, 300, 150); ctx.lineTo(0, 150); ctx.lineTo(0, 95); }
function pathIsland1(ctx)     { ctx.moveTo(0, 150); ctx.quadraticCurveTo(75, 65, 300, 75); ctx.lineTo(300, 150); ctx.lineTo(0, 150); }
function pathIsland2(ctx)     { ctx.moveTo(300, 75); ctx.lineTo(0, 75); ctx.lineTo(0, 150); ctx.lineTo(300, 150); ctx.lineTo(300, 75); }
function pathIsland3(ctx)     { ctx.moveTo(0, 75); ctx.quadraticCurveTo(200, 65, 300, 150); ctx.lineTo(0, 150); ctx.lineTo(0, 75); }

function renderSkyMid(ctx) {
    drawSkyBg(ctx);
    ctx.beginPath(); ctx.fillStyle = "rgba(153, 132, 39, 1)"; ctx.strokeStyle = "rgba(0,0,0,1)"; ctx.lineWidth = 1;
    ctx.moveTo(160, 75); ctx.lineTo(135, 75); ctx.lineTo(130, 150); ctx.lineTo(170, 150); ctx.lineTo(160, 75); ctx.stroke(); ctx.fill(); ctx.closePath();
    ctx.beginPath(); ctx.fillStyle = "rgba(71, 62, 20, 1)"; ctx.moveTo(130, 150); ctx.lineTo(168, 133); ctx.lineTo(132, 114); ctx.lineTo(163, 95); ctx.lineTo(135, 75); ctx.stroke(); ctx.fill(); ctx.closePath();
    let cocos = [[148,82], [153,75], [140,75]]; ctx.fillStyle = "rgba(234, 189, 127, 1)";
    cocos.forEach(c => { ctx.beginPath(); ctx.arc(c[0], c[1], 10, 0, Math.PI*2); ctx.stroke(); ctx.fill(); ctx.closePath(); });

    let branches = [
        () => { ctx.moveTo(148, 68); ctx.lineTo(120, 85); ctx.lineTo(110, 82); ctx.lineTo(115, 90); ctx.lineTo(102, 101); ctx.lineTo(93, 97); ctx.lineTo(95, 105); ctx.lineTo(85, 115); ctx.bezierCurveTo(65, 135, 65, 70, 148, 68); },
        () => { ctx.moveTo(148, 68); ctx.lineTo(90, 72); ctx.lineTo(92, 67); ctx.lineTo(83, 73); ctx.lineTo(65, 76); ctx.lineTo(64, 70); ctx.lineTo(55, 77); ctx.lineTo(28, 81); ctx.bezierCurveTo(35, 80, 35, 50, 148, 68); },
        () => { ctx.moveTo(148, 68); ctx.lineTo(105, 55); ctx.lineTo(110, 50); ctx.lineTo(93, 52); ctx.lineTo(65, 45); ctx.lineTo(75, 40); ctx.lineTo(53, 42); ctx.lineTo(25, 35); ctx.bezierCurveTo(15, 35, 95, 15, 148, 68); },
        () => { ctx.moveTo(148, 68); ctx.lineTo(170, 60); ctx.lineTo(165, 55); ctx.lineTo(180, 55); ctx.lineTo(200, 48); ctx.lineTo(192, 43); ctx.lineTo(207, 45); ctx.lineTo(265, 35); ctx.bezierCurveTo(265, 35, 185, 15, 148, 68); },
        () => { ctx.moveTo(148, 68); ctx.lineTo(172, 85); ctx.lineTo(180, 80); ctx.lineTo(185, 90); ctx.lineTo(205, 100); ctx.lineTo(205, 92); ctx.lineTo(215, 103); ctx.lineTo(235, 113); ctx.bezierCurveTo(235, 110, 205, 65, 148, 68); }
    ];
    ctx.fillStyle = "rgba(160, 105, 31, 1)";
    branches.forEach((b, idx) => {
        ctx.save(); ctx.translate(148, 68);
        ctx.rotate((Math.sin(time * 0.05 + idx) * 0.08) + (mouseX*0.05)); 
        ctx.translate(-148, -68);
        ctx.beginPath(); b(); ctx.stroke(); ctx.fill(); ctx.closePath(); ctx.restore();
    });
}

function renderIslandMid(ctx) {
    drawSkyBg(ctx);
    ctx.beginPath(); ctx.fillStyle = "rgba(234, 233, 133, 1)"; ctx.strokeStyle = "rgba(155, 154, 60, 1)"; ctx.lineWidth = 4;
    pathIsland2(ctx); ctx.stroke(); ctx.fill(); ctx.closePath();
    ctx.beginPath(); ctx.fillStyle = "rgba(153, 132, 39, 1)"; ctx.strokeStyle = "rgba(0,0,0,1)"; ctx.lineWidth = 1;
    ctx.moveTo(170, 0); ctx.lineTo(130, 0); ctx.lineTo(130, 75); ctx.lineTo(170, 75); ctx.stroke(); ctx.fill(); ctx.closePath();
    ctx.beginPath(); ctx.moveTo(170, 0); ctx.lineTo(170, 75); ctx.stroke(); ctx.closePath();
    ctx.beginPath(); ctx.fillStyle = "rgba(71, 62, 20, 1)";
    ctx.moveTo(130, 75); ctx.lineTo(170, 57); ctx.lineTo(130, 38); ctx.lineTo(170, 19); ctx.lineTo(130, 0); ctx.stroke(); ctx.fill(); ctx.closePath();
}

// ==========================================
// ROW 3: SEAWEEDS (Y=300)
// ==========================================
function renderSeaweed(ctx, pathFn, isBg) {
    drawSeaBg(ctx);
    ctx.save();
    ctx.translate(150, 150); // Pivot at the bottom center of the block
    let sway = Math.sin(time*0.02) * 0.05 + mouseX*0.02;
    ctx.transform(1, 0, sway, 1, 0, 0);
    ctx.translate(-150, -150);

    ctx.beginPath();
	ctx.fillStyle = "rgba(29, 119, 86, 1)";
	ctx.strokeStyle = "rgba(18, 70, 51, 1)";
	ctx.lineWidth = 4;
    pathFn(ctx);
	ctx.stroke(); ctx.fill(); ctx.closePath();
    ctx.restore();
}

// Helper to draw left/right islands with sky bg
function renderIslandSide(ctx, pathFn) {
    drawSkyBg(ctx);
    ctx.beginPath(); 
    ctx.fillStyle = "rgba(234, 233, 133, 1)"; 
    ctx.strokeStyle = "rgba(155, 154, 60, 1)"; 
    ctx.lineWidth = 4;
    pathFn(ctx); 
    ctx.stroke(); ctx.fill(); ctx.closePath();
}

// Matrix Placer
function drawCell(ctx, fn, col, row) {
    ctx.save();
    ctx.translate(col * 300, row * 150);
    // Explicitly clip each puzzle piece so glows don't bleed natively
    ctx.beginPath(); ctx.rect(0, 0, 300, 150); ctx.clip();
    fn(ctx);
    ctx.restore();
}

// Foreground Parallax and Cinematic Vignette removed per user request

// ==========================================
// SCENE COMPOSITION
// ==========================================
function drawScene() {
    // 0. Smooth Physics
    // Ease mouseX towards targetX for buttery cinematic movement
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    ctx.clearRect(0, 0, w, h);
    
    // 1. DYNAMIC SUN & SKY GLOW (Far Background)
    // We draw a massive radial gradient behind everything
    let sunX = w * 0.5 + mouseX * 200;
    let sunY = h * 0.4 + mouseY * 100;
    
    let bgPulse = Math.sin(time * 0.05) * 50;
    let radG = ctx.createRadialGradient(sunX, sunY, 50, sunX, sunY, w*0.6 + bgPulse);
    radG.addColorStop(0, "rgba(255, 255, 230, 1.0)");
    radG.addColorStop(0.1, "rgba(255, 220, 150, 0.8)");
    radG.addColorStop(0.4, "rgba(94, 156, 202, 0.3)"); // Blends into existing sky
    radG.addColorStop(1, "rgba(16, 60, 101, 1)");      // Deep sea dark
    ctx.fillStyle = radG;
    ctx.fillRect(0, 0, w, h);

    // 2. THE USER'S PIVOTAL "ISLAND" PUZZLE
    // Seamlessly fit to cover screen
    const posterW = 900;
    const posterH = 450;
    let scale = Math.max(w / posterW, h / posterH) * 1.1; // 1.1x overscale to allow parallax drifting without showing edges
    
    let offsetX = (w - (posterW * scale)) / 2 + (mouseX * 50);
    let offsetY = (h - (posterH * scale)) / 2 + (mouseY * 20) + 50;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Row 1
    drawCell(ctx, drawSkyBg,   0, 0); 
    drawCell(ctx, renderSkyMid, 1, 0); 
    drawCell(ctx, drawSkyBg,   2, 0); 

    // Row 2
    drawCell(ctx, (c) => renderIslandSide(c, pathIsland1), 0, 1);
    drawCell(ctx, renderIslandMid, 1, 1);
    drawCell(ctx, (c) => renderIslandSide(c, pathIsland3), 2, 1);

    // Row 3
    drawCell(ctx, (c) => renderSeaweed(c, pathMountain1), 0, 2);
    drawCell(ctx, (c) => renderSeaweed(c, pathMountain2), 1, 2);
    drawCell(ctx, (c) => renderSeaweed(c, pathMountain3), 2, 2);
    
    ctx.restore();

    // Removed the white advanced water overlay per user request.

    // 4. MAGICAL FIREFLIES (Interactive Particles)
    drawParticles();
}

// ==========================================
// ENGINE START
// ==========================================
resize();

function animate() {
    time += 1;
    drawScene();
    requestAnimationFrame(animate);
}
animate();