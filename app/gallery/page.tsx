import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Photo Gallery | Godmill City Guesthouse Taung",
  description:
    "Explore photos of Godmill City Guesthouse in Taung, including our rooms, swimming pool, courtyard, bathrooms and guest facilities.",
  alternates: {
    canonical: "https://www.godmillcityguesthouse.com/gallery",
  },
  openGraph: {
    title: "Godmill City Guesthouse Photo Gallery",
    description:
      "View rooms and facilities at Godmill City Guesthouse in Taung, North West.",
    url: "https://www.godmillcityguesthouse.com/gallery",
    siteName: "Godmill City Guesthouse",
    type: "website",
  },
};

const galleryImages = [
  {
    src: "/Room 3.jpeg",
    title: "Executive Room",
    alt: "Executive room at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Room 2.jpeg",
    title: "Standard Room",
    alt: "Standard room at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Room 1.jpeg",
    title: "Family Room",
    alt: "Family three-sleeper room at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Room 5.jpeg",
    title: "Guest Room",
    alt: "Guest room at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Room 6.jpeg",
    title: "Guest Room",
    alt: "Comfortable guest room at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Room 10.jpeg",
    title: "Guest Room",
    alt: "Room interior at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Pool.jpeg",
    title: "Swimming Pool",
    alt: "Swimming pool at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Courtyard.jpeg",
    title: "Courtyard",
    alt: "Courtyard at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Bathroom.jpeg",
    title: "Private Bathroom",
    alt: "Private bathroom at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Dinning.jpeg",
    title: "Dining Area",
    alt: "Dining area at Godmill City Guesthouse in Taung",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* HERO */}
      <section className="border-b border-white/10 px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-[#d4b16f]"
          >
            ← Back to Godmill City Guesthouse
          </Link>

          <p className="mt-12 uppercase tracking-[0.3em] text-[#d4b16f]">
            Photo Gallery
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Experience Godmill Before You Arrive
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-8 text-gray-300">
            Take a closer look at our rooms, swimming pool, courtyard,
            bathrooms and guest facilities at Godmill City Guesthouse in
            Taung, North West.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:bg-[#e3c27d]"
            >
              Check Availability
            </Link>

            <Link
              href="/accommodation-taung"
              className="rounded-full border border-white/30 px-8 py-4 font-semibold transition hover:bg-white hover:text-black"
            >
              View Accommodation
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
              Explore Godmill
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Rooms & Facilities
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
              Browse our accommodation and facilities before choosing your
              room and making a direct reservation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <figure
                key={`${image.src}-${index}`}
                className={`group overflow-hidden rounded-3xl border border-white/10 bg-[#111] ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0 ? "h-[420px]" : "h-80"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 1024px) 100vw, 66vw"
                        : "(max-width: 768px) 100vw, 33vw"
                    }
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <figcaption className="p-5">
                  <p className="font-semibold text-white">
                    {image.title}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION / TRUST */}
      <section className="border-y border-white/10 bg-[#111] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
              Stay in Taung
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Comfortable Accommodation in Taung
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              Godmill City Guesthouse offers executive, standard and family
              accommodation for business travellers, couples, families and
              visitors to Taung.
            </p>

            <Link
              href="/accommodation-taung"
              className="mt-7 inline-block font-semibold text-[#d4b16f]"
            >
              Explore our Taung accommodation →
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#080808] p-8">
            <h3 className="text-2xl font-semibold">
              Guest Facilities
            </h3>

            <div className="mt-6 grid gap-4 text-gray-300 sm:grid-cols-2">
              <p>✓ Free WiFi</p>
              <p>✓ Secure parking</p>
              <p>✓ Swimming pool</p>
              <p>✓ Private bathrooms</p>
              <p>✓ Air-conditioned options</p>
              <p>✓ Family rooms</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
            Ready to Stay?
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Book Your Stay at Godmill City Guesthouse
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Choose your dates and check available rooms directly through
            our online booking system.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-10 py-4 font-semibold text-black transition hover:bg-[#e3c27d]"
            >
              Check Availability
            </Link>

            <a
              href="tel:+27790582637"
              className="rounded-full border border-white/30 px-10 py-4 font-semibold transition hover:bg-white hover:text-black"
            >
              Call 079 058 2637
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}