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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": "https://www.godmillcityguesthouse.com/#lodgingbusiness",

  name: "Godmill City Guesthouse",

  url: "https://www.godmillcityguesthouse.com",

  telephone: "+27790582637",

  description:
    "Godmill City Guesthouse provides comfortable and affordable accommodation in Taung, North West, South Africa, including executive, standard and family rooms.",

  address: {
    "@type": "PostalAddress",
    streetAddress: "217 Khibitswane, Cokonyane Road",
    addressLocality: "Taung",
    addressRegion: "North West",
    postalCode: "8584",
    addressCountry: "ZA",
  },

  priceRange: "R500-R850",

  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Free WiFi",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Secure Parking",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Air Conditioning",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Breakfast Available",
      value: true,
    },
  ],

  makesOffer: [
    {
      "@type": "Offer",
      name: "Standard Room without Air Conditioning",
      price: "500",
      priceCurrency: "ZAR",
    },
    {
      "@type": "Offer",
      name: "Standard Room with Air Conditioning",
      price: "600",
      priceCurrency: "ZAR",
    },
    {
      "@type": "Offer",
      name: "Executive Room",
      price: "750",
      priceCurrency: "ZAR",
    },
    {
      "@type": "Offer",
      name: "Family 3 Sleeper without Air Conditioning",
      price: "750",
      priceCurrency: "ZAR",
    },
    {
      "@type": "Offer",
      name: "Family 3 Sleeper with Air Conditioning",
      price: "850",
      priceCurrency: "ZAR",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

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
    </>
  );
}