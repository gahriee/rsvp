"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Gift as GiftIcon } from "lucide-react";
import { GiftGrid } from "./GiftGrid";
import { fetchGifts, reserveGift } from "@/lib/apiClient";
import { Gift } from "@/lib/types";

export function GiftsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rsvpId = searchParams?.get("rsvpId") || null;
  const isRsvpFlow = searchParams?.get("rsvp") === "true";

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshGifts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGifts();
      setGifts(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load gift registry"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchGifts()
      .then((data) => {
        if (isMounted) {
          setGifts(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load gift registry"
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectGift = async (giftId: string) => {
    if (rsvpId) {
      // Direct reservation for an existing RSVP
      await reserveGift(giftId, rsvpId);
      router.push(`/confirmation?rsvpId=${rsvpId}`);
    } else {
      // Redirect to RSVP form with selected gift attached
      router.push(`/#rsvp?giftId=${giftId}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 font-medium">
        <Link href="/" className="hover:text-pink-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        {isRsvpFlow && (
          <>
            <Link href="/#rsvp" className="hover:text-pink-600 transition-colors">
              RSVP Form
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-pink-600 font-semibold flex items-center gap-1.5">
          <span>Gift Registry</span>
          <GiftIcon className="h-3.5 w-3.5" />
        </span>
      </nav>

      {/* Title & Intro */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3.5 py-1 text-xs font-semibold text-pink-700 mb-3 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Celebration Wishlist</span>
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 flex items-center justify-center sm:justify-start gap-3">
          <span>Gift Registry & Wishlist</span>
          <GiftIcon className="h-8 w-8 text-pink-500 shrink-0" />
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          Please browse and select a gift from the wishlist below. Items are reserved on a first-come, first-served basis.
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-3xl bg-white/70 border border-pink-200/80 p-5 shadow-md"
            />
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="rounded-3xl border border-red-300 bg-red-50 p-8 text-center text-red-900 shadow-xl">
          <p className="text-xl font-serif font-bold">Failed to load flower garden registry</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => {
              void refreshGifts();
            }}
            className="mt-6 rounded-full bg-pink-400 px-6 py-2.5 text-sm font-bold text-white hover:bg-pink-500 transition-colors shadow-md flex items-center gap-1.5 mx-auto"
          >
            <span>Retry Loading</span>
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Gift Grid */}
      {!loading && !error && (
        <GiftGrid
          gifts={gifts}
          selectedGiftId={null}
          onSelectGift={handleSelectGift}
          onRefreshGifts={refreshGifts}
        />
      )}
    </div>
  );
}
