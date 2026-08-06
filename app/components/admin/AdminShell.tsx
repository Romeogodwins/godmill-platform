import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "◉" },
  { href: "/admin/bookings", label: "Bookings", icon: "☰" },
  { href: "/admin/rooms", label: "Rooms", icon: "⌂" },
  { href: "/admin/calendar", label: "Calendar", icon: "◷" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

interface AdminShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const today = new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-[#111111]/95 px-5 py-6 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">GODMILL</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Admin Suite</h2>
            <p className="mt-2 text-sm text-gray-400">Luxury management portal</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-[#d4b16f]/40 hover:bg-[#d4b16f]/10"
              >
                <span className="text-[#d4b16f]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-white/10 bg-[#0f0f0f]/90 px-5 py-5 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b16f]">Godmill City Guesthouse</p>
                <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
                <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm">
                  <p className="text-gray-400">Today</p>
                  <p className="font-semibold text-white">{today}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4b16f] font-bold text-black">
                  A
                </div>
              </div>
            </div>
          </header>

          <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
