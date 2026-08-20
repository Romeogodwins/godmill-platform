import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";
import { sendPaymentVerifiedEmail } from "../../../../../lib/email/godmill";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bookingId = body?.bookingId;
    const action = body?.action;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_reference,
        guest_name,
        email,
        phone,
        room_type,
        room_id,
        check_in,
        check_out,
        grand_total,
        status,
        payment_status,
        proof_of_payment_url
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    if (action === "view-proof") {
      if (!booking.proof_of_payment_url) {
        return NextResponse.json(
          { success: false, message: "No proof of payment has been uploaded." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase.storage
        .from("payment-proofs")
        .createSignedUrl(booking.proof_of_payment_url, 300);

      if (error || !data?.signedUrl) {
        return NextResponse.json(
          { success: false, message: error?.message || "Unable to open proof of payment." },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, url: data.signedUrl });
    }

    if (action === "verify") {
      if (!booking.proof_of_payment_url) {
        return NextResponse.json(
          { success: false, message: "Proof of payment must be uploaded before verification." },
          { status: 400 }
        );
      }

      const { data: existingPayments, error: paymentsError } = await supabase
        .from("payments")
        .select("amount")
        .eq("booking_id", bookingId);

      if (paymentsError) {
        return NextResponse.json(
          { success: false, message: paymentsError.message },
          { status: 500 }
        );
      }

      const grandTotal = Number(booking.grand_total ?? 0);
      const alreadyPaid = (existingPayments ?? []).reduce(
        (sum, payment) => sum + Number(payment.amount ?? 0),
        0
      );
      const amountToRecord = Math.max(grandTotal - alreadyPaid, 0);

      // A verified POP is treated as settlement of the remaining balance.
      // This keeps the payments ledger, Booking screen, Reception and Planner in sync.
      if (amountToRecord > 0) {
        const { error: insertPaymentError } = await supabase
          .from("payments")
          .insert({
            booking_id: bookingId,
            amount: amountToRecord,
            payment_method: "eft",
            payment_reference: `POP-${booking.booking_reference}`,
            notes: "Verified proof of payment",
          });

        if (insertPaymentError) {
          return NextResponse.json(
            { success: false, message: insertPaymentError.message },
            { status: 500 }
          );
        }
      }

      const updatePayload: { payment_status: string; status?: string } = {
        payment_status: "verified",
      };

      if (booking.status === "pending") {
        updatePayload.status = "confirmed";
      }

      const { data: updatedBooking, error: updateError } = await supabase
        .from("bookings")
        .update(updatePayload)
        .eq("id", bookingId)
        .select(`
          id,
          booking_reference,
          guest_name,
          email,
          phone,
          room_type,
          room_id,
          check_in,
          check_out,
          grand_total,
          status,
          payment_status
        `)
        .single();

      if (updateError || !updatedBooking) {
        return NextResponse.json(
          { success: false, message: updateError?.message || "Unable to verify payment." },
          { status: 500 }
        );
      }

      const finalPaid = Math.min(grandTotal, alreadyPaid + amountToRecord);

      try {
        await sendPaymentVerifiedEmail({
          bookingReference: updatedBooking.booking_reference,
          guestName: updatedBooking.guest_name,
          email: updatedBooking.email,
          phone: updatedBooking.phone,
          roomType: updatedBooking.room_type,
          checkIn: updatedBooking.check_in,
          checkOut: updatedBooking.check_out,
          grandTotal,
          amountPaid: finalPaid,
        });
      } catch (emailError) {
        console.error("PAYMENT CONFIRMATION EMAIL ERROR:", emailError);
      }

      return NextResponse.json({
        success: true,
        message: `${booking.booking_reference} payment verified and booking confirmed successfully.`,
        paymentStatus: updatedBooking.payment_status,
        bookingStatus: updatedBooking.status,
        totalPaid: finalPaid,
        balance: Math.max(grandTotal - finalPaid, 0),
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid payment action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("ADMIN PAYMENT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to process payment.",
      },
      { status: 500 }
    );
  }
}
