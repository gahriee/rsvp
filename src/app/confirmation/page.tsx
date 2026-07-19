import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ConfirmationClient } from "@/components/confirmation/ConfirmationClient";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export const metadata: Metadata = {
  title: `RSVP Confirmation | ${EVENT_DETAILS.graduate.firstName}'s Graduation`,
  description: `Thank you for RSVPing to ${EVENT_DETAILS.graduate.fullName}'s graduation celebration.`,
};

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center animate-pulse relative z-10">
          <div className="mx-auto h-20 w-20 rounded-full bg-pink-200/60 mb-6" />
          <div className="mx-auto h-12 w-3/4 rounded-2xl bg-pink-200/60 mb-4" />
          <div className="mx-auto h-6 w-1/2 rounded bg-pink-200/60 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 rounded-3xl bg-white/80 border border-pink-200/80 shadow-md" />
            <div className="h-64 rounded-3xl bg-white/80 border border-pink-200/80 shadow-md" />
          </div>
        </div>
      }
    >
      <ConfirmationClient />
    </Suspense>
  );
}
