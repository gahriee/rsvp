import React from "react";
import { Rsvp } from "@/lib/types";
import { Trash2, Eye } from "lucide-react";

interface RsvpTableProps {
  rsvps: Rsvp[];

  onDelete: (rsvp: Rsvp) => void;
  onViewMessage: (rsvp: Rsvp) => void;
  isDeletingId: string | null;
}

export function RsvpTable({
  rsvps,

  onDelete,
  onViewMessage,
  isDeletingId,
}: RsvpTableProps) {
  if (rsvps.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-pink-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
        <p className="text-lg font-serif font-bold text-slate-800">No RSVPs found matching your criteria.</p>
        <p className="text-sm font-serif mt-2">
          Try adjusting your search query or filter tabs.
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
              <th className="py-4 px-6">Guest Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Party Size</th>
              <th className="py-4 px-6">Message</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-100/60 text-sm font-medium">
            {rsvps.map((rsvp) => {
              const isDeleting = isDeletingId === rsvp._id;
              return (
                <tr
                  key={rsvp._id}
                  className="hover:bg-pink-50/30 transition-colors"
                >
                  <td className="py-4 px-6 font-serif font-bold text-slate-900 text-base">
                    {rsvp.guestName}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-serif">{rsvp.email}</td>
                  <td className="py-4 px-6 text-center">
                    {rsvp.attending ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-serif bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                        Attending
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-serif bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
                        Declined
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-slate-700 text-base">
                    {rsvp.attending ? rsvp.numberOfGuests : "—"}
                  </td>
                  <td className="py-4 px-6 text-slate-500 max-w-xs truncate font-serif italic">
                    {rsvp.message || (
                      <span className="text-slate-300">No message</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    {rsvp.message && (
                      <button
                        onClick={() => onViewMessage(rsvp)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-pink-100 text-pink-600 transition-colors duration-300 border border-slate-200 disabled:opacity-50 shadow-sm"
                        title="View Message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(rsvp)}
                      disabled={isDeleting}
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors duration-300 border border-rose-200 disabled:opacity-50 shadow-sm"
                      title="Delete RSVP"
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
