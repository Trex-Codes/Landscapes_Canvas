window.drawHighway = function(ctx, width, height, state) {
    let color = state.highwayColor;
    let t = state.timeOfDay;
    
    // Perspective Parallax constraint
    // The road bottom stays relatively fixed, but the vanishing point shifts!
    let vX = width / 2 + (state.mouseX * -60);
    let vY = height * 0.6 + (state.mouseY * -20);
    
    let nightFactor = Math.max(0, -Math.cos((t - 12) * Math.PI / 12)); 

    let finalColor = color;
    if (nightFactor > 0 && window.hexToRgb) {
        // Highway gets darker, maybe lit slightly by headlights but overall darker
        let baseC = window.hexToRgb(color);
        let darkC = {r: 10, g: 10, b: 15}; 
        let blended = window.blendColors(baseC, darkC, nightFactor * 0.8);
        finalColor = `rgb(${blended.r}, ${blended.g}, ${blended.b})`;
    }

    ctx.fillStyle = finalColor;
    
    ctx.beginPath();
    
    let topWidth = width * 0.15;
    let bottomWidth = width * 1.8;
    let bottomCenter = width / 2; // Fixed bottom center

    ctx.moveTo(vX - topWidth/2, vY);
    ctx.lineTo(vX + topWidth/2, vY);
    ctx.lineTo(bottomCenter + bottomWidth/2, height);
    ctx.lineTo(bottomCenter - bottomWidth/2, height);
    
    ctx.fill();
    
    // Optional glow on borders
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.4 + nightFactor * 0.4})`;
    ctx.lineWidth = 4;
    
    ctx.beginPath();
    ctx.moveTo(vX - topWidth/2, vY);
    ctx.lineTo(bottomCenter - bottomWidth/2, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(vX + topWidth/2, vY);
    ctx.lineTo(bottomCenter + bottomWidth/2, height);
    ctx.stroke();
    
    // Keep vanishing point available for lines/objects
    state.vX = vX;
    state.vY = vY;
    state.roadTopW = topWidth;
    state.roadBotW = bottomWidth;
}