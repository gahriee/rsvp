"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-indigo-400 font-semibold">RSVP Form</span>
      </nav>

      {/* Page Title & Intro */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Graduation RSVP
        </h1>
        <p className="mt-2 text-base text-slate-300">
          Please let us know if you can join us to celebrate! Fill out the form below by the RSVP deadline.
        </p>
      </div>

      {/* Form Container */}
      <RsvpForm onSubmit={handleFormSubmit} selectedGiftId={giftId} />
    </div>
  );
}
