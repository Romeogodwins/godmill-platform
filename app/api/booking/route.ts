import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  bookingSource?: string;
  companyName?: string;
  ratePlan?: string;
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdminClient();

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
      payload.roomType === "Standard Room"
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

    if (payload.roomId) {
      assignedRoom =
        usableRooms.find(
          (room) =>
            room.id === payload.roomId &&
            !blockedRoomIds.has(room.id)
        ) ?? null;
    }

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
  `GMC-${Date.now()
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

        booking_source:
          payload.bookingSource?.trim() ||
          "website",

        company_name:
          payload.companyName?.trim() ||
          null,

        rate_plan:
          payload.ratePlan?.trim() ||
          "standard",

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

      // Clean up the guest row created for a booking that did not complete.
      await supabase
        .from("guests")
        .delete()
        .eq("id", guestData.id);

      const isDoubleBooking =
        bookingError.code === "23P01" ||
        bookingError.message?.includes("ROOM_DOUBLE_BOOKING");

      return NextResponse.json(
        {
          success: false,
          message: isDoubleBooking
            ? "That room was just taken for the selected dates. Please try again and we will allocate another available room."
            : bookingError.message,
        },
        { status: isDoubleBooking ? 409 : 500 }
      );
    }

    // ---------------------------------------------
    // EMAIL NOTIFICATIONS
    // ---------------------------------------------

    try {
      const formatMoney = (amount: number) =>
        new Intl.NumberFormat("en-ZA", {
          style: "currency",
          currency: "ZAR",
        }).format(amount);

      const roomDescription =
        `${payload.roomType} - ${
          hasAircon ? "Aircon" : "No Aircon"
        }`;

      // -------------------------------------------
      // GUEST CONFIRMATION EMAIL
      // -------------------------------------------

      const bookingDetailsHtml = `
        <div style="
          margin:0;
          padding:20px;
          background:#f5f5f5;
          font-family:Arial,Helvetica,sans-serif;
          color:#222;
        ">

          <div style="
            max-width:680px;
            margin:0 auto;
            background:#ffffff;
            border-radius:14px;
            overflow:hidden;
            box-shadow:0 4px 18px rgba(0,0,0,0.08);
          ">

            <div style="
              background:#111111;
              padding:32px 25px;
              text-align:center;
            ">
              <h1 style="
                color:#d4b16f;
                margin:0;
                font-size:28px;
              ">
                GODMILL CITY GUESTHOUSE
              </h1>

              <p style="
                color:#ffffff;
                margin:10px 0 0;
                font-size:16px;
              ">
                Booking Received
              </p>
            </div>

            <div style="padding:30px;">

              <p style="font-size:16px;">
                Dear <strong>${payload.guestName.trim()}</strong>,
              </p>

              <p style="line-height:1.7;">
                Thank you for choosing Godmill City Guesthouse.
                We have successfully received your reservation request.
              </p>

              <div style="
                background:#f7f1e5;
                border-left:4px solid #d4b16f;
                padding:18px;
                margin:25px 0;
              ">
                <div style="
                  font-size:13px;
                  color:#666;
                  margin-bottom:5px;
                ">
                  BOOKING REFERENCE
                </div>

                <div style="
                  font-size:24px;
                  font-weight:bold;
                  color:#111;
                ">
                  ${bookingReference}
                </div>
              </div>

              <h2 style="
                font-size:20px;
                margin-top:30px;
                color:#111;
              ">
                Reservation Details
              </h2>

              <table style="
                width:100%;
                border-collapse:collapse;
                margin:15px 0 25px;
              ">

                <tr>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    <strong>Room</strong>
                  </td>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    ${roomDescription}
                  </td>
                </tr>

                <tr>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    <strong>Check-in</strong>
                  </td>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    ${payload.checkIn}
                  </td>
                </tr>

                <tr>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    <strong>Check-out</strong>
                  </td>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    ${payload.checkOut}
                  </td>
                </tr>

                <tr>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    <strong>Nights</strong>
                  </td>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    ${nights}
                  </td>
                </tr>

                <tr>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    <strong>Guests</strong>
                  </td>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    ${adults} adult(s), ${children} child(ren)
                  </td>
                </tr>

                <tr>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    <strong>Room total</strong>
                  </td>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    ${formatMoney(roomTotal)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    <strong>Breakfast</strong>
                  </td>
                  <td style="padding:11px;border-bottom:1px solid #eee;">
                    ${
                      payload.breakfast
                        ? formatMoney(breakfastTotal)
                        : "Not included"
                    }
                  </td>
                </tr>

              </table>

              <div style="
                background:#111111;
                color:#ffffff;
                padding:20px;
                border-radius:10px;
                margin:25px 0;
              ">

                <div style="
                  font-size:13px;
                  color:#d4b16f;
                  margin-bottom:7px;
                  text-transform:uppercase;
                ">
                  Amount Due
                </div>

                <div style="
                  font-size:30px;
                  font-weight:bold;
                ">
                  ${formatMoney(grandTotal)}
                </div>

              </div>

              <div style="
                border:2px solid #d4b16f;
                border-radius:12px;
                padding:24px;
                margin-top:30px;
              ">

                <h2 style="
                  margin:0 0 15px;
                  color:#111;
                  font-size:21px;
                ">
                  Payment Details
                </h2>

                <p style="
                  line-height:1.7;
                  margin-top:0;
                ">
                  If you have not yet made payment,
                  please make payment using the banking
                  details below.
                </p>

                <table style="
                  width:100%;
                  border-collapse:collapse;
                  margin:18px 0;
                ">

                  <tr>
                    <td style="padding:8px 0;">
                      <strong>Bank</strong>
                    </td>
                    <td style="padding:8px 0;">
                      FNB
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:8px 0;">
                      <strong>Account Name</strong>
                    </td>
                    <td style="padding:8px 0;">
                      Godmill
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:8px 0;">
                      <strong>Account Number</strong>
                    </td>
                    <td style="padding:8px 0;">
                      62836688616
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:8px 0;">
                      <strong>Account Type</strong>
                    </td>
                    <td style="padding:8px 0;">
                      Current Account
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:8px 0;">
                      <strong>Payment Reference</strong>
                    </td>
                    <td style="
                      padding:8px 0;
                      font-weight:bold;
                      color:#9b762f;
                    ">
                      ${bookingReference}
                    </td>
                  </tr>

                </table>

                <p style="
                  line-height:1.7;
                  margin-bottom:0;
                ">
                  Please use
                  <strong>${bookingReference}</strong>
                  as your payment reference so that we
                  can identify your payment.
                </p>

              </div>

              <div style="
                background:#fff8e8;
                padding:18px;
                border-radius:10px;
                margin-top:20px;
                line-height:1.7;
              ">
                <strong>Important:</strong>
                Your booking is currently
                <strong>pending</strong>.
                Your reservation will be confirmed once
                payment has been received and verified.
              </div>

              <p style="
                margin-top:25px;
                line-height:1.7;
              ">
                After making payment, please upload your
                proof of payment through the booking page
                or contact Godmill City Guesthouse for
                assistance.
              </p>

              <div style="
                margin-top:30px;
                padding-top:22px;
                border-top:1px solid #eeeeee;
                line-height:1.8;
              ">

                <strong>Godmill City Guesthouse</strong><br>
                Taung, North West<br>
                Tel: 079 058 2637<br>
                Email:
                bookings@godmillcityguesthouse.com

              </div>

            </div>

          </div>

        </div>
      `;

      if (payload.email?.trim()) {
        const {
          error: guestEmailError,
        } = await resend.emails.send({
          from:
            "Godmill City Guesthouse <bookings@godmillcityguesthouse.com>",

          to: [
            payload.email.trim(),
          ],

          replyTo:
            "bookings@godmillcityguesthouse.com",

          subject:
            `Booking received - ${bookingReference}`,

          html:
            bookingDetailsHtml,
        });

        if (guestEmailError) {
          console.error(
            "GUEST BOOKING EMAIL ERROR:",
            guestEmailError
          );
        }
      }

      // -------------------------------------------
      // GODMILL INTERNAL BOOKING NOTIFICATION
      // -------------------------------------------

      const {
        error: adminEmailError,
      } = await resend.emails.send({
        from:
          "Godmill Booking System <bookings@godmillcityguesthouse.com>",

        to: [
          "godmillcity547@gmail.com",
        ],

        replyTo:
          payload.email?.trim() ||
          "bookings@godmillcityguesthouse.com",

        subject:
          `New booking - ${bookingReference} - ${payload.guestName.trim()}`,

        html: `
          <div style="
            font-family:Arial,Helvetica,sans-serif;
            max-width:650px;
            margin:auto;
            color:#222;
          ">

            <div style="
              background:#111;
              padding:25px;
            ">
              <h1 style="
                margin:0;
                color:#d4b16f;
              ">
                New Godmill Booking
              </h1>
            </div>

            <div style="
              padding:25px;
              border:1px solid #eee;
            ">

              <p>
                <strong>Reference:</strong>
                ${bookingReference}
              </p>

              <p>
                <strong>Guest:</strong>
                ${payload.guestName.trim()}
              </p>

              <p>
                <strong>Phone:</strong>
                ${payload.phone.trim()}
              </p>

              <p>
                <strong>Email:</strong>
                ${
                  payload.email?.trim() ||
                  "Not supplied"
                }
              </p>

              <p>
                <strong>Room:</strong>
                ${roomDescription}
              </p>

              <p>
                <strong>Room number:</strong>
                ${assignedRoom.room_number}
              </p>

              <p>
                <strong>Check-in:</strong>
                ${payload.checkIn}
              </p>

              <p>
                <strong>Check-out:</strong>
                ${payload.checkOut}
              </p>

              <p>
                <strong>Nights:</strong>
                ${nights}
              </p>

              <p>
                <strong>Guests:</strong>
                ${adults} adult(s),
                ${children} child(ren)
              </p>

              <p>
                <strong>Breakfast:</strong>
                ${
                  payload.breakfast
                    ? "Yes"
                    : "No"
                }
              </p>

              <div style="
                background:#f7f1e5;
                padding:18px;
                margin:20px 0;
                border-left:4px solid #d4b16f;
              ">
                <strong>Amount Due:</strong>
                ${formatMoney(grandTotal)}
              </div>

              <p>
                <strong>Payment Reference:</strong>
                ${bookingReference}
              </p>

              <p>
                <strong>Status:</strong>
                Pending
              </p>

              ${
                payload.specialRequests?.trim()
                  ? `
                    <p>
                      <strong>Special requests:</strong>
                      ${payload.specialRequests.trim()}
                    </p>
                  `
                  : ""
              }

            </div>
          </div>
        `,
      });

      if (adminEmailError) {
        console.error(
          "ADMIN BOOKING EMAIL ERROR:",
          adminEmailError
        );
      }
    } catch (emailError) {
      // A valid booking must remain successful even
      // if the email provider is temporarily unavailable.
      console.error(
        "BOOKING EMAIL NOTIFICATION ERROR:",
        emailError
      );
    }

    // ---------------------------------------------
    // IMPORTANT:
    // Do NOT mark a future room "reserved" here.
    //
    // rooms.status represents its CURRENT
    // operational state. Booking dates reserve
    // the room for future dates.
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
