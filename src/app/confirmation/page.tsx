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
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center animate-pulse">
          <div className="mx-auto h-20 w-20 rounded-full bg-slate-800 mb-6" />
          <div className="mx-auto h-12 w-3/4 rounded bg-slate-800 mb-4" />
          <div className="mx-auto h-6 w-1/2 rounded bg-slate-800 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
          </div>
        </div>
      }
    >
      <ConfirmationClient />
    </Suspense>
  );
}
