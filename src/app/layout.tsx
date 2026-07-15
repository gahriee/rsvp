import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GuestNavbar } from "@/components/navigation/GuestNavbar";
import { Footer } from "@/components/navigation/Footer";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${EVENT_DETAILS.graduate.firstName}'s Graduation Celebration`,
    template: `%s | ${EVENT_DETAILS.graduate.firstName}'s Graduation`,
  },
  description: `Join us in celebrating ${EVENT_DETAILS.graduate.fullName}'s graduation from ${EVENT_DETAILS.graduate.university}. RSVP and view the gift registry.`,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <GuestNavbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
