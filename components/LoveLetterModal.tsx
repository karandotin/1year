"use client";

import React, { useState, useEffect } from "react";
import { Heart, Sparkles, X, Edit3, Check, Mail, Lock } from "lucide-react";

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultLetter = `My Dearest Khargosh 🐰,

Happy 1st Anniversary! ❤️

I have spent the last 365 days trying to figure out what I did to get so lucky. Exactly one year ago today, on 25 November, you walked into my world, and ever since, you have turned ordinary moments into pure magic.

Thank you for your warm hugs when the days get heavy. Thank you for your silly giggles, and how you hold my hand like you never want to let go. 

Over this past year, we have shared quiet dates, late-night talks that lasted until we were too tired to continue, and moments where no words were needed at all. Through every high and every quiet day, having you by my side has been the greatest gift of my life.

You are my favorite notification, my sweetest daydream, my safest harbor, and my best friend. 

One whole year down, and my love for you is only just beginning. Here is to 365 days behind us, and a lifetime of adventures still ahead of us.

Forever and always yours,
With all my heart ❤️
🐸`;

export default function LoveLetterModal({ isOpen, onClose }: LoveLetterModalProps) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [letterContent, setLetterContent] = useState<string>(defaultLetter);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Audio Context for wax seal sound
  const playWaxSealSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("anniversary_custom_letter");
      if (saved) setLetterContent(saved);
    } catch {}
  }, []);

  const saveLetter = () => {
    try {
      localStorage.setItem("anniversary_custom_letter", letterContent);
    } catch {}
    setIsEditing(false);
  };

  const handleOpenEnvelope = () => {
    playWaxSealSound();
    setIsOpened(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-2xl w-full flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!isOpened ? (
          /* Sealed Envelope View */
          <div
            onClick={handleOpenEnvelope}
            className="w-full max-w-md bg-gradient-to-br from-[#f8e1eb] to-[#f4c2d7] rounded-3xl p-8 sm:p-12 shadow-2xl text-center cursor-pointer transform hover:scale-105 transition-all duration-300 border-4 border-rose-300 relative group"
          >
            {/* Top Envelope Flap triangle styling */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-[#f2bfd5] clip-path-triangle opacity-80 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-600 border-4 border-rose-200 shadow-xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
              </div>

              <div>
                <p className="text-xs uppercase font-mono tracking-widest text-rose-900 font-bold">
                  25 November • 1st Anniversary
                </p>
                <h3 className="text-2xl font-serif font-bold text-rose-950 mt-1">
                  For The Love Of My Life
                </h3>
                <p className="text-xs text-rose-800/80 mt-1 italic">
                  Private & Confidential • Strictly For Your Eyes Only
                </p>
              </div>

              <div className="pt-4">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-600/40 group-hover:bg-rose-500 transition-colors">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Tap to Break The Seal & Read</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Unfolded Parchment Love Letter View */
          <div className="w-full bg-[#fdfbf7] text-neutral-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-rose-200 max-h-[85vh] overflow-y-auto relative animate-fadeIn">
            {/* Stamp & Header */}
            <div className="flex items-center justify-between border-b border-rose-200/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💌</span>
                <div>
                  <h4 className="text-lg font-serif font-bold text-rose-950">
                    A Letter From My Heart
                  </h4>
                  <span className="text-[11px] font-mono text-rose-800">
                    November 25, 2026 • 365 Days
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Cancel" : "Edit Letter"}</span>
                </button>
              </div>
            </div>

            {/* Letter Body */}
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  rows={14}
                  className="w-full p-4 rounded-xl bg-white border border-rose-300 font-serif text-sm leading-relaxed text-neutral-800 focus:outline-none focus:border-rose-500 shadow-inner"
                />
                <button
                  onClick={saveLetter}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-sm shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Personal Letter
                </button>
              </div>
            ) : (
              <div className="prose prose-rose max-w-none">
                <div className="font-serif text-sm sm:text-base leading-relaxed text-neutral-800 whitespace-pre-line tracking-wide">
                  {letterContent}
                </div>
              </div>
            )}

            {/* Bottom Seal Decoration */}
            <div className="mt-8 pt-4 border-t border-rose-200/80 flex items-center justify-between text-xs text-rose-800/80 font-serif">
              <span>Sealed with infinite love ❤️</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Close Letter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
