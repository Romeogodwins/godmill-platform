"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase/client";
import type { BookingRecord, GuestRecord, RoomRecord } from "../../lib/supabase-types";
import AdminShell from "../components/admin/AdminShell";
import BookingDetailsModal from "../components/admin/BookingDetailsModal";
import BookingTable from "../components/admin/BookingTable";
import StatCard from "../components/admin/StatCard";

function normalizeStatus(value: string | null | undefined) {
  const normalized = (value ?? "pending").toLowerCase();
  if (normalized === "checked in") return "Checked In";
  if (normalized === "checked out") return "Checked Out";
  if (normalized === "pending") return "Pending";
  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "cancelled") return "Cancelled";
  return value ?? "Pending";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);

      const [{ data: bookingsData, error: bookingsError }, { data: guestsData, error: guestsError }, { data: roomsData, error: roomsError }] = await Promise.all([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("guests").select("*").order("created_at", { ascending: false }),
        supabase.from("rooms").select("*").order("room_number", { ascending: true }),
      ]);

      if (!active) return;

      if (bookingsError) console.error("Bookings load failed", bookingsError);
      if (guestsError) console.error("Guests load failed", guestsError);
      if (roomsError) console.error("Rooms load failed", roomsError);

      setBookings((bookingsData ?? []) as BookingRecord[]);
      setGuests((guestsData ?? []) as GuestRecord[]);
      setRooms((roomsData ?? []) as RoomRecord[]);
      setLoading(false);
    }

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const today = useMemo(() => new Date(), []);
  const todaysBookings = bookings.filter((booking) => booking.created_at?.startsWith(today.toISOString().slice(0, 10))).length;
  const todaysCheckIns = bookings.filter((booking) => booking.check_in === today.toISOString().slice(0, 10)).length;
  const todaysCheckOuts = bookings.filter((booking) => booking.check_out === today.toISOString().slice(0, 10)).length;
  const occupiedRooms = rooms.filter((room) => (room.status ?? "").toLowerCase() === "occupied").length;
  const availableRooms = rooms.filter((room) => (room.status ?? "").toLowerCase() === "available").length;
  const monthlyRevenue = bookings.reduce((sum, booking) => sum + Number(booking.grand_total ?? 0), 0);
  const breakfastOrders = bookings.filter((booking) => booking.breakfast).length;

  const handleViewBooking = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleStatusChange = async (bookingId: number, status: string) => {
    const updatedStatus = normalizeStatus(status);
    const { error } = await supabase.from("bookings").update({ status: updatedStatus.toLowerCase() }).eq("id", bookingId);

    if (error) {
      console.error("Status update failed", error);
      return;
    }

    setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status: updatedStatus } : booking)));
    setSelectedBooking((prev) => (prev && prev.id === bookingId ? { ...prev, status: updatedStatus } : prev));
  };

  return (
    <AdminShell title="Dashboard" subtitle="Operations overview for today">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Today's Bookings" value={loading ? "—" : String(todaysBookings)} hint="Reservations created today" />
        <StatCard title="Today's Check-ins" value={loading ? "—" : String(todaysCheckIns)} hint="Arriving today" />
        <StatCard title="Today's Check-outs" value={loading ? "—" : String(todaysCheckOuts)} hint="Departures scheduled" />
        <StatCard title="Occupied Rooms" value={loading ? "—" : String(occupiedRooms)} hint="Occupancy from room records" />
        <StatCard title="Available Rooms" value={loading ? "—" : String(availableRooms)} hint="Ready for arrival" />
        <StatCard title="Monthly Revenue" value={loading ? "—" : formatCurrency(monthlyRevenue)} hint="Generated from bookings" />
        <StatCard title="Breakfast Orders" value={loading ? "—" : String(breakfastOrders)} hint="Breakfast service requests" />
        <StatCard title="Registered Guests" value={loading ? "—" : String(guests.length)} hint="Guest profiles in the system" />
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent bookings</h2>
            <p className="mt-1 text-sm text-gray-400">The latest reservations from the live booking system.</p>
          </div>
        </div>
        <BookingTable bookings={bookings.slice(0, 4)} onView={handleViewBooking} />
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBooking(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </AdminShell>
  );
}
