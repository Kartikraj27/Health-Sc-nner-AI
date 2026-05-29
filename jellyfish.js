/**
 * jellyfish.js
 * Interactive HTML5 Canvas Bioluminescent Jellyfish Simulation
 * Features dynamic rhythmic pulsation, Verlet-like tentacle chain kinematics,
 * ambient floating plankton particles, and mouse-repel physics.
 */

class Plankton {
    constructor(width, height) {
        this.reset(width, height, true);
    }

    reset(width, height, randomY = false) {
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : height + 10;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255,' : 'rgba(196, 192, 255,';
    }

    update(width, height) {
        this.y += this.speedY;
        this.x += this.speedX;

        // Reset if goes off-screen
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
            this.reset(width, height, false);
        }
    }

    draw(ctx) {
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class TentacleNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.ox = x; // Old x for Verlet integration if needed
        this.oy = y;
    }
}

class Jellyfish {
    constructor(x, y, radius, colorTheme) {
        this.x = x;
        this.y = y;
        this.radius = radius; // Bell radius
        this.colorTheme = colorTheme; // 'cyan' or 'magenta' or 'purple'
        
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.3 + 0.2); // Slowly drift upwards
        
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.015;
        
        // Dynamic properties
        this.currentRadiusX = radius;
        this.currentRadiusY = radius * 0.7;
        
        // Generate tentacles
        this.tentacles = [];
        const numTentacles = Math.floor(Math.random() * 3) + 5; // 5 to 7 tentacles
        const spacing = (radius * 1.6) / (numTentacles - 1);
        
