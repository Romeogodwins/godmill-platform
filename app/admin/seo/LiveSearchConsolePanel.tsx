"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

type Row = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  targetPosition: number;
  targetPage: string;
  action:
    | "protect"
    | "improve"
    | "opportunity";
  note: string;
  baselinePosition:
    | number
    | null;
  positionChange:
    | number
    | null;
  movement:
    | "improved"
    | "declined"
    | "stable"
    | "new";
};

type GrowthData = {
  configured: boolean;
  source:
    | "google-search-console-live"
    | "search-console-baseline";
  siteUrl: string;
  periodStart: string;
  periodEnd: string;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  rows: Row[];
  generatedAt: string;
  message: string;
};

function badgeClass(
  action: Row["action"]
) {
  if (action === "protect") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (action === "improve") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  return "border-blue-500/20 bg-blue-500/10 text-blue-300";
}

function movementText(
  row: Row
) {
  if (
    row.movement === "new" ||
    row.positionChange === null
  ) {
    return "New";
  }

  if (row.movement === "stable") {
    return "Stable";
  }

  if (
    row.movement === "improved"
  ) {
    return `↑ ${Math.abs(
      row.positionChange
    ).toFixed(1)}`;
  }

  return `↓ ${Math.abs(
    row.positionChange
  ).toFixed(1)}`;
}

function movementClass(
  movement: Row["movement"]
) {
  if (movement === "improved") {
    return "text-emerald-300";
  }

  if (movement === "declined") {
    return "text-red-300";
  }

  return "text-gray-400";
}

export default function LiveSearchConsolePanel() {
  const [
    data,
    setData,
  ] = useState<GrowthData | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const load = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await fetch(
            "/api/admin/seo/search-console",
            {
              cache: "no-store",
            }
          );

        const payload =
          (await response.json()) as
            GrowthData;

        if (!response.ok) {
          throw new Error(
            "Unable to load Search Console data."
          );
        }

        setData(payload);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load Search Console data."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="mt-12 rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 md:p-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            SEO Automation
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Live Search Console Monitor
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-gray-400">
            Pull the latest 28-day Google search performance,
            compare keyword positions with the saved 24 August
            baseline and turn ranking changes into clear actions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="w-fit rounded-xl bg-[#d4b16f] px-5 py-3 text-sm font-semibold text-black disabled:opacity-60"
        >
          {loading
            ? "Refreshing..."
            : "Refresh Google Data"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-red-300">
          {error}
        </div>
      )}

      {data && (
        <>
          <div
            className={`mt-6 rounded-2xl border p-5 ${
              data.source ===
              "google-search-console-live"
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-amber-500/20 bg-amber-500/5"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">
                  {data.source ===
                  "google-search-console-live"
                    ? "Google Search Console connected"
                    : "Baseline mode"}
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  {data.message}
                </p>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                {data.periodStart} →{" "}
                {data.periodEnd}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <p className="text-sm text-gray-400">
                Clicks
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                {data.totalClicks}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <p className="text-sm text-gray-400">
                Impressions
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                {data.totalImpressions}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <p className="text-sm text-gray-400">
                CTR
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                {(data.averageCtr * 100).toFixed(1)}%
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <p className="text-sm text-gray-400">
                Avg. position
              </p>
              <p className="mt-2 text-3xl font-bold text-[#d4b16f]">
                {data.averagePosition.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead className="border-b border-white/10 text-sm text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Query</th>
                    <th className="px-5 py-4">Clicks</th>
                    <th className="px-5 py-4">Impressions</th>
                    <th className="px-5 py-4">Position</th>
                    <th className="px-5 py-4">Change</th>
                    <th className="px-5 py-4">Action</th>
                    <th className="px-5 py-4">Target</th>
                  </tr>
                </thead>

                <tbody>
                  {data.rows
                    .slice(0, 25)
                    .map((row) => (
                      <tr
                        key={row.query}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="px-5 py-5">
                          <p className="font-semibold text-white">
                            {row.query}
                          </p>
                          <p className="mt-2 max-w-md text-xs leading-5 text-gray-500">
                            {row.note}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-gray-300">
                          {row.clicks}
                        </td>

                        <td className="px-5 py-5 text-gray-300">
                          {row.impressions}
                        </td>

                        <td className="px-5 py-5 font-semibold text-white">
                          {row.position.toFixed(1)}
                        </td>

                        <td
                          className={`px-5 py-5 font-semibold ${movementClass(
                            row.movement
                          )}`}
                        >
                          {movementText(row)}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
                              row.action
                            )}`}
                          >
                            {row.action}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <a
                            href={row.targetPage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#d4b16f]"
                          >
                            {row.targetPage}
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <article className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="font-semibold text-emerald-300">
                Protect
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Preserve positions 1–3. Focus on genuine reviews,
                fresh photography, accurate Google Business Profile
                information and booking conversion.
              </p>
            </article>

            <article className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="font-semibold text-amber-300">
                Improve
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                For positions 4–10, strengthen internal links,
                titles/snippets and useful local relevance without
                rewriting successful pages aggressively.
              </p>
            </article>

            <article className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <p className="font-semibold text-blue-300">
                Opportunity
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                For rankings beyond page one, build topical authority,
                trustworthy citations and useful Taung content before
                expecting major movement.
              </p>
            </article>
          </div>
        </>
      )}

      {!data && loading && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#111] p-8 text-gray-400">
          Loading Search Console growth data...
        </div>
      )}
    </section>
  );
}
