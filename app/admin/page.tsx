"use client";

import { useEffect, useState } from "react";
import AdminShell from "../components/admin/AdminShell";
import StatCard from "../components/admin/StatCard";
import BookingTable from "../components/admin/BookingTable";
import { supabase } from "../../lib/supabase";
import type { BookingRecord } from "../../lib/supabase-types";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data, error } = await supabase.from("Bookings").select("*").order("created_at", { ascending: false }).limit(6);

        if (error) {
          throw error;
        }

        setBookings(data ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load bookings right now.");
      } finally {
        setLoading(false);
      }
    };

    void loadBookings();
  }, []);

  return (
    <AdminShell title="Dashboard" subtitle="Operations overview for today">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Today's Bookings" value={String(bookings.length)} hint="Loaded from Supabase" />
        <StatCard title="Today's Check-ins" value="2" hint="Arriving today" />
        <StatCard title="Today's Check-outs" value="1" hint="Departures scheduled" />
        <StatCard title="Occupied Rooms" value="3" hint="Currently in use" />
        <StatCard title="Available Rooms" value="2" hint="Ready for arrival" />
        <StatCard title="Monthly Revenue" value="R24,000" hint="Placeholder forecast" />
        <StatCard title="Breakfast Orders" value="6" hint="Breakfast service requests" />
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent bookings</h2>
            <p className="mt-1 text-sm text-gray-400">Latest activity at the guesthouse</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">Loading bookings…</div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">{error}</div>
        ) : (
          <BookingTable bookings={bookings.slice(0, 4)} />
        )}
      </div>
    </AdminShell>
  );
}
