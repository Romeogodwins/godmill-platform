export default function WhatsAppBooking() {
  return (
    <section id="booking" className="rounded-[2rem] border border-[#d4b16f]/15 bg-[#091b32]/90 p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">WhatsApp booking</p>
          <h3 className="mt-4 text-3xl font-semibold text-[#f8f2ea] sm:text-4xl">
            Reserve your stay in seconds.
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#d9d1c6]">
            Message us on WhatsApp at any time and we will reply quickly with availability, room options and breakfast add-ons.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="https://wa.me/27790582637"
            className="inline-flex items-center justify-center rounded-full bg-[#d4b16f] px-8 py-4 text-sm font-semibold text-[#071421] transition hover:bg-[#c9a95e]"
          >
            WhatsApp 079 058 2637
          </a>
          <a
            href="tel:0614137405"
            className="inline-flex items-center justify-center rounded-full border border-[#d4b16f]/40 px-8 py-4 text-sm font-semibold text-[#f8f2ea] transition hover:border-[#d4b16f]"
          >
            Call 061 413 7405
          </a>
        </div>
      </div>
    </section>
  );
}
