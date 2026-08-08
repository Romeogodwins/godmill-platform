export default function StatsSection() {
  const stats = [
    { value: "12+", label: "Luxury Rooms" },
    { value: "500+", label: "Happy Guests" },
    { value: "24/7", label: "Reception" },
    { value: "★★★★★", label: "Guest Rating" },
  ];

  return (
    <section className="bg-gradient-to-b from-[#080808] to-[#111111] py-20">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#d4b16f]/20 bg-[#151515] p-10 text-center transition hover:scale-105 hover:border-[#d4b16f]"
            >
              <h2 className="text-5xl font-bold text-[#d4b16f]">
                {stat.value}
              </h2>

              <p className="mt-4 text-gray-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}