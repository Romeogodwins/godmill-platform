import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accommodation in Taung | Godmill City Guesthouse",
  description:
    "Looking for accommodation in Taung? Godmill City Guesthouse offers comfortable executive, standard and family rooms with free WiFi, secure parking and a swimming pool. Book direct.",
  keywords: [
    "accommodation in Taung",
    "Taung accommodation",
    "guesthouse in Taung",
    "guest house Taung",
    "places to stay in Taung",
    "rooms in Taung",
    "affordable accommodation Taung",
    "bed and breakfast Taung",
    "family accommodation Taung",
    "Godmill City Guesthouse",
  ],
  alternates: {
    canonical:
      "https://www.godmillcityguesthouse.com/accommodation-taung",
  },
  openGraph: {
    title: "Accommodation in Taung | Godmill City Guesthouse",
    description:
      "Comfortable accommodation in Taung with free WiFi, secure parking, swimming pool and executive, standard and family rooms.",
    url: "https://www.godmillcityguesthouse.com/accommodation-taung",
    siteName: "Godmill City Guesthouse",
    type: "website",
  },
};

const faq = [
  {
    question: "Where can I find accommodation in Taung?",
    answer:
      "Godmill City Guesthouse provides accommodation in Taung at No. 217 Khibitswane, Cokonyane Road, with comfortable rooms for business travellers, couples, families and other visitors.",
  },
  {
    question: "How much is accommodation at Godmill City Guesthouse?",
    answer:
      "Room rates start from R500 per night, depending on the room type and facilities selected.",
  },
  {
    question: "Does Godmill City Guesthouse have WiFi?",
    answer:
      "Yes. Guests have access to complimentary WiFi during their stay.",
  },
  {
    question: "Is secure parking available?",
    answer:
      "Yes. Secure parking is available for guests staying at Godmill City Guesthouse.",
  },
  {
    question: "Does the guesthouse have a swimming pool?",
    answer:
      "Yes. Godmill City Guesthouse has a swimming pool available for guests.",
  },
  {
    question: "Can I book accommodation in Taung online?",
    answer:
      "Yes. You can use the Godmill City Guesthouse online booking system to select your dates and room requirements.",
  },
];

