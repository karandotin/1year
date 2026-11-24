"use client";

import React from "react";
import { Heart, Sparkles, Stars, ArrowUp } from "lucide-react";

interface FooterSectionProps {
  onOpenLetter: () => void;
  onOpenGame: () => void;
  onOpenReasons: () => void;
  onOpenCoupons: () => void;
  onOpenQuiz: () => void;
}

export default function FooterSection({
  onOpenLetter,
  onOpenGame,
  onOpenReasons,
  onOpenCoupons,
  onOpenQuiz,
}: FooterSectionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-16 px-4 border-t border-rose-500/20 bg-[#0e030b] text-center overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 border border-rose-400/40 flex items-center justify-center mx-auto shadow-xl shadow-rose-600/30">
          <Heart className="w-8 h-8 text-white fill-white animate-heartbeat" />
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            365 Days Down, Forever To Go.
          </h3>
          <p className="text-rose-200/80 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for being my dream come true. Here is to a lifetime of love, laughter, and more adventures together.
          </p>
        </div>

        {/* Quick Nav Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            onClick={onOpenLetter}
            className="px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            💌 Love Letter
          </button>
          <button
            onClick={onOpenGame}
            className="px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            🎮 Catch My Love Game
          </button>
          <button
            onClick={onOpenReasons}
            className="px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            ✨ Why I Love You
          </button>
          <button
            onClick={onOpenCoupons}
            className="px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            🎟️ Love Coupons
          </button>
          <button
            onClick={onOpenQuiz}
            className="px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            🧠 Couple Quiz
          </button>
        </div>

        {/* Scroll back up button */}
        <div className="pt-4 flex flex-col items-center gap-2">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:text-white hover:bg-rose-900 transition-colors shadow-lg"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-rose-400/60 font-mono">
            Made with all my heart for 25 November ❤️
          </span>
        </div>
      </div>
    </footer>
  );
}
