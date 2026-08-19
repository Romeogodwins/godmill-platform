const amenities = [
  {
    title: "Swimming Pool",
    description: "Relax and cool down during your stay.",
  },
  {
    title: "Free WiFi",
    description: "Stay connected for work, entertainment and communication.",
  },
  {
    title: "Air Conditioning",
    description: "Air-conditioned room options are available.",
  },
  {
    title: "Secure Parking",
    description: "Convenient parking available for our guests.",
  },
  {
    title: "Private Bathrooms",
    description: "Enjoy the privacy and convenience of ensuite facilities.",
  },
  {
    title: "Smart TV",
    description: "Relax in your room with convenient entertainment.",
  },
  {
    title: "Breakfast Available",
    description: "Optional breakfast can be added to your stay.",
  },
  {
    title: "Daily Housekeeping",
    description: "Clean and comfortable rooms throughout your visit.",
  },
];

export default function AmenitiesSection() {
  return (
    <section
      id="amenities"
      className="bg-[#0d0d0d] py-24"
      aria-labelledby="amenities-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
          Guest Facilities
        </p>

        <h2
          id="amenities-heading"
          className="mt-4 max-w-3xl text-4xl font-bold text-white md:text-5xl"
        >
          Everything You Need for a Comfortable Stay
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
          Godmill City Guesthouse combines comfortable accommodation with
          practical facilities for business travellers, families and visitors
          staying in Taung.
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-[#151515] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#d4b16f]/70"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4b16f]/10 text-xl text-[#d4b16f]"
                aria-hidden="true"
              >
                ✓
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}