import AdminShell from "../../components/admin/AdminShell";
import RoomGrid from "../../components/admin/RoomGrid";
import { rooms } from "../../components/admin/mockData";

export default function AdminRoomsPage() {
  return (
    <AdminShell title="Rooms" subtitle="Monitor room availability and housekeeping">
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Room inventory</h2>
          <p className="mt-1 text-sm text-gray-400">All room types and operational status</p>
        </div>
        <RoomGrid rooms={rooms} />
      </div>
    </AdminShell>
  );
}
