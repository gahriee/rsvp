"use client";

import React, { useState } from "react";
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
      gift.description.toLowerCase().includes(searchQuery.toLowerCase());
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
          "⚠️ Another guest just claimed this gift moments ago! We have refreshed the gift list below so you can see what is currently available."
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
        <div className="rounded-2xl border border-amber-500/50 bg-amber-950/80 p-5 backdrop-blur-md text-amber-200 shadow-xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">🚨</span>
            <div>
              <h4 className="font-bold text-white">Gift No Longer Available</h4>
              <p className="mt-1 text-sm text-amber-200/90 leading-relaxed">
                {conflictAlert}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConflictAlert(null)}
            className="rounded-lg bg-amber-900/50 px-3 py-1.5 text-xs font-bold text-amber-200 hover:bg-amber-800/60"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Banner & Search/Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
        {/* Availability Badge */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 font-extrabold text-lg">
            🎁
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Registry Status</h3>
            <p className="text-sm font-semibold text-indigo-300">
              Gifts Available:{" "}
              <span className="text-white font-extrabold">
                {availableCount}
              </span>{" "}
              / {totalCount}
            </p>
          </div>
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
              className="w-full sm:w-64 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
            {(["all", "available", "reserved"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
                  filter === tab
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gift Cards Grid */}
      {filteredGifts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-16 text-center text-slate-400 shadow-inner">
          <p className="text-lg font-bold text-white">No matching gifts found</p>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery || filter !== "all"
              ? "Try adjusting your search terms or availability filters above."
              : "No gifts available in the registry at this time."}
          </p>
          {(searchQuery || filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
            >
              Reset Filters
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
