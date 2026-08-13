"use client";

import { useCallback, useEffect, useState } from "react";

interface Summary {
  totalBookings: number;
  totalRevenue: number;
  roomRevenue: number;
  breakfastRevenue: number;
  totalPaymentsReceived: number;
  totalOutstanding: number;
  totalExpenses: number;
  netProfit: number;
  monthlyPayments: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  totalNights: number;
  averageBookingValue: number;
  occupancyRate: number;
}

interface BookingStatus {
  pending: number;
  confirmed: number;
  checkedIn: number;
  checkedOut: number;
  cancelled: number;
}

interface PaymentStatus {
  paid: number;
  partiallyPaid: number;
  unpaid: number;
}

interface RoomStatus {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  cleaning: number;
}

interface ExpenseBreakdown {
  category: string;
  amount: number;
}

interface RoomPerformance {
  id: string;
  room_number: string;
  room_type: string;
  status: string;
  bookings: number;
  nights: number;
  revenue: number;
}

interface BookingBalance {
  booking_id: string;
  booking_reference: string;
  guest_name: string;
  charged: number;
  paid: number;
  balance: number;
  payment_status: string;
}

interface Booking {
  id: string;
  booking_reference: string;
  guest_name: string;
  room_type: string;
  room_id: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  room_total: number;
  breakfast_total: number;
  grand_total: number;
  status: string;
  created_at: string;
  rooms: { room_number: string } | null;
}

