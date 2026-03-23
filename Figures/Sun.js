window.drawSun = function(ctx, width, height, state) {
    let color = state.sunColor;
    let time = state.time;
    let t = state.timeOfDay;
    
    // Parallax (Sun moves a bit more than Sky to give depth)
    let pX = state.mouseX * -25; 
    let pY = state.mouseY * -15;

    let nightFactor = Math.max(0, -Math.cos((t - 12) * Math.PI / 12)); 
    let isNight = nightFactor > 0.5;

    // Modify color based on time (Sun turns to Moon at night)
    if (nightFactor > 0) {
        if(window.hexToRgb) {
            let baseC = window.hexToRgb(color);
            let moonC = {r: 200, g: 220, b: 255}; // pale blue/white moon
            let blended = window.blendColors(baseC, moonC, nightFactor);
            color = `rgb(${blended.r}, ${blended.g}, ${blended.b})`;
        }
    }

    ctx.save();
    ctx.translate(pX, pY);

    // Arc path for the sun based on Time of Day
    // At noon (12), it's high. At 6/18, it's at horizon. At 0/24, it's a moon high up.
    let angle = (t / 24) * Math.PI * 2 - Math.PI/2; 
    // Mapped to a giant circle
    let cx = width / 2;
    let cy = height * 0.8; // far below horizon
    let orbitX = width * 0.4;
    let orbitY = height * 0.6;

    let x = cx + Math.sin(angle) * orbitX;
    let y = cy - Math.cos(angle) * orbitY;
    
    let radius = Math.max(30, Math.min(width, height) * 0.06);

    // Only draw if it's reasonably above horizon, wait, the orbit naturally handles hiding it
    if (y < height * 0.7) {
        let pulse = Math.sin(time) * 15;
        let maxGlowRadius = radius + 60 + pulse;
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius + 20 + pulse * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(x, y, radius + 40 + pulse, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}