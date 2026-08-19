import Image from "next/image";
import Link from "next/link";

const images = [
  {
    src: "/Pool.jpeg",
    alt: "Swimming pool at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Courtyard.jpeg",
    alt: "Courtyard at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Room 3.jpeg",
    alt: "Executive room at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Room 2.jpeg",
    alt: "Standard room at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Room 1.jpeg",
    alt: "Family room at Godmill City Guesthouse in Taung",
  },
  {
    src: "/Bathroom.jpeg",
    alt: "Private bathroom at Godmill City Guesthouse in Taung",
  },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-[#080808] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
              Gallery
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-bold text-white md:text-5xl">
              Discover Godmill City Guesthouse
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
              Explore our rooms, swimming pool, courtyard and guest
              facilities before booking your stay in Taung.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex w-fit rounded-full border border-[#d4b16f]/50 px-6 py-3 font-semibold text-[#d4b16f] transition hover:bg-[#d4b16f] hover:text-black"
          >
            View Full Gallery
          </Link>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <Link
              href="/gallery"
              key={image.src}
              className={`group relative overflow-hidden rounded-3xl ${
                index === 0
                  ? "h-80 sm:col-span-2 lg:col-span-2 lg:h-[420px]"
                  : "h-80"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, 33vw"
                }
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-block rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:bg-[#e3c27d]"
          >
            Explore All Photos
          </Link>
        </div>
      </div>
    </section>
  );
}