interface ReportsData {
  success: boolean;
  summary: Summary;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  roomStatus: RoomStatus;
  expenseBreakdown: ExpenseBreakdown[];
  roomPerformance: RoomPerformance[];
  bookingBalances: BookingBalance[];
  bookings: Booking[];
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
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  return status
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
    case "reserved":
    case "partially-paid":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "confirmed":
    case "cleaning":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "checked-in":
    case "available":
    case "paid":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "checked-out":
      return "border-slate-500/30 bg-slate-500/10 text-slate-300";
    case "cancelled":
    case "occupied":
    case "unpaid":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    default:
      return "border-white/10 bg-white/5 text-gray-300";
  }
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/reports", { cache: "no-store" });
      const result = (await response.json()) as ReportsData;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load reports.");
      }

      setData(result);
    } catch (err) {
      console.error("REPORT LOAD ERROR:", err);
      setError(err instanceof Error ? err.message : "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <p className="text-gray-400">Loading reports...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error || "Unable to load reports."}
        </div>
      </main>
    );
  }

  const { summary, bookingStatus, paymentStatus, roomStatus } = data;
  const profitPositive = summary.netProfit >= 0;
  const monthlyPositive = summary.monthlyProfit >= 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Hotel Management
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Reports & Analytics</h1>
            <p className="mt-3 text-gray-400">
              Track cash collected, expenses, profit, bookings and room performance.
            </p>
          </div>
          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
            className="rounded-full border border-[#d4b16f]/40 px-6 py-3 font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f] hover:text-black disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Booked Revenue" value={money(summary.totalRevenue)} valueClass="text-[#d4b16f]" note="Total value charged" />
          <MetricCard label="Payments Received" value={money(summary.totalPaymentsReceived)} valueClass="text-emerald-400" note="Actual cash collected" />
          <MetricCard label="Outstanding" value={money(summary.totalOutstanding)} valueClass="text-amber-400" note="Still owed by guests" />
          <MetricCard label="Expenses" value={money(summary.totalExpenses)} valueClass="text-red-400" note="Operating costs recorded" />
          <MetricCard
            label={profitPositive ? "Net Profit" : "Net Loss"}
            value={money(summary.netProfit)}
            valueClass={profitPositive ? "text-emerald-400" : "text-red-400"}
            note="Payments received minus expenses"
          />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#121212] p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">This Month</h2>
              <p className="mt-2 text-sm text-gray-500">Current-month cash performance.</p>
            </div>
            <p className={`text-3xl font-bold ${monthlyPositive ? "text-emerald-400" : "text-red-400"}`}>
              {monthlyPositive ? "Profit " : "Loss "}
              {money(summary.monthlyProfit)}
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SmallMetric label="Payments Received" value={money(summary.monthlyPayments)} valueClass="text-emerald-400" />
            <SmallMetric label="Expenses" value={money(summary.monthlyExpenses)} valueClass="text-red-400" />
            <SmallMetric label="Net Result" value={money(summary.monthlyProfit)} valueClass={monthlyPositive ? "text-emerald-400" : "text-red-400"} />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SmallMetric label="Total Bookings" value={String(summary.totalBookings)} />
          <SmallMetric label="Nights Booked" value={String(summary.totalNights)} />
          <SmallMetric label="Occupancy" value={`${summary.occupancyRate}%`} valueClass="text-emerald-400" />
          <SmallMetric label="Average Booking" value={money(summary.averageBookingValue)} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <StatusPanel
            title="Payment Status"
            subtitle="Collection position across bookings."
            rows={[
              ["Paid", paymentStatus.paid, "text-emerald-400"],
              ["Partially Paid", paymentStatus.partiallyPaid, "text-amber-400"],
              ["Unpaid", paymentStatus.unpaid, "text-red-400"],
            ]}
          />
          <StatusPanel
            title="Booking Status"
            subtitle="Current booking workflow."
            rows={[
              ["Pending", bookingStatus.pending, "text-amber-400"],
              ["Confirmed", bookingStatus.confirmed, "text-blue-400"],
              ["Checked In", bookingStatus.checkedIn, "text-emerald-400"],
              ["Checked Out", bookingStatus.checkedOut, "text-gray-300"],
              ["Cancelled", bookingStatus.cancelled, "text-red-400"],
            ]}
          />
          <StatusPanel
            title="Room Status"
            subtitle="Live room position."
            rows={[
              ["Available", roomStatus.available, "text-emerald-400"],
              ["Occupied", roomStatus.occupied, "text-red-400"],
              ["Reserved", roomStatus.reserved, "text-amber-400"],
              ["Cleaning", roomStatus.cleaning, "text-blue-400"],
              ["Total Rooms", roomStatus.total, "text-white"],
            ]}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
            <h2 className="text-2xl font-bold">Expense Breakdown</h2>
            <p className="mt-2 text-sm text-gray-500">Recorded spending by category.</p>
            <div className="mt-6 space-y-3">
              {data.expenseBreakdown.length ? (
                data.expenseBreakdown.map((expense) => (
                  <div key={expense.category} className="flex items-center justify-between rounded-2xl bg-black/50 px-5 py-4">
                    <span className="text-gray-300">{expense.category}</span>
                    <span className="font-bold text-red-400">{money(expense.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-black/50 p-5 text-gray-500">No expenses recorded.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
            <h2 className="text-2xl font-bold">Revenue Composition</h2>
            <p className="mt-2 text-sm text-gray-500">Breakdown of booking charges.</p>
            <div className="mt-6 space-y-3">
              <FinanceRow label="Room Revenue" value={money(summary.roomRevenue)} />
              <FinanceRow label="Breakfast Revenue" value={money(summary.breakfastRevenue)} />
              <FinanceRow label="Total Booking Value" value={money(summary.totalRevenue)} valueClass="text-[#d4b16f]" />
              <FinanceRow label="Cash Collected" value={money(summary.totalPaymentsReceived)} valueClass="text-emerald-400" />
              <FinanceRow label="Outstanding" value={money(summary.totalOutstanding)} valueClass="text-amber-400" />
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
          <SectionHeader title="Booking Balances" subtitle="What has been charged, paid and is still outstanding." />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-black/40 text-left text-sm text-gray-400">
                <tr>
                  <th className="px-5 py-5">Reference</th>
                  <th className="px-5 py-5">Guest</th>
                  <th className="px-5 py-5">Charged</th>
                  <th className="px-5 py-5">Paid</th>
                  <th className="px-5 py-5">Balance</th>
                  <th className="px-5 py-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.bookingBalances.map((booking) => (
                  <tr key={booking.booking_id} className="border-t border-white/[0.06]">
                    <td className="px-5 py-5 font-semibold text-[#d4b16f]">{booking.booking_reference}</td>
                    <td className="px-5 py-5">{booking.guest_name}</td>
                    <td className="px-5 py-5">{money(booking.charged)}</td>
                    <td className="px-5 py-5 font-semibold text-emerald-400">{money(booking.paid)}</td>
                    <td className="px-5 py-5 font-semibold text-red-400">{money(booking.balance)}</td>
                    <td className="px-5 py-5">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(booking.payment_status)}`}>
                        {formatStatus(booking.payment_status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
          <SectionHeader title="Room Performance" subtitle="Booking activity and value generated by each room." />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-black/40 text-left text-sm text-gray-400">
                <tr>
                  <th className="px-5 py-5">Room</th>
                  <th className="px-5 py-5">Type</th>
                  <th className="px-5 py-5">Bookings</th>
                  <th className="px-5 py-5">Nights</th>
                  <th className="px-5 py-5">Booking Value</th>
                  <th className="px-5 py-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.roomPerformance.map((room) => (
                  <tr key={room.id} className="border-t border-white/[0.06]">
                    <td className="px-5 py-5 font-bold text-[#d4b16f]">{room.room_number}</td>
                    <td className="px-5 py-5">{room.room_type}</td>
                    <td className="px-5 py-5">{room.bookings}</td>
                    <td className="px-5 py-5">{room.nights}</td>
                    <td className="px-5 py-5 font-semibold">{money(room.revenue)}</td>
                    <td className="px-5 py-5">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(room.status)}`}>
                        {formatStatus(room.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
          <SectionHeader title="Booking Report" subtitle="Detailed booking and financial activity." />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-black/40 text-left text-sm text-gray-400">
                <tr>
                  <th className="px-5 py-5">Reference</th>
                  <th className="px-5 py-5">Guest</th>
                  <th className="px-5 py-5">Room</th>
                  <th className="px-5 py-5">Stay</th>
                  <th className="px-5 py-5">Nights</th>
                  <th className="px-5 py-5">Room</th>
                  <th className="px-5 py-5">Breakfast</th>
                  <th className="px-5 py-5">Total</th>
                  <th className="px-5 py-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-white/[0.06]">
                    <td className="px-5 py-5 font-semibold text-[#d4b16f]">{booking.booking_reference}</td>
                    <td className="px-5 py-5">{booking.guest_name}</td>
                    <td className="px-5 py-5">
                      <p className="font-semibold">{booking.rooms?.room_number || "Unassigned"}</p>
                      <p className="mt-1 text-xs text-gray-500">{booking.room_type}</p>
                    </td>
                    <td className="px-5 py-5">
                      <p>{formatDate(booking.check_in)}</p>
                      <p className="mt-1 text-xs text-gray-500">to {formatDate(booking.check_out)}</p>
                    </td>
                    <td className="px-5 py-5">{booking.nights}</td>
                    <td className="px-5 py-5">{money(booking.room_total)}</td>
                    <td className="px-5 py-5">{money(booking.breakfast_total)}</td>
                    <td className="px-5 py-5 font-bold">{money(booking.grand_total)}</td>
                    <td className="px-5 py-5">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value, note, valueClass = "" }: { label: string; value: string; note: string; valueClass?: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121212] p-6">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${valueClass}`}>{value}</p>
      <p className="mt-3 text-xs text-gray-500">{note}</p>
    </div>
  );
}

function SmallMetric({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function StatusPanel({ title, subtitle, rows }: { title: string; subtitle: string; rows: [string, number, string][] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      <div className="mt-6 space-y-3">
        {rows.map(([label, value, textClass]) => (
          <div key={label} className="flex items-center justify-between rounded-2xl bg-black/50 px-5 py-4">
            <span className="text-gray-300">{label}</span>
            <span className={`text-xl font-bold ${textClass}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceRow({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-black/50 px-5 py-4">
      <span className="text-gray-300">{label}</span>
      <span className={`font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-white/10 p-7">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
