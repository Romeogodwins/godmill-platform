import AdminShell from "../../components/admin/AdminShell";
import BookingTable from "../../components/admin/BookingTable";
import { bookings } from "../../components/admin/mockData";

export default function AdminBookingsPage() {
  return (
    <AdminShell title="Bookings" subtitle="Manage reservations and guest stays">
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">All bookings</h2>
            <p className="mt-1 text-sm text-gray-400">Mock booking records for admin review</p>
          </div>
        </div>
        <BookingTable bookings={bookings} />
      </div>
    </AdminShell>
  );
}
