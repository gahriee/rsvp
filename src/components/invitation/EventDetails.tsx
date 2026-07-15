import React from "react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export function EventDetails() {
  const { event, graduate, copy } = EVENT_DETAILS;

  const encodedAddress = encodeURIComponent(event.venueAddress);
  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent">
            Event & Schedule Details
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            {copy.invitationMessage}
          </p>
        </div>

        {/* Event Schedule & Venue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Date & Time Card */}
          <div className="rounded-3xl bg-slate-800/80 border border-slate-700/80 p-8 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all hover:border-indigo-500/50">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 mb-6">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">When</h3>
              <p className="text-2xl font-extrabold text-indigo-300">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="mt-2 text-lg text-slate-300 font-medium">
                {event.time}
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700/60">
              <span className="text-sm text-slate-400">
                RSVP Deadline:{" "}
                <strong className="text-amber-300 font-semibold">
                  {new Date(event.rsvpDeadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </span>
            </div>
          </div>

          {/* Venue & Directions Card */}
          <div className="rounded-3xl bg-slate-800/80 border border-slate-700/80 p-8 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all hover:border-indigo-500/50">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 mb-6">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Where</h3>
              <p className="text-2xl font-extrabold text-purple-300">
                {event.venueName}
              </p>
              <p className="mt-2 text-base text-slate-300">
                {event.venueAddress}
              </p>
              <p className="mt-3 inline-block rounded-full bg-slate-700/60 px-3 py-1 text-xs font-semibold text-slate-300">
                Dress Code: {event.dressCode}
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700/60">
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Get Directions on Google Maps
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Graduate's Note / Bio Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 border border-indigo-500/30 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold">
              A Note from {graduate.firstName}
            </span>
            <blockquote className="mt-4 text-xl sm:text-2xl font-medium italic text-white leading-relaxed">
              &quot;{graduate.bioMessage}&quot;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
