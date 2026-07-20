"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminOverviewStats } from "@/lib/types";
import { RefreshCw, Users, Mail, Gift, AlertCircle, ArrowRight } from "lucide-react";

interface AdminOverviewClientProps {
  initialStats: AdminOverviewStats;
}

export function AdminOverviewClient({
  initialStats,
}: AdminOverviewClientProps) {
  const [stats, setStats] = useState<AdminOverviewStats>(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const res = await fetch("/api/v1/admin/stats");
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.data);
      } else {
        setError(data.error || "Failed to refresh statistics");
      }
    } catch {
      setError("Network error refreshing stats");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b-2 border-pink-100 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm font-serif mt-2">
            Real-time attendance metrics and wishlist reservations.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white border border-pink-200 text-pink-600 text-sm font-bold font-serif shadow-sm hover:bg-pink-50 transition-colors duration-300 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Stats"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm shadow-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards (Polaroid/Paper Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Card 1: Attendance */}
        <div className="bg-[#fffcf9] border-2 border-pink-100 rounded-sm p-6 relative shadow-[0_8px_30px_rgba(0,0,0,0.06)] transform hover:-translate-y-1 transition-all">
          <div className="absolute -top-3 left-6 z-10 w-24 h-7 bg-gradient-to-r from-emerald-100 to-teal-100 backdrop-blur-md transform -rotate-2 shadow-sm flex items-center justify-center text-[10px] font-bold text-emerald-800 uppercase tracking-widest border border-emerald-200/50">
            Attendance
          </div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="p-3 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-500 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Guests</span>
          </div>
          <div className="text-4xl font-serif font-extrabold text-slate-900 mb-1">
            {stats.attendingRsvps}
          </div>
          <p className="text-sm font-serif font-bold text-slate-500">Total Attending</p>
          <div className="mt-5 pt-4 border-t border-dashed border-emerald-200 flex items-center justify-between text-xs font-serif font-bold text-slate-500">
            <span className="text-emerald-600">{stats.attendingRsvps} attending</span>
            <span className="text-rose-400">{stats.decliningRsvps} declined</span>
          </div>
        </div>

        {/* Card 2: Responses */}
        <div className="bg-[#fffcf9] border-2 border-pink-100 rounded-sm p-6 relative shadow-[0_8px_30px_rgba(0,0,0,0.06)] transform hover:-translate-y-1 transition-all">
          <div className="absolute -top-3 left-6 z-10 w-24 h-7 bg-gradient-to-r from-blue-100 to-indigo-100 backdrop-blur-md transform rotate-1 shadow-sm flex items-center justify-center text-[10px] font-bold text-blue-800 uppercase tracking-widest border border-blue-200/50">
            Responses
          </div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="p-3 bg-blue-50 rounded-full border border-blue-100 text-blue-500 shadow-inner">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">RSVPs</span>
          </div>
          <div className="text-4xl font-serif font-extrabold text-slate-900 mb-1">
            {stats.totalRsvps}
          </div>
          <p className="text-sm font-serif font-bold text-slate-500">Total Submissions</p>
          <div className="mt-5 pt-4 border-t border-dashed border-blue-200 flex items-center justify-between text-xs font-serif font-bold text-slate-500">
            <span>Response Tracked</span>
            <Link
              href="/admin/rsvps"
              className="text-blue-600 hover:text-blue-500 flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 3: Registry */}
        <div className="bg-[#fffcf9] border-2 border-pink-100 rounded-sm p-6 relative shadow-[0_8px_30px_rgba(0,0,0,0.06)] transform hover:-translate-y-1 transition-all">
          <div className="absolute -top-3 left-6 z-10 w-24 h-7 bg-gradient-to-r from-purple-100 to-fuchsia-100 backdrop-blur-md transform -rotate-1 shadow-sm flex items-center justify-center text-[10px] font-bold text-purple-800 uppercase tracking-widest border border-purple-200/50">
            Registry
          </div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="p-3 bg-purple-50 rounded-full border border-purple-100 text-purple-500 shadow-inner">
              <Gift className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Gifts</span>
          </div>
          <div className="text-4xl font-serif font-extrabold text-slate-900 mb-1">
            {stats.reservedGifts}{" "}
            <span className="text-xl font-bold text-slate-400">
              / {stats.totalGifts}
            </span>
          </div>
          <p className="text-sm font-serif font-bold text-slate-500">Gifts Claimed</p>
          <div className="mt-5 pt-4 border-t border-dashed border-purple-200 flex items-center justify-between text-xs font-serif font-bold text-slate-500">
            <span className="text-emerald-600">{stats.availableGifts} available</span>
            <Link
              href="/admin/gifts"
              className="text-purple-600 hover:text-purple-500 flex items-center gap-1"
            >
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
        <Link
          href="/admin/rsvps"
          className="group block bg-white hover:bg-pink-50/50 border-2 border-pink-100 hover:border-pink-300 rounded-2xl p-6 sm:p-8 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5 text-pink-400" />
              Manage RSVPs
            </h2>
            <span className="p-2 rounded-full bg-pink-50 text-pink-400 group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors shadow-inner border border-pink-100">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-sm font-serif text-slate-600 leading-relaxed font-medium">
            Search, filter, and edit incoming guest RSVPs. Adjust guest attendance
            counts or remove duplicate submissions easily.
          </p>
        </Link>

        <Link
          href="/admin/gifts"
          className="group block bg-white hover:bg-pink-50/50 border-2 border-pink-100 hover:border-pink-300 rounded-2xl p-6 sm:p-8 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-400" />
              Manage Gifts
            </h2>
            <span className="p-2 rounded-full bg-pink-50 text-pink-400 group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors shadow-inner border border-pink-100">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-sm font-serif text-slate-600 leading-relaxed font-medium">
            Add new gifts, update descriptions and images, or
            manually mark items as reserved or available in the registry.
          </p>
        </Link>
      </div>
    </div>
  );
}
