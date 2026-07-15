import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminOverviewStats } from "@/lib/services/adminService";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview | Graduation Celebration Admin",
};

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const stats = await getAdminOverviewStats();

  return <AdminOverviewClient initialStats={stats} />;
}
