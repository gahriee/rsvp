import React from "react";
import { Calendar, Clock, MapPin, Shirt, Sparkles, Heart, ArrowRight } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

export function EventDetails() {
  const { event, graduate, copy } = EVENT_DETAILS;

  const encodedAddress = encodeURIComponent(event.venueAddress);
  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="mx-auto max-w-5xl">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-700 mb-4 shadow-sm">
            <Sparkles className="h-4 w-4 text-pink-600" />
            <span>Celebration Details</span>
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-5xl text-slate-900">
            When & Where We Celebrate
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {copy.invitationMessage}
          </p>
        </div>

        {/* Event Schedule & Venue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Date & Time Card */}
          <div className="rounded-3xl bg-white/90 border-2 border-pink-200/80 p-8 shadow-xl shadow-pink-100/60 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:border-pink-300 hover:shadow-2xl hover:-translate-y-1 group">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 mb-6 shadow-inner text-2xl group-hover:scale-110 transition-transform">
                <Calendar className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">When</h3>
              <p className="text-2xl font-serif font-extrabold text-pink-500">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <div className="mt-3 flex items-center gap-2 text-lg text-slate-700 font-medium">
                <Clock className="h-5 w-5 text-pink-500" />
                <span>{event.time}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-pink-100/80">
              <span className="text-sm text-slate-600">
                RSVP Deadline:{" "}
                <strong className="text-pink-600 font-semibold">
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
          <div className="rounded-3xl bg-white/90 border-2 border-pink-200/80 p-8 shadow-xl shadow-pink-100/60 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:border-pink-300 hover:shadow-2xl hover:-translate-y-1 group">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 mb-6 shadow-inner text-2xl group-hover:scale-110 transition-transform">
                <MapPin className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Where</h3>
              <p className="text-2xl font-serif font-extrabold text-pink-500">
                {event.venueName}
              </p>
              <p className="mt-2 text-base text-slate-600">
                {event.venueAddress}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-pink-50 border border-pink-200/60 px-3.5 py-1.5 text-xs font-semibold text-pink-800">
                <Shirt className="h-4 w-4 text-pink-600" />
                <span>Dress Code: {event.dressCode}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-pink-100/80">
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors underline-offset-4 hover:underline"
              >
                <span>Get Directions on Google Maps</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Graduate's Note / Bio Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 p-8 sm:p-10 text-center shadow-2xl text-white">
          {/* Subtle floral accents */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/10 blur-xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs uppercase tracking-widest text-pink-100 font-bold mb-3 backdrop-blur-md">
              <Heart className="h-3.5 w-3.5 fill-white text-white" />
              <span>A Heartfelt Note from {graduate.firstName}</span>
            </div>
            <blockquote className="mt-3 text-xl sm:text-2xl font-serif italic font-medium text-white leading-relaxed">
              &quot;{graduate.bioMessage}&quot;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
