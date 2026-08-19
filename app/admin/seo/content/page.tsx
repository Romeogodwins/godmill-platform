import Link from "next/link";

const opportunities = [
  {
    title: "Where to Stay in Taung",
    intent: "Travel planning",
    priority: "High",
    status: "Recommended",
    reason:
      "Useful visitor content that can naturally introduce Godmill without duplicating the existing accommodation landing pages.",
  },
  {
    title: "Things to Do in Taung",
    intent: "Tourism",
    priority: "High",
    status: "Recommended",
    reason:
      "Supports travellers before they choose accommodation and can earn broader local-search visibility.",
  },
  {
    title: "Taung Travel Guide",
    intent: "Travel planning",
    priority: "High",
    status: "Recommended",
    reason:
      "A useful evergreen guide can become a central internal-linking asset for local visitor searches.",
  },
  {
    title: "Accommodation for Contractors in Taung",
    intent: "Business",
    priority: "Medium",
    status: "Evaluate",
    reason:
      "Potentially valuable if Godmill regularly accommodates contractors, project workers or corporate teams.",
  },
  {
    title: "Planning a Family Visit to Taung",
    intent: "Family",
    priority: "Medium",
    status: "Evaluate",
    reason:
      "Can support the existing family accommodation page with genuinely useful travel information.",
  },
  {
    title: "Taung Accommodation FAQ",
    intent: "Research",
    priority: "Medium",
    status: "Evaluate",
    reason:
      "Useful if based on genuine questions received from guests rather than generic keyword content.",
  },
];

export default function SeoContentPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/admin/seo"
        className="text-sm font-semibold text-[#d4b16f]"
      >
        ← SEO Command Centre
      </Link>

      <p className="mt-8 uppercase tracking-[0.25em] text-[#d4b16f]">
        Growth Engine
      </p>

      <h1 className="mt-3 text-4xl font-bold text-white">
        Content Planner
      </h1>

      <p className="mt-4 max-w-3xl leading-7 text-gray-400">
        Build content that helps real visitors and strengthens Godmill&apos;s
        local authority without creating repetitive keyword pages.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Opportunities
          </p>
          <p className="mt-3 text-4xl font-bold text-white">
            {opportunities.length}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Recommended Now
          </p>
          <p className="mt-3 text-4xl font-bold text-white">
            {
              opportunities.filter(
                (item) => item.status === "Recommended"
              ).length
            }
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6">
          <p className="text-sm text-gray-400">
            Publishing Rule
          </p>
          <p className="mt-3 text-xl font-bold text-[#d4b16f]">
            Quality First
          </p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">
          Content Opportunities
        </h2>

        <div className="mt-5 space-y-4">
          {opportunities.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-[#111] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>

                    <span className="rounded-full bg-[#d4b16f]/10 px-3 py-1 text-xs font-semibold text-[#d4b16f]">
                      {item.priority}
                    </span>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                      {item.intent}
                    </span>
                  </div>

                  <p className="mt-4 max-w-4xl leading-7 text-gray-400">
                    {item.reason}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === "Recommended"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-red-500/20 bg-red-500/5 p-7">
        <h2 className="text-xl font-bold text-red-300">
          Avoid Thin SEO Content
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-400">
          Do not automatically publish dozens of pages that only change a
          keyword or location phrase. New content should answer a distinct
          traveller need and provide information visitors would genuinely
          find useful.
        </p>
      </section>
    </div>
  );
}