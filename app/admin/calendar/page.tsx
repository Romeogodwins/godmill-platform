import AdminShell from "../../components/admin/AdminShell";
import { calendarDays } from "../../components/admin/mockData";

const statusClasses = {
  Available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Booked: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  Cleaning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Maintenance: "border-rose-500/30 bg-rose-500/10 text-rose-300",
} as const;

export default function AdminCalendarPage() {
  return (
    <AdminShell title="Calendar" subtitle="Monthly availability overview">
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Monthly availability</h2>
          <p className="mt-1 text-sm text-gray-400">Mock room scheduling view for the current month</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {calendarDays.map((day) => (
            <div key={day.day} className={`rounded-2xl border p-4 ${statusClasses[day.status]}`}>
              <div className="text-xs font-semibold uppercase tracking-[0.25em]">Day {day.day}</div>
              <div className="mt-3 text-lg font-semibold">{day.status}</div>
              <div className="mt-1 text-sm opacity-80">{day.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
