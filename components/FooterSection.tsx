export default function FooterSection() {
  return (
    <footer className="bg-[#061025] text-[#c5b9ad]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Contact</p>
            <p className="text-base text-[#f6efe6]">Godmill City Guesthouse</p>
            <p>No. 217 Khibitswane</p>
            <p>Taung, Cokonyane Road</p>
            <p>Near Boemma Waters</p>
            <p className="mt-4">079 058 2637</p>
            <p>061 413 7405</p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Rooms</p>
            <ul className="mt-4 space-y-3 text-sm text-[#d9d1c6]">
              <li>
                <a href="#rooms" className="transition hover:text-[#d4b16f]">
                  Executive Room
                </a>
              </li>
              <li>
                <a href="#rooms" className="transition hover:text-[#d4b16f]">
                  Standard Double Room (AC)
                </a>
              </li>
              <li>
                <a href="#rooms" className="transition hover:text-[#d4b16f]">
                  Standard Double Room (Non-AC)
                </a>
              </li>
              <li>
                <a href="#rooms" className="transition hover:text-[#d4b16f]">
                  Family 3-Sleeper Room
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Facilities</p>
            <ul className="mt-4 space-y-3 text-sm text-[#d9d1c6]">
              <li>Swimming pool</li>
              <li>Free Wi-Fi</li>
              <li>Secure parking</li>
              <li>Conference facilities</li>
              <li>Laundry service</li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Booking</p>
            <a
              href="https://wa.me/27790582637"
              className="block rounded-[1.5rem] bg-[#d4b16f] px-6 py-4 text-center text-sm font-semibold text-[#071421] transition hover:bg-[#c9a95e]"
            >
              WhatsApp booking
            </a>
            <a
              href="tel:0790582637"
              className="block rounded-[1.5rem] border border-[#d4b16f]/30 bg-[#0f2948] px-6 py-4 text-center text-sm font-semibold text-[#f6efe6] transition hover:border-[#d4b16f] hover:bg-[#132f5d]"
            >
              Call 079 058 2637
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=No.+217+Khibitswane+Taung+Cokonyane+Road+near+Boemma+Waters"
              target="_blank"
              rel="noreferrer"
              className="block rounded-[1.5rem] border border-[#d4b16f]/30 bg-[#ffffff0f] px-6 py-4 text-center text-sm font-semibold text-[#f6efe6] transition hover:border-[#d4b16f] hover:bg-[#ffffff16]"
            >
              Get directions
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-[#827a6f]">
          <p>All room rates and amenities are confirmed business information.</p>
          <p>Breakfast optional at R120 per person. All rooms are en-suite, mostly with showers.</p>
        </div>
      </div>
    </footer>
  );
}
