"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export function Footer() {
  const pathname = usePathname();
  const { graduate, event } = EVENT_DETAILS;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-400">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="text-base font-bold text-white">
            {graduate.fullName}&apos;s Graduation Celebration
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {event.venueName} · {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-6 text-sm font-medium">
          <Link
            href="/"
            className="hover:text-white transition-colors"
          >
            Invitation
          </Link>
          <Link
            href="/rsvp"
            className="hover:text-white transition-colors"
          >
            RSVP Form
          </Link>
          <Link
            href="/gifts"
            className="hover:text-white transition-colors"
          >
            Gift Registry
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {graduate.fullName}. Crafted with care to celebrate the Class of {graduate.classYear}.
      </div>
    </footer>
  );
}
