"use client";

import React from "react";
import { Sparkles, Clock, Calendar, Heart } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";
import { Countdown } from "./Countdown";
import { FadeSlideImage } from "@/components/ui/FadeSlideImage";

export function CountdownSection() {
  const { event } = EVENT_DETAILS;

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 relative z-10">
      <FadeSlideImage direction="up" className="mx-auto max-w-3xl">
        {/* Transparent & Borderless Container so inner ticket card floats directly on the page background */}
        <div className="relative bg-transparent border-none shadow-none p-4 sm:p-10 text-center transition-all duration-700">

          {/* Realistic Scrapbook Tape Header */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-52 h-8 bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 backdrop-blur-md rounded-sm border border-pink-300 shadow-md transform rotate-1 flex items-center justify-center text-xs font-bold text-pink-900 tracking-widest uppercase select-none gap-1.5">
            <Clock className="h-3.5 w-3.5 text-pink-700" />
            <span>Event Countdown</span>
          </div>

          {/* Corner Badge */}
          <div className="absolute -top-3 left-4 sm:left-8 z-30 hidden sm:flex items-center gap-1 px-3 py-1 bg-white border border-pink-200 rounded-full text-[10px] font-bold text-pink-600 uppercase tracking-widest shadow-sm -rotate-2">
            <Calendar className="h-3 w-3 text-pink-500" />
            <span>Mark Your Calendar</span>
          </div>

          <div className="mt-4 mb-8 relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100/80 px-4 py-1.5 text-xs font-bold text-pink-700 mb-3 border border-pink-200/80 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Counting down to the Big Day</span>
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-serif font-bold text-slate-900">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
          </div>

          <div className="relative z-10 bg-gradient-to-br from-pink-50 via-white to-pink-100/80 rounded-3xl p-6 sm:p-10 border-2 border-pink-200 shadow-xl overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#F472B6_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10" />
            
            {/* Ambient Background Glows */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-200/50 rounded-full blur-2xl group-hover:bg-pink-300/50 transition-colors duration-700" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl group-hover:bg-rose-300/50 transition-colors duration-700" />

            {/* Floating Icons */}
            <div className="absolute top-6 left-6 text-pink-300/40 -rotate-12 animate-pulse pointer-events-none">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="absolute bottom-6 right-8 text-pink-400/20 rotate-12 pointer-events-none">
              <Clock className="h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <div className="absolute top-1/2 right-12 text-pink-300/30 rotate-45 -translate-y-1/2 pointer-events-none hidden sm:block">
              <Heart className="h-6 w-6" />
            </div>

            <div className="relative z-10">
              <Countdown targetDate={event.date} />
            </div>
          </div>
        </div>
      </FadeSlideImage>
    </section>
  );
}
