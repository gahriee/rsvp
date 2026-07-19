"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactPlayer from "react-player";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

export function MusicPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    if (muted) setMuted(false);
  };

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
      {/* Hidden React Player */}
      <div className="hidden">
        <ReactPlayer
          src={url}
          playing={playing}
          volume={volume}
          muted={muted}
          loop={true}
          playsInline
          width="0"
          height="0"
        />
      </div>

      {/* Player UI */}
      {isOpen && (
        <div className="bg-white/90 backdrop-blur-md shadow-xl border border-pink-100 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
              aria-label={playing ? "Pause Music" : "Play Music"}
            >
              {playing ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current translate-x-0.5" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-pink-400 hover:text-pink-600 transition-colors"
                aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 accent-pink-500"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600 hover:scale-105 transition-all duration-200 focus:outline-none"
        aria-label="Toggle Music Player"
      >
        <Music className={`h-5 w-5 ${playing ? "animate-pulse" : ""}`} />
      </button>
    </div>,
    document.body
  );
}
