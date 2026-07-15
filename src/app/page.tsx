import type { Metadata } from "next";
import { Hero } from "@/components/invitation/Hero";
import { EventDetails } from "@/components/invitation/EventDetails";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

const { graduate } = EVENT_DETAILS;

export const metadata: Metadata = {
  title: `${graduate.firstName}'s Graduation Celebration`,
  description: `RSVP and Gift Registry for ${graduate.fullName}. Join us in celebrating his graduation from ${graduate.university}.`,
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <EventDetails />
    </div>
  );
}
