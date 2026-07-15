"use client";

import React, { useState } from "react";
import Image from "next/image";
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

  const isReserved = gift.status === "reserved";
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
      className={`flex flex-col justify-between rounded-2xl border p-5 shadow-xl transition-all ${
        isReserved
          ? "border-slate-800 bg-slate-900/60 opacity-60"
          : isSelected
            ? "border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500 shadow-indigo-500/10"
            : "border-slate-800 bg-slate-900 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1"
      }`}
    >
      <div>
        <div className="relative mb-4 h-52 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <Image
            src={gift.imageUrl}
            alt={gift.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${
              isReserved ? "grayscale opacity-80" : "hover:scale-105"
            }`}
          />
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md shadow-md ${
                isReserved
                  ? "bg-red-500/80 text-white border border-red-400/30"
                  : "bg-emerald-500/80 text-white border border-emerald-400/30"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isReserved ? "bg-white" : "bg-white animate-pulse"
                }`}
              />
              {isReserved ? "Reserved" : "Available"}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">
          {gift.name}
        </h3>
        <p className="mt-1.5 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {gift.description}
        </p>

        {error && (
          <div className="mt-3 rounded-lg border border-red-500/40 bg-red-950/50 p-2.5 text-xs font-semibold text-red-300">
            {error}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {isReserved ? "No longer available" : "First-come, first-served"}
        </span>

        {onSelectGift && (
          <button
            type="button"
            onClick={() => {
              void handleClick();
            }}
            disabled={isCardDisabled}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all shadow-md ${
              isReserved
                ? "cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700/50"
                : isSelected
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-400 hover:bg-indigo-500"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 hover:scale-105"
            }`}
          >
            {loading
              ? "Processing..."
              : isReserved
                ? "Taken"
                : isSelected
                  ? "✓ Selected"
                  : "Select Gift"}
          </button>
        )}
      </div>
    </div>
  );
}
