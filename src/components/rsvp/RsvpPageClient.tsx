"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail } from "lucide-react";
import { RsvpForm } from "./RsvpForm";
import { submitRsvp } from "@/lib/apiClient";
import { CreateRsvpInput } from "@/lib/types";

export function RsvpPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const giftId = searchParams?.get("giftId") || null;

  const handleFormSubmit = async (data: CreateRsvpInput) => {
    const result = await submitRsvp(data);
    router.push(`/confirmation?rsvpId=${result._id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 font-medium">
        <Link href="/" className="hover:text-pink-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-pink-600 font-semibold flex items-center gap-1.5">
          <span>RSVP Form</span>
          <Sparkles className="h-3.5 w-3.5" />
        </span>
      </nav>

      {/* Page Title & Intro */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3.5 py-1 text-xs font-semibold text-pink-700 mb-3 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>You&apos;re Invited</span>
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 flex items-center justify-center sm:justify-start gap-3">
          <span>Graduation RSVP</span>
          <Mail className="h-8 w-8 text-pink-500 shrink-0" />
        </h1>
        <p className="mt-2 text-base text-slate-600 leading-relaxed">
          Please let us know if you can join us to celebrate Irish&apos;s special day! Fill out the stationery form below by the RSVP deadline.
        </p>
      </div>

      {/* Form Container */}
      <RsvpForm onSubmit={handleFormSubmit} selectedGiftId={giftId} />
    </div>
  );
}
