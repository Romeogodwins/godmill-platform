import Link from "next/link";

const competitors = [
  {
    name: "Booking.com",
    category: "OTA",
    threat: "High",
    strength:
      "Very strong domain authority and broad accommodation inventory.",
    response:
      "Win branded searches, local relevance and direct-booking conversion.",
  },
  {
    name: "Expedia",
    category: "OTA",
    threat: "Medium",
    strength:
      "Strong travel domain and broad distribution.",
    response:
      "Use OTA visibility for discovery while strengthening Godmill direct booking.",
  },
  {
    name: "Agoda",
    category: "OTA",
    threat: "Medium",
    strength:
      "Strong accommodation marketplace visibility.",
    response:
      "Maintain accurate OTA presence while prioritising direct repeat bookings.",
  },
  {
    name: "Taung local guesthouses",
    category: "Local",
    threat: "High",
    strength:
      "Can compete strongly in Google Maps based on proximity, reviews and relevance.",
    response:
      "Strengthen reviews, Google Business Profile, local citations and website authority.",
  },
  {
    name: "Google Hotels results",
    category: "Google",
    threat: "High",
    strength:
      "Highly visible accommodation comparison experience inside Google.",
    response:
      "Keep property information accurate and make the official website the strongest direct destination.",
  },
];

export default function CompetitorsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/admin/seo"
        className="text-sm font-semibold text-[#d4b16f]"
      >
        ← SEO Command Centre
      </Link>

      <p className="mt-8 uppercase tracking-[0.25em] text-[#d4b16f]">
        Intelligence
      </p>

      <h1 className="mt-3 text-4xl font-bold text-white">
        Competitor Intelligence
      </h1>

      <p className="mt-4 max-w-3xl leading-7 text-gray-400">
        Track the types of competitors fighting for accommodation searches
        around Taung and define how Godmill should respond.
      </p>

      <div className="mt-10 space-y-5">
        {competitors.map((competitor) => (
          <article
            key={competitor.name}
            className="rounded-3xl border border-white/10 bg-[#111] p-7"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1.3fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">
                    {competitor.name}
                  </h2>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                    {competitor.category}
                  </span>
                </div>

                <p
                  className={`mt-4 text-sm font-semibold ${
                    competitor.threat === "High"
                      ? "text-red-400"
                      : "text-yellow-300"
                  }`}
                >
                  Threat: {competitor.threat}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Their Strength
                </p>

                <p className="mt-3 leading-7 text-gray-400">
                  {competitor.strength}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4b16f]">
                  Godmill Response
                </p>

                <p className="mt-3 leading-7 text-gray-300">
                  {competitor.response}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12 rounded-3xl border border-[#d4b16f]/20 bg-[#d4b16f]/5 p-7">
        <h2 className="text-2xl font-bold text-white">
          Competitive Goal
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-400">
          Godmill does not need a larger domain than Booking.com. It needs
          stronger relevance for Godmill-branded searches, strong local
          signals in Taung, excellent reviews and a direct-booking website
          that converts visitors better once they arrive.
        </p>
      </section>
    </div>
  );
}