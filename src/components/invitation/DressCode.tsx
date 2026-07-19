"use client";

import React from "react";
import { Shirt, Palette, Sparkles } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";
import { FadeSlideImage } from "@/components/ui/FadeSlideImage";

export function DressCode() {
  const dressCode = EVENT_DETAILS.dressCodeDetails;

  if (!dressCode || !dressCode.swatches) return null;

  return (
    <section id="dresscode" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
      <FadeSlideImage direction="up">
        {/* Transparent & Borderless Container so internal swatch box floats right on page background */}
        <div className="relative bg-transparent border-none shadow-none p-4 sm:p-10 text-center transition-all duration-700 ease-out">

          {/* Decorative Scrapbook Tape Header */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-56 h-8 bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 backdrop-blur-md rounded-sm border border-pink-300 shadow-md transform rotate-1 flex items-center justify-center text-xs font-bold text-pink-900 tracking-widest uppercase select-none gap-1.5">
            <Shirt className="h-3.5 w-3.5 text-pink-700" />
            <span>Attire Palette Guide</span>
          </div>

          {/* Corner Foil Badge */}
          <div className="absolute -top-3 right-4 sm:right-12 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white border border-pink-200 rounded-full text-[10px] font-bold text-pink-600 uppercase tracking-widest shadow-sm -rotate-2">
            <Palette className="h-3 w-3 text-pink-500" />
            <span>Curated Swatches</span>
          </div>

          {/* Header Replicating Reference Image Aesthetic */}
          <div className="mt-4 mb-10 relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100/80 px-4 py-1.5 text-xs font-bold text-pink-700 mb-3 border border-pink-200/80 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dress Code</span>
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-normal flex items-center justify-center gap-2">
              <span>Color Palette Inspiration</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-semibold tracking-[0.3em] text-pink-600 uppercase">
              {dressCode.subtitle}
            </p>
            <div className="mx-auto mt-4 h-0.5 w-24 bg-pink-300 rounded-full" />
          </div>

          {/* Color Swatch Circle Grid framed inside a Polaroid Palette Box */}
          <div className="relative rounded-3xl bg-white border-2 border-pink-200 p-6 sm:p-10 shadow-xl max-w-3xl mx-auto mb-8 z-10">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 sm:gap-8 justify-items-center py-4">
              {dressCode.swatches.map((swatch, idx) => (
                <FadeSlideImage key={idx} direction="up" delay={idx * 80}>
                  <div className="group flex flex-col items-center transition-transform hover:scale-110">
                    <div
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-inner border-2 border-white ring-2 ring-pink-100 transition-all group-hover:ring-pink-300 group-hover:shadow-lg"
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                    <span className="mt-2.5 text-[11px] font-bold text-slate-700 tracking-wide font-serif text-center max-w-[80px] leading-tight group-hover:text-pink-700 transition-colors">
                      {swatch.name}
                    </span>
                  </div>
                </FadeSlideImage>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-pink-200 text-center font-serif italic text-xs text-slate-400">
              Pick a shade from our bespoke color story or choose complimentary pastel tones for the evening.
            </div>
          </div>

          {/* Guidelines Description Note */}
          <FadeSlideImage direction="up" delay={400}>
            <div className="pt-2 max-w-2xl mx-auto relative z-10">
              <p className="text-sm sm:text-base text-slate-700 font-serif leading-relaxed italic bg-white/80 rounded-2xl p-5 border border-pink-200 shadow-sm">
                &ldquo;{dressCode.description}&rdquo;
              </p>
            </div>
          </FadeSlideImage>
        </div>
      </FadeSlideImage>
    </section>
  );
}
