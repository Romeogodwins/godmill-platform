import AdaptiveImage from "@/components/AdaptiveImage";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppBooking from "@/components/WhatsAppBooking";

const rooms = [
  {
    image: "/images/executive-room.jpg",
    name: "Executive Room",
    price: "R750 per night",
    features: ["Sleeps 2", "Air-conditioned", "Only one available", "En-suite bathroom"],
    highlight: "Best value",
  },
  {
    image: "/images/standard-room.jpg",
    name: "Standard Double Room",
    price: "R600 per night",
    features: ["Air-conditioned", "En-suite bathroom", "Comfortable queen bed"],
  },
  {
    image: "/images/standard-room.jpg",
    name: "Standard Double Room",
    price: "R500 per night",
    features: ["Non-air-conditioned", "En-suite bathroom", "Spacious layout"],
  },
  {
    image: "/images/family-room.jpg",
    name: "Family 3-Sleeper Room",
    price: "R850 per night",
    features: ["Air-conditioned", "Sleeps 3", "En-suite bathroom"],
  },
  {
    image: "/images/family-room.jpg",
    name: "Family 3-Sleeper Room",
    price: "R750 per night",
    features: ["Non-air-conditioned", "Sleeps 3", "En-suite bathroom"],
  },
];

const facilities = [
  "Heated swimming pool with lounge area",
  "Secure parking and 24/7 reception",
  "Complimentary WiFi in every room",
  "Premium linen and private showers",
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
              title="Relax beside the private pool."
              description="Enjoy the golden sun terrace, comfortable loungers and a refreshing pool set against the guesthouse's elegant navy backdrop."
            />
            <p className="max-w-xl text-base leading-8 text-[#d9d1c6]">
              Our pool area is designed for relaxed afternoons and family time. Towels are provided, and the setting is perfect for unwinding after a day exploring the city.
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
          title="Designed for effortless comfort."
          description="From secure parking to fast WiFi, every detail has been curated to make your stay seamless and memorable."
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
                title="Optional breakfast, served fresh daily."
                description="Start your day with a delicious breakfast at only R120 per person. Enjoy warm coffee, fresh fruit and a choice of breakfast favourites."
              />
            </div>
            <div className="rounded-[2rem] border border-[#d4b16f]/15 bg-[#0b1e3a]/90 p-10 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]">
              <div className="space-y-4 text-[#d9d1c6]">
                <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Add-on</p>
                <p className="text-4xl font-semibold text-[#f8f2ea]">R120 per person</p>
                <p className="text-base leading-8">
                  Breakfast is optional and available each morning. Choose a relaxed continental or hot plated breakfast to complement your stay.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[#d9d1c6]">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#d4b16f]" />
                    Fresh pastries, fruit and eggs
                  </li>
                  <li className="flex items-center gap-3 text-[#d9d1c6]">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#d4b16f]" />
                    Premium coffee and tea selections
                  </li>
                  <li className="flex items-center gap-3 text-[#d9d1c6]">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#d4b16f]" />
                    Served until 10:30 am daily
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Gallery"
          title="A glimpse inside your stay."
          description="See the elegant rooms, soothing pool and premium finishes that make Godmill City Guesthouse a standout destination."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((item) => (
            <div key={item.src} className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1e3a]/80">
              <AdaptiveImage src={item.src} alt={item.alt} className="h-64 w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-[#091b32] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 xl:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Contact</p>
              <h2 className="text-3xl font-semibold tracking-tight text-[#f8f2ea] sm:text-4xl">
                Ready to plan your stay?
              </h2>
              <p className="max-w-xl text-base leading-8 text-[#d9d1c6]">
                Reach out with questions, room requests or custom booking arrangements. We are here to make your visit exceptional.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <a href="tel:0790582637" className="rounded-3xl bg-[#0f2948] px-6 py-5 text-base font-semibold text-[#f6efe6] transition hover:bg-[#132f5d]">
                  079 058 2637
                </a>
                <a href="tel:0614137405" className="rounded-3xl bg-[#0f2948] px-6 py-5 text-base font-semibold text-[#f6efe6] transition hover:bg-[#132f5d]">
                  061 413 7405
                </a>
              </div>
            </div>
            <div className="rounded-[2rem] border border-[#d4b16f]/15 bg-[#0b1e3a]/90 p-10 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]">
              <p className="text-sm uppercase tracking-[0.35em] text-[#d4b16f]">Location</p>
              <p className="mt-4 text-base leading-8 text-[#d9d1c6]">
                Godmill City Guesthouse offers a central location with easy access to local attractions, dining and transport links.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
        <WhatsAppBooking />
      </div>

      <footer className="border-t border-white/10 bg-[#061025] py-8 text-[#9c958b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>Godmill City Guesthouse - Premium city hospitality</p>
          <p>079 058 2637 · 061 413 7405</p>
        </div>
      </footer>
    </main>
  );
}
