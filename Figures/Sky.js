window.drawSky = function(ctx, width, height, state) {
    let color = state.skyColor;
    let time = state.time;
    let t = state.timeOfDay;
    
    // Parallax
    let pX = state.mouseX * -15; 
    let pY = state.mouseY * -10;
    
    // Time of day factors
    let nightFactor = Math.max(0, -Math.cos((t - 12) * Math.PI / 12)); 
    let peakSunset = Math.max(0, 1 - Math.abs(6 - t)/2) + Math.max(0, 1 - Math.abs(18 - t)/2);
    
    ctx.save();
    ctx.translate(pX, pY);
    
    // Draw slightly outside bounds
    let drawW = width + 50;
    let drawH = height + 50;
    let offsetX = -25;
    let offsetY = -25;

    let horizonY = height * 0.6; 
    let gradient = ctx.createLinearGradient(0, 0, 0, horizonY);
    
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(offsetX, offsetY, drawW, drawH);

    // Sunset overlay
    if (peakSunset > 0) {
        let sunsetGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        sunsetGrad.addColorStop(0, `rgba(150, 50, 0, 0)`);
        sunsetGrad.addColorStop(1, `rgba(255, 100, 0, ${peakSunset * 0.8})`);
        ctx.fillStyle = sunsetGrad;
        ctx.fillRect(offsetX, offsetY, drawW, drawH);
    }
    
    // Night overlay & Stars
    if (nightFactor > 0) {
        ctx.fillStyle = `rgba(5, 10, 25, ${nightFactor * 0.95})`; 
        ctx.fillRect(offsetX, offsetY, drawW, drawH);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${nightFactor})`;
        for(let i=0; i<150; i++) {
            let sx = (i * 1234.5) % drawW + offsetX;
            let sy = (i * 5432.1) % (horizonY) + offsetY;
            
            // Twinkle effect
            let twinkle = (Math.sin(time * 5 + i) + 1) / 2;
            ctx.globalAlpha = nightFactor * twinkle;
            
            ctx.beginPath();
            ctx.arc(sx, sy, (i%3)*0.6, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    // Clouds Animation
    ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * (1 - nightFactor * 0.7)})`; 
    let numClouds = 6;
    for(let i=0; i<numClouds; i++) {
        let speedFactor = 10 + (i * 5);
        let x = ((i * (width / numClouds) + time * speedFactor) % (drawW + 300)) - 150 + offsetX;
        let y = 30 + (i * 25 % (horizonY - 100)) + offsetY;
        let scale = 0.5 + (i * 0.1);
        
        ctx.beginPath();
        ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);
        ctx.arc(x + 40 * scale, y - 10 * scale, 40 * scale, 0, Math.PI * 2);
        ctx.arc(x + 80 * scale, y, 30 * scale, 0, Math.PI * 2);
        ctx.arc(x + 40 * scale, y + 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}