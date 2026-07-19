import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EVENT_DETAILS } from "@/lib/constants/eventDetails";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const title = `${EVENT_DETAILS.graduate.firstName}'s Graduation Celebration`;
const description = `Join us in celebrating ${EVENT_DETAILS.graduate.fullName}'s graduation from ${EVENT_DETAILS.graduate.university}. RSVP and view the gift registry.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${EVENT_DETAILS.graduate.firstName}'s Graduation`,
  },
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: `${EVENT_DETAILS.graduate.firstName}'s Graduation RSVP`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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
    <html lang="en" className={`${inter.variable} scroll-smooth overflow-x-hidden`}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-pink-100/40 to-pink-100/60 text-slate-800 font-sans selection:bg-pink-400 selection:text-white relative overflow-x-hidden">
        {/* Decorative background blur orbs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-pink-300/25 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-pink-200/35 blur-3xl" />
        </div>
        <main className="flex-grow relative z-10">{children}</main>
      </body>
    </html>
  );
}
