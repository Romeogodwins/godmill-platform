import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../../lib/supabase/client";

interface StatusPayload {
  roomId: string;
  action: "check_in" | "check_out" | "cleaned";
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as StatusPayload;

    if (!payload.roomId || !payload.action) {
      return NextResponse.json(
        {
          success: false,
          message: "Room ID and action are required.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient();

    // CHECK IN
    if (payload.action === "check_in") {
      const { data: booking, error: bookingFindError } = await supabase
        .from("bookings")
        .select("id")
        .eq("room_id", payload.roomId)
        .in("status", ["pending", "confirmed", "reserved"])
        .order("check_in", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (bookingFindError) {
        throw bookingFindError;
      }

      if (!booking) {
        return NextResponse.json(
          {
            success: false,
            message: "No active reservation found for this room.",
          },
          { status: 404 }
        );
      }

      const { error: bookingUpdateError } = await supabase
        .from("bookings")
        .update({
          status: "checked-in",
        })
        .eq("id", booking.id);

      if (bookingUpdateError) {
        throw bookingUpdateError;
      }

      const { error: roomUpdateError } = await supabase
        .from("rooms")
        .update({
          status: "occupied",
        })
        .eq("id", payload.roomId);

      if (roomUpdateError) {
        throw roomUpdateError;
      }

      return NextResponse.json({
        success: true,
        message: "Guest checked in successfully.",
      });
    }

    // CHECK OUT
    if (payload.action === "check_out") {
      const { data: booking, error: bookingFindError } = await supabase
        .from("bookings")
        .select("id")
        .eq("room_id", payload.roomId)
        .eq("status", "checked-in")
        .limit(1)
        .maybeSingle();

      if (bookingFindError) {
        throw bookingFindError;
      }

      if (!booking) {
        return NextResponse.json(
          {
            success: false,
            message: "No checked-in guest found for this room.",
          },
          { status: 404 }
        );
      }

      const { error: bookingUpdateError } = await supabase
        .from("bookings")
        .update({
          status: "completed",
        })
        .eq("id", booking.id);

      if (bookingUpdateError) {
        throw bookingUpdateError;
      }

      const { error: roomUpdateError } = await supabase
        .from("rooms")
        .update({
          status: "cleaning",
        })
        .eq("id", payload.roomId);

      if (roomUpdateError) {
        throw roomUpdateError;
      }

      return NextResponse.json({
        success: true,
        message: "Guest checked out successfully.",
      });
    }

    // ROOM CLEANED
    if (payload.action === "cleaned") {
      const { error } = await supabase
        .from("rooms")
        .update({
          status: "available",
        })
        .eq("id", payload.roomId);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        message: "Room marked as available.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("ROOM STATUS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update room.",
      },
      { status: 500 }
    );
  }
}
