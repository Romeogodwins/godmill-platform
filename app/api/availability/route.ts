import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabase/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseClient();
    const body = await request.json();

    const requestedRoomType = body.roomType?.trim();
    const aircon = body.aircon?.trim();
    const checkIn = body.checkIn;
    const checkOut = body.checkOut;

    if (!requestedRoomType || !checkIn || !checkOut) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing booking information.",
        },
        { status: 400 }
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        {
          success: false,
          message: "Check-out date must be after check-in date.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------
    // MAP BOOKING FORM TO DATABASE INVENTORY
    // ------------------------------------------------

    let databaseRoomType: string;
    let expectedPrice: number;

    if (requestedRoomType === "Executive Room") {
      databaseRoomType = "Executive Room";
      expectedPrice = 750;
    } else if (requestedRoomType === "Standard Room") {
      databaseRoomType = "Standard Room";

      if (aircon === "Aircon") {
        expectedPrice = 600;
      } else if (aircon === "No Aircon") {
        expectedPrice = 500;
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please choose an air-conditioning preference.",
          },
          { status: 400 }
        );
      }
    } else if (requestedRoomType === "Family 3 Sleeper") {
      databaseRoomType = "Family Room";

      if (aircon === "Aircon") {
        expectedPrice = 850;
      } else if (aircon === "No Aircon") {
        expectedPrice = 750;
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please choose an air-conditioning preference.",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Unknown room type selected.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------
    // FIND PHYSICAL ROOMS MATCHING THE SELECTION
    // ------------------------------------------------

    const { data: rooms, error: roomsError } =
      await supabase
        .from("rooms")
        .select(`
          id,
          room_number,
          room_type,
          capacity,
          price,
          status
        `)
        .eq("room_type", databaseRoomType)
        .eq("price", expectedPrice)
        .order("room_number", {
          ascending: true,
        });

    if (roomsError) {
      throw roomsError;
    }

    const roomList = rooms ?? [];

    if (roomList.length === 0) {
      return NextResponse.json({
        success: false,
        message:
          "No rooms matching this room type and air-conditioning option exist.",
      });
    }

    // Cleaning/maintenance rooms should not be sold.
    //
    // We deliberately do not exclude "occupied" or "reserved"
    // here because those are CURRENT operational statuses.
    // Future availability is determined by booking dates.
    const usableRooms = roomList.filter(
      (room) =>
        room.status !== "cleaning" &&
        room.status !== "maintenance"
    );

    if (usableRooms.length === 0) {
      return NextResponse.json({
        success: false,
        message:
          "Rooms matching this selection are temporarily unavailable.",
      });
    }

    // ------------------------------------------------
    // FIND OVERLAPPING ACTIVE BOOKINGS
    // ------------------------------------------------

    const { data: bookings, error: bookingsError } =
      await supabase
        .from("bookings")
        .select(`
          id,
          room_id,
          booking_reference,
          check_in,
          check_out,
          status
        `)
        .lt("check_in", checkOut)
        .gt("check_out", checkIn)
        .in("status", [
          "pending",
          "confirmed",
          "checked-in",
        ]);

    if (bookingsError) {
      throw bookingsError;
    }

    const blockedRoomIds = new Set(
      (bookings ?? [])
        .map((booking) => booking.room_id)
        .filter(
          (roomId): roomId is string =>
            typeof roomId === "string" &&
            roomId.length > 0
        )
    );

    // ------------------------------------------------
    // AVAILABLE PHYSICAL ROOMS
    // ------------------------------------------------

    const availableRooms = usableRooms.filter(
      (room) => !blockedRoomIds.has(room.id)
    );

    if (availableRooms.length === 0) {
      return NextResponse.json({
        success: false,
        message:
          "All rooms matching this selection are booked for the selected dates.",
        availableCount: 0,
      });
    }

    // First matching room is allocated by the availability
    // check. The booking API can store this room ID.
    const availableRoom = availableRooms[0];

    return NextResponse.json({
      success: true,

      room: availableRoom,

      availableCount: availableRooms.length,

      availableRooms,

      selection: {
        requestedRoomType,
        databaseRoomType,
        aircon:
          requestedRoomType === "Executive Room"
            ? "Aircon"
            : aircon,
        price: expectedPrice,
      },

      message: `${availableRooms.length} room${
        availableRooms.length === 1 ? "" : "s"
      } available.`,
    });
  } catch (error) {
    console.error(
      "AVAILABILITY API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Could not check room availability.",
      },
      {
        status: 500,
      }
    );
  }
}
