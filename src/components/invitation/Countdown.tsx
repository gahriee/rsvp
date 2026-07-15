"use client";

import React, { useState, useEffect } from "react";

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
            className="flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 shadow-lg animate-pulse h-24 sm:h-28"
          />
        ))}
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="my-8 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 backdrop-blur-md border border-amber-300/40 p-6 text-center shadow-lg max-w-lg mx-auto">
        <p className="text-xl sm:text-2xl font-bold text-amber-200 tracking-wide">
          🎉 Today is the Celebration! 🎉
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
          className="flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 shadow-xl transition-transform hover:scale-105"
        >
          <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
            {String(block.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs sm:text-sm font-medium text-blue-200 uppercase tracking-wider">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
