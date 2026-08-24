const reviews = [
  {
    name: "Flomy Mathebula",
    type: "Google Review",
    text: "It is a very nice and clean place, peaceful, no noise. I really enjoyed my stay.",
  },
  {
    name: "Daniel Ntibrey",
    type: "Google Review",
    text: "Thanks to the management for keeping the place clean. The staff are very kind and understanding. I will be back next year.",
  },
  {
    name: "Dr. I Ebrahim",
    type: "Google Review",
    text: "An excellent place for weekend relaxation.",
  },
  {
    name: "Amedo Gifty",
    type: "Google Review",
    text: "Well reserved and excellent hospitality.",
  },
  {
    name: "Thamsanqa Solomon Mngoma",
    type: "Google Review",
    text: "One of the best township Guesthouses.",
  },
  {
    name: "Olebogeng Victor",
    type: "Google Review",
    text: "Staff was friendly.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-[#080808] py-24 sm:py-28">
      {/* Premium background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#d4b16f]/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b16f] sm:text-sm">
            Loved By Our Guests
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Guest experiences that
            <span className="block text-[#d4b16f]">
              speak for themselves.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Genuine feedback from guests who have stayed at Godmill City
            Guesthouse.
          </p>
        </div>

        {/* Google rating summary */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-between gap-6 rounded-3xl border border-[#d4b16f]/20 bg-white/[0.04] px-7 py-7 shadow-2xl sm:flex-row sm:px-10">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl font-bold shadow-lg">
              <span className="text-[#4285F4]">G</span>
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Rated by our guests on
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                Google Reviews
              </p>

              <p className="mt-1 text-sm text-gray-500">
                46 guest reviews
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="flex items-center justify-center gap-2 sm:justify-end">
              <span className="text-3xl font-bold text-white">
                4.4
              </span>

              <span className="text-lg text-gray-500">
                / 5
              </span>
            </div>

            <div
              className="mt-1 text-xl tracking-[0.12em] text-[#d4b16f]"
              aria-label="4.4 out of 5 stars on Google"
            >
              ★★★★★
            </div>

            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Google Rating
            </p>
          </div>
        </div>

        {/* Review cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="group relative flex min-h-[280px] flex-col rounded-3xl border border-white/10 bg-[#121212] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#d4b16f]/40 hover:bg-[#151515]"
            >
              {/* Stars + Google indicator */}
              <div className="flex items-center justify-between">
                <div
                  className="text-lg tracking-[0.12em] text-[#d4b16f]"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold shadow">
                  <span className="text-[#4285F4]">G</span>
                </div>
              </div>

              {/* Quote */}
              <div
                className="mt-7 text-5xl font-serif leading-none text-[#d4b16f]/30"
                aria-hidden="true"
              >
                “
              </div>

              <p className="-mt-2 flex-1 text-base leading-7 text-gray-300">
                {review.text}
              </p>

              {/* Reviewer */}
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="font-semibold text-white">
                  {review.name}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d4b16f]" />

                  <span>{review.type}</span>

                  <span aria-hidden="true">•</span>

                  <span>5 stars</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Review actions */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Genuine reviews from guests of Godmill City Guesthouse
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/booking"
              className="inline-flex min-w-[190px] items-center justify-center rounded-full bg-[#d4b16f] px-8 py-4 text-sm font-bold text-black transition hover:bg-[#e2c17d]"
            >
              Book Your Stay

              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Godmill+City+Guesthouse+Taung"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[190px] items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white transition hover:border-[#d4b16f]/60 hover:text-[#d4b16f]"
            >
              Read Google Reviews

              <span className="ml-2" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}