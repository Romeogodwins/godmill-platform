import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";

export const metadata: Metadata = {
  title: "Photo Gallery | Godmill City Guesthouse Taung",
  description:
    "Explore photos of Godmill City Guesthouse in Taung, including our rooms, swimming pool, courtyard, bathrooms and guest facilities.",
  alternates: {
    canonical: "https://www.godmillcityguesthouse.com/gallery",
  },
  openGraph: {
    title: "Godmill City Guesthouse Photo Gallery",
    description:
      "View rooms and facilities at Godmill City Guesthouse in Taung, North West.",
    url: "https://www.godmillcityguesthouse.com/gallery",
    siteName: "Godmill City Guesthouse",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

interface GalleryImage {
  id: string;
  public_url: string;
  title: string;
  caption: string | null;
  alt_text: string;
  category: string;
  is_featured: boolean;
  is_cover: boolean;
  sort_order: number;
  created_at?: string;
}

const fallbackImages: GalleryImage[] = [
  {
    id: "fallback-executive",
    public_url: "/Room 3.jpeg",
    title: "Executive Room",
    caption: null,
    alt_text: "Executive room at Godmill City Guesthouse in Taung",
    category: "executive",
    is_featured: false,
    is_cover: false,
    sort_order: 101,
  },
  {
    id: "fallback-standard",
    public_url: "/Room 2.jpeg",
    title: "Standard Room",
    caption: null,
    alt_text: "Standard room at Godmill City Guesthouse in Taung",
    category: "standard-aircon",
    is_featured: false,
    is_cover: false,
    sort_order: 102,
  },
  {
    id: "fallback-family",
    public_url: "/Room 1.jpeg",
    title: "Family Room",
    caption: null,
    alt_text:
      "Family three-sleeper room at Godmill City Guesthouse in Taung",
    category: "family-aircon",
    is_featured: false,
    is_cover: false,
    sort_order: 103,
  },
  {
    id: "fallback-room-5",
    public_url: "/Room 5.jpeg",
    title: "Guest Room",
    caption: null,
    alt_text: "Guest room at Godmill City Guesthouse in Taung",
    category: "general",
    is_featured: false,
    is_cover: false,
    sort_order: 104,
  },
  {
    id: "fallback-room-6",
    public_url: "/Room 6.jpeg",
    title: "Guest Room",
    caption: null,
    alt_text: "Comfortable guest room at Godmill City Guesthouse in Taung",
    category: "general",
    is_featured: false,
    is_cover: false,
    sort_order: 105,
  },
  {
    id: "fallback-room-10",
    public_url: "/Room 10.jpeg",
    title: "Guest Room",
    caption: null,
    alt_text: "Room interior at Godmill City Guesthouse in Taung",
    category: "general",
    is_featured: false,
    is_cover: false,
    sort_order: 106,
  },
  {
    id: "fallback-pool",
    public_url: "/Pool.jpeg",
    title: "Swimming Pool",
    caption: null,
    alt_text: "Swimming pool at Godmill City Guesthouse in Taung",
    category: "pool",
    is_featured: false,
    is_cover: false,
    sort_order: 107,
  },
  {
    id: "fallback-courtyard",
    public_url: "/Courtyard.jpeg",
    title: "Courtyard",
    caption: null,
    alt_text: "Courtyard at Godmill City Guesthouse in Taung",
    category: "courtyard",
    is_featured: false,
    is_cover: false,
    sort_order: 108,
  },
  {
    id: "fallback-bathroom",
    public_url: "/Bathroom.jpeg",
    title: "Private Bathroom",
    caption: null,
    alt_text: "Private bathroom at Godmill City Guesthouse in Taung",
    category: "bathroom",
    is_featured: false,
    is_cover: false,
    sort_order: 109,
  },
  {
    id: "fallback-dining",
    public_url: "/Dinning.jpeg",
    title: "Dining Area",
    caption: null,
    alt_text: "Dining area at Godmill City Guesthouse in Taung",
    category: "general",
    is_featured: false,
    is_cover: false,
    sort_order: 110,
  },
];

const categoryLabels: Record<string, string> = {
  general: "General",
  executive: "Executive Room",
  "standard-aircon": "Standard Room - Aircon",
  "standard-non-aircon": "Standard Room - Non-Aircon",
  "family-aircon": "Family Room - Aircon",
  "family-non-aircon": "Family Room - Non-Aircon",
  pool: "Swimming Pool",
  bathroom: "Bathrooms",
  exterior: "Exterior",
  courtyard: "Courtyard",
};

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("gallery_images")
      .select(`
        id,
        public_url,
        title,
        caption,
        alt_text,
        category,
        is_featured,
        is_cover,
        sort_order,
        created_at
      `)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GALLERY PAGE DATABASE ERROR:", error);
      return fallbackImages;
    }

    const uploadedImages = (data ?? []) as GalleryImage[];

    if (uploadedImages.length === 0) {
      return fallbackImages;
    }

    /*
     * Keep the existing local photographs visible while the managed
     * gallery is still being populated.
     *
     * Uploaded photographs always appear first.
     */
    return [...uploadedImages, ...fallbackImages];
  } catch (error) {
    console.error("GALLERY PAGE ERROR:", error);
    return fallbackImages;
  }
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages();

  /*
   * A photograph marked as COVER becomes the first large photograph.
   */
  const coverImage = galleryImages.find(
    (image) => image.is_cover
  );

  const orderedImages = coverImage
    ? [
        coverImage,
        ...galleryImages.filter(
          (image) => image.id !== coverImage.id
        ),
      ]
    : galleryImages;

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* HERO */}
      <section className="border-b border-white/10 px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-[#d4b16f]"
          >
            ← Back to Godmill City Guesthouse
          </Link>

          <p className="mt-12 uppercase tracking-[0.3em] text-[#d4b16f]">
            Photo Gallery
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Experience Godmill Before You Arrive
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-8 text-gray-300">
            Take a closer look at our rooms, swimming pool, courtyard,
            bathrooms and guest facilities at Godmill City Guesthouse in
            Taung, North West.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-8 py-4 font-semibold text-black transition hover:bg-[#e3c27d]"
            >
              Check Availability
            </Link>

            <Link
              href="/accommodation-taung"
              className="rounded-full border border-white/30 px-8 py-4 font-semibold transition hover:bg-white hover:text-black"
            >
              View Accommodation
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
              Explore Godmill
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Rooms & Facilities
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
              Browse our accommodation and facilities before choosing your
              room and making a direct reservation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orderedImages.map((image, index) => (
              <figure
                key={image.id}
                className={`group overflow-hidden rounded-3xl border border-white/10 bg-[#111] ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0 ? "h-[420px]" : "h-80"
                  }`}
                >
                  <Image
                    src={image.public_url}
                    alt={
                      image.alt_text ||
                      image.title ||
                      "Godmill City Guesthouse"
                    }
                    fill
                    unoptimized
                    sizes={
                      index === 0
                        ? "(max-width: 1024px) 100vw, 66vw"
                        : "(max-width: 768px) 100vw, 33vw"
                    }
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  {image.is_cover && (
                    <div className="absolute left-4 top-4 rounded-full bg-[#d4b16f] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                      Featured
                    </div>
                  )}
                </div>

                <figcaption className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b16f]">
                    {categoryLabels[image.category] ??
                      image.category}
                  </p>

                  <p className="mt-2 text-lg font-semibold text-white">
                    {image.title}
                  </p>

                  {image.caption && (
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {image.caption}
                    </p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION / TRUST */}
      <section className="border-y border-white/10 bg-[#111] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
              Stay in Taung
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Comfortable Accommodation in Taung
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              Godmill City Guesthouse offers executive, standard and family
              accommodation for business travellers, couples, families and
              visitors to Taung.
            </p>

            <Link
              href="/accommodation-taung"
              className="mt-7 inline-block font-semibold text-[#d4b16f]"
            >
              Explore our Taung accommodation →
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#080808] p-8">
            <h3 className="text-2xl font-semibold">
              Guest Facilities
            </h3>

            <div className="mt-6 grid gap-4 text-gray-300 sm:grid-cols-2">
              <p>✓ Free WiFi</p>
              <p>✓ Secure parking</p>
              <p>✓ Swimming pool</p>
              <p>✓ Private bathrooms</p>
              <p>✓ Air-conditioned options</p>
              <p>✓ Family rooms</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="uppercase tracking-[0.3em] text-[#d4b16f]">
            Ready to Stay?
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Book Your Stay at Godmill City Guesthouse
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Choose your dates and check available rooms directly through
            our online booking system.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#d4b16f] px-10 py-4 font-semibold text-black transition hover:bg-[#e3c27d]"
            >
              Check Availability
            </Link>

            <a
              href="tel:+27790582637"
              className="rounded-full border border-white/30 px-10 py-4 font-semibold transition hover:bg-white hover:text-black"
            >
              Call 079 058 2637
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}