"use client";

import React, { useState } from "react";
import { Gift } from "@/lib/types";
import { GiftTable } from "./GiftTable";
import { GiftModalForm } from "./GiftModalForm";
import { Search, X, Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface GiftManagerProps {
  initialGifts: Gift[];
  rsvpMap: Record<string, string>;
}

type FilterStatus = "all" | "available" | "reserved";

export function GiftManager({ initialGifts, rsvpMap }: GiftManagerProps) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftToEdit, setGiftToEdit] = useState<Gift | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Gift | null>(null);
  const [viewClaimersGift, setViewClaimersGift] = useState<Gift | null>(null);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/v1/gifts");
      const data = await res.json();
      if (res.ok && data.success) {
        setGifts(data.data);
        toast.success("Gifts refreshed");
      } else {
        toast.error("Failed to refresh gifts");
      }
    } catch {
      toast.error("Network error while refreshing");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreate = () => {
    setGiftToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gift: Gift) => {
    setGiftToEdit(gift);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedGift: Gift, isNew: boolean) => {
    if (isNew) {
      setGifts((prev) => [savedGift, ...prev]);
      toast.success("New gift item added to the registry.");
    } else {
      setGifts((prev) =>
        prev.map((g) => (g._id === savedGift._id ? savedGift : g))
      );
      toast.success("Gift item updated successfully.");
    }
  };



  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsProcessingId(deleteTarget._id);

      const res = await fetch(`/api/v1/gifts/${deleteTarget._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to delete gift item");
        setIsProcessingId(null);
        setDeleteTarget(null);
        return;
      }

      setGifts((prev) => prev.filter((g) => g._id !== deleteTarget._id));
      toast.success("Gift item deleted successfully.");
      setDeleteTarget(null);
    } catch {
      toast.error("Network error while deleting gift");
    } finally {
      setIsProcessingId(null);
    }
  };

  const filteredGifts = gifts.filter((gift) => {
    const matchesQuery =
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (filterStatus === "available") return gift.status === "available";
    if (filterStatus === "reserved") return gift.status === "reserved";
    return true;
  });

  const availableCount = gifts.filter((g) => g.status === "available").length;
  const reservedCount = gifts.filter((g) => g.status === "reserved").length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b-2 border-pink-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Gift Registry
          </h1>
          <p className="text-slate-500 text-sm font-serif mt-2">
            Add new gifts, update descriptions, and manage reservations.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="cursor-pointer inline-flex items-center justify-center p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 shadow-sm transition-colors duration-300 disabled:opacity-50"
            title="Refresh Gifts"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold font-serif text-sm shadow-md transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Gift Item</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-pink-100 shadow-sm">
          <button
            onClick={() => setFilterStatus("all")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold font-serif transition-colors ${
              filterStatus === "all"
                ? "bg-pink-100 text-pink-800 shadow-inner"
                : "text-slate-500 hover:text-pink-600 hover:bg-pink-50/50"
            }`}
          >
            All ({gifts.length})
          </button>
          <button
            onClick={() => setFilterStatus("available")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold font-serif transition-colors ${
              filterStatus === "available"
                ? "bg-emerald-50 text-emerald-600 shadow-inner"
                : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50"
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setFilterStatus("reserved")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold font-serif transition-colors ${
              filterStatus === "reserved"
                ? "bg-rose-50 text-rose-600 shadow-inner"
                : "text-slate-500 hover:text-rose-600 hover:bg-rose-50/50"
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

      <GiftTable
        gifts={filteredGifts}
        onEdit={handleOpenEdit}
        onViewClaimers={(gift) => setViewClaimersGift(gift)}
        onDelete={(gift) => setDeleteTarget(gift)}
        isProcessingId={isProcessingId}
      />

      <GiftModalForm
        key={giftToEdit ? giftToEdit._id : isModalOpen ? "create" : "closed"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        giftToEdit={giftToEdit}
        rsvpMap={rsvpMap}
      />

      {/* View Claimers Modal */}
      {viewClaimersGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-[#fffcf9] border-2 border-pink-100 rounded-sm w-full max-w-md p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative space-y-4">
             {/* Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-32 h-8 bg-gradient-to-r from-pink-200/90 to-rose-200/90 backdrop-blur-md transform -rotate-1 shadow-sm flex items-center justify-center text-[10px] font-bold text-pink-800 uppercase tracking-widest">
              Claimers
            </div>
            
            <h3 className="text-xl font-serif font-extrabold text-slate-900 text-center mt-2">
              Who Claimed This?
            </h3>
            <div className="flex justify-center mb-2">
              <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-bold font-serif border border-pink-100">
                {viewClaimersGift.name}
              </span>
            </div>
            
            <div className="bg-white border border-pink-100 rounded-xl p-4 max-h-64 overflow-y-auto mt-4 shadow-inner">
              {viewClaimersGift.reservedBy && viewClaimersGift.reservedBy.length > 0 ? (
                <ul className="space-y-2">
                  {viewClaimersGift.reservedBy.map((rsvpId) => (
                    <li key={rsvpId} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                      <span className="text-sm font-medium text-slate-700">
                        {rsvpMap[rsvpId] || "Unknown Guest"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-slate-500 italic font-serif">No one has claimed this gift yet.</p>
              )}
            </div>

            <div className="flex items-center justify-center pt-4 border-t border-pink-100">
              <button
                onClick={() => setViewClaimersGift(null)}
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
            
            <h3 className="text-xl font-serif font-extrabold text-slate-900 text-center mt-2">Delete Gift Item?</h3>
            <p className="text-sm font-serif text-slate-600 text-center">
              Are you sure you want to delete <strong className="text-slate-900">{deleteTarget.name}</strong> from the registry? This action cannot be undone.
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
