import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabase/client";

interface BookingPayload {
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  roomType: string;
  aircon: string;
  breakfast: boolean;
  guestName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

function calculatePricing(payload: BookingPayload) {
  const adults = Number(payload.adults);
  const children = Number(payload.children || 0);

  const checkIn = new Date(payload.checkIn);
  const checkOut = new Date(payload.checkOut);

  const nights = Math.max(
    1,
    Math.round(
      (checkOut.getTime() - checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  let roomRate = 850;

  if (payload.roomType === "Standard Double") {
    roomRate = payload.aircon === "Non-Aircon" ? 500 : 600;
  } else if (payload.roomType === "Family 3 Sleeper") {
    roomRate = 850;
  }

  const roomTotal = nights * roomRate;

  const breakfastTotal = payload.breakfast
    ? (adults + children) * 120 * nights
    : 0;

  const grandTotal = roomTotal + breakfastTotal;

  return {
    nights,
    roomTotal,
    breakfastTotal,
    grandTotal,
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookingPayload;

    const supabase = createSupabaseClient();

    const pricing = calculatePricing(payload);

    const bookingReference = `GCM-${Date.now()
      .toString()
      .slice(-6)}`;

    // Create Guest
    const { data: guestData, error: guestError } = await supabase
      .from("guests")
      .insert({
        full_name: payload.guestName.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
      })
      .select("id")
      .single();

    if (guestError) {
      console.error("GUEST INSERT ERROR:", guestError);

      return NextResponse.json(
        {
          success: false,
          message: guestError.message,
        },
        { status: 500 }
      );
    }

    // Create Booking
    const { error: bookingError } = await supabase
      .from("bookings")
      .insert({
        booking_reference: bookingReference,
        guest_id: guestData.id,

        guest_name: payload.guestName,
        phone: payload.phone,
        email: payload.email,

        room_type: payload.roomType,

        // BOOLEAN VALUE
        aircon:
          payload.roomType === "Executive Room"
            ? true
            : payload.aircon === "Aircon",

        adults: Number(payload.adults),
        children: Number(payload.children),

        breakfast: payload.breakfast,

        check_in: payload.checkIn,
        check_out: payload.checkOut,

        nights: pricing.nights,

        room_total: pricing.roomTotal,
        breakfast_total: pricing.breakfastTotal,
        grand_total: pricing.grandTotal,

        special_requests: payload.specialRequests,

        status: "pending",
      });

    if (bookingError) {
      console.error("BOOKING INSERT ERROR:", bookingError);

      return NextResponse.json(
        {
          success: false,
          message: bookingError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingReference,
    });
  } catch (error) {
    console.error("BOOKING ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}