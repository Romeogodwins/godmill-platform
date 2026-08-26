import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";
import { sendPaymentReceiptEmail } from "../../../../lib/email/godmill";

export const dynamic = "force-dynamic";

/*
|--------------------------------------------------------------------------
| GET - Load payment dashboard
|--------------------------------------------------------------------------
*/
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    // Load bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_reference,
        guest_name,
        phone,
        email,
        room_type,
        room_id,
        check_in,
        check_out,
        grand_total,
        status,
        rooms (
          room_number
        )
      `)
      .order("created_at", { ascending: false });

    if (bookingsError) {
      console.error("BOOKINGS ERROR:", bookingsError);

      return NextResponse.json(
        {
          success: false,
          message: bookingsError.message,
        },
        { status: 500 }
      );
    }

    // Load payments
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select(`
        id,
        booking_id,
        amount,
        payment_method,
        payment_reference,
        notes,
        payment_date
      `)
      .order("payment_date", { ascending: false });

    if (paymentsError) {
      console.error("PAYMENTS ERROR:", paymentsError);

      return NextResponse.json(
        {
          success: false,
          message: paymentsError.message,
        },
        { status: 500 }
      );
    }

    const safePayments = payments ?? [];
    const safeBookings = bookings ?? [];

    const bookingsWithPayments = safeBookings.map((booking) => {
      const bookingPayments = safePayments.filter(
        (payment) => payment.booking_id === booking.id
      );

      const totalPaid = bookingPayments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
      );

      const grandTotal = Number(booking.grand_total || 0);

      const balance = Math.max(grandTotal - totalPaid, 0);

      let paymentStatus = "unpaid";

      if (totalPaid >= grandTotal && grandTotal > 0) {
        paymentStatus = "paid";
      } else if (totalPaid > 0) {
        paymentStatus = "partially-paid";
      }

      return {
        ...booking,
        grand_total: grandTotal,
        total_paid: totalPaid,
        balance,
        payment_status: paymentStatus,
        payments: bookingPayments,
      };
    });

    const totalCharged = bookingsWithPayments.reduce(
      (total, booking) => total + Number(booking.grand_total || 0),
      0
    );

    const totalPaid = bookingsWithPayments.reduce(
      (total, booking) => total + Number(booking.total_paid || 0),
      0
    );

    const totalOutstanding = bookingsWithPayments.reduce(
      (total, booking) => total + Number(booking.balance || 0),
      0
    );

    const paidBookings = bookingsWithPayments.filter(
      (booking) => booking.payment_status === "paid"
    ).length;

    const partiallyPaidBookings = bookingsWithPayments.filter(
      (booking) => booking.payment_status === "partially-paid"
    ).length;

    const unpaidBookings = bookingsWithPayments.filter(
      (booking) => booking.payment_status === "unpaid"
    ).length;

    return NextResponse.json({
      success: true,

      summary: {
        totalCharged,
        totalPaid,
        totalOutstanding,
        paidBookings,
        partiallyPaidBookings,
        unpaidBookings,
      },

      bookings: bookingsWithPayments,

      payments: safePayments,
    });
  } catch (error) {
    console.error("PAYMENTS GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load payments.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST - Record payment
|--------------------------------------------------------------------------
*/
export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdminClient();

    const body = await request.json();

    const bookingId = body.bookingId;
    const amount = Number(body.amount);
    const paymentMethod = body.paymentMethod || "cash";
    const paymentReference =
      body.paymentReference?.trim() || null;
    const notes = body.notes?.trim() || null;

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid payment amount.",
        },
        { status: 400 }
      );
    }

    // Get booking
    const { data: booking, error: bookingError } = await supabase
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
        grand_total,
        status
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("BOOKING LOOKUP ERROR:", bookingError);

      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    // Existing payments
    const {
      data: existingPayments,
      error: existingPaymentsError,
    } = await supabase
      .from("payments")
      .select("amount")
      .eq("booking_id", bookingId);

    if (existingPaymentsError) {
      console.error(
        "EXISTING PAYMENTS ERROR:",
        existingPaymentsError
      );

      return NextResponse.json(
        {
          success: false,
          message: existingPaymentsError.message,
        },
        { status: 500 }
      );
    }

    const alreadyPaid = (existingPayments ?? []).reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    const grandTotal = Number(booking.grand_total || 0);

    const currentBalance = Math.max(
      grandTotal - alreadyPaid,
      0
    );

    if (currentBalance <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This booking has already been paid in full.",
        },
        { status: 400 }
      );
    }

    if (amount > currentBalance) {
      return NextResponse.json(
        {
          success: false,
          message: `Payment cannot exceed the outstanding balance of R ${currentBalance.toLocaleString(
            "en-ZA"
          )}.`,
        },
        { status: 400 }
      );
    }

    // Record payment
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        booking_id: bookingId,
        amount,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        notes,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("PAYMENT INSERT ERROR:", paymentError);

      return NextResponse.json(
        {
          success: false,
          message: paymentError.message,
        },
        { status: 500 }
      );
    }

    const totalPaid = alreadyPaid + amount;

    const balance = Math.max(
      grandTotal - totalPaid,
      0
    );

    const paymentStatus =
      balance <= 0
        ? "paid"
        : totalPaid > 0
        ? "partially-paid"
        : "unpaid";

    // Keep the booking workflow synchronized with the authoritative payment ledger.
    // A full manual payment recorded by reception is trusted and confirms a pending booking.
    if (balance <= 0) {
      const bookingUpdate: { payment_status: string; status?: string } = {
        payment_status: "verified",
      };

      if ((booking as { status?: string }).status === "pending") {
        bookingUpdate.status = "confirmed";
      }

      const { error: bookingSyncError } = await supabase
        .from("bookings")
        .update(bookingUpdate)
        .eq("id", bookingId);

      if (bookingSyncError) {
        console.error("PAYMENT BOOKING SYNC ERROR:", bookingSyncError);
        return NextResponse.json(
          { success: false, message: bookingSyncError.message },
          { status: 500 }
        );
      }
    }

    try {
      await sendPaymentReceiptEmail({
        bookingReference: booking.booking_reference,
        guestName: booking.guest_name,
        email: booking.email,
        phone: booking.phone,
        roomType: booking.room_type,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        grandTotal,
        paymentAmount: amount,
        totalPaid,
        balance,
        paymentMethod,
        paymentReference,
      });
    } catch (emailError) {
      console.error("PAYMENT RECEIPT EMAIL ERROR:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully.",
      payment,
      booking: {
        id: booking.id,
        booking_reference: booking.booking_reference,
        grand_total: grandTotal,
        total_paid: totalPaid,
        balance,
        payment_status: paymentStatus,
      },
    });
  } catch (error) {
    console.error("PAYMENTS POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to record payment.",
      },
      { status: 500 }
    );
  }
}

