"use client";

import React, { useState } from "react";
import { Rsvp } from "@/lib/types";
import { RsvpTable } from "./RsvpTable";

interface RsvpManagerProps {
  initialRsvps: Rsvp[];
}

type FilterTab = "all" | "attending" | "declining";

export function RsvpManager({ initialRsvps }: RsvpManagerProps) {
  const [rsvps, setRsvps] = useState<Rsvp[]>(initialRsvps);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [editingRsvp, setEditingRsvp] = useState<Rsvp | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Rsvp | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state for edit modal
  const [editGuestName, setEditGuestName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAttending, setEditAttending] = useState(true);
  const [editNumberOfGuests, setEditNumberOfGuests] = useState(1);
  const [editMessage, setEditMessage] = useState("");

  const handleOpenEdit = (rsvp: Rsvp) => {
    setEditingRsvp(rsvp);
    setEditGuestName(rsvp.guestName);
    setEditEmail(rsvp.email);
    setEditAttending(rsvp.attending);
    setEditNumberOfGuests(rsvp.numberOfGuests);
    setEditMessage(rsvp.message);
    setError(null);
    setSuccess(null);
  };

  const handleCloseEdit = () => {
    setEditingRsvp(null);
    setError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRsvp) return;

    try {
      setIsSaving(true);
      setError(null);

      const res = await fetch(`/api/v1/rsvp/${editingRsvp._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: editGuestName,
          email: editEmail,
          attending: editAttending,
          numberOfGuests: editAttending ? Number(editNumberOfGuests) : 1,
          message: editMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to update RSVP");
        setIsSaving(false);
        return;
      }

      setRsvps((prev) =>
        prev.map((r) => (r._id === editingRsvp._id ? data.data : r))
      );
      setSuccess("RSVP updated successfully.");
      setEditingRsvp(null);
    } catch {
      setError("Network error while updating RSVP");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeletingId(deleteTarget._id);
      setError(null);

      const res = await fetch(`/api/v1/rsvp/${deleteTarget._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to delete RSVP");
        setIsDeletingId(null);
        setDeleteTarget(null);
        return;
      }

      setRsvps((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setSuccess("RSVP deleted successfully.");
      setDeleteTarget(null);
    } catch {
      setError("Network error while deleting RSVP");
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            RSVP Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track guest responses, party sizes, and celebratory notes.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            {attendingCount} Attending
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
            {decliningCount} Declined
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-300 font-bold ml-4">
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-emerald-300 font-bold ml-4">
            &times;
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filterTab === "all"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({rsvps.length})
          </button>
          <button
            onClick={() => setFilterTab("attending")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filterTab === "attending"
                ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Attending ({attendingCount})
          </button>
          <button
            onClick={() => setFilterTab("declining")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filterTab === "declining"
                ? "bg-slate-800 text-slate-300 shadow-sm"
                : "text-slate-400 hover:text-white"
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
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <svg
            className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <RsvpTable
        rsvps={filteredRsvps}
        onEdit={handleOpenEdit}
        onDelete={(rsvp) => setDeleteTarget(rsvp)}
        isDeletingId={isDeletingId}
      />

      {/* Edit Modal */}
      {editingRsvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-4">Edit RSVP</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  value={editGuestName}
                  onChange={(e) => setEditGuestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                    Attending?
                  </label>
                  <select
                    value={editAttending ? "yes" : "no"}
                    onChange={(e) => setEditAttending(e.target.value === "yes")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="yes">Attending</option>
                    <option value="no">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    disabled={!editAttending}
                    value={editNumberOfGuests}
                    onChange={(e) => setEditNumberOfGuests(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Optional notes or congratulations..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Delete RSVP Submission?</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete the RSVP from{" "}
              <strong className="text-white">{deleteTarget.guestName}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors"
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
