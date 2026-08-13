"use server";

import { createClient } from "@supabase/supabase-js";
import { getAvailableRoom } from "@/lib/availability";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createBooking(data: {
  guest_name: string;
  phone: string;
  room_type: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  special_requests?: string;
}) {
  const room = await getAvailableRoom(
    data.room_type,
    data.check_in,
    data.check_out
  );

  if (!room) {
    return {
      success: false,
      message: "No rooms are available for the selected dates.",
    };
  }

  const { error } = await supabase.from("bookings").insert({
    ...data,
    room_id: room.id,
    status: "confirmed",
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    room,
  };
}