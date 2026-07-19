"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, Home } from "lucide-react";
import { fetchRsvpById, fetchGiftById } from "@/lib/apiClient";
import { Rsvp, Gift } from "@/lib/types";

import { ConfirmationCard } from "./ConfirmationCard";

export function ConfirmationClient() {
  const searchParams = useSearchParams();
  const rsvpId = searchParams?.get("rsvpId") || null;

  const [rsvp, setRsvp] = useState<Rsvp | null>(null);
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(Boolean(rsvpId));
  const [error, setError] = useState<string | null>(
    rsvpId ? null : "No RSVP ID provided in URL."
  );

  useEffect(() => {
    if (!rsvpId) return;

    let isMounted = true;
    fetchRsvpById(rsvpId)
      .then(async (rsvpData) => {
        if (!isMounted) return;
        setRsvp(rsvpData);
        if (rsvpData.selectedGift) {
          try {
            const giftData = await fetchGiftById(rsvpData.selectedGift);
            if (isMounted) {
              setGift(giftData);
              setError(null);
              setLoading(false);
            }
          } catch {
            if (isMounted) {
              setGift(null);
              setError(null);
              setLoading(false);
            }
          }
        } else {
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load confirmation details"
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [rsvpId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center animate-pulse relative z-10">
        <div className="mx-auto h-20 w-20 rounded-full bg-pink-200/60 mb-6" />
        <div className="mx-auto h-12 w-3/4 rounded-2xl bg-pink-200/60 mb-4" />
        <div className="mx-auto h-6 w-1/2 rounded bg-pink-200/60 mb-12" />
        <div className="h-96 rounded-3xl bg-white/80 border border-pink-200/80 shadow-lg" />
      </div>
    );
  }

  if (error || !rsvp) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="rounded-3xl border-2 border-pink-200 bg-white/90 p-8 shadow-2xl text-slate-900">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-serif font-bold text-slate-900">
            Confirmation Not Found
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {error || "We could not locate your celebration RSVP submission."}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/#rsvp"
              className="rounded-full bg-pink-400 px-6 py-2.5 text-sm font-bold text-white hover:bg-pink-500 transition-colors shadow-md flex items-center gap-1.5"
            >
              <span>Submit RSVP</span>
              <Sparkles className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="rounded-full bg-white border border-pink-300 px-6 py-2.5 text-sm font-bold text-slate-900 hover:bg-pink-50 transition-colors shadow-md flex items-center gap-1.5"
            >
              <Home className="h-4 w-4 text-pink-500" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
      <ConfirmationCard rsvp={rsvp} gift={gift} />
    </div>
  );
}
