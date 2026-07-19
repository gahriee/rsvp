import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RsvpPageClient } from "@/components/rsvp/RsvpPageClient";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export const metadata: Metadata = {
  title: `RSVP Form | ${EVENT_DETAILS.graduate.firstName}'s Graduation`,
  description: `RSVP online for ${EVENT_DETAILS.graduate.fullName}'s graduation celebration.`,
};

export default function RsvpPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-8 w-48 rounded-lg bg-pink-200/60 animate-pulse mb-8" />
          <div className="h-12 w-64 rounded-lg bg-pink-200/60 animate-pulse mb-4" />
          <div className="h-96 w-full rounded-3xl bg-white/80 border border-pink-200/80 animate-pulse shadow-lg" />
        </div>
      }
    >
      <RsvpPageClient />
    </Suspense>
  );
}
