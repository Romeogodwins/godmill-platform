import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../../lib/supabase/server";

interface RouteContext {
  params: Promise<{
    roomId: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { roomId } = await context.params;
    const body = await request.json();

    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          message: "Room ID is required.",
        },
        { status: 400 }
      );
    }

    if (body.status !== "available") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid room status.",
        },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, room_number, status")
      .eq("id", roomId)
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        {
          success: false,
          message:
            roomError?.message || "Room not found.",
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

    const { error: updateError } = await supabase
      .from("rooms")
      .update({
        status: "available",
      })
      .eq("id", roomId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: `Room ${room.room_number} is now available.`,
      roomId,
      status: "available",
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