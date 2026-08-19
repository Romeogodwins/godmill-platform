import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden lg:h-screen">
      <Image
        src="/hero.jpeg"
        alt="Godmill City Guesthouse accommodation in Taung, North West"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 flex min-h-[760px] items-center lg:h-full">
        <div className="mx-auto w-full max-w-7xl px-6 pt-24 lg:px-10">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b16f] sm:text-base">
            Premium Accommodation in Taung
          </p>

          <h1 className="max-w-5xl text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Godmill City Guesthouse
            <span className="mt-3 block text-[#d4b16f]">
              Accommodation in Taung
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-200 md:text-xl">
            Comfortable executive, standard and family rooms in Taung,
            North West, with free WiFi, secure parking and a swimming pool.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:scale-105 hover:bg-[#e3c27d]"
            >
              Check Availability & Book
            </Link>

            <Link
              href="/accommodation-taung"
              className="rounded-full border border-white/50 px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              View Rooms & Rates
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-200">
            <span>✓ Free WiFi</span>
            <span>✓ Secure Parking</span>
            <span>✓ Swimming Pool</span>
            <span>✓ Direct Booking</span>
          </div>
        </div>
      </div>
    </section>
  );
}