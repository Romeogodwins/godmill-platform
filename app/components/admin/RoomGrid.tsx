import type { RoomItem } from "./mockData";

interface RoomGridProps {
  rooms: RoomItem[];
}

export default function RoomGrid({ rooms }: RoomGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => (
        <article key={room.id} className="rounded-[1.5rem] border border-white/10 bg-[#111111] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d4b16f]">Room {room.roomNumber}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{room.roomType}</h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-200">{room.price}</span>
          </div>

          <div className="mt-6 space-y-3 text-sm text-gray-300">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="font-semibold text-white">{room.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cleaning</span>
              <span className="font-semibold text-white">{room.cleaningStatus}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
