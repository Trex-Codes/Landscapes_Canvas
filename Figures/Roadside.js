// Global array for 3D roadside objects
const objects3D = [];
for (let i = 0; i < 15; i++) {
    objects3D.push({
        z: Math.random(),      // depth 0.0 to 1.0 (0=far, 1=near)
        side: i % 2 === 0 ? -1 : 1, // -1=left, 1=right
        offset: 0.2 + Math.random() * 0.3 // distance from road completely sideway
    });
}

window.drawRoadside = function(ctx, width, height, state) {
    let time = state.time;
    let t = state.timeOfDay;
    
    let vX = state.vX || width / 2;
    let vY = state.vY || height * 0.6;
    let bottomCenter = width / 2;
    
    let roadTopW = state.roadTopW || width * 0.15;
    let roadBotW = state.roadBotW || width * 1.8;

    let nightFactor = Math.max(0, -Math.cos((t - 12) * Math.PI / 12)); 

    // Neon colors for retro vibe or standard
    let isRetro = state.linesColor.toUpperCase() === '#0FFFFF' || state.linesColor.toUpperCase() === '#00FF7F';
    
    for (let obj of objects3D) {
        // Move objects forward towards camera
        if (state.isAnimating) {
            obj.z += 0.005 + (obj.z * 0.02); // Accelerates as it gets closer
            if (obj.z > 1.2) {
                obj.z = 0; // reset to horizon
            }
        }
        
        let dz = obj.z;
        if (dz <= 0) continue;

        let scale = Math.pow(dz, 2); // Perspective scaling
        let y = vY + scale * (height - vY);
        
        // Calculate horizontal position
        let roadEdgeScaleTop = (roadTopW / 2);
        let roadEdgeScaleBot = (roadBotW / 2);
        
        let roadEdgeX = (vX + obj.side * roadEdgeScaleTop) + scale * ((bottomCenter + obj.side * roadEdgeScaleBot) - (vX + obj.side * roadEdgeScaleTop));
        
        // Push further to the side based on offset
        let finalX = roadEdgeX + (obj.side * obj.offset * scale * width * 1.5);
        
        // Draw object (A Retro Neon Pillar or Palm Tree)
        let w = 8 * scale * 10;
        let h = 80 * scale * 10;
        
        // Draw Pillar
        ctx.fillStyle = nightFactor > 0 ? (isRetro ? '#00ffff' : '#112233') : '#223344';
        
        ctx.beginPath();
        ctx.moveTo(finalX - w/2, y);
        ctx.lineTo(finalX + w/2, y);
        ctx.lineTo(finalX + w/2, y - h);
        ctx.lineTo(finalX - w/4, y - h);
        ctx.fill();
        
        // Glowing orb on top
        let orbColor = '#ff0055';
        if (isRetro) orbColor = '#ff00ff';
        else if (nightFactor > 0) orbColor = '#ffcc00';
        else orbColor = '#eeeedd';

        ctx.fillStyle = orbColor;
        ctx.beginPath();
        ctx.arc(finalX + w/8, y - h, w, 0, Math.PI*2);
        ctx.fill();
        
        // Ground shadow/reflection
        ctx.fillStyle = `rgba(0,0,0,${0.5 * (1-scale)})`;
        ctx.beginPath();
        ctx.ellipse(finalX, y, w*2, w*0.5, 0, 0, Math.PI*2);
        ctx.fill();
    }
}
