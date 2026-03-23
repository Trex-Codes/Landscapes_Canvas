const canvasTop = document.getElementById('CanvasAll');
const ctxTop = canvasTop.getContext('2d');

const canvasBot = document.getElementById('CanvasDown');
const ctxBot = canvasBot.getContext('2d');

let mouseX = 0;
let mouseY = 0;
let time = 0;

// Track the mouse cursor to drive the interactive elements
window.addEventListener('mousemove', (e) => {
    // Math to normalize input to -1 (left) up to 1 (right)
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

// Calculate Canvas sizing responsively so we don't need hardcoded pixels.
function resize() {
    canvasTop.width = canvasTop.clientWidth;
    canvasTop.height = canvasTop.clientHeight;
    canvasBot.width = canvasBot.clientWidth;
    canvasBot.height = canvasBot.clientHeight;
}
window.addEventListener('resize', resize);
resize();

function drawSky(ctx, w, h) {
    let skyG = ctx.createLinearGradient(0, Math.min(85, h*0.1), 0, h);
    skyG.addColorStop(0,"rgba(60, 24, 239, 0.8)");
    skyG.addColorStop(1,"rgba(234, 237, 238, 0.5)");
    ctx.fillStyle = skyG;
    ctx.fillRect(0, 0, w, h);
}

function drawSun(ctx, w, h) {
    // Sun position linked directly to mouse
    let sunX = w / 2 + mouseX * (w / 2 * 0.8);
    let sunY = h * 0.25 + mouseY * (h * 0.15); 

    // Create a massive glowing aura around it
    let grad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 150);
    grad.addColorStop(0, "rgba(255, 255, 230, 0.9)");
    grad.addColorStop(0.3, "rgba(200, 150, 255, 0.4)");
    grad.addColorStop(1, "rgba(60, 24, 239, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 150, 0, Math.PI*2);
    ctx.fill();

    // Solid core of the sun
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 15, 0, Math.PI*2);
    ctx.fill();
    
    // Return coordinates so we can draw bright specular water reflections underneath it
    return { x: sunX, y: sunY };
}

function drawClouds(ctx, w, h) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    let pXC = mouseX * -5;
    
    for(let i=0; i<5; i++) {
        let speed = 0.5 + i * 0.2;
        let cx = w + 150 - ((time * speed + i * w/5) % (w + 300)) + pXC;
        let cy = h * 0.15 + (i * 25);
        let scale = 0.6 + i * 0.1;
        
        ctx.beginPath();
        ctx.arc(cx, cy, 40 * scale, 0, Math.PI*2);
        ctx.arc(cx + 50 * scale, cy - 15 * scale, 50 * scale, 0, Math.PI*2);
        ctx.arc(cx + 100 * scale, cy, 40 * scale, 0, Math.PI*2);
        ctx.fill();
    }
}

function drawMountains(ctx, w, h, isReflection) {
    let pX_back = mouseX * -20;
    let pY_back = mouseY * -10;
    
    let yBase = h;
    let yPeak = h * 0.333; // Exactly 33.3% like original layout

    // Layer 1 (Darker / Far back)
    ctx.save();
    ctx.translate(pX_back, pY_back);
    ctx.fillStyle = "rgba(124, 75, 231, 0.7)";
    ctx.beginPath();
    [0.2, 0.6, 1.0].forEach(p => {
        ctx.moveTo(w * (p - 0.2), yBase);
        ctx.lineTo(w * p, yPeak);
        ctx.lineTo(w * (p + 0.2), yBase);
    });
    ctx.fill();
    ctx.restore();

    // Layer 2 (Lighter / Forward)
    let pX_front = mouseX * -40;
    let pY_front = mouseY * -15;

    ctx.save();
    ctx.translate(pX_front, pY_front);

    ctx.fillStyle = "rgba(83, 14, 235, 0.7)";
    ctx.beginPath();
    [-0.2, 0.2, 0.6, 1.0].forEach(p => { 
        let actualP = p + 0.2; 
        ctx.moveTo(w * (actualP - 0.2), yBase);
        ctx.lineTo(w * actualP, yPeak);
        ctx.lineTo(w * (actualP + 0.2), yBase);
    });
    ctx.fill();

    // =====================================
    // DYNAMIC LIGHTING HIGHLIGHTS
    // =====================================
    // We adjust the opacity of the faces depending on where the mouse (sun) is.
    let lightBiasLeft = Math.max(0.1, Math.min(1.0, 0.5 - mouseX * 0.7));
    let lightBiasRight = Math.max(0.1, Math.min(1.0, 0.5 + mouseX * 0.7));

    let peaks = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
    
    ctx.strokeStyle = `rgba(184, 161, 234, ${Math.max(lightBiasLeft, lightBiasRight)})`;
    ctx.lineWidth = isReflection ? 0 : 1; 

    peaks.forEach(p => {
        let leftBaseX = w * (p - 0.05); 
        let rightBaseX = w * (p + 0.05); 
        let midY = h * 0.666;
        let midHigh = h * 0.5;

        // Left Face (Brighter when sun is on left (-1))
        ctx.fillStyle = `rgba(208, 189, 249, ${lightBiasLeft})`;
        ctx.beginPath();
        ctx.moveTo(leftBaseX, midHigh);
        ctx.lineTo(w * p, midY);
        ctx.lineTo(w * p, yPeak);
        ctx.lineTo(leftBaseX, midHigh);
        if(!isReflection) ctx.stroke();
        ctx.fill();
        
        // Right Face (Brighter when sun is on right (1))
        ctx.fillStyle = `rgba(184, 161, 234, ${lightBiasRight})`;
        ctx.beginPath();
        ctx.moveTo(w * p, midY);
        ctx.lineTo(rightBaseX, midHigh);
        ctx.lineTo(w * p, yPeak);
        ctx.lineTo(w * p, midY);
        if(!isReflection) ctx.stroke();
        ctx.fill();
    });

    ctx.restore();
}

