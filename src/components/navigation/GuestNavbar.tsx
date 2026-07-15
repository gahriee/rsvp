"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export function GuestNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { graduate } = EVENT_DETAILS;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white transition-colors hover:text-indigo-400"
        >
          {graduate.firstName}&apos;s Graduation
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/" ? "text-white font-semibold" : "text-slate-300 hover:text-white"
            }`}
          >
            Invitation
          </Link>
          <Link
            href="/rsvp"
            className={`transition-colors ${
              pathname === "/rsvp" ? "text-white font-semibold" : "text-slate-300 hover:text-white"
            }`}
          >
            RSVP Form
          </Link>
          <Link
            href="/gifts"
            className={`transition-colors ${
              pathname === "/gifts" ? "text-white font-semibold" : "text-slate-300 hover:text-white"
            }`}
          >
            Gift Registry
          </Link>
          <Link
            href="/rsvp"
            className="rounded-full bg-indigo-600 px-5 py-2 text-white font-semibold shadow-md transition-all hover:bg-indigo-500 hover:scale-105"
          >
            RSVP Now
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Invitation
          </Link>
          <Link
            href="/rsvp"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            RSVP Form
          </Link>
          <Link
            href="/gifts"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Gift Registry
          </Link>
          <div className="pt-2">
            <Link
              href="/rsvp"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-full bg-indigo-600 px-4 py-2.5 text-center text-base font-semibold text-white shadow-md hover:bg-indigo-500"
            >
              RSVP Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
