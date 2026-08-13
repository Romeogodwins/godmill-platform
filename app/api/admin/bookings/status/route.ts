import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";

interface StatusPayload {
  bookingId: string;
  action: "confirm" | "check-in" | "check-out" | "cancel";
}

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as StatusPayload;

    if (!payload.bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const validActions: StatusPayload["action"][] = [
      "confirm",
      "check-in",
      "check-out",
      "cancel",
    ];

    if (!validActions.includes(payload.action)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking action." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_reference,
        room_id,
        status,
        check_in,
        check_out
      `)
      .eq("id", payload.bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("BOOKING LOOKUP ERROR:", bookingError);
      return NextResponse.json(
        {
          success: false,
          message: bookingError?.message || "Booking could not be found.",
        },
        { status: 404 }
      );
    }

    const allowedTransitions: Record<StatusPayload["action"], string[]> = {
      confirm: ["pending"],
      "check-in": ["confirmed"],
      "check-out": ["checked-in"],
      cancel: ["pending", "confirmed"],
    };

    if (!allowedTransitions[payload.action].includes(booking.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot ${payload.action} a booking with status "${booking.status}".`,
        },
        { status: 400 }
      );
    }

    if (
      (payload.action === "confirm" ||
        payload.action === "check-in" ||
        payload.action === "check-out") &&
      !booking.room_id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This booking does not have an assigned room.",
        },
        { status: 400 }
      );
    }

    if (payload.action === "check-in") {
      const today = new Date().toISOString().split("T")[0];

      if (today < booking.check_in) {
        return NextResponse.json(
          {
            success: false,
            message: `Check-in is not yet allowed. This guest is scheduled to arrive on ${booking.check_in}.`,
          },
          { status: 400 }
        );
      }

      if (today >= booking.check_out) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This booking has already reached or passed its check-out date.",
          },
          { status: 400 }
        );
      }
    }

    let bookingStatus: string;
    let roomStatus: string | null = null;

    switch (payload.action) {
      case "confirm":
        bookingStatus = "confirmed";
        roomStatus = null;
        break;

      case "check-in":
        bookingStatus = "checked-in";
        roomStatus = "occupied";
        break;

      case "check-out":
        bookingStatus = "checked-out";
        roomStatus = "cleaning";
        break;

      case "cancel":
        bookingStatus = "cancelled";
        roomStatus = null;
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Invalid booking action." },
          { status: 400 }
        );
    }

    const { data: updatedBooking, error: updateBookingError } = await supabase
      .from("bookings")
      .update({ status: bookingStatus })
      .eq("id", booking.id)
      .select(`
        id,
        booking_reference,
        room_id,
        status,
        check_in,
        check_out
      `)
      .single();

    if (updateBookingError || !updatedBooking) {
      console.error("BOOKING STATUS UPDATE ERROR:", updateBookingError);
      return NextResponse.json(
        {
          success: false,
          message: updateBookingError?.message || "Unable to update booking.",
        },
        { status: 500 }
      );
    }

    let updatedRoom = null;

    if (booking.room_id && roomStatus) {
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .update({ status: roomStatus })
        .eq("id", booking.room_id)
        .select(`
          id,
          room_number,
          room_type,
          status
        `)
        .single();

      if (roomError || !room) {
        console.error("ROOM STATUS UPDATE ERROR:", roomError);
        return NextResponse.json(
          {
            success: false,
            message:
              roomError?.message ||
              "Booking updated, but room status could not be updated.",
          },
          { status: 500 }
        );
      }

      updatedRoom = room;
    }

    return NextResponse.json({
      success: true,
      message: `${booking.booking_reference} updated successfully.`,
      bookingReference: booking.booking_reference,
      bookingStatus: updatedBooking.status,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("BOOKING STATUS ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to update booking.",
      },
      { status: 500 }
    );
  }
}
