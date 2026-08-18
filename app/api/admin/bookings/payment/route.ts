import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";

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
      .select(
        "id, booking_reference, payment_status, proof_of_payment_url"
      )
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
          {
            success: false,
            message: "No proof of payment has been uploaded.",
          },
          { status: 400 }
        );
      }

      const { data, error } = await supabase.storage
        .from("payment-proofs")
        .createSignedUrl(booking.proof_of_payment_url, 300);

      if (error || !data?.signedUrl) {
        return NextResponse.json(
          {
            success: false,
            message:
              error?.message || "Unable to open proof of payment.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        url: data.signedUrl,
      });
    }

    if (action === "verify") {
      if (!booking.proof_of_payment_url) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Proof of payment must be uploaded before verification.",
          },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("bookings")
        .update({
          payment_status: "verified",
        })
        .eq("id", bookingId);

      if (error) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `${booking.booking_reference} payment verified successfully.`,
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
        message:
          error instanceof Error
            ? error.message
            : "Unable to process payment.",
      },
      { status: 500 }
    );
  }
}
