"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase/client";
import type { BookingRecord } from "../../../lib/supabase-types";
import AdminShell from "../../components/admin/AdminShell";
import BookingDetailsModal from "../../components/admin/BookingDetailsModal";
import BookingTable from "../../components/admin/BookingTable";

function normalizeStatus(value: string | null | undefined) {
  const normalized = (value ?? "pending")
    .toLowerCase()
    .replace("_", " ");

  if (normalized === "checked in") return "Checked In";
  if (normalized === "checked out") return "Checked Out";
  if (normalized === "pending") return "Pending";
  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "cancelled") return "Cancelled";

  return value ?? "Pending";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roomFilter, setRoomFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedBooking, setSelectedBooking] =
    useState<BookingRecord | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      try {
        setLoading(true);
        setLoadError(null);

        console.log("Loading bookings from Supabase...");

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (!active) return;

        if (error) {
          console.error("SUPABASE BOOKINGS ERROR:", error);
          setLoadError(error.message);
          setBookings([]);
          return;
        }

        console.log("Bookings loaded:", data);

        setBookings((data ?? []) as BookingRecord[]);
      } catch (error) {
        console.error("BOOKINGS FETCH ERROR:", error);

        if (!active) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load bookings."
        );

        setBookings([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBookings();

    return () => {
      active = false;
    };
  }, []);

  const roomOptions = useMemo(
    () =>
      Array.from(
        new Set(
          bookings
            .map((booking) => booking.room_type)
            .filter(Boolean)
        )
      ),
    [bookings]
  );

  const filteredBookings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !term ||
        booking.guest_name?.toLowerCase().includes(term) ||
        booking.phone?.toLowerCase().includes(term) ||
        booking.booking_reference?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        normalizeStatus(booking.status) === statusFilter;

      const matchesRoom =
        roomFilter === "All" ||
        booking.room_type === roomFilter;

      const matchesDate =
        !dateFilter ||
        booking.check_in === dateFilter ||
        booking.check_out === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRoom &&
        matchesDate
      );
    });
  }, [
    bookings,
    searchTerm,
    statusFilter,
    roomFilter,
    dateFilter,
  ]);

  const handleViewBooking = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleStatusChange = async (
    bookingId: string,
    status: string
  ) => {
    try {
      const updatedStatus = normalizeStatus(status);

      const databaseStatus = updatedStatus
        .toLowerCase()
        .replace(" ", "_");

      const { error } = await supabase
        .from("bookings")
        .update({
          status: databaseStatus,
        })
        .eq("id", bookingId);

      if (error) {
        console.error("STATUS UPDATE ERROR:", error);
        alert(`Could not update booking: ${error.message}`);
        return;
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: databaseStatus,
              }
            : booking
        )
      );

      setSelectedBooking((previous) =>
        previous && previous.id === bookingId
          ? {
              ...previous,
              status: databaseStatus,
            }
          : previous
      );
    } catch (error) {
      console.error("STATUS UPDATE FAILED:", error);
    }
  };

  return (
    <AdminShell
      title="Bookings"
      subtitle="Manage reservations and guest stays"
    >
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-[#101010] p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-3xl font-semibold text-white">
                All bookings
              </h2>

              <p className="mt-3 max-w-xl text-gray-400">
                Search, filter, and update reservation status from
                the live records.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search guest or booking"
                className="rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none focus:border-[#d4b16f]"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">
                  Checked Out
                </option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={roomFilter}
                onChange={(event) =>
                  setRoomFilter(event.target.value)
                }
                className="rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none"
              >
                <option value="All">All rooms</option>

                {roomOptions.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
                className="rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none md:col-span-3"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-300">
            Loading live bookings...
          </div>
        )}

        {!loading && loadError && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <p className="font-semibold text-red-300">
              Could not load bookings
            </p>

            <p className="mt-2 text-sm text-red-200">
              {loadError}
            </p>
          </div>
        )}

        {!loading && !loadError && (
          <>
            <div className="text-sm text-gray-400">
              {filteredBookings.length} booking
              {filteredBookings.length === 1 ? "" : "s"} found
            </div>

            <BookingTable
              bookings={filteredBookings}
              onView={handleViewBooking}
            />
          </>
        )}
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