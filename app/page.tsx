import Navbar from "./components/home/Navbar";
import HeroSection from "./components/home/HeroSection";
import RoomsSection from "./components/home/RoomsSection";
import AmenitiesSection from "./components/home/AmenitiesSection";
import GallerySection from "./components/home/GallerySection";
import StatsSection from "./components/home/StatsSection";
import TestimonialsSection from "./components/home/TestimonialsSection";
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
    </main>
  );
}
