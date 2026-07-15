import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginClient } from "@/components/admin/AdminLoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Graduation Celebration",
};

export default async function AdminLoginPage() {
  const isAuth = await isAdminAuthenticated();
  if (isAuth) {
    redirect("/admin");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <AdminLoginClient />
    </div>
  );
}
