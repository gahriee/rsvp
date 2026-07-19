"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
}

export function TypewriterText({
  text,
  speed = 45,
  delay = 200,
  className = "",
  showCursor = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startTimer = setTimeout(() => {
      setHasStarted(true);
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsCompleted(true);
        }
      };

      typeNextChar();
    }, delay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay]);

  return (
    <span className={`inline-block ${className}`}>
      <span>{displayedText}</span>
      {showCursor && hasStarted && !isCompleted && (
        <span className="ml-1 inline-block w-0.5 h-[1em] bg-pink-500 animate-pulse align-middle" />
      )}
    </span>
  );
}
