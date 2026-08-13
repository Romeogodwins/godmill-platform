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
        room_type,
        room_id,
        check_in,
        check_out,
        nights,
        grand_total,
        status,
        created_at,
        rooms (
          room_number
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GUESTS API ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
          guests: [],
        },
        { status: 500 }
      );
    }

    /*
     * Build one guest record from multiple bookings.
     * Email is preferred as the unique identifier.
     * Phone is used if email is unavailable.
     */

    const guestMap = new Map<
      string,
      {
        guest_name: string;
        phone: string;
        email: string;
        total_bookings: number;
        total_spent: number;
        last_check_in: string | null;
        last_check_out: string | null;
        latest_room: string | null;
        latest_room_type: string | null;
        latest_status: string | null;
        bookings: typeof bookings;
      }
    >();

    for (const booking of bookings ?? []) {
      const email = booking.email?.trim().toLowerCase() || "";
      const phone = booking.phone?.trim() || "";

      const key =
        email ||
        phone ||
        `${booking.guest_name}-${booking.id}`;

      const roomRelation = booking.rooms as
        | { room_number?: string }
        | { room_number?: string }[]
        | null;

      const roomNumber = Array.isArray(roomRelation)
        ? roomRelation[0]?.room_number ?? null
        : roomRelation?.room_number ?? null;

      const existing = guestMap.get(key);

      if (existing) {
        existing.total_bookings += 1;
        existing.total_spent += Number(booking.grand_total ?? 0);

        existing.bookings.push(booking);
      } else {
        guestMap.set(key, {
          guest_name: booking.guest_name,
          phone,
          email,
          total_bookings: 1,
          total_spent: Number(booking.grand_total ?? 0),
          last_check_in: booking.check_in ?? null,
          last_check_out: booking.check_out ?? null,
          latest_room: roomNumber,
          latest_room_type: booking.room_type ?? null,
          latest_status: booking.status ?? null,
          bookings: [booking],
        });
      }
    }

    const guests = Array.from(guestMap.values());

    return NextResponse.json({
      success: true,
      totalGuests: guests.length,
      guests,
    });
  } catch (error) {
    console.error("GUESTS ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load guests.",
        guests: [],
      },
      { status: 500 }
    );
  }
}
