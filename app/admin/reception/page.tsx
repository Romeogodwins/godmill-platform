"use client";

import { useCallback, useEffect, useState } from "react";

interface Booking {
  id: string;
  booking_reference: string;
  guest_name: string;
  room_type: string;
  check_in: string;
  check_out: string;
  status: string;
  room_id?: string | null;
  rooms: {
    room_number: string;
  } | null;
}

interface DashboardData {
  success?: boolean;
  date?: string;
  arrivals: number;
  departures: number;
  availableRooms: number;
  occupiedRooms: number;
  cleaningRooms: number;
  reservedRooms: number;
  totalRooms: number;
  bookings: Booking[];
}

const emptyDashboard: DashboardData = {
  arrivals: 0,
  departures: 0,
  availableRooms: 0,
  occupiedRooms: 0,
  cleaningRooms: 0,
  reservedRooms: 0,
  totalRooms: 0,
  bookings: [],
};

export default function ReceptionPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData>(emptyDashboard);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const text = await response.text();

      let data: DashboardData;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Dashboard API returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load reception information."
        );
      }

      setDashboard({
        ...emptyDashboard,
        ...data,
        bookings: Array.isArray(data.bookings)
          ? data.bookings
          : [],
      });
    } catch (err) {
      console.error("RECEPTION LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load reception."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    const interval = window.setInterval(() => {
      loadDashboard();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadDashboard]);

  function formatStatus(status: string) {
    return status
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  function statusStyle(status: string) {
    switch (status.toLowerCase()) {
      case "pending":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400";

      case "confirmed":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";

      case "checked-in":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

      case "checked-out":
        return "border-gray-500/30 bg-gray-500/10 text-gray-300";

      case "cancelled":
        return "border-red-500/30 bg-red-500/10 text-red-400";

      default:
        return "border-white/10 bg-white/5 text-gray-300";
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
            Godmill Hotel Management
          </p>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">
                Reception
              </h1>

              <p className="mt-3 text-gray-400">
                Manage today's arrivals, departures and room
                occupancy.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              className="w-fit rounded-full border border-[#d4b16f]/40 px-5 py-2.5 text-sm font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f] hover:text-black"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/5 bg-[#121212] p-7">
            <p className="text-gray-400">
              Today's Arrivals
            </p>

            <p className="mt-4 text-5xl font-bold text-[#d4b16f]">
              {dashboard.arrivals}
            </p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-[#121212] p-7">
            <p className="text-gray-400">
              Today's Departures
            </p>

            <p className="mt-4 text-5xl font-bold text-[#d4b16f]">
              {dashboard.departures}
            </p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-[#121212] p-7">
            <p className="text-gray-400">
              Available Rooms
            </p>

            <p className="mt-4 text-5xl font-bold text-emerald-400">
              {dashboard.availableRooms}
            </p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-[#121212] p-7">
            <p className="text-gray-400">
              Occupied Rooms
            </p>

            <p className="mt-4 text-5xl font-bold text-red-400">
              {dashboard.occupiedRooms}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-[#101010] p-5">
            <p className="text-sm text-gray-500">
              Reserved
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-400">
              {dashboard.reservedRooms}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#101010] p-5">
            <p className="text-sm text-gray-500">
              Awaiting Cleaning
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-400">
              {dashboard.cleaningRooms}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#101010] p-5">
            <p className="text-sm text-gray-500">
              Total Rooms
            </p>

            <p className="mt-2 text-2xl font-bold">
              {dashboard.totalRooms}
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
          <div className="border-b border-white/10 px-7 py-6">
            <h2 className="text-2xl font-semibold">
              Current Bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Live reservation and guest activity.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              Loading reception...
            </div>
          ) : dashboard.bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-lg font-medium text-gray-300">
                No current reception activity
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Today's arrivals, departures and active stays
                will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-white/[0.02]">
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-6 py-5">
                      Reference
                    </th>

                    <th className="px-6 py-5">
                      Guest
                    </th>

                    <th className="px-6 py-5">
                      Room
                    </th>

                    <th className="px-6 py-5">
                      Check In
                    </th>

                    <th className="px-6 py-5">
                      Check Out
                    </th>

                    <th className="px-6 py-5">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.bookings.map(
                    (booking) => (
                      <tr
                        key={booking.id}
                        className="border-t border-white/[0.06]"
                      >
                        <td className="px-6 py-5 font-semibold text-[#d4b16f]">
                          {booking.booking_reference}
                        </td>

                        <td className="px-6 py-5">
                          {booking.guest_name}
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-medium">
                            {booking.rooms
                              ?.room_number ??
                              "Unassigned"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.room_type}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          {booking.check_in}
                        </td>

                        <td className="px-6 py-5">
                          {booking.check_out}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(
                              booking.status
                            )}`}
                          >
                            {formatStatus(
                              booking.status
                            )}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}