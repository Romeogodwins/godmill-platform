import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.godmillcityguesthouse.com"),

  title: {
    default: "Godmill City Guesthouse | Accommodation in Taung",
    template: "%s | Godmill City Guesthouse",
  },

  description:
    "Book comfortable and affordable accommodation at Godmill City Guesthouse in Taung, North West, South Africa. Enjoy air-conditioned rooms, family rooms, free WiFi, secure parking and convenient online booking.",

  keywords: [
    "guesthouse in Taung",
    "guest house in Taung",
    "accommodation in Taung",
    "Taung accommodation",
    "B&B in Taung",
    "bed and breakfast Taung",
    "rooms in Taung",
    "places to stay in Taung",
    "family accommodation Taung",
    "Godmill City Guesthouse",
  ],

  authors: [
    {
      name: "Godmill City Guesthouse",
    },
  ],

  creator: "Godmill City Guesthouse",
  publisher: "Godmill City Guesthouse",

  alternates: {
    canonical: "https://www.godmillcityguesthouse.com",
  },

  openGraph: {
    title: "Godmill City Guesthouse | Accommodation in Taung",
    description:
      "Comfortable and affordable accommodation in Taung with air-conditioned rooms, family rooms, free WiFi and secure parking.",
    url: "https://www.godmillcityguesthouse.com",
    siteName: "Godmill City Guesthouse",
    locale: "en_ZA",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Godmill City Guesthouse | Accommodation in Taung",
    description:
      "Comfortable and affordable accommodation in Taung, North West, South Africa.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-ZA"
      className="h-full"
      data-scroll-behavior="smooth"
    >
      <body
        className="min-h-screen bg-[#080808] text-white antialiased"
        style={{
          fontFamily:
            'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}