"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, Gift as GiftIcon, Mail, Check, AlertCircle, Users } from "lucide-react";
import { CreateRsvpInput, Gift } from "@/lib/types";
import { createRsvpSchema } from "@/lib/validators";
import { fetchGiftById } from "@/lib/apiClient";

interface RsvpFormProps {
  onSubmit: (data: CreateRsvpInput) => Promise<void> | void;
  selectedGiftId?: string | null;
}

export function RsvpForm({ onSubmit, selectedGiftId = null }: RsvpFormProps) {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState(true);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Gift preview state derived & synchronized cleanly for React 19
  const [prevPropGiftId, setPrevPropGiftId] = useState(selectedGiftId);
  const [currentGiftId, setCurrentGiftId] = useState<string | null>(
    selectedGiftId
  );

  if (selectedGiftId !== prevPropGiftId) {
    setPrevPropGiftId(selectedGiftId);
    setCurrentGiftId(selectedGiftId);
  }

  const [fetchedGift, setFetchedGift] = useState<Gift | null>(null);
  const [errorGiftId, setErrorGiftId] = useState<string | null>(null);
  const [giftErrorMessage, setGiftErrorMessage] = useState<string | null>(null);

  const giftPreview =
    currentGiftId && fetchedGift && fetchedGift._id === currentGiftId
      ? fetchedGift
      : null;
  const isGiftLoading = Boolean(
    currentGiftId && !giftPreview && errorGiftId !== currentGiftId
  );
  const currentGiftError =
    currentGiftId && errorGiftId === currentGiftId ? giftErrorMessage : null;

  useEffect(() => {
    if (!currentGiftId) return;
    let isMounted = true;

    fetchGiftById(currentGiftId)
      .then((gift) => {
        if (isMounted) {
          setFetchedGift(gift);
          if (gift.status === "reserved") {
            setErrorGiftId(currentGiftId);
            setGiftErrorMessage(
              "This gift is already reserved by another guest. Please choose a different gift."
            );
          } else {
            setErrorGiftId(null);
            setGiftErrorMessage(null);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorGiftId(currentGiftId);
          setGiftErrorMessage(
            err instanceof Error ? err.message : "Failed to load gift details"
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentGiftId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setError(null);

    const rawData = {
      guestName,
      email,
      attending,
      numberOfGuests: Number(numberOfGuests),
      message,
      selectedGift: currentGiftId || null,
    };

    const validation = createRsvpSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(validation.data);
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "An error occurred submitting your RSVP";
      if (
        errMsg.toLowerCase().includes("reserved") ||
        errMsg.toLowerCase().includes("conflict") ||
        errMsg.toLowerCase().includes("unavailable")
      ) {
        setError(
          "This gift was just claimed by another guest! Please choose a different gift from the registry or clear the gift selection to submit your RSVP."
        );
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      className="space-y-6 bg-[#fffcf9] shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-sm p-5 sm:p-8 md:p-12 relative overflow-visible text-slate-800"
    >
      {/* Washi Tapes */}
      <div className="absolute -top-3 left-4 sm:left-12 z-30 w-24 sm:w-32 h-7 sm:h-8 bg-gradient-to-r from-pink-200/90 to-rose-200/90 backdrop-blur-md transform -rotate-2 shadow-sm flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-pink-800 uppercase tracking-widest">
        RSVP
      </div>
      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-800 shadow-sm flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="guestName"
          className="block text-sm font-serif font-bold text-slate-900"
        >
          Full Name *
        </label>
        <input
          id="guestName"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="e.g. Jane & John Doe"
          className="mt-2 block w-full rounded-2xl border border-pink-200 bg-white px-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-300/30 transition-all font-medium"
        />
        {validationErrors.guestName && (
          <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
            <span>•</span>
            <span>{validationErrors.guestName}</span>
          </p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-serif font-bold text-slate-900"
        >
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className="mt-2 block w-full rounded-2xl border border-pink-200 bg-white px-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-300/30 transition-all font-medium"
        />
        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
          <span>We&apos;ll send your celebration confirmation and calendar details here.</span>
          <Mail className="h-3 w-3 text-pink-500 inline" />
        </p>
        {validationErrors.email && (
          <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
            <span>•</span>
            <span>{validationErrors.email}</span>
          </p>
        )}
      </div>

      {/* Attending Status Radio Buttons */}
      <div>
        <label className="block text-sm font-serif font-bold text-slate-900">
          Will you be joining us for the celebration? *
        </label>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            onClick={() => setAttending(true)}
            className={`flex items-center gap-3.5 rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 ${
              attending
                ? "border-pink-400 bg-pink-50/80 shadow-md scale-[1.01]"
                : "border-pink-100 bg-white hover:border-pink-200 hover:bg-pink-50/30"
            }`}
          >
            <div className="relative flex items-center justify-center h-5 w-5 shrink-0">
              <input
                type="radio"
                checked={attending}
                onChange={() => setAttending(true)}
                className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="h-5 w-5 rounded-full border-2 border-pink-300 bg-white peer-checked:border-pink-500 peer-checked:bg-pink-500 peer-focus-visible:ring-4 peer-focus-visible:ring-pink-300/50 transition-all flex items-center justify-center">
                <div className={`h-2 w-2 rounded-full bg-white transition-transform ${attending ? "scale-100" : "scale-0"}`} />
              </div>
            </div>
            <div>
              <span className="block text-sm font-serif font-bold text-slate-900 flex items-center gap-1.5">
                <span>Joyfully Attending</span>
                <Check className="h-4 w-4 text-emerald-500" />
              </span>
              <span className="block text-xs text-slate-500 mt-0.5">
                Can&apos;t wait to celebrate!
              </span>
            </div>
          </label>

          <label
            onClick={() => setAttending(false)}
            className={`flex items-center gap-3.5 rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 ${
              !attending
                ? "border-pink-400 bg-pink-50/80 shadow-md scale-[1.01]"
                : "border-pink-100 bg-white hover:border-pink-200 hover:bg-pink-50/30"
            }`}
          >
            <div className="relative flex items-center justify-center h-5 w-5 shrink-0">
              <input
                type="radio"
                checked={!attending}
                onChange={() => setAttending(false)}
                className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="h-5 w-5 rounded-full border-2 border-pink-300 bg-white peer-checked:border-pink-500 peer-checked:bg-pink-500 peer-focus-visible:ring-4 peer-focus-visible:ring-pink-300/50 transition-all flex items-center justify-center">
                <div className={`h-2 w-2 rounded-full bg-white transition-transform ${!attending ? "scale-100" : "scale-0"}`} />
              </div>
            </div>
            <div>
              <span className="block text-sm font-serif font-bold text-slate-700">
                Regretfully Declining
              </span>
              <span className="block text-xs text-slate-500 mt-0.5">
                Will be cheering from afar!
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Number of Guests (if attending) */}
      {attending && (
        <div className="bg-pink-50/50 rounded-2xl p-5 border border-pink-100 animate-fadeIn">
          <label
            htmlFor="numberOfGuests"
            className="block text-sm font-serif font-bold text-slate-900"
          >
            Total Guests Attending (including yourself) *
          </label>
          <div className="mt-2.5 flex items-center gap-4">
            <input
              id="numberOfGuests"
              type="number"
              min={1}
              max={10}
              value={numberOfGuests}
              onChange={(e) =>
                setNumberOfGuests(parseInt(e.target.value, 10) || 1)
              }
              className="block w-28 rounded-xl border border-pink-200 bg-white px-4 py-3 text-center font-bold text-slate-900 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-300/30 transition-all text-lg"
            />
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
              <Users className="h-4 w-4 text-pink-500 inline" />
              <span>Guests (Max 10 per party)</span>
            </span>
          </div>
          {validationErrors.numberOfGuests && (
            <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
              <span>•</span>
              <span>{validationErrors.numberOfGuests}</span>
            </p>
          )}
        </div>
      )}

      {/* Gift Selection Box */}
      <div className="rounded-2xl border-2 border-pink-100 bg-pink-50/30 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-serif font-bold text-slate-900 flex items-center gap-1.5">
              <span>Gift Registry Selection</span>
              <GiftIcon className="h-4 w-4 text-pink-500" />
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Select a wishlist gift to reserve with your RSVP, or browse the flower garden registry below.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="#wishlist"
              className="rounded-full bg-pink-400 border border-pink-300 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-pink-500 transition-all flex items-center gap-1"
            >
              <span>{currentGiftId ? "Change Gift" : "Browse Registry"}</span>
              <GiftIcon className="h-3.5 w-3.5" />
            </Link>
            {currentGiftId && (
              <button
                type="button"
                onClick={() => {
                  setCurrentGiftId(null);
                  setFetchedGift(null);
                  setErrorGiftId(null);
                  setGiftErrorMessage(null);
                }}
                className="rounded-full bg-white border border-pink-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-pink-100 hover:text-pink-900 transition-all shadow-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Gift Loading/Preview */}
        {isGiftLoading && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 animate-pulse border border-pink-100 shadow-sm">
            <div className="h-14 w-14 rounded-xl bg-pink-100" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 rounded bg-pink-100" />
              <div className="h-3 w-2/3 rounded bg-pink-100" />
            </div>
          </div>
        )}

        {currentGiftError && (
          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-semibold text-amber-900 shadow-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{currentGiftError}</span>
          </div>
        )}

        {!isGiftLoading && giftPreview && (
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-pink-200 bg-white p-4 shadow-md transition-all">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-pink-100 shadow-inner">
              <Image
                src={giftPreview.imageUrl}
                alt={giftPreview.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-serif font-bold text-slate-900 truncate">
                {giftPreview.name}
              </p>
              <p className="text-xs text-slate-500 line-clamp-1">
                {giftPreview.description}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                giftPreview.status === "reserved"
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-pink-100 text-pink-700 border border-pink-200"
              }`}
            >
              {giftPreview.status === "reserved" ? (
                <>
                  <span>Claimed</span>
                  <Heart className="h-3 w-3 fill-current" />
                </>
              ) : (
                <>
                  <span>Selected</span>
                  <Check className="h-3 w-3" />
                </>
              )}
            </span>
          </div>
        )}

        {!currentGiftId && !isGiftLoading && (
          <p className="mt-3 text-xs italic text-slate-500">
            No gift selected right now. You may still submit your RSVP without picking a gift!
          </p>
        )}
      </div>

      {/* Message for Graduate */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-serif font-bold text-slate-900 flex items-center gap-1.5"
        >
          <span>Note of Congratulations for Irish (Optional)</span>
          <Mail className="h-4 w-4 text-pink-500 inline" />
        </label>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your warmest wishes, favorite college memories, or words of wisdom..."
          className="mt-2 block w-full rounded-2xl border border-pink-200 bg-white px-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-300/30 transition-all font-medium"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          loading || (giftPreview ? giftPreview.status === "reserved" : false)
        }
        className="cursor-pointer w-full rounded-full bg-pink-500 px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-pink-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>{loading ? "Sending..." : "Submit"}</span>
        {!loading && <Sparkles className="h-4 w-4" />}
      </button>
    </form>
  );
}
