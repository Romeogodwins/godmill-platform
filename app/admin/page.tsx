"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Financial {
  totalBookedRevenue: number;
  totalPaymentsReceived: number;
  totalOutstanding: number;
  totalExpenses: number;
  netProfit: number;
  paymentsToday: number;
  expensesToday: number;
  profitToday: number;
  paymentsMonth: number;
  expensesMonth: number;
  monthlyProfit: number;
}

interface Booking {
  id: string;
  booking_reference: string;
  guest_name: string;
  phone?: string | null;
  room_type: string;
  check_in: string;
  check_out: string;
  status: string;
  grand_total: number;
  rooms?: { room_number: string } | null;
}

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  payment_reference?: string | null;
  payment_date: string;
}

interface Expense {
  id: string;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: string;
  supplier?: string | null;
}

interface DashboardData {
  success: boolean;
  date: string;
  arrivals: number;
  departures: number;
  availableRooms: number;
  occupiedRooms: number;
  cleaningRooms: number;
  reservedRooms: number;
  totalRooms: number;
  activeBookings: number;
  financial: Financial;
  bookings: Booking[];
  recentBookings: Booking[];
  recentPayments: Payment[];
  recentExpenses: Expense[];
  message?: string;
}

function money(value: number) {
  const amount = Number(value || 0);
  const absolute = Math.abs(amount).toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-R ${absolute}` : `R ${absolute}`;
}

function formatDate(value: string) {
  if (!value) return "—";
  const raw = value.includes("T") ? value.slice(0, 10) : value;
  return new Date(`${raw}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  switch (status) {
    case "checked-in":
    case "available":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "confirmed":
    case "cleaning":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "pending":
    case "reserved":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "cancelled":
    case "occupied":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    default:
      return "border-white/10 bg-white/5 text-gray-300";
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const result = (await response.json()) as DashboardData;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load dashboard.");
      }

      setData(result);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <p className="text-gray-400">Loading management dashboard...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error || "Unable to load dashboard."}
        </div>
      </main>
    );
  }

  const f = data.financial;
  const netPositive = f.netProfit >= 0;
  const monthPositive = f.monthlyProfit >= 0;
  const todayPositive = f.profitToday >= 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill City Guesthouse
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Management Dashboard
            </h1>
            <p className="mt-3 text-gray-400">
              Live overview of rooms, bookings, collections, expenses and profit.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="rounded-full border border-[#d4b16f]/40 px-6 py-3 font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f] hover:text-black disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              + New Booking
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Today's Arrivals" value={data.arrivals} valueClass="text-[#d4b16f]" />
          <StatCard title="Today's Departures" value={data.departures} valueClass="text-[#d4b16f]" />
          <StatCard title="Active Bookings" value={data.activeBookings} valueClass="text-blue-400" />
          <StatCard title="Total Rooms" value={data.totalRooms} />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Available Rooms" value={data.availableRooms} valueClass="text-emerald-400" />
          <StatCard title="Occupied Rooms" value={data.occupiedRooms} valueClass="text-red-400" />
          <StatCard title="Reserved Rooms" value={data.reservedRooms} valueClass="text-amber-400" />
          <StatCard title="Cleaning Rooms" value={data.cleaningRooms} valueClass="text-blue-400" />
        </div>

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Financial Position</h2>
            <p className="mt-1 text-sm text-gray-500">
              Actual collections and recorded operating expenses.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <FinancialCard title="Booked Revenue" value={money(f.totalBookedRevenue)} valueClass="text-[#d4b16f]" note="Value charged to bookings" />
            <FinancialCard title="Payments Received" value={money(f.totalPaymentsReceived)} valueClass="text-emerald-400" note="Cash actually collected" />
            <FinancialCard title="Outstanding" value={money(f.totalOutstanding)} valueClass="text-amber-400" note="Still owed by guests" />
            <FinancialCard title="Expenses" value={money(f.totalExpenses)} valueClass="text-red-400" note="Costs recorded" />
            <FinancialCard
              title={netPositive ? "Net Profit" : "Net Loss"}
              value={money(f.netProfit)}
              valueClass={netPositive ? "text-emerald-400" : "text-red-400"}
              note="Collections minus expenses"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <PeriodCard
            title="Today"
            income={f.paymentsToday}
            expenses={f.expensesToday}
            result={f.profitToday}
            positive={todayPositive}
          />
          <PeriodCard
            title="This Month"
            income={f.paymentsMonth}
            expenses={f.expensesMonth}
            result={f.monthlyProfit}
            positive={monthPositive}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#121212] p-7">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <QuickLink href="/admin/reception" label="Reception" />
            <QuickLink href="/admin/bookings" label="Bookings" />
            <QuickLink href="/admin/rooms" label="Rooms" />
            <QuickLink href="/admin/payments" label="Record Payment" />
            <QuickLink href="/admin/invoices" label="Invoices" />
            <QuickLink href="/admin/expenses" label="Add Expense" />
            <QuickLink href="/admin/reports" label="Reports" />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
          <SectionHeader
            title="Active & Upcoming Bookings"
            subtitle="Pending, confirmed and checked-in reservations."
            actionHref="/admin/bookings"
            actionLabel="View All Bookings"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-black/40 text-left text-sm text-gray-400">
                <tr>
                  <th className="px-5 py-5">Reference</th>
                  <th className="px-5 py-5">Guest</th>
                  <th className="px-5 py-5">Room</th>
                  <th className="px-5 py-5">Check In</th>
                  <th className="px-5 py-5">Check Out</th>
                  <th className="px-5 py-5">Value</th>
                  <th className="px-5 py-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.slice(0, 8).map((booking) => (
                  <tr key={booking.id} className="border-t border-white/[0.06]">
                    <td className="px-5 py-5 font-semibold text-[#d4b16f]">
                      {booking.booking_reference}
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-semibold">{booking.guest_name}</p>
                      {booking.phone && (
                        <p className="mt-1 text-xs text-gray-500">{booking.phone}</p>
                      )}
                    </td>
                    <td className="px-5 py-5">
                      <p>{booking.rooms?.room_number || "Unassigned"}</p>
                      <p className="mt-1 text-xs text-gray-500">{booking.room_type}</p>
                    </td>
                    <td className="px-5 py-5">{formatDate(booking.check_in)}</td>
                    <td className="px-5 py-5">{formatDate(booking.check_out)}</td>
                    <td className="px-5 py-5 font-semibold">{money(booking.grand_total)}</td>
                    <td className="px-5 py-5">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}

                {data.bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-gray-500">
                      No active or upcoming bookings.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ActivityPanel title="Recent Bookings" href="/admin/bookings">
            {data.recentBookings.length ? (
              data.recentBookings.map((booking) => (
                <ActivityRow
                  key={booking.id}
                  title={booking.guest_name}
                  subtitle={`${booking.booking_reference} • ${formatDate(booking.check_in)}`}
                  value={money(booking.grand_total)}
                  valueClass="text-[#d4b16f]"
                />
              ))
            ) : (
              <EmptyActivity text="No recent bookings." />
            )}
          </ActivityPanel>

          <ActivityPanel title="Recent Payments" href="/admin/payments">
            {data.recentPayments.length ? (
              data.recentPayments.map((payment) => (
                <ActivityRow
                  key={payment.id}
                  title={formatStatus(payment.payment_method)}
                  subtitle={formatDate(payment.payment_date)}
                  value={money(payment.amount)}
                  valueClass="text-emerald-400"
                />
              ))
            ) : (
              <EmptyActivity text="No recent payments." />
            )}
          </ActivityPanel>

          <ActivityPanel title="Recent Expenses" href="/admin/expenses">
            {data.recentExpenses.length ? (
              data.recentExpenses.map((expense) => (
                <ActivityRow
                  key={expense.id}
                  title={expense.description}
                  subtitle={`${expense.category} • ${formatDate(expense.expense_date)}`}
                  value={money(expense.amount)}
                  valueClass="text-red-400"
                />
              ))
            ) : (
              <EmptyActivity text="No recent expenses." />
            )}
          </ActivityPanel>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  valueClass = "",
}: {
  title: string;
  value: string | number;
  valueClass?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121212] p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`mt-3 text-4xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function FinancialCard({
  title,
  value,
  note,
  valueClass = "",
}: {
  title: string;
  value: string;
  note: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121212] p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`mt-3 text-3xl font-bold ${valueClass}`}>{value}</p>
      <p className="mt-3 text-xs text-gray-500">{note}</p>
    </div>
  );
}

function PeriodCard({
  title,
  income,
  expenses,
  result,
  positive,
}: {
  title: string;
  income: number;
  expenses: number;
  result: number;
  positive: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-2 text-sm text-gray-500">Cash performance</p>
        </div>
        <p className={`text-2xl font-bold ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {money(result)}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MiniBox label="Received" value={money(income)} valueClass="text-emerald-400" />
        <MiniBox label="Expenses" value={money(expenses)} valueClass="text-red-400" />
        <MiniBox
          label={positive ? "Profit" : "Loss"}
          value={money(result)}
          valueClass={positive ? "text-emerald-400" : "text-red-400"}
        />
      </div>
    </div>
  );
}

function MiniBox({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl bg-black/50 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-2 text-lg font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-black px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-[#d4b16f]/50 hover:text-[#d4b16f]"
    >
      {label}
    </Link>
  );
}

function SectionHeader({
  title,
  subtitle,
  actionHref,
  actionLabel,
}: {
  title: string;
  subtitle: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 p-7 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      </div>
      <Link href={actionHref} className="text-sm font-semibold text-[#d4b16f]">
        {actionLabel} →
      </Link>
    </div>
  );
}

function ActivityPanel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121212] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={href} className="text-xs font-semibold text-[#d4b16f]">
          View all →
        </Link>
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  );
}

function ActivityRow({
  title,
  subtitle,
  value,
  valueClass = "",
}: {
  title: string;
  subtitle: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-black/50 p-4">
      <div className="min-w-0">
        <p className="truncate font-semibold">{title}</p>
        <p className="mt-1 truncate text-xs text-gray-500">{subtitle}</p>
      </div>
      <p className={`whitespace-nowrap font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function EmptyActivity({ text }: { text: string }) {
  return <p className="rounded-2xl bg-black/50 p-5 text-sm text-gray-500">{text}</p>;
}
