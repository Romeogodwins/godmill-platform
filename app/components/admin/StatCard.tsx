interface StatCardProps {
  title: string;
  value: string;
  hint: string;
}

export default function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#111111] to-[#181818] p-5 shadow-lg shadow-black/10">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-[#d4b16f]">{hint}</p>
    </div>
  );
}
