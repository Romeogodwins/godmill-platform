"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Godmill City Guesthouse"
            width={180}
            height={60}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
          <Link href="/">Home</Link>
          <a href="#rooms">Rooms</a>
          <a href="#gallery">Gallery</a>
          <a href="#amenities">Amenities</a>
          <a href="#contact">Contact</a>
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