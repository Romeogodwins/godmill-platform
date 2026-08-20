"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const operationsMenu = [
  { title: "Dashboard", href: "/admin" },
  { title: "Reception", href: "/admin/reception" },
  { title: "Room Planner", href: "/admin/planner" },
  { title: "Bookings", href: "/admin/bookings" },
  { title: "Rooms", href: "/admin/rooms" },
  { title: "Guests", href: "/admin/guests" },
  { title: "Payments", href: "/admin/payments" },
  { title: "Invoices", href: "/admin/invoices" },
  { title: "Expenses", href: "/admin/expenses" },
  { title: "Reports", href: "/admin/reports" },
];

const growthMenu = [
  { title: "SEO Growth", href: "/admin/seo" },
];

const systemMenu = [
  { title: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  const renderLink = (item: { title: string; href: string }) => (
    <Link
      key={item.href}
      href={item.href}
      className={`block rounded-xl px-4 py-3 transition ${
        isActive(item.href)
          ? "bg-[#d4b16f] font-semibold text-black"
          : "text-gray-300 hover:bg-white/10"
      }`}
    >
      {item.title}
    </Link>
  );

  return (
    <aside className="min-h-screen w-64 shrink-0 border-r border-white/10 bg-[#111111] p-6">
      <Link href="/admin">
        <h1 className="text-2xl font-bold text-[#d4b16f]">
          GODMILL
        </h1>

        <p className="text-sm text-gray-400">
          Hotel Management
        </p>
      </Link>

      <nav className="mt-10">
        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
          Operations
        </p>

        <div className="space-y-2">
          {operationsMenu.map(renderLink)}
        </div>

        <div className="my-6 border-t border-white/10" />

        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b16f]">
          Growth
        </p>

        <div className="space-y-2">
          {growthMenu.map(renderLink)}
        </div>

        <div className="my-6 border-t border-white/10" />

        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
          System
        </p>

        <div className="space-y-2">
          {systemMenu.map(renderLink)}
        </div>
      </nav>
    </aside>
  );
}