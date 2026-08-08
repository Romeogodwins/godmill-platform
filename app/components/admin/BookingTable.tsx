import type { BookingRecord } from "../../../lib/supabase-types";

interface BookingTableProps {
  bookings: BookingRecord[];
  onView?: (booking: BookingRecord) => void;
}

const statusClasses: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-300",
  Confirmed: "bg-emerald-500/15 text-emerald-300",
  "Checked In": "bg-sky-500/15 text-sky-300",
  "Checked Out": "bg-slate-500/15 text-slate-200",
  Cancelled: "bg-rose-500/15 text-rose-300",
};

function normalizeStatus(value: string | null | undefined) {
  const normalized = (value ?? "pending").toLowerCase();
  if (normalized === "checked in") return "Checked In";
  if (normalized === "checked out") return "Checked Out";
  if (normalized === "pending") return "Pending";
  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "cancelled") return "Cancelled";
  return value ?? "Pending";
}

export default function BookingTable({ bookings, onView }: BookingTableProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111111]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-gray-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Booking ID</th>
              <th className="px-4 py-3 font-semibold">Guest Name</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Room</th>
              <th className="px-4 py-3 font-semibold">Check-in</th>
              <th className="px-4 py-3 font-semibold">Check-out</th>
              <th className="px-4 py-3 font-semibold">Guests</th>
              <th className="px-4 py-3 font-semibold">Breakfast</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-gray-200">
            {bookings.map((booking) => {
              const status = normalizeStatus(booking.status);
              const guests = booking.adults + booking.children;

              return (
                <tr key={booking.id} className="hover:bg-white/5">
                  <td className="px-4 py-4 font-semibold text-white">#{booking.id}</td>
                  <td className="px-4 py-4">{booking.guest_name}</td>
                  <td className="px-4 py-4">{booking.phone}</td>
                  <td className="px-4 py-4">{booking.room_type}</td>
                  <td className="px-4 py-4">{booking.check_in}</td>
                  <td className="px-4 py-4">{booking.check_out}</td>
                  <td className="px-4 py-4">{guests}</td>
                  <td className="px-4 py-4">{booking.breakfast ? "Yes" : "No"}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status] ?? "bg-white/10 text-white"}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onView?.(booking)}
                      className="rounded-full border border-[#d4b16f]/30 px-3 py-1 text-xs font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f]/10"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
