import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

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
        status,
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
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookings: bookings ?? [],
    });
  } catch (error) {
    console.error("ADMIN BOOKINGS ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load bookings.",
      },
      { status: 500 }
    );
  }
}
