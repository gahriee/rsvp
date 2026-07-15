"use client";

import React, { useState } from "react";
import { Gift } from "@/lib/types";

interface GiftModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedGift: Gift, isNew: boolean) => void;
  giftToEdit: Gift | null;
}

export function GiftModalForm({
  isOpen,
  onClose,
  onSuccess,
  giftToEdit,
}: GiftModalFormProps) {
  const [name, setName] = useState(giftToEdit?.name || "");
  const [description, setDescription] = useState(giftToEdit?.description || "");
  const [imageUrl, setImageUrl] = useState(giftToEdit?.imageUrl || "");
  const [status, setStatus] = useState<"available" | "reserved">(
    giftToEdit?.status || "available"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !imageUrl.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const isNew = !giftToEdit;
      const url = isNew
        ? "/api/v1/gifts"
        : `/api/v1/gifts/${giftToEdit._id}`;
      const method = isNew ? "POST" : "PATCH";

      const payload: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        status,
      };

      if (status === "available") {
        payload.reservedBy = null;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to save gift item");
        setIsSaving(false);
        return;
      }

      onSuccess(data.data, isNew);
      onClose();
    } catch {
      setError("Network error while saving gift item");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white">
            {giftToEdit ? "Edit Gift Item" : "Add New Gift Item"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-white text-xl font-bold p-1 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Gift Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Espresso Machine"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the gift item..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          {giftToEdit && (
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Availability Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "available" | "reserved")
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="available">Available (Unclaimed)</option>
                <option value="reserved">Reserved (Claimed)</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-sm transition-colors disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : giftToEdit
                  ? "Save Changes"
                  : "Create Gift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
