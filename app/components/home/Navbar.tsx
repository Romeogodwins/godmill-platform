"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Accommodation", href: "/accommodation-taung" },
  { name: "Rooms", href: "/#rooms" },
  { name: "Gallery", href: "/gallery" },
  { name: "Amenities", href: "/#amenities" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-10">
        <Link
          href="/"
          className="relative z-50 flex items-center gap-3"
          aria-label="Godmill City Guesthouse home"
          onClick={() => setMenuOpen(false)}
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#d4b16f]/80 bg-[#004b30] shadow-[0_0_24px_rgba(212,177,111,0.18)]">
            <Image
              src="/gmc-icon-192.png"
              alt="GMC"
              fill
              priority
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="hidden leading-none sm:block">
            <div className="text-[15px] font-bold tracking-[0.16em] text-[#d4b16f]">
              GODMILL CITY
            </div>

            <div className="mt-1.5 text-[10px] font-medium tracking-[0.28em] text-white/70">
              GUESTHOUSE
            </div>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-5 text-[13px] font-medium text-white lg:flex xl:gap-6"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors duration-200 hover:text-[#d4b16f]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/booking"
            className="hidden rounded-full bg-[#d4b16f] px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-black/20 transition hover:bg-[#e3c27d] sm:inline-flex"
          >
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#d4b16f]/60 lg:hidden"
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>

            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-white transition ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#080808]/98 px-6 py-8 shadow-2xl lg:hidden">
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#d4b16f]/50 bg-[#004b30]">
              <Image
                src="/gmc-icon-192.png"
                alt="GMC"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div>
              <div className="text-sm font-bold tracking-[0.15em] text-[#d4b16f]">
                GODMILL CITY
              </div>
              <div className="mt-1 text-[9px] tracking-[0.28em] text-white/60">
                GUESTHOUSE
              </div>
            </div>
          </div>

          <nav
            className="mx-auto flex max-w-7xl flex-col"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-4 text-lg font-medium text-white transition hover:text-[#d4b16f]"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="mt-7 rounded-full bg-[#d4b16f] px-7 py-4 text-center font-semibold text-black transition hover:bg-[#e3c27d]"
            >
              Check Availability & Book
            </Link>

            <a
              href="tel:+27790582637"
              className="mt-4 rounded-full border border-white/20 px-7 py-4 text-center font-semibold text-white transition hover:border-[#d4b16f]/60"
            >
              Call 079 058 2637
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
