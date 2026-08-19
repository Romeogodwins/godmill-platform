import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    title: "Executive Room",
    image: "/Room 3.jpeg",
    price: "R750 / night",
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
    image: "/Room 1.jpeg",
    price: "From R750 / night",
    description:
      "Spacious three-sleeper family accommodation in Taung for families and small groups.",
    features: [
      "3 Sleeper",
      "Free WiFi",
      "Air Conditioning Options",
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
          Rooms & Accommodation
        </p>

        <h2
          id="rooms-heading"
          className="mt-3 max-w-4xl text-4xl font-bold text-white md:text-5xl"
        >
          Guesthouse Accommodation in Taung
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
          Choose from Executive, Standard and Family rooms at Godmill City
          Guesthouse in Taung. Whether you are travelling for business,
          visiting family or looking for an overnight stay, we offer
          comfortable accommodation at competitive rates.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {rooms.map((room) => (
            <article
              key={room.title}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] shadow-xl transition duration-300 hover:-translate-y-2 hover:border-[#d4b16f]/40"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={room.image}
                  alt={`${room.title} at Godmill City Guesthouse in Taung`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
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

                <ul className="mt-6 space-y-3 text-gray-300">
                  {room.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="font-bold text-[#d4b16f]"
                        aria-hidden="true"
                      >
                        &#10003;
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/booking"
                  aria-label={`Check availability for ${room.title}`}
                  className="mt-8 inline-block rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:bg-[#e3c27d]"
                >
                  Check Availability
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-[#111] p-8 text-center md:p-10">
          <h3 className="text-2xl font-semibold text-white">
            Looking for a Room in Taung?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-300">
            Check availability online and reserve your room directly with
            Godmill City Guesthouse.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:bg-[#e3c27d]"
            >
              View Availability & Book
            </Link>

            <Link
              href="/gallery"
              className="rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              View Photo Gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}