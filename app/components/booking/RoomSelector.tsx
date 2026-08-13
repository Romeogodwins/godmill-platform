"use client";

import { useEffect, useState } from "react";

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  aircon: boolean;
  price: number;
}

interface Props {
  roomType: string;
  value: string;
  onChange: (roomId: string) => void;
}

export default function RoomSelector({
  roomType,
  value,
  onChange,
}: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRooms() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/rooms?roomType=${encodeURIComponent(roomType)}`
        );

        const data = await response.json();

        if (data.success) {
          setRooms(data.rooms);
        }
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, [roomType]);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Select Room
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#121212] p-3"
      >
        <option value="">
          {loading ? "Loading..." : "Choose Room"}
        </option>

        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.room_number} — R{room.price}
          </option>
        ))}
      </select>
    </div>
  );
}