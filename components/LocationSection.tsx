import SectionHeading from "./SectionHeading";
import { MapIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

const mapLink = "https://www.google.com/maps/search/?api=1&query=No.+217+Khibitswane+Taung+Cokonyane+Road+near+Boemma+Waters";

export default function LocationSection() {
  return (
    <section id="location" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <SectionHeading
        eyebrow="Location"
        title="Stay close to Boemma Waters in Taung."
        description="No. 217 Khibitswane, Taung, Cokonyane Road near Boemma Waters. Contact us directly for easy booking and directions."
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[#0b1e3a]/80 p-10 text-[#d9d1c6] shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Guesthouse address</p>
          <p className="mt-4 text-lg font-semibold text-[#f8f2ea]">No. 217 Khibitswane</p>
          <p className="mt-1 text-lg font-semibold text-[#f8f2ea]">Taung, Cokonyane Road</p>
          <p className="mt-1 text-lg font-semibold text-[#f8f2ea]">Near Boemma Waters</p>
          <div className="mt-8 space-y-4 text-base leading-8 text-[#d9d1c6]">
            <p>Enjoy a relaxed stay with easy arrival access from Taung and nearby landmarks.</p>
            <p>Book with WhatsApp, call directly, or open directions to find us quickly.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href="https://wa.me/27790582637"
            className="flex items-center justify-center gap-3 rounded-[1.5rem] bg-[#d4b16f] px-6 py-5 text-center text-sm font-semibold text-[#071421] transition hover:bg-[#c9a95e]"
          >
            <WhatsAppIcon />
            WhatsApp 079 058 2637
          </a>
          <a
            href="tel:0790582637"
            className="flex items-center justify-center gap-3 rounded-[1.5rem] border border-[#d4b16f]/30 bg-[#0f2948] px-6 py-5 text-center text-sm font-semibold text-[#f6efe6] transition hover:border-[#d4b16f] hover:bg-[#132f5d]"
          >
            <PhoneIcon />
            Call 079 058 2637
          </a>
          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 rounded-[1.5rem] border border-[#d4b16f]/30 bg-[#ffffff0f] px-6 py-5 text-center text-sm font-semibold text-[#f6efe6] transition hover:border-[#d4b16f] hover:bg-[#ffffff16]"
          >
            <MapIcon />
            View directions
          </a>
        </div>
      </div>
    </section>
  );
}
