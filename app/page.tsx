import AdaptiveImage from "@/components/AdaptiveImage";
import FooterSection from "@/components/FooterSection";
import GalleryLightbox from "@/components/GalleryLightbox";
import HeroSection from "@/components/HeroSection";
import LocationSection from "@/components/LocationSection";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import SectionHeading from "@/components/SectionHeading";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhatsAppBooking from "@/components/WhatsAppBooking";

const rooms = [
  {
    image: "/images/executive-room.jpg",
    name: "Executive Room",
    price: "R750 per night",
    features: ["Sleeps 2", "Air-conditioned", "Only one available", "En-suite bathroom"],
    highlight: "Executive",
  },
  {
    image: "/images/standard-room.jpg",
    name: "Standard Double Room (Air-conditioned)",
    price: "R600 per night",
    features: ["Sleeps 2", "Air-conditioned", "En-suite bathroom"],
  },
  {
    image: "/images/standard-room.jpg",
    name: "Standard Double Room (Non-air-conditioned)",
    price: "R500 per night",
    features: ["Sleeps 2", "Non-air-conditioned", "En-suite bathroom"],
  },
  {
    image: "/images/family-room.jpg",
    name: "Family 3-Sleeper Room (Air-conditioned)",
    price: "R850 per night",
    features: ["Sleeps 3", "Air-conditioned", "En-suite bathroom"],
  },
  {
    image: "/images/family-room.jpg",
    name: "Family 3-Sleeper Room (Non-air-conditioned)",
    price: "R750 per night",
    features: ["Sleeps 3", "Non-air-conditioned", "En-suite bathroom"],
  },
];

const facilities = [
  "Swimming pool",
  "Free Wi-Fi",
  "Secure parking",
  "Conference facilities",
  "Laundry service",
];

const galleryImages = [
  { src: "/images/hero.jpg", alt: "Guesthouse exterior" },
  { src: "/images/pool.jpg", alt: "Swimming pool" },
  { src: "/images/executive-room.jpg", alt: "Executive room interior" },
  { src: "/images/family-room.jpg", alt: "Family room interior" },
];

export default function Home() {
  return (
    <main className="bg-[#071421] text-[#f6efe6]">
      <Navbar />
      <HeroSection />

      <section id="rooms" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Rooms"
          title="Comfortable stays for every guest."
          description="Choose from executive, standard and family rooms with en-suite bathrooms and thoughtful amenities for a premium city experience."
        />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={`${room.name}-${room.price}`} {...room} />
          ))}
        </div>
      </section>

      <section id="pool" className="bg-[#091b32] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 xl:px-10">
          <div>
            <SectionHeading
              eyebrow="Swimming Pool"
              title="Relax beside the pool."
              description="Enjoy a soothing pool area and elegant surroundings designed for a calm guesthouse stay."
            />
            <p className="max-w-xl text-base leading-8 text-[#d9d1c6]">
              Our swimming pool is available for guest use, offering a peaceful place to relax after a day of travel.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1e3a]/80 shadow-[0_35px_80px_-45px_rgba(0,0,0,0.8)]">
            <AdaptiveImage src="/images/pool.jpg" alt="Guesthouse swimming pool" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section id="facilities" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Facilities"
          title="Guesthouse amenities you can rely on."
          description="Swimming pool, free Wi-Fi, secure parking, conference facilities and laundry service are available for a comfortable stay."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((item) => (
            <div key={item} className="rounded-[2rem] border border-white/10 bg-[#0b1e3a]/80 p-8 text-[#d9d1c6] shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Facility</p>
              <p className="text-base leading-7">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="breakfast" className="bg-[#091b32] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 xl:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Breakfast"
                title="Optional breakfast at R120 per person."
                description="Add breakfast to your stay for R120 per person. The guesthouse offers a simple, optional morning meal service."
              />
            </div>
            <div className="rounded-[2rem] border border-[#d4b16f]/15 bg-[#0b1e3a]/90 p-10 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]">
              <div className="space-y-4 text-[#d9d1c6]">
                <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Add-on</p>
                <p className="text-4xl font-semibold text-[#f8f2ea]">R120 per person</p>
                <p className="text-base leading-8">
                  Breakfast is optional and available for guests who would like a simple meal to start the day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Gallery"
          title="A glimpse inside your stay."
          description="Explore the guesthouse and room images. Tap any image to enlarge the view."
        />
        <div className="space-y-6">
          <GalleryLightbox />
        </div>
      </section>

      <LocationSection />

      <TestimonialsSection />

      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
        <WhatsAppBooking />
      </div>

      <FooterSection />
    </main>
  );
}
