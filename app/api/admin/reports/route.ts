import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // ---------------------------------------------------------
    // BOOKINGS
    // ---------------------------------------------------------

    const { data: bookings, error: bookingsError } =
      await supabase
        .from("bookings")
        .select(`
          id,
          booking_reference,
          guest_name,
          room_type,
          room_id,
          check_in,
          check_out,
          nights,
          room_total,
          breakfast_total,
          grand_total,
          status,
          created_at,
          rooms (
            room_number
          )
        `)
        .order("created_at", { ascending: false });

    if (bookingsError) {
      throw bookingsError;
    }

    // ---------------------------------------------------------
    // ROOMS
    // ---------------------------------------------------------

    const { data: rooms, error: roomsError } =
      await supabase
        .from("rooms")
        .select(`
          id,
          room_number,
          room_type,
          price,
          status
        `)
        .order("room_number");

    if (roomsError) {
      throw roomsError;
    }

    // ---------------------------------------------------------
    // PAYMENTS
    // ---------------------------------------------------------

    const { data: payments, error: paymentsError } =
      await supabase
        .from("payments")
        .select(`
          id,
          booking_id,
          amount,
          payment_method,
          payment_date
        `)
        .order("payment_date", { ascending: false });

    if (paymentsError) {
      throw paymentsError;
    }

    // ---------------------------------------------------------
    // EXPENSES
    // ---------------------------------------------------------

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
          reference,
          notes,
          created_at
        `)
        .order("expense_date", { ascending: false });

    if (expensesError) {
      throw expensesError;
    }

    const allBookings = bookings ?? [];
    const allRooms = rooms ?? [];
    const allPayments = payments ?? [];
    const allExpenses = expenses ?? [];

    // ---------------------------------------------------------
    // BOOKING REVENUE
    // ---------------------------------------------------------

    const totalBookings = allBookings.length;

    const totalRevenue = allBookings.reduce(
      (sum, booking) =>
        sum + Number(booking.grand_total ?? 0),
      0
    );

    const roomRevenue = allBookings.reduce(
      (sum, booking) =>
        sum + Number(booking.room_total ?? 0),
      0
    );

    const breakfastRevenue = allBookings.reduce(
      (sum, booking) =>
        sum + Number(booking.breakfast_total ?? 0),
      0
    );

    const totalNights = allBookings.reduce(
      (sum, booking) =>
        sum + Number(booking.nights ?? 0),
      0
    );

    // ---------------------------------------------------------
    // ACTUAL PAYMENTS
    // ---------------------------------------------------------

    const totalPaymentsReceived = allPayments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    );

    const totalOutstanding = Math.max(
      totalRevenue - totalPaymentsReceived,
      0
    );

    // ---------------------------------------------------------
    // EXPENSES + PROFIT
    // ---------------------------------------------------------

    const totalExpenses = allExpenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount ?? 0),
      0
    );

    const netProfit =
      totalPaymentsReceived - totalExpenses;

    // ---------------------------------------------------------
    // CURRENT MONTH
    // ---------------------------------------------------------

    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyPayments = allPayments
      .filter((payment) => {
        if (!payment.payment_date) {
          return false;
        }

        const date = new Date(payment.payment_date);

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce(
        (sum, payment) =>
          sum + Number(payment.amount ?? 0),
        0
      );

    const monthlyExpenses = allExpenses
      .filter((expense) => {
        if (!expense.expense_date) {
          return false;
        }

        const date = new Date(
          `${expense.expense_date}T00:00:00`
        );

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce(
        (sum, expense) =>
          sum + Number(expense.amount ?? 0),
        0
      );

    const monthlyProfit =
      monthlyPayments - monthlyExpenses;

    // ---------------------------------------------------------
    // BOOKING STATUS
    // ---------------------------------------------------------

    const pendingBookings = allBookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    const confirmedBookings = allBookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;

    const checkedInBookings = allBookings.filter(
      (booking) => booking.status === "checked-in"
    ).length;

    const checkedOutBookings = allBookings.filter(
      (booking) => booking.status === "checked-out"
    ).length;

    const cancelledBookings = allBookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;

    // ---------------------------------------------------------
    // ROOM STATUS
    // ---------------------------------------------------------

    const availableRooms = allRooms.filter(
      (room) => room.status === "available"
    ).length;

    const occupiedRooms = allRooms.filter(
      (room) => room.status === "occupied"
    ).length;

    const reservedRooms = allRooms.filter(
      (room) => room.status === "reserved"
    ).length;

    const cleaningRooms = allRooms.filter(
      (room) => room.status === "cleaning"
    ).length;

    const totalRooms = allRooms.length;

    const occupancyRate =
      totalRooms > 0
        ? Number(
            (
              (occupiedRooms / totalRooms) *
              100
            ).toFixed(1)
          )
        : 0;

    const averageBookingValue =
      totalBookings > 0
        ? Number(
            (
              totalRevenue / totalBookings
            ).toFixed(2)
          )
        : 0;

    // ---------------------------------------------------------
    // PAYMENT STATUS
    // ---------------------------------------------------------

    let paidBookings = 0;
    let partiallyPaidBookings = 0;
    let unpaidBookings = 0;

    const bookingBalances =
      allBookings.map((booking) => {
        const bookingPayments =
          allPayments.filter(
            (payment) =>
              payment.booking_id === booking.id
          );

        const paid =
          bookingPayments.reduce(
            (sum, payment) =>
              sum +
              Number(payment.amount ?? 0),
            0
          );

        const charged =
          Number(booking.grand_total ?? 0);

        const balance = Math.max(
          charged - paid,
          0
        );

        let paymentStatus = "unpaid";

        if (
          charged > 0 &&
          paid >= charged
        ) {
          paymentStatus = "paid";
          paidBookings++;
        } else if (paid > 0) {
          paymentStatus = "partially-paid";
          partiallyPaidBookings++;
        } else {
          unpaidBookings++;
        }

        return {
          booking_id: booking.id,
          booking_reference:
            booking.booking_reference,
          guest_name: booking.guest_name,
          charged,
          paid,
          balance,
          payment_status: paymentStatus,
        };
      });

    // ---------------------------------------------------------
    // EXPENSE CATEGORY BREAKDOWN
    // ---------------------------------------------------------

    const expenseCategories:
      Record<string, number> = {};

    allExpenses.forEach((expense) => {
      const category =
        expense.category || "Other";

      expenseCategories[category] =
        (expenseCategories[category] || 0) +
        Number(expense.amount ?? 0);
    });

    const expenseBreakdown =
      Object.entries(expenseCategories)
        .map(([category, amount]) => ({
          category,
          amount,
        }))
        .sort(
          (a, b) => b.amount - a.amount
        );

    // ---------------------------------------------------------
    // ROOM PERFORMANCE
    // ---------------------------------------------------------

    const roomPerformance =
      allRooms.map((room) => {
        const roomBookings =
          allBookings.filter(
            (booking) =>
              booking.room_id === room.id
          );

        const revenue =
          roomBookings.reduce(
            (sum, booking) =>
              sum +
              Number(
                booking.grand_total ?? 0
              ),
            0
          );

        const nights =
          roomBookings.reduce(
            (sum, booking) =>
              sum +
              Number(booking.nights ?? 0),
            0
          );

        return {
          id: room.id,
          room_number: room.room_number,
          room_type: room.room_type,
          status: room.status,
          bookings: roomBookings.length,
          nights,
          revenue,
        };
      });

    // ---------------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------------

    return NextResponse.json({
      success: true,

      summary: {
        totalBookings,

        totalRevenue,
        roomRevenue,
        breakfastRevenue,

        totalPaymentsReceived,
        totalOutstanding,

        totalExpenses,
        netProfit,

        monthlyPayments,
        monthlyExpenses,
        monthlyProfit,

        totalNights,
        averageBookingValue,
        occupancyRate,
      },

      paymentStatus: {
        paid: paidBookings,
        partiallyPaid:
          partiallyPaidBookings,
        unpaid: unpaidBookings,
      },

      bookingStatus: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        checkedIn: checkedInBookings,
        checkedOut: checkedOutBookings,
        cancelled: cancelledBookings,
      },

      roomStatus: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        reserved: reservedRooms,
        cleaning: cleaningRooms,
      },

      expenseBreakdown,
      roomPerformance,
      bookingBalances,

      payments: allPayments,
      expenses: allExpenses,
      bookings: allBookings,
    });
  } catch (error) {
    console.error(
      "REPORTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate reports.",
      },
      { status: 500 }
    );
  }
}
