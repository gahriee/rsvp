"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PartyPopper, Heart, Sparkles, Calendar, Clock, MapPin, Gift as GiftIcon, Ticket, Check, XCircle, Mail, ExternalLink } from "lucide-react";
import { Rsvp, Gift } from "@/lib/types";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

interface ConfirmationCardProps {
  rsvp: Rsvp;
  gift: Gift | null;
}

export function ConfirmationCard({ rsvp, gift }: ConfirmationCardProps) {
  const { graduate, event } = EVENT_DETAILS;

  return (
    <div className="relative mx-auto max-w-3xl rounded-3xl border-4 border-pink-200/90 bg-white p-6 sm:p-12 shadow-2xl shadow-pink-200/50 overflow-hidden text-slate-900">
      {/* Decorative Scrapbook Tape at Top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-48 h-8 bg-pink-200/90 backdrop-blur-md rounded-sm border border-pink-300 shadow-md transform -rotate-1 flex items-center justify-center gap-1.5 text-xs font-bold text-pink-900 tracking-widest uppercase select-none">
        <Ticket className="h-3.5 w-3.5 text-pink-700" />
        <span>Celebration Pass</span>
      </div>

      {/* Decorative Corner Ornaments */}
      <div className="absolute top-6 right-6 pointer-events-none opacity-40 select-none">
        <Sparkles className="h-8 w-8 text-pink-400" />
      </div>
      <div className="absolute bottom-6 left-6 pointer-events-none opacity-40 select-none">
        <Heart className="h-8 w-8 text-pink-400" />
      </div>

      {/* Header & Certificate Title */}
      <div className="text-center mt-6 mb-10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-400/30 mb-4 animate-bounce-short">
          <PartyPopper className="h-8 w-8" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-slate-900 flex items-center justify-center gap-3">
          <span>Officially RSVP&apos;d!</span>
          <Mail className="h-8 w-8 text-pink-500" />
        </h1>
        <p className="mt-3 text-lg sm:text-xl font-serif italic text-pink-600 flex items-center justify-center gap-1.5 flex-wrap">
          <span>We are overjoyed to celebrate with you,</span>
          <strong className="font-bold underline decoration-pink-300 underline-offset-4">{rsvp.guestName}</strong>!
          <Heart className="h-4 w-4 fill-pink-500 text-pink-500 inline" />
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          You are on the official guest list for {graduate.fullName}&apos;s Graduation Celebration!
        </p>
      </div>

      {/* Certificate Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Attendance Summary Panel */}
        <div className="rounded-2xl border-2 border-pink-100 bg-pink-50/50 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600">
                Attendance Status
              </span>
              <Sparkles className="h-4 w-4 text-pink-500" />
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500">Your Response</span>
                <p className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  {rsvp.attending ? (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Joyfully Attending</span>
                      <Check className="h-4 w-4 text-emerald-600" />
                    </>
                  ) : (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                      <span>Regretfully Declining</span>
                      <XCircle className="h-4 w-4 text-slate-400" />
                    </>
                  )}
                </p>
              </div>

              {rsvp.attending && (
                <div>
                  <span className="text-xs text-slate-500">Total Party Size</span>
                  <p className="text-base font-bold text-pink-900 mt-0.5 flex items-center gap-1.5">
                    <span>{rsvp.numberOfGuests} {rsvp.numberOfGuests === 1 ? "Guest" : "Guests"} Reserved</span>
                    <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                  </p>
                </div>
              )}

              <div>
                <span className="text-xs text-slate-500">Confirmation Sent To</span>
                <p className="text-sm font-semibold text-pink-900 mt-0.5 truncate">
                  {rsvp.email}
                </p>
              </div>

              {rsvp.message && (
                <div className="pt-2">
                  <span className="text-xs text-slate-500">Your Heartfelt Note</span>
                  <blockquote className="mt-1 border-l-2 border-pink-400 pl-3 italic text-sm text-pink-900/90 leading-relaxed font-serif">
                    &quot;{rsvp.message}&quot;
                  </blockquote>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Polaroid Gift Reservation Panel */}
        <div className="rounded-2xl border-2 border-pink-100 bg-pink-50/50 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600">
                Gift Registry Details
              </span>
              <GiftIcon className="h-4 w-4 text-pink-500" />
            </div>

            {gift ? (
              <div className="bg-white p-4 rounded-2xl border border-pink-200/80 shadow-md transform rotate-1 transition-transform hover:rotate-0">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-pink-100 bg-pink-50 mb-3 shadow-inner">
                  <Image
                    src={gift.imageUrl}
                    alt={gift.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-slate-900 truncate">
                    {gift.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    {gift.description}
                  </p>
                  {gift.productLink && (
                    <a
                      href={gift.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 hover:text-pink-700 transition-colors bg-pink-50/50 hover:bg-pink-100 rounded-lg px-2 py-1 border border-pink-100"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buy Gift Here</span>
                    </a>
                  )}
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2.5 py-0.5 text-[10px] font-bold text-pink-800 border border-pink-200">
                      <span>Claimed by You</span>
                      <Heart className="h-2.5 w-2.5 fill-pink-500 text-pink-500" />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/80 p-6 text-center border border-pink-200/60 my-auto">
                <GiftIcon className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-serif font-bold text-slate-900">
                  No Wishlist Gift Attached
                </p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  You did not select a gift during RSVP. Your warm presence and best wishes are the greatest gift of all!
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-pink-200/60">
            <Link
              href="/#wishlist"
              className="flex items-center justify-center gap-1.5 w-full text-center rounded-full bg-white border border-pink-300 px-4 py-2 text-xs font-bold text-pink-800 hover:bg-pink-100 transition-all shadow-sm"
            >
              <span>{gift ? "Browse / Change Gift Selection" : "Browse Registry & Attach Gift"}</span>
              <GiftIcon className="h-3.5 w-3.5 text-pink-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Keepsake Event Reminder Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 border border-pink-300/80 p-6 text-center mb-8 shadow-inner">
        <h3 className="text-xs font-bold uppercase tracking-widest text-pink-700 mb-1 flex items-center justify-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>Mark Your Calendar</span>
        </h3>
        <p className="text-lg sm:text-xl font-serif font-bold text-slate-900">
          {event.venueName} · {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
        <p className="text-sm font-semibold text-pink-800 mt-1 flex items-center justify-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{event.time}</span>
        </p>
        <p className="text-xs text-slate-600 mt-1 flex items-center justify-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-pink-600" />
          <span>{event.venueAddress}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-pink-300/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <span>Return to Celebration Home</span>
          <Sparkles className="h-4 w-4" />
        </Link>
        <Link
          href="/#wishlist"
          className="w-full sm:w-auto text-center rounded-full bg-white border-2 border-pink-300 px-8 py-3.5 text-sm font-bold text-slate-900 hover:bg-pink-50 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>View Full Gift Wishlist</span>
          <GiftIcon className="h-4 w-4 text-pink-500" />
        </Link>
      </div>
    </div>
  );
}
