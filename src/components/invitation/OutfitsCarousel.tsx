"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Sparkles, Heart } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";
import { FadeSlideImage } from "@/components/ui/FadeSlideImage";

const OUTFITS = [
  {
    id: "toga",
    title: "The Graduate",
    description: "The culmination of four years of hard work.",
    images: Array.from({ length: 4 }).map((_, i) => `/togapic_${i + 1}.JPG`)
  },
  {
    id: "corporate",
    title: "Corporate Ready",
    description: "Stepping into the professional world.",
    images: Array.from({ length: 6 }).map((_, i) => `/corporate_${i + 1}.JPG`)
  },
  {
    id: "schoolattire",
    title: "Campus Days",
    description: "Memories walking the halls of OLFU.",
    images: Array.from({ length: 7 }).map((_, i) => `/schoolattire_${i + 1}.JPG`)
  }
];

function Photocard({ images, currentIndex, tiltClass }: { images: string[], currentIndex: number, tiltClass: string }) {
  return (
    <div className={`relative w-[280px] lg:w-[300px] shrink-0 aspect-[2.5/3.5] bg-pink-50 rounded-[1.5rem] border-[6px] border-white shadow-xl shadow-pink-900/10 overflow-hidden group transition-all duration-1000 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:z-10 ${tiltClass}`}>
      {/* Holographic / Glossy effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/20 via-transparent to-white/40 pointer-events-none z-20" />
      
      {/* Cute Stickers & Embellishments */}
      <Heart className="absolute top-4 left-4 h-6 w-6 text-pink-400 fill-pink-400/50 -rotate-12 z-30 drop-shadow-sm opacity-80" />
      <Sparkles className="absolute bottom-6 right-4 h-7 w-7 text-yellow-400 fill-yellow-400/50 rotate-12 z-30 drop-shadow-sm opacity-90 group-hover:scale-110 transition-transform" />
      <div className="absolute top-5 right-5 z-30 flex gap-1.5 opacity-80">
         <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>
         <span className="w-2 h-2 rounded-full bg-pink-200 shadow-sm"></span>
      </div>
      
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`Photo ${i + 1}`}
          fill
          sizes="(max-width: 1024px) 280px, 300px"
          className={`object-cover transition-opacity duration-1000 ease-in-out z-10 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

function CarouselSection({ outfit, index }: { outfit: typeof OUTFITS[0], index: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % outfit.images.length);
    }, 3000 + (index * 500)); // offset slightly per section
    return () => clearInterval(timer);
  }, [outfit.images.length, index]);

  const tiltClass1 = currentIndex % 2 === 0 ? "rotate-2" : "-rotate-2";
  const tiltClass2 = currentIndex % 2 === 0 ? "-rotate-2" : "rotate-2";
  const tiltClass3 = currentIndex % 2 === 0 ? "rotate-2" : "-rotate-2";

  const idx1 = currentIndex;
  const idx2 = (currentIndex + 1) % outfit.images.length;
  const idx3 = (currentIndex + 2) % outfit.images.length;

  return (
    <div className="relative max-w-6xl mx-auto mb-20 px-4">
      <FadeSlideImage direction="up" delay={index * 100}>
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{outfit.title}</h3>
          <p className="text-pink-600/80 font-medium mt-2">{outfit.description}</p>
        </div>

        <div className="relative flex flex-row items-center justify-center gap-6 lg:gap-10 mx-auto">
          {/* Card 1 - Always visible */}
          <div className="flex justify-center w-full md:w-auto">
            <Photocard images={outfit.images} currentIndex={idx1} tiltClass={tiltClass1} />
          </div>
          {/* Card 2 - Visible on md+ */}
          {outfit.images.length >= 2 && (
            <div className="hidden md:flex justify-center w-auto">
              <Photocard images={outfit.images} currentIndex={idx2} tiltClass={tiltClass2} />
            </div>
          )}
          {/* Card 3 - Visible on lg+ */}
          {outfit.images.length >= 3 && (
            <div className="hidden lg:flex justify-center w-auto">
              <Photocard images={outfit.images} currentIndex={idx3} tiltClass={tiltClass3} />
            </div>
          )}
        </div>
      </FadeSlideImage>
    </div>
  );
}

export function OutfitsCarousel() {
  const { graduate } = EVENT_DETAILS;

  return (
    <section id="outfits" className="py-20 relative z-10 overflow-hidden w-full">
      <div className="mx-auto w-full">
        <FadeSlideImage direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16 px-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-700 mb-4 shadow-sm">
              <Camera className="h-4 w-4 text-pink-600" />
              <span>Style & Grace</span>
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-5xl text-slate-900 flex items-center justify-center gap-2">
              <span>Graduation Lookbook</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A showcase of {graduate.firstName}&apos;s journey in style.
            </p>
          </div>
        </FadeSlideImage>

        <div className="space-y-8">
          {OUTFITS.map((outfit, idx) => (
            <CarouselSection key={outfit.id} outfit={outfit} index={idx} />
          ))}
        </div>

        {/* Bottom decorative quote card with Fade Slide */}
        <FadeSlideImage direction="up" delay={300} className="mt-16 mx-auto max-w-2xl px-4">
          <div className="rounded-3xl bg-gradient-to-r from-pink-100/80 via-rose-100/60 to-pink-100/80 border border-pink-200/80 p-8 text-center shadow-lg backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
            <p className="font-serif text-xl sm:text-2xl italic font-medium text-slate-900 leading-relaxed">
              &quot;Dress for the journey you want, and celebrate the moments you&apos;ve earned.&quot;
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-600">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cheers to the Class of {graduate.classYear}</span>
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
        </FadeSlideImage>
      </div>
      
      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
