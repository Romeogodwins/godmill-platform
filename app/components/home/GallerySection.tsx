import Image from "next/image";

const images = [
  "/Pool.jpeg",
  "/Courtyard.jpeg",
  "/Bathroom.jpeg",
  "/Dinning.jpeg",
  "/Room 5.jpeg",
  "/Room 6.jpeg",
];

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-[#080808] py-24">
      <div className="mx-auto max-w-7xl px-8">
        <p className="tracking-[0.3em] uppercase text-[#d4b16f]">
          Gallery
        </p>

        <h2 className="mt-4 text-5xl font-bold text-white">
          Discover Godmill City Guesthouse
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {images.map((image) => (
            <div
              key={image}
              className="relative h-72 overflow-hidden rounded-3xl"
            >
              <Image
                src={image}
                alt="Godmill City Guesthouse"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}