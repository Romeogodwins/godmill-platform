import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rooms in Taung | Godmill City Guesthouse",
  description:
    "Book rooms in Taung at Godmill City Guesthouse. Choose Executive, Standard and Family rooms with rates from R500 per night.",
  alternates: {
    canonical: "https://www.godmillcityguesthouse.com/rooms-taung",
  },
  openGraph: {
    title: "Rooms in Taung | Godmill City Guesthouse",
    description:
      "Book rooms in Taung at Godmill City Guesthouse. Choose Executive, Standard and Family rooms with rates from R500 per night.",
    url: "https://www.godmillcityguesthouse.com/rooms-taung",
    siteName: "Godmill City Guesthouse",
    type: "website",
  },
};

const rooms = [
  {
    title: "Executive Room",
    image: "/Room 3.jpeg",
    price: "R750 per night",
    description:
      "Comfortable air-conditioned accommodation with free WiFi, private bathroom and Smart TV.",
  },
  {
    title: "Standard Room",
    image: "/Room 2.jpeg",
    price: "From R500 per night",
    description:
      "Affordable two-sleeper accommodation with air-conditioned and non-air-conditioned options.",
  },
  {
    title: "Family 3-Sleeper Room",
    image: "/Room 1.jpeg",
    price: "From R750 per night",
    description:
      "Three-sleeper accommodation for families and small groups, with air-conditioned and non-air-conditioned options.",
  },
];

export default function Page() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.godmillcityguesthouse.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Comfortable Rooms in Taung",
        item: "https://www.godmillcityguesthouse.com/rooms-taung",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpeg"
            alt="Godmill City Guesthouse in Taung"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-8">
          <Link
            href="/"
            className="text-sm text-gray-300 transition hover:text-[#d4b16f]"
          >
            Home / Taung Accommodation
          </Link>

          <p className="mt-12 uppercase tracking-[0.3em] text-[#d4b16f]">
            Rooms in Taung
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
            Comfortable Rooms in Taung
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-8 text-gray-200">
            Choose from executive, standard and three-sleeper family rooms at Godmill City Guesthouse, with options for different budgets and travel needs.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:bg-[#e3c27d]"
            >
              Check Availability & Book
            </Link>

            <a
              href="tel:+27790582637"
              className="rounded-full border border-white/40 px-8 py-4 font-semibold transition hover:bg-white hover:text-black"
            >
              Call 079 058 2637
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Godmill City Guesthouse
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-bold md:text-5xl">
            Executive, Standard & Family Rooms
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-300">
            Our room selection includes an executive room, standard two-sleeper rooms and family three-sleeper rooms. Air-conditioned and non-air-conditioned options are available depending on the room category.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Free WiFi",
              "Secure Parking",
              "Swimming Pool",
              "Private Bathrooms",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/10 bg-[#111] p-6"
              >
                <span className="text-[#d4b16f]" aria-hidden="true">
                  &#10003;
                </span>
                <p className="mt-3 font-semibold">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="uppercase tracking-[0.25em] text-[#d4b16f]">
            Rooms & Rates
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Choose Your Room in Taung
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {rooms.map((room) => (
              <article
                key={room.title}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#080808]"
              >
                <div className="relative h-64">
                  <Image
                    src={room.image}
                    alt={room.title + " at Godmill City Guesthouse in Taung"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-semibold">
                    {room.title}
                  </h3>

                  <p className="mt-2 font-semibold text-[#d4b16f]">
                    {room.price}
                  </p>

                  <p className="mt-4 leading-7 text-gray-400">
                    {room.description}
                  </p>

                  <Link
                    href="/booking"
                    className="mt-6 inline-block font-semibold text-[#d4b16f]"
                  >
                    Check availability →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">
            Explore More Accommodation Options
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/accommodation-taung"
              className="rounded-full border border-white/20 px-5 py-3 hover:border-[#d4b16f]"
            >
              Accommodation in Taung
            </Link>

            <Link
              href="/guesthouse-taung"
              className="rounded-full border border-white/20 px-5 py-3 hover:border-[#d4b16f]"
            >
              Guesthouse in Taung
            </Link>

            <Link
              href="/affordable-accommodation-taung"
              className="rounded-full border border-white/20 px-5 py-3 hover:border-[#d4b16f]"
            >
              Affordable Accommodation
            </Link>

            <Link
              href="/family-accommodation-taung"
              className="rounded-full border border-white/20 px-5 py-3 hover:border-[#d4b16f]"
            >
              Family Accommodation
            </Link>

            <Link
              href="/business-accommodation-taung"
              className="rounded-full border border-white/20 px-5 py-3 hover:border-[#d4b16f]"
            >
              Business Accommodation
            </Link>

            <Link
              href="/rooms-taung"
              className="rounded-full border border-white/20 px-5 py-3 hover:border-[#d4b16f]"
            >
              Rooms in Taung
            </Link>

            <Link
              href="/gallery"
              className="rounded-full border border-white/20 px-5 py-3 hover:border-[#d4b16f]"
            >
              Photo Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#111] px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
            Book Direct
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Stay at Godmill City Guesthouse
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Check available rooms and reserve your accommodation directly
            through our online booking system.
          </p>

          <Link
            href="/booking"
            className="mt-9 inline-block rounded-full bg-[#d4b16f] px-10 py-4 font-semibold text-black transition hover:bg-[#e3c27d]"
          >
            Check Availability
          </Link>
        </div>
      </section>
    </main>
  );
}

