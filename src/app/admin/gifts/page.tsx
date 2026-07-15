import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllGifts } from "@/lib/services/giftService";
import { GiftManager } from "@/components/admin/GiftManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Gift Registry | Graduation Celebration Admin",
};

export default async function AdminGiftsPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const gifts = await getAllGifts();

  return <GiftManager initialGifts={gifts} />;
}
