import Link from "next/link";

import {
  getSeoOverview,
} from "../../../lib/seo/service";

export const dynamic = "force-dynamic";

function scoreClass(score: number) {
  if (score >= 90) {
    return "text-green-400";
  }

  if (score >= 75) {
    return "text-yellow-300";
  }

  return "text-red-400";
}

function severityClass(
  severity: string
) {
  if (severity === "critical") {
    return "bg-red-500/10 text-red-400";
  }

  if (severity === "high") {
    return "bg-orange-500/10 text-orange-300";
  }

  if (severity === "medium") {
    return "bg-yellow-500/10 text-yellow-300";
  }

  return "bg-white/10 text-gray-300";
}

export default async function SeoDashboardPage() {
  const overview =
    await getSeoOverview();

  const failedChecks =
    overview.audits
      .flatMap((audit) =>
        audit.checks
          .filter((check) => !check.passed)
          .map((check) => ({
            ...check,
            pageName: audit.pageName,
            route: audit.route,
          }))
      )
      .sort(
        (a, b) => b.weight - a.weight
      );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Godmill Growth Engine
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            SEO Command Centre
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-gray-400">
            Live audit of Godmill&apos;s actual
            website source files, SEO landing
            pages, keyword coverage and ranking
            priorities.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/api/admin/seo/audit"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-[#d4b16f]"
          >
            Run Audit API
          </a>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-[#d4b16f]"
          >
            Sitemap
          </a>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#d4b16f] px-5 py-3 text-sm font-semibold text-black"
          >
            Website
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/seo"
          className="rounded-2xl border border-[#d4b16f]/40 bg-[#d4b16f]/10 p-5"
        >
          <p className="font-semibold text-[#d4b16f]">
            SEO Overview
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Automated website audit
          </p>
        </Link>

        <Link
          href="/admin/seo/content"
          className="rounded-2xl border border-white/10 bg-[#111] p-5"
        >
          <p className="font-semibold text-white">
            Content Planner
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Authority opportunities
          </p>
        </Link>

        <Link
          href="/admin/seo/competitors"
          className="rounded-2xl border border-white/10 bg-[#111] p-5"
        >
          <p className="font-semibold text-white">
            Competitors
          </p>
          <p className="mt-1 text-sm text-gray-400">
            OTA & local intelligence
          </p>
        </Link>

        <Link
          href="/admin/seo/checklist"
          className="rounded-2xl border border-white/10 bg-[#111] p-5"
        >
          <p className="font-semibold text-white">
            SEO Checklist
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Execution roadmap
          </p>
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Real SEO Score
          </p>
          <p
            className={`mt-3 text-4xl font-bold ${scoreClass(
              overview.score
            )}`}
          >
            {overview.score}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Calculated from source audit
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Pages Audited
          </p>
          <p className="mt-3 text-4xl font-bold text-white">
            {overview.pagesAudited}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Checks Passed
          </p>
          <p className="mt-3 text-4xl font-bold text-green-400">
            {overview.passedChecks}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            of {overview.totalChecks}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Critical Issues
          </p>
          <p className="mt-3 text-4xl font-bold text-red-400">
            {overview.criticalIssues}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            High Issues
          </p>
          <p className="mt-3 text-4xl font-bold text-orange-300">
            {overview.highIssues}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Keywords
          </p>
          <p className="mt-3 text-4xl font-bold text-white">
            {overview.keywords.length}
          </p>
        </div>
      </div>

      <section className="mt-10 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6">
        <p className="font-semibold text-blue-300">
          Automated audit active
        </p>

        <p className="mt-2 max-w-4xl leading-7 text-gray-400">
          These SEO scores are calculated from
          the actual Godmill source files. They
          are not fabricated Google ranking
          positions. Search Console ranking data
          remains a future external integration.
        </p>
      </section>

      <section className="mt-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Page Audit Results
            </h2>

            <p className="mt-2 text-gray-400">
              Automated checks across the
              public Godmill website.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Generated{" "}
            {new Date(
              overview.generatedAt
            ).toLocaleString()}
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {overview.audits.map((audit) => (
            <article
              key={audit.route}
              className="rounded-3xl border border-white/10 bg-[#111] p-6"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {audit.pageName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {audit.route}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {audit.purpose}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-3xl font-bold ${scoreClass(
                      audit.score
                    )}`}
                  >
                    {audit.score}
                  </p>

                  <p className="text-xs text-gray-500">
                    {
                      audit.passedChecks
                    }
                    /{audit.totalChecks} passed
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {audit.checks.map(
                  (check) => (
                    <div
                      key={check.key}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3"
                    >
                      <span
                        className={
                          check.passed
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {check.passed
                          ? "✓"
                          : "×"}
                      </span>

                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {check.label}
                        </p>

                        {!check.passed && (
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {check.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 flex justify-end">
                <a
                  href={audit.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#d4b16f]"
                >
                  Inspect page →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">
          Priority SEO Issues
        </h2>

        <p className="mt-2 text-gray-400">
          Failed checks automatically ordered
          by SEO importance.
        </p>

        <div className="mt-5 space-y-3">
          {failedChecks.length === 0 ? (
            <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-7 text-green-300">
              No failed SEO checks detected.
            </div>
          ) : (
            failedChecks
              .slice(0, 15)
              .map((issue, index) => (
                <article
                  key={`${issue.route}-${issue.key}`}
                  className="rounded-2xl border border-white/10 bg-[#111] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-gray-300">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-white">
                          {issue.pageName}:{" "}
                          {issue.label}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClass(
                            issue.severity
                          )}`}
                        >
                          {issue.severity}
                        </span>
                      </div>

                      <p className="mt-2 leading-6 text-gray-400">
                        {issue.message}
                      </p>
                    </div>
                  </div>
                </article>
              ))
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">
          Keyword Registry
        </h2>

        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-white/10 text-sm text-gray-400">
                <tr>
                  <th className="px-6 py-4">
                    Keyword
                  </th>
                  <th className="px-6 py-4">
                    Intent
                  </th>
                  <th className="px-6 py-4">
                    Priority
                  </th>
                  <th className="px-6 py-4">
                    Cluster
                  </th>
                  <th className="px-6 py-4">
                    Target
                  </th>
                </tr>
              </thead>

              <tbody>
                {overview.keywords.map(
                  (keyword) => (
                    <tr
                      key={keyword.keyword}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-6 py-5 font-medium text-white">
                        {keyword.keyword}
                      </td>

                      <td className="px-6 py-5 text-gray-400">
                        {keyword.intent}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClass(
                            keyword.priority
                          )}`}
                        >
                          {keyword.priority}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-gray-400">
                        {keyword.cluster}
                      </td>

                      <td className="px-6 py-5">
                        <a
                          href={
                            keyword.targetPage
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#d4b16f]"
                        >
                          {
                            keyword.targetPage
                          }
                        </a>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">
          Growth Tasks
        </h2>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {overview.tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-3xl border border-white/10 bg-[#111] p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClass(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                  {task.status}
                </span>
              </div>

              <h3 className="mt-4 font-semibold text-white">
                {task.title}
              </h3>

              <p className="mt-2 leading-7 text-gray-400">
                {task.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
