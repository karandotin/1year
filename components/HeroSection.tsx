"use client";

import React, { useState, useEffect } from "react";
import { Heart, Sparkles, Clock, Calendar, Edit3, Check, Stars, ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onOpenLetter: () => void;
  onOpenGame: () => void;
  onOpenReasons: () => void;
}

export default function HeroSection({ onOpenLetter, onOpenGame, onOpenReasons }: HeroSectionProps) {
  // Names customization
  const [partnerName, setPartnerName] = useState<string>("Anchal");
  const [yourName, setYourName] = useState<string>("Karan");
  const [isEditingNames, setIsEditingNames] = useState<boolean>(false);

  // Time elapsed state
  const [timeElapsed, setTimeElapsed] = useState({
    days: 365,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalHours: 8760,
  });

  // Load saved names from localStorage
  useEffect(() => {
    try {
      const savedPartner = localStorage.getItem("anniversary_partner_name");
      const savedYour = localStorage.getItem("anniversary_your_name");
      if (savedPartner) setPartnerName(savedPartner);
      if (savedYour) setYourName(savedYour);
    } catch {}
  }, []);

  const saveNames = () => {
    try {
      localStorage.setItem("anniversary_partner_name", partnerName);
      localStorage.setItem("anniversary_your_name", yourName);
    } catch {}
    setIsEditingNames(false);
  };

  // 1 year milestone calculation: Nov 25, 2025 to current time
  useEffect(() => {
    // Start date: 1 year ago (Nov 25, 2025 00:00:00)
    const startDate = new Date(2025, 10, 25, 0, 0, 0); // Month is 0-indexed: 10 = November

    const updateTimer = () => {
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - startDate.getTime());

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const days = Math.floor(totalHours / 24);

      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      setTimeElapsed({
        days,
        hours,
        minutes,
        seconds,
        totalHours,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[380px] h-[380px] bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-purple-600/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Anniversary Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 text-sm md:text-base font-medium mb-6 backdrop-blur-md shadow-lg shadow-rose-950/30 animate-pulse-slow">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>365 Days of Pure Magic • 25 November</span>
        <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-heartbeat" />
      </div>

      {/* Main Heading with Editable Names */}
      <div className="max-w-4xl mx-auto mb-6">
        {isEditingNames ? (
          <div className="bg-[#240815]/95 border border-rose-400/40 p-5 rounded-2xl max-w-md mx-auto shadow-2xl backdrop-blur-lg mb-6">
            <h3 className="text-sm font-semibold text-rose-200 mb-3 flex items-center justify-center gap-1.5">
              <Stars className="w-4 h-4 text-amber-300" /> Personalize Your Names
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-rose-300/80 block text-left mb-1">
                  Her Name / Nickname:
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. My Princess, Sneha, Sweetheart"
                  className="w-full px-3 py-2 bg-rose-950/60 border border-rose-500/40 rounded-lg text-white focus:outline-none focus:border-rose-400 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-rose-300/80 block text-left mb-1">
                  Your Name / Signature:
                </label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="e.g. Yours Forever, Karan"
                  className="w-full px-3 py-2 bg-rose-950/60 border border-rose-500/40 rounded-lg text-white focus:outline-none focus:border-rose-400 text-sm"
                />
              </div>
              <button
                onClick={saveNames}
                className="w-full mt-2 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
              >
                <Check className="w-4 h-4" /> Save Names
              </button>
            </div>
          </div>
        ) : (
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-2 leading-tight">
              Happy 1st Anniversary,{" "}
              <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent text-glow">
                {partnerName}!
              </span>
            </h1>
            <button
              onClick={() => setIsEditingNames(true)}
              className="inline-flex items-center gap-1 text-xs text-rose-300/60 hover:text-rose-200 transition-colors mt-1 px-2.5 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 hover:border-rose-500/50"
              title="Click to personalize names"
            >
              <Edit3 className="w-3 h-3" />
              <span>Customize Names</span>
            </button>
          </div>
        )}

        <p className="text-lg sm:text-xl md:text-2xl text-rose-200/90 font-light mt-4 max-w-2xl mx-auto leading-relaxed">
          &ldquo;One whole year of laughter, kisses, hugs, inside jokes, and falling deeper in love with you every single second.&rdquo;
        </p>
      </div>

      {/* Live Counting Love Clock */}
      <div className="w-full max-w-3xl mx-auto my-6 p-6 rounded-3xl glass-card box-glow">
        <div className="flex items-center justify-center gap-2 text-rose-300 text-xs md:text-sm uppercase tracking-widest font-semibold mb-4">
          <Clock className="w-4 h-4 text-rose-400" />
          <span>We Have Been In Love For</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Days */}
          <div className="bg-gradient-to-b from-rose-950/70 to-rose-900/30 border border-rose-500/30 rounded-2xl p-4 flex flex-col items-center shadow-inner">
            <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200">
              {timeElapsed.days}
            </span>
            <span className="text-xs uppercase font-medium text-rose-300/80 mt-1">Days</span>
          </div>

          {/* Hours */}
          <div className="bg-gradient-to-b from-rose-950/70 to-rose-900/30 border border-rose-500/30 rounded-2xl p-4 flex flex-col items-center shadow-inner">
            <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200">
              {String(timeElapsed.hours).padStart(2, "0")}
            </span>
            <span className="text-xs uppercase font-medium text-rose-300/80 mt-1">Hours</span>
          </div>

          {/* Minutes */}
          <div className="bg-gradient-to-b from-rose-950/70 to-rose-900/30 border border-rose-500/30 rounded-2xl p-4 flex flex-col items-center shadow-inner">
            <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200">
              {String(timeElapsed.minutes).padStart(2, "0")}
            </span>
            <span className="text-xs uppercase font-medium text-rose-300/80 mt-1">Minutes</span>
          </div>

          {/* Seconds */}
          <div className="bg-gradient-to-b from-rose-950/70 to-rose-900/30 border border-rose-500/30 rounded-2xl p-4 flex flex-col items-center shadow-inner">
            <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-rose-300">
              {String(timeElapsed.seconds).padStart(2, "0")}
            </span>
            <span className="text-xs uppercase font-medium text-rose-300/80 mt-1">Seconds</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-rose-500/20 text-xs md:text-sm text-rose-300/80 italic flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
          <span>And I would choose you all over again in every lifetime.</span>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 z-20">
        <button
          onClick={onOpenLetter}
          className="group relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-semibold shadow-xl shadow-rose-600/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="text-lg">💌</span>
          <span>Open My Love Letter</span>
          <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
        </button>

        <button
          onClick={onOpenGame}
          className="group px-6 py-3.5 rounded-2xl bg-[#2a0e1c] hover:bg-[#381325] border border-rose-500/40 text-rose-100 font-semibold shadow-lg hover:shadow-rose-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="text-lg">🎮</span>
          <span>Play &quot;Catch My Love&quot;</span>
        </button>

        <button
          onClick={onOpenReasons}
          className="px-6 py-3.5 rounded-2xl bg-[#1f0b16] hover:bg-[#2b1020] border border-pink-500/30 text-pink-200 font-medium hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="text-lg">✨</span>
          <span>Why I Love You</span>
        </button>
      </div>

      {/* Down arrow scroll helper */}
      <a
        href="#milestones"
        className="mt-12 text-rose-400/60 hover:text-rose-300 transition-colors flex flex-col items-center gap-1 text-xs uppercase tracking-wider"
      >
        <span>Explore Our Journey</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
}
