import AdaptiveImage from "./AdaptiveImage";

interface RoomCardProps {
  image: string;
  name: string;
  price: string;
  features: string[];
  highlight?: string;
}

export default function RoomCard({ image, name, price, features, highlight }: RoomCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1e3a]/80 shadow-[0_35px_80px_-45px_rgba(0,0,0,0.8)] transition hover:-translate-y-1 hover:border-[#d4b16f]/30">
      <div className="relative h-72 w-full overflow-hidden">
        <AdaptiveImage
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-[#f8f2ea]">{name}</p>
            <p className="mt-3 text-2xl font-semibold text-[#d4b16f]">{price}</p>
          </div>
          {highlight ? (
            <span className="rounded-full bg-[#d4b16f]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#f8f2ea]">
              {highlight}
            </span>
          ) : null}
        </div>

        <ul className="space-y-3 text-sm text-[#d9d1c6]">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#d4b16f]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href="https://wa.me/27790582637"
            className="inline-flex items-center justify-center rounded-full bg-[#d4b16f] px-6 py-3 text-sm font-semibold text-[#071421] transition hover:bg-[#c9a95e]"
          >
            Book this room
          </a>
          <p className="text-sm text-[#c5b9ad]">Message or call 079 058 2637 to reserve this room.</p>
        </div>
      </div>
    </article>
  );
}
