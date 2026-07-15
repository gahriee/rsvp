import React, { Suspense } from "react";
import type { Metadata } from "next";
import { GiftsPageClient } from "@/components/gifts/GiftsPageClient";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export const metadata: Metadata = {
  title: `Gift Registry | ${EVENT_DETAILS.graduate.firstName}'s Graduation`,
  description: `Browse the gift wishlist for ${EVENT_DETAILS.graduate.fullName}. Reserve gifts on a first-come, first-served basis.`,
};

export default function GiftsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-slate-800 mb-8" />
          <div className="h-12 w-64 rounded-lg bg-slate-800 mb-4" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-slate-900 border border-slate-800"
              />
            ))}
          </div>
        </div>
      }
    >
      <GiftsPageClient />
    </Suspense>
  );
}
