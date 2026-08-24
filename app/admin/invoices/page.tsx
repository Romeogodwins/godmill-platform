"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

interface Payment {
  id?: string;
  booking_id?: string;
  amount?: number;
  payment_amount?: number;
  status?: string;
}

interface Booking {
  id: string;
  booking_reference: string;
  guest_name: string;
  phone: string;
  email: string;
  room_id: string | null;
  room_type: string;
  aircon: boolean | null;
  adults: number;
  children: number;
  breakfast: boolean | null;
  check_in: string;
  check_out: string;
  nights: number;
  room_total: number;
  breakfast_total: number;
  grand_total: number;
  special_requests: string | null;
  status: string;
  created_at: string;
  rooms: {
    id: string;
    room_number: string;
    room_type: string;
    status: string;
  } | null;
  payments?: Payment[];
}

interface BookingsResponse {
  success: boolean;
  bookings: Booking[];
  message?: string;
}

interface PaymentsResponse {
  success?: boolean;
  payments?: Payment[];
  message?: string;
}

function money(value: number) {
  return `R ${Number(value || 0).toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function dateText(value: string) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function invoiceNumber(booking: Booking) {
  const date = new Date(booking.created_at);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `INV-${y}${m}${d}-${booking.booking_reference.replace(/^GM[CM]-/, "")}`;
}

function paymentAmount(payment: Payment) {
  return Number(payment.amount ?? payment.payment_amount ?? 0);
}

function paidForBooking(booking: Booking, allPayments: Payment[]) {
  const nestedPayments = Array.isArray(booking.payments) ? booking.payments : [];

  if (nestedPayments.length > 0) {
    return nestedPayments.reduce((sum, payment) => sum + paymentAmount(payment), 0);
  }

  return allPayments
    .filter((payment) => payment.booking_id === booking.id)
    .reduce((sum, payment) => sum + paymentAmount(payment), 0);
}

function paymentState(total: number, paid: number) {
  const balance = Math.max(0, Number(total || 0) - Number(paid || 0));

  if (paid >= total && total > 0) {
    return { label: "Paid", balance };
  }

  if (paid > 0) {
    return { label: "Partially Paid", balance };
  }

  return { label: "Unpaid", balance };
}

export default function InvoicesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [bookingsResponse, paymentsResponse] = await Promise.all([
        fetch("/api/admin/bookings", { cache: "no-store" }),
        fetch("/api/admin/payments", { cache: "no-store" }),
      ]);

      const bookingsResult =
        (await bookingsResponse.json()) as BookingsResponse;

      if (!bookingsResponse.ok || !bookingsResult.success) {
        throw new Error(
          bookingsResult.message || "Unable to load bookings."
        );
      }

      setBookings(bookingsResult.bookings ?? []);

      if (paymentsResponse.ok) {
        const paymentsResult =
          (await paymentsResponse.json()) as PaymentsResponse | Payment[];

        if (Array.isArray(paymentsResult)) {
          setPayments(paymentsResult);
        } else {
          setPayments(
            Array.isArray(paymentsResult.payments)
              ? paymentsResult.payments
              : []
          );
        }
      } else {
        setPayments([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load invoices."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return bookings;

    return bookings.filter((booking) =>
      [
        booking.booking_reference,
        booking.guest_name,
        booking.phone,
        booking.email,
        booking.room_type,
        booking.rooms?.room_number ?? "",
      ].some((value) => value?.toLowerCase().includes(term))
    );
  }, [bookings, search]);

  function getFinancials(booking: Booking) {
    const paid = paidForBooking(booking, payments);
    const state = paymentState(booking.grand_total, paid);

    return {
      paid,
      balance: state.balance,
      paymentStatus: state.label,
    };
  }

  async function downloadPdf(booking: Booking) {
    const doc = new jsPDF();
    const inv = invoiceNumber(booking);
    const room = booking.rooms?.room_number ?? "Unassigned";
    const financials = getFinancials(booking);

    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, 210, 43, "F");

    try {
      const response = await fetch("/logo.png");
      if (!response.ok) throw new Error(`Logo request failed: ${response.status}`);

      const blob = await response.blob();
      const logoData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const format =
        blob.type === "image/jpeg" || blob.type === "image/jpg" ? "JPEG" : "PNG";

      doc.addImage(logoData, format, 18, 8, 42, 24);
    } catch (error) {
      console.error("Unable to load Godmill logo:", error);
      doc.setTextColor(212, 177, 111);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("GODMILL", 18, 22);
    }

    doc.setTextColor(212, 177, 111);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("GODMILL CITY GUESTHOUSE", 190, 14, { align: "right" });

    doc.setTextColor(235, 235, 235);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("217 Khibitswane, Taung", 190, 21, { align: "right" });
    doc.text("Cokonyane Road near Boemma Waters", 190, 27, { align: "right" });
    doc.text("Tel: 079 058 2637", 190, 33, { align: "right" });

    doc.setFillColor(212, 177, 111);
    doc.rect(0, 43, 210, 2, "F");

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("INVOICE", 20, 60);

    const watermark =
      financials.paymentStatus === "Paid"
        ? "PAID"
        : financials.paymentStatus === "Partially Paid"
          ? "PARTIALLY PAID"
          : "UNPAID";

    doc.setTextColor(225, 225, 225);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(watermark === "PARTIALLY PAID" ? 28 : 38);
    doc.text(watermark, 105, 155, { align: "center", angle: 35 });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(95, 95, 95);
    doc.text(`Invoice No: ${inv}`, 190, 53, { align: "right" });
    doc.text(`Booking Ref: ${booking.booking_reference}`, 190, 59, {
      align: "right",
    });
    doc.text(
      `Issued: ${new Date().toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`,
      190,
      65,
      { align: "right" }
    );

    doc.setDrawColor(220);
    doc.line(20, 72, 190, 72);

    let y = 82;

    const sectionHeading = (title: string) => {
      doc.setFillColor(247, 244, 237);
      doc.roundedRect(20, y - 5, 170, 10, 2, 2, "F");
      doc.setTextColor(181, 141, 69);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(title, 24, y + 1.5);
      y += 12;
    };

    const row = (label: string, value: string) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9.5);
      doc.text(label, 22, y);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 25, 25);
      doc.text(value || "-", 188, y, { align: "right" });
      y += 7;
    };

    sectionHeading("GUEST & BOOKING DETAILS");
    row("Guest", booking.guest_name);
    row("Phone", booking.phone || "-");
    row("Email", booking.email || "-");
    row("Room", `${room} - ${booking.room_type}`);
    row("Check-in", dateText(booking.check_in));
    row("Check-out", dateText(booking.check_out));
    row("Nights", String(booking.nights));

    y += 3;
    sectionHeading("INVOICE SUMMARY");
    row("Accommodation", money(booking.room_total));
    row("Breakfast", money(booking.breakfast_total));
    row("Total Charged", money(booking.grand_total));
    row("Amount Paid", money(financials.paid));
    row("Balance Due", money(financials.balance));
    row("Payment Status", financials.paymentStatus.toUpperCase());

    y += 3;
    doc.setFillColor(247, 244, 237);
    doc.roundedRect(20, y, 170, 21, 3, 3, "F");

    doc.setTextColor(181, 141, 69);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      financials.balance === 0 ? "PAID IN FULL" : "BALANCE DUE",
      28,
      y + 13
    );

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(17);
    doc.text(money(financials.balance), 182, y + 13, { align: "right" });

    y += 31;
    sectionHeading("BANKING DETAILS");

    doc.setFont("helvetica", "normal");
    doc.setTextColor(45, 45, 45);
    doc.setFontSize(9.5);
    doc.text("Bank: FNB", 22, y);
    doc.text("Account Name: Godmill", 108, y);

    y += 7;
    doc.text("Account Number: 62836688616", 22, y);
    doc.text("Account Type: Current", 108, y);

    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text(
      `Payment Reference: ${inv}`,
      22,
      y
    );

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(45, 45, 45);
    doc.text("Secure card payment: pay.yoco.com/godmillcity", 22, y);

    doc.setDrawColor(212, 177, 111);
    doc.line(20, 274, 190, 274);

    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Godmill City Guesthouse | 217 Khibitswane, Taung | Tel: 079 058 2637",
      105,
      281,
      { align: "center" }
    );
    doc.text(
      "Thank you for choosing Godmill City Guesthouse.",
      105,
      286,
      { align: "center" }
    );

    doc.save(`${inv}.pdf`);
  }

  function printInvoice(booking: Booking) {
    const inv = invoiceNumber(booking);
    const room = booking.rooms?.room_number ?? "Unassigned";
    const financials = getFinancials(booking);
    const w = window.open("", "_blank", "width=850,height=900");

    if (!w) {
      setError("Please allow pop-ups to print the invoice.");
      return;
    }

    w.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${inv}</title>
        <style>
          *{box-sizing:border-box}
          body{font-family:Arial,sans-serif;margin:0;padding:30px;background:#f4f4f4;color:#111}
          .invoice{position:relative;max-width:800px;margin:auto;background:#fff;border:1px solid #ddd;overflow:hidden}
          .letterhead{background:#111;color:#fff;padding:24px 30px;border-bottom:5px solid #d4b16f;display:flex;align-items:center;justify-content:space-between;gap:30px}
          .brand{color:#d4b16f;font-size:26px;font-weight:800;letter-spacing:2px}
          .business{text-align:right;line-height:1.6;font-size:13px}
          .business strong{display:block;color:#d4b16f;font-size:17px;letter-spacing:1px}
          .content{padding:32px}
          .title-row{display:flex;justify-content:space-between;gap:30px;align-items:flex-start;border-bottom:1px solid #ddd;padding-bottom:20px}
          h1{font-size:30px;margin:0}
          .meta{text-align:right;color:#666;font-size:13px;line-height:1.7}
          .section-title{margin-top:24px;background:#f7f4ed;color:#b58d45;font-weight:800;padding:10px 12px;border-radius:8px;font-size:13px;letter-spacing:1px}
          .row{display:flex;justify-content:space-between;gap:25px;padding:9px 3px;border-bottom:1px solid #eee;font-size:14px}
          .label{color:#666}.value{font-weight:700;text-align:right}
          .total{margin-top:22px;padding:20px;background:#f7f4ed;border-radius:10px;font-size:21px;font-weight:800;display:flex;justify-content:space-between}
          .total span:first-child{color:#b58d45}
          .watermark{position:absolute;top:43%;left:50%;transform:translate(-50%,-50%) rotate(-32deg);font-size:64px;font-weight:900;color:rgba(0,0,0,.06);white-space:nowrap;pointer-events:none}.footer{text-align:center;color:#666;font-size:12px;line-height:1.7;margin-top:35px;padding-top:18px;border-top:2px solid #d4b16f}
          @media print{
            body{padding:0;background:#fff}
            .invoice{border:none}
            .letterhead,.section-title,.total{-webkit-print-color-adjust:exact;print-color-adjust:exact}
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="watermark">${financials.paymentStatus.toUpperCase()}</div>
          <div class="letterhead">
            <div class="brand">GODMILL</div>
            <div class="business">
              <strong>GODMILL CITY GUESTHOUSE</strong>
              217 Khibitswane, Taung<br>
              Cokonyane Road near Boemma Waters<br>
              Tel: 079 058 2637
            </div>
          </div>

          <div class="content">
            <div class="title-row">
              <h1>INVOICE</h1>
              <div class="meta">
                <strong>Invoice No:</strong> ${inv}<br>
                <strong>Booking Ref:</strong> ${booking.booking_reference}<br>
                <strong>Issued:</strong> ${new Date().toLocaleDateString("en-ZA")}
              </div>
            </div>

            <div class="section-title">GUEST &amp; BOOKING DETAILS</div>
            <div class="row"><span class="label">Guest</span><span class="value">${booking.guest_name}</span></div>
            <div class="row"><span class="label">Phone</span><span class="value">${booking.phone || "-"}</span></div>
            <div class="row"><span class="label">Email</span><span class="value">${booking.email || "-"}</span></div>
            <div class="row"><span class="label">Room</span><span class="value">${room} - ${booking.room_type}</span></div>
            <div class="row"><span class="label">Stay</span><span class="value">${dateText(booking.check_in)} - ${dateText(booking.check_out)}</span></div>
            <div class="row"><span class="label">Nights</span><span class="value">${booking.nights}</span></div>

            <div class="section-title">INVOICE SUMMARY</div>
            <div class="row"><span class="label">Accommodation</span><span class="value">${money(booking.room_total)}</span></div>
            <div class="row"><span class="label">Breakfast</span><span class="value">${money(booking.breakfast_total)}</span></div>
            <div class="row"><span class="label">Total Charged</span><span class="value">${money(booking.grand_total)}</span></div>
            <div class="row"><span class="label">Amount Paid</span><span class="value">${money(financials.paid)}</span></div>
            <div class="row"><span class="label">Balance Due</span><span class="value">${money(financials.balance)}</span></div>
            <div class="row"><span class="label">Payment Status</span><span class="value">${financials.paymentStatus}</span></div>

            <div class="total">
              <span>${financials.balance === 0 ? "PAID IN FULL" : "BALANCE DUE"}</span>
              <span>${money(financials.balance)}</span>
            </div>

            <div class="section-title">BANKING DETAILS</div>
            <div class="row"><span class="label">Bank</span><span class="value">FNB</span></div>
            <div class="row"><span class="label">Account Name</span><span class="value">Godmill</span></div>
            <div class="row"><span class="label">Account Number</span><span class="value">62836688616</span></div>
            <div class="row"><span class="label">Account Type</span><span class="value">Current</span></div>
            <div class="row"><span class="label">Payment Reference</span><span class="value">${inv}</span></div>
            <div class="row"><span class="label">Secure Card Payment</span><span class="value">pay.yoco.com/godmillcity</span></div>

            <div class="footer">
              <strong>Godmill City Guesthouse</strong><br>
              217 Khibitswane, Taung - Cokonyane Road near Boemma Waters<br>
              Tel: 079 058 2637<br>
              Thank you for choosing Godmill City Guesthouse.
            </div>
          </div>
        </div>
        <script>window.onload=()=>window.print();</script>
      </body>
      </html>
    `);

    w.document.close();
  }

  function whatsappInvoice(booking: Booking) {
    let phone = (booking.phone || "").replace(/\D/g, "");
    if (phone.startsWith("0")) phone = `27${phone.slice(1)}`;

    if (!phone) {
      setError("This booking has no guest phone number.");
      return;
    }

    const financials = getFinancials(booking);

    const message = [
      "GODMILL CITY GUESTHOUSE",
      "INVOICE",
      "",
      `Invoice: ${invoiceNumber(booking)}`,
      `Booking: ${booking.booking_reference}`,
      `Guest: ${booking.guest_name}`,
      `Check-in: ${dateText(booking.check_in)}`,
      `Check-out: ${dateText(booking.check_out)}`,
      `Nights: ${booking.nights}`,
      `Accommodation: ${money(booking.room_total)}`,
      `Breakfast: ${money(booking.breakfast_total)}`,
      `TOTAL CHARGED: ${money(booking.grand_total)}`,
      `AMOUNT PAID: ${money(financials.paid)}`,
      `BALANCE DUE: ${money(financials.balance)}`,
      `PAYMENT STATUS: ${financials.paymentStatus.toUpperCase()}`,
      "",
      `Payment reference: ${invoiceNumber(booking)}`,
      "Secure card payment: https://pay.yoco.com/godmillcity",
      "",
      "Tel: 079 058 2637",
      "Godmill City Guesthouse",
    ].join("\n");

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (loading && bookings.length === 0) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <p className="text-gray-400">Loading invoices...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Hotel Management
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Invoices
            </h1>
            <p className="mt-3 text-gray-400">
              Create, download, print and send booking invoices.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="rounded-full border border-[#d4b16f]/40 px-6 py-3 font-semibold text-[#d4b16f]"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking, guest, phone, email or room..."
            className="w-full rounded-2xl border border-white/10 bg-[#121212] px-5 py-4 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
          <div className="border-b border-white/10 p-7">
            <h2 className="text-2xl font-bold">Booking Invoices</h2>
            <p className="mt-2 text-sm text-gray-500">
              {filtered.length} booking invoice
              {filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-black/40 text-left text-sm text-gray-400">
                <tr>
                  <th className="px-5 py-5">Invoice</th>
                  <th className="px-5 py-5">Guest</th>
                  <th className="px-5 py-5">Room</th>
                  <th className="px-5 py-5">Stay</th>
                  <th className="px-5 py-5">Total</th>
                  <th className="px-5 py-5">Paid</th>
                  <th className="px-5 py-5">Balance</th>
                  <th className="px-5 py-5">Status</th>
                  <th className="px-5 py-5">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((booking) => {
                  const financials = getFinancials(booking);

                  return (
                    <tr
                      key={booking.id}
                      className="border-t border-white/[0.06]"
                    >
                      <td className="px-5 py-5">
                        <p className="font-semibold text-[#d4b16f]">
                          {invoiceNumber(booking)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.booking_reference}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-semibold">
                          {booking.guest_name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.phone}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p>
                          {booking.rooms?.room_number ?? "Unassigned"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.room_type}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm">
                        {dateText(booking.check_in)} —{" "}
                        {dateText(booking.check_out)}
                      </td>

                      <td className="px-5 py-5 font-bold">
                        {money(booking.grand_total)}
                      </td>

                      <td className="px-5 py-5 font-semibold text-emerald-400">
                        {money(financials.paid)}
                      </td>

                      <td className="px-5 py-5 font-semibold text-red-400">
                        {money(financials.balance)}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            financials.paymentStatus === "Paid"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : financials.paymentStatus === "Partially Paid"
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-red-500/15 text-red-400"
                          }`}
                        >
                          {financials.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelected(booking)}
                            className="rounded-full border border-white/15 px-4 py-2 text-sm"
                          >
                            View
                          </button>

                          <button
                            onClick={() => downloadPdf(booking)}
                            className="rounded-full bg-[#d4b16f] px-4 py-2 text-sm font-semibold text-black"
                          >
                            Download PDF
                          </button>

                          <button
                            onClick={() => printInvoice(booking)}
                            className="rounded-full border border-[#d4b16f]/40 px-4 py-2 text-sm text-[#d4b16f]"
                          >
                            Print
                          </button>

                          <button
                            onClick={() => whatsappInvoice(booking)}
                            className="rounded-full border border-emerald-500/40 px-4 py-2 text-sm text-emerald-400"
                          >
                            WhatsApp
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
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

        {selected && (() => {
          const financials = getFinancials(selected);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111111] p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[#d4b16f]">
                      Invoice
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                      {invoiceNumber(selected)}
                    </h2>
                    <p className="mt-1 text-gray-400">
                      {selected.guest_name}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-full border border-white/10 px-4 py-2"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-7 space-y-3">
                  {[
                    ["Booking Reference", selected.booking_reference],
                    [
                      "Room",
                      `${selected.rooms?.room_number ?? "Unassigned"} - ${selected.room_type}`,
                    ],
                    ["Check-in", dateText(selected.check_in)],
                    ["Check-out", dateText(selected.check_out)],
                    ["Nights", String(selected.nights)],
                    ["Accommodation", money(selected.room_total)],
                    ["Breakfast", money(selected.breakfast_total)],
                    ["Total Charged", money(selected.grand_total)],
                    ["Amount Paid", money(financials.paid)],
                    ["Balance Due", money(financials.balance)],
                    ["Payment Status", financials.paymentStatus],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-5 border-b border-white/10 py-3"
                    >
                      <span className="text-gray-400">{label}</span>
                      <span className="text-right font-semibold">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#d4b16f]/10 p-5">
                  <div>
                    <p className="font-semibold text-[#d4b16f]">
                      {financials.balance === 0
                        ? "PAID IN FULL"
                        : "BALANCE DUE"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {financials.paymentStatus}
                    </p>
                  </div>

                  <span className="text-2xl font-bold">
                    {money(financials.balance)}
                  </span>
                </div>

                <div className="mt-7 flex flex-wrap justify-end gap-3">
                  <button
                    onClick={() => downloadPdf(selected)}
                    className="rounded-full bg-[#d4b16f] px-5 py-3 font-semibold text-black"
                  >
                    Download PDF
                  </button>

                  <button
                    onClick={() => printInvoice(selected)}
                    className="rounded-full border border-[#d4b16f]/40 px-5 py-3 text-[#d4b16f]"
                  >
                    Print
                  </button>

                  <button
                    onClick={() => whatsappInvoice(selected)}
                    className="rounded-full border border-emerald-500/40 px-5 py-3 text-emerald-400"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </main>
  );
}