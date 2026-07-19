import React from "react";
import Image from "next/image";
import { Gift } from "@/lib/types";
import { Edit2, Trash2, ExternalLink, Eye } from "lucide-react";

interface GiftTableProps {
  gifts: Gift[];
  onEdit: (gift: Gift) => void;
  onViewClaimers: (gift: Gift) => void;
  onDelete: (gift: Gift) => void;
  isProcessingId: string | null;
}

export function GiftTable({
  gifts,
  onEdit,
  onViewClaimers,
  onDelete,
  isProcessingId,
}: GiftTableProps) {
  if (gifts.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-pink-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
        <p className="text-lg font-serif font-bold text-slate-800">No gifts in the registry yet.</p>
        <p className="text-sm font-serif mt-2">
          Click the &quot;Add Gift Item&quot; button above to create your first wishlist item.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-pink-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-pink-100 bg-pink-50/50 text-pink-800 text-xs font-bold uppercase tracking-wider font-serif">
              <th className="py-4 px-6">Gift Item</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6">Claimed By</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-100/60 text-sm font-medium">
            {gifts.map((gift) => {
              const isProcessing = isProcessingId === gift._id;
              const isReserved = gift.status === "reserved" || (gift.reservedBy && gift.reservedBy.length >= gift.maxReservations);

              return (
                <tr
                  key={gift._id}
                  className="hover:bg-pink-50/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 flex-shrink-0 shadow-sm p-1">
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                          <Image
                            src={gift.imageUrl}
                            alt={gift.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <span className="font-serif font-bold text-slate-900 text-base">
                        {gift.name}
                      </span>
                      {gift.productLink && (
                        <a
                          href={gift.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-600 transition-colors ml-2"
                          title="View Product"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 max-w-xs truncate font-serif">
                    {gift.description}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold font-serif border shadow-sm ${
                        isReserved
                          ? "bg-purple-50 text-purple-600 border-purple-200"
                          : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      }`}
                    >
                      {isReserved ? "Fully Reserved" : `Available (${gift.maxReservations - (gift.reservedBy?.length || 0)}/${gift.maxReservations})`}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    {gift.reservedBy && gift.reservedBy.length > 0 ? (
                      <span className="font-mono text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-semibold shadow-inner">
                        {gift.reservedBy.length} {gift.reservedBy.length === 1 ? 'claim' : 'claims'}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic font-serif">None</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    {gift.reservedBy && gift.reservedBy.length > 0 && (
                      <button
                        onClick={() => onViewClaimers(gift)}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-pink-100 text-pink-600 transition-colors duration-300 border border-slate-200 disabled:opacity-50 shadow-sm"
                        title="View Claimers"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(gift)}
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors duration-300 border border-slate-200 disabled:opacity-50 shadow-sm"
                      title="Edit Gift"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(gift)}
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors duration-300 border border-rose-200 disabled:opacity-50 shadow-sm"
                      title="Delete Gift"
                    >
                      <Trash2 className="w-4 h-4" />
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
