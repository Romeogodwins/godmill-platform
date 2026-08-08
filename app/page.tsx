import Navbar from "./components/home/Navbar";
import HeroSection from "./components/home/HeroSection";
import StatsSection from "./components/home/StatsSection";
import RoomsSection from "./components/home/RoomsSection";
import AmenitiesSection from "./components/home/AmenitiesSection";
import GallerySection from "./components/home/GallerySection";
import TestimonialsSection from "./components/home/TestimonialsSection";
import LocationSection from "./components/home/LocationSection";
import FooterSection from "./components/home/FooterSection";
import WhatsAppButton from "./components/layout/WhatsAppButton";
export default function Home() {
  return (
    <main className="bg-[#080808] text-white">
      <Navbar />
      <HeroSection />
      <RoomsSection />
      <AmenitiesSection />
      <GallerySection />
      <StatsSection />
      <TestimonialsSection />
      <LocationSection />
      <FooterSection />
      <WhatsAppButton />
    </main>
  );
}
