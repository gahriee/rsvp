import React from "react";
import Image from "next/image";
import { Gift } from "@/lib/types";

interface GiftTableProps {
  gifts: Gift[];
  onEdit: (gift: Gift) => void;
  onToggleStatus: (gift: Gift) => void;
  onDelete: (gift: Gift) => void;
  isProcessingId: string | null;
}

export function GiftTable({
  gifts,
  onEdit,
  onToggleStatus,
  onDelete,
  isProcessingId,
}: GiftTableProps) {
  if (gifts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <p className="text-base font-medium">No gifts in the registry yet.</p>
        <p className="text-xs text-slate-500 mt-1">
          Click the &quot;Add Gift Item&quot; button above to create your first wishlist item.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Gift Item</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6">Claimed By</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-sm">
            {gifts.map((gift) => {
              const isProcessing = isProcessingId === gift._id;
              const isReserved = gift.status === "reserved";

              return (
                <tr
                  key={gift._id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                        <Image
                          src={gift.imageUrl}
                          alt={gift.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-white">
                        {gift.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300 max-w-xs truncate">
                    {gift.description}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onToggleStatus(gift)}
                      disabled={isProcessing}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all border disabled:opacity-50 ${
                        isReserved
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                      }`}
                      title="Click to toggle availability status"
                    >
                      {isReserved ? "Reserved" : "Available"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {gift.reservedBy ? (
                      <span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                        {gift.reservedBy.substring(0, 8)}...
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">None</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => onEdit(gift)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(gift)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors border border-red-500/20 disabled:opacity-50"
                    >
                      {isProcessing ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
