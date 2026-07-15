"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
      router.push(`/rsvp?giftId=${giftId}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        {isRsvpFlow && (
          <>
            <Link href="/rsvp" className="hover:text-white transition-colors">
              RSVP Form
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-indigo-400 font-semibold">Gift Registry</span>
      </nav>

      {/* Title & Intro */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Gift Registry & Wishlist
        </h1>
        <p className="mt-2 text-base text-slate-300 max-w-3xl">
          Your presence at our celebration is our greatest gift! However, if you would like to honor the graduate with a gift, please browse the wishlist below. Items are reserved on a first-come, first-served basis.
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-2xl bg-slate-900 border border-slate-800 p-5"
            />
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/50 bg-red-950/80 p-6 text-center text-red-200 shadow-xl">
          <p className="text-lg font-bold">Failed to load registry</p>
          <p className="mt-1 text-sm text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => {
              void refreshGifts();
            }}
            className="mt-4 rounded-xl bg-red-900 px-5 py-2 text-sm font-bold text-white hover:bg-red-800 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Gift Grid */}
      {!loading && !error && (
        <GiftGrid
          gifts={gifts}
          onSelectGift={handleSelectGift}
          onRefreshGifts={refreshGifts}
        />
      )}
    </div>
  );
}
