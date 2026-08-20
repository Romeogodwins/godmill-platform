import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const roomId = body?.roomId as string | undefined;
    const action = body?.action as "start" | "finish" | undefined;
    const note = typeof body?.note === "string" ? body.note.trim() : "";

    if (!roomId) {
      return NextResponse.json(
        { success: false, message: "Room ID is required." },
        { status: 400 }
      );
    }

    if (action !== "start" && action !== "finish") {
      return NextResponse.json(
        { success: false, message: "Invalid maintenance action." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, room_number, status, maintenance_note, maintenance_since")
      .eq("id", roomId)
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        { success: false, message: roomError?.message || "Room not found." },
        { status: 404 }
      );
    }

    if (action === "start") {
      if (["occupied", "cleaning"].includes(room.status)) {
        return NextResponse.json(
          {
            success: false,
            message: `Room ${room.room_number} cannot enter maintenance while it is ${room.status}.`,
          },
          { status: 400 }
        );
      }

      const today = new Date().toISOString().slice(0, 10);
      const { data: futureBooking, error: futureBookingError } = await supabase
        .from("bookings")
        .select("id, booking_reference, check_in, status")
        .eq("room_id", roomId)
        .gte("check_in", today)
        .in("status", ["pending", "confirmed"])
        .order("check_in", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (futureBookingError) throw futureBookingError;

      if (futureBooking) {
        return NextResponse.json(
          {
            success: false,
            message: `Room ${room.room_number} has future booking ${futureBooking.booking_reference} on ${futureBooking.check_in}. Reassign or cancel it before maintenance.`,
          },
          { status: 400 }
        );
      }

      const { data: updatedRoom, error: updateError } = await supabase
        .from("rooms")
        .update({
          status: "maintenance",
          maintenance_note: note || "Maintenance",
          maintenance_since: new Date().toISOString(),
        })
        .eq("id", roomId)
        .select("id, room_number, room_type, status, maintenance_note, maintenance_since")
        .single();

      if (updateError || !updatedRoom) throw updateError || new Error("Unable to update room.");

      return NextResponse.json({
        success: true,
        message: `Room ${updatedRoom.room_number} is now blocked for maintenance.`,
        room: updatedRoom,
      });
    }

    if (room.status !== "maintenance") {
      return NextResponse.json(
        { success: false, message: "Only a maintenance room can be returned to service." },
        { status: 400 }
      );
    }

    const { data: updatedRoom, error: updateError } = await supabase
      .from("rooms")
      .update({
        status: "available",
        maintenance_note: null,
        maintenance_since: null,
      })
      .eq("id", roomId)
      .select("id, room_number, room_type, status, maintenance_note, maintenance_since")
      .single();

    if (updateError || !updatedRoom) throw updateError || new Error("Unable to update room.");

    return NextResponse.json({
      success: true,
      message: `Room ${updatedRoom.room_number} maintenance is complete and the room is available.`,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("ROOM MAINTENANCE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to update maintenance status.",
      },
      { status: 500 }
    );
  }
}
