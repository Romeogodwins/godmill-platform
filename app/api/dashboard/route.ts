import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createSupabaseClient();

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // ------------------------------------------------
    // ROOMS
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
        .order("room_number", {
          ascending: true,
        });

    if (roomsError) {
      throw roomsError;
    }

    const roomList = rooms ?? [];

    const availableRooms = roomList.filter(
      (room) => room.status === "available"
    ).length;

    const occupiedRooms = roomList.filter(
      (room) => room.status === "occupied"
    ).length;

    const cleaningRooms = roomList.filter(
      (room) => room.status === "cleaning"
    ).length;

    const reservedRooms = roomList.filter(
      (room) => room.status === "reserved"
    ).length;

    // ------------------------------------------------
    // ALL BOOKINGS
    // ------------------------------------------------

    const { data: allBookings, error: allBookingsError } =
      await supabase
        .from("bookings")
        .select(`
          id,
          booking_reference,
          guest_name,
          phone,
          email,
          room_type,
          check_in,
          check_out,
          status,
          room_id,
          adults,
          children,
          grand_total,
          created_at,
          rooms (
            room_number
          )
        `)
        .order("created_at", {
          ascending: false,
        });

    if (allBookingsError) {
      throw allBookingsError;
    }

    const bookingList = allBookings ?? [];

    // ------------------------------------------------
    // TODAY'S ARRIVALS / DEPARTURES
    // ------------------------------------------------

    const arrivals = bookingList.filter(
      (booking) =>
        booking.check_in === today &&
        [
          "pending",
          "confirmed",
          "checked-in",
        ].includes(booking.status)
    ).length;

    const departures = bookingList.filter(
      (booking) =>
        booking.check_out === today &&
        [
          "confirmed",
          "checked-in",
          "checked-out",
        ].includes(booking.status)
    ).length;

    // ------------------------------------------------
    // ACTIVE BOOKINGS
    // ------------------------------------------------

    const activeBookings = bookingList
      .filter(
        (booking) =>
          [
            "pending",
            "confirmed",
            "checked-in",
          ].includes(booking.status) &&
          booking.check_out >= today
      )
      .sort((a, b) =>
        a.check_in.localeCompare(b.check_in)
      );

    // ------------------------------------------------
    // PAYMENTS
    // ------------------------------------------------

    const { data: payments, error: paymentsError } =
      await supabase
        .from("payments")
        .select(`
          id,
          booking_id,
          amount,
          payment_method,
          payment_reference,
          payment_date
        `)
        .order("payment_date", {
          ascending: false,
        });

    if (paymentsError) {
      throw paymentsError;
    }

    const paymentList = payments ?? [];

    const totalPaymentsReceived =
      paymentList.reduce(
        (sum, payment) =>
          sum + Number(payment.amount ?? 0),
        0
      );

    const paymentsToday =
      paymentList
        .filter((payment) => {
          if (!payment.payment_date) {
            return false;
          }

          return (
            payment.payment_date.slice(0, 10) ===
            today
          );
        })
        .reduce(
          (sum, payment) =>
            sum +
            Number(payment.amount ?? 0),
          0
        );

    const paymentsMonth =
      paymentList
        .filter((payment) => {
          if (!payment.payment_date) {
            return false;
          }

          const date = new Date(
            payment.payment_date
          );

          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() ===
              currentYear
          );
        })
        .reduce(
          (sum, payment) =>
            sum +
            Number(payment.amount ?? 0),
          0
        );

    // ------------------------------------------------
    // EXPENSES
    // ------------------------------------------------

    const { data: expenses, error: expensesError } =
      await supabase
        .from("expenses")
        .select(`
          id,
          expense_date,
          category,
          description,
          amount,
          payment_method,
          supplier,
          created_at
        `)
        .order("expense_date", {
          ascending: false,
        });

    if (expensesError) {
      throw expensesError;
    }

    const expenseList = expenses ?? [];

    const totalExpenses =
      expenseList.reduce(
        (sum, expense) =>
          sum + Number(expense.amount ?? 0),
        0
      );

    const expensesToday =
      expenseList
        .filter(
          (expense) =>
            expense.expense_date === today
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(expense.amount ?? 0),
          0
        );

    const expensesMonth =
      expenseList
        .filter((expense) => {
          if (!expense.expense_date) {
            return false;
          }

          const date = new Date(
            `${expense.expense_date}T00:00:00`
          );

          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() ===
              currentYear
          );
        })
        .reduce(
          (sum, expense) =>
            sum +
            Number(expense.amount ?? 0),
          0
        );

    // ------------------------------------------------
    // BOOKING VALUE / OUTSTANDING
    // ------------------------------------------------

    const totalBookedRevenue =
      bookingList.reduce(
        (sum, booking) =>
          sum +
          Number(booking.grand_total ?? 0),
        0
      );

    const totalOutstanding = Math.max(
      totalBookedRevenue -
        totalPaymentsReceived,
      0
    );

    // ------------------------------------------------
    // PROFIT
    // ------------------------------------------------

    const netProfit =
      totalPaymentsReceived -
      totalExpenses;

    const monthlyProfit =
      paymentsMonth -
      expensesMonth;

    const profitToday =
      paymentsToday -
      expensesToday;

    // ------------------------------------------------
    // RECENT ACTIVITY
    // ------------------------------------------------

    const recentBookings =
      bookingList.slice(0, 5);

    const recentPayments =
      paymentList.slice(0, 5);

    const recentExpenses =
      expenseList.slice(0, 5);

    // ------------------------------------------------
    // RESPONSE
    // ------------------------------------------------

    return NextResponse.json({
      success: true,

      date: today,

      arrivals,
      departures,

      availableRooms,
      occupiedRooms,
      cleaningRooms,
      reservedRooms,
      totalRooms: roomList.length,

      activeBookings:
        activeBookings.length,

      financial: {
        totalBookedRevenue,
        totalPaymentsReceived,
        totalOutstanding,
        totalExpenses,
        netProfit,

        paymentsToday,
        expensesToday,
        profitToday,

        paymentsMonth,
        expensesMonth,
        monthlyProfit,
      },

      bookings: activeBookings,

      recentBookings,
      recentPayments,
      recentExpenses,
    });
  } catch (error) {
    console.error(
      "DASHBOARD API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        arrivals: 0,
        departures: 0,

        availableRooms: 0,
        occupiedRooms: 0,
        cleaningRooms: 0,
        reservedRooms: 0,
        totalRooms: 0,

        activeBookings: 0,

        financial: {
          totalBookedRevenue: 0,
          totalPaymentsReceived: 0,
          totalOutstanding: 0,
          totalExpenses: 0,
          netProfit: 0,

          paymentsToday: 0,
          expensesToday: 0,
          profitToday: 0,

          paymentsMonth: 0,
          expensesMonth: 0,
          monthlyProfit: 0,
        },

        bookings: [],
        recentBookings: [],
        recentPayments: [],
        recentExpenses: [],

        message:
          error instanceof Error
            ? error.message
            : "Unable to load dashboard.",
      },
      {
        status: 500,
      }
    );
  }
}