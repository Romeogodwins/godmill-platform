import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("rooms")
      .select(`
        id,
        room_number,
        room_type,
        capacity,
        price,
        status,
        bookings (
          guest_name,
          status
        )
      `)
      .order("room_number", { ascending: true });

    if (error) {
      console.error("ROOMS API ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("ROOMS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load rooms.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const roomId = body?.roomId;
    const status = body?.status;

    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          message: "Room ID is required.",
        },
        { status: 400 }
      );
    }

    if (status !== "available") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid room status.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, room_number, room_type, status")
      .eq("id", roomId)
      .single();

    if (roomError || !room) {
      console.error("ROOM LOOKUP ERROR:", roomError);

      return NextResponse.json(
        {
          success: false,
          message: roomError?.message || "Room not found.",
        },
        { status: 404 }
      );
    }

    if (room.status !== "cleaning") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only a room currently being cleaned can be marked available.",
        },
        { status: 400 }
      );
    }

    const { data: updatedRoom, error: updateError } =
      await supabase
        .from("rooms")
        .update({
          status: "available",
        })
        .eq("id", roomId)
        .select("id, room_number, room_type, status")
        .single();

    if (updateError || !updatedRoom) {
      console.error("ROOM UPDATE ERROR:", updateError);

      return NextResponse.json(
        {
          success: false,
          message:
            updateError?.message ||
            "Unable to update room status.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Room ${updatedRoom.room_number} has been cleaned and is now available.`,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("ROOM STATUS ERROR:", error);

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
