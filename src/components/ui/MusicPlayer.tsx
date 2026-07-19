"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactPlayer from "react-player";
import { Play, Pause } from "lucide-react";

export function MusicPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setPlaying(true);
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => setPlaying(!playing);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
      {/* Hidden React Player */}
      <div className="hidden">
        <ReactPlayer
          src={url}
          playing={playing}
          volume={0.5}
          muted={false}
          loop={true}
          playsInline
          width="0"
          height="0"
        />
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={togglePlay}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600 hover:scale-105 transition-all duration-200 focus:outline-none"
        aria-label={playing ? "Pause Music" : "Play Music"}
      >
        {playing ? (
          <Pause className="h-5 w-5 fill-current" />
        ) : (
          <Play className="h-5 w-5 fill-current translate-x-0.5" />
        )}
      </button>
    </div>,
    document.body
  );
}
