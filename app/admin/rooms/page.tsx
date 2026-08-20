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
  maintenance_note?: string | null;
  maintenance_since?: string | null;
  bookings?: Booking[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRoom, setUpdatingRoom] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRooms = useCallback(async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/rooms", { cache: "no-store" });
      const text = await response.text();
      let result;
      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Rooms API returned an invalid response.");
      }
      if (!response.ok) {
        throw new Error(result?.message || "Unable to load rooms.");
      }
      setRooms(Array.isArray(result) ? result : result?.rooms ?? []);
    } catch (err) {
      console.error("ROOM LOAD ERROR:", err);
      setError(err instanceof Error ? err.message : "Unable to load rooms.");
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
      const response = await fetch("/api/admin/rooms/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, status: "available" }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Unable to mark room as cleaned.");
      }
      setMessage(result.message || "Room marked as cleaned and available.");
      await loadRooms();
    } catch (err) {
      console.error("ROOM UPDATE ERROR:", err);
      setError(err instanceof Error ? err.message : "Unable to update room.");
    } finally {
      setUpdatingRoom(null);
    }
  }

  async function maintenanceAction(room: Room, action: "start" | "finish") {
    let note = "";
    if (action === "start") {
      note = window.prompt(
        `Reason for putting room ${room.room_number} under maintenance:`,
        room.maintenance_note || ""
      )?.trim() || "";
      if (!note) return;
    } else if (!window.confirm(`Return room ${room.room_number} to service?`)) {
      return;
    }

    try {
      setUpdatingRoom(room.id);
      setError("");
      setMessage("");
      const response = await fetch("/api/admin/rooms/maintenance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room.id, action, note }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Unable to update maintenance status.");
      }
      setMessage(result.message);
      await loadRooms();
    } catch (err) {
      console.error("MAINTENANCE UPDATE ERROR:", err);
      setError(err instanceof Error ? err.message : "Unable to update maintenance status.");
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
    return status.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  const counts = {
    available: rooms.filter((room) => room.status === "available").length,
    occupied: rooms.filter((room) => room.status === "occupied").length,
    cleaning: rooms.filter((room) => room.status === "cleaning").length,
    maintenance: rooms.filter((room) => room.status === "maintenance").length,
  };

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Operations V2
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Rooms & Housekeeping</h1>
            <p className="mt-3 text-gray-400">
              Live room availability, occupancy, cleaning and maintenance controls.
            </p>
          </div>
          <button
            type="button"
            onClick={loadRooms}
            className="w-fit rounded-full border border-[#d4b16f]/40 px-5 py-2.5 text-sm font-semibold text-[#d4b16f]"
          >
            Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat label="Available" value={counts.available} tone="text-emerald-400" />
          <MiniStat label="Occupied" value={counts.occupied} tone="text-red-400" />
          <MiniStat label="Cleaning" value={counts.cleaning} tone="text-blue-400" />
          <MiniStat label="Maintenance" value={counts.maintenance} tone="text-gray-300" />
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

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No rooms found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-6 py-5">Room</th>
                    <th className="px-6 py-5">Type</th>
                    <th className="px-6 py-5">Capacity</th>
                    <th className="px-6 py-5">Price</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Operational Note</th>
                    <th className="px-6 py-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="border-b border-white/[0.06] transition hover:bg-white/[0.03]">
                      <td className="px-6 py-5 text-lg font-bold">{room.room_number}</td>
                      <td className="px-6 py-5">{room.room_type}</td>
                      <td className="px-6 py-5">{room.capacity}</td>
                      <td className="px-6 py-5">R{Number(room.price).toLocaleString("en-ZA")}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${statusColor(room.status)}`}>
                          {formatStatus(room.status)}
                        </span>
                      </td>
                      <td className="max-w-xs px-6 py-5 text-sm text-gray-400">
                        {room.status === "maintenance"
                          ? room.maintenance_note || "Maintenance"
                          : room.status === "cleaning"
                            ? "Awaiting housekeeping sign-off"
                            : room.status === "occupied"
                              ? "Guest in room"
                              : "Ready for sale"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {room.status === "cleaning" ? (
                            <button
                              type="button"
                              disabled={updatingRoom === room.id}
                              onClick={() => markRoomCleaned(room.id)}
                              className="rounded-full bg-[#d4b16f] px-4 py-2 text-xs font-semibold text-black disabled:opacity-50"
                            >
                              {updatingRoom === room.id ? "Updating..." : "Cleaned"}
                            </button>
                          ) : null}

                          {room.status === "maintenance" ? (
                            <button
                              type="button"
                              disabled={updatingRoom === room.id}
                              onClick={() => maintenanceAction(room, "finish")}
                              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black disabled:opacity-50"
                            >
                              Return to Service
                            </button>
                          ) : room.status === "available" || room.status === "reserved" ? (
                            <button
                              type="button"
                              disabled={updatingRoom === room.id}
                              onClick={() => maintenanceAction(room, "start")}
                              className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-300 disabled:opacity-50"
                            >
                              Maintenance
                            </button>
                          ) : null}

                          {room.status === "occupied" ? (
                            <span className="text-xs text-red-400">Managed from Bookings</span>
                          ) : null}
                          {room.status === "available" ? (
                            <span className="self-center text-xs text-emerald-400">Ready</span>
                          ) : null}
                        </div>
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

function MiniStat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
