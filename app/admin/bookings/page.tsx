"use client";

import { useEffect, useState } from "react";

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  status: string;
  payment_status: string | null;
  proof_of_payment_url: string | null;
  proof_uploaded_at: string | null;
}

interface Booking {
  id: string;
  booking_reference: string;
  guest_name: string;
  phone: string;
  email: string;
  room_id: string | null;
  room_type: string;
  aircon: boolean;
  adults: number;
  children: number;
  breakfast: boolean;
  check_in: string;
  check_out: string;
  nights: number;
  room_total: number;
  breakfast_total: number;
  grand_total: number;
  special_requests: string;
  status: string;
  payment_status: string | null;
  proof_of_payment_url: string | null;
  proof_uploaded_at: string | null;
  created_at: string;
  rooms: Room | null;
}

type BookingAction =
  | "confirm"
  | "check-in"
  | "check-out"
  | "cancel";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/bookings", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load bookings."
        );
      }

      setBookings(result.bookings ?? []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleAction(
    booking: Booking,
    action: BookingAction
  ) {
    const actionNames: Record<BookingAction, string> = {
      confirm: "confirm",
      "check-in": "check in",
      "check-out": "check out",
      cancel: "cancel",
    };

    if (
      action === "cancel" &&
      !window.confirm(
        `Cancel booking ${booking.booking_reference}?`
      )
    ) {
      return;
    }

    try {
      setUpdatingId(booking.id);
      setMessage("");
      setError("");

      const response = await fetch(
        "/api/admin/bookings/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.id,
            action,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to ${actionNames[action]} booking.`
        );
      }

      setMessage(
        `${booking.booking_reference} updated successfully.`
      );

      await loadBookings();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update booking."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handlePaymentAction(
    booking: Booking,
    action: "view-proof" | "verify"
  ) {
    try {
      setUpdatingId(booking.id);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/admin/bookings/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.id,
            action,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to process payment."
        );
      }

      if (action === "view-proof") {
        if (!result.url) {
          throw new Error(
            "Proof of payment URL was not returned."
          );
        }

        window.open(
          result.url,
          "_blank",
          "noopener,noreferrer"
        );

        return;
      }

      setMessage(
        result.message ||
          "Payment verified successfully."
      );

      await loadBookings();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to process payment."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function renderPayment(booking: Booking) {
    const working = updatingId === booking.id;

    if (booking.payment_status === "verified") {
      return (
        <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
          Payment Verified
        </span>
      );
    }

    if (
      booking.payment_status === "proof_received" &&
      booking.proof_of_payment_url
    ) {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={working}
            onClick={() =>
              handlePaymentAction(
                booking,
                "view-proof"
              )
            }
            className="rounded-full border border-[#d4b16f]/40 px-3 py-2 text-xs font-semibold text-[#d4b16f] disabled:opacity-50"
          >
            View Proof
          </button>

          <button
            type="button"
            disabled={working}
            onClick={() =>
              handlePaymentAction(
                booking,
                "verify"
              )
            }
            className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-black disabled:opacity-50"
          >
            {working
              ? "Updating..."
              : "Verify Payment"}
          </button>
        </div>
      );
    }

    return (
      <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
        Awaiting Payment
      </span>
    );
  }
  function statusStyle(status: string) {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "border-blue-500/30 bg-blue-500/15 text-blue-400";

      case "checked-in":
      case "occupied":
        return "border-emerald-500/30 bg-emerald-500/15 text-emerald-400";

      case "checked-out":
      case "completed":
        return "border-gray-500/30 bg-gray-500/15 text-gray-300";

      case "cancelled":
        return "border-red-500/30 bg-red-500/15 text-red-400";

      default:
        return "border-amber-500/30 bg-amber-500/15 text-amber-400";
    }
  }

  function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(Number(amount || 0));
  }

  function formatDate(date: string) {
    if (!date) {
      return "—";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getLocalDateString() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function canCheckIn(booking: Booking) {
    return getLocalDateString() >= booking.check_in;
  }

  function renderActions(booking: Booking) {
    const working = updatingId === booking.id;

    if (!booking.room_id) {
      return (
        <span className="text-xs text-amber-400">
          Room not assigned
        </span>
      );
    }

    if (booking.status === "pending") {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={working}
            onClick={() =>
              handleAction(booking, "confirm")
            }
            className="rounded-full bg-[#d4b16f] px-4 py-2 text-xs font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {working ? "Updating..." : "Confirm"}
          </button>

          <button
            type="button"
            disabled={working}
            onClick={() =>
              handleAction(booking, "cancel")
            }
            className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      );
    }

    if (booking.status === "confirmed") {
      const checkInAllowed = canCheckIn(booking);

      return (
        <div className="flex flex-wrap items-center gap-2">
          {checkInAllowed ? (
            <button
              type="button"
              disabled={working}
              onClick={() =>
                handleAction(booking, "check-in")
              }
              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {working ? "Updating..." : "Check In"}
            </button>
          ) : (
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">
              Check-in available {formatDate(booking.check_in)}
            </span>
          )}

          <button
            type="button"
            disabled={working}
            onClick={() =>
              handleAction(booking, "cancel")
            }
            className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      );
    }

    if (booking.status === "checked-in") {
      return (
        <button
          type="button"
          disabled={working}
          onClick={() =>
            handleAction(booking, "check-out")
          }
          className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {working ? "Updating..." : "Check Out"}
        </button>
      );
    }

    if (booking.status === "checked-out") {
      return (
        <span className="text-xs text-gray-400">
          Awaiting cleaning
        </span>
      );
    }

    if (booking.status === "cancelled") {
      return (
        <span className="text-xs text-red-400">
          Cancelled
        </span>
      );
    }

    return (
      <span className="text-xs text-gray-500">
        No action
      </span>
    );
  }

  const totalValue = bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce(
      (total, booking) =>
        total + Number(booking.grand_total || 0),
      0
    );

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Hotel Management
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Bookings Management
            </h1>

            <p className="mt-3 text-gray-400">
              View and manage all guest reservations.
            </p>
          </div>

          <a
            href="/booking"
            className="inline-flex items-center justify-center rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:opacity-90"
          >
            + New Booking
          </a>
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

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
            <p className="text-sm text-gray-400">
              Total Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-[#d4b16f]">
              {bookings.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
            <p className="text-sm text-gray-400">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-400">
              {
                bookings.filter(
                  (booking) =>
                    booking.status === "pending"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
            <p className="text-sm text-gray-400">
              Assigned Rooms
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {
                bookings.filter(
                  (booking) => booking.room_id
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
            <p className="text-sm text-gray-400">
              Booking Value
            </p>

            <p className="mt-2 text-2xl font-bold text-[#d4b16f]">
              {formatMoney(totalValue)}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1550px]">
                <thead className="border-b border-white/10 bg-white/[0.02]">
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
                      Stay
                    </th>

                    <th className="px-6 py-5">
                      Guests
                    </th>

                    <th className="px-6 py-5">
                      Total
                    </th>

                    <th className="px-6 py-5">
                      Status
                    </th>

                    <th className="px-6 py-5">
                      Payment
                    </th>

                    <th className="px-6 py-5">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-white/[0.06] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#d4b16f]">
                          {booking.booking_reference}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {booking.nights}{" "}
                          {booking.nights === 1
                            ? "night"
                            : "nights"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium">
                          {booking.guest_name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {booking.phone}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {booking.rooms ? (
                          <>
                            <p className="font-semibold">
                              {booking.rooms.room_number}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {booking.room_type}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-amber-400">
                              Unassigned
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {booking.room_type}
                            </p>
                          </>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        <p>
                          {formatDate(
                            booking.check_in
                          )}
                        </p>

                        <p className="mt-1 text-gray-500">
                          to{" "}
                          {formatDate(
                            booking.check_out
                          )}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p>
                          {booking.adults} adult
                          {booking.adults !== 1
                            ? "s"
                            : ""}
                        </p>

                        {booking.children > 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            {booking.children} child
                            {booking.children !== 1
                              ? "ren"
                              : ""}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {formatMoney(
                          booking.grand_total
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {renderPayment(booking)}
                      </td>

                      <td className="px-6 py-5">
                        {renderActions(booking)}
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