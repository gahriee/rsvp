import React from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ToastProvider } from "@/components/providers/ToastProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Graduation Celebration",
  description: "Manage RSVPs and Gift Registry for the graduation celebration.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AdminNavbar />
      <ToastProvider />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
