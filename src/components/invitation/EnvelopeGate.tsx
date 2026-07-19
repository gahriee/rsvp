"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, GraduationCap } from "lucide-react";
import confetti from "canvas-confetti";

interface EnvelopeGateProps {
  children: React.ReactNode;
}

export function EnvelopeGate({ children }: EnvelopeGateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      // 1. Trigger Confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#F472B6", "#FB7185", "#FCA5A5", "#FDE047", "#6EE7B7"]
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#F472B6", "#FB7185", "#FCA5A5", "#FDE047", "#6EE7B7"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // 2. Timers for animation sequence
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        document.body.style.overflow = "";
      }, 200);

      const doneTimer = setTimeout(() => {
        setIsAnimationDone(true);
      }, 900);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Website content rendered beneath / inside envelope gate */}
      <div
        className={`transition-all duration-700 ease-out ${
          isFadingOut
            ? isAnimationDone ? "opacity-100" : "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none max-h-screen overflow-hidden"
        }`}
      >
        {children}
      </div>

      {/* Fullscreen Realistic Envelope Modal */}
      {!isAnimationDone && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#FDFBF7] via-[#F8F1E7] to-[#EFE5D8] p-4 sm:p-8 transition-all duration-700 ease-in-out select-none ${
            isFadingOut ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          {/* Subtle botanical polka dot pattern texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#E8B4B8_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-35 pointer-events-none" />

          {/* Ambient Warm Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-300/30 blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />

          {/* Central Wax Seal */}
          <div
            onClick={handleOpen}
            className={`z-40 flex flex-col items-center justify-center pointer-events-auto transition-all duration-500 ease-in-out cursor-pointer group ${
              isOpen ? "opacity-0 scale-[3] pointer-events-none blur-md" : "opacity-100 scale-100 hover:scale-110 hover:rotate-6"
            }`}
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#C43350] via-[#D84160] to-[#8C1D33] border-4 border-[#E88096]/80 shadow-[0_14px_35px_rgba(150,30,55,0.6)] flex flex-col items-center justify-center text-white group-hover:shadow-[0_18px_45px_rgba(150,30,55,0.8)]">
              <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 drop-shadow-md" />
              <span className="text-[12px] sm:text-sm font-serif font-extrabold tracking-[0.2em] uppercase mt-1 drop-shadow">
                2026
              </span>
            </div>
          </div>

          {/* Animated Call-to-Action Below Seal */}
          <div className={`mt-12 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-6 py-2.5 text-xs sm:text-sm font-bold text-pink-900 shadow-xl border border-pink-200 animate-bounce transition-opacity duration-500 ${isOpen ? "opacity-0" : "opacity-100"}`}>
            <Sparkles className="h-4 w-4 text-pink-600" />
            <span>Click or Tap Wax Seal</span>
            <Sparkles className="h-4 w-4 text-pink-600" />
          </div>
        </div>
      )}
    </div>
  );
}
