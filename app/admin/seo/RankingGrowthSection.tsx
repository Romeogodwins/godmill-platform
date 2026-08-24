import Link from "next/link";

import type {
  SeoRanking,
  SeoRankingSummary,
} from "../../../lib/seo/types";

function actionClass(action: SeoRanking["action"]) {
  if (action === "protect") {
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  }

  if (action === "improve") {
    return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  }

  return "bg-blue-500/10 text-blue-300 border-blue-500/20";
}

function actionLabel(action: SeoRanking["action"]) {
  if (action === "protect") return "Protect";
  if (action === "improve") return "Improve";
  return "Opportunity";
}

export default function RankingGrowthSection({
  rankings,
  summary,
}: {
  rankings: SeoRanking[];
  summary: SeoRankingSummary;
}) {
  return (
    <section className="mt-12">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Google Ranking Growth
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Search Console Baseline
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-gray-400">
            Ranking figures recorded from Google Search Console on{" "}
            {summary.measuredAt}. These are a baseline, not a
            live Search Console connection.
          </p>
        </div>

        <Link
          href="/admin/seo/content"
          className="w-fit rounded-xl border border-[#d4b16f]/40 px-5 py-3 text-sm font-semibold text-[#d4b16f]"
        >
          Open Content Planner
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
          <p className="text-sm text-gray-400">Queries tracked</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.totalQueries}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-sm text-emerald-300">Protect</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.protect}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-sm text-amber-300">Improve</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.improve}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="text-sm text-blue-300">Opportunity</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.opportunity}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
          <p className="text-sm text-gray-400">Impressions</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.totalImpressions}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
          <p className="text-sm text-gray-400">Weighted position</p>
          <p className="mt-2 text-3xl font-bold text-[#d4b16f]">
            {summary.averagePosition}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="border-b border-white/10 text-sm text-gray-400">
              <tr>
                <th className="px-6 py-4">Query</th>
                <th className="px-6 py-4">Impressions</th>
                <th className="px-6 py-4">Clicks</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Target</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target page</th>
              </tr>
            </thead>

            <tbody>
              {rankings.map((row) => (
                <tr
                  key={row.query}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-white">
                      {row.query}
                    </p>
                    <p className="mt-2 max-w-md text-xs leading-5 text-gray-500">
                      {row.note}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-gray-300">
                    {row.impressions}
                  </td>

                  <td className="px-6 py-5 text-gray-300">
                    {row.clicks}
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-lg font-bold text-white">
                      {row.position.toFixed(1)}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-gray-300">
                    Top {row.targetPosition}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${actionClass(
                        row.action
                      )}`}
                    >
                      {actionLabel(row.action)}
                    </span>
                  </td>

                  <td className="px-6 py-5">
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

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">
          Growth rule
        </p>
        <p className="mt-2 leading-7 text-gray-400">
          Positions 1–3 are protected, positions 4–10 are
          improved carefully, and positions above 10 are treated
          as expansion opportunities. Very small impression counts
          are directional and should not be treated as permanent
          rankings.
        </p>
      </div>
    </section>
  );
}
