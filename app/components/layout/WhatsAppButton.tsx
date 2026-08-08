"use client";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/27790582637"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white shadow-2xl transition hover:scale-110"
    >
      💬
    </a>
  );
}