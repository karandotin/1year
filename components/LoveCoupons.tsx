"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, X, Check, Heart, Ticket, RefreshCw, Plus } from "lucide-react";

interface Coupon {
  id: string;
  title: string;
  description: string;
  category: string;
  redeemed: boolean;
  redeemedDate?: string;
  icon: string;
}

const defaultCoupons: Coupon[] = [
  {
    id: "c1",
    title: "30-Min Relaxing Massage",
    description: "Valid for a cozy neck, back, or foot massage whenever you feel tired. Scented lotion included!",
    category: "Relaxation",
    redeemed: false,
    icon: "💆‍♀️",
  },
  {
    id: "c2",
    title: "Dinner Date Anywhere",
    description: "You pick any restaurant or cuisine your heart craves. No budget questions, dessert is a must!",
    category: "Food & Romance",
    redeemed: false,
    icon: "🍝",
  },
  {
    id: "c3",
    title: "Movie Night Choice Pass",
    description: "You get full remote control privileges. No complaints, full popcorn sharing guaranteed.",
    category: "Cozy Night",
    redeemed: false,
    icon: "🎬",
  },
  {
    id: "c4",
    title: "Midnight Dessert / Ice Cream Run",
    description: "Craving late night chocolate, ice cream, or waffles? I will fetch it immediately.",
    category: "Sweet Tooth",
    redeemed: false,
    icon: "🍦",
  },
  {
    id: "c5",
    title: "Win Any Argument Ticket",
    description: "Play this card anytime, and I will instantly admit you were right and surrender with a hug.",
    category: "Golden Pass",
    redeemed: false,
    icon: "👑",
  },
  {
    id: "c6",
    title: "One Universal Free Wish",
    description: "Whatever you want — a weekend trip, a special gift, or a silly dare — your wish is my command.",
    category: "Magic Wish",
    redeemed: false,
    icon: "✨",
  },
];

interface LoveCouponsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoveCoupons({ isOpen, onClose }: LoveCouponsProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(defaultCoupons);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("anniversary_coupons");
      if (saved) {
        setCoupons(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveCoupons = (updated: Coupon[]) => {
    setCoupons(updated);
    try {
      localStorage.setItem("anniversary_coupons", JSON.stringify(updated));
    } catch {}
  };

  const handleRedeem = (id: string) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const updated = coupons.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          redeemed: !c.redeemed,
          redeemedDate: !c.redeemed ? today : undefined,
        };
      }
      return c;
    });

    saveCoupons(updated);
    const target = updated.find((c) => c.id === id);
    if (target?.redeemed) {
      setShowCelebration(`🎉 Coupon Redeemed: "${target.title}"! Get ready for pampering!`);
      setTimeout(() => setShowCelebration(null), 4000);
    }
  };

  const resetAll = () => {
    if (confirm("Reset all coupons to unredeemed?")) {
      const reset = coupons.map((c) => ({ ...c, redeemed: false, redeemedDate: undefined }));
      saveCoupons(reset);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1b0612] border border-rose-500/40 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎟️</span>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Anniversary Love Coupons
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-rose-300/80">
                Special vouchers redeemable anytime. No expiration date!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-rose-300 hover:text-white hover:bg-rose-900/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Celebration Toast */}
        {showCelebration && (
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs sm:text-sm rounded-2xl text-center shadow-lg animate-bounce">
            {showCelebration}
          </div>
        )}

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`relative rounded-2xl p-4 transition-all duration-300 border ${
                coupon.redeemed
                  ? "bg-rose-950/20 border-rose-900/30 opacity-75"
                  : "bg-gradient-to-br from-[#2a0c1e] to-[#1c0715] border-rose-400/30 shadow-lg hover:border-rose-400/60 hover:-translate-y-0.5"
              }`}
            >
              {/* Decorative cutout notches on sides */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1b0612] border-r border-rose-500/40" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1b0612] border-l border-rose-500/40" />

              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl">{coupon.icon}</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {coupon.category}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">{coupon.title}</h4>
              <p className="text-xs text-rose-200/75 leading-relaxed min-h-[38px]">
                {coupon.description}
              </p>

              <div className="mt-4 pt-3 border-t border-dashed border-rose-500/30 flex items-center justify-between">
                {coupon.redeemed ? (
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>Redeemed ({coupon.redeemedDate})</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-300/80 font-mono">100% Guaranteed</span>
                )}

                <button
                  onClick={() => handleRedeem(coupon.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    coupon.redeemed
                      ? "bg-rose-900/40 hover:bg-rose-900/60 text-rose-300"
                      : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-rose-600/30 active:scale-95"
                  }`}
                >
                  {coupon.redeemed ? "Mark Unused" : "Redeem Now ❤️"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-rose-500/20 flex items-center justify-between">
          <button
            onClick={resetAll}
            className="text-xs text-rose-400/60 hover:text-rose-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset All Coupons</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
