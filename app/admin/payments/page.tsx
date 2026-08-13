"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  payment_reference: string | null;
  notes: string | null;
  payment_date: string;
}

interface Booking {
  id: string;
  booking_reference: string;
  guest_name: string;
  phone: string;
  email: string;
  room_type: string;
  room_id: string | null;
  check_in: string;
  check_out: string;
  grand_total: number;
  status: string;

  rooms: {
    room_number: string;
  } | null;

  total_paid: number;
  balance: number;
  payment_status: string;
  payments: Payment[];
}

interface Summary {
  totalCharged: number;
  totalPaid: number;
  totalOutstanding: number;
  paidBookings: number;
  partiallyPaidBookings: number;
  unpaidBookings: number;
}

interface PaymentsResponse {
  success: boolean;
  summary: Summary;
  bookings: Booking[];
  payments: Payment[];
  message?: string;
}

function money(value: number) {
  return `R ${Number(value || 0).toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  return status
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function paymentStatusClass(status: string) {
  switch (status) {
    case "paid":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

    case "partially-paid":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";

    case "unpaid":
      return "border-red-500/30 bg-red-500/10 text-red-300";

    default:
      return "border-white/10 bg-white/5 text-gray-300";
  }
}

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentReference, setPaymentReference] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/payments", {
        cache: "no-store",
      });

      const result = (await response.json()) as PaymentsResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load payments."
        );
      }

      setData(result);
    } catch (err) {
      console.error("PAYMENTS LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const filteredBookings = useMemo(() => {
    if (!data) return [];

    const term = search.trim().toLowerCase();

    if (!term) return data.bookings;

    return data.bookings.filter((booking) => {
      return (
        booking.booking_reference
          .toLowerCase()
          .includes(term) ||
        booking.guest_name
          .toLowerCase()
          .includes(term) ||
        booking.phone
          ?.toLowerCase()
          .includes(term) ||
        booking.email
          ?.toLowerCase()
          .includes(term) ||
        booking.rooms?.room_number
          ?.toLowerCase()
          .includes(term)
      );
    });
  }, [data, search]);

  function openPayment(booking: Booking) {
    setSelectedBooking(booking);

    setAmount(
      booking.balance > 0
        ? booking.balance.toString()
        : ""
    );

    setPaymentMethod("cash");
    setPaymentReference("");
    setNotes("");
    setError("");
    setMessage("");
  }

  function closePayment() {
    setSelectedBooking(null);
    setAmount("");
    setPaymentReference("");
    setNotes("");
  }

  async function recordPayment() {
    if (!selectedBooking) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const numericAmount = Number(amount);

      if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
      ) {
        throw new Error(
          "Enter a valid payment amount."
        );
      }

      const response = await fetch(
        "/api/admin/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: selectedBooking.id,
            amount: numericAmount,
            paymentMethod,
            paymentReference,
            notes,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            "Unable to record payment."
        );
      }

      closePayment();

      setMessage(
        `Payment of ${money(
          numericAmount
        )} recorded successfully.`
      );

      await loadPayments();
    } catch (err) {
      console.error("PAYMENT SAVE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to record payment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function downloadReceiptPdf(payment: Payment) {
    if (!data) return;

    const booking = data.bookings.find(
      (item) => item.id === payment.booking_id
    );

    if (!booking) {
      setError("Unable to find the booking for this payment.");
      return;
    }

    try {
      setError("");

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const receiptNumber =
        `GCR-${payment.id.slice(0, 8).toUpperCase()}`;
      const room =
        booking.rooms?.room_number ?? "Unassigned";
      const paymentReferenceText =
        payment.payment_reference || "—";
      const notesText =
        payment.notes || "—";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("GODMILL", 105, 22, { align: "center" });

      doc.setFontSize(13);
      doc.text("Godmill City Guesthouse", 105, 31, {
        align: "center",
      });

      doc.setFontSize(16);
      doc.text("PAYMENT RECEIPT", 105, 44, {
        align: "center",
      });

      doc.setDrawColor(180);
      doc.line(20, 50, 190, 50);

      let y = 62;

      const row = (label: string, value: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(label, 20, y);

        doc.setFont("helvetica", "bold");
        doc.text(value, 190, y, { align: "right" });

        y += 10;
      };

      row("Receipt Number", receiptNumber);
      row("Booking Reference", booking.booking_reference);
      row("Guest", booking.guest_name);
      row("Room", `${room} - ${booking.room_type}`);
      row("Payment Date", formatDate(payment.payment_date));
      row(
        "Payment Method",
        formatStatus(payment.payment_method)
      );
      row("Payment Reference", paymentReferenceText);

      y += 5;
      doc.setFillColor(247, 244, 237);
      doc.rect(20, y, 170, 28, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("AMOUNT RECEIVED", 105, y + 9, {
        align: "center",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(money(payment.amount), 105, y + 21, {
        align: "center",
      });

      y += 40;

      row("Booking Total", money(booking.grand_total));
      row("Total Paid", money(booking.total_paid));
      row("Outstanding Balance", money(booking.balance));

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Notes", 20, y);

      const noteLines = doc.splitTextToSize(notesText, 110);
      doc.setFont("helvetica", "bold");
      doc.text(noteLines, 80, y);
      y += Math.max(10, noteLines.length * 6) + 10;

      doc.setDrawColor(220);
      doc.line(20, y, 190, y);

      y += 12;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Godmill City Guesthouse", 105, y, {
        align: "center",
      });

      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        "217 Khibitswane, Taung - Cokonyane Road near Boemma Waters",
        105,
        y,
        { align: "center" }
      );

      y += 6;
      doc.text("Tel: 079 058 2637", 105, y, {
        align: "center",
      });

      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text(
        "Thank you for choosing Godmill City Guesthouse.",
        105,
        y,
        { align: "center" }
      );

      doc.save(`${receiptNumber}-${booking.booking_reference}.pdf`);
    } catch (err) {
      console.error("PDF DOWNLOAD ERROR:", err);
      setError(
        "Unable to create the PDF. Make sure jsPDF is installed."
      );
    }
  }

  function sendReceiptWhatsApp(payment: Payment) {
    if (!data) return;

    const booking = data.bookings.find(
      (item) => item.id === payment.booking_id
    );

    if (!booking) {
      setError("Unable to find the booking for this payment.");
      return;
    }

    const receiptNumber =
      `GCR-${payment.id.slice(0, 8).toUpperCase()}`;

    let phone = (booking.phone || "").replace(/\D/g, "");

    if (phone.startsWith("0")) {
      phone = `27${phone.slice(1)}`;
    }

    if (!phone) {
      setError("No phone number is available for this guest.");
      return;
    }

    const message = [
      "GODMILL CITY GUESTHOUSE",
      "PAYMENT RECEIPT",
      "",
      `Receipt: ${receiptNumber}`,
      `Booking: ${booking.booking_reference}`,
      `Guest: ${booking.guest_name}`,
      `Amount received: ${money(payment.amount)}`,
      `Payment method: ${formatStatus(payment.payment_method)}`,
      `Payment date: ${formatDate(payment.payment_date)}`,
      `Total paid: ${money(booking.total_paid)}`,
      `Outstanding balance: ${money(booking.balance)}`,
      "",
      "Thank you for choosing Godmill City Guesthouse.",
      "Tel: 079 058 2637",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function printReceipt(payment: Payment) {
    if (!data) return;

    const booking = data.bookings.find(
      (item) => item.id === payment.booking_id
    );

    if (!booking) {
      setError("Unable to find the booking for this payment.");
      return;
    }

    const receiptWindow = window.open(
      "",
      "_blank",
      "width=800,height=900"
    );

    if (!receiptWindow) {
      setError(
        "The receipt window was blocked. Please allow pop-ups and try again."
      );
      return;
    }

    const room =
      booking.rooms?.room_number ?? "Unassigned";

    const paymentReferenceText =
      payment.payment_reference || "—";

    const notesText =
      payment.notes || "—";

    const receiptNumber =
      `GCR-${payment.id.slice(0, 8).toUpperCase()}`;

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${booking.booking_reference}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 40px;
              background: #ffffff;
              color: #111111;
              font-family: Arial, Helvetica, sans-serif;
            }
            .receipt {
              max-width: 720px;
              margin: 0 auto;
              border: 1px solid #dddddd;
              padding: 40px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #d4b16f;
              padding-bottom: 25px;
              margin-bottom: 30px;
            }
            .brand {
              margin: 0;
              color: #b58d45;
              font-size: 30px;
              font-weight: 800;
              letter-spacing: 2px;
            }
            .subtitle { margin-top: 7px; color: #555555; }
            .receipt-title {
              margin-top: 25px;
              font-size: 22px;
              font-weight: 700;
            }
            .row {
              display: flex;
              justify-content: space-between;
              gap: 30px;
              padding: 12px 0;
              border-bottom: 1px solid #eeeeee;
            }
            .label { color: #666666; }
            .value { text-align: right; font-weight: 600; }
            .amount-box {
              margin: 30px 0;
              padding: 25px;
              background: #f7f4ed;
              text-align: center;
            }
            .amount-label {
              color: #666666;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .amount {
              margin-top: 8px;
              font-size: 34px;
              font-weight: 800;
            }
            .footer {
              margin-top: 35px;
              padding-top: 20px;
              border-top: 1px solid #dddddd;
              text-align: center;
              color: #666666;
              font-size: 13px;
              line-height: 1.7;
            }
            .thank-you {
              margin-top: 20px;
              color: #b58d45;
              font-weight: 700;
            }
            @media print {
              body { padding: 0; }
              .receipt { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1 class="brand">GODMILL</h1>
              <div class="subtitle">Godmill City Guesthouse</div>
              <div class="receipt-title">PAYMENT RECEIPT</div>
            </div>

            <div class="row">
              <span class="label">Receipt Number</span>
              <span class="value">${receiptNumber}</span>
            </div>
            <div class="row">
              <span class="label">Booking Reference</span>
              <span class="value">${booking.booking_reference}</span>
            </div>
            <div class="row">
              <span class="label">Guest</span>
              <span class="value">${booking.guest_name}</span>
            </div>
            <div class="row">
              <span class="label">Room</span>
              <span class="value">${room} - ${booking.room_type}</span>
            </div>
            <div class="row">
              <span class="label">Payment Date</span>
              <span class="value">${formatDate(payment.payment_date)}</span>
            </div>
            <div class="row">
              <span class="label">Payment Method</span>
              <span class="value">${formatStatus(payment.payment_method)}</span>
            </div>
            <div class="row">
              <span class="label">Payment Reference</span>
              <span class="value">${paymentReferenceText}</span>
            </div>

            <div class="amount-box">
              <div class="amount-label">Amount Received</div>
              <div class="amount">${money(payment.amount)}</div>
            </div>

            <div class="row">
              <span class="label">Booking Total</span>
              <span class="value">${money(booking.grand_total)}</span>
            </div>
            <div class="row">
              <span class="label">Total Paid</span>
              <span class="value">${money(booking.total_paid)}</span>
            </div>
            <div class="row">
              <span class="label">Outstanding Balance</span>
              <span class="value">${money(booking.balance)}</span>
            </div>
            <div class="row">
              <span class="label">Notes</span>
              <span class="value">${notesText}</span>
            </div>

            <div class="footer">
              <strong>Godmill City Guesthouse</strong><br>
              217 Khibitswane, Taung - Cokonyane Road near Boemma Waters<br>
              Tel: 079 058 2637
              <div class="thank-you">
                Thank you for choosing Godmill City Guesthouse.
              </div>
            </div>
          </div>
          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    receiptWindow.document.close();
  }

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <p className="text-gray-400">
          Loading payments...
        </p>
      </main>
    );
  }

  const summary = data?.summary;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Hotel Management
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Payments
            </h1>

            <p className="mt-3 text-gray-400">
              Record guest payments and monitor outstanding balances.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPayments}
            className="rounded-full border border-[#d4b16f]/40 px-6 py-3 font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f] hover:text-black"
          >
            Refresh
          </button>
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

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
            <p className="text-gray-400">
              Total Charged
            </p>

            <p className="mt-4 text-4xl font-bold text-[#d4b16f]">
              {money(summary?.totalCharged ?? 0)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Total booking value
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
            <p className="text-gray-400">
              Payments Received
            </p>

            <p className="mt-4 text-4xl font-bold text-emerald-400">
              {money(summary?.totalPaid ?? 0)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Actual money recorded
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121212] p-7">
            <p className="text-gray-400">
              Outstanding
            </p>

            <p className="mt-4 text-4xl font-bold text-red-400">
              {money(summary?.totalOutstanding ?? 0)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Amount still due
            </p>
          </div>

        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
            <p className="text-sm text-gray-400">
              Paid Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {summary?.paidBookings ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
            <p className="text-sm text-gray-400">
              Partially Paid
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-400">
              {summary?.partiallyPaidBookings ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
            <p className="text-sm text-gray-400">
              Unpaid
            </p>

            <p className="mt-2 text-3xl font-bold text-red-400">
              {summary?.unpaidBookings ?? 0}
            </p>
          </div>

        </div>

        <div className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search reference, guest, phone, email or room..."
            className="w-full rounded-2xl border border-white/10 bg-[#121212] px-5 py-4 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">

          <div className="border-b border-white/10 p-7">
            <h2 className="text-2xl font-bold">
              Booking Balances
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Record deposits, instalments and final payments.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">

              <thead className="bg-black/40">
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
                    Charged
                  </th>

                  <th className="px-6 py-5">
                    Paid
                  </th>

                  <th className="px-6 py-5">
                    Balance
                  </th>

                  <th className="px-6 py-5">
                    Payment Status
                  </th>

                  <th className="px-6 py-5">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-t border-white/[0.06]"
                  >
                    <td className="px-6 py-5 font-semibold text-[#d4b16f]">
                      {booking.booking_reference}
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold">
                        {booking.guest_name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {booking.phone}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p>
                        {booking.rooms?.room_number ??
                          "Unassigned"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {booking.room_type}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      {money(booking.grand_total)}
                    </td>

                    <td className="px-6 py-5 font-semibold text-emerald-400">
                      {money(booking.total_paid)}
                    </td>

                    <td className="px-6 py-5 font-bold text-red-400">
                      {money(booking.balance)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${paymentStatusClass(
                          booking.payment_status
                        )}`}
                      >
                        {formatStatus(
                          booking.payment_status
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {booking.balance > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            openPayment(booking)
                          }
                          className="rounded-full bg-[#d4b16f] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="font-semibold text-emerald-400">
                          Paid in Full
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-12 text-center text-gray-500"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">

            <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111111] shadow-2xl">

              <div className="flex items-start justify-between border-b border-white/10 p-6">

                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#d4b16f]">
                    Record Payment
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {selectedBooking.guest_name}
                  </h2>

                  <p className="mt-2 text-gray-400">
                    {selectedBooking.booking_reference}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePayment}
                  disabled={saving}
                  className="rounded-full border border-white/10 px-4 py-2 text-gray-300 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="p-6">

                <div className="grid gap-4 sm:grid-cols-3">

                  <div className="rounded-2xl bg-black p-4">
                    <p className="text-xs text-gray-500">
                      Charged
                    </p>

                    <p className="mt-2 font-bold">
                      {money(
                        selectedBooking.grand_total
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black p-4">
                    <p className="text-xs text-gray-500">
                      Paid
                    </p>

                    <p className="mt-2 font-bold text-emerald-400">
                      {money(
                        selectedBooking.total_paid
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black p-4">
                    <p className="text-xs text-gray-500">
                      Balance
                    </p>

                    <p className="mt-2 font-bold text-red-400">
                      {money(
                        selectedBooking.balance
                      )}
                    </p>
                  </div>

                </div>

                <div className="mt-6 space-y-5">

                  <label className="block text-sm text-gray-300">
                    Amount

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4b16f]">
                        R
                      </span>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        max={selectedBooking.balance}
                        value={amount}
                        onChange={(event) =>
                          setAmount(event.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black py-3 pl-9 pr-4 outline-none focus:border-[#d4b16f]"
                      />
                    </div>
                  </label>

                  <label className="block text-sm text-gray-300">
                    Payment Method

                    <select
                      value={paymentMethod}
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#d4b16f]"
                    >
                      <option value="cash">
                        Cash
                      </option>

                      <option value="card">
                        Card
                      </option>

                      <option value="eft">
                        EFT
                      </option>

                      <option value="bank-transfer">
                        Bank Transfer
                      </option>

                      <option value="other">
                        Other
                      </option>
                    </select>
                  </label>

                  <label className="block text-sm text-gray-300">
                    Payment Reference

                    <input
                      value={paymentReference}
                      onChange={(event) =>
                        setPaymentReference(
                          event.target.value
                        )
                      }
                      placeholder="Optional reference"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
                    />
                  </label>

                  <label className="block text-sm text-gray-300">
                    Notes

                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(event) =>
                        setNotes(event.target.value)
                      }
                      placeholder="Optional payment notes"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
                    />
                  </label>

                </div>

                <div className="mt-7 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={closePayment}
                    disabled={saving}
                    className="rounded-full border border-white/10 px-6 py-3 font-semibold text-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={recordPayment}
                    disabled={saving}
                    className="rounded-full bg-[#d4b16f] px-7 py-3 font-semibold text-black disabled:opacity-50"
                  >
                    {saving
                      ? "Recording..."
                      : "Record Payment"}
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}

        {data && data.payments.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">

            <div className="border-b border-white/10 p-7">
              <h2 className="text-2xl font-bold">
                Payment History
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">

                <thead className="bg-black/40">
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-6 py-5">
                      Date
                    </th>

                    <th className="px-6 py-5">
                      Amount
                    </th>

                    <th className="px-6 py-5">
                      Method
                    </th>

                    <th className="px-6 py-5">
                      Reference
                    </th>

                    <th className="px-6 py-5">
                      Notes
                    </th>

                    <th className="px-6 py-5">
                      Receipt
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-t border-white/[0.06]"
                    >
                      <td className="px-6 py-5">
                        {formatDate(
                          payment.payment_date
                        )}
                      </td>

                      <td className="px-6 py-5 font-bold text-emerald-400">
                        {money(payment.amount)}
                      </td>

                      <td className="px-6 py-5">
                        {formatStatus(
                          payment.payment_method
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {payment.payment_reference ||
                          "—"}
                      </td>

                      <td className="px-6 py-5 text-gray-400">
                        {payment.notes || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => downloadReceiptPdf(payment)}
                            className="whitespace-nowrap rounded-full bg-[#d4b16f] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                          >
                            Download PDF
                          </button>

                          <button
                            type="button"
                            onClick={() => printReceipt(payment)}
                            className="whitespace-nowrap rounded-full border border-[#d4b16f]/40 px-4 py-2 text-sm font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f] hover:text-black"
                          >
                            Print Receipt
                          </button>

                          <button
                            type="button"
                            onClick={() => sendReceiptWhatsApp(payment)}
                            className="whitespace-nowrap rounded-full border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500 hover:text-black"
                          >
                            WhatsApp Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}