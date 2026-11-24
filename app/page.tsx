"use client";

import React, { useState } from "react";
import FloatingHeartsBackground from "@/components/FloatingHeartsBackground";
import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import PhotoGallery from "@/components/PhotoGallery";
import LoveLetterModal from "@/components/LoveLetterModal";
import CatchLoveGame from "@/components/CatchLoveGame";
import LoveCoupons from "@/components/LoveCoupons";
import ReasonsJar from "@/components/ReasonsJar";
import AnniversaryQuiz from "@/components/AnniversaryQuiz";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  // Modal states
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isCouponsOpen, setIsCouponsOpen] = useState(false);
  const [isReasonsOpen, setIsReasonsOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0c0309] text-rose-50 relative selection:bg-rose-500 selection:text-white">
      {/* Floating Canvas Particles */}
      <FloatingHeartsBackground interactive={true} />

      {/* Floating Music Player */}
      <MusicPlayer />

      {/* Navigation Bar */}
      <Navbar
        onOpenLetter={() => setIsLetterOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
        onOpenCoupons={() => setIsCouponsOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Hero Section with Live Timer & Names */}
      <HeroSection
        onOpenLetter={() => setIsLetterOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
        onOpenReasons={() => setIsReasonsOpen(true)}
      />

      {/* Milestones Timeline */}
      <MilestoneTimeline />

      {/* Polaroid Photo Gallery */}
      <PhotoGallery />

      {/* Modals */}
      <LoveLetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
      />

      <CatchLoveGame
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        onOpenCoupons={() => {
          setIsGameOpen(false);
          setIsCouponsOpen(true);
        }}
      />

      <LoveCoupons
        isOpen={isCouponsOpen}
        onClose={() => setIsCouponsOpen(false)}
      />

      <ReasonsJar
        isOpen={isReasonsOpen}
        onClose={() => setIsReasonsOpen(false)}
      />

      <AnniversaryQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      {/* Footer */}
      <FooterSection
        onOpenLetter={() => setIsLetterOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
        onOpenReasons={() => setIsReasonsOpen(true)}
        onOpenCoupons={() => setIsCouponsOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />
    </main>
  );
}
