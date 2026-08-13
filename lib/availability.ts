import { supabase } from "./supabase";

export async function getAvailableRoom(
  roomType: string,
  checkIn: string,
  checkOut: string
) {
  // Get all rooms of the selected type
  const { data: rooms, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_type", roomType)
    .eq("status", "available");

  if (roomError) throw roomError;

  if (!rooms || rooms.length === 0) {
    return null;
  }

  // Get overlapping bookings
  const { data: bookings, error: bookingError } = await supabase
    .from("bookings")
    .select("room_id")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  if (bookingError) throw bookingError;

  const occupiedRoomIds = new Set(
    (bookings ?? []).map((b) => b.room_id).filter(Boolean)
  );

  const availableRoom = rooms.find(
    (room) => !occupiedRoomIds.has(room.id)
  );

  return availableRoom ?? null;
}