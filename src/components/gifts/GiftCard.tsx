"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift } from "../../lib/types";

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
      className={`rounded-lg border p-4 shadow-sm transition-all ${
        isReserved
          ? "border-gray-200 bg-gray-50 opacity-60"
          : isSelected
            ? "border-blue-500 ring-2 ring-blue-500"
            : "border-gray-300 bg-white hover:shadow-md"
      }`}
    >
      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md bg-gray-100">
        <Image
          src={gift.imageUrl}
          alt={gift.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{gift.name}</h3>
      <p className="mt-1 text-sm text-gray-600">{gift.description}</p>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isReserved
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {isReserved ? "Reserved" : "Available"}
        </span>

        {onSelectGift && (
          <button
            type="button"
            onClick={() => {
              void handleClick();
            }}
            disabled={isCardDisabled}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isReserved
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : isSelected
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {loading
              ? "Selecting..."
              : isReserved
                ? "Taken"
                : isSelected
                  ? "Selected"
                  : "Select Gift"}
          </button>
        )}
      </div>
    </div>
  );
}
