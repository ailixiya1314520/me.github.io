/**
 * Engine Background Effect
 * Next-gen game engine style dynamic background
 * Optimized for performance with requestAnimationFrame
 */

(function() {
    'use strict';

    // Canvas setup
    const canvas = document.getElementById('engine-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Performance settings
    const PARTICLE_COUNT = 50; // Low particle count for performance
    const GRID_SPACING = 80;
    const PARTICLE_SPEED_MIN = 0.3;
    const PARTICLE_SPEED_MAX = 1.5;

    // Colors - UE style cyan/orange accents
    const COLORS = {
        primary: '#00f0ff',     // Cyan
        secondary: '#ff6b35',   // Orange
        grid: '#1a1a1a'         // Grid line color
    };

    // State
    let particles = [];
    let gridOffsetY = 0;
    let width, height;
    let animationId;
    let lastTime = 0;

    // Resize handler
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Reinitialize particles on resize
        initParticles();
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    // Create single particle
    function createParticle() {
        const isCodeParticle = Math.random() > 0.7;
        return {
            x: Math.random() * width,
            y: height + Math.random() * 100,
            speed: PARTICLE_SPEED_MIN + Math.random() * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN),
            size: 1 + Math.random() * 2,
            opacity: 0.1 + Math.random() * 0.4,
            color: Math.random() > 0.5 ? COLORS.primary : COLORS.secondary,
            type: isCodeParticle ? 'code' : 'dot',
            // Code particle specific
            char: isCodeParticle ? getRandomCodeChar() : null,
            charSize: isCodeParticle ? 8 + Math.random() * 6 : null
        };
    }

    // Get random code-like character
    function getRandomCodeChar() {
        const chars = '01{}[]<>=/;:fnctvoidrUE5Gdx_-.';
        return chars[Math.floor(Math.random() * chars.length)];
    }

    // Draw grid lines (subtle engine viewport style)
    function drawGrid() {
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.15;

        // Vertical lines
        for (let x = 0; x <= width; x += GRID_SPACING) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal lines (moving upward)
        const offsetY = gridOffsetY % GRID_SPACING;
        for (let y = offsetY; y <= height; y += GRID_SPACING) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }

    // Draw single particle
    function drawParticle(p) {
        ctx.globalAlpha = p.opacity;

        if (p.type === 'code') {
            // Code character floating up
            ctx.fillStyle = p.color;
            ctx.font = `${p.charSize}px 'Courier New', monospace`;
            ctx.fillText(p.char, p.x, p.y);
        } else {
            // Simple dot/line particle
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Draw trailing line
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + 20);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }

    // Update particle position
    function updateParticle(p, deltaTime) {
        const speedFactor = deltaTime * 0.06; // Normalize speed
        p.y -= p.speed * speedFactor;

        // Add slight horizontal drift
        p.x += (Math.sin(p.y * 0.01) * 0.3) * speedFactor;

        // Reset when particle goes off screen
        if (p.y < -50) {
            p.y = height + Math.random() * 50;
            p.x = Math.random() * width;
            p.opacity = 0.1 + Math.random() * 0.4;
            if (p.type === 'code') {
                p.char = getRandomCodeChar();
            }
        }
    }

    // Main animation loop
    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid (subtle movement)
        gridOffsetY += deltaTime * 0.02;
        drawGrid();

        // Update and draw particles
        for (const p of particles) {
            updateParticle(p, deltaTime);
            drawParticle(p);
        }

        // Request next frame
        animationId = requestAnimationFrame(animate);
    }

    // Visibility API - pause when tab is hidden
    function handleVisibility() {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            lastTime = performance.now();
            animationId = requestAnimationFrame(animate);
        }
    }

    // Initialize
    function init() {
        resize();

        // Event listeners
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', handleVisibility);

        // Start animation
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();