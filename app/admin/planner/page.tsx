"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface PlannerRoom {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price: number;
  status: string;
  maintenance_note?: string | null;
  maintenance_since?: string | null;
}

interface PlannerBooking {
  id: string;
  booking_reference: string;
  guest_name: string;
  phone?: string | null;
  email?: string | null;
  room_id: string | null;
  room_type: string;
  check_in: string;
  check_out: string;
  status: string;
  payment_status?: string | null;
  grand_total: number;
  total_paid: number;
  balance: number;
  collection_status: string;
  booking_source?: string | null;
  company_name?: string | null;
  rate_plan?: string | null;
}

interface PlannerData {
  success: boolean;
  start: string;
  end: string;
  days: number;
  summary: {
    totalRooms: number;
    sellableRooms: number;
    bookings: number;
    occupiedRoomNights: number;
    occupancyRate: number;
  };
  rooms: PlannerRoom[];
  bookings: PlannerBooking[];
  message?: string;
}

const DAY_MS = 86400000;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
  });
}

function money(value: number) {
  return `R ${Number(value || 0).toLocaleString("en-ZA", {
    maximumFractionDigits: 2,
  })}`;
}

function statusClass(status: string) {
  switch (status) {
    case "checked-in":
      return "border-emerald-500/40 bg-emerald-500/20 text-emerald-200";
    case "confirmed":
      return "border-blue-500/40 bg-blue-500/20 text-blue-200";
    case "pending":
      return "border-amber-500/40 bg-amber-500/20 text-amber-100";
    default:
      return "border-white/10 bg-white/5 text-gray-300";
  }
}

function paymentClass(status: string) {
  switch (status) {
    case "paid":
      return "text-emerald-300";
    case "partially-paid":
      return "text-amber-300";
    default:
      return "text-red-300";
  }
}

