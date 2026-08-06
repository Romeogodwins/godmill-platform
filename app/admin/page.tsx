import AdminShell from "../components/admin/AdminShell";
import StatCard from "../components/admin/StatCard";
import BookingTable from "../components/admin/BookingTable";
import { bookings } from "../components/admin/mockData";

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard" subtitle="Operations overview for today">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Today's Bookings" value="5" hint="New and confirmed arrivals" />
        <StatCard title="Today's Check-ins" value="2" hint="Arriving today" />
        <StatCard title="Today's Check-outs" value="1" hint="Departures scheduled" />
        <StatCard title="Occupied Rooms" value="3" hint="Currently in use" />
        <StatCard title="Available Rooms" value="2" hint="Ready for arrival" />
        <StatCard title="Monthly Revenue" value="R24,000" hint="Placeholder forecast" />
        <StatCard title="Breakfast Orders" value="6" hint="Breakfast service requests" />
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent bookings</h2>
            <p className="mt-1 text-sm text-gray-400">Latest activity at the guesthouse</p>
          </div>
        </div>
        <BookingTable bookings={bookings.slice(0, 4)} />
      </div>
    </AdminShell>
  );
}
