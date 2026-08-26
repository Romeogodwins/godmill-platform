import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data: expenses, error } = await supabase
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
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("EXPENSES GET ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    const safeExpenses = expenses ?? [];

    const totalExpenses = safeExpenses.reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = safeExpenses
      .filter((expense) => {
        const date = new Date(
          `${expense.expense_date}T00:00:00`
        );

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      );

    const categoryTotals: Record<string, number> = {};

    safeExpenses.forEach((expense) => {
      const category = expense.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(expense.amount || 0);
    });

    return NextResponse.json({
      success: true,

      summary: {
        totalExpenses,
        monthlyExpenses,
        expenseCount: safeExpenses.length,
        categoryTotals,
      },

      expenses: safeExpenses,
    });
  } catch (error) {
    console.error("EXPENSES GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load expenses.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdminClient();

    const body = await request.json();

    const expenseDate =
      body.expenseDate?.trim() || null;

    const category =
      body.category?.trim() || "";

    const description =
      body.description?.trim() || "";

    const amount = Number(body.amount);

    const paymentMethod =
      body.paymentMethod?.trim() || "cash";

    const supplier =
      body.supplier?.trim() || null;

    const reference =
      body.reference?.trim() || null;

    const notes =
      body.notes?.trim() || null;

    if (!expenseDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense date is required.",
        },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense category is required.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense description is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid expense amount.",
        },
        { status: 400 }
      );
    }

    const { data: expense, error } =
      await supabase
        .from("expenses")
        .insert({
          expense_date: expenseDate,
          category,
          description,
          amount,
          payment_method: paymentMethod,
          supplier,
          reference,
          notes,
        })
        .select()
        .single();

    if (error) {
      console.error(
        "EXPENSE INSERT ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense recorded successfully.",
      expense,
    });
  } catch (error) {
    console.error("EXPENSES POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to record expense.",
      },
      { status: 500 }
    );
  }
}

