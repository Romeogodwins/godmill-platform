"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Godmill City Guesthouse home"
        >
          <Image
            src="/logo.png.jpeg"
            alt="Godmill City Guesthouse"
            width={180}
            height={60}
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium text-white md:flex lg:gap-8"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="transition hover:text-[#d4b16f]"
          >
            Home
          </Link>

          <Link
            href="/accommodation-taung"
            className="transition hover:text-[#d4b16f]"
          >
            Accommodation
          </Link>

          <Link
            href="/#rooms"
            className="transition hover:text-[#d4b16f]"
          >
            Rooms
          </Link>

          <Link
            href="/gallery"
            className="transition hover:text-[#d4b16f]"
          >
            Gallery
          </Link>

          <Link
            href="/#amenities"
            className="transition hover:text-[#d4b16f]"
          >
            Amenities
          </Link>

          <Link
            href="/#contact"
            className="transition hover:text-[#d4b16f]"
          >
            Contact
          </Link>
        </nav>

        <Link
          href="/booking"
          className="rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:bg-[#e3c27d]"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}