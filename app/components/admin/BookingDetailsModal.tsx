import type { BookingRecord, GuestRecord } from "../../../lib/supabase-types";

interface BookingDetailsModalProps {
  booking: (BookingRecord & { guest?: GuestRecord | null }) | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (bookingId: number, status: string) => void;
}

const statusOptions = ["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled"];

function normalizeStatus(value: string | null | undefined) {
  const normalized = (value ?? "pending").toLowerCase();
  if (normalized === "checked in") return "Checked In";
  if (normalized === "checked out") return "Checked Out";
  if (normalized === "pending") return "Pending";
  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "cancelled") return "Cancelled";
  return value ?? "Pending";
}

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export default function BookingDetailsModal({ booking, open, onClose, onStatusChange }: BookingDetailsModalProps) {
  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-black/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b16f]">Booking details</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{booking.booking_reference}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 px-3 py-2 text-sm text-gray-300">Close</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Guest</p>
            <p className="mt-2 font-semibold text-white">{booking.guest_name}</p>
            <p className="mt-1 text-sm text-gray-300">{booking.email}</p>
            <p className="mt-1 text-sm text-gray-300">{booking.phone}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Stay</p>
            <p className="mt-2 font-semibold text-white">{booking.room_type}</p>
            <p className="mt-1 text-sm text-gray-300">{booking.aircon ? "Aircon" : "Non-Aircon"}</p>
            <p className="mt-1 text-sm text-gray-300">{booking.nights} night{booking.nights === 1 ? "" : "s"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Booking info</p>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              <div className="flex justify-between"><span>Check-in</span><span className="font-semibold text-white">{booking.check_in}</span></div>
              <div className="flex justify-between"><span>Check-out</span><span className="font-semibold text-white">{booking.check_out}</span></div>
              <div className="flex justify-between"><span>Adults</span><span className="font-semibold text-white">{booking.adults}</span></div>
              <div className="flex justify-between"><span>Children</span><span className="font-semibold text-white">{booking.children}</span></div>
              <div className="flex justify-between"><span>Breakfast</span><span className="font-semibold text-white">{booking.breakfast ? "Yes" : "No"}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Payment</p>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              <div className="flex justify-between"><span>Room total</span><span className="font-semibold text-white">{formatCurrency(booking.room_total)}</span></div>
              <div className="flex justify-between"><span>Breakfast total</span><span className="font-semibold text-white">{formatCurrency(booking.breakfast_total)}</span></div>
              <div className="flex justify-between"><span>Grand total</span><span className="font-semibold text-white">{formatCurrency(booking.grand_total)}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Status</p>
              <p className="mt-1 font-semibold text-white">{normalizeStatus(booking.status)}</p>
            </div>
            <select
              value={normalizeStatus(booking.status)}
              onChange={(event) => onStatusChange(booking.id, event.target.value)}
              className="rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
