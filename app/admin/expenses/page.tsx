"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface Expense {
  id: string;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: string;
  supplier: string | null;
  reference: string | null;
  notes: string | null;
  created_at: string;
}

interface Summary {
  totalExpenses: number;
  monthlyExpenses: number;
  expenseCount: number;
  categoryTotals: Record<string, number>;
}

interface ExpensesResponse {
  success: boolean;
  summary: Summary;
  expenses: Expense[];
  message?: string;
}

const categories = [
  "Electricity",
  "Water",
  "Salaries",
  "Cleaning",
  "Maintenance",
  "Laundry",
  "Wi-Fi",
  "Food & Breakfast",
  "Transport",
  "Guest Supplies",
  "Rates & Taxes",
  "Marketing",
  "Repairs",
  "Furniture & Equipment",
  "Other",
];

function money(value: number) {
  return `R ${Number(value || 0).toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function today() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 10);
}

export default function ExpensesPage() {
  const [data, setData] = useState<ExpensesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [expenseDate, setExpenseDate] = useState(today());
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [supplier, setSupplier] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/expenses", {
        cache: "no-store",
      });

      const result = (await response.json()) as ExpensesResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load expenses.");
      }

      setData(result);
    } catch (err) {
      console.error("EXPENSES LOAD ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load expenses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const filteredExpenses = useMemo(() => {
    if (!data) return [];

    const term = search.trim().toLowerCase();
    if (!term) return data.expenses;

    return data.expenses.filter((expense) =>
      [
        expense.category,
        expense.description,
        expense.payment_method,
        expense.supplier ?? "",
        expense.reference ?? "",
        expense.notes ?? "",
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [data, search]);

  const topCategories = useMemo(() => {
    const totals = data?.summary.categoryTotals ?? {};
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [data]);

  function resetForm() {
    setExpenseDate(today());
    setCategory(categories[0]);
    setDescription("");
    setAmount("");
    setPaymentMethod("cash");
    setSupplier("");
    setReference("");
    setNotes("");
  }

  async function saveExpense() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const numericAmount = Number(amount);

      if (!expenseDate) throw new Error("Expense date is required.");
      if (!category) throw new Error("Expense category is required.");
      if (!description.trim()) {
        throw new Error("Expense description is required.");
      }
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw new Error("Enter a valid expense amount.");
      }

      const response = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expenseDate,
          category,
          description,
          amount: numericAmount,
          paymentMethod,
          supplier,
          reference,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to record expense.");
      }

      resetForm();
      setShowForm(false);
      setMessage(`Expense of ${money(numericAmount)} recorded successfully.`);
      await loadExpenses();
    } catch (err) {
      console.error("EXPENSE SAVE ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Unable to record expense."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <p className="text-gray-400">Loading expenses...</p>
      </main>
    );
  }

  const summary = data?.summary;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
              Godmill Hotel Management
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Expenses</h1>
            <p className="mt-3 text-gray-400">
              Record operating costs and track where the guesthouse is spending money.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadExpenses}
              className="rounded-full border border-[#d4b16f]/40 px-6 py-3 font-semibold text-[#d4b16f]"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                setShowForm(true);
              }}
              className="rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="mt-3 text-3xl font-bold text-red-400">
              {money(summary?.totalExpenses ?? 0)}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
            <p className="text-sm text-gray-500">This Month</p>
            <p className="mt-3 text-3xl font-bold text-[#d4b16f]">
              {money(summary?.monthlyExpenses ?? 0)}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
            <p className="text-sm text-gray-500">Expense Records</p>
            <p className="mt-3 text-3xl font-bold">
              {summary?.expenseCount ?? 0}
            </p>
          </div>
        </div>

        {topCategories.length > 0 && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#111111] p-6">
            <h2 className="text-xl font-bold">Top Expense Categories</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topCategories.map(([name, total]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-2xl bg-black px-4 py-4"
                >
                  <span className="text-sm text-gray-400">{name}</span>
                  <span className="font-bold">{money(total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search category, description, supplier, reference or notes..."
            className="w-full rounded-2xl border border-white/10 bg-[#111111] px-5 py-4 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
          <div className="border-b border-white/10 p-7">
            <h2 className="text-2xl font-bold">Expense History</h2>
            <p className="mt-2 text-sm text-gray-500">
              {filteredExpenses.length} expense record
              {filteredExpenses.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-black/40">
                <tr className="text-left text-sm text-gray-400">
                  <th className="px-5 py-5">Date</th>
                  <th className="px-5 py-5">Category</th>
                  <th className="px-5 py-5">Description</th>
                  <th className="px-5 py-5">Supplier</th>
                  <th className="px-5 py-5">Method</th>
                  <th className="px-5 py-5">Reference</th>
                  <th className="px-5 py-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-t border-white/[0.06]"
                  >
                    <td className="whitespace-nowrap px-5 py-5">
                      {formatDate(expense.expense_date)}
                    </td>
                    <td className="px-5 py-5">
                      <span className="rounded-full border border-[#d4b16f]/25 bg-[#d4b16f]/10 px-3 py-1 text-xs font-semibold text-[#d4b16f]">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-semibold">{expense.description}</p>
                      {expense.notes && (
                        <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                          {expense.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-5 text-gray-300">
                      {expense.supplier || "—"}
                    </td>
                    <td className="px-5 py-5">
                      {formatLabel(expense.payment_method)}
                    </td>
                    <td className="px-5 py-5 text-gray-400">
                      {expense.reference || "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 text-right font-bold text-red-400">
                      {money(expense.amount)}
                    </td>
                  </tr>
                ))}

                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111111] shadow-2xl">
              <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/10 bg-[#111111] p-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#d4b16f]">
                    Operating Costs
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">Add Expense</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                  className="rounded-full border border-white/10 px-4 py-2 text-gray-300 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">
                <label className="block text-sm text-gray-300">
                  Expense Date
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(event) => setExpenseDate(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#d4b16f]"
                  />
                </label>

                <label className="block text-sm text-gray-300">
                  Category
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#d4b16f]"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-gray-300 md:col-span-2">
                  Description
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="e.g. Prepaid electricity"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
                  />
                </label>

                <label className="block text-sm text-gray-300">
                  Amount
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-[#d4b16f]">
                      R
                    </span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black py-3 pl-9 pr-4 outline-none focus:border-[#d4b16f]"
                    />
                  </div>
                </label>

                <label className="block text-sm text-gray-300">
                  Payment Method
                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#d4b16f]"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="eft">EFT</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="debit-order">Debit Order</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="block text-sm text-gray-300">
                  Supplier / Payee
                  <input
                    value={supplier}
                    onChange={(event) => setSupplier(event.target.value)}
                    placeholder="Optional"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
                  />
                </label>

                <label className="block text-sm text-gray-300">
                  Reference
                  <input
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Invoice, receipt or EFT reference"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
                  />
                </label>

                <label className="block text-sm text-gray-300 md:col-span-2">
                  Notes
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Optional notes"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-600 focus:border-[#d4b16f]"
                  />
                </label>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-white/10 bg-[#111111] p-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                  className="rounded-full border border-white/10 px-6 py-3 font-semibold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveExpense}
                  disabled={saving}
                  className="rounded-full bg-[#d4b16f] px-7 py-3 font-semibold text-black disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
