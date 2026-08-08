import Image from "next/image";

const rooms = [
  {
    title: "Executive Room",
    image: "/Room 1.jpeg",
    price: "From R750 / night",
    description:
      "Luxury executive room with premium comfort and modern amenities.",
  },
  {
    title: "Standard Room",
    image: "/Room 2.jpeg",
    price: "From R500 / night",
    description:
      "Comfortable room ideal for business and leisure travellers.",
  },
  {
    title: "Family Room",
    image: "/Room 3.jpeg",
    price: "From R850 / night",
    description:
      "Spacious family accommodation with everything you need.",
  },
];

export default function RoomsSection() {
  return (
    <section
      id="rooms"
      className="bg-[#080808] py-24"
    >
      <div className="mx-auto max-w-7xl px-8">
        <p className="tracking-[0.3em] text-[#d4b16f] uppercase">
          Our Rooms
        </p>

        <h2 className="mt-3 text-5xl font-bold text-white">
          Luxury Accommodation
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.title}
              className="overflow-hidden rounded-3xl bg-[#121212]"
            >
              <div className="relative h-72">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-semibold text-white">
                  {room.title}
                </h3>

                <p className="mt-2 text-[#d4b16f]">
                  {room.price}
                </p>

                <p className="mt-5 text-gray-400">
                  {room.description}
                </p>

                <button className="mt-8 rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black hover:scale-105 transition">
                  Book this Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}