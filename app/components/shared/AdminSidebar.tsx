"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { title: "Dashboard", href: "/admin" },
  { title: "Reception", href: "/admin/reception" },
  { title: "Bookings", href: "/admin/bookings" },
  { title: "Rooms", href: "/admin/rooms" },
  { title: "Guests", href: "/admin/guests" },
  { title: "Payments", href: "/admin/payments" },
  { title: "Invoices", href: "/admin/invoices" },
  { title: "Expenses", href: "/admin/expenses" },
  { title: "Reports", href: "/admin/reports" },
  { title: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 border-r border-white/10 bg-[#111111] p-6">
      <h1 className="text-2xl font-bold text-[#d4b16f]">
        GODMILL
      </h1>

      <p className="mb-10 text-sm text-gray-400">
        Hotel Management
      </p>

      <nav className="space-y-3">
        {menu.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-[#d4b16f] font-semibold text-black"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}