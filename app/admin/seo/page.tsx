import Link from "next/link";

const keywords = [
  {
    keyword: "accommodation in Taung",
    page: "/accommodation-taung",
    priority: "Critical",
    intent: "Direct booking",
    status: "Landing page live",
  },
  {
    keyword: "guesthouse in Taung",
    page: "/guesthouse-taung",
    priority: "Critical",
    intent: "Direct booking",
    status: "Landing page live",
  },
  {
    keyword: "affordable accommodation Taung",
    page: "/affordable-accommodation-taung",
    priority: "High",
    intent: "Price",
    status: "Landing page live",
  },
  {
    keyword: "family accommodation Taung",
    page: "/family-accommodation-taung",
    priority: "High",
    intent: "Family",
    status: "Landing page live",
  },
  {
    keyword: "business accommodation Taung",
    page: "/business-accommodation-taung",
    priority: "High",
    intent: "Business",
    status: "Landing page live",
  },
  {
    keyword: "rooms in Taung",
    page: "/rooms-taung",
    priority: "High",
    intent: "Direct booking",
    status: "Landing page live",
  },
];

const pages = [
  {
    name: "Homepage",
    url: "/",
    score: 92,
    status: "Strong",
    purpose: "Brand + direct booking",
  },
  {
    name: "Accommodation in Taung",
    url: "/accommodation-taung",
    score: 95,
    status: "Strong",
    purpose: "Primary local landing page",
  },
  {
    name: "Guesthouse in Taung",
    url: "/guesthouse-taung",
    score: 91,
    status: "Strong",
    purpose: "Guesthouse search intent",
  },
  {
    name: "Affordable Accommodation",
    url: "/affordable-accommodation-taung",
    score: 90,
    status: "Strong",
    purpose: "Price-conscious travellers",
  },
  {
    name: "Family Accommodation",
    url: "/family-accommodation-taung",
    score: 90,
    status: "Strong",
    purpose: "Family travellers",
  },
  {
    name: "Business Accommodation",
    url: "/business-accommodation-taung",
    score: 90,
    status: "Strong",
    purpose: "Business travellers",
  },
  {
    name: "Rooms in Taung",
    url: "/rooms-taung",
    score: 91,
    status: "Strong",
    purpose: "Room search intent",
  },
  {
    name: "Gallery",
    url: "/gallery",
    score: 86,
    status: "Good",
    purpose: "Visual trust",
  },
];

const actions = [
  {
    level: "Critical",
    title: "Increase genuine Google reviews",
    owner: "Reception",
    status: "Ongoing",
    description:
      "Ask real checked-out guests for honest Google reviews using the official review link and QR code.",
  },
  {
    level: "Critical",
    title: "Strengthen Google Business Profile",
    owner: "Management",
    status: "Active",
    description:
      "Keep room details, amenities, website, rates, photos and business information accurate and consistent.",
  },
  {
    level: "High",
    title: "Build local citations",
    owner: "SEO",
    status: "Planned",
    description:
      "List Godmill consistently on reputable accommodation, tourism and local business directories.",
  },
  {
    level: "High",
    title: "Publish useful Taung content",
    owner: "SEO",
    status: "Planned",
    description:
      "Create visitor-focused content rather than repetitive keyword pages.",
  },
  {
    level: "High",
    title: "Improve direct-booking conversion",
    owner: "Website",
    status: "Active",
    description:
      "Keep Book Now and Check Availability prominent across high-intent landing pages.",
  },
  {
    level: "Medium",
    title: "Add new original photos",
    owner: "Property",
    status: "Waiting",
    description:
      "Add fresh room, pool, exterior and facility photography as new images become available.",
  },
];

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${
        score >= 90
          ? "bg-green-500/10 text-green-400"
          : score >= 80
            ? "bg-yellow-500/10 text-yellow-300"
            : "bg-red-500/10 text-red-400"
      }`}
    >
      {score}/100
    </span>
  );
}

function PriorityBadge({ level }: { level: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        level === "Critical"
          ? "bg-red-500/10 text-red-400"
          : level === "High"
            ? "bg-[#d4b16f]/10 text-[#d4b16f]"
            : "bg-white/10 text-gray-300"
      }`}
    >
      {level}
    </span>
  );
}

