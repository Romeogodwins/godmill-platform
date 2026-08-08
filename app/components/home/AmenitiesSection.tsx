const amenities = [
  "Swimming Pool",
  "Free WiFi",
  "Air Conditioning",
  "Secure Parking",
  "Private Bathrooms",
  "Smart TV",
  "Breakfast Available",
  "Daily Housekeeping",
];

export default function AmenitiesSection() {
  return (
    <section
      id="amenities"
      className="bg-[#0d0d0d] py-24"
    >
      <div className="mx-auto max-w-7xl px-8">
        <p className="tracking-[0.3em] uppercase text-[#d4b16f]">
          Amenities
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          Everything You Need
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-4">
          {amenities.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-[#151515] p-8 transition hover:border-[#d4b16f]"
            >
              <div className="mb-4 text-4xl">
                ✓
              </div>

              <h3 className="text-xl font-semibold">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}