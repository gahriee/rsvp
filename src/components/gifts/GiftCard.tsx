"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Sparkles, Gift as GiftIcon, Check, ExternalLink } from "lucide-react";
import { Gift } from "@/lib/types";

interface GiftCardProps {
  gift: Gift;
  onSelectGift?: (giftId: string) => Promise<void> | void;
  isSelected?: boolean;
  disabled?: boolean;
}

export function GiftCard({
  gift,
  onSelectGift,
  isSelected = false,
  disabled = false,
}: GiftCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReserved = gift.status === "reserved" || (gift.reservedBy && gift.reservedBy.length >= gift.maxReservations);
  const isCardDisabled = disabled || isReserved || loading;

  const handleClick = async () => {
    if (isCardDisabled || !onSelectGift) return;
    setLoading(true);
    setError(null);
    try {
      await onSelectGift(gift._id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to select this gift"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-sm p-4 pb-8 transition-all duration-300 ${
        isReserved
          ? "bg-[#fffdfa] shadow-md opacity-90"
          : isSelected
            ? "bg-[#fffdfa] shadow-xl ring-4 ring-pink-200/50 scale-[1.02]"
            : "bg-white shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:rotate-1"
      }`}
    >
      {/* Top Washi Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-20 h-6 bg-gradient-to-r from-pink-100/90 to-rose-100/90 backdrop-blur-md shadow-sm transform -rotate-2 border-none" />

      {/* Scrapbook Tape / Diagonal Ribbon Badge for Reserved */}
      {isReserved && (
        <div className="absolute top-4 right-4 z-20 rounded-full bg-red-400/95 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-md border border-red-300/50 flex items-center gap-1.5 transform rotate-2">
          <span>Claimed with Love</span>
          <Heart className="h-3.5 w-3.5 fill-white text-white" />
        </div>
      )}

      {!isReserved && (
        <div className="absolute top-4 right-4 z-20 rounded-full bg-emerald-50/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm border border-emerald-200 flex items-center gap-1.5 group-hover:scale-105 transition-transform">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available ({gift.maxReservations - (gift.reservedBy?.length || 0)}/{gift.maxReservations})</span>
          <Sparkles className="h-3 w-3 text-emerald-500" />
        </div>
      )}

      <div className="flex flex-col flex-1">
        {/* Photo Container styled like Polaroid photo area */}
        <div className="relative mb-4 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl border border-pink-100 bg-pink-50/60 shadow-inner">
          <Image
            src={gift.imageUrl}
            alt={gift.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ${
              isReserved ? "opacity-75 saturate-[0.85]" : "group-hover:scale-105"
            }`}
          />
        </div>

        <div className="px-1 flex flex-col flex-1">
          <h3 className="font-serif text-xl font-bold text-slate-900 tracking-tight group-hover:text-pink-500 transition-colors">
            {gift.name}
          </h3>
          {gift.description && (
            <p className="mt-1.5 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {gift.description}
            </p>
          )}

          <div className="flex-1" />

          {gift.productLink && (
            <a
              href={gift.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full justify-center items-center gap-1.5 text-sm font-bold text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 hover:bg-pink-100 rounded-lg px-3 py-2 border border-pink-200 shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buy Here</span>
            </a>
          )}

          {error && (
            <div className="mt-3 rounded-xl border border-red-300 bg-red-50 p-2.5 text-xs font-semibold text-red-700 shadow-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-pink-100/80 px-1 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {isReserved ? (
            <>
              <Heart className="h-3 w-3 text-pink-400" />
              <span>Reserved with warm wishes</span>
            </>
          ) : (
            <>
              <GiftIcon className="h-3.5 w-3.5 text-pink-500" />
              <span>First-come, first-served</span>
            </>
          )}
        </span>

        {onSelectGift && (
          <button
            type="button"
            onClick={() => {
              void handleClick();
            }}
            disabled={isCardDisabled}
            className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              isReserved
                ? "cursor-not-allowed bg-pink-100/70 text-pink-800/60 border border-pink-200/60"
                : isSelected
                  ? "bg-pink-500 text-white ring-2 ring-pink-300 hover:bg-pink-600"
                  : "bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:from-pink-500 hover:to-rose-500 hover:scale-105 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span>Selecting...</span>
            ) : isReserved ? (
              <>
                <span>Claimed</span>
                <Heart className="h-3.5 w-3.5 fill-current" />
              </>
            ) : isSelected ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <span>Select Gift</span>
                <GiftIcon className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
