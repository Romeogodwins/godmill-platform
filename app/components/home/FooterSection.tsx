import Link from "next/link";

const accommodationLinks = [
  {
    name: "Accommodation in Taung",
    href: "/accommodation-taung",
  },
  {
    name: "Guesthouse in Taung",
    href: "/guesthouse-taung",
  },
  {
    name: "Affordable Accommodation",
    href: "/affordable-accommodation-taung",
  },
  {
    name: "Family Accommodation",
    href: "/family-accommodation-taung",
  },
  {
    name: "Business Accommodation",
    href: "/business-accommodation-taung",
  },
  {
    name: "Rooms in Taung",
    href: "/rooms-taung",
  },
];

export default function FooterSection() {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-black"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold text-[#d4b16f]">
              Godmill City Guesthouse
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Comfortable accommodation in Taung, North West, with
              executive, standard and family rooms for business travellers,
              couples, families and visitors.
            </p>

            <p className="mt-5 leading-7 text-gray-300">
              217 Khibitswane
              <br />
              Cokonyane Road
              <br />
              Taung, North West
              <br />
              South Africa
            </p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-white">
              Taung Accommodation
            </h3>

            <nav className="mt-5 flex flex-col gap-3 text-gray-400">
              {accommodationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-[#d4b16f]"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-white">
              Explore Godmill
            </h3>

            <nav className="mt-5 flex flex-col gap-3 text-gray-400">
              <Link
                href="/"
                className="transition hover:text-[#d4b16f]"
              >
                Home
              </Link>

              <Link
                href="/#rooms"
                className="transition hover:text-[#d4b16f]"
              >
                Rooms & Rates
              </Link>

              <Link
                href="/gallery"
                className="transition hover:text-[#d4b16f]"
              >
                Photo Gallery
              </Link>

              <Link
                href="/#amenities"
                className="transition hover:text-[#d4b16f]"
              >
                Guest Facilities
              </Link>

              <Link
                href="/booking"
                className="transition hover:text-[#d4b16f]"
              >
                Check Availability
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-white">
              Book Direct
            </h3>

            <p className="mt-5 leading-7 text-gray-400">
              Check room availability and make your reservation directly
              with Godmill City Guesthouse.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="tel:+27790582637"
                className="text-gray-300 transition hover:text-[#d4b16f]"
              >
                079 058 2637
              </a>

              <a
                href="https://wa.me/27790582637"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 transition hover:text-[#d4b16f]"
              >
                WhatsApp Godmill
              </a>

              <Link
                href="/booking"
                className="mt-3 inline-flex w-fit rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:bg-[#e3c27d]"
              >
                Book Accommodation
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 Godmill City Guesthouse. All Rights Reserved.
            </p>

            <p>
              Guesthouse & Accommodation in Taung, North West
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}