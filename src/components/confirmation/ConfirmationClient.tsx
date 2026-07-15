"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { fetchRsvpById, fetchGiftById } from "@/lib/apiClient";
import { Rsvp, Gift } from "@/lib/types";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export function ConfirmationClient() {
  const searchParams = useSearchParams();
  const rsvpId = searchParams?.get("rsvpId") || null;

  const [rsvp, setRsvp] = useState<Rsvp | null>(null);
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(Boolean(rsvpId));
  const [error, setError] = useState<string | null>(
    rsvpId ? null : "No RSVP ID provided in URL."
  );

  const { graduate, event } = EVENT_DETAILS;

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
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center animate-pulse">
        <div className="mx-auto h-16 w-16 rounded-full bg-slate-800 mb-6" />
        <div className="mx-auto h-10 w-3/4 rounded bg-slate-800 mb-4" />
        <div className="mx-auto h-6 w-1/2 rounded bg-slate-800 mb-12" />
        <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
      </div>
    );
  }

  if (error || !rsvp) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-red-500/40 bg-red-950/60 p-8 shadow-xl">
          <span className="text-4xl">⚠️</span>
          <h2 className="mt-4 text-2xl font-bold text-white">
            Confirmation Not Found
          </h2>
          <p className="mt-2 text-sm text-red-200">
            {error || "We could not locate your RSVP submission."}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/rsvp"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
            >
              Submit RSVP
            </Link>
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Celebratory Badge / Header */}
      <div className="text-center mb-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/20 mb-6">
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Thank You, {rsvp.guestName}!
        </h1>
        <p className="mt-3 text-lg text-slate-300">
          We have recorded your RSVP for {graduate.fullName}&apos;s Graduation Celebration.
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Attendance Summary Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-xs uppercase font-bold tracking-wider text-indigo-400 mb-4">
            Attendance Details
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400">Status</span>
              <p className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                {rsvp.attending ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Joyfully Attending
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Regretfully Declining
                  </>
                )}
              </p>
            </div>
            {rsvp.attending && (
              <div>
                <span className="text-xs text-slate-400">Party Size</span>
                <p className="text-base font-semibold text-slate-200 mt-0.5">
                  {rsvp.numberOfGuests} {rsvp.numberOfGuests === 1 ? "Guest" : "Guests"}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-400">Confirmation Email</span>
              <p className="text-base font-semibold text-slate-200 mt-0.5">
                {rsvp.email}
              </p>
            </div>
            {rsvp.message && (
              <div>
                <span className="text-xs text-slate-400">Your Note to Graduate</span>
                <blockquote className="mt-1 border-l-2 border-indigo-500/50 pl-3 italic text-sm text-slate-300">
                  &quot;{rsvp.message}&quot;
                </blockquote>
              </div>
            )}
          </div>
        </div>

        {/* Gift Reservation Summary Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-indigo-400 mb-4">
              Gift Registry Status
            </h3>
            {gift ? (
              <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-700">
                  <Image
                    src={gift.imageUrl}
                    alt={gift.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {gift.name}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    {gift.description}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    Reserved Under Your Name
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-950/40 p-5 text-center border border-slate-800/60">
                <p className="text-sm font-semibold text-slate-300">
                  No Gift Attached
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  You did not select a registry gift with this RSVP.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60">
            <Link
              href={`/gifts?rsvpId=${rsvp._id}`}
              className="block w-full text-center rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
            >
              {gift ? "Browse Registry / Change Gift" : "Browse Gift Registry & Attach Gift"}
            </Link>
          </div>
        </div>
      </div>

      {/* Event Reminder Box */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-indigo-950/60 border border-indigo-500/30 p-6 text-center mb-10 shadow-lg">
        <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
          Event Reminder
        </h4>
        <p className="mt-2 text-base font-semibold text-white">
          {event.venueName} · {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
        <p className="text-sm text-slate-300 mt-1">{event.time}</p>
        <p className="text-xs text-slate-400 mt-2">{event.venueAddress}</p>
      </div>

      {/* Bottom CTA Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto text-center rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 transition-all"
        >
          Return to Invitation
        </Link>
        <Link
          href="/gifts"
          className="w-full sm:w-auto text-center rounded-xl bg-slate-800 border border-slate-700 px-8 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
        >
          View Full Gift Registry
        </Link>
      </div>
    </div>
  );
}
