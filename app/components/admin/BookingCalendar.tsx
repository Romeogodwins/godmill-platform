"use client";

interface Booking {
  id: string;
  guest_name: string;
  room_type: string;
  room_number: string;
  check_in: string;
  check_out: string;
  status: string;
}

interface Props {
  bookings: Booking[];
}

export default function BookingCalendar({
  bookings,
}: Props) {
  return (
    <div className="overflow-auto rounded-3xl bg-[#121212] p-8">
      <table className="w-full border-collapse">

        <thead>

          <tr className="border-b border-white/10">

            <th className="p-4 text-left">
              Room
            </th>

            <th className="p-4 text-left">
              Guest
            </th>

            <th className="p-4">
              Check In
            </th>

            <th className="p-4">
              Check Out
            </th>

            <th className="p-4">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {bookings.map((booking) => (

            <tr
              key={booking.id}
              className="border-b border-white/10"
            >

              <td className="p-4 font-semibold">
                {booking.room_number}
              </td>

              <td className="p-4">
                {booking.guest_name}
              </td>

              <td className="p-4">
                {booking.check_in}
              </td>

              <td className="p-4">
                {booking.check_out}
              </td>

              <td className="p-4">

                <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-400">

                  {booking.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
    </div>
  );
}