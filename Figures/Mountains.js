window.drawMountains = function(ctx, width, height, state) {
    let color = state.mountainsColor;
    let t = state.timeOfDay;
    
    // Parallax (Mountains move noticeably)
    let pX = state.mouseX * -40; 
    let pY = state.mouseY * -20;

    let nightFactor = Math.max(0, -Math.cos((t - 12) * Math.PI / 12)); 

    ctx.save();
    ctx.translate(pX, pY);

    // Draw larger to cover parallax margins
    let drawW = width + 100;
    let startXOffset = -50;
    let horizonY = height * 0.6;
    
    let points = 6; 
    let segmentWidth = drawW / points;

    // Apply night darkness to mountains
    let finalColor = color;
    if (nightFactor > 0 && window.hexToRgb) {
        let baseC = window.hexToRgb(color);
        let darkC = {r: 5, g: 10, b: 20}; // dark silhouette
        let blended = window.blendColors(baseC, darkC, nightFactor * 0.85);
        finalColor = `rgb(${blended.r}, ${blended.g}, ${blended.b})`;
    }

    let grad = ctx.createLinearGradient(0, horizonY - 200, 0, horizonY);
    grad.addColorStop(0, finalColor);
    grad.addColorStop(1, 'rgba(0,0,0,0.8)'); 
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(startXOffset, horizonY);

    for(let i=0; i<points; i++) {
        let startX = startXOffset + i * segmentWidth;
        let endX = startXOffset + (i + 1) * segmentWidth;
        let midX = startX + segmentWidth / 2;
        
        let mountainHeightFactor = Math.abs(Math.sin((i + 1) * 12.34)) * 0.5 + 0.5;
        let peakY = horizonY - (100 + mountainHeightFactor * 150 * (height/800)); 
        
        ctx.quadraticCurveTo(midX - segmentWidth * 0.2, peakY, midX, peakY);
        ctx.quadraticCurveTo(midX + segmentWidth * 0.2, peakY, endX, horizonY);
    }
    
    ctx.lineTo(drawW, height + 50);
    ctx.lineTo(startXOffset, height + 50);
    ctx.fill();
    ctx.restore();
}