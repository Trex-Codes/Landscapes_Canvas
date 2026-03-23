window.drawLines = function(ctx, width, height, state) {
    let color = state.linesColor;
    let time = state.time;
    
    // Use the 3D Vanishing point passed from Highway
    let vX = state.vX || width / 2;
    let vY = state.vY || height * 0.6;
    let bottomCenter = width / 2;

    ctx.fillStyle = color;
    
    let numLines = 8;
    // Speed increases realistically
    let speed = (time * 1.5) % 1; 

    for(let i=0; i<numLines; i++) {
        let lineZ = (i + speed) / numLines; 
        
        let t1 = Math.pow(lineZ, 2);
        let zEnd = Math.min(1.0, lineZ + (0.05 / (lineZ + 0.1)));
        let t2 = Math.pow(zEnd, 2);

        let y1 = vY + t1 * (height - vY);
        let y2 = vY + t2 * (height - vY);

        // Calculate X offsets based on vanishing point line to bottom center
        let cx1 = vX + t1 * (bottomCenter - vX);
        let cx2 = vX + t2 * (bottomCenter - vX);

        let w1 = 2 + t1 * 25;
        let w2 = 2 + t2 * 25;

        ctx.beginPath();
        ctx.moveTo(cx1 - w1/2, y1);
        ctx.lineTo(cx1 + w1/2, y1);
        ctx.lineTo(cx2 + w2/2, y2);
        ctx.lineTo(cx2 - w2/2, y2);
        ctx.fill();
    }
}
