"use client";

import { motion } from "framer-motion";
import AdaptiveImage from "./AdaptiveImage";

const stats = [
  { label: "Executive Room", value: "1" },
  { label: "Standard Rooms", value: "5" },
  { label: "Family Rooms", value: "2" },
  { label: "Swimming Pool", value: "1" },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#071421] text-[#f6efe6]">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 18, ease: "easeOut" }}
      >
        <AdaptiveImage
          src="/images/hero.jpg"
          alt="Godmill City Guesthouse cinematic hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,7,20,0.55),rgba(0,7,20,0.85))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,177,111,0.18),_transparent_35%)]" />
      </motion.div>

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
            <div className="h-12 w-12 overflow-hidden rounded-3xl border border-[#d4b16f]/20 bg-[#11223b]/80">
              <AdaptiveImage src="/logo.jpg" alt="Godmill logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#d4b16f]">Godmill City</p>
              <p className="text-sm font-semibold">Guesthouse</p>
            </div>
          </div>
          <a
            href="#rooms"
            className="inline-flex items-center rounded-full bg-[#d4b16f] px-5 py-3 text-sm font-semibold text-[#071421] shadow-lg shadow-[#171717]/25 transition hover:bg-[#c9a95e]"
          >
            Book Now
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-start gap-6 py-24 sm:py-32 lg:py-40"
        >
          <p className="text-sm uppercase tracking-[0.5em] text-[#d4b16f]">Luxury city escape</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Godmill City Guesthouse
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[#d9d1c6] sm:text-lg">
            Discover elegant rooms, a cinematic poolside atmosphere and five-star service with a warm local welcome.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#rooms"
              className="inline-flex items-center justify-center rounded-full bg-[#d4b16f] px-8 py-4 text-sm font-semibold text-[#071421] transition hover:bg-[#c9a95e]"
            >
              Explore rooms
            </a>
            <a
              href="https://wa.me/27790582637"
              className="inline-flex items-center justify-center rounded-full border border-[#d4b16f]/40 bg-[#ffffff0f] px-8 py-4 text-sm font-semibold text-[#f6efe6] transition hover:border-[#d4b16f] hover:bg-[#ffffff16]"
            >
              WhatsApp 079 058 2637
            </a>
          </div>
        </motion.div>

        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[#071421]/80 px-6 py-6 shadow-[0_35px_80px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-1 text-[#d9d1c6]"
            >
              <p className="text-2xl font-semibold text-[#f8f2ea]">{stat.value}</p>
              <p className="text-sm uppercase tracking-[0.25em] text-[#d4b16f]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <div className="flex flex-col items-center gap-3 text-sm text-[#d9d1c6] opacity-90">
          <span className="rounded-full border border-[#d4b16f]/40 px-3 py-2 text-xs uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-16 w-[1px] bg-gradient-to-b from-[#d4b16f] via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
