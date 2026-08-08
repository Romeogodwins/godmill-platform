export default function StatsSection() {
  const stats = [
    { value: "12", label: "Luxury Rooms" },
    { value: "24/7", label: "Reception" },
    { value: "100%", label: "Free WiFi" },
    { value: "★★★★★", label: "Guest Rating" },
  ];

  return (
    <section className="bg-[#111111] py-20">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-[#181818] p-10 text-center"
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