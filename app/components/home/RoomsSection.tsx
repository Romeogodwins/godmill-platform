import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    title: "Executive Room",
    image: "/Room 1.jpeg",
    price: "From R750 / night",
    description:
      "Premium accommodation in Taung for business travellers, couples and guests looking for extra comfort.",
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
    description:
      "Affordable and comfortable guesthouse accommodation in Taung, ideal for overnight stays and business travel.",
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
    description:
      "Spacious family accommodation in Taung for up to three guests, with comfort and convenience for your stay.",
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
    <section
      id="rooms"
      className="bg-[#080808] py-24"
      aria-labelledby="rooms-heading"
    >
      <div className="mx-auto max-w-7xl px-8">
        <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
          Rooms & Accommodation
        </p>

        <h2
          id="rooms-heading"
          className="mt-3 text-5xl font-bold text-white"
        >
          Guesthouse Accommodation in Taung
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
          Stay at Godmill City Guesthouse in Taung, North West.
          Choose from Executive, Standard and Family rooms with
          comfortable beds, private bathrooms, free WiFi and secure
          parking. Whether you are travelling for business, visiting
          family or looking for an overnight stay in Taung, we offer
          comfortable accommodation at competitive rates.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {rooms.map((room) => (
            <article
              key={room.title}
              className="overflow-hidden rounded-3xl bg-[#121212] shadow-xl transition duration-300 hover:-translate-y-2"
            >
              <div className="relative h-72">
                <Image
                  src={room.image}
                  alt={`${room.title} at Godmill City Guesthouse in Taung`}
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

                <p className="mt-4 leading-7 text-gray-400">
                  {room.description}
                </p>

                <ul className="mt-6 space-y-2 text-gray-300">
                  {room.features.map((feature) => (
                    <li key={feature}>
                      <span
                        className="mr-2 text-[#d4b16f]"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/booking"
                  aria-label={`Book ${room.title} at Godmill City Guesthouse`}
                  className="mt-8 inline-block rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  Check Availability
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-lg text-gray-300">
            Looking for accommodation in Taung? Check availability
            online and reserve your room directly with Godmill City
            Guesthouse.
          </p>

          <Link
            href="/booking"
            className="mt-6 inline-block rounded-full border border-[#d4b16f] px-8 py-4 font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f] hover:text-black"
          >
            View Availability & Book
          </Link>
        </div>
      </div>
    </section>
  );
}