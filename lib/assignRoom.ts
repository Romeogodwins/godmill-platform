import { createSupabaseClient } from "./supabase/client";

export async function assignAvailableRoom(
  roomType: string,
  checkIn: string,
  checkOut: string
) {
  const supabase = createSupabaseClient();

  // Get all rooms of the requested type
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_type", roomType)
    .order("room_number");

  if (error) {
    throw error;
  }

  if (!rooms || rooms.length === 0) {
    return null;
  }

  for (const room of rooms) {
    // Check whether this room already has an overlapping booking
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("room_id", room.id)
      .neq("status", "cancelled")
      .lt("check_in", checkOut)
      .gt("check_out", checkIn);

    if (!existing || existing.length === 0) {
      return room;
    }
  }

  return null;
}