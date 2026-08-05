interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#d4b16f]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#f8f2ea] sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-[#d9d1c6]">{description}</p>
    </div>
  );
}
