"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, RefreshCw, Plus, X, Check, Stars } from "lucide-react";

const initialReasons = [
  "The adorable way your eyes crinkle whenever you laugh really hard.",
  "How you automatically reach for my hand whenever we walk across the street.",
  "Your sweet morning voice that instantly makes my day brighter.",
  "How you make even the simplest grocery run feel like an adventure.",
  "The way you remember tiny details about what I like.",
  "How safe and completely at peace I feel whenever you are in my arms.",
  "Your kindness and gentle empathy towards animals and everyone around you.",
  "The goofy dances you do when you get excited about good food.",
  "How you listen to me talk about things you don't even care about, just to hear me be excited.",
  "How proud I feel every single day to be the one who gets to love you.",
  "Your warm forehead kisses when I am sleepy.",
  "How you believe in me even on days when I struggle to believe in myself.",
  "The cozy silence we can share without it ever feeling awkward.",
  "How your hugs have this magic power to erase any bad mood.",
  "The way you steal my hoodies because they smell like me.",
  "How beautiful you look when you wake up, before any makeup or brushing hair.",
  "Your laugh — it is hands down my favorite sound in the entire world.",
  "How we can communicate with just one look across a crowded room.",
  "The sweet little love notes and random texts you send me during the day.",
  "How you challenge me to be a kinder, better, more loving human being.",
  "How you make anywhere feel like home, as long as you're with me.",
  "Because loving you is the easiest, most natural thing I have ever done.",
];

interface ReasonsJarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReasonsJar({ isOpen, onClose }: ReasonsJarProps) {
  const [reasons, setReasons] = useState<string[]>(initialReasons);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newReason, setNewReason] = useState<string>("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("anniversary_reasons");
      if (saved) setReasons(JSON.parse(saved));
    } catch {}
  }, []);

  const saveReasons = (updated: string[]) => {
    setReasons(updated);
    try {
      localStorage.setItem("anniversary_reasons", JSON.stringify(updated));
    } catch {}
  };

  const handleDrawNext = () => {
    setIsShaking(true);
    setTimeout(() => {
      let next = Math.floor(Math.random() * reasons.length);
      if (next === currentIndex && reasons.length > 1) {
        next = (next + 1) % reasons.length;
      }
      setCurrentIndex(next);
      setIsShaking(false);
    }, 400);
  };

  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReason.trim()) return;
    const updated = [newReason.trim(), ...reasons];
    saveReasons(updated);
    setCurrentIndex(0);
    setNewReason("");
    setShowAddModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1a0512] border border-rose-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-rose-300 hover:text-white hover:bg-rose-900/40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Jar Icon and Title */}
        <div className="mb-4">
          <div
            onClick={handleDrawNext}
            className={`w-20 h-20 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-400/40 flex items-center justify-center text-4xl shadow-lg cursor-pointer transition-transform ${
              isShaking ? "animate-wiggle scale-110" : "hover:scale-105"
            }`}
            title="Click to shake and draw!"
          >
            🍯
          </div>
          <h3 className="text-xl font-bold text-white mt-3 flex items-center justify-center gap-1.5">
            Why I Love You
            <Sparkles className="w-4 h-4 text-amber-300" />
          </h3>
          <p className="text-xs text-rose-300/80 mt-1">
            Reason #{currentIndex + 1} of {reasons.length}
          </p>
        </div>

        {/* Reason Slip / Card */}
        <div className="bg-gradient-to-br from-[#fef2f2] to-[#fce7f3] text-neutral-900 p-6 rounded-2xl shadow-xl border border-rose-200 min-h-[140px] flex items-center justify-center my-4 relative">
          <Heart className="absolute -top-3 -right-3 w-7 h-7 text-rose-500 fill-rose-500 transform rotate-12 drop-shadow" />
          <p className="font-serif text-base sm:text-lg italic font-medium leading-relaxed text-rose-950">
            &ldquo;{reasons[currentIndex]}&rdquo;
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={handleDrawNext}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isShaking ? "animate-spin" : ""}`} />
            <span>Draw Another Reason</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 text-xs sm:text-sm font-medium flex items-center gap-1.5"
            title="Add your own custom reason"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reason</span>
          </button>
        </div>

        {/* Add Reason Submodal */}
        {showAddModal && (
          <div className="absolute inset-0 bg-[#1a0512] rounded-3xl p-6 z-20 flex flex-col justify-center animate-fadeIn">
            <h4 className="text-base font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Stars className="w-4 h-4 text-amber-300" /> Add a Reason Why You Love Her
            </h4>
            <form onSubmit={handleAddReason} className="space-y-3 mt-2">
              <textarea
                rows={3}
                placeholder="e.g. The way you always save the last bite of dessert for me..."
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-rose-950/70 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                >
                  Save Reason
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
