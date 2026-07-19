"use client";

import React from "react";
import Image from "next/image";
import { Camera, Sparkles } from "lucide-react";
import { EVENT_DETAILS, CollagePhoto } from "@/lib/constants/eventDetails";

export function MasonryPhotoCollage() {
  const { collagePhotos } = EVENT_DETAILS;

  if (!collagePhotos || collagePhotos.length === 0) {
    return null;
  }

  // Pre-calculated masonry grid spans pattern to precisely replicate the clustered photo wall aesthetic
  const getSpanClasses = (index: number) => {
    const pattern = [
      "col-span-2 row-span-2 aspect-square", // 0: Large square
      "col-span-1 row-span-2 aspect-[3/4]", // 1: Tall vertical
      "col-span-1 row-span-1 aspect-square", // 2: Small square
      "col-span-2 row-span-1 aspect-[4/3]", // 3: Wide horizontal
      "col-span-2 row-span-2 aspect-square", // 4: Center Large square
      "col-span-1 row-span-1 aspect-square", // 5: Small square
      "col-span-1 row-span-2 aspect-[3/4]", // 6: Tall vertical
      "col-span-1 row-span-1 aspect-square", // 7: Small square
      "col-span-2 row-span-1 aspect-[4/3]", // 8: Wide horizontal
      "col-span-2 row-span-2 aspect-square", // 9: Large square
      "col-span-1 row-span-1 aspect-square", // 10: Small square
      "col-span-1 row-span-2 aspect-[3/4]", // 11: Tall vertical
      "col-span-1 row-span-1 aspect-square", // 12: Small square
      "col-span-1 row-span-1 aspect-square", // 13: Small square
    ];
    return pattern[index % pattern.length];
  };

  return (
    <section id="memories" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header Section with Smooth Transitions */}
        <div className="text-center max-w-3xl mx-auto mb-14 transition-all duration-700 ease-out">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold text-pink-700 mb-3 shadow-sm">
            <Camera className="h-3.5 w-3.5 text-pink-600" />
            <span>Memories Along the Way</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 flex items-center justify-center gap-3">
            <span>Our Celebration Wall</span>
            <Sparkles className="h-7 w-7 text-pink-500 shrink-0" />
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-serif max-w-2xl mx-auto leading-relaxed">
            A collage of favorite snapshots, milestones, and shared smiles leading up to Irish&apos;s graduation day. Hover over each print to zoom into the moment!
          </p>
        </div>

        {/* Dense Masonry Clustered Photo Wall */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[210px] gap-3 sm:gap-4 lg:gap-5 justify-center items-stretch py-6">
          {collagePhotos.map((photo: CollagePhoto, idx: number) => {
            const spanClass = getSpanClasses(idx);

            return (
              <div
                key={idx}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border-2 sm:border-[3px] border-white shadow-md sm:shadow-lg transition-all duration-500 ease-out hover:scale-[1.04] hover:z-30 hover:shadow-2xl hover:border-pink-300 ${spanClass}`}
              >
                {/* Photo Image with Zoom Transition */}
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Subtle Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3 sm:p-5 text-white pointer-events-none">
                  <span className="inline-block w-fit rounded-full bg-pink-500/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 shadow-sm">
                    {photo.tag}
                  </span>
                  <p className="font-serif text-xs sm:text-sm font-bold leading-snug drop-shadow-md line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
