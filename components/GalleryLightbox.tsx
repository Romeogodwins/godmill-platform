"use client";

import { useState } from "react";
import AdaptiveImage from "./AdaptiveImage";

const images = [
  { src: "/images/hero.jpg", alt: "Guesthouse exterior" },
  { src: "/images/pool.jpg", alt: "Swimming pool" },
  { src: "/images/executive-room.jpg", alt: "Executive room" },
  { src: "/images/family-room.jpg", alt: "Family room" },
  { src: "/images/standard-room.jpg", alt: "Standard double room" },
];

export default function GalleryLightbox() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1e3a]/80 transition hover:border-[#d4b16f]/30"
          >
            <AdaptiveImage src={image.src} alt={image.alt} className="h-64 w-full object-cover" />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071421]/90 p-6">
          <div className="relative max-w-5xl w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#081a32]/95 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]">
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-[#071421]/80 px-3 py-2 text-sm text-[#f6efe6] transition hover:bg-[#0f2948]"
            >
              Close
            </button>
            <AdaptiveImage
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className="h-[60vh] w-full object-cover sm:h-[70vh]"
            />
            <div className="p-6 text-[#d9d1c6]">
              <p className="text-lg font-semibold text-[#f8f2ea]">{images[activeIndex].alt}</p>
              <p className="mt-3 text-sm leading-7">
                Click outside the image or use the close button to return to the gallery.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
