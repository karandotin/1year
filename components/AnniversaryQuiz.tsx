"use client";

import React, { useState } from "react";
import { Sparkles, Heart, CheckCircle2, XCircle, Trophy, RefreshCw, X } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  sweetRemark: string;
}

const defaultQuestions: Question[] = [
  {
    id: 1,
    question: "Who is the cute one in our relationship?",
    options: ["You, obviously!", "Me (I try)", "Both of us together", "Our future Baby!"],
    correctIndex: 2,
    sweetRemark: "Trick question — we are the cutest duo on planet Earth! 💖",
  },
  {
    id: 2,
    question: "Who takes longer to decide what to eat?",
    options: ["You (100%)", "Me (sometimes)", "We both starve debating it", "The menu is too big!"],
    correctIndex: 2,
    sweetRemark: "The classic 'I don't mind, whatever you want' loop! 😂",
  },
  {
    id: 3,
    question: "How much do I love you?",
    options: ["To the moon and back", "More than words can ever describe", "Infinite times infinity", "All of the above and more!"],
    correctIndex: 3,
    sweetRemark: "My love for you grows bigger with every single breath I take. ❤️",
  },
];

interface AnniversaryQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnniversaryQuiz({ isOpen, onClose }: AnniversaryQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setScore(score + 1); // Every answer is sweet in love!
  };

  const handleNext = () => {
    if (currentQuestion + 1 < defaultQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const q = defaultQuestions[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1b0612] border border-rose-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-rose-300 hover:text-white hover:bg-rose-900/40"
        >
          <X className="w-5 h-5" />
        </button>

        {!quizFinished ? (
          <div>
            <div className="text-center mb-6">
              <span className="text-2xl">🧠💘</span>
              <h3 className="text-xl font-bold text-white mt-1">Our Couple Quiz</h3>
              <p className="text-xs text-rose-300/80">
                Question {currentQuestion + 1} of {defaultQuestions.length}
              </p>
            </div>

            <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl mb-4">
              <h4 className="text-base sm:text-lg font-semibold text-rose-100 text-center">
                {q.question}
              </h4>
            </div>

            <div className="space-y-2.5">
              {q.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all border ${
                      isSelected
                        ? "bg-rose-600/40 border-rose-400 text-white font-bold shadow-md"
                        : "bg-rose-950/20 border-rose-500/20 text-rose-200 hover:border-rose-400/50 hover:bg-rose-900/30"
                    }`}
                  >
                    <span className="inline-block w-6 text-rose-400 font-mono">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-4 p-3 bg-rose-900/40 border border-rose-400/30 rounded-xl text-xs sm:text-sm text-rose-200 text-center animate-fadeIn">
                <p className="font-semibold">{q.sweetRemark}</p>
                <button
                  onClick={handleNext}
                  className="mt-3 px-5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  {currentQuestion + 1 < defaultQuestions.length ? "Next Question ✨" : "See Results 🏆"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            <h3 className="text-2xl font-bold text-white">100% Soulmate Compatibility!</h3>
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed max-w-xs mx-auto">
              You both passed with flying colors! 365 days of being completely, unapologetically perfect for each other.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs rounded-xl hover:bg-rose-900/40 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
