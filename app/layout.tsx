import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Godmill City Guesthouse",
  description: "Luxury accommodation in Taung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
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