export default function SeoDashboardPage() {
  const averageScore = Math.round(
    pages.reduce((total, page) => total + page.score, 0) /
      pages.length
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
            Manage Godmill City Guesthouse&apos;s local search strategy,
            landing pages, keyword targets, content opportunities and
            competitive growth from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-[#d4b16f]"
          >
            View Sitemap
          </a>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#d4b16f] px-5 py-3 text-sm font-semibold text-black"
          >
            View Website
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
            Health, pages & keywords
          </p>
        </Link>

        <Link
          href="/admin/seo/content"
          className="rounded-2xl border border-white/10 bg-[#111] p-5 transition hover:border-[#d4b16f]/40"
        >
          <p className="font-semibold text-white">
            Content Planner
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Content opportunities
          </p>
        </Link>

        <Link
          href="/admin/seo/competitors"
          className="rounded-2xl border border-white/10 bg-[#111] p-5 transition hover:border-[#d4b16f]/40"
        >
          <p className="font-semibold text-white">
            Competitors
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Local & OTA intelligence
          </p>
        </Link>

        <Link
          href="/admin/seo/checklist"
          className="rounded-2xl border border-white/10 bg-[#111] p-5 transition hover:border-[#d4b16f]/40"
        >
          <p className="font-semibold text-white">
            SEO Checklist
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Ranking action plan
          </p>
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            On-Site SEO Health
          </p>

          <p className="mt-3 text-4xl font-bold text-white">
            {averageScore}
          </p>

          <p className="mt-2 text-sm text-green-400">
            Strong foundation
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Target Keywords
          </p>

          <p className="mt-3 text-4xl font-bold text-white">
            {keywords.length}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Core local searches
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Monitored Pages
          </p>

          <p className="mt-3 text-4xl font-bold text-white">
            {pages.length}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            SEO pages tracked
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Live Google Rankings
          </p>

          <p className="mt-3 text-2xl font-bold text-yellow-300">
            Not Connected
          </p>

          <p className="mt-2 text-sm text-gray-500">
            API deferred
          </p>
        </div>
      </div>

      <section className="mt-10 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6">
        <p className="font-semibold text-blue-300">
          Search Console API deferred
        </p>

        <p className="mt-2 max-w-4xl leading-7 text-gray-400">
          Google Cloud integration is currently deferred. Godmill&apos;s
          normal Google Search Console remains active. This dashboard will
          continue managing SEO strategy without pretending estimated scores
          are live Google rankings.
        </p>
      </section>

      <section className="mt-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Keyword Strategy
            </h2>

            <p className="mt-2 text-gray-400">
              High-intent searches supported by dedicated Godmill pages.
            </p>
          </div>

          <span className="text-sm text-gray-500">
            Position data: Not connected
          </span>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-white/10 bg-white/[0.02] text-sm text-gray-400">
                <tr>
                  <th className="px-6 py-4">Keyword</th>
                  <th className="px-6 py-4">Intent</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Google Position</th>
                  <th className="px-6 py-4">Page</th>
                </tr>
              </thead>

              <tbody>
                {keywords.map((item) => (
                  <tr
                    key={item.keyword}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-6 py-5 font-medium text-white">
                      {item.keyword}
                    </td>

                    <td className="px-6 py-5 text-gray-400">
                      {item.intent}
                    </td>

                    <td className="px-6 py-5">
                      <PriorityBadge level={item.priority} />
                    </td>

                    <td className="px-6 py-5 text-green-400">
                      {item.status}
                    </td>

                    <td className="px-6 py-5 text-yellow-300">
                      Not connected
                    </td>

                    <td className="px-6 py-5">
                      <a
                        href={item.page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#d4b16f] hover:underline"
                      >
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">
          Page SEO Audit
        </h2>

        <p className="mt-2 text-gray-400">
          Current optimisation coverage across Godmill&apos;s public search
          pages.
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {pages.map((page) => (
            <article
              key={page.url}
              className="rounded-3xl border border-white/10 bg-[#111] p-6"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {page.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {page.url}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {page.purpose}
                  </p>
                </div>

                <ScoreBadge score={page.score} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {[
                  "Metadata",
                  "Canonical URL",
                  "Internal Links",
                  "Mobile Ready",
                  "Sitemap",
                  "Booking CTA",
                ].map((check) => (
                  <div
                    key={check}
                    className="rounded-xl bg-white/[0.03] px-3 py-3 text-gray-300"
                  >
                    <span className="mr-2 text-green-400">
                      &#10003;
                    </span>
                    {check}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-green-400">
                  {page.status}
                </span>

                <a
                  href={page.url}
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
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Current Ranking Actions
            </h2>

            <p className="mt-2 text-gray-400">
              Work that can improve local visibility and direct bookings.
            </p>
          </div>

          <Link
            href="/admin/seo/checklist"
            className="text-sm font-semibold text-[#d4b16f]"
          >
            Open full checklist →
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {actions.map((action) => (
            <article
              key={action.title}
              className="rounded-3xl border border-white/10 bg-[#111] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <PriorityBadge level={action.level} />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-white">
                      {action.title}
                    </h3>

                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                      {action.owner}
                    </span>
                  </div>

                  <p className="mt-2 leading-7 text-gray-400">
                    {action.description}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-300">
                  {action.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        <Link
          href="/admin/seo/content"
          className="rounded-3xl border border-white/10 bg-[#111] p-7 transition hover:border-[#d4b16f]/50"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-[#d4b16f]">
            Content
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Content Planner
          </h2>

          <p className="mt-4 leading-7 text-gray-400">
            Plan useful Taung travel content and avoid repetitive SEO pages.
          </p>
        </Link>

        <Link
          href="/admin/seo/competitors"
          className="rounded-3xl border border-white/10 bg-[#111] p-7 transition hover:border-[#d4b16f]/50"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-[#d4b16f]">
            Intelligence
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Competitor Tracking
          </h2>

          <p className="mt-4 leading-7 text-gray-400">
            Track OTAs, Google Maps results and local Taung competitors.
          </p>
        </Link>

        <Link
          href="/admin/seo/checklist"
          className="rounded-3xl border border-white/10 bg-[#111] p-7 transition hover:border-[#d4b16f]/50"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-[#d4b16f]">
            Execution
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            SEO Checklist
          </h2>

          <p className="mt-4 leading-7 text-gray-400">
            Follow the priority tasks required to grow Godmill&apos;s local
            visibility.
          </p>
        </Link>
      </section>
    </div>
  );
}