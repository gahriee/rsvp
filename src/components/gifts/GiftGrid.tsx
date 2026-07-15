"use client";

import React from "react";
import { Gift } from "../../lib/types";
import { GiftCard } from "./GiftCard";

interface GiftGridProps {
  gifts: Gift[];
  selectedGiftId?: string | null;
  onSelectGift?: (giftId: string) => Promise<void> | void;
  disabled?: boolean;
}

export function GiftGrid({
  gifts,
  selectedGiftId,
  onSelectGift,
  disabled = false,
}: GiftGridProps) {
  if (gifts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>No gifts available in the registry at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gifts.map((gift) => (
        <GiftCard
          key={gift._id}
          gift={gift}
          isSelected={selectedGiftId === gift._id}
          onSelectGift={onSelectGift}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