function drawTop() {
    let w = canvasTop.width;
    let h = canvasTop.height;
    ctxTop.clearRect(0, 0, w, h);
    
    drawSky(ctxTop, w, h);
    
    // We get sun position for the lower canvas reflection alignment
    let sunCoords = drawSun(ctxTop, w, h);
    
    drawClouds(ctxTop, w, h);
    drawMountains(ctxTop, w, h, false);
    
    return sunCoords;
}

function drawBot(sunPos) {
    let w = canvasBot.width;
    let hBot = canvasBot.height;
    let hTop = canvasTop.height;

    ctxBot.clearRect(0, 0, w, hBot);

    // =====================================
    // STEP 1: REAL MIRROR REFLECTION
    // =====================================
    ctxBot.save();
    
    // 1(a). Transform the Context to draw completely Upside-Down.
    // By scaling (1, -1), drawing a point at `y` puts it at `-y`.
    // By translating `(0, -hTop)`, a point drawn exactly at the horizon of original (hTop)
    // ends up exactly at `0` (the top of this canvas). 
    ctxBot.scale(1, -1);
    ctxBot.translate(0, -hTop);

    ctxBot.globalAlpha = 0.8; // Semi-faded reflection
    
    // 1(b). Redraw the exact same assets, which will now automatically render mirrored!
    drawSky(ctxBot, w, hTop);
    drawSun(ctxBot, w, hTop);
    drawClouds(ctxBot, w, hTop);
    drawMountains(ctxBot, w, hTop, true);

    ctxBot.restore();

    // =====================================
    // STEP 2: AQUATIC TINT OVERLAY
    // =====================================
    let g = ctxBot.createLinearGradient(0, 0, 0, hBot);
    g.addColorStop(0,"rgba(24, 200, 239, 0.4)"); // Light blue tint mapping water
    g.addColorStop(1,"rgba(255, 255, 255, 0.7)"); // White frosty bottom
    ctxBot.fillStyle = g;
    ctxBot.fillRect(0, 0, w, hBot);

    // =====================================
    // STEP 3: WATER RIPPLE DISTORTION
    // =====================================
    ctxBot.globalAlpha = 0.4;
    for (let y = 0; y < hBot; y += 4) {
        // Organic Sine Wave simulating physical displacement / ripples
        let wave = Math.sin((y * 0.15) + (time * 0.08));
        let thickness = 2 + (y / hBot) * 3; // Ripples get thicker towards the bottom camera
        
        if (wave > 0) {
            ctxBot.fillStyle = `rgba(24, 200, 239, ${wave * 0.6})`;
            ctxBot.fillRect(0, y, w, thickness);
        } else {
            ctxBot.fillStyle = `rgba(184, 161, 234, ${-wave * 0.4})`;
            ctxBot.fillRect(0, y, w, thickness);
        }
    }
    
    // =====================================
    // STEP 4: SUNGLARE SPECULAR RIPPLES
    // =====================================
    ctxBot.globalAlpha = 1.0;
    
    // Use the sun's exact X coordinate passed from the upper canvas draw function
    let sunX = sunPos.x;
    let sunP = mouseX * -40; // parallax matching the front mountain
    
    ctxBot.fillStyle = "rgba(255, 255, 255, 0.5)";
    for(let i=0; i<10; i++) {
        let t = (time + i * 50) % 500;
        let p = t / 500; // Linear fade from 0.0 to 1.0 based on distance 
        
        let waveY = p * hBot; // Travels from horizon to bottom
        let waveW = w * 0.05 + (p * w * 0.2); // Expands horizontally
        
        // Wobble the reflection naturally 
        let waveX = sunX + Math.sin(time * 0.02 + i) * 80 + sunP; 

        ctxBot.globalAlpha = (1.0 - p) * 0.8; // Fade out as it comes closer
        ctxBot.beginPath();
        // Draw expanding oval highlights
        ctxBot.ellipse(waveX, waveY, waveW, 1 + p*3, 0, 0, Math.PI*2);
        ctxBot.fill();
    }
    ctxBot.globalAlpha = 1.0;
}

function animate() {
    time += 1;
    if(canvasTop.width > 0 && canvasBot.width > 0) {
        let sunPos = drawTop();
        drawBot(sunPos);
    }
    // Infinite Animation callback via HTML5 API
    requestAnimationFrame(animate);
}

// Start Engine
animate();