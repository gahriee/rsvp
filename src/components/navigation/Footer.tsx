"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Heart } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export function Footer() {
  const pathname = usePathname();
  const { graduate, event } = EVENT_DETAILS;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-16 border-t border-pink-200/80 bg-white/70 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 text-slate-600 relative z-10">
      <div className="mx-auto max-w-5xl flex flex-col items-center justify-center gap-6 text-center">
        {/* Floral Ornament */}
        <div className="flex items-center justify-center gap-2 text-pink-500 text-sm tracking-widest uppercase font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>Class of {graduate.classYear} Celebration</span>
          <Sparkles className="h-4 w-4" />
        </div>

        <div>
          <p className="text-xl font-serif font-bold text-slate-900 flex items-center justify-center gap-2">
            <span>{graduate.fullName}&apos;s Graduation Party</span>
            <Sparkles className="h-4 w-4 text-pink-400" />
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {event.venueName} · {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-700">
          <Link
            href="#timeline"
            className="hover:text-pink-500 transition-colors underline-offset-4 hover:underline"
          >
            Timeline
          </Link>
          <Link
            href="#dresscode"
            className="hover:text-pink-500 transition-colors underline-offset-4 hover:underline"
          >
            Dress Code
          </Link>
          <Link
            href="#location"
            className="hover:text-pink-500 transition-colors underline-offset-4 hover:underline"
          >
            Venue & Maps
          </Link>
          <Link
            href="#wishlist"
            className="hover:text-pink-500 transition-colors underline-offset-4 hover:underline"
          >
            Gift Registry
          </Link>
          <Link
            href="#rsvp"
            className="hover:text-pink-500 transition-colors underline-offset-4 hover:underline"
          >
            RSVP Form
          </Link>
        </div>

        <div className="w-full max-w-md mt-4 pt-6 border-t border-pink-200/60 flex flex-col items-center gap-1 text-center text-xs text-slate-500">
          <p className="font-medium text-pink-900/80 flex items-center justify-center gap-1.5">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
            <span>to celebrate {graduate.firstName}&apos;s big day and the adventures ahead!</span>
          </p>
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} {graduate.fullName}. All sweet memories reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