export default function PlannerPage() {
  const [start, setStart] = useState(() => isoDate(new Date()));
  const [days, setDays] = useState(14);
  const [data, setData] = useState<PlannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<PlannerBooking | null>(null);

  const loadPlanner = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/planner?start=${encodeURIComponent(start)}&days=${days}`,
        { cache: "no-store" }
      );
      const result = (await response.json()) as PlannerData;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load room planner.");
      }

      setData(result);
    } catch (err) {
      console.error("PLANNER LOAD ERROR:", err);
      setError(err instanceof Error ? err.message : "Unable to load room planner.");
    } finally {
      setLoading(false);
    }
  }, [start, days]);

  useEffect(() => {
    loadPlanner();
  }, [loadPlanner]);

  const dateColumns = useMemo(() => {
    const base = new Date(`${start}T00:00:00`);
    return Array.from({ length: days }, (_, index) => {
      const date = new Date(base.getTime() + index * DAY_MS);
      return isoDate(date);
    });
  }, [start, days]);

  function moveWindow(amount: number) {
    const current = new Date(`${start}T00:00:00`);
    current.setDate(current.getDate() + amount);
    setStart(isoDate(current));
  }

  function bookingFor(roomId: string, date: string) {
    return data?.bookings.find(
      (booking) =>
        booking.room_id === roomId &&
        booking.check_in <= date &&
        booking.check_out > date
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[1700px] px-5 py-10 md:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Operations V2
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Room Planner</h1>
            <p className="mt-3 max-w-3xl text-gray-400">
              One screen for room allocation, occupancy, payments, arrivals, departures and maintenance blocks.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm text-gray-400">
              Start date
              <input
                type="date"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className="mt-1 block rounded-xl border border-white/10 bg-[#111] px-3 py-2 text-white"
              />
            </label>

            <label className="text-sm text-gray-400">
              Window
              <select
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                className="mt-1 block rounded-xl border border-white/10 bg-[#111] px-3 py-2 text-white"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={21}>21 days</option>
                <option value={31}>31 days</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => moveWindow(-days)}
              className="rounded-xl border border-white/10 px-4 py-2 font-semibold text-gray-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setStart(isoDate(new Date()))}
              className="rounded-xl border border-[#d4b16f]/40 px-4 py-2 font-semibold text-[#d4b16f]"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => moveWindow(days)}
              className="rounded-xl border border-white/10 px-4 py-2 font-semibold text-gray-200"
            >
              Next
            </button>
            <button
              type="button"
              onClick={loadPlanner}
              disabled={loading}
              className="rounded-xl bg-[#d4b16f] px-5 py-2 font-bold text-black disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Rooms" value={String(data.summary.totalRooms)} />
            <Metric label="Sellable" value={String(data.summary.sellableRooms)} valueClass="text-emerald-400" />
            <Metric label="Bookings in view" value={String(data.summary.bookings)} valueClass="text-[#d4b16f]" />
            <Metric label="Room nights sold" value={String(data.summary.occupiedRoomNights)} valueClass="text-blue-400" />
            <Metric label="Occupancy" value={`${data.summary.occupancyRate}%`} valueClass="text-[#d4b16f]" />
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f]">
          <div className="overflow-x-auto">
            <table className="min-w-max border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#141414]">
                  <th className="sticky left-0 z-20 min-w-56 bg-[#141414] px-4 py-4 text-left">Room</th>
                  {dateColumns.map((date) => {
                    const isToday = date === isoDate(new Date());
                    return (
                      <th
                        key={date}
                        className={`min-w-32 border-l border-white/5 px-3 py-4 text-center ${isToday ? "bg-[#d4b16f]/10 text-[#d4b16f]" : "text-gray-400"}`}
                      >
                        {formatDate(date)}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {(data?.rooms ?? []).map((room) => (
                  <tr key={room.id} className="border-b border-white/5">
                    <td className="sticky left-0 z-10 bg-[#0f0f0f] px-4 py-4 align-top">
                      <div className="font-bold text-white">{room.room_number}</div>
                      <div className="mt-1 text-xs text-gray-500">{room.room_type}</div>
                      <div className="mt-2 text-xs text-gray-400">{money(room.price)}</div>
                      <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${
                        room.status === "maintenance"
                          ? "border-red-500/30 bg-red-500/10 text-red-300"
                          : room.status === "cleaning"
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                            : room.status === "occupied"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : "border-white/10 bg-white/5 text-gray-300"
                      }`}>
                        {room.status}
                      </span>
                    </td>

                    {dateColumns.map((date) => {
                      const booking = bookingFor(room.id, date);
                      const maintenance = room.status === "maintenance";
                      return (
                        <td
                          key={`${room.id}-${date}`}
                          className="h-24 border-l border-white/5 p-1 align-top"
                        >
                          {maintenance ? (
                            <div className="h-full rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-300">
                              Maintenance
                              {room.maintenance_note ? (
                                <div className="mt-1 line-clamp-3 text-[11px] text-red-200/70">
                                  {room.maintenance_note}
                                </div>
                              ) : null}
                            </div>
                          ) : booking ? (
                            <button
                              type="button"
                              onClick={() => setSelected(booking)}
                              className={`h-full w-full rounded-xl border p-2 text-left transition hover:brightness-110 ${statusClass(booking.status)}`}
                            >
                              <div className="truncate font-semibold">{booking.guest_name}</div>
                              <div className="mt-1 text-[11px] opacity-80">{booking.booking_reference}</div>
                              <div className={`mt-2 text-[11px] font-semibold ${paymentClass(booking.collection_status)}`}>
                                {booking.collection_status.replace(/-/g, " ")}
                              </div>
                            </button>
                          ) : (
                            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/5 text-[11px] text-gray-700">
                              Free
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111] p-7 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#d4b16f]">Booking</p>
                <h2 className="mt-2 text-2xl font-bold">{selected.guest_name}</h2>
                <p className="mt-1 text-gray-500">{selected.booking_reference}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full border border-white/10 px-3 py-1 text-gray-400">Close</button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info label="Stay" value={`${formatDate(selected.check_in)} - ${formatDate(selected.check_out)}`} />
              <Info label="Status" value={selected.status.replace(/-/g, " ")} />
              <Info label="Charged" value={money(selected.grand_total)} />
              <Info label="Paid" value={money(selected.total_paid)} />
              <Info label="Balance" value={money(selected.balance)} />
              <Info label="Source" value={selected.booking_source || "website"} />
            </div>

            {selected.company_name ? (
              <div className="mt-4 rounded-2xl bg-white/[0.03] p-4 text-sm text-gray-300">
                Company: <strong>{selected.company_name}</strong>
              </div>
            ) : null}

            <a
              href="/admin/bookings"
              className="mt-6 inline-flex rounded-full bg-[#d4b16f] px-5 py-3 font-semibold text-black"
            >
              Open Booking Management
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

function Metric({ label, value, valueClass = "text-white" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-wide text-gray-600">{label}</p>
      <p className="mt-1 capitalize text-gray-200">{value}</p>
    </div>
  );
}
