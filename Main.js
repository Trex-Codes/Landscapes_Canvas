// Main Application State
const state = {
    skyColor: '#7FB3D5',
    sunColor: '#ffff00',
    mountainsColor: '#008000',
    highwayColor: 'grey',
    linesColor: '#ffffff',
    
    isAnimating: true,
    time: 0,
    
    // Advanced Features state
    parallaxEnabled: true,
    crtEnabled: true,
    timeOfDay: 12.0, // 0 to 24
    
    // Parallax mouse offsets (-1.0 to 1.0)
    mouseX: 0,
    mouseY: 0
};

// Canvas Setup
const canvas = document.getElementById('CanvasHTml');
const ctx = canvas.getContext("2d");

// Base Color Palette
const COLORS = [
	'#9FD5D1', '#0FFFFF', '#ffe4c4', '#002FA7', '#5f9ea0', '#A51C30',
	'#db7093', '#808000', '#f5fffa', '#cd853f', '#4169e1', '#00ff7f',
	'#FFDAB9', '#bc8f8f', '#90ee90', '#EF7F1A', '#B57EDC', '#1C4C96'
];

// Helper: Hex to RGB
window.hexToRgb = function(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
}

// Helper: blend two colors (0.0 = c1, 1.0 = c2)
window.blendColors = function(c1, c2, factor) {
    return {
        r: Math.round(c1.r + (c2.r - c1.r) * factor),
        g: Math.round(c1.g + (c2.g - c1.g) * factor),
        b: Math.round(c1.b + (c2.b - c1.b) * factor)
    };
};

function initControls() {
    // 1. Color Palettes
    const config = [
        { id: 'palette-sky', key: 'skyColor' },
        { id: 'palette-sun', key: 'sunColor' },
        { id: 'palette-mountains', key: 'mountainsColor' },
        { id: 'palette-highway', key: 'highwayColor' },
        { id: 'palette-lines', key: 'linesColor' }
    ];

    config.forEach(item => {
        const container = document.getElementById(item.id);
        if (!container) return;

        COLORS.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            if (index === 0) swatch.classList.add('active'); 

            swatch.onclick = () => {
                state[item.key] = color;
                Array.from(container.children).forEach(c => c.classList.remove('active'));
                swatch.classList.add('active');
            };
            container.appendChild(swatch);
        });
    });

    // 2. Play/Pause
    const toggleBtn = document.getElementById('toggleAnimation');
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            state.isAnimating = !state.isAnimating;
            toggleBtn.textContent = state.isAnimating ? "Pause Animation" : "Play Animation";
        };
    }

    // 3. Time of Day Slider
    const timeSlider = document.getElementById('timeOfDay');
    if (timeSlider) {
        timeSlider.addEventListener('input', (e) => {
            state.timeOfDay = parseFloat(e.target.value);
        });
    }

    // 4. Parallax Toggle
    const parallaxToggle = document.getElementById('parallaxToggle');
    if (parallaxToggle) {
        parallaxToggle.addEventListener('change', (e) => {
            state.parallaxEnabled = e.target.checked;
            if(!state.parallaxEnabled) {
                state.mouseX = 0;
                state.mouseY = 0;
            }
        });
    }

    // 5. CRT Toggle
    const crtToggle = document.getElementById('crtToggle');
    const crtOverlay = document.getElementById('crtOverlay');
    if (crtToggle && crtOverlay) {
        crtToggle.addEventListener('change', (e) => {
            state.crtEnabled = e.target.checked;
            if(state.crtEnabled) {
                crtOverlay.classList.add('active');
            } else {
                crtOverlay.classList.remove('active');
            }
        });
    }

    // 6. Mouse Parallax Tracking
    window.addEventListener('mousemove', (e) => {
        if(state.parallaxEnabled) {
            // Normalize cursor position to -1.0 to 1.0 (0 is center)
            state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            state.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        }
    });
}

// Resize Handling
function resize() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
window.addEventListener('resize', resize);

// Main Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (state.isAnimating) {
        // Tie core speed to time so clouds and road move
        state.time += 0.02;
    }

    // Call individual drawing functions passing the full state
    if (window.drawSky)       drawSky(ctx, canvas.width, canvas.height, state);
    if (window.drawSun)       drawSun(ctx, canvas.width, canvas.height, state);
    if (window.drawMountains) drawMountains(ctx, canvas.width, canvas.height, state);
    if (window.drawHighway)   drawHighway(ctx, canvas.width, canvas.height, state);
    if (window.drawLines)     drawLines(ctx, canvas.width, canvas.height, state);
    if (window.drawRoadside)  drawRoadside(ctx, canvas.width, canvas.height, state);

    requestAnimationFrame(animate);
}

// Bootstrap
initControls();
resize();
animate();