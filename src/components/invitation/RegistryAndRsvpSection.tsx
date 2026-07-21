"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, CheckCircle2, RotateCcw, ArrowUp } from "lucide-react";
import { GiftGrid } from "@/components/gifts/GiftGrid";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { ConfirmationCard } from "@/components/confirmation/ConfirmationCard";
import { fetchGifts, submitRsvp, reserveGift } from "@/lib/apiClient";
import { Gift, Rsvp, CreateRsvpInput } from "@/lib/types";
import { FadeSlideImage } from "@/components/ui/FadeSlideImage";

export function RegistryAndRsvpSection() {
  const searchParams = useSearchParams();
  const initialGiftId = searchParams?.get("giftId") || null;

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loadingGifts, setLoadingGifts] = useState(true);
  const [giftsError, setGiftsError] = useState<string | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(initialGiftId);

  // Confirmation state once RSVP is submitted directly on page
  const [confirmationRsvp, setConfirmationRsvp] = useState<Rsvp | null>(null);
  const [confirmationGift, setConfirmationGift] = useState<Gift | null>(null);

  const refreshGifts = useCallback(async () => {
    setLoadingGifts(true);
    try {
      const data = await fetchGifts();
      setGifts(data);
      setGiftsError(null);
    } catch (err) {
      setGiftsError(
        err instanceof Error ? err.message : "Failed to load gift registry"
      );
    } finally {
      setLoadingGifts(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchGifts()
      .then((data) => {
        if (isMounted) {
          setGifts(data);
          setGiftsError(null);
          setLoadingGifts(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setGiftsError(
            err instanceof Error ? err.message : "Failed to load gift registry"
          );
          setLoadingGifts(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [prevInitialGiftId, setPrevInitialGiftId] = useState(initialGiftId);
  if (initialGiftId !== prevInitialGiftId) {
    setPrevInitialGiftId(initialGiftId);
    setSelectedGiftId(initialGiftId);
  }

  const handleSelectGift = async (giftId: string) => {
    // If the guest already submitted an RSVP and is modifying gift selection right here
    if (confirmationRsvp) {
      try {
        const updatedGift = await reserveGift(giftId, confirmationRsvp._id);
        setConfirmationGift(updatedGift);
        setSelectedGiftId(giftId);
        // Scroll smoothly down to confirmation card
        document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to reserve gift");
      }
      return;
    }

    // Otherwise, normal pre-RSVP flow: set selected gift and scroll to RSVP form
    setSelectedGiftId((prev) => {
      const isSelectingNew = prev !== giftId;
      if (isSelectingNew) {
        setTimeout(() => {
          document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
      return isSelectingNew ? giftId : null;
    });
  };

  const handleRsvpSubmit = async (data: CreateRsvpInput) => {
    const result = await submitRsvp(data);
    setConfirmationRsvp(result);

    // Attach selected gift info if present
    if (result.selectedGift) {
      const foundGift = gifts.find((g) => g._id === result.selectedGift);
      if (foundGift) {
        setConfirmationGift(foundGift);
      }
      
      // Refresh gifts so the available count updates in the grid
      void refreshGifts();
    } else {
      setConfirmationGift(null);
    }

    // Scroll cleanly to top of confirmation card
    setTimeout(() => {
      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="space-y-24 py-12">
      {/* SECTION 1: Wishlist / Gift Registry (#wishlist) */}
      <section id="wishlist" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 transition-all duration-700 ease-out">
        {/* Title & Intro */}
        <FadeSlideImage direction="up">
          <div className="mb-10 text-center max-w-3xl mx-auto transition-all duration-500">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold text-pink-700 mb-3 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              <span>Celebration Wishlist</span>
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 flex items-center justify-center gap-3">
              <span>Gift Registry & Wishlist</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-serif">
              Please browse and select a gift from the wishlist below. Click on any gift card to select it and attach it directly to your RSVP form below. Items are reserved on a first-come, first-served basis.
            </p>
          </div>
        </FadeSlideImage>

        {/* Loading Skeleton */}
        {loadingGifts && (
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
        {giftsError && !loadingGifts && (
          <div className="rounded-3xl border border-red-300 bg-red-50 p-8 text-center text-red-900 shadow-xl max-w-2xl mx-auto">
            <p className="text-xl font-serif font-bold">Failed to load gift registry</p>
            <p className="mt-2 text-sm text-red-700">{giftsError}</p>
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
        {!loadingGifts && !giftsError && (
          <GiftGrid
            gifts={gifts}
            selectedGiftId={selectedGiftId}
            onSelectGift={handleSelectGift}
            onRefreshGifts={refreshGifts}
          />
        )}
      </section>

      {/* SECTION 2: RSVP Form or Confirmation Card (#rsvp) */}
      <section id="rsvp" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 transition-all duration-700 ease-out">
        {confirmationRsvp ? (
          <div className="space-y-6">
            <ConfirmationCard rsvp={confirmationRsvp} gift={confirmationGift} />
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setConfirmationRsvp(null);
                  setSelectedGiftId(null);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-pink-300 bg-white px-6 py-2.5 text-xs font-bold text-pink-800 hover:bg-pink-100 shadow-sm transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5 text-pink-600" />
                <span>Submit Another RSVP Response</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-6 py-2.5 text-xs font-bold text-pink-900 hover:bg-pink-200 shadow-sm transition-all"
              >
                <ArrowUp className="h-3.5 w-3.5 text-pink-700" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Form Section Header */}
            <FadeSlideImage direction="up">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold text-pink-700 mb-3 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                  <span>You&apos;re Invited</span>
                  <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                </div>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 flex items-center justify-center gap-3">
                  <span>Graduation RSVP Form</span>
                </h2>
                <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-serif">
                  Please let us know if you can join us to celebrate Irish&apos;s special day! Fill out the stationery form below by the RSVP deadline.
                </p>
                {selectedGiftId && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-pink-50 border border-pink-300 px-4 py-2 text-xs font-bold text-pink-900 shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>You have a wishlist item selected and ready to attach to your RSVP!</span>
                  </div>
                )}
              </div>
            </FadeSlideImage>

            {/* RSVP Form Component */}
            <RsvpForm 
              onSubmit={handleRsvpSubmit} 
              selectedGiftId={selectedGiftId} 
              onClearGift={() => setSelectedGiftId(null)}
            />
          </div>
        )}
      </section>
    </div>
  );
}
