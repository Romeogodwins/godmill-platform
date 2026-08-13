"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface GuestBooking {
  id: string;
  booking_reference: string;
  room_type: string;
  room_id: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  grand_total: number;
  status: string;
  rooms: {
    room_number: string;
  } | null;
}

interface Guest {
  guest_name: string;
  phone: string;
  email: string;
  total_bookings: number;
  total_spent: number;
  last_check_in: string | null;
  last_check_out: string | null;
  latest_room: string | null;
  latest_room_type: string | null;
  latest_status: string | null;
  bookings: GuestBooking[];
}

interface GuestsResponse {
  success: boolean;
  totalGuests: number;
  guests: Guest[];
  message?: string;
}

function money(value: number) {
  return `R ${Number(value || 0).toLocaleString("en-ZA")}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: string | null) {
  if (!status) return "—";

  return status
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClasses(status: string | null) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";

    case "checked-in":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

    case "checked-out":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";

    case "cancelled":
      return "border-red-500/30 bg-red-500/10 text-red-300";

    case "pending":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";

    default:
      return "border-white/10 bg-white/5 text-gray-300";
  }
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const loadGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/guests", {
        cache: "no-store",
      });

      const result = (await response.json()) as GuestsResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load guests.");
      }

      setGuests(result.guests ?? []);
    } catch (err) {
      console.error("GUEST LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load guests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const filteredGuests = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return guests;

    return guests.filter((guest) => {
      return (
        guest.guest_name?.toLowerCase().includes(term) ||
        guest.phone?.toLowerCase().includes(term) ||
        guest.email?.toLowerCase().includes(term) ||
        guest.latest_room?.toLowerCase().includes(term)
      );
    });
  }, [guests, search]);

  const totalBookings = guests.reduce(
    (total, guest) => total + Number(guest.total_bookings || 0),
    0
  );

  const totalRevenue = guests.reduce(
    (total, guest) => total + Number(guest.total_spent || 0),
    0
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Hotel Management
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Guests Management
            </h1>

            <p className="mt-3 text-gray-400">
              View guest profiles, contact details and booking history.
            </p>
          </div>

          <button
            type="button"
            onClick={loadGuests}
            className="rounded-full border border-[#d4b16f]/40 px-6 py-3 font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f] hover:text-black"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
            <p className="text-gray-400">Total Guests</p>
            <p className="mt-3 text-4xl font-bold text-[#d4b16f]">
              {guests.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
            <p className="text-gray-400">Total Bookings</p>
            <p className="mt-3 text-4xl font-bold">
              {totalBookings}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
            <p className="text-gray-400">Guest Booking Value</p>
            <p className="mt-3 text-4xl font-bold text-emerald-400">
              {money(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search guest, phone, email or room..."
            className="w-full rounded-2xl border border-white/10 bg-[#121212] px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#d4b16f]/60"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              Loading guests...
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No guests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr className="text-left text-gray-300">
                    <th className="px-6 py-5">Guest</th>
                    <th className="px-6 py-5">Contact</th>
                    <th className="px-6 py-5">Latest Room</th>
                    <th className="px-6 py-5">Bookings</th>
                    <th className="px-6 py-5">Total Value</th>
                    <th className="px-6 py-5">Latest Status</th>
                    <th className="px-6 py-5">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredGuests.map((guest, index) => (
                    <tr
                      key={`${guest.email}-${guest.phone}-${index}`}
                      className="border-b border-white/[0.06] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {guest.guest_name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Last stay: {formatDate(guest.last_check_in)}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p>{guest.phone || "—"}</p>

                        <p className="mt-1 text-sm text-gray-500">
                          {guest.email || "No email"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {guest.latest_room || "Unassigned"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {guest.latest_room_type || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {guest.total_bookings}
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#d4b16f]">
                        {money(guest.total_spent)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                            guest.latest_status
                          )}`}
                        >
                          {formatStatus(guest.latest_status)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() => setSelectedGuest(guest)}
                          className="rounded-full bg-[#d4b16f] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111111] shadow-2xl">

              <div className="sticky top-0 flex items-start justify-between border-b border-white/10 bg-[#111111] p-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#d4b16f]">
                    Guest Profile
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {selectedGuest.guest_name}
                  </h2>

                  <p className="mt-2 text-gray-400">
                    {selectedGuest.phone}
                    {selectedGuest.email
                      ? ` • ${selectedGuest.email}`
                      : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedGuest(null)}
                  className="rounded-full border border-white/10 px-4 py-2 text-gray-300 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-3">
                <div className="rounded-2xl bg-black p-5">
                  <p className="text-sm text-gray-500">
                    Total Bookings
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {selectedGuest.total_bookings}
                  </p>
                </div>

                <div className="rounded-2xl bg-black p-5">
                  <p className="text-sm text-gray-500">
                    Total Booking Value
                  </p>

                  <p className="mt-2 text-2xl font-bold text-[#d4b16f]">
                    {money(selectedGuest.total_spent)}
                  </p>
                </div>

                <div className="rounded-2xl bg-black p-5">
                  <p className="text-sm text-gray-500">
                    Latest Room
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {selectedGuest.latest_room || "Unassigned"}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-8">
                <h3 className="mb-4 text-xl font-semibold">
                  Booking History
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full min-w-[850px]">
                    <thead className="bg-black">
                      <tr className="text-left text-sm text-gray-400">
                        <th className="p-4">Reference</th>
                        <th className="p-4">Room</th>
                        <th className="p-4">Check In</th>
                        <th className="p-4">Check Out</th>
                        <th className="p-4">Nights</th>
                        <th className="p-4">Value</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedGuest.bookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-t border-white/[0.06]"
                        >
                          <td className="p-4 font-semibold text-[#d4b16f]">
                            {booking.booking_reference}
                          </td>

                          <td className="p-4">
                            {booking.rooms?.room_number ??
                              booking.room_type ??
                              "Unassigned"}
                          </td>

                          <td className="p-4">
                            {formatDate(booking.check_in)}
                          </td>

                          <td className="p-4">
                            {formatDate(booking.check_out)}
                          </td>

                          <td className="p-4">
                            {booking.nights}
                          </td>

                          <td className="p-4 font-semibold">
                            {money(booking.grand_total)}
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                                booking.status
                              )}`}
                            >
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
          </div>
        )}
      </div>
    </main>
  );
}