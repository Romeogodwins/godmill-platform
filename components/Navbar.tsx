"use client";

import { useState } from "react";
import AdaptiveImage from "./AdaptiveImage";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Rooms", href: "#rooms" },
  { label: "Pool", href: "#pool" },
  { label: "Facilities", href: "#facilities" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071421]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-[#f6efe6] md:px-10">
        <a href="#home" className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[#d4b16f]/30 bg-[#11223b]">
            <AdaptiveImage
              src="/logo.jpg"
              alt="Godmill City Guesthouse logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Godmill City</p>
            <p className="text-base font-semibold">Guesthouse</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition hover:text-[#d4b16f]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="tel:0790582637"
            className="rounded-full border border-[#d4b16f]/40 bg-[#d4b16f]/10 px-4 py-2 text-sm font-semibold text-[#f6efe6] transition hover:border-[#d4b16f] hover:bg-[#d4b16f]/15"
          >
            079 058 2637
          </a>
          <button
            type="button"
            className="rounded-full border border-[#d4b16f]/40 bg-[#d4b16f]/10 px-4 py-2 text-sm font-semibold text-[#f6efe6] transition hover:border-[#d4b16f] hover:bg-[#d4b16f]/20"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label="Toggle mobile menu"
          >
            Menu
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d4b16f]/30 bg-[#0e243f]/95 text-sm font-semibold text-[#f6efe6] md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label="Toggle mobile menu"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-[#071421]/95 px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-3xl border border-white/5 bg-[#0c1c34]/80 px-4 py-3 text-base font-medium text-[#f6efe6] transition hover:border-[#d4b16f]/40 hover:text-[#d4b16f]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="tel:0790582637"
              className="rounded-3xl border border-[#d4b16f]/30 bg-[#d4b16f]/10 px-4 py-3 text-base font-semibold text-[#f6efe6] transition hover:bg-[#d4b16f]/20"
            >
              Call 079 058 2637
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
