import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/invitation/Hero";
import { CountdownSection } from "@/components/invitation/CountdownSection";
import { DressCode } from "@/components/invitation/DressCode";
import { OutfitsCarousel } from "@/components/invitation/OutfitsCarousel";
import { MapNavigation } from "@/components/invitation/MapNavigation";
import { RegistryAndRsvpSection } from "@/components/invitation/RegistryAndRsvpSection";
import { EnvelopeGate } from "@/components/invitation/EnvelopeGate";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";
import { MusicPlayer } from "@/components/ui/MusicPlayer";

const { graduate } = EVENT_DETAILS;

export const metadata: Metadata = {
  title: `${graduate.firstName}'s Graduation Celebration`,
  description: `RSVP and Gift Registry for ${graduate.fullName}. Join us in celebrating his graduation from ${graduate.university}.`,
};

export default function HomePage() {
  return (
    <EnvelopeGate>
      <div className="flex flex-col space-y-8 sm:space-y-16 pb-24">
        <Hero />
        <CountdownSection />
        <MapNavigation />
        <DressCode />
        <OutfitsCarousel />
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-4 py-12">
              <div className="h-96 w-full rounded-3xl bg-pink-100/50 animate-pulse border border-pink-200" />
            </div>
          }
        >
          <RegistryAndRsvpSection />
        </Suspense>
      </div>
      <MusicPlayer url="https://www.youtube.com/watch?v=4M9K0i2TCb0" />
    </EnvelopeGate>
  );
}
