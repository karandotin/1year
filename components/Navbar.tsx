"use client";

import React from "react";
import { Heart, Sparkles, Gamepad2, Gift, Camera, Clock } from "lucide-react";

interface NavbarProps {
  onOpenLetter: () => void;
  onOpenGame: () => void;
  onOpenCoupons: () => void;
  onOpenQuiz: () => void;
}

export default function Navbar({
  onOpenLetter,
  onOpenGame,
  onOpenCoupons,
  onOpenQuiz,
}: NavbarProps) {
  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-3 sm:px-6 max-w-5xl mx-auto">
      <div className="bg-[#190610]/85 backdrop-blur-md border border-rose-500/30 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/40 group-hover:scale-110 transition-transform">
            <Heart className="w-4 h-4 fill-white animate-heartbeat" />
          </div>
          <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-white group-hover:text-rose-200 transition-colors">
            Our 365 Days
          </span>
        </a>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-rose-200/80">
          <a href="#milestones" className="hover:text-white transition-colors flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>Milestones</span>
          </a>
          <a href="#gallery" className="hover:text-white transition-colors flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>Polaroids</span>
          </a>
          <button
            onClick={onOpenCoupons}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Gift className="w-3.5 h-3.5 text-rose-400" />
            <span>Coupons</span>
          </button>
          <button
            onClick={onOpenQuiz}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Quiz</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGame}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-200 hover:text-white hover:bg-rose-900/50 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Play Catch My Love"
          >
            <Gamepad2 className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Mini Game</span>
          </button>

          <button
            onClick={onOpenLetter}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
          >
            <span>💌</span>
            <span>Love Letter</span>
          </button>
        </div>
      </div>
    </header>
  );
}