export default function AccommodationTaungPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* HERO */}
      <section className="border-b border-white/10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="mb-8 inline-block text-sm text-gray-400 transition hover:text-[#d4b16f]"
          >
            ← Godmill City Guesthouse
          </Link>

          <p className="mb-4 uppercase tracking-[0.3em] text-[#d4b16f]">
            Stay in Taung
          </p>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Accommodation in Taung
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-8 text-gray-300">
            Looking for comfortable accommodation in Taung? Godmill City
            Guesthouse offers executive, standard and family rooms for
            business travellers, couples, families and visitors to Taung.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:opacity-90"
            >
              Check Availability
            </Link>

            <a
              href="tel:+27790582637"
              className="rounded-full border border-white/30 px-8 py-4 font-semibold transition hover:bg-white hover:text-black"
            >
              Call 079 058 2637
            </a>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Godmill City Guesthouse
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Comfortable Guesthouse Accommodation in Taung
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-300">
            Godmill City Guesthouse provides convenient accommodation in
            Taung, North West, South Africa. Our guesthouse is situated at
            No. 217 Khibitswane, Cokonyane Road and provides a comfortable
            base for guests visiting Taung for business, work, family visits
            or leisure.
          </p>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-300">
            Guests can choose from executive, standard and family room
            options. Facilities include complimentary WiFi, secure guest
            parking, private bathrooms and access to a swimming pool.
          </p>
        </div>
      </section>

      {/* ROOMS */}
      <section className="bg-[#111] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Choose Your Stay
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Rooms at Godmill City Guesthouse
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">
            Choose the room that suits your stay and check live availability
            through our direct booking system.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-7">
              <h3 className="text-2xl font-semibold">
                Executive Room
              </h3>

              <p className="mt-3 text-lg font-semibold text-[#d4b16f]">
                R750 per night
              </p>

              <p className="mt-4 leading-7 text-gray-300">
                Comfortable accommodation with air conditioning, free WiFi,
                private bathroom and Smart TV.
              </p>

              <Link
                href="/booking"
                className="mt-6 inline-block font-semibold text-[#d4b16f]"
              >
                Check availability →
              </Link>
            </article>

            <article className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-7">
              <h3 className="text-2xl font-semibold">
                Standard Room
              </h3>

              <p className="mt-3 text-lg font-semibold text-[#d4b16f]">
                From R500 per night
              </p>

              <p className="mt-4 leading-7 text-gray-300">
                Comfortable two-sleeper accommodation with air-conditioned
                and non-air-conditioned room options available.
              </p>

              <Link
                href="/booking"
                className="mt-6 inline-block font-semibold text-[#d4b16f]"
              >
                Check availability →
              </Link>
            </article>

            <article className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-7">
              <h3 className="text-2xl font-semibold">
                Family 3-Sleeper Room
              </h3>

              <p className="mt-3 text-lg font-semibold text-[#d4b16f]">
                From R750 per night
              </p>

              <p className="mt-4 leading-7 text-gray-300">
                Three-sleeper accommodation for families and small groups,
                with air-conditioned and non-air-conditioned options.
              </p>

              <Link
                href="/booking"
                className="mt-6 inline-block font-semibold text-[#d4b16f]"
              >
                Check availability →
              </Link>
            </article>
          </div>

          <p className="mt-8 text-sm leading-6 text-gray-400">
            Room prices depend on the room type and air-conditioning option
            selected. Live availability is confirmed during booking.
          </p>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Guest Facilities
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Why Stay at Godmill City Guesthouse?
          </h2>

          <div className="mt-10 grid gap-4 text-lg text-gray-300 md:grid-cols-2">
            <p>
              <span className="mr-2 text-[#d4b16f]">✓</span>
              Free WiFi
            </p>

            <p>
              <span className="mr-2 text-[#d4b16f]">✓</span>
              Secure guest parking
            </p>

            <p>
              <span className="mr-2 text-[#d4b16f]">✓</span>
              Swimming pool
            </p>

            <p>
              <span className="mr-2 text-[#d4b16f]">✓</span>
              Air-conditioned room options
            </p>

            <p>
              <span className="mr-2 text-[#d4b16f]">✓</span>
              Private bathrooms
            </p>

            <p>
              <span className="mr-2 text-[#d4b16f]">✓</span>
              Family accommodation
            </p>

            <p>
              <span className="mr-2 text-[#d4b16f]">✓</span>
              Direct online booking
            </p>

            <p>
              <span className="mr-2 text-[#d4b16f]">✓</span>
              Convenient Taung location
            </p>
          </div>
        </div>
      </section>

      {/* DIRECT BOOKING */}
      <section className="border-y border-white/10 bg-[#0d0d0d] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-[#d4b16f]/30 bg-[#d4b16f]/5 p-8 md:p-12">
            <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
              Book Direct
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Check Live Room Availability
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">
              Use our direct booking system to select your dates, room type
              and air-conditioning preference and see available rooms for
              your stay.
            </p>

            <Link
              href="/booking"
              className="mt-8 inline-block rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:opacity-90"
            >
              Check Rooms & Book Direct
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#111] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Frequently Asked Questions
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Planning Your Stay in Taung
          </h2>

          <div className="mt-10 space-y-5">
            {faq.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6"
              >
                <h3 className="text-xl font-semibold">
                  {item.question}
                </h3>

                <p className="mt-3 leading-7 text-gray-300">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
            Stay in Taung
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Book Your Stay at Godmill City Guesthouse
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Check room availability and make your reservation directly with
            Godmill City Guesthouse.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-10 py-4 font-semibold text-black transition hover:opacity-90"
            >
              Check Availability
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/30 px-10 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Explore Godmill City Guesthouse
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Godmill City Guesthouse · Taung, North West, South Africa
          </p>
        </div>
      </section>
    </main>
  );
}