"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ExternalLink, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render navbar on login page
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/v1/admin/logout", { method: "POST" });
      toast.success("Successfully logged out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { name: "Overview", href: "/admin" },
    { name: "RSVPs", href: "/admin/rsvps" },
    { name: "Gifts", href: "/admin/gifts" },
  ];

  return (
    <header className="bg-[#fffcf9] border-b-2 border-pink-100 text-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/admin"
              className="flex items-center space-x-2 font-serif font-extrabold text-xl text-pink-600 hover:text-pink-500 transition-colors"
            >
              <span>Admin Portal</span>
            </Link>
            <nav className="hidden md:flex space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-bold font-serif transition-all ${
                      isActive
                        ? "bg-pink-100 text-pink-700 shadow-inner border border-pink-200"
                        : "text-slate-500 hover:bg-pink-50 hover:text-pink-600 border border-transparent"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-full text-xs font-bold font-serif text-slate-500 hover:text-pink-600 border border-slate-200 hover:border-pink-300 bg-white shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold font-serif transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-pink-100 bg-[#fffcf9] px-4 pt-2 pb-4 space-y-2 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-base font-bold font-serif ${
                  isActive
                    ? "bg-pink-100 text-pink-700 shadow-inner border border-pink-200"
                    : "text-slate-500 hover:bg-pink-50 hover:text-pink-600 border border-transparent"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-2 border-t border-pink-100 flex flex-col gap-3">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold font-serif text-slate-600 border border-slate-200 bg-white hover:bg-pink-50"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Site
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold font-serif text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
