"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../../lib/supabase/browser";

export default function AdminResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkRecoverySession() {
      try {
        const supabase = createSupabaseBrowserClient();

        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          setError(
            "The password reset session is missing or has expired. Request a new reset link from the admin login page."
          );
        }
      } catch {
        setError(
          "Unable to verify the password reset session."
        );
      } finally {
        setCheckingSession(false);
      }
    }

    checkRecoverySession();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError(
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const supabase = createSupabaseBrowserClient();

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        throw updateError;
      }

      setMessage(
        "Your admin password has been changed successfully."
      );

      setPassword("");
      setConfirmPassword("");

      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/admin/login");
      }, 2000);
    } catch (err) {
      console.error("PASSWORD UPDATE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to change your password."
      );
    } finally {
      setLoading(false);
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
            Set New Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Create a new password for your Godmill management account.
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

        {checkingSession ? (
          <div className="mt-8 text-center text-sm text-gray-400">
            Verifying secure reset link...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
                placeholder="Repeat your new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!error}
              className="w-full rounded-full bg-[#d4b16f] px-5 py-3 font-bold text-black transition hover:bg-[#e3c27d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Updating password..."
                : "Set New Password"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="mt-6 w-full text-center text-sm font-semibold text-[#d4b16f]"
        >
          Return to Admin Login
        </button>
      </div>
    </main>
  );
}