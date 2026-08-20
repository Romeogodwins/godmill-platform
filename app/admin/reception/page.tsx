"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface BookingItem {
  id: string;
  booking_reference: string;
  guest_name: string;
  phone?: string | null;
  email?: string | null;
  room_id?: string | null;
  room_type: string;
  check_in: string;
  check_out: string;
  status: string;
  payment_status?: string | null;
  proof_of_payment_url?: string | null;
  grand_total: number;
  total_paid: number;
  balance: number;
  booking_source?: string | null;
  company_name?: string | null;
  rooms?: { room_number: string } | null;
}

interface RoomItem {
  id: string;
  room_number: string;
  room_type: string;
  status: string;
  maintenance_note?: string | null;
}

interface ReceptionData {
  success: boolean;
  date: string;
  summary: {
    arrivals: number;
    departures: number;
    inHouse: number;
    available: number;
    cleaning: number;
    maintenance: number;
    proofsToVerify: number;
    outstanding: number;
    overdue: number;
  };
  arrivals: BookingItem[];
  departures: BookingItem[];
  inHouse: BookingItem[];
  overdue: BookingItem[];
  proofsToVerify: BookingItem[];
  outstanding: BookingItem[];
  cleaning: RoomItem[];
  maintenance: RoomItem[];
  available: RoomItem[];
  message?: string;
}

function money(value: number) {
  return `R ${Number(value || 0).toLocaleString("en-ZA", { maximumFractionDigits: 2 })}`;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReceptionPage() {
  const [data, setData] = useState<ReceptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/reception", { cache: "no-store" });
      const result = (await response.json()) as ReceptionData;
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load reception command centre.");
      }
      setData(result);
    } catch (err) {
      console.error("RECEPTION ERROR:", err);
      setError(err instanceof Error ? err.message : "Unable to load reception command centre.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 30000);
    return () => window.clearInterval(interval);
  }, [load]);

  const s = data?.summary;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Operations V2
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Reception Command Centre</h1>
            <p className="mt-3 max-w-3xl text-gray-400">
              Arrivals, departures, guests in-house, payment proofs, balances and housekeeping from one screen.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="rounded-full border border-[#d4b16f]/40 px-5 py-3 font-semibold text-[#d4b16f] disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <Link href="/admin/planner" className="rounded-full bg-[#d4b16f] px-5 py-3 font-semibold text-black">
              Open Room Planner
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Stat label="Arrivals Today" value={s?.arrivals ?? 0} valueClass="text-[#d4b16f]" />
          <Stat label="Departures Today" value={s?.departures ?? 0} valueClass="text-[#d4b16f]" />
          <Stat label="In House" value={s?.inHouse ?? 0} valueClass="text-emerald-400" />
          <Stat label="Available" value={s?.available ?? 0} valueClass="text-emerald-400" />
          <Stat label="Cleaning" value={s?.cleaning ?? 0} valueClass="text-blue-400" />
          <Stat label="Maintenance" value={s?.maintenance ?? 0} valueClass="text-red-400" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AlertStat label="Proofs to Verify" value={s?.proofsToVerify ?? 0} tone="amber" href="/admin/bookings" />
          <AlertStat label="Outstanding Balances" value={s?.outstanding ?? 0} tone="red" href="/admin/payments" />
          <AlertStat label="Overdue Check-outs" value={s?.overdue ?? 0} tone="red" href="/admin/bookings" />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <BookingPanel title="Today's Arrivals" items={data?.arrivals ?? []} empty="No arrivals scheduled for today." />
          <BookingPanel title="Today's Departures" items={data?.departures ?? []} empty="No departures scheduled for today." />
          <BookingPanel title="Guests In House" items={data?.inHouse ?? []} empty="No guests currently checked in." />
          <BookingPanel title="Payment Proofs Awaiting Verification" items={data?.proofsToVerify ?? []} empty="No proof of payment waiting for verification." showBalance />
          <BookingPanel title="Outstanding Balances" items={data?.outstanding ?? []} empty="No outstanding balances on active bookings." showBalance />
          <BookingPanel title="Overdue Check-outs" items={data?.overdue ?? []} empty="No overdue check-outs." danger />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <RoomPanel title="Awaiting Cleaning" rooms={data?.cleaning ?? []} empty="No rooms awaiting cleaning." tone="blue" />
          <RoomPanel title="Maintenance" rooms={data?.maintenance ?? []} empty="No rooms under maintenance." tone="red" />
          <RoomPanel title="Available Now" rooms={data?.available ?? []} empty="No rooms currently available." tone="green" />
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, valueClass = "text-white" }: { label: string; value: number; valueClass?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function AlertStat({ label, value, tone, href }: { label: string; value: number; tone: "amber" | "red"; href: string }) {
  const classes = tone === "amber"
    ? "border-amber-500/20 bg-amber-500/5 text-amber-300"
    : "border-red-500/20 bg-red-500/5 text-red-300";
  return (
    <Link href={href} className={`rounded-2xl border p-5 transition hover:brightness-125 ${classes}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  );
}

function BookingPanel({ title, items, empty, showBalance = false, danger = false }: { title: string; items: BookingItem[]; empty: string; showBalance?: boolean; danger?: boolean }) {
  return (
    <section className={`overflow-hidden rounded-3xl border bg-[#111] ${danger ? "border-red-500/20" : "border-white/10"}`}>
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">{items.length}</span>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="p-6 text-sm text-gray-500">{empty}</p>
      ) : (
        <div className="divide-y divide-white/5">
          {items.map((booking) => (
            <div key={booking.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{booking.guest_name}</p>
                  <p className="mt-1 text-xs text-[#d4b16f]">{booking.booking_reference}</p>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] capitalize text-gray-300">
                  {booking.status.replace(/-/g, " ")}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-400">
                <p>Room: <span className="text-gray-200">{booking.rooms?.room_number || "Unassigned"}</span></p>
                <p>Phone: <span className="text-gray-200">{booking.phone || "-"}</span></p>
                <p>In: <span className="text-gray-200">{formatDate(booking.check_in)}</span></p>
                <p>Out: <span className="text-gray-200">{formatDate(booking.check_out)}</span></p>
              </div>
              {showBalance ? (
                <div className="mt-3 rounded-xl bg-white/[0.03] px-3 py-2 text-sm">
                  <span className="text-gray-500">Balance:</span>{" "}
                  <strong className={booking.balance > 0 ? "text-amber-300" : "text-emerald-300"}>{money(booking.balance)}</strong>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RoomPanel({ title, rooms, empty, tone }: { title: string; rooms: RoomItem[]; empty: string; tone: "blue" | "red" | "green" }) {
  const toneClass = tone === "blue" ? "text-blue-300" : tone === "red" ? "text-red-300" : "text-emerald-300";
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className={`text-2xl font-bold ${toneClass}`}>{rooms.length}</span>
      </div>
      <div className="mt-4 space-y-2">
        {rooms.length === 0 ? <p className="text-sm text-gray-500">{empty}</p> : rooms.map((room) => (
          <div key={room.id} className="rounded-xl bg-white/[0.03] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{room.room_number}</span>
              <span className={`text-xs capitalize ${toneClass}`}>{room.status}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">{room.room_type}</p>
            {room.maintenance_note ? <p className="mt-2 text-xs text-red-200/70">{room.maintenance_note}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
