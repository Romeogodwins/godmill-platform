import Link from "next/link";

export default function FooterSection() {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-black"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#d4b16f]">
              Godmill City Guesthouse
            </h2>

            <p className="mt-5 max-w-md leading-7 text-gray-400">
              Comfortable accommodation in Taung, North West, offering
              executive, standard and family rooms for business travellers,
              couples, families and visitors.
            </p>

            <p className="mt-5 text-gray-300">
              217 Khibitswane, Cokonyane Road
              <br />
              Taung, North West, South Africa
            </p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>

            <nav className="mt-5 flex flex-col gap-3 text-gray-400">
              <Link href="/" className="hover:text-[#d4b16f]">
                Home
              </Link>

              <Link
                href="/accommodation-taung"
                className="hover:text-[#d4b16f]"
              >
                Accommodation in Taung
              </Link>

              <Link href="/#rooms" className="hover:text-[#d4b16f]">
                Rooms & Rates
              </Link>

              <Link href="/gallery" className="hover:text-[#d4b16f]">
                Photo Gallery
              </Link>

              <Link href="/booking" className="hover:text-[#d4b16f]">
                Book Accommodation
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-gray-400">
              <a
                href="tel:+27790582637"
                className="hover:text-[#d4b16f]"
              >
                079 058 2637
              </a>

              <a
                href="https://wa.me/27790582637"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#d4b16f]"
              >
                WhatsApp Us
              </a>

              <Link
                href="/booking"
                className="mt-3 inline-flex w-fit rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:bg-[#e3c27d]"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Godmill City Guesthouse. All Rights Reserved.</p>

          <p>Accommodation in Taung, North West</p>
        </div>
      </div>
    </footer>
  );
}