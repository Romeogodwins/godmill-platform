import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen">
      <Image
        src="/hero.jpeg"
        alt="Godmill City Guesthouse"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-8">
          <p className="mb-4 tracking-[0.35em] text-[#d4b16f] uppercase">
            Premium Accommodation
          </p>

          <h1 className="max-w-3xl text-6xl font-bold leading-tight text-white md:text-7xl">
            Experience Godmill City Guesthouse
          </h1>

          <p className="mt-8 max-w-2xl text-xl text-gray-300">
            Executive • Standard • Family Rooms
            <br />
            Swimming Pool • Free WiFi • Secure Parking
          </p>

          <div className="mt-10 flex gap-5">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:scale-105"
            >
              Book Now
            </Link>

            <a
              href="#rooms"
              className="rounded-full border border-white px-8 py-4 text-white transition hover:bg-white hover:text-black"
            >
              View Rooms
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}