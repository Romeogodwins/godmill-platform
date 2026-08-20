import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

function isoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get("start");
    const daysParam = Number(searchParams.get("days") || 14);
    const days = Math.min(Math.max(Number.isFinite(daysParam) ? daysParam : 14, 7), 31);

    const start = startParam ? new Date(`${startParam}T00:00:00`) : new Date();
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid planner start date." },
        { status: 400 }
      );
    }

    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + days);

    const startDate = isoDate(start);
    const endDate = isoDate(end);

    const supabase = createSupabaseAdminClient();

    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select(`
        id,
        room_number,
        room_type,
        capacity,
        price,
        status,
        maintenance_note,
        maintenance_since
      `)
      .order("room_number", { ascending: true });

    if (roomsError) throw roomsError;

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_reference,
        guest_name,
        phone,
        email,
        room_id,
        room_type,
        check_in,
        check_out,
        status,
        payment_status,
        grand_total,
        booking_source,
        company_name,
        rate_plan
      `)
      .lt("check_in", endDate)
      .gt("check_out", startDate)
      .neq("status", "cancelled")
      .order("check_in", { ascending: true });

    if (bookingsError) throw bookingsError;

    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("booking_id, amount");

    if (paymentsError) throw paymentsError;

    const paidByBooking = new Map<string, number>();
    for (const payment of payments ?? []) {
      const current = paidByBooking.get(payment.booking_id) ?? 0;
      paidByBooking.set(payment.booking_id, current + Number(payment.amount ?? 0));
    }

    const enrichedBookings = (bookings ?? []).map((booking) => {
      const charged = Number(booking.grand_total ?? 0);
      const paid = paidByBooking.get(booking.id) ?? 0;
      const balance = Math.max(charged - paid, 0);
      const collectionStatus =
        charged > 0 && balance <= 0
          ? "paid"
          : paid > 0
            ? "partially-paid"
            : "unpaid";

      return {
        ...booking,
        grand_total: charged,
        total_paid: paid,
        balance,
        collection_status: collectionStatus,
      };
    });

    const totalRooms = (rooms ?? []).length;
    const sellableRooms = (rooms ?? []).filter(
      (room) => room.status !== "maintenance"
    ).length;

    const occupiedRoomNights = enrichedBookings.reduce((sum, booking) => {
      const arrival = new Date(`${booking.check_in}T00:00:00`);
      const departure = new Date(`${booking.check_out}T00:00:00`);
      const overlapStart = arrival > start ? arrival : start;
      const overlapEnd = departure < end ? departure : end;
      const nights = Math.max(
        Math.round((overlapEnd.getTime() - overlapStart.getTime()) / 86400000),
        0
      );
      return sum + nights;
    }, 0);

    const availableRoomNights = Math.max(sellableRooms * days, 1);
    const occupancyRate = Number(
      ((occupiedRoomNights / availableRoomNights) * 100).toFixed(1)
    );

    return NextResponse.json({
      success: true,
      start: startDate,
      end: endDate,
      days,
      summary: {
        totalRooms,
        sellableRooms,
        bookings: enrichedBookings.length,
        occupiedRoomNights,
        occupancyRate,
      },
      rooms: rooms ?? [],
      bookings: enrichedBookings,
    });
  } catch (error) {
    console.error("PLANNER API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load room planner.",
      },
      { status: 500 }
    );
  }
}
