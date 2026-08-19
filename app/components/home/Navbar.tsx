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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link
          href="/"
          className="relative z-50 flex items-center"
          aria-label="Godmill City Guesthouse home"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.png.jpeg"
            alt="Godmill City Guesthouse"
            width={180}
            height={60}
            priority
            className="h-auto w-[145px] sm:w-[170px]"
          />
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium text-white lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition hover:text-[#d4b16f]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/booking"
            className="hidden rounded-full bg-[#d4b16f] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e3c27d] sm:inline-flex"
          >
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
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
        <div className="border-t border-white/10 bg-[#080808] px-6 py-8 lg:hidden">
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
              className="mt-7 rounded-full bg-[#d4b16f] px-7 py-4 text-center font-semibold text-black"
            >
              Check Availability & Book
            </Link>

            <a
              href="tel:+27790582637"
              className="mt-4 rounded-full border border-white/20 px-7 py-4 text-center font-semibold text-white"
            >
              Call 079 058 2637
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}