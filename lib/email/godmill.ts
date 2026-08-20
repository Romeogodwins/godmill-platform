import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const GODMILL_EMAIL =
  "bookings@godmillcityguesthouse.com";

export const GODMILL_ADMIN_EMAIL =
  "godmillcity547@gmail.com";

export const GODMILL_PHONE = "079 058 2637";

export const GODMILL_REVIEW_URL =
  process.env.GODMILL_GOOGLE_REVIEW_URL || "";

function money(value: number | null | undefined) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(Number(value ?? 0));
}

function safe(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shell(title: string, body: string) {
  return `
    <div style="margin:0;padding:20px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#222">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.08)">
        <div style="background:#111;padding:30px 24px;text-align:center">
          <h1 style="margin:0;color:#d4b16f;font-size:27px">
            GODMILL CITY GUESTHOUSE
          </h1>
          <p style="margin:9px 0 0;color:#fff">${safe(title)}</p>
        </div>

        <div style="padding:30px">
          ${body}

          <div style="margin-top:30px;padding-top:22px;border-top:1px solid #eee;line-height:1.8;color:#555">
            <strong style="color:#111">Godmill City Guesthouse</strong><br>
            Taung, North West<br>
            Tel: ${GODMILL_PHONE}<br>
            Email: ${GODMILL_EMAIL}
          </div>
        </div>
      </div>
    </div>
  `;
}

export interface BookingEmailData {
  bookingReference: string;
  guestName: string;
  email?: string | null;
  phone?: string | null;
  roomType?: string | null;
  roomNumber?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  grandTotal?: number | null;
  amountPaid?: number | null;
}

export async function sendPaymentVerifiedEmail(
  booking: BookingEmailData
) {
  if (!booking.email) return;

  const amount =
    booking.amountPaid ?? booking.grandTotal ?? 0;

  const html = shell(
    "Payment Received & Booking Confirmed",
    `
      <p>Dear <strong>${safe(booking.guestName)}</strong>,</p>

      <p style="line-height:1.7">
        Thank you. We have received and verified your payment for your stay at
        Godmill City Guesthouse.
      </p>

      <div style="background:#edf8ef;border-left:4px solid #22c55e;padding:20px;margin:24px 0">
        <div style="font-size:13px;color:#667">BOOKING REFERENCE</div>
        <div style="font-size:24px;font-weight:bold">${safe(
          booking.bookingReference
        )}</div>

        <div style="margin-top:14px;font-size:13px;color:#667">
          PAYMENT VERIFIED
        </div>
        <div style="font-size:25px;font-weight:bold">
          ${money(amount)}
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee"><strong>Room</strong></td>
          <td style="padding:10px;border-bottom:1px solid #eee">${safe(
            booking.roomType || "-"
          )}</td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee"><strong>Check-in</strong></td>
          <td style="padding:10px;border-bottom:1px solid #eee">${safe(
            booking.checkIn || "-"
          )}</td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee"><strong>Check-out</strong></td>
          <td style="padding:10px;border-bottom:1px solid #eee">${safe(
            booking.checkOut || "-"
          )}</td>
        </tr>
      </table>

      <p style="margin-top:24px;line-height:1.7">
        Your reservation is now <strong>confirmed</strong>. Please keep your
        booking reference available when you arrive.
      </p>
    `
  );

  return resend.emails.send({
    from: `Godmill City Guesthouse <${GODMILL_EMAIL}>`,
    to: [booking.email],
    replyTo: GODMILL_EMAIL,
    subject: `Payment confirmed - ${booking.bookingReference}`,
    html,
  });
}

export async function sendProofUploadedAdminEmail(
  booking: BookingEmailData
) {
  const html = shell(
    "Proof of Payment Uploaded",
    `
      <p>A guest has uploaded proof of payment.</p>

      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:9px;border-bottom:1px solid #eee"><strong>Reference</strong></td>
          <td style="padding:9px;border-bottom:1px solid #eee">${safe(
            booking.bookingReference
          )}</td>
        </tr>
        <tr>
          <td style="padding:9px;border-bottom:1px solid #eee"><strong>Guest</strong></td>
          <td style="padding:9px;border-bottom:1px solid #eee">${safe(
            booking.guestName
          )}</td>
        </tr>
        <tr>
          <td style="padding:9px;border-bottom:1px solid #eee"><strong>Phone</strong></td>
          <td style="padding:9px;border-bottom:1px solid #eee">${safe(
            booking.phone || "-"
          )}</td>
        </tr>
        <tr>
          <td style="padding:9px;border-bottom:1px solid #eee"><strong>Amount due</strong></td>
          <td style="padding:9px;border-bottom:1px solid #eee">${money(
            booking.grandTotal
          )}</td>
        </tr>
      </table>

      <p style="margin-top:22px">
        Open the Godmill admin booking screen to view and verify the proof of
        payment.
      </p>
    `
  );

  return resend.emails.send({
    from: `Godmill Booking System <${GODMILL_EMAIL}>`,
    to: [GODMILL_ADMIN_EMAIL],
    replyTo: booking.email || GODMILL_EMAIL,
    subject: `Proof of payment uploaded - ${booking.bookingReference}`,
    html,
  });
}

export async function sendCheckInEmail(
  booking: BookingEmailData
) {
  if (!booking.email) return;

  const html = shell(
    "Welcome to Godmill City Guesthouse",
    `
      <p>Dear <strong>${safe(booking.guestName)}</strong>,</p>

      <p style="line-height:1.7">
        Welcome to Godmill City Guesthouse. Your booking has now been checked
        in and we hope you enjoy a comfortable stay with us.
      </p>

      <div style="background:#f7f1e5;border-left:4px solid #d4b16f;padding:20px;margin:24px 0">
        <strong>Booking reference:</strong>
        ${safe(booking.bookingReference)}<br><br>

        ${
          booking.roomNumber
            ? `<strong>Room:</strong> ${safe(booking.roomNumber)}<br><br>`
            : ""
        }

        <strong>Contact:</strong> ${GODMILL_PHONE}
      </div>

      <p style="line-height:1.7">
        If you need assistance during your stay, please contact reception.
      </p>
    `
  );

  return resend.emails.send({
    from: `Godmill City Guesthouse <${GODMILL_EMAIL}>`,
    to: [booking.email],
    replyTo: GODMILL_EMAIL,
    subject: `Welcome to Godmill - ${booking.bookingReference}`,
    html,
  });
}

export async function sendCheckoutThankYouEmail(
  booking: BookingEmailData
) {
  if (!booking.email) return;

  const reviewButton = GODMILL_REVIEW_URL
    ? `
      <div style="margin:28px 0">
        <a
          href="${safe(GODMILL_REVIEW_URL)}"
          style="display:inline-block;background:#d4b16f;color:#111;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold"
        >
          Leave a Google Review
        </a>
      </div>
    `
    : "";

  const html = shell(
    "Thank You for Staying With Us",
    `
      <p>Dear <strong>${safe(booking.guestName)}</strong>,</p>

      <p style="line-height:1.7">
        Thank you for choosing Godmill City Guesthouse. We hope you had a
        comfortable and enjoyable stay.
      </p>

      <p style="line-height:1.7">
        We would be delighted to welcome you again whenever you visit Taung.
        If you were happy with your stay, an honest Google review would help
        other travellers discover us.
      </p>

      ${reviewButton}

      <p style="line-height:1.7">
        For your next stay, you can book directly with Godmill City Guesthouse
        using our website or by contacting us on ${GODMILL_PHONE}.
      </p>
    `
  );

  return resend.emails.send({
    from: `Godmill City Guesthouse <${GODMILL_EMAIL}>`,
    to: [booking.email],
    replyTo: GODMILL_EMAIL,
    subject: `Thank you for staying with Godmill City Guesthouse`,
    html,
  });
}
export async function sendPaymentReceiptEmail(
  booking: BookingEmailData & {
    paymentAmount: number;
    totalPaid: number;
    balance: number;
    paymentMethod?: string | null;
    paymentReference?: string | null;
  }
) {
  if (!booking.email) return;

  const fullyPaid = booking.balance <= 0;
  const html = shell(
    fullyPaid ? "Payment Receipt" : "Part Payment Received",
    `
      <p>Dear <strong>${safe(booking.guestName)}</strong>,</p>

      <p style="line-height:1.7">
        We have recorded your ${fullyPaid ? "payment" : "part payment"} for booking
        <strong>${safe(booking.bookingReference)}</strong>.
      </p>

      <div style="background:#f7f1e5;border-left:4px solid #d4b16f;padding:20px;margin:24px 0">
        <div style="font-size:13px;color:#667">PAYMENT RECEIVED</div>
        <div style="font-size:27px;font-weight:bold">${money(booking.paymentAmount)}</div>
      </div>

      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee"><strong>Total booking value</strong></td>
          <td style="padding:10px;border-bottom:1px solid #eee">${money(booking.grandTotal)}</td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee"><strong>Total paid</strong></td>
          <td style="padding:10px;border-bottom:1px solid #eee">${money(booking.totalPaid)}</td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee"><strong>Balance</strong></td>
          <td style="padding:10px;border-bottom:1px solid #eee"><strong>${money(booking.balance)}</strong></td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee"><strong>Payment method</strong></td>
          <td style="padding:10px;border-bottom:1px solid #eee">${safe(booking.paymentMethod || "Recorded payment")}</td>
        </tr>
        ${booking.paymentReference ? `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee"><strong>Payment reference</strong></td>
            <td style="padding:10px;border-bottom:1px solid #eee">${safe(booking.paymentReference)}</td>
          </tr>
        ` : ""}
      </table>

      <p style="margin-top:24px;line-height:1.7">
        ${fullyPaid
          ? "Your account for this booking is paid in full. Thank you."
          : "The balance shown above remains outstanding. Please use your booking reference when making the next payment."}
      </p>
    `
  );

  return resend.emails.send({
    from: `Godmill City Guesthouse <${GODMILL_EMAIL}>`,
    to: [booking.email],
    replyTo: GODMILL_EMAIL,
    subject: `${fullyPaid ? "Payment receipt" : "Part payment received"} - ${booking.bookingReference}`,
    html,
  });
}
