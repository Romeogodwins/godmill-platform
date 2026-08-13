import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabase/client";

export const dynamic = "force-dynamic";

interface BookingPayload {
  roomId?: string;

  checkIn: string;
  checkOut: string;

  adults: string;
  children: string;

  roomType: string;
  aircon: string;

  breakfast: boolean;

  guestName: string;
  email: string;
  phone: string;

  specialRequests: string;
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseClient();

    const payload =
      (await request.json()) as BookingPayload;

    // ---------------------------------------------
    // BASIC VALIDATION
    // ---------------------------------------------

    if (
      !payload.checkIn ||
      !payload.checkOut ||
      !payload.roomType ||
      !payload.guestName?.trim() ||
      !payload.phone?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all required booking information.",
        },
        { status: 400 }
      );
    }

    if (payload.checkOut <= payload.checkIn) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Check-out date must be after check-in date.",
        },
        { status: 400 }
      );
    }

    const adults = Number(payload.adults || 0);
    const children = Number(payload.children || 0);
    const totalGuests = adults + children;

    if (
      !Number.isFinite(adults) ||
      !Number.isFinite(children) ||
      adults < 1 ||
      children < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid number of guests.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // MAP PUBLIC ROOM NAMES TO DATABASE INVENTORY
    // ---------------------------------------------

    let databaseRoomType: string;
    let expectedPrice: number;
    let capacity: number;
    let hasAircon: boolean;

    if (payload.roomType === "Executive Room") {
      databaseRoomType = "Executive Room";
      expectedPrice = 750;
      capacity = 2;
      hasAircon = true;
    } else if (
      payload.roomType === "Standard 2 Sleeper"
    ) {
      databaseRoomType = "Standard Room";
      capacity = 2;

      if (payload.aircon === "Aircon") {
        expectedPrice = 600;
        hasAircon = true;
      } else if (payload.aircon === "No Aircon") {
        expectedPrice = 500;
        hasAircon = false;
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please select an air-conditioning option.",
          },
          { status: 400 }
        );
      }
    } else if (
      payload.roomType === "Family 3 Sleeper"
    ) {
      databaseRoomType = "Family Room";
      capacity = 3;

      if (payload.aircon === "Aircon") {
        expectedPrice = 850;
        hasAircon = true;
      } else if (payload.aircon === "No Aircon") {
        expectedPrice = 750;
        hasAircon = false;
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please select an air-conditioning option.",
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

    // ---------------------------------------------
    // CAPACITY CHECK
    // ---------------------------------------------

    if (totalGuests > capacity) {
      return NextResponse.json(
        {
          success: false,
          message:
            `${payload.roomType} accommodates a maximum ` +
            `of ${capacity} guest${capacity === 1 ? "" : "s"}. ` +
            `You selected ${totalGuests}.`,
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // CALCULATE NIGHTS
    // ---------------------------------------------

    const checkInDate = new Date(
      `${payload.checkIn}T00:00:00`
    );

    const checkOutDate = new Date(
      `${payload.checkOut}T00:00:00`
    );

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights = Math.round(
      (checkOutDate.getTime() -
        checkInDate.getTime()) /
        millisecondsPerDay
    );

    if (
      !Number.isFinite(nights) ||
      nights < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The booking must be for at least one night.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // LOAD MATCHING PHYSICAL ROOMS
    // ---------------------------------------------

    const {
      data: matchingRooms,
      error: roomsError,
    } = await supabase
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

    const usableRooms = (matchingRooms ?? []).filter(
      (room) =>
        room.status !== "cleaning" &&
        room.status !== "maintenance"
    );

    if (usableRooms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No rooms matching this selection are currently available.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // CHECK DATE OVERLAPS
    // ---------------------------------------------

    const {
      data: overlappingBookings,
      error: overlapError,
    } = await supabase
      .from("bookings")
      .select(`
        id,
        room_id,
        check_in,
        check_out,
        status
      `)
      .lt("check_in", payload.checkOut)
      .gt("check_out", payload.checkIn)
      .in("status", [
        "pending",
        "confirmed",
        "checked-in",
      ]);

    if (overlapError) {
      throw overlapError;
    }

    const blockedRoomIds = new Set(
      (overlappingBookings ?? [])
        .map((booking) => booking.room_id)
        .filter(
          (roomId): roomId is string =>
            typeof roomId === "string" &&
            roomId.length > 0
        )
    );

    // ---------------------------------------------
    // ASSIGN PHYSICAL ROOM
    // ---------------------------------------------

    let assignedRoom = null;

    // Prefer the room returned by the earlier
    // availability check when it is still free.
    if (payload.roomId) {
      assignedRoom =
        usableRooms.find(
          (room) =>
            room.id === payload.roomId &&
            !blockedRoomIds.has(room.id)
        ) ?? null;
    }

    // Otherwise assign the first free matching room.
    if (!assignedRoom) {
      assignedRoom =
        usableRooms.find(
          (room) =>
            !blockedRoomIds.has(room.id)
        ) ?? null;
    }

    if (!assignedRoom) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No available room for the selected dates.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // SERVER-SIDE PRICING
    // ---------------------------------------------

    const roomTotal =
      nights * expectedPrice;

    const breakfastTotal =
      payload.breakfast
        ? totalGuests * 120 * nights
        : 0;

    const grandTotal =
      roomTotal + breakfastTotal;

    // ---------------------------------------------
    // CREATE BOOKING REFERENCE
    // ---------------------------------------------

    const bookingReference =
      `GCM-${Date.now()
        .toString()
        .slice(-6)}`;

    // ---------------------------------------------
    // CREATE GUEST
    // ---------------------------------------------

    const {
      data: guestData,
      error: guestError,
    } = await supabase
      .from("guests")
      .insert({
        full_name: payload.guestName.trim(),
        phone: payload.phone.trim(),
        email:
          payload.email?.trim() || null,
      })
      .select("id")
      .single();

    if (guestError) {
      console.error(
        "GUEST INSERT ERROR:",
        guestError
      );

      return NextResponse.json(
        {
          success: false,
          message: guestError.message,
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // CREATE BOOKING
    // ---------------------------------------------

    const {
      data: booking,
      error: bookingError,
    } = await supabase
      .from("bookings")
      .insert({
        booking_reference:
          bookingReference,

        guest_id: guestData.id,

        room_id: assignedRoom.id,

        guest_name:
          payload.guestName.trim(),

        phone: payload.phone.trim(),

        email:
          payload.email?.trim() || null,

        // Keep the customer-facing room name
        // on the booking record.
        room_type: payload.roomType,

        aircon: hasAircon,

        adults,
        children,

        breakfast: Boolean(
          payload.breakfast
        ),

        check_in: payload.checkIn,
        check_out: payload.checkOut,

        nights,

        room_total: roomTotal,

        breakfast_total:
          breakfastTotal,

        grand_total: grandTotal,

        special_requests:
          payload.specialRequests?.trim() ||
          null,

        status: "pending",
      })
      .select(`
        id,
        booking_reference,
        guest_name,
        room_id,
        room_type,
        aircon,
        adults,
        children,
        breakfast,
        check_in,
        check_out,
        nights,
        room_total,
        breakfast_total,
        grand_total,
        status
      `)
      .single();

    if (bookingError) {
      console.error(
        "BOOKING INSERT ERROR:",
        bookingError
      );

      return NextResponse.json(
        {
          success: false,
          message: bookingError.message,
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // IMPORTANT:
    // Do NOT mark a future room "reserved" here.
    //
    // rooms.status represents its CURRENT
    // operational state. The booking dates are
    // what reserve it for future dates.
    // ---------------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Booking created successfully.",

      bookingReference,

      booking,

      room: {
        id: assignedRoom.id,
        room_number:
          assignedRoom.room_number,
        room_type:
          assignedRoom.room_type,
        price:
          Number(assignedRoom.price),
        capacity:
          assignedRoom.capacity,
      },

      pricing: {
        nights,
        roomRate: expectedPrice,
        roomTotal,
        breakfastTotal,
        grandTotal,
      },
    });
  } catch (error) {
    console.error(
      "BOOKING ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create booking.",
      },
      {
        status: 500,
      }
    );
  }
}