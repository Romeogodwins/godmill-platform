import Link from "next/link";

const keywords = [
  {
    keyword: "accommodation in Taung",
    page: "/accommodation-taung",
    priority: "Critical",
    intent: "Booking",
  },
  {
    keyword: "guesthouse in Taung",
    page: "/guesthouse-taung",
    priority: "Critical",
    intent: "Booking",
  },
  {
    keyword: "affordable accommodation Taung",
    page: "/affordable-accommodation-taung",
    priority: "High",
    intent: "Price",
  },
  {
    keyword: "family accommodation Taung",
    page: "/family-accommodation-taung",
    priority: "High",
    intent: "Family",
  },
  {
    keyword: "business accommodation Taung",
    page: "/business-accommodation-taung",
    priority: "High",
    intent: "Business",
  },
  {
    keyword: "rooms in Taung",
    page: "/rooms-taung",
    priority: "High",
    intent: "Booking",
  },
];

const pages = [
  {
    name: "Homepage",
    url: "/",
    score: 92,
    status: "Strong",
  },
  {
    name: "Accommodation in Taung",
    url: "/accommodation-taung",
    score: 95,
    status: "Strong",
  },
  {
    name: "Guesthouse in Taung",
    url: "/guesthouse-taung",
    score: 91,
    status: "Strong",
  },
  {
    name: "Affordable Accommodation",
    url: "/affordable-accommodation-taung",
    score: 90,
    status: "Strong",
  },
  {
    name: "Family Accommodation",
    url: "/family-accommodation-taung",
    score: 90,
    status: "Strong",
  },
  {
    name: "Business Accommodation",
    url: "/business-accommodation-taung",
    score: 90,
    status: "Strong",
  },
  {
    name: "Rooms in Taung",
    url: "/rooms-taung",
    score: 91,
    status: "Strong",
  },
  {
    name: "Gallery",
    url: "/gallery",
    score: 86,
    status: "Good",
  },
];

const recommendations = [
  {
    impact: "Critical",
    title: "Connect Google Search Console",
    description:
      "Import real impressions, clicks, average positions and search queries instead of relying on estimated SEO health.",
  },
  {
    impact: "Critical",
    title: "Grow Google reviews consistently",
    description:
      "Local reviews and review responses can strengthen trust and local visibility for accommodation searches in Taung.",
  },
  {
    impact: "High",
    title: "Build useful Taung travel content",
    description:
      "Create genuinely useful pages about travelling to Taung, attractions, business travel and local visitor information.",
  },
  {
    impact: "High",
    title: "Earn local citations and links",
    description:
      "Strengthen Godmill's presence across reputable tourism, business and local directories with consistent business information.",
  },
  {
    impact: "Medium",
    title: "Add more original property photography",
    description:
      "Continue adding genuine room and facility photos as they become available and give every image descriptive alternative text.",
  },
];

