"use client";

import React, { useEffect, useRef } from "react";

interface FloatingHeartsBackgroundProps {
  interactive?: boolean;
}

export default function FloatingHeartsBackground({ interactive = true }: FloatingHeartsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Heart and star particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      type: "heart" | "star" | "sparkle";
    }

    const colors = [
      "rgba(244, 63, 94, ", // rose-500
      "rgba(251, 113, 133, ", // rose-400
      "rgba(249, 168, 212, ", // pink-300
      "rgba(253, 164, 175, ", // rose-300
      "rgba(255, 228, 230, ", // rose-100
      "rgba(251, 191, 36, ", // amber-400 (gold sparkle)
    ];

    const particles: Particle[] = [];
    const particleCount = 45;

    function createParticle(initial = false): Particle {
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + 20,
        size: Math.random() * 14 + 8,
        speedY: -(Math.random() * 0.8 + 0.4),
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.3 ? "heart" : Math.random() > 0.5 ? "star" : "sparkle",
      };
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    // Interactive mouse clicks create bursts
    const interactiveParticles: Particle[] = [];
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        interactiveParticles.push({
          x: clientX,
          y: clientY,
          size: Math.random() * 16 + 10,
          speedY: Math.sin(angle) * speed - 1,
          speedX: Math.cos(angle) * speed,
          opacity: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          color: colors[Math.floor(Math.random() * (colors.length - 1))],
          type: "heart",
        });
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);

    function drawHeart(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number
    ) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size / 30, size / 30);
      ctx.fillStyle = color + opacity + ")";

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-15, -15, -25, 5, 0, 22);
      ctx.bezierCurveTo(25, 5, 15, -15, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function drawStar(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number
    ) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color + opacity + ")";
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos(((18 + i * 90) * Math.PI) / 180) * size, -Math.sin(((18 + i * 90) * Math.PI) / 180) * size);
        ctx.lineTo(
          Math.cos(((63 + i * 90) * Math.PI) / 180) * (size / 2.5),
          -Math.sin(((63 + i * 90) * Math.PI) / 180) * (size / 2.5)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render ambient background particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else {
          drawStar(ctx, p.x, p.y, p.size * 0.7, p.color, p.opacity);
        }

        // Reset if went above screen
        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[i] = createParticle(false);
        }
      }

      // Render interactive burst particles
      for (let i = interactiveParticles.length - 1; i >= 0; i--) {
        const p = interactiveParticles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.08; // gravity
        p.opacity -= 0.015;
        p.rotation += p.rotationSpeed;

        if (p.opacity <= 0) {
          interactiveParticles.splice(i, 1);
        } else {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-75"
    />
  );
}
