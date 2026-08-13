"use client";

import { useCallback, useEffect, useState } from "react";

interface Booking {
  guest_name: string;
  status: string;
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price: number;
  status: string;
  bookings?: Booking[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRoom, setUpdatingRoom] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRooms = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/admin/rooms", {
        cache: "no-store",
      });

      const text = await response.text();

      let result;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          "Rooms API returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to load rooms."
        );
      }

      setRooms(
        Array.isArray(result)
          ? result
          : result?.rooms ?? []
      );
    } catch (err) {
      console.error("ROOM LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  async function markRoomCleaned(roomId: string) {
    try {
      setUpdatingRoom(roomId);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/admin/rooms/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId,
            status: "available",
          }),
        }
      );

      const text = await response.text();

      let result;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          "Room status API returned an invalid response."
        );
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Unable to mark room as cleaned."
        );
      }

      setMessage(
        result.message ||
          "Room marked as cleaned and available."
      );

      // Update the screen immediately.
      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                status: "available",
              }
            : room
        )
      );

      // Then reload from Supabase to verify the saved state.
      await loadRooms();
    } catch (err) {
      console.error("ROOM UPDATE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update room."
      );
    } finally {
      setUpdatingRoom(null);
    }
  }

  function statusColor(status: string) {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-emerald-500 text-black";

      case "reserved":
        return "bg-amber-500 text-black";

      case "occupied":
        return "bg-red-500 text-white";

      case "cleaning":
        return "bg-blue-500 text-white";

      case "maintenance":
        return "bg-gray-600 text-white";

      default:
        return "bg-gray-700 text-white";
    }
  }

  function formatStatus(status: string) {
    return status
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
            Godmill Hotel Management
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Rooms Management
          </h1>

          <p className="mt-3 text-gray-400">
            View room availability, occupancy and housekeeping
            status.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              Loading rooms...
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No rooms found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr className="text-left">
                    <th className="px-6 py-5">
                      Room
                    </th>

                    <th className="px-6 py-5">
                      Type
                    </th>

                    <th className="px-6 py-5">
                      Capacity
                    </th>

                    <th className="px-6 py-5">
                      Price
                    </th>

                    <th className="px-6 py-5">
                      Status
                    </th>

                    <th className="px-6 py-5">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rooms.map((room) => (
                    <tr
                      key={room.id}
                      className="border-b border-white/[0.06] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-5">
                        <span className="text-lg font-bold">
                          {room.room_number}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {room.room_type}
                      </td>

                      <td className="px-6 py-5">
                        {room.capacity}
                      </td>

                      <td className="px-6 py-5">
                        R
                        {Number(
                          room.price
                        ).toLocaleString("en-ZA")}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${statusColor(
                            room.status
                          )}`}
                        >
                          {formatStatus(
                            room.status
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {room.status ===
                        "cleaning" ? (
                          <button
                            type="button"
                            disabled={
                              updatingRoom ===
                              room.id
                            }
                            onClick={() =>
                              markRoomCleaned(
                                room.id
                              )
                            }
                            className="rounded-full bg-[#d4b16f] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingRoom ===
                            room.id
                              ? "Updating..."
                              : "Cleaned"}
                          </button>
                        ) : room.status ===
                          "occupied" ? (
                          <span className="text-sm text-red-400">
                            Guest in room
                          </span>
                        ) : room.status ===
                          "reserved" ? (
                          <span className="text-sm text-amber-400">
                            Reserved
                          </span>
                        ) : room.status ===
                          "available" ? (
                          <span className="text-sm text-emerald-400">
                            Ready
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}