"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart, Trophy, Sparkles, X, RotateCcw, Play, Pause, Gift, Award, CheckCircle } from "lucide-react";

interface CatchLoveGameProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCoupons: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  type: "heart" | "letter" | "rose" | "star" | "cloud";
  points: number;
  symbol: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export default function CatchLoveGame({ isOpen, onClose, onOpenCoupons }: CatchLoveGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover" | "won">("ready");
  const [unlockedReward, setUnlockedReward] = useState<string | null>(null);

  // Rewards tracking
  const [hasUnlocked100, setHasUnlocked100] = useState(false);
  const [hasUnlocked200, setHasUnlocked200] = useState(false);
  const [hasUnlocked350, setHasUnlocked350] = useState(false);

  // Audio Context for sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = (type: "catch" | "star" | "unlock" | "cloud") => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === "catch") {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === "star") {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.5, now + 0.24);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === "unlock") {
        // Grand fanfare
        [440, 554, 659, 880].forEach((freq, idx) => {
          const subOsc = ctx.createOscillator();
          const subGain = ctx.createGain();
          subOsc.connect(subGain);
          subGain.connect(ctx.destination);
          subOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
          subGain.gain.setValueAtTime(0.2, now + idx * 0.1);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
          subOsc.start(now + idx * 0.1);
          subOsc.stop(now + idx * 0.1 + 0.45);
        });
      } else {
        // cute cloud bounce
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.11);
      }
    } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("anniversary_game_high");
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  const saveHigh = (val: number) => {
    if (val > highScore) {
      setHighScore(val);
      try {
        localStorage.setItem("anniversary_game_high", val.toString());
      } catch {}
    }
  };

  useEffect(() => {
    if (!isOpen || gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = Math.min(500, window.innerHeight - 200));

    // Player Basket
    const basket = {
      x: width / 2 - 40,
      y: height - 50,
      width: 80,
      height: 38,
      speed: 8,
    };

    let items: FallingItem[] = [];
    let particles: Particle[] = [];
    let currentScore = score;
    let spawnCounter = 0;

    let targetX = basket.x;

    // Pointer move handler
    const handleMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      targetX = Math.max(0, Math.min(width - basket.width, relativeX - basket.width / 2));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    // Keyboard support
    const keys: { [key: string]: boolean } = {};
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Spawn falling items
    const spawnItem = () => {
      const rand = Math.random();
      let type: FallingItem["type"] = "heart";
      let points = 10;
      let symbol = "💖";
      let size = 26;
      let speed = Math.random() * 1.5 + 2.2;

      if (rand < 0.45) {
        type = "heart";
        points = 10;
        symbol = "💖";
      } else if (rand < 0.65) {
        type = "letter";
        points = 25;
        symbol = "💌";
        size = 28;
        speed += 0.5;
      } else if (rand < 0.8) {
        type = "rose";
        points = 35;
        symbol = "🌹";
        size = 30;
      } else if (rand < 0.9) {
        type = "star";
        points = 50;
        symbol = "✨";
        size = 32;
        speed += 1.0;
      } else {
        type = "cloud";
        points = -5;
        symbol = "🌧️";
        size = 30;
      }

      items.push({
        id: Math.random(),
        x: Math.random() * (width - 40) + 10,
        y: -30,
        speed,
        size,
        type,
        points,
        symbol,
      });
    };

    const addSparks = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 1,
          alpha: 1,
          color,
        });
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Keyboard movement
      if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
        targetX -= basket.speed;
      }
      if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
        targetX += basket.speed;
      }
      targetX = Math.max(0, Math.min(width - basket.width, targetX));
      // Smooth lerp to targetX
      basket.x += (targetX - basket.x) * 0.25;

      // Draw Basket (Romantic Heart Gondola / Cloud)
      ctx.save();
      // Glow under basket
      ctx.shadowColor = "rgba(244, 63, 94, 0.6)";
      ctx.shadowBlur = 15;

      // Basket body
      const gradient = ctx.createLinearGradient(basket.x, basket.y, basket.x + basket.width, basket.y + basket.height);
      gradient.addColorStop(0, "#be123c");
      gradient.addColorStop(0.5, "#fb7185");
      gradient.addColorStop(1, "#be123c");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(basket.x, basket.y, basket.width, basket.height, [14, 14, 20, 20]);
      ctx.fill();

      // Golden ribbon accent on basket
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cute center heart icon inside basket
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("💘", basket.x + basket.width / 2, basket.y + basket.height / 2);
      ctx.restore();

      // Spawn items
      spawnCounter++;
      if (spawnCounter % 40 === 0) {
        spawnItem();
      }

      // Update & Draw Items
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed;

        // Draw item symbol
        ctx.font = `${it.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(it.symbol, it.x, it.y);

        // Collision check with basket
        if (
          it.y + it.size / 2 >= basket.y &&
          it.y - it.size / 2 <= basket.y + basket.height &&
          it.x >= basket.x - 10 &&
          it.x <= basket.x + basket.width + 10
        ) {
          // Caught item!
          currentScore = Math.max(0, currentScore + it.points);
          setScore(currentScore);
          saveHigh(currentScore);

          if (it.type === "star") {
            playChime("star");
            addSparks(it.x, it.y, "#fde047");
          } else if (it.type === "cloud") {
            playChime("cloud");
            addSparks(it.x, it.y, "#94a3b8");
          } else {
            playChime("catch");
            addSparks(it.x, it.y, "#fb7185");
          }

          // Check reward unlocks
          if (currentScore >= 100 && !hasUnlocked100) {
            setHasUnlocked100(true);
            setUnlockedReward("Tier 1 Unlocked: Secret Love Note! ✨");
            playChime("unlock");
          }
          if (currentScore >= 200 && !hasUnlocked200) {
            setHasUnlocked200(true);
            setUnlockedReward("Tier 2 Unlocked: Lifetime Hugs & Kisses Pass! 💖");
            playChime("unlock");
          }
          if (currentScore >= 350 && !hasUnlocked350) {
            setHasUnlocked350(true);
            setUnlockedReward("Grand Prize: Romantic Love Coupons Unlocked! 🎁");
            playChime("unlock");
          }

          items.splice(i, 1);
          continue;
        }

        // Out of screen bottom
        if (it.y > height + 40) {
          items.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isOpen, gameState, hasUnlocked100, hasUnlocked200, hasUnlocked350]);

  if (!isOpen) return null;

  const startGame = () => {
    setScore(0);
    setGameState("playing");
    setUnlockedReward(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1b0612] border border-rose-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💘</span>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                Catch My Love!
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-[11px] text-rose-300/80">
                Catch hearts & roses to unlock special anniversary gifts!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Progress Bar */}
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-3 mb-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-rose-200">Score:</span>
            <span className="font-extrabold text-white text-base">{score}</span>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-rose-200">Best:</span>
            <span className="font-bold text-amber-300">{highScore}</span>
          </div>

          {/* Reward Badges indicator */}
          <div className="flex items-center gap-1">
            <span
              title="100 pts: Love Note"
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                hasUnlocked100 ? "bg-amber-400 text-black font-bold" : "bg-rose-900/50 text-rose-500"
              }`}
            >
              1
            </span>
            <span
              title="200 pts: Hugs Pass"
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                hasUnlocked200 ? "bg-pink-400 text-black font-bold" : "bg-rose-900/50 text-rose-500"
              }`}
            >
              2
            </span>
            <span
              title="350 pts: Love Coupons"
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                hasUnlocked350 ? "bg-rose-500 text-white font-bold animate-bounce" : "bg-rose-900/50 text-rose-500"
              }`}
            >
              🎁
            </span>
          </div>
        </div>

        {/* Canvas or Start Overlay */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#14030d] to-[#250818] rounded-2xl border border-rose-500/30 overflow-hidden flex items-center justify-center">
          {gameState === "ready" ? (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-3xl animate-bounce">
                💘
              </div>
              <h4 className="text-xl font-bold text-white">How To Play</h4>
              <p className="text-xs text-rose-200/80 max-w-xs mx-auto leading-relaxed">
                Move your basket with your mouse, arrow keys (A/D), or finger on mobile.
                Catch hearts (💖), letters (💌), roses (🌹) & stars (✨).
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-[11px] text-rose-300 pt-1">
                <span className="bg-rose-950/60 px-2 py-1 rounded">💖 +10 pts</span>
                <span className="bg-rose-950/60 px-2 py-1 rounded">💌 +25 pts</span>
                <span className="bg-rose-950/60 px-2 py-1 rounded">🌹 +35 pts</span>
                <span className="bg-rose-950/60 px-2 py-1 rounded">✨ +50 pts</span>
                <span className="bg-rose-950/60 px-2 py-1 rounded">🌧️ -5 pts</span>
              </div>
              <button
                onClick={startGame}
                className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Catching Love</span>
              </button>
            </div>
          ) : (
            <canvas ref={canvasRef} className="w-full h-full block cursor-none" />
          )}

          {/* Unlocked Reward Toast Banner inside Game */}
          {unlockedReward && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-900 font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce z-20">
              <Sparkles className="w-4 h-4 text-neutral-900" />
              <span>{unlockedReward}</span>
            </div>
          )}
        </div>

        {/* Bottom Game Controls & Unlocked Coupons Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          {gameState === "playing" ? (
            <button
              onClick={() => setGameState("ready")}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-1.5 hover:bg-rose-900/40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          ) : (
            <button
              onClick={startGame}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-1.5 hover:bg-rose-900/40"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          )}

          {/* Open Coupons Button */}
          <button
            onClick={() => {
              onClose();
              onOpenCoupons();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <Gift className="w-4 h-4" />
            <span>View Unlocked Love Coupons ({hasUnlocked350 ? "Active!" : "Available"})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
