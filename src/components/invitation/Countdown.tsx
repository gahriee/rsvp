"use client";

import React, { useState, useEffect } from "react";
import { PartyPopper } from "lucide-react";

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="my-8 grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-2xl bg-white/70 backdrop-blur-md border border-pink-200/60 p-4 shadow-md animate-pulse h-24 sm:h-28"
          />
        ))}
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="my-8 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 backdrop-blur-md border border-pink-300/60 p-6 text-center shadow-lg max-w-lg mx-auto flex items-center justify-center gap-2">
        <PartyPopper className="h-6 w-6 text-pink-600" />
        <p className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-wide">
          Today is the Celebration!
        </p>
      </div>
    );
  }

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="my-8 grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
      {timeBlocks.map((block) => (
        <div
          key={block.label}
          className="relative overflow-hidden flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-md border border-pink-200/80 p-3 sm:p-4 shadow-lg transition-transform hover:scale-105 hover:border-pink-400 group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/20 via-transparent to-rose-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums font-serif">
            {String(block.value).padStart(2, "0")}
          </span>
          <span className="relative z-10 mt-1 text-xs sm:text-sm font-semibold text-pink-500 uppercase tracking-wider">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}

