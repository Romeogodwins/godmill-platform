"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../../lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const supabase = createSupabaseBrowserClient();

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        throw signInError;
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Enter your admin email address first.");
      setMessage("");
      return;
    }

    try {
      setResetLoading(true);
      setError("");
      setMessage("");

      const supabase = createSupabaseBrowserClient();

      const redirectUrl =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
          ? `${window.location.origin}/admin/reset-password`
          : "https://www.godmillcityguesthouse.com/admin/reset-password";

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: redirectUrl,
        });

      if (resetError) {
        throw resetError;
      }

      setMessage(
        "Password reset email sent. Check your inbox and follow the secure reset link."
      );
    } catch (err) {
      console.error("PASSWORD RESET ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to send the password reset email."
      );
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111111] p-7 shadow-2xl sm:p-9">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
            Godmill City Guesthouse
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Secure access to Godmill Hotel Management.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Admin Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-300"
              >
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-sm font-semibold text-[#d4b16f] transition hover:text-[#e3c27d] disabled:opacity-50"
              >
                {resetLoading
                  ? "Sending..."
                  : "Forgot password?"}
              </button>
            </div>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#d4b16f] px-5 py-3 font-bold text-black transition hover:bg-[#e3c27d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-7 border-t border-white/10 pt-5">
          <p className="text-center text-xs leading-5 text-gray-500">
            Authorised management access only.
          </p>
        </div>
      </div>
    </main>
  );
}