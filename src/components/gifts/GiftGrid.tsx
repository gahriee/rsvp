"use client";

import React, { useState } from "react";
import { AlertCircle, Heart, Sparkles, X } from "lucide-react";
import { Gift } from "@/lib/types";
import { GiftCard } from "./GiftCard";

interface GiftGridProps {
  gifts: Gift[];
  selectedGiftId?: string | null;
  onSelectGift?: (giftId: string) => Promise<void> | void;
  onRefreshGifts?: () => Promise<void> | void;
  disabled?: boolean;
}

export function GiftGrid({
  gifts,
  selectedGiftId,
  onSelectGift,
  onRefreshGifts,
  disabled = false,
}: GiftGridProps) {
  const [filter, setFilter] = useState<"all" | "available" | "reserved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [conflictAlert, setConflictAlert] = useState<string | null>(null);

  const availableCount = gifts.filter((g) => g.status === "available").length;
  const totalCount = gifts.length;

  const filteredGifts = gifts.filter((gift) => {
    const matchesFilter = filter === "all" || gift.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSelectWrapper = async (giftId: string) => {
    setConflictAlert(null);
    if (!onSelectGift) return;

    try {
      await onSelectGift(giftId);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to select gift";
      if (
        errMsg.toLowerCase().includes("reserved") ||
        errMsg.toLowerCase().includes("conflict") ||
        errMsg.toLowerCase().includes("unavailable")
      ) {
        setConflictAlert(
          "Another guest just claimed this gift moments ago! We have refreshed the gift wishlist below so you can see what is currently available."
        );
        if (onRefreshGifts) {
          void onRefreshGifts();
        }
      } else {
        setConflictAlert(errMsg);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Race Condition Conflict Banner */}
      {conflictAlert && (
        <div className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 backdrop-blur-md text-amber-950 shadow-xl flex items-start justify-between gap-4 animate-bounce-short">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-2">
                <span>Gift Just Claimed by Another Guest</span>
              </h4>
              <p className="mt-1 text-sm text-amber-900 leading-relaxed font-medium">
                {conflictAlert}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConflictAlert(null)}
            className="rounded-full bg-amber-200/80 px-4 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-300 transition-colors shadow-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Banner & Search/Filter Bar */}
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#fffcf9] rounded-sm p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        {/* Washi Tape */}
        <div className="absolute -top-3 left-4 sm:left-10 z-30 w-24 sm:w-32 h-7 sm:h-8 bg-gradient-to-r from-pink-200/90 to-rose-200/90 backdrop-blur-md transform rotate-2 shadow-sm flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-pink-800 uppercase tracking-widest">
          Wishlist
        </div>
        {/* Availability Header */}
        <div className="flex flex-col pt-2">
          <h3 className="text-lg font-serif font-bold text-slate-900">
            Flower Garden Wishlist
          </h3>
          <p className="text-sm font-semibold text-pink-600 mt-1">
            Gifts Available:{" "}
            <span className="text-base">
              {availableCount}
            </span>{" "}
            / {totalCount}
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gifts..."
              className="w-full sm:w-64 rounded-full border border-pink-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-inner focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-300/30 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50/40 p-1.5 shadow-inner">
            {(["all", "available", "reserved"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1 ${
                  filter === tab
                    ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md scale-[1.03]"
                    : "text-slate-600 hover:text-pink-800 capitalize"
                }`}
              >
                <span>{tab === "reserved" ? "Claimed" : tab}</span>
                {tab === "reserved" && <Heart className={`h-3 w-3 ${filter === tab ? "fill-white text-white" : "text-pink-500"}`} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gift Cards Grid */}
      {filteredGifts.length === 0 ? (
        <div className="rounded-3xl border-2 border-pink-100 bg-white/80 py-16 text-center text-slate-600 shadow-md">
          <p className="text-xl font-serif font-bold text-slate-900 flex items-center justify-center gap-2">
            <span>No matching gifts found</span>
            <Sparkles className="h-5 w-5 text-pink-400" />
          </p>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            {searchQuery || filter !== "all"
              ? "Try adjusting your search terms or availability filters above to see more items from the wishlist."
              : "No gifts available in the registry at this time."}
          </p>
          {(searchQuery || filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="mt-6 rounded-full bg-pink-400 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-pink-500 transition-all flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>Reset All Filters</span>
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGifts.map((gift) => (
            <GiftCard
              key={gift._id}
              gift={gift}
              isSelected={selectedGiftId === gift._id}
              onSelectGift={onSelectGift ? handleSelectWrapper : undefined}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
