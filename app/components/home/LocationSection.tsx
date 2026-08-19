export default function LocationSection() {
  return (
    <section
      id="contact"
      className="bg-[#111111] py-24"
    >
      <div className="mx-auto max-w-7xl px-8">

        <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
          Contact Us
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          Visit Godmill City Guesthouse
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-2">

          <div>

            <h3 className="text-2xl font-semibold">
              Contact Information
            </h3>

            <div className="mt-8 space-y-5 text-gray-300">

              <p>
                📍 217 Khibitswane,
                Cokonyane Road,
                Taung
              </p>

              <p>
                📞 079 058 2637
              </p>

              <p>
                ✉ bookings@godmillcityguesthouse.com
              </p>

              <p>
                🏊 Swimming Pool Available
              </p>

              <p>
                🚗 Secure Parking
              </p>

            </div>

          </div>

          <div className="rounded-3xl overflow-hidden">

            <iframe
              src="https://www.google.com/maps?q=Taung&output=embed"
              width="100%"
              height="400"
              loading="lazy"
              style={{ border: 0 }}
            />

          </div>

        </div>

      </div>
    </section>
  );
}
