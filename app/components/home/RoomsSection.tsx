import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    title: "Executive Room",
    image: "/Room 1.jpeg",
    price: "From R750 / night",
    features: [
      "Free WiFi",
      "Smart TV",
      "Air Conditioning",
      "Private Bathroom",
    ],
  },
  {
    title: "Standard Room",
    image: "/Room 2.jpeg",
    price: "From R500 / night",
    features: [
      "Free WiFi",
      "Comfortable Bed",
      "Private Bathroom",
      "Work Desk",
    ],
  },
  {
    title: "Family Room",
    image: "/Room 3.jpeg",
    price: "From R850 / night",
    features: [
      "3 Sleeper",
      "Free WiFi",
      "Air Conditioning",
      "Private Bathroom",
    ],
  },
];

export default function RoomsSection() {
  return (
    <section id="rooms" className="bg-[#080808] py-24">
      <div className="mx-auto max-w-7xl px-8">
        <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
          Our Rooms
        </p>

        <h2 className="mt-3 text-5xl font-bold text-white">
          Luxury Accommodation
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.title}
              className="overflow-hidden rounded-3xl bg-[#121212] shadow-xl transition duration-300 hover:-translate-y-2"
            >
              <div className="relative h-72">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-semibold text-white">
                  {room.title}
                </h3>

                <p className="mt-2 text-lg font-semibold text-[#d4b16f]">
                  {room.price}
                </p>

                <ul className="mt-6 space-y-2 text-gray-300">
                  {room.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <Link
                  href="/booking"
                  className="mt-8 inline-block rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  Book this Room
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}