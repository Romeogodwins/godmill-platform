import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const today = new Date().toISOString().slice(0, 10);

    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id, room_number, room_type, status, maintenance_note")
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
        proof_of_payment_url,
        grand_total,
        booking_source,
        company_name,
        rooms (room_number)
      `)
      .in("status", ["pending", "confirmed", "checked-in"])
      .order("check_in", { ascending: true });
    if (bookingsError) throw bookingsError;

    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("booking_id, amount");
    if (paymentsError) throw paymentsError;

    const paidByBooking = new Map<string, number>();
    for (const payment of payments ?? []) {
      paidByBooking.set(
        payment.booking_id,
        (paidByBooking.get(payment.booking_id) ?? 0) + Number(payment.amount ?? 0)
      );
    }

    const enriched = (bookings ?? []).map((booking) => {
      const charged = Number(booking.grand_total ?? 0);
      const paid = paidByBooking.get(booking.id) ?? 0;
      const balance = Math.max(charged - paid, 0);
      const collection_status =
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
        collection_status,
      };
    });

    const arrivals = enriched.filter(
      (booking) => booking.check_in === today && ["pending", "confirmed"].includes(booking.status)
    );
    const departures = enriched.filter(
      (booking) => booking.check_out === today && booking.status === "checked-in"
    );
    const inHouse = enriched.filter((booking) => booking.status === "checked-in");
    const overdue = enriched.filter(
      (booking) => booking.status === "checked-in" && booking.check_out < today
    );
    const proofsToVerify = enriched.filter(
      (booking) => booking.payment_status === "proof_received" && Boolean(booking.proof_of_payment_url)
    );
    const outstanding = enriched.filter(
      (booking) =>
        booking.balance > 0 &&
        ["pending", "confirmed", "checked-in"].includes(booking.status) &&
        (booking.status === "checked-in" || booking.check_out >= today)
    );
    const cleaning = (rooms ?? []).filter((room) => room.status === "cleaning");
    const maintenance = (rooms ?? []).filter((room) => room.status === "maintenance");
    const available = (rooms ?? []).filter((room) => room.status === "available");

    return NextResponse.json({
      success: true,
      date: today,
      summary: {
        arrivals: arrivals.length,
        departures: departures.length,
        inHouse: inHouse.length,
        available: available.length,
        cleaning: cleaning.length,
        maintenance: maintenance.length,
        proofsToVerify: proofsToVerify.length,
        outstanding: outstanding.length,
        overdue: overdue.length,
      },
      arrivals,
      departures,
      inHouse,
      overdue,
      proofsToVerify,
      outstanding,
      cleaning,
      maintenance,
      available,
    });
  } catch (error) {
    console.error("RECEPTION OVERVIEW ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load reception command centre.",
      },
      { status: 500 }
    );
  }
}
