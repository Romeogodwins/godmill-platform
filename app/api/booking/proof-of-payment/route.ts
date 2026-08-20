import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";
import { sendProofUploadedAdminEmail } from "../../../../lib/email/godmill";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData =
      await request.formData();

    const bookingId =
      formData.get("bookingId");

    const bookingReference =
      formData.get("bookingReference");

    const file =
      formData.get("file");

    if (
      typeof bookingId !== "string" ||
      typeof bookingReference !== "string" ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking information and proof of payment are required.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please upload a PDF, JPG or PNG file.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Proof of payment must be 5MB or smaller.",
        },
        { status: 400 }
      );
    }

    const supabase =
      createSupabaseAdminClient();

    const {
      data: booking,
      error: bookingError,
    } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_reference,
        guest_name,
        email,
        phone,
        room_type,
        check_in,
        check_out,
        grand_total
      `)
      .eq("id", bookingId)
      .eq(
        "booking_reference",
        bookingReference
      )
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking could not be found.",
        },
        { status: 404 }
      );
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      (file.type === "application/pdf"
        ? "pdf"
        : "jpg");

    const safeReference =
      bookingReference.replace(
        /[^a-zA-Z0-9-_]/g,
        ""
      );

    const filePath =
      `${safeReference}/${Date.now()}-proof.${extension}`;

    const bytes =
      await file.arrayBuffer();

    const {
      error: uploadError,
    } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "PROOF UPLOAD ERROR:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            uploadError.message,
        },
        { status: 500 }
      );
    }

    const {
      error: updateError,
    } = await supabase
      .from("bookings")
      .update({
        payment_status:
          "proof_received",
        proof_of_payment_url:
          filePath,
        proof_uploaded_at:
          new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      console.error(
        "BOOKING PROOF UPDATE ERROR:",
        updateError
      );

      await supabase.storage
        .from("payment-proofs")
        .remove([filePath]);

      return NextResponse.json(
        {
          success: false,
          message:
            "Proof uploaded, but the booking could not be updated.",
        },
        { status: 500 }
      );
    }

    try {
      await sendProofUploadedAdminEmail({
        bookingReference:
          booking.booking_reference,
        guestName:
          booking.guest_name,
        email:
          booking.email,
        phone:
          booking.phone,
        roomType:
          booking.room_type,
        checkIn:
          booking.check_in,
        checkOut:
          booking.check_out,
        grandTotal:
          Number(
            booking.grand_total ?? 0
          ),
      });
    } catch (emailError) {
      console.error(
        "PROOF UPLOAD EMAIL ERROR:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Proof of payment uploaded successfully. Your payment is awaiting verification.",
    });
  } catch (error) {
    console.error(
      "PROOF OF PAYMENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to upload proof of payment.",
      },
      { status: 500 }
    );
  }
}