        for (let i = 0; i < numTentacles; i++) {
            const tx = -radius * 0.8 + i * spacing;
            const length = Math.floor(Math.random() * 15) + 20; // 20 to 35 nodes per tentacle
            const nodes = [];
            for (let j = 0; j < length; j++) {
                nodes.push(new TentacleNode(x + tx, y + j * 5));
            }
            this.tentacles.push({
                offset: tx,
                nodes: nodes,
                wiggleSpeed: Math.random() * 0.05 + 0.02,
                wigglePhase: Math.random() * Math.PI * 2
            });
        }
    }

    update(width, height, mouse) {
        // Pulse cycle
        this.pulsePhase += this.pulseSpeed;
        const pulse = Math.sin(this.pulsePhase);
        
        // Apply thrust when contracting
        let thrust = 0;
        if (pulse > 0.5) {
            // Contracting phase - squeeze bell width, push upwards
            this.currentRadiusX = this.radius * (1 - (pulse - 0.5) * 0.2);
            this.currentRadiusY = this.radius * 0.7 * (1 + (pulse - 0.5) * 0.15);
            thrust = (pulse - 0.5) * 0.3;
        } else {
            // Relaxing phase
            this.currentRadiusX = this.radius * (1 - pulse * 0.05);
            this.currentRadiusY = this.radius * 0.7 * (1 + pulse * 0.05);
        }

        // Apply movement forces
        this.vy += -thrust * 0.08 - 0.002; // Upward acceleration
        this.vx += (Math.sin(this.pulsePhase) * 0.05); // Swaying

        // Mouse interaction (repelled by mouse)
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
            const force = (220 - dist) / 220;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.5;
            this.vy += Math.sin(angle) * force * 0.5;
        }

        // Apply friction and speed limits
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Speed cap
        const maxSpeed = 1.5;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Boundaries wrap/reset
        if (this.y < -this.radius * 2) {
            this.y = height + this.radius * 2;
            this.x = Math.random() * width;
            this.vy = -(Math.random() * 0.3 + 0.2);
        }
        if (this.x < -this.radius * 2) this.x = width + this.radius * 2;
        if (this.x > width + this.radius * 2) this.x = -this.radius * 2;

        // Update Tentacles with forward kinematics (follow the head)
        this.tentacles.forEach(tentacle => {
            // Anchor point is at the bottom edge of the bell
            const anchorX = this.x + tentacle.offset * (this.currentRadiusX / this.radius);
            const anchorY = this.y + this.currentRadiusY * 0.3;
            
            // First node sits exactly at anchor
            tentacle.nodes[0].x = anchorX;
            tentacle.nodes[0].y = anchorY;
            
            // Wiggle phase increments
            tentacle.wigglePhase += tentacle.wiggleSpeed;
            
            // Dynamic lag follow for remaining nodes
            for (let i = 1; i < tentacle.nodes.length; i++) {
                const node = tentacle.nodes[i];
                const prevNode = tentacle.nodes[i - 1];
                
                // Target position is directly below previous node with dynamic sway
                const waveOffset = Math.sin(tentacle.wigglePhase + i * 0.25) * (i * 0.12) * (1.2 - Math.sin(this.pulsePhase));
                const targetX = prevNode.x + waveOffset;
                const targetY = prevNode.y + 4.5; // segment distance
                
                // Lerp towards target to simulate fluid drag
                node.x += (targetX - node.x) * 0.3;
                node.y += (targetY - node.y) * 0.3;
            }
        });
    }

    draw(ctx) {
        const glowColor = this.colorTheme === 'cyan' ? 'rgba(0, 240, 255, 0.4)' : 
                          this.colorTheme === 'magenta' ? 'rgba(255, 0, 127, 0.35)' : 
                          'rgba(196, 190, 255, 0.3)';

        const primaryColor = this.colorTheme === 'cyan' ? '#00F0FF' : 
                             this.colorTheme === 'magenta' ? '#FF007F' : 
                             '#C4C0FF';

        // Draw Tentacles first (underneath the bell)
        this.tentacles.forEach(tentacle => {
            ctx.beginPath();
            ctx.moveTo(tentacle.nodes[0].x, tentacle.nodes[0].y);
            
            for (let i = 1; i < tentacle.nodes.length - 2; i++) {
                const xc = (tentacle.nodes[i].x + tentacle.nodes[i + 1].x) / 2;
                const yc = (tentacle.nodes[i].y + tentacle.nodes[i + 1].y) / 2;
                ctx.quadraticCurveTo(tentacle.nodes[i].x, tentacle.nodes[i].y, xc, yc);
            }
            
            // Dynamic thickness/opacity fading down the length
            ctx.shadowBlur = 10;
            ctx.shadowColor = glowColor;
            
            // Draw dual line for bioluminescence highlight
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });

        // Draw Bell (Head)
        ctx.shadowBlur = 22;
        ctx.shadowColor = glowColor;

        // Create elegant radial gradient inside the bell
        const gradient = ctx.createRadialGradient(
            this.x, this.y - this.currentRadiusY * 0.2, 2, 
            this.x, this.y, this.currentRadiusX
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(0.2, glowColor);
        gradient.addColorStop(0.8, 'rgba(10, 11, 20, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;

        // Draw Bell shape path
        ctx.beginPath();
        // Top cap curve
        ctx.ellipse(this.x, this.y, this.currentRadiusX, this.currentRadiusY, 0, Math.PI, 0, false);
        // Bottom ruffles (inner curves)
        const rx = this.currentRadiusX;
        const ry = this.currentRadiusY;
        const cy = this.y;
        
        ctx.bezierCurveTo(this.x + rx * 0.7, cy + ry * 0.4, this.x + rx * 0.3, cy + ry * 0.2, this.x, cy + ry * 0.1);
        ctx.bezierCurveTo(this.x - rx * 0.3, cy + ry * 0.2, this.x - rx * 0.7, cy + ry * 0.4, this.x - rx, cy);
        ctx.closePath();
        ctx.fill();

        // Bell Highlight Rim
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.currentRadiusX, this.currentRadiusY, 0, Math.PI, 0, false);
        ctx.stroke();

        // Small inner bell floating organ
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.arc(this.x, this.y - this.currentRadiusY * 0.15, this.currentRadiusX * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow for subsequent canvas draws
        ctx.shadowBlur = 0;
    }
}

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = Math.random() * 60 + 40;
        this.alpha = 0.6;
        this.speed = Math.random() * 2 + 1.5;
    }

    update() {
        this.radius += this.speed;
        this.alpha -= 0.015;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${this.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

function initJellyfish(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    const jellyfishCount = 4;
    const jellyfishList = [];
    const planktons = [];
    const ripples = [];
    const mouse = { x: -1000, y: -1000 };

    // Setup color configurations
    const themes = ['cyan', 'magenta', 'purple', 'cyan'];

    // Instantiate Jellyfish
    for (let i = 0; i < jellyfishCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.8 + height * 0.1;
        const radius = Math.random() * 25 + 25; // 25px to 50px radius
        const theme = themes[i % themes.length];
        jellyfishList.push(new Jellyfish(x, y, radius, theme));
    }

    // Instantiate Plankton
    const planktonCount = Math.floor((width * height) / 25000) + 15;
    for (let i = 0; i < planktonCount; i++) {
        planktons.push(new Plankton(width, height));
    }

    // Handlers
    window.addEventListener('resize', () => {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        ripples.push(new Ripple(mx, my));

        // Spawn a burst of planktons on click
        for (let i = 0; i < 5; i++) {
            const p = new Plankton(width, height);
            p.x = mx + (Math.random() - 0.5) * 20;
            p.y = my + (Math.random() - 0.5) * 20;
            p.speedY = -(Math.random() * 0.8 + 0.4);
            p.alpha = 0.8;
            planktons.push(p);
        }
    });

    function animate() {
        // Clear canvas with a solid deep navy/black color (with alpha trail for extra motion blur)
        ctx.fillStyle = 'rgba(10, 11, 20, 0.25)'; // Smooth trails
        ctx.fillRect(0, 0, width, height);

        // Update & Draw Plankton
        planktons.forEach(p => {
            p.update(width, height);
            p.draw(ctx);
        });

        // Update & Draw Ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            r.update();
            if (r.alpha <= 0) {
                ripples.splice(i, 1);
            } else {
                r.draw(ctx);
            }
        }

        // Update & Draw Jellyfish
        jellyfishList.forEach(jelly => {
            jelly.update(width, height, mouse);
            jelly.draw(ctx);
        });

        // Keep ambient plankton density stable if resized
        if (planktons.length > 100) {
            planktons.splice(100);
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// Attach to window object for global availability
window.initJellyfish = initJellyfish;
