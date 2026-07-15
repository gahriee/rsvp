import React from "react";
import { Rsvp } from "@/lib/types";

interface RsvpTableProps {
  rsvps: Rsvp[];
  onEdit: (rsvp: Rsvp) => void;
  onDelete: (rsvp: Rsvp) => void;
  isDeletingId: string | null;
}

export function RsvpTable({
  rsvps,
  onEdit,
  onDelete,
  isDeletingId,
}: RsvpTableProps) {
  if (rsvps.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <p className="text-base font-medium">No RSVPs found matching your criteria.</p>
        <p className="text-xs text-slate-500 mt-1">
          Try adjusting your search query or filter tabs.
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
              <th className="py-4 px-6">Guest Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Party Size</th>
              <th className="py-4 px-6">Message</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-sm">
            {rsvps.map((rsvp) => {
              const isDeleting = isDeletingId === rsvp._id;
              return (
                <tr
                  key={rsvp._id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-white">
                    {rsvp.guestName}
                  </td>
                  <td className="py-4 px-6 text-slate-300">{rsvp.email}</td>
                  <td className="py-4 px-6 text-center">
                    {rsvp.attending ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Attending
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        Declined
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center font-medium text-slate-200">
                    {rsvp.attending ? rsvp.numberOfGuests : "—"}
                  </td>
                  <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                    {rsvp.message || (
                      <span className="text-slate-600 italic">No message</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => onEdit(rsvp)}
                      disabled={isDeleting}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(rsvp)}
                      disabled={isDeleting}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors border border-red-500/20 disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
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
