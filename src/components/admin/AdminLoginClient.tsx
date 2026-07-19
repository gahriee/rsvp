"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Key } from "lucide-react";
import toast from "react-hot-toast";

export function AdminLoginClient() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Please enter the admin password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "Invalid password. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Successfully logged in!");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Failed to connect to the server. Please check your network.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#fffcf9] border-2 border-pink-100 rounded-sm p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-visible mt-10">
      {/* Washi Tape Accent */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-32 h-8 bg-gradient-to-r from-pink-200/90 to-rose-200/90 backdrop-blur-md transform rotate-1 shadow-sm flex items-center justify-center text-[10px] font-bold text-pink-800 uppercase tracking-widest">
        Admin Access
      </div>

      <div className="text-center mb-8 mt-2 relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 border border-pink-200 text-pink-500 mb-4 shadow-inner">
          <Key className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-sm font-serif text-slate-500 mt-2">
          Enter the password to access the graduation control panel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-serif font-bold text-slate-900 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              className="w-full bg-white border border-pink-200 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-300/30 transition-all font-medium pr-12 disabled:opacity-50 shadow-sm text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-500 p-1.5 focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer w-full rounded-full bg-pink-500 px-8 py-3 text-sm font-bold font-serif text-white shadow-md transition-all hover:bg-pink-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Login</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
