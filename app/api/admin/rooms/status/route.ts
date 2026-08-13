import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";

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

