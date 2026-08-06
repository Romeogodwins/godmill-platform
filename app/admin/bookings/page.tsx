"use client";

import { useEffect, useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import BookingTable from "../../components/admin/BookingTable";
import { supabase } from "../../../lib/supabase";
import type { BookingRecord } from "../../../lib/supabase-types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data, error } = await supabase.from("Bookings").select("*").order("created_at", { ascending: false });

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
    <AdminShell title="Bookings" subtitle="Manage reservations and guest stays">
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">All bookings</h2>
            <p className="mt-1 text-sm text-gray-400">Live records from Supabase</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">Loading bookings…</div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">{error}</div>
        ) : (
          <BookingTable bookings={bookings} />
        )}
      </div>
    </AdminShell>
  );
}
