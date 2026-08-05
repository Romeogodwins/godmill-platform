const reviews = [
  {
    name: "Jane D.",
    role: "Leisure guest",
    quote: "Sample review: The rooms are calm and well presented, with attentive help from the team.",
  },
  {
    name: "Thabo M.",
    role: "Business traveller",
    quote: "Sample review: The guesthouse offered a peaceful stay close to local amenities.",
  },
  {
    name: "Lindiwe N.",
    role: "Family booking",
    quote: "Sample review: Spacious room options and a pleasant swimming pool area for our group.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[#091b32] py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Testimonials</p>
          <h2 className="mt-4 text-3xl font-semibold text-[#f8f2ea] sm:text-4xl">Sample guest feedback</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#d9d1c6]">
            These reviews are sample content until real guest reviews are provided.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-[2rem] border border-white/10 bg-[#0b1e3a]/80 p-8 text-[#d9d1c6] shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]">
              <p className="text-base leading-8">“{review.quote}”</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-[#f8f2ea]">{review.name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-[#d4b16f]">{review.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
