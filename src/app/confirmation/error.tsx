"use client";

import React from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ConfirmationError({ error, reset }: ErrorProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="rounded-2xl border border-red-500/40 bg-red-950/60 p-8 shadow-xl">
        <span className="text-4xl">⚠️</span>
        <h2 className="mt-4 text-2xl font-bold text-white">
          Something Went Wrong
        </h2>
        <p className="mt-2 text-sm text-red-200">
          {error?.message || "An unexpected error occurred while loading your RSVP confirmation."}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-red-800 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
