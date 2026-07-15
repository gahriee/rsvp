"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminOverviewStats } from "@/lib/types";

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time attendance metrics and wishlist reservations.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700 self-start sm:self-auto disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{isRefreshing ? "Refreshing..." : "Refresh Stats"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Attendance
            </span>
            <svg
              className="w-6 h-6 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">
            {stats.totalGuestsAttending}
          </div>
          <p className="text-sm text-slate-400">Total Guests Attending</p>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{stats.attendingRsvps} attending RSVPs</span>
            <span>{stats.decliningRsvps} declined</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              Responses
            </span>
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">
            {stats.totalRsvps}
          </div>
          <p className="text-sm text-slate-400">Total RSVP Submissions</p>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Response Rate Tracked</span>
            <Link
              href="/admin/rsvps"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Manage &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
              Gift Registry
            </span>
            <svg
              className="w-6 h-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">
            {stats.reservedGifts}{" "}
            <span className="text-lg font-normal text-slate-500">
              / {stats.totalGifts}
            </span>
          </div>
          <p className="text-sm text-slate-400">Gifts Claimed by Guests</p>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{stats.availableGifts} gifts still available</span>
            <Link
              href="/admin/gifts"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Registry &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Link
          href="/admin/rsvps"
          className="group block bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Manage Guest Responses
            </h2>
            <span className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
              &rarr;
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Search, filter, and edit incoming RSVPs. Adjust guest attendance
            counts or remove duplicate submissions.
          </p>
        </Link>

        <Link
          href="/admin/gifts"
          className="group block bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-6 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
              Manage Gift Registry
            </h2>
            <span className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-colors">
              &rarr;
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Add new gifts with image URLs, modify existing item details, or
            manually mark items as available or reserved.
          </p>
        </Link>
      </div>
    </div>
  );
}
