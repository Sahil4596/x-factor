import React, { useEffect, useRef } from 'react';

const HeartCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let hearts = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Heart {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.size = Math.random() * 15 + 10;
                this.speed = Math.random() * 1.5 + 0.8;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.01;
                this.swing = Math.random() * 2;
                this.swingSpeed = Math.random() * 0.02 + 0.01;
                this.swingAngle = Math.random() * Math.PI * 2;
            }

            update() {
                this.y -= this.speed;
                this.swingAngle += this.swingSpeed;
                this.x += Math.sin(this.swingAngle) * this.swing;
                this.rotation += this.rotationSpeed;

                if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#ff4d6d';

                // Draw heart shape
                ctx.beginPath();
                const d = this.size;
                ctx.moveTo(0, -d / 4);
                ctx.bezierCurveTo(-d / 2, -d * 0.75, -d, -d / 3, -d, d / 6);
                ctx.bezierCurveTo(-d, d * 0.6, -d / 3, d * 0.8, 0, d);
                ctx.bezierCurveTo(d / 3, d * 0.8, d, d * 0.6, d, d / 6);
                ctx.bezierCurveTo(d, -d / 3, d / 2, -d * 0.75, 0, -d / 4);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            }
        }

        // Initialize hearts based on screen size
        const heartCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
        for (let i = 0; i < heartCount; i++) {
            const h = new Heart();
            // Stagger initial Y positions so they don't all rise from bottom together
            h.y = Math.random() * canvas.height;
            hearts.push(h);
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hearts.forEach((heart) => {
                heart.update();
                heart.draw();
            });
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        />
    );
};

export default HeartCanvas;
