"use client";

import React, { useState } from "react";
import { Rsvp } from "@/lib/types";
import { RsvpTable } from "./RsvpTable";
import { Search, X } from "lucide-react";
import toast from "react-hot-toast";

interface RsvpManagerProps {
  initialRsvps: Rsvp[];
}

type FilterTab = "all" | "attending" | "declining";

export function RsvpManager({ initialRsvps }: RsvpManagerProps) {
  const [rsvps, setRsvps] = useState<Rsvp[]>(initialRsvps);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [deleteTarget, setDeleteTarget] = useState<Rsvp | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [viewMessageRsvp, setViewMessageRsvp] = useState<Rsvp | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeletingId(deleteTarget._id);

      const res = await fetch(`/api/v1/rsvp/${deleteTarget._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to delete RSVP");
        setIsDeletingId(null);
        setDeleteTarget(null);
        return;
      }

      setRsvps((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      toast.success("RSVP deleted successfully.");
      setDeleteTarget(null);
    } catch {
      toast.error("Network error while deleting RSVP");
    } finally {
      setIsDeletingId(null);
    }
  };

  const filteredRsvps = rsvps.filter((rsvp) => {
    const matchesQuery =
      rsvp.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rsvp.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (filterTab === "attending") return rsvp.attending;
    if (filterTab === "declining") return !rsvp.attending;
    return true;
  });

  const attendingCount = rsvps.filter((r) => r.attending).length;
  const decliningCount = rsvps.filter((r) => !r.attending).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b-2 border-pink-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            RSVP Management
          </h1>
          <p className="text-slate-500 text-sm font-serif mt-2">
            Track guest responses, party sizes, and celebratory notes.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold font-serif shadow-sm">
            {attendingCount} Attending
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200 font-bold font-serif shadow-sm">
            {decliningCount} Declined
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-pink-100 shadow-sm">
          <button
            onClick={() => setFilterTab("all")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold font-serif transition-colors ${
              filterTab === "all"
                ? "bg-pink-100 text-pink-800 shadow-inner"
                : "text-slate-500 hover:text-pink-600 hover:bg-pink-50/50"
            }`}
          >
            All ({rsvps.length})
          </button>
          <button
            onClick={() => setFilterTab("attending")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold font-serif transition-colors ${
              filterTab === "attending"
                ? "bg-emerald-50 text-emerald-600 shadow-inner"
                : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50"
            }`}
          >
            Attending ({attendingCount})
          </button>
          <button
            onClick={() => setFilterTab("declining")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold font-serif transition-colors ${
              filterTab === "declining"
                ? "bg-rose-50 text-rose-600 shadow-inner"
                : "text-slate-500 hover:text-rose-600 hover:bg-rose-50/50"
            }`}
          >
            Declined ({decliningCount})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-white border border-pink-200 rounded-2xl px-4 py-2.5 pl-10 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-300/30 transition-all font-medium shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <RsvpTable
        rsvps={filteredRsvps}
        onDelete={(rsvp) => setDeleteTarget(rsvp)}
        onViewMessage={(rsvp) => setViewMessageRsvp(rsvp)}
        isDeletingId={isDeletingId}
      />

      {/* View Message Modal */}
      {viewMessageRsvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-[#fffcf9] border-2 border-pink-100 rounded-sm w-full max-w-md p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative space-y-4">
             {/* Washi Tape Accent */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-32 h-8 bg-gradient-to-r from-pink-200/90 to-rose-200/90 backdrop-blur-md transform rotate-1 shadow-sm flex items-center justify-center text-[10px] font-bold text-pink-800 uppercase tracking-widest">
              Message
            </div>
            
            <h3 className="text-xl font-serif font-extrabold text-slate-900 mt-2">
              Note from {viewMessageRsvp.guestName}
            </h3>
            <div className="bg-white border border-pink-100 rounded-xl p-4 text-slate-700 text-sm font-serif leading-relaxed shadow-inner max-h-60 overflow-y-auto whitespace-pre-wrap">
              {viewMessageRsvp.message}
            </div>
            <div className="flex justify-end pt-4 border-t border-pink-100">
              <button
                onClick={() => setViewMessageRsvp(null)}
                className="px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold font-serif text-sm transition-colors duration-300 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-[#fffcf9] border-2 border-pink-100 rounded-sm w-full max-w-md p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative space-y-4">
             {/* Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-32 h-8 bg-gradient-to-r from-red-200/90 to-rose-200/90 backdrop-blur-md transform -rotate-1 shadow-sm flex items-center justify-center text-[10px] font-bold text-red-800 uppercase tracking-widest">
              Danger
            </div>
            <h3 className="text-xl font-serif font-extrabold text-slate-900 text-center mt-2">Delete RSVP?</h3>
            <p className="text-sm font-serif text-slate-600 text-center">
              Are you sure you want to delete the RSVP from{" "}
              <strong className="text-slate-900">{deleteTarget.guestName}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-pink-100">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold font-serif transition-colors duration-300 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold font-serif text-sm transition-colors duration-300 shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
