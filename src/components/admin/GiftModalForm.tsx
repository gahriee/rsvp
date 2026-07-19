"use client";

import React, { useState } from "react";
import { Gift } from "@/lib/types";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface GiftModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedGift: Gift, isNew: boolean) => void;
  giftToEdit: Gift | null;
  rsvpMap: Record<string, string>;
}

export function GiftModalForm({
  isOpen,
  onClose,
  onSuccess,
  giftToEdit,
  rsvpMap,
}: GiftModalFormProps) {
  const [name, setName] = useState(giftToEdit?.name || "");
  const [description, setDescription] = useState(giftToEdit?.description || "");
  const [imageUrl, setImageUrl] = useState(giftToEdit?.imageUrl || "");
  const [productLink, setProductLink] = useState(giftToEdit?.productLink || "");
  const [maxReservations, setMaxReservations] = useState(giftToEdit?.maxReservations || 3);
  const status = giftToEdit?.status || "available";
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim()) {
      toast.error("Please fill in all required fields (Name and Image).");
      return;
    }

    try {
      setIsSaving(true);

      const isNew = !giftToEdit;
      const url = isNew
        ? "/api/v1/gifts"
        : `/api/v1/gifts/${giftToEdit._id}`;
      const method = isNew ? "POST" : "PATCH";

      const payload: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        productLink: productLink.trim(),
        maxReservations,
        status,
      };



      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to save gift item");
        setIsSaving(false);
        return;
      }

      onSuccess(data.data, isNew);
      onClose();
    } catch {
      toast.error("Network error while saving gift item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-[#fffcf9] border-2 border-pink-100 rounded-sm w-full max-w-lg p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative">
        {/* Washi Tape Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-32 h-8 bg-gradient-to-r from-pink-200/90 to-rose-200/90 backdrop-blur-md transform rotate-1 shadow-sm flex items-center justify-center text-[10px] font-bold text-pink-800 uppercase tracking-widest">
          {giftToEdit ? "Edit Gift" : "New Gift"}
        </div>

        <div className="flex items-center justify-between mb-6 border-b border-pink-100 pb-4 mt-2">
          <h2 className="text-2xl font-serif font-extrabold text-slate-900">
            {giftToEdit ? "Edit Gift Item" : "Add New Gift Item"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer text-slate-400 hover:text-pink-500 transition-colors p-1 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-serif font-bold text-slate-900 mb-2">
              Gift Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Espresso Machine"
              className="w-full bg-white border border-pink-200 rounded-2xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-300/30 transition-all shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-serif font-bold text-slate-900 mb-2">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the gift item..."
              className="w-full bg-white border border-pink-200 rounded-2xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-300/30 transition-all shadow-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-serif font-bold text-slate-900 mb-2">
              Image Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-white border border-pink-200 rounded-2xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-300/30 transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              required={!giftToEdit}
            />
            {imageUrl && giftToEdit && (
              <p className="mt-2 text-xs text-slate-500">
                Leaving this empty keeps the existing image.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-serif font-bold text-slate-900 mb-2">
              Product Link (Optional)
            </label>
            <input
              type="url"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="https://shopee.ph/..."
              className="w-full bg-white border border-pink-200 rounded-2xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-300/30 transition-all shadow-sm"
            />
          </div>

          {giftToEdit && (
            <div className="space-y-4">


              {giftToEdit.reservedBy && giftToEdit.reservedBy.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Claimed By ({giftToEdit.reservedBy.length})
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {giftToEdit.reservedBy.map((rsvpId) => (
                      <div key={rsvpId} className="text-sm text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm">
                        {rsvpMap[rsvpId] || "Unknown Guest"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-serif font-bold text-slate-900 mb-2">
              Max Reservations
            </label>
            <input
              type="number"
              min="1"
              value={maxReservations}
              onChange={(e) => setMaxReservations(parseInt(e.target.value) || 1)}
              className="w-full bg-white border border-pink-200 rounded-2xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-300/30 transition-all shadow-sm"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="cursor-pointer px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold font-serif transition-colors duration-300 shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold font-serif text-sm transition-colors duration-300 shadow-md disabled:opacity-50"
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