const competitors = [
  {
    name: "Booking.com",
    type: "OTA",
    status: "Track",
  },
  {
    name: "Other Taung guesthouses",
    type: "Local competitors",
    status: "Discover",
  },
  {
    name: "Google Maps accommodation results",
    type: "Local Pack",
    status: "Track",
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

export default function SeoDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Growth Engine
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            SEO Growth
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-gray-400">
            Monitor Godmill City Guesthouse&apos;s local SEO foundation,
            target keywords, landing pages and growth opportunities from
            one dashboard.
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

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">SEO Foundation</p>
          <p className="mt-3 text-4xl font-bold text-white">91</p>
          <p className="mt-2 text-sm text-green-400">
            Strong technical foundation
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">Target Keywords</p>
          <p className="mt-3 text-4xl font-bold text-white">
            {keywords.length}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Core Taung searches
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">SEO Landing Pages</p>
          <p className="mt-3 text-4xl font-bold text-white">
            {pages.length}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Public pages monitored
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">Google Ranking Data</p>
          <p className="mt-3 text-2xl font-bold text-yellow-300">
            Not Connected
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Search Console required
          </p>
        </div>
      </div>

      <section className="mt-10 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="font-semibold text-yellow-300">
              Google Search Console connection
            </p>

            <p className="mt-2 max-w-3xl leading-7 text-gray-400">
              Ranking positions, impressions, clicks and search queries are
              not yet connected. The scores below measure our on-site SEO
              implementation, not live Google rankings.
            </p>
          </div>

          <span className="w-fit rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300">
            Connection pending
          </span>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-white">
            Target Keywords
          </h2>

          <p className="mt-2 text-gray-400">
            Search terms currently supported by dedicated Godmill pages.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-white/10 bg-white/[0.02] text-sm text-gray-400">
                <tr>
                  <th className="px-6 py-4">Keyword</th>
                  <th className="px-6 py-4">Intent</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Google Position</th>
                  <th className="px-6 py-4">Landing Page</th>
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
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.priority === "Critical"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-[#d4b16f]/10 text-[#d4b16f]"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-yellow-300">
                      Not connected
                    </td>

                    <td className="px-6 py-5">
                      <a
                        href={item.page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#d4b16f] hover:underline"
                      >
                        Open page
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
          Current on-site optimisation coverage for important public pages.
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {pages.map((page) => (
            <div
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
                </div>

                <ScoreBadge score={page.score} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {[
                  "Metadata",
                  "Canonical",
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
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">
          Growth Priorities
        </h2>

        <p className="mt-2 text-gray-400">
          Recommended next actions, ordered by likely strategic importance.
        </p>

        <div className="mt-5 space-y-4">
          {recommendations.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#111] p-6 md:flex-row md:items-center"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d4b16f]/10 font-bold text-[#d4b16f]">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.impact === "Critical"
                        ? "bg-red-500/10 text-red-400"
                        : item.impact === "High"
                          ? "bg-[#d4b16f]/10 text-[#d4b16f]"
                          : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>

                <p className="mt-2 leading-7 text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <h2 className="text-2xl font-bold text-white">
            Competitor Intelligence
          </h2>

          <p className="mt-2 leading-7 text-gray-400">
            Framework for monitoring the businesses and platforms competing
            for Taung accommodation searches.
          </p>

          <div className="mt-6 space-y-3">
            {competitors.map((competitor) => (
              <div
                key={competitor.name}
                className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4"
              >
                <div>
                  <p className="font-medium text-white">
                    {competitor.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {competitor.type}
                  </p>
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                  {competitor.status}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-yellow-300">
            Live competitor rankings will be added only after a reliable
            ranking-data source is connected.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <h2 className="text-2xl font-bold text-white">
            Content Opportunities
          </h2>

          <p className="mt-2 leading-7 text-gray-400">
            Future content should answer real traveller questions rather
            than creating large numbers of repetitive keyword pages.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Where to stay in Taung",
              "Things to do in Taung",
              "Taung travel guide",
              "Accommodation for contractors in Taung",
              "Where to stay near Taung attractions",
              "Taung accommodation FAQ",
            ].map((topic) => (
              <div
                key={topic}
                className="rounded-2xl bg-white/[0.03] p-4 text-gray-300"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-[#d4b16f]/20 bg-[#d4b16f]/5 p-8">
        <p className="uppercase tracking-[0.2em] text-[#d4b16f]">
          Next Integration
        </p>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Connect Real Google Performance Data
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-400">
          The next stage is to connect this dashboard to Google Search
          Console so Godmill can monitor actual search queries, impressions,
          clicks, click-through rates and average Google positions.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/settings"
            className="rounded-xl bg-[#d4b16f] px-5 py-3 font-semibold text-black"
          >
            Integration Settings
          </Link>

          <a
            href="/accommodation-taung"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white"
          >
            View Main SEO Page
          </a>
        </div>
      </section>
    </div>
  );
}