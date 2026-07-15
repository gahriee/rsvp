import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllRsvps } from "@/lib/services/rsvpService";
import { RsvpManager } from "@/components/admin/RsvpManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage RSVPs | Graduation Celebration Admin",
};

export default async function AdminRsvpsPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const rsvps = await getAllRsvps();

  return <RsvpManager initialRsvps={rsvps} />;
}
