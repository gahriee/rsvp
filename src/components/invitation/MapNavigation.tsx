"use client";

import React from "react";
import { MapPin, Navigation, Car, Compass, Calendar, Clock, Sparkles, Award, Ticket } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";
import { FadeSlideImage } from "@/components/ui/FadeSlideImage";

export function MapNavigation() {
  const { event, navigation } = EVENT_DETAILS;

  if (!navigation) return null;

  const embedUrl = `https://maps.google.com/maps?q=${navigation.mapCoordinates.lat},${navigation.mapCoordinates.lng}&t=&z=16&ie=UTF8&output=embed`;

  return (
    <section id="location" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
      <FadeSlideImage direction="up">
        {/* Transparent & Borderless Container so inner perforated tickets float directly on the page background */}
        <div className="relative bg-transparent border-none shadow-none p-4 sm:p-10 transition-all duration-700 ease-out">

          {/* Realistic Multi-Layered Washi Tape Accents on Top Corners */}
          <div className="absolute -top-4 left-6 sm:left-14 z-30 w-36 sm:w-48 h-8 bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 backdrop-blur-md rounded-sm border border-pink-300 shadow-md transform -rotate-3 flex items-center justify-center text-[11px] font-bold text-pink-900 tracking-widest uppercase gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-pink-700" />
            <span>Event Pass</span>
          </div>
          <div className="absolute -top-4 right-6 sm:right-14 z-30 w-36 sm:w-44 h-8 bg-gradient-to-r from-pink-100 to-rose-200 backdrop-blur-md rounded-sm border border-pink-300 shadow-md transform rotate-2 hidden sm:flex items-center justify-center text-[11px] font-bold text-pink-900 tracking-widest uppercase gap-1.5">
            <Award className="h-3.5 w-3.5 text-pink-700" />
            <span>Class of 2026</span>
          </div>

          {/* Header */}
          <div className="text-center mt-6 mb-12 relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100/80 px-4 py-1.5 text-xs font-bold text-pink-700 mb-3 border border-pink-200/80 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Celebration Details</span>
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-serif font-bold text-slate-900 flex items-center justify-center gap-2.5">
              <span>Date, Time & Location</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto font-serif italic">
              Join us as we commemorate Irish&apos;s milestone achievement. Your exclusive VIP boarding pass to the celebration awaits!
            </p>
          </div>

          {/* Perforated VIP Ticket / Boarding Pass Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14 relative z-10">
            
            {/* Ticket Card 1: Date & Time Pass */}
            <FadeSlideImage direction="right" delay={150}>
              <div className="relative h-full rounded-3xl bg-white border-2 border-pink-200 shadow-xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-pink-400 hover:-translate-y-1.5 group">
                
                {/* Physical Stub Notches / Punches along left and right edges */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF6F0] border-2 border-pink-200 shadow-inner z-20" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF6F0] border-2 border-pink-200 shadow-inner z-20" />

                {/* Ticket Top Section */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-pink-50 border border-pink-200 px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase text-pink-700">
                      Admit One
                    </span>
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-1">When We Celebrate</h3>
                  <p className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 leading-tight">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-3.5 flex items-center gap-2.5 text-lg font-bold text-slate-700">
                    <Clock className="h-5 w-5 text-pink-500 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                </div>

                {/* Perforated Dashed Tear Line */}
                <div className="my-6 border-t-2 border-dashed border-pink-200 relative">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Stub Check
                  </span>
                </div>

                {/* Ticket Bottom Section */}
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>RSVP Deadline: <strong className="text-pink-700">{new Date(event.rsvpDeadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></span>
                  <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider">#GS-2026</span>
                </div>
              </div>
            </FadeSlideImage>

            {/* Ticket Card 2: Venue Destination Pass */}
            <FadeSlideImage direction="left" delay={250}>
              <div className="relative h-full rounded-3xl bg-white border-2 border-pink-200 shadow-xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-pink-400 hover:-translate-y-1.5 group">
                
                {/* Physical Stub Notches / Punches along left and right edges */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF6F0] border-2 border-pink-200 shadow-inner z-20" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF6F0] border-2 border-pink-200 shadow-inner z-20" />

                {/* Postal Cancellation Stamp Badge in Corner */}
                <div className="absolute top-5 right-6 w-20 h-20 rounded-full border-2 border-dashed border-rose-300/70 flex items-center justify-center -rotate-12 pointer-events-none opacity-80">
                  <div className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter text-center leading-tight font-mono">
                    POSTMARKED<br />• CITYVILLE •<br />AUG 2026
                  </div>
                </div>

                {/* Ticket Top Section */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md group-hover:scale-110 transition-transform">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-pink-50 border border-pink-200 px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase text-pink-700">
                      Destination
                    </span>
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-1">Where We Celebrate</h3>
                  <p className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 leading-tight">
                    {event.venueName}
                  </p>
                  <p className="mt-2 text-base text-slate-600 leading-relaxed font-serif">
                    {event.venueAddress}
                  </p>
                </div>

                {/* Perforated Dashed Tear Line */}
                <div className="my-6 border-t-2 border-dashed border-pink-200 relative">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Parking Info
                  </span>
                </div>

                {/* Ticket Bottom Section */}
                <div>
                  {navigation.parkingNotes && (
                    <div className="flex items-start gap-2.5 text-xs text-slate-600">
                      <Car className="h-4 w-4 text-pink-600 shrink-0 mt-0.5" />
                      <p className="font-serif leading-relaxed"><strong className="text-slate-800">Note:</strong> {navigation.parkingNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </FadeSlideImage>
          </div>

          {/* Embedded Google Map inside Polaroid Scrapbook Frame */}
          <FadeSlideImage direction="up" delay={350}>
            <div className="relative rounded-3xl bg-white p-4 sm:p-6 border-2 border-pink-200 shadow-2xl mb-10 transition-all hover:border-pink-300">
              
              {/* Decorative Stamp Corner Tag */}
              <div className="absolute -top-3 right-8 bg-pink-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md z-20 flex items-center gap-1">
                <Navigation className="h-3 w-3" />
                <span>GPS Verified</span>
              </div>

              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-pink-100 shadow-inner bg-pink-50">
                <iframe
                  title="Google Maps Location Preview"
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 text-center font-serif italic text-xs sm:text-sm text-slate-500">
                📍 Interactive Venue Map — Use the quick direction links below to start navigation right on your device.
              </div>
            </div>
          </FadeSlideImage>

          {/* Navigation Buttons Grid */}
          <FadeSlideImage direction="up" delay={450}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto relative z-10">
              <a
                href={navigation.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full bg-pink-500 px-6 py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-pink-600 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Directions on Google Maps</span>
                <Compass className="h-4 w-4" />
              </a>
              <a
                href={navigation.appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full bg-white border-2 border-pink-300 px-6 py-3.5 text-center text-sm font-bold text-slate-800 hover:bg-pink-50 hover:border-pink-400 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Open in Apple Maps</span>
                <Navigation className="h-4 w-4 text-pink-600" />
              </a>
            </div>
          </FadeSlideImage>
        </div>
      </FadeSlideImage>
    </section>
  );
}
