import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";
import { Countdown } from "./Countdown";

export function Hero() {
  const { graduate, event, copy } = EVENT_DETAILS;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-20 sm:px-6 lg:px-8 text-white">
      {/* Background decorative glow elements */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500/15 blur-3xl" />

      <div className="mx-auto max-w-5xl text-center">
        {/* Class Year Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-indigo-300 shadow-inner">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          Class of {graduate.classYear} Celebration
        </div>

        {/* Celebratory Gradient Headlines */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent pb-2">
            {copy.heroHeadline}
          </span>
        </h1>
        <p className="mt-4 text-lg sm:text-2xl font-medium text-indigo-200/90 max-w-2xl mx-auto">
          {copy.heroSubheadline}
        </p>

        {/* Graduate Profile Card */}
        <div className="mt-10 mx-auto max-w-xl rounded-3xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 shadow-2xl transition-all hover:border-white/20">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-left sm:text-left">
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-indigo-400/40 shadow-lg">
              <Image
                src={graduate.photoUrl}
                alt={graduate.fullName}
                fill
                priority
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {graduate.fullName}
              </h2>
              <p className="mt-1 text-base font-semibold text-indigo-300">
                {graduate.degree} in {graduate.major}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {graduate.university}
              </p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300 mb-2">
            Counting down to {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          <Countdown targetDate={event.date} />
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/rsvp"
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-blue-500 hover:to-indigo-500 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            RSVP Now
          </Link>
          <Link
            href="/gifts"
            className="w-full sm:w-auto rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/20 hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            View Gift Registry
          </Link>
        </div>
      </div>
    </section>
  );
}
