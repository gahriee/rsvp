"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Award, Heart, Ticket } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";
import { FadeSlideImage } from "@/components/ui/FadeSlideImage";

export function Hero() {
  const { graduate } = EVENT_DETAILS;

  return (
    <section className="relative overflow-visible px-4 pt-16 pb-14 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[85vh]">
      {/* Ambient warm glowing floral & pastel orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[550px] w-[800px] -translate-x-1/2 rounded-full bg-pink-200/50 blur-3xl transition-opacity duration-1000 animate-pulse" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-[400px] w-[400px] rounded-full bg-amber-100/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-pink-100/70 blur-3xl" />

      <div className="mx-auto max-w-5xl w-full text-center relative z-10">

        {/* Transparent & Borderless Grand Scrapbook Folio Spread Case */}
        <FadeSlideImage direction="up" delay={250}>
          <div className="relative bg-transparent border-none shadow-none p-4 sm:p-10 transition-all duration-700 ease-out">

            {/* Realistic Multi-Layered Washi Tape Accents across Top Rim */}
            <div className="absolute -top-4 left-6 sm:left-16 z-30 w-44 sm:w-52 h-8 bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 backdrop-blur-md rounded-sm border border-pink-300 shadow-md transform -rotate-3 flex items-center justify-center text-[11px] font-bold text-pink-900 tracking-widest uppercase gap-1.5 select-none">
              <Award className="h-3.5 w-3.5 text-pink-700" />
              <span>Graduate Spotlight</span>
            </div>
            <div className="absolute -top-4 right-6 sm:right-16 z-30 w-40 sm:w-48 h-8 bg-gradient-to-r from-pink-100 to-rose-200 backdrop-blur-md rounded-sm border border-pink-300 shadow-md transform rotate-2 hidden sm:flex items-center justify-center text-[11px] font-bold text-pink-900 tracking-widest uppercase gap-1.5 select-none">
              <Sparkles className="h-3.5 w-3.5 text-pink-700" />
              <span>Milestone 2026</span>
            </div>


            {/* Floating Ephemera Card 2: Perforated Invitation Tag (Pinned to the Bottom Left outside Polaroid) */}
            <div className="absolute -left-2 sm:-left-8 bottom-14 z-40 hidden lg:flex items-center gap-3 bg-[#FAF5EE] p-4 rounded-2xl border-2 border-dashed border-pink-300 shadow-xl -rotate-6 transition-transform hover:rotate-0 hover:scale-105 select-none">
              <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-md">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-pink-600">RSVP Admission</span>
                <span className="block text-xs font-serif font-bold text-slate-900">Irish&apos;s Celebration</span>
              </div>
            </div>

            {/* Center Polaroid Masterpiece Portrait Card */}
            <div className="relative mx-auto max-w-xl z-20">
              <div className="group relative bg-white rounded-3xl p-5 sm:p-7 pb-12 sm:pb-16 shadow-2xl border-[5px] border-white ring-1 ring-pink-200/80 transform -rotate-1 transition-all duration-700 ease-out hover:rotate-0 hover:scale-[1.01] hover:shadow-[0_25px_60px_-10px_rgba(236,72,153,0.35)]">
                
                {/* Washi Tape Holding Top of Polaroid Frame */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 w-44 h-7 bg-pink-200/90 backdrop-blur-md rounded-sm border border-pink-300/80 shadow-sm transform rotate-1 group-hover:-rotate-1 transition-transform flex items-center justify-center text-[10px] font-extrabold text-pink-900 tracking-widest uppercase select-none">
                  <span>Photo Keepsake</span>
                </div>

                {/* Inner Photo Container with subtle inner shadow */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-pink-50/70 shadow-inner border border-pink-100">
                  <Image
                    src={graduate.photoUrl}
                    alt={graduate.fullName}
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 550px"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  
                  {/* Floating Degree Ribbon Badge inside top corner of photo */}
                  <div className="absolute top-4 right-4 z-20 rounded-full bg-white/95 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold text-pink-800 shadow-lg border border-pink-200 flex items-center gap-1.5">
                    <span>{graduate.degree}</span>
                    <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                  </div>

                  {/* Corner Class Badge overlay inside bottom of photo */}
                  <div className="absolute bottom-4 left-4 z-20 rounded-full bg-slate-900/80 backdrop-blur-md px-3.5 py-1 text-[11px] font-mono font-bold text-white shadow-md border border-white/20 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-pink-300" />
                    <span>CLASS OF {graduate.classYear}</span>
                  </div>
                </div>

                {/* Handwritten Polaroid Caption Area right on the thick bottom white border */}
                <div className="mt-6 text-center px-2">
                  <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    <span>{graduate.fullName}</span>
                  </h1>
                  <div className="mx-auto mt-3.5 h-0.5 w-24 bg-pink-300 rounded-full" />
                  <p className="mt-3 text-xs sm:text-sm font-extrabold uppercase tracking-[0.28em] text-pink-700">
                    {graduate.major} · {graduate.university}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm font-serif italic text-slate-500 max-w-md mx-auto">
                    &ldquo;Celebrating four years of dedication, growth, and academic achievement.&rdquo;
                  </p>
                </div>

                {/* Decorative Corner Flourish Heart */}
                <div className="absolute -bottom-5 -right-5 z-30 rounded-full bg-white border-2 border-pink-200 p-3.5 shadow-xl transform rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110">
                  <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
                </div>
              </div>
            </div>
          </div>
        </FadeSlideImage>
      </div>
    </section>
  );
}
