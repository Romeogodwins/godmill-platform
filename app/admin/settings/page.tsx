"use client";

import { useCallback, useEffect, useState } from "react";

interface Settings {
  id?: string;
  business_name: string;
  phone: string;
  email: string | null;
  address: string;
  check_in_time: string;
  check_out_time: string;
  breakfast_price: number;
  cancellation_policy: string;
}

const defaultSettings: Settings = {
  business_name: "",
  phone: "",
  email: "",
  address: "",
  check_in_time: "14:00",
  check_out_time: "10:00",
  breakfast_price: 120,
  cancellation_policy: "",
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/settings", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to load settings."
        );
      }

      const data = result.settings;

      setSettings({
        id: data.id,
        business_name: data.business_name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        check_in_time:
          data.check_in_time?.slice(0, 5) ?? "14:00",
        check_out_time:
          data.check_out_time?.slice(0, 5) ?? "10:00",
        breakfast_price: Number(
          data.breakfast_price ?? 120
        ),
        cancellation_policy:
          data.cancellation_policy ?? "",
      });
    } catch (err) {
      console.error("SETTINGS LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load settings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function updateField(
    field: keyof Settings,
    value: string | number
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: settings.business_name,
          phone: settings.phone,
          email: settings.email || null,
          address: settings.address,
          check_in_time: settings.check_in_time,
          check_out_time: settings.check_out_time,
          breakfast_price: Number(
            settings.breakfast_price
          ),
          cancellation_policy:
            settings.cancellation_policy,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to save settings."
        );
      }

      setMessage("Settings saved successfully.");

      if (result.settings) {
        setSettings((current) => ({
          ...current,
          ...result.settings,
          check_in_time:
            result.settings.check_in_time?.slice(0, 5) ??
            current.check_in_time,
          check_out_time:
            result.settings.check_out_time?.slice(0, 5) ??
            current.check_out_time,
        }));
      }
    } catch (err) {
      console.error("SETTINGS SAVE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
            Godmill Hotel Management
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Settings
          </h1>

          <p className="mt-3 text-gray-400">
            Manage guesthouse information, pricing and
            operational policies.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111111] p-12 text-center text-gray-400">
            Loading settings...
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-[#111111] p-7 md:p-8">
              <div className="mb-7">
                <h2 className="text-2xl font-semibold">
                  Business Information
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Main contact and property information.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="text-sm text-gray-300">
                  Business Name
                  <input
                    className={inputClass}
                    value={settings.business_name}
                    onChange={(event) =>
                      updateField(
                        "business_name",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="text-sm text-gray-300">
                  Phone Number
                  <input
                    className={inputClass}
                    value={settings.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="text-sm text-gray-300">
                  Email Address
                  <input
                    type="email"
                    className={inputClass}
                    value={settings.email ?? ""}
                    placeholder="Enter business email"
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="text-sm text-gray-300">
                  Breakfast Price
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4b16f]">
                      R
                    </span>

                    <input
                      type="number"
                      min="0"
                      className={`${inputClass} pl-9`}
                      value={settings.breakfast_price}
                      onChange={(event) =>
                        updateField(
                          "breakfast_price",
                          Number(event.target.value)
                        )
                      }
                    />
                  </div>
                </label>

                <label className="text-sm text-gray-300 md:col-span-2">
                  Address
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={settings.address}
                    onChange={(event) =>
                      updateField(
                        "address",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#111111] p-7 md:p-8">
              <div className="mb-7">
                <h2 className="text-2xl font-semibold">
                  Hotel Operations
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Configure check-in and check-out times.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="text-sm text-gray-300">
                  Check-in Time
                  <input
                    type="time"
                    className={inputClass}
                    value={settings.check_in_time}
                    onChange={(event) =>
                      updateField(
                        "check_in_time",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="text-sm text-gray-300">
                  Check-out Time
                  <input
                    type="time"
                    className={inputClass}
                    value={settings.check_out_time}
                    onChange={(event) =>
                      updateField(
                        "check_out_time",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#111111] p-7 md:p-8">
              <div className="mb-7">
                <h2 className="text-2xl font-semibold">
                  Cancellation Policy
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Policy used for guest bookings and
                  cancellations.
                </p>
              </div>

              <textarea
                rows={5}
                className={inputClass}
                value={settings.cancellation_policy}
                onChange={(event) =>
                  updateField(
                    "cancellation_policy",
                    event.target.value
                  )
                }
              />
            </section>

            <div className="flex flex-wrap items-center justify-end gap-4">
              <button
                type="button"
                onClick={loadSettings}
                disabled={saving}
                className="rounded-full border border-[#d4b16f]/40 px-7 py-3 font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f]/10 disabled:opacity-50"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="rounded-full bg-[#d4b16f] px-8 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}