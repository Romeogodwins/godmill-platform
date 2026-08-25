import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_reference,
        guest_name,
        phone,
        email,
        room_id,
        room_type,
        aircon,
        adults,
        children,
        breakfast,
        check_in,
        check_out,
        nights,
        room_total,
        breakfast_total,
        grand_total,
        special_requests,
        booking_source,
        company_name,
        rate_plan,
        discount_amount,
        deposit_required,
        status,
        payment_status,
        proof_of_payment_url,
        proof_uploaded_at,
        created_at,
        rooms (
          id,
          room_number,
          room_type,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ADMIN BOOKINGS ERROR:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("booking_id, amount");

    if (paymentsError) {
      console.error("ADMIN BOOKING PAYMENTS ERROR:", paymentsError);
      return NextResponse.json(
        { success: false, message: paymentsError.message },
        { status: 500 }
      );
    }

    const paidByBooking = new Map<string, number>();
    for (const payment of payments ?? []) {
      paidByBooking.set(
        payment.booking_id,
        (paidByBooking.get(payment.booking_id) ?? 0) + Number(payment.amount ?? 0)
      );
    }

    const enrichedBookings = (bookings ?? []).map((booking) => {
      const charged = Number(booking.grand_total ?? 0);
      const totalPaid = paidByBooking.get(booking.id) ?? 0;
      const balance = Math.max(charged - totalPaid, 0);
      const collectionStatus =
        charged > 0 && balance <= 0
          ? "paid"
          : totalPaid > 0
            ? "partially-paid"
            : "unpaid";

      return {
        ...booking,
        grand_total: charged,
        total_paid: totalPaid,
        balance,
        collection_status: collectionStatus,
      };
    });

    return NextResponse.json({
      success: true,
      bookings: enrichedBookings,
    });
  } catch (error) {
    console.error("ADMIN BOOKINGS ROUTE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load bookings.",
      },
      { status: 500 }
    );
  }
}

