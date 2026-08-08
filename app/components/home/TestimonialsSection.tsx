export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Business Traveller",
      text: "Excellent service, very clean rooms and fast WiFi.",
    },
    {
      name: "Family Guest",
      text: "The swimming pool and family room were perfect.",
    },
    {
      name: "Couple",
      text: "Beautiful place with secure parking and friendly staff.",
    },
  ];

  return (
    <section className="bg-[#080808] py-24">
      <div className="mx-auto max-w-7xl px-8">
        <p className="tracking-[0.3em] uppercase text-[#d4b16f]">
          Guest Reviews
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          What Our Guests Say
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-3xl bg-[#151515] p-8"
            >
              <div className="mb-4 text-[#d4b16f]">
                ★★★★★
              </div>

              <p className="text-gray-300">
                "{review.text}"
              </p>

              <h4 className="mt-6 font-semibold">
                {review.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}