"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Sparkles, Menu, X, Calendar, Gift, MapPin, Shirt } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export function GuestNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { graduate } = EVENT_DETAILS;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl px-4 sm:px-6 w-full">
      <div className="flex items-center justify-between rounded-full bg-white/85 backdrop-blur-md border border-pink-200/80 shadow-lg shadow-pink-100/60 px-6 py-3 transition-all">
        {/* Brand/Logo */}
        <Link
          href="/"
          className="text-lg font-serif font-bold tracking-tight text-slate-900 transition-colors hover:text-pink-500 flex items-center gap-2"
        >
          <GraduationCap className="h-6 w-6 text-pink-500 shrink-0" />
          <span>{graduate.firstName}&apos;s Graduation</span>
        </Link>

        {/* Desktop Navigation Links (Single-Page Anchor Links) */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          <Link
            href="#timeline"
            className="rounded-full px-3.5 py-1.5 text-slate-600 hover:text-pink-600 hover:bg-pink-50/60 transition-all flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4 text-pink-500" />
            <span>Timeline</span>
          </Link>
          <Link
            href="#dresscode"
            className="rounded-full px-3.5 py-1.5 text-slate-600 hover:text-pink-600 hover:bg-pink-50/60 transition-all flex items-center gap-1.5"
          >
            <Shirt className="h-4 w-4 text-pink-500" />
            <span>Dress Code</span>
          </Link>
          <Link
            href="#location"
            className="rounded-full px-3.5 py-1.5 text-slate-600 hover:text-pink-600 hover:bg-pink-50/60 transition-all flex items-center gap-1.5"
          >
            <MapPin className="h-4 w-4 text-pink-500" />
            <span>Venue</span>
          </Link>
          <Link
            href="#wishlist"
            className="rounded-full px-3.5 py-1.5 text-slate-600 hover:text-pink-600 hover:bg-pink-50/60 transition-all flex items-center gap-1.5"
          >
            <Gift className="h-4 w-4 text-pink-500" />
            <span>Gift Registry</span>
          </Link>
          <Link
            href="#rsvp"
            className="ml-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 px-5 py-2 text-white font-semibold shadow-md shadow-pink-200/60 transition-all hover:scale-105 hover:from-pink-500 hover:to-rose-500 flex items-center gap-1.5"
          >
            <span>RSVP Now</span>
            <Sparkles className="h-4 w-4" />
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden rounded-full p-2 text-slate-800 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 rounded-3xl border border-pink-200/80 bg-white/95 backdrop-blur-md shadow-xl p-4 space-y-1.5">
          <Link
            href="#timeline"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <Calendar className="h-5 w-5 text-pink-500" />
            <span>Timeline</span>
          </Link>
          <Link
            href="#dresscode"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <Shirt className="h-5 w-5 text-pink-500" />
            <span>Dress Code</span>
          </Link>
          <Link
            href="#location"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <MapPin className="h-5 w-5 text-pink-500" />
            <span>Venue & Directions</span>
          </Link>
          <Link
            href="#wishlist"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
          >
            <Gift className="h-5 w-5 text-pink-500" />
            <span>Gift Registry</span>
          </Link>
          <div className="pt-2">
            <Link
              href="#rsvp"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400 px-4 py-3 text-center text-base font-semibold text-white shadow-md hover:from-pink-500 hover:to-rose-500"
            >
              <span>RSVP Now</span>
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
