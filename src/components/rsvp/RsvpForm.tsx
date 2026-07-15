"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
              "⚠️ This gift is already reserved by another guest. Please choose a different gift."
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
          "⚠️ This gift was just claimed by another guest! Please choose a different gift from the registry or clear the gift selection to submit your RSVP."
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
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-xl text-slate-200"
    >
      {error && (
        <div className="rounded-xl border border-red-500/50 bg-red-950/50 p-4 text-sm font-medium text-red-200 shadow-sm">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="guestName"
          className="block text-sm font-semibold text-slate-200"
        >
          Full Name *
        </label>
        <input
          id="guestName"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="e.g. Jane Doe"
          className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
        {validationErrors.guestName && (
          <p className="mt-1.5 text-xs font-semibold text-red-400">
            {validationErrors.guestName}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-200"
        >
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
        {validationErrors.email && (
          <p className="mt-1.5 text-xs font-semibold text-red-400">
            {validationErrors.email}
          </p>
        )}
      </div>

      {/* Attending Status Radio Buttons */}
      <div>
        <label className="block text-sm font-semibold text-slate-200">
          Will you be attending the celebration? *
        </label>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            onClick={() => setAttending(true)}
            className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
              attending
                ? "border-indigo-500 bg-indigo-500/10 shadow-md ring-1 ring-indigo-500"
                : "border-slate-800 bg-slate-950 hover:border-slate-700"
            }`}
          >
            <input
              type="radio"
              checked={attending}
              onChange={() => setAttending(true)}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
            />
            <span className="text-sm font-semibold text-white">
              🎉 Yes, joyfully accept!
            </span>
          </label>

          <label
            onClick={() => setAttending(false)}
            className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
              !attending
                ? "border-indigo-500 bg-indigo-500/10 shadow-md ring-1 ring-indigo-500"
                : "border-slate-800 bg-slate-950 hover:border-slate-700"
            }`}
          >
            <input
              type="radio"
              checked={!attending}
              onChange={() => setAttending(false)}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
            />
            <span className="text-sm font-semibold text-slate-300">
              😔 No, regretfully decline
            </span>
          </label>
        </div>
      </div>

      {/* Number of Guests (if attending) */}
      {attending && (
        <div>
          <label
            htmlFor="numberOfGuests"
            className="block text-sm font-semibold text-slate-200"
          >
            Number of Guests (including yourself) *
          </label>
          <input
            id="numberOfGuests"
            type="number"
            min={1}
            max={10}
            value={numberOfGuests}
            onChange={(e) =>
              setNumberOfGuests(parseInt(e.target.value, 10) || 1)
            }
            className="mt-2 block w-32 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
          {validationErrors.numberOfGuests && (
            <p className="mt-1.5 text-xs font-semibold text-red-400">
              {validationErrors.numberOfGuests}
            </p>
          )}
        </div>
      )}

      {/* Gift Selection Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">
              Gift Registry Selection
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an available gift from the graduate&apos;s wishlist to reserve with your RSVP.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/gifts?rsvp=true"
              className="rounded-full bg-indigo-600/20 border border-indigo-500/40 px-4 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 transition-all"
            >
              {currentGiftId ? "Change Gift" : "Browse & Choose Gift"}
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
                className="rounded-full bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Gift Loading/Preview */}
        {isGiftLoading && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-900 p-3 animate-pulse">
            <div className="h-12 w-12 rounded-lg bg-slate-800" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 rounded bg-slate-800" />
              <div className="h-3 w-2/3 rounded bg-slate-800" />
            </div>
          </div>
        )}

        {currentGiftError && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-xs font-medium text-amber-200">
            {currentGiftError}
          </div>
        )}

        {!isGiftLoading && giftPreview && (
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-700">
              <Image
                src={giftPreview.imageUrl}
                alt={giftPreview.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {giftPreview.name}
              </p>
              <p className="text-xs text-slate-400 line-clamp-1">
                {giftPreview.description}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                giftPreview.status === "reserved"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {giftPreview.status === "reserved" ? "Taken" : "Selected"}
            </span>
          </div>
        )}

        {!currentGiftId && !isGiftLoading && (
          <p className="mt-3 text-xs italic text-slate-500">
            No gift currently selected. You may still submit your RSVP without choosing a gift.
          </p>
        )}
      </div>

      {/* Message for Graduate */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-slate-200"
        >
          Message or Congratulations for the Graduate (Optional)
        </label>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a heartfelt note for the graduate..."
          className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          loading || (giftPreview ? giftPreview.status === "reserved" : false)
        }
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? "Submitting your RSVP..." : "Submit RSVP"}
      </button>
    </form>
  );
}
