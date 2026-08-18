import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen">
      <Image
        src="/hero.jpeg"
        alt="Godmill City Guesthouse accommodation in Taung, North West"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-8">
          <p className="mb-4 tracking-[0.35em] text-[#d4b16f] uppercase">
            Premium Accommodation in Taung
          </p>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-white md:text-7xl">
            Godmill City Guesthouse
            <span className="mt-2 block text-[#d4b16f]">
              Accommodation in Taung
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl">
            Comfortable executive, standard and family rooms in Taung,
            North West, South Africa.
            <br />
            Swimming Pool • Free WiFi • Secure Parking
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:scale-105"
            >
              Check Availability & Book
            </Link>

            <a
              href="#rooms"
              className="rounded-full border border-white px-8 py-4 text-white transition hover:bg-white hover:text-black"
            >
              View Rooms & Rates
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}