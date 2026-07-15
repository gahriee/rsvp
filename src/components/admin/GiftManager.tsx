"use client";

import React, { useState } from "react";
import { Gift } from "@/lib/types";
import { GiftTable } from "./GiftTable";
import { GiftModalForm } from "./GiftModalForm";

interface GiftManagerProps {
  initialGifts: Gift[];
}

type FilterStatus = "all" | "available" | "reserved";

export function GiftManager({ initialGifts }: GiftManagerProps) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftToEdit, setGiftToEdit] = useState<Gift | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Gift | null>(null);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setGiftToEdit(null);
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleOpenEdit = (gift: Gift) => {
    setGiftToEdit(gift);
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleModalSuccess = (savedGift: Gift, isNew: boolean) => {
    if (isNew) {
      setGifts((prev) => [savedGift, ...prev]);
      setSuccess("New gift item added to the registry.");
    } else {
      setGifts((prev) =>
        prev.map((g) => (g._id === savedGift._id ? savedGift : g))
      );
      setSuccess("Gift item updated successfully.");
    }
  };

  const handleToggleStatus = async (gift: Gift) => {
    try {
      setIsProcessingId(gift._id);
      setError(null);

      const newStatus = gift.status === "available" ? "reserved" : "available";
      const payload: Record<string, unknown> = { status: newStatus };
      if (newStatus === "available") {
        payload.reservedBy = null;
      }

      const res = await fetch(`/api/v1/gifts/${gift._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to toggle status");
        setIsProcessingId(null);
        return;
      }

      setGifts((prev) =>
        prev.map((g) => (g._id === gift._id ? data.data : g))
      );
      setSuccess(`Marked "${gift.name}" as ${newStatus}.`);
    } catch {
      setError("Network error toggling gift status");
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsProcessingId(deleteTarget._id);
      setError(null);

      const res = await fetch(`/api/v1/gifts/${deleteTarget._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to delete gift item");
        setIsProcessingId(null);
        setDeleteTarget(null);
        return;
      }

      setGifts((prev) => prev.filter((g) => g._id !== deleteTarget._id));
      setSuccess("Gift item deleted successfully.");
      setDeleteTarget(null);
    } catch {
      setError("Network error while deleting gift");
    } finally {
      setIsProcessingId(null);
    }
  };

  const filteredGifts = gifts.filter((gift) => {
    const matchesQuery =
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (filterStatus === "available") return gift.status === "available";
    if (filterStatus === "reserved") return gift.status === "reserved";
    return true;
  });

  const availableCount = gifts.filter((g) => g.status === "available").length;
  const reservedCount = gifts.filter((g) => g.status === "reserved").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Gift Registry Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Add new gifts, update descriptions, and manage reservations.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-950 font-bold text-sm shadow-lg shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Gift Item</span>
        </button>
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
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === "all"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({gifts.length})
          </button>
          <button
            onClick={() => setFilterStatus("available")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === "available"
                ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setFilterStatus("reserved")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === "reserved"
                ? "bg-purple-500/20 text-purple-400 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Reserved ({reservedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
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

      <GiftTable
        gifts={filteredGifts}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={(gift) => setDeleteTarget(gift)}
        isProcessingId={isProcessingId}
      />

      <GiftModalForm
        key={giftToEdit ? giftToEdit._id : isModalOpen ? "create" : "closed"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        giftToEdit={giftToEdit}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Gift Item?</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete <strong className="text-white">{deleteTarget.name}</strong> from the registry? This action cannot be undone.